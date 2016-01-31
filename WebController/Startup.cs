﻿using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNet.Builder;
using Microsoft.AspNet.Hosting;
using Microsoft.AspNet.Http;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.AspNet.SignalR.Infrastructure;
using Microsoft.Data.Entity;
using Microsoft.Data.Entity.Query.ExpressionTranslators.Internal;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using MyNetSensors.Repositories.EF.SQLite;
using MyNetSensors.WebController.Code;
using MyNetSensors.WebController.Models;
using MyNetSensors.WebController.Services;

namespace MyNetSensors.WebController
{
    public class Startup
    {
        public IConfigurationRoot Configuration { get; set; }

        public Startup(IHostingEnvironment env)
        {
            // Set up configuration sources.

            var builder = new ConfigurationBuilder()
                .AddJsonFile("appsettings.json")
                .AddJsonFile($"appsettings.{env.EnvironmentName}.json", optional: true);

            if (env.IsDevelopment())
            {
                // For more details on using the user secret store see http://go.microsoft.com/fwlink/?LinkID=532709
                builder.AddUserSecrets();
            }

            builder.AddEnvironmentVariables();
            Configuration = builder.Build();
        }

        private IServiceCollection services;

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            //database
            bool dataBaseEnabled = Boolean.Parse(Configuration["DataBase:Enable"]);
            bool useInternalDb = Boolean.Parse(Configuration["DataBase:UseInternalDb"]);

            if (dataBaseEnabled)
            {
                if (useInternalDb)
                {
                    services.AddEntityFramework()
                        .AddSqlite()
                        .AddDbContext<ApplicationDbContext>(options =>
                            options.UseSqlite("Data Source=Application.sqlite"))
                        .AddDbContext<NodesDbContext>(options =>
                            options.UseSqlite("Data Source=Nodes.sqlite"))
                        .AddDbContext<NodesStatesHistoryDbContext>(options =>
                            options.UseSqlite("Data Source=NodesStatesHistory.sqlite"))
                        .AddDbContext<MySensorsNodesDbContext>(options =>
                            options.UseSqlite("Data Source=MySensorsNodes.sqlite"))
                        .AddDbContext<MySensorsMessagesDbContext>(options =>
                            options.UseSqlite("Data Source=MySensorsMessages.sqlite"))
                        .AddDbContext<UITimerNodesDbContext>(options =>
                            options.UseSqlite("Data Source=UITimerNodes.sqlite"));
                }
                else
                {
                    string connectionString = Configuration["DataBase:ExternalDbConnectionString"];
                    services.AddEntityFramework()
                        .AddSqlServer()
                        .AddDbContext<ApplicationDbContext>(options =>
                            options.UseSqlServer(connectionString))
                        .AddDbContext<NodesDbContext>(options =>
                            options.UseSqlServer(connectionString))
                        .AddDbContext<NodesStatesHistoryDbContext>(options =>
                            options.UseSqlServer(connectionString))
                        .AddDbContext<MySensorsNodesDbContext>(options =>
                            options.UseSqlServer(connectionString))
                        .AddDbContext<MySensorsMessagesDbContext>(options =>
                            options.UseSqlServer(connectionString))
                        .AddDbContext<UITimerNodesDbContext>(options =>
                            options.UseSqlServer(connectionString));
                }
            }

            services.AddIdentity<ApplicationUser, IdentityRole>()
                .AddEntityFrameworkStores<ApplicationDbContext>()
                .AddDefaultTokenProviders();

            services.AddMvc();

            // Add application services.
            services.AddTransient<IEmailSender, AuthMessageSender>();
            services.AddTransient<ISmsSender, AuthMessageSender>();

            //Add all SignalR related services to IoC.
            services.AddSignalR();

            services.AddSingleton(x => Configuration);
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(
            IApplicationBuilder app,
            IHostingEnvironment env,
            ILoggerFactory loggerFactory,
            IConnectionManager connectionManager,
            IServiceProvider serviceProvider
            )
        {
            //Set up dot instead of comma in float values
            System.Globalization.CultureInfo customCulture =
                (System.Globalization.CultureInfo)System.Threading.Thread.CurrentThread.CurrentCulture.Clone();
            customCulture.NumberFormat.NumberDecimalSeparator = ".";
            System.Threading.Thread.CurrentThread.CurrentCulture = customCulture;


            //debug settings
            bool webServerDebug = false;
            IConfigurationSection logging = null;
            bool webServerEnable = false;
            try
            {
                logging = Configuration.GetSection("WebServer:Logging");
                webServerDebug = Boolean.Parse(Configuration["WebServer:Debug"]);
                webServerEnable = Boolean.Parse(Configuration["WebServer:Enable"]);
            }
            catch
            {
                Console.WriteLine("Bad configuration in appsettings.json file.");
                return;
            }

            if (webServerDebug)
                loggerFactory.AddConsole(logging);
            else
                loggerFactory.AddConsole(LogLevel.Warning);

            loggerFactory.AddDebug();




            //web server settings
            if (webServerEnable)
            {
                if (env.IsDevelopment())
                {
                    app.UseBrowserLink();
                    app.UseDeveloperExceptionPage();
                    app.UseDatabaseErrorPage();
                }
                else
                {
                    app.UseExceptionHandler("/Home/Error");

                    // For more details on creating database during deployment see http://go.microsoft.com/fwlink/?LinkID=615859
                    try
                    {
                        using (var serviceScope = app.ApplicationServices.GetRequiredService<IServiceScopeFactory>()
                            .CreateScope())
                        {
                            serviceScope.ServiceProvider.GetService<ApplicationDbContext>()
                                .Database.Migrate();
                        }
                    }
                    catch
                    {
                    }
                }

                app.UseRuntimeInfoPage("/info");

                app.UseSignalR();

                app.UseIISPlatformHandler(options => options.AuthenticationDescriptions.Clear());

                app.UseStaticFiles();

                app.UseIdentity();

                // To configure external authentication please see http://go.microsoft.com/fwlink/?LinkID=532715

                app.UseStatusCodePages();

                app.UseMvc(routes =>
                {
                    routes.MapRoute(
                        name: "default",
                        template: "{controller=Home}/{action=Index}/{id?}/{id2?}/{id3?}");
                });


                NodesEngineSignalRServer.Start(connectionManager);
                MySensorsSignalRServer.Start(connectionManager);
            }

            SystemController.Start(Configuration, serviceProvider);
        }

        // Entry point for the application.
        public static void Main(string[] args)
        {
            WebApplication.Run<Startup>(args);
        }
    }
}
