﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNet.Mvc;
using MyNetSensors.LogicalNodes;
using MyNetSensors.LogicalNodesUI;
using MyNetSensors.SerialControllers;

namespace MyNetSensors.WebController.Controllers
{
    public class DashboardController : Controller
    {
        const string MAIN_PANEL_ID = "Main";

        private LogicalNodesUIEngine engineUI = SerialController.logicalNodesUIEngine;


        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Panel(string id)
        {
            if (id == null || id == MAIN_PANEL_ID)
            {
                id = MAIN_PANEL_ID;
                ViewBag.panelName = "Main Panel";
            }
            else
            {
                LogicalNodePanel panel = engineUI.GetPanel(id);
                if (panel == null)
                    return HttpNotFound();
                ViewBag.panelName = panel.Name;
            }

            ViewBag.panelId = id;
            return View("Index");
        }

        public IActionResult List()
        {
            ViewBag.showMainPanel = engineUI.GetUINodesForPanel(MAIN_PANEL_ID).Any();

            List<LogicalNodePanel> allPanels = engineUI.GetPanels();
            List<LogicalNodePanel> notEmptyPanels = new List<LogicalNodePanel>();
            foreach (var panel in allPanels)
            {
                if (engineUI.GetUINodesForPanel(panel.Id).Any())
                    notEmptyPanels.Add(panel);
            }

            return View(notEmptyPanels);
        }


        //public List<LogicalNodePanel> GetPanels()
        //{
        //    if (engineUI == null)
        //        return null;

        //    return engineUI.GetPanels();
        //}

        public string GetNameForPanel(string id)
        {
            if (engineUI == null)
                return null;

            LogicalNodePanel panel = engineUI.GetPanel(id);

            return panel?.Name;
        }

        public List<LogicalNodeUI> GetUINodesForMainPage()
        {
            if (engineUI == null)
                return null;

            return engineUI.GetUINodesForMainPage();
        }

        public List<LogicalNodeUI> GetUINodesForPanel(string panelId)
        {
            if (engineUI == null)
                return null;

            return engineUI.GetUINodesForPanel(panelId);
        }


        public bool ClearLog(string nodeId)
        {
            engineUI.ClearLog(nodeId);
            return true;
        }


        public bool TextBoxSend(string nodeId, string value)
        {
            engineUI.TextBoxSend(nodeId, value);
            return true;
        }



        public bool ButtonClick(string nodeId)
        {
            engineUI.ButtonClick(nodeId);
            return true;
        }

        public bool ToggleButtonClick(string nodeId)
        {
            engineUI.ToggleButtonClick(nodeId);
            return true;
        }

        public bool SwitchClick(string nodeId)
        {
            engineUI.SwitchClick(nodeId);
            return true;
        }

        public bool SliderChange(string nodeId, int value)
        {
            engineUI.SliderChange(nodeId, value);
            return true;
        }

        public bool RGBSlidersChange(string nodeId, string value)
        {
            engineUI.RGBSlidersChange(nodeId, value);
            return true;
        }

        public bool RGBWSlidersChange(string nodeId, string value)
        {
            engineUI.RGBWSlidersChange(nodeId, value);
            return true;
        }



        public ActionResult Chart(string id, string autoscroll, string style, string start, string end)
        {
            if (engineUI == null)
                return null;

            LogicalNodeUIChart chart = engineUI.GetUINode(id) as LogicalNodeUIChart;
            if (chart == null)
                return new HttpNotFoundResult();

            ViewBag.autoscroll = autoscroll;
            ViewBag.style = style;
            ViewBag.start = start ?? "0";
            ViewBag.end = end ?? "0";

            return View(chart);
        }

        public List<ChartData> GetChartData(string id)
        {
            LogicalNodeUIChart chart = engineUI.GetUINode(id) as LogicalNodeUIChart;
            if (chart == null)
                return null;

            List<NodeState> nodeStates = chart.GetStates();

            if (nodeStates == null || !nodeStates.Any())
                return null;

            //copy to array to prevent changing data error
            NodeState[] nodeStatesArray=new NodeState[nodeStates.Count];
            nodeStates.CopyTo(nodeStatesArray);

            return nodeStatesArray.Select(item => new ChartData
            {
                x = $"{item.DateTime:yyyy-MM-dd HH:mm:ss.fff}",
                y = item.State=="0"?"-0.01": item.State
            }).ToList();
        }


        public bool ClearChart(string nodeId)
        {
            engineUI.ClearChart(nodeId);
            return true;
        }
    }
}
