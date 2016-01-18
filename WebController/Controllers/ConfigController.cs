﻿using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNet.Mvc;
using Microsoft.AspNet.Mvc.Rendering;
using Microsoft.Extensions.Configuration;
using MyNetSensors.SerialControllers;
using MyNetSensors.WebController.Code;
using MyNetSensors.WebController.ViewModels.Config;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace MyNetSensors.WebController.Controllers
{
    public class ConfigController : Controller
    {

        private const string SETTINGS_FILE_NAME = "appsettings.json";





        private IConfigurationRoot сonfiguration;

        public ConfigController(IConfigurationRoot сonfiguration)
        {
            this.сonfiguration = сonfiguration;
        }


        private dynamic ReadConfig()
        {
            return JObject.Parse(System.IO.File.ReadAllText(SETTINGS_FILE_NAME));
        }

        private void WriteConfig(dynamic config)
        {
            System.IO.File.WriteAllText(SETTINGS_FILE_NAME, config.ToString());
        }

        public IActionResult Index()
        {
            bool firstRun = Boolean.Parse(сonfiguration["FirstRun"]);

            if (firstRun)
                return RedirectToAction("FirstRun");
            else
                return RedirectToAction("Gateway");


            // return View();
        }



        public ActionResult Gateway()
        {
            return View();
        }




        [HttpGet]
        public IActionResult SerialPort()
        {
            List<string> ports = SerialController.comPort.GetPortsList();
            string currentPort = SerialController.serialPortName;

            ViewBag.ports = ports;

            if (ports.Contains(currentPort))
                ViewBag.currentPort = currentPort;

            return View(new SerialPortViewModel());
        }


        [HttpPost]
        public IActionResult SerialPort(SerialPortViewModel port)
        {
            if (String.IsNullOrEmpty(port.PortName))
                return RedirectToAction("SerialPort");

            dynamic json = ReadConfig();
            json.Gateway.SerialPort = port.PortName;
            WriteConfig(json);
            сonfiguration.Reload();

            SerialController.ReconnectToGateway(port.PortName);

            return RedirectToAction("Gateway");
        }




        [HttpGet]
        public IActionResult FirstRun()
        {
            List<string> ports = SerialController.comPort.GetPortsList();
            string currentPort = SerialController.serialPortName;

            ViewBag.ports = ports;

            if (ports.Contains(currentPort))
                ViewBag.currentPort = currentPort;

            return View(new SerialPortViewModel());
        }


        [HttpPost]
        public IActionResult FirstRun(SerialPortViewModel port)
        {
            if (String.IsNullOrEmpty(port.PortName))
                return RedirectToAction("FirstRun");

            dynamic json = ReadConfig();
            json.Gateway.SerialPort = port.PortName;
            json.FirstRun = false;
            WriteConfig(json);
            сonfiguration.Reload();

            SerialControllerConfigurator.Start(сonfiguration);

            return RedirectToAction("Control", "Hardware");
        }



    }


}
