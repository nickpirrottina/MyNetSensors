﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;
using Microsoft.AspNet.Mvc;
using MyNetSensors.Gateways;
using LiteGraph;
using Microsoft.AspNet.Authorization;
using Microsoft.Extensions.Configuration;
using MyNetSensors.Nodes;
using MyNetSensors.Repositories.EF.SQLite;
using MyNetSensors.Users;
using MyNetSensors.WebController.Code;
using Newtonsoft.Json;


namespace MyNetSensors.WebController.Controllers
{
    [Authorize(UserClaims.EditorObserver)]
    public class NodesEditorController : Controller
    {
        const string MAIN_PANEL_ID = "Main";

        private NodesEngine engine = SystemController.nodesEngine;


        public IActionResult Index(bool split)
        {
            if (engine == null)
                return View("Error", "Nodes Engine is not started.<br/><br/>   <a href='/Config'>Check settings</a>");

            ViewBag.split = split;
            ViewBag.panelId = MAIN_PANEL_ID;

            return View();
        }

        public IActionResult Panel(string id, bool split)
        {
            if (engine == null)
                return View("Error", "Nodes Engine is not started.<br/><br/>   <a href='/Config'>Check settings</a>");


            ViewBag.split = split;

            if (id == null || id== MAIN_PANEL_ID)
                return RedirectToAction("Index");

            PanelNode panel = engine.GetPanelNode(id);

            if (panel == null)
                return HttpNotFound();

            ViewBag.panelId = panel.Id;
            ViewBag.ownerPanelId = panel.PanelId;

            //create menu stack
            List<PanelNode> panelsStack = new List<PanelNode>();

            bool findNext = true;
            while (findNext)
            {
                panelsStack.Add(panel);
                if (panel.PanelId == MAIN_PANEL_ID)
                    findNext = false;
                else
                {
                    panel = engine.GetPanelNode(panel.PanelId);
                }
            }

            panelsStack.Reverse();
            ViewBag.panelsStack = panelsStack;


            return View("Index");
        }


        public IActionResult Split(string id)
        {
            if (engine == null)
                return View("Error", "Nodes Engine is not started.<br/><br/>   <a href='/Config'>Check settings</a>");

            if (id == null)
                ViewBag.route = "";
            else
                ViewBag.route = "Panel/" + id;
            return View();
        }
    }
}
