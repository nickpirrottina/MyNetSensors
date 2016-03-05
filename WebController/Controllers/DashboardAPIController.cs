﻿/*  MyNodes.NET 
    Copyright (C) 2016 Derwish <derwish.pro@gmail.com>
    License: http://www.gnu.org/licenses/gpl-3.0.txt  
*/

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNet.Authorization;
using Microsoft.AspNet.Mvc;
using MyNodes.Nodes;
using MyNodes.Users;
using MyNodes.WebController.Code;

namespace MyNodes.WebController.Controllers
{
    [Authorize(UserClaims.DashboardObserver)]

    public class DashboardAPIController : Controller
    {

        private UiNodesEngine engine = SystemController.uiNodesEngine;


        public async Task<string> GetNameForPanel(string id)
        {
            return await Task.Run(() =>
            {
                if (engine == null)
                    return null;

                PanelNode panel = engine.GetPanel(id);

                return panel?.Settings["Name"].Value;
            });
        }

        public async Task<List<UiNode>> GetUINodesForHomePage()
        {
            return await Task.Run(() =>
            {
                if (engine == null)
                    return null;

                return engine.GetUINodesForHomePage();
            });
        }

        public async Task<List<UiNode>> GetUINodesForPanel(string panelId)
        {
            return await Task.Run(() =>
            {
                if (engine == null)
                    return null;

                return engine.GetUINodesForPanel(panelId);
            });
        }


        [Authorize(UserClaims.DashboardEditor)]
        public async Task<bool> SetValues(string nodeId, Dictionary<string, string> values)
        {
            return await Task.Run(() =>
            {
                UiNode node = engine.GetUINode(nodeId);
                if (node == null)
                    return false;

                return node.SetValues(values);
            });
        }

        [Authorize(UserClaims.DashboardEditor)]
        public async Task<string> GetValue(string nodeId, string name)
        {
            return await Task.Run(() =>
            {
                UiNode node = engine.GetUINode(nodeId);
                if (node == null)
                    return null;

                return node.GetValue(name);
            });
        }

    }
}
