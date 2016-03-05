﻿/*  MyNodes.NET 
    Copyright (C) 2016 Derwish <derwish.pro@gmail.com>
    License: http://www.gnu.org/licenses/gpl-3.0.txt  
*/

using System;
using System.Collections;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNet.Hosting.Internal;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using Microsoft.Extensions.Configuration;
using MyNodes.Gateways;
using MyNodes.WebController.ViewModels.Config;
using Newtonsoft.Json;
using Node = MyNodes.Nodes.Node;
using System.Linq;
using MyNodes.Gateways.MySensors;
using MyNodes.Nodes;
using MyNodes.Repositories.Dapper;
using MyNodes.Repositories.EF.SQLite;
using MyNodes.Users;

namespace MyNodes.WebController.Code
{
    public static class SystemController
    {
        //CONFIG
        public static GatewayConfig gatewayConfig;
        public static WebServerRules webServerRules;
        public static WebServerConfig webServerConfig;
        public static DataBaseConfig dataBaseConfig;
        public static NodesEngineConfig nodesEngineConfig;
        public static NodeEditorConfig nodeEditorConfig;


        //VARIABLES
        public static IUsersRepository usersDb;

        public static IGatewayConnectionPort gatewayConnectionPort;
        public static Gateway gateway;

        public static IMySensorsRepository mySensorsDb;
        public static IMySensorsMessagesRepository mySensorsMessagesDb;

        public static NodesEngine nodesEngine;
        public static MySensorsNodesEngine mySensorsNodesEngine;
        public static UiNodesEngine uiNodesEngine;
        public static INodesRepository nodesDb;
        public static INodesDataRepository nodesDataDb;

        public static Logs logs = new Logs();

        public static event Action OnStarted;
        public static event Action OnGatewayConnected;
        public static event Action OnGatewayDisconnected;




        private static bool systemControllerStarted;
        private static bool firstRun;


        public static IServiceProvider services;
        public static IConfigurationRoot configuration;

        public static async void Start(IConfigurationRoot configuration, IServiceProvider services)
        {
            SystemController.configuration = configuration;
            SystemController.services = services;

            if (Boolean.Parse(configuration["FirstRun"]))
            {
                if (!firstRun)
                {
                    firstRun = true;
                    Console.ForegroundColor = ConsoleColor.Cyan;
                    Console.WriteLine("\nWelcome to MyNodes.NET. \nPlease configure the system in the web interface.\n");
                    Console.ForegroundColor = ConsoleColor.Gray;
                }

                return;
            }

            if (systemControllerStarted) return;
            systemControllerStarted = true;



            //read settings
            ReadConfig();


            await Task.Run(() =>
            {
                //waiting for starting web server
                Thread.Sleep(500);

                logs.AddSystemInfo("---------------- STARTING ------------------");

                if (nodesDb == null)
                    ConnectToDB();

                if (gateway == null)
                    ConnectToGateway();

                if (nodesEngine == null)
                    StartNodesEngine();

                logs.AddSystemInfo("------------- SARTUP COMPLETE --------------");

                OnStarted?.Invoke();

            });
        }




        public static void ReadConfig()
        {
            try
            {
                gatewayConfig = configuration.Get<GatewayConfig>("Gateway");
                gatewayConfig.SerialGatewayConfig = configuration.Get<SerialGatewayConfig>("Gateway:SerialGateway");
                gatewayConfig.EthernetGatewayConfig = configuration.Get<EthernetGatewayConfig>("Gateway:EthernetGateway");
                logs.config = configuration.Get<LogsConfig>("Logs");
                logs.consoleConfig = configuration.Get<ConsoleConfig>("Console");
                nodesEngineConfig = configuration.Get<NodesEngineConfig>("NodesEngine");
                nodeEditorConfig = configuration.Get<NodeEditorConfig>("NodeEditor");
                dataBaseConfig = configuration.Get<DataBaseConfig>("DataBase");
                webServerRules = configuration.Get<WebServerRules>("WebServer");
                webServerConfig = configuration.Get<WebServerConfig>("WebServer");
            }
            catch
            {
                logs.AddSystemError("ERROR: Bad configuration in appsettings.json file.");
                throw new Exception("Bad configuration in appsettings.json file.");
            }
        }













        public static void ConnectToDB()
        {
            if (!dataBaseConfig.Enable)
            {
                nodesDb = null;
                nodesDataDb = null;
                mySensorsDb = null;
                mySensorsMessagesDb = null;
                usersDb = null;
                return;
            }

            logs.AddSystemInfo("Connecting to database... ");


            //db config
            if (dataBaseConfig.UseInternalDb)
            {
                NodesDbContext nodesDbContext = (NodesDbContext)services.GetService(typeof(NodesDbContext));
                NodesDataDbContext nodesDataDbContext = (NodesDataDbContext)services.GetService(typeof(NodesDataDbContext));
                MySensorsNodesDbContext mySensorsNodesDbContext = (MySensorsNodesDbContext)services.GetService(typeof(MySensorsNodesDbContext));
                MySensorsMessagesDbContext mySensorsMessagesDbContext = (MySensorsMessagesDbContext)services.GetService(typeof(MySensorsMessagesDbContext));
                UsersDbContext usersDbContext = (UsersDbContext)services.GetService(typeof(UsersDbContext));

                nodesDb = new NodesRepositoryEf(nodesDbContext);
                nodesDataDb = new NodesDataRepositoryEf(nodesDataDbContext);
                mySensorsDb = new MySensorsRepositoryEf(mySensorsNodesDbContext);
                mySensorsMessagesDb = new MySensorsMessagesRepositoryEf(mySensorsMessagesDbContext);
                usersDb = new UsersRepositoryEf(usersDbContext);
            }
            else
            {
                if (String.IsNullOrEmpty(dataBaseConfig.ExternalDbConnectionString))
                {
                    logs.AddSystemError("Database connection failed. Set ConnectionString in appsettings.json file.");
                    return;
                }

                nodesDb = new NodesRepositoryDapper(dataBaseConfig.ExternalDbConnectionString);
                nodesDataDb = new NodesDataRepositoryDapper(dataBaseConfig.ExternalDbConnectionString);
                mySensorsDb = new MySensorsRepositoryDapper(dataBaseConfig.ExternalDbConnectionString);
                mySensorsMessagesDb = new MySensorsMessagesRepositoryDapper(dataBaseConfig.ExternalDbConnectionString);
                usersDb = new UsersRepositoryDapper(dataBaseConfig.ExternalDbConnectionString);
            }


            mySensorsDb.SetWriteInterval(dataBaseConfig.WriteInterval);
            mySensorsDb.OnLogInfo += logs.AddDataBaseInfo;
            mySensorsDb.OnLogError += logs.AddDataBaseError;

            mySensorsMessagesDb.SetWriteInterval(dataBaseConfig.WriteInterval);
            mySensorsMessagesDb.OnLogInfo += logs.AddDataBaseInfo;
            mySensorsMessagesDb.OnLogError += logs.AddDataBaseError;

            nodesDb.SetWriteInterval(dataBaseConfig.WriteInterval);
            nodesDb.OnLogInfo += logs.AddDataBaseInfo;
            nodesDb.OnLogError += logs.AddDataBaseError;

            nodesDataDb.SetWriteInterval(dataBaseConfig.WriteInterval);
            nodesDataDb.OnLogInfo += logs.AddDataBaseInfo;
            nodesDataDb.OnLogError += logs.AddDataBaseError;

            logs.AddSystemInfo("Database connected.");
        }







        public static void StartNodesEngine()
        {
            if (Boolean.Parse(configuration["Develop:GenerateNodesJsListFileOnStart"]))
                GenerateNodesJsListFile();

            nodesEngine = new NodesEngine(nodesDb, nodesDataDb);
            nodesEngine.SetUpdateInterval(nodesEngineConfig.UpdateInterval);
            nodesEngine.OnLogEngineInfo += logs.AddNodesEngineInfo;
            nodesEngine.OnLogEngineError += logs.AddNodesEngineError;
            nodesEngine.OnLogNodeInfo += logs.AddNodeInfo;
            nodesEngine.OnLogNodeError += logs.AddNodeError;

            if (gateway != null && nodesEngine != null)
                mySensorsNodesEngine = new MySensorsNodesEngine(gateway, nodesEngine);
            else
                mySensorsNodesEngine = null;

            uiNodesEngine = new UiNodesEngine(nodesEngine);

            if (!nodesEngineConfig.Enable) return;

            logs.AddSystemInfo("Starting nodes engine... ");
            nodesEngine.Start();

            logs.AddSystemInfo("Nodes engine started.");
        }




        public static void GenerateNodesJsListFile()
        {
            try
            {

                List<Nodes.Node> nodes = AppDomain.CurrentDomain.GetAssemblies()
                    .SelectMany(s => s.GetTypes())
                     .Where(t => t.IsSubclassOf(typeof(Nodes.Node)) && !t.IsAbstract)
                    .Select(t => (Nodes.Node)Activator.CreateInstance(t)).ToList();

                nodes = nodes.OrderBy(x => x.Category + x.Type).ToList();

                string file = "(function () {\n";

                foreach (var node in nodes)
                    file += node.GetJsListGenerationScript();

                file += "\n})();";

                System.IO.File.WriteAllText("wwwroot/js/node-editor/node-editor-list.js", file);

                logs.AddSystemInfo($"Generated node editor script with {nodes.Count} nodes");
            }
            catch (Exception ex)
            {
                logs.AddSystemError($"Failed to generate node editor script. " + ex.Message);
            }

        }



        public static void ConnectToGateway()
        {
            mySensorsNodesEngine = null;

            if (gatewayConfig.SerialGatewayConfig.Enable)
            {
                gatewayConnectionPort = new SerialConnectionPort(
                    gatewayConfig.SerialGatewayConfig.SerialPortName,
                    gatewayConfig.SerialGatewayConfig.Boudrate);
            }
            else if (gatewayConfig.EthernetGatewayConfig.Enable)
            {
                gatewayConnectionPort = new EthernetConnectionPort(
                    gatewayConfig.EthernetGatewayConfig.GatewayIP,
                    gatewayConfig.EthernetGatewayConfig.GatewayPort);
            }
            else return;

            //connecting to gateway
            logs.AddSystemInfo("Connecting to gateway...");

            gateway = new Gateway(gatewayConnectionPort, mySensorsDb, mySensorsMessagesDb);

            gateway.enableAutoAssignId = gatewayConfig.EnableAutoAssignId;

            gateway.OnLogDecodedMessage += logs.AddGatewayDecodedMessage;
            gateway.OnLogMessage += logs.AddGatewayMessage;
            gateway.OnLogInfo += logs.AddGatewayInfo;
            gateway.OnLogError += logs.AddGatewayError;
            gateway.endlessConnectionAttempts = true;
            gateway.OnConnected += GatewayConnected;
            gateway.OnDisconnected += GatewayDisconnected;

            gateway.Connect().Wait();

            if (gateway != null && nodesEngine != null)
                mySensorsNodesEngine = new MySensorsNodesEngine(gateway, nodesEngine);

            if (gateway != null && gateway.IsConnected())
            {
                logs.AddSystemInfo("Gateway connected.");
            }
            else
                logs.AddSystemInfo("Gateway is not connected.");

        }

        private static void GatewayConnected()
        {
            OnGatewayConnected?.Invoke();
        }

        private static void GatewayDisconnected()
        {
            OnGatewayDisconnected?.Invoke();
        }


        public static void DisconnectGateway()
        {
            if (gateway == null)
                return;

            if (gateway.GetGatewayState() != GatewayState.Disconnected)
                gateway.Disconnect();

            gateway = null;
            mySensorsNodesEngine = null;
        }

        public static void ClearAllDatabases()
        {
            mySensorsDb.RemoveAllNodesAndSensors();
            mySensorsMessagesDb.RemoveAllMessages();
            nodesDb.RemoveAllLinks();
            nodesDb.RemoveAllNodes();
            nodesDataDb.RemoveAllNodesData();
            usersDb.RemoveAllUsers();
        }
    }
}
