﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Timers;
using MyNetSensors.LogicalNodes;

namespace MyNetSensors.LogicalNodesUI
{
    public delegate void LogicalNodeUIEventHandler(LogicalNodeUI node);

    public class LogicalNodesUIEngine
    {
        public event LogicalNodeUIEventHandler OnNewUINodeEvent;
        public event LogicalNodeUIEventHandler OnRemoveUINodeEvent;
        public event LogicalNodeUIEventHandler OnUINodeUpdatedEvent;

        private static LogicalNodesEngine engine;

        private ILogicalNodesStatesRepository statesDb;



        public LogicalNodesUIEngine(LogicalNodesEngine engine, ILogicalNodesStatesRepository statesDb = null)
        {
            this.statesDb = statesDb;

            LogicalNodesUIEngine.engine = engine;
            engine.OnNewNodeEvent += OnNewNodeEvent;
            engine.OnRemoveNodeEvent += OnRemoveNodeEvent;
            engine.OnNodeUpdatedEvent += OnNodeUpdatedEvent;
            engine.OnOutputUpdatedEvent += OnOutputUpdatedEvent;

            GetStatesFromRepository();
        }

        private void GetStatesFromRepository()
        {
            if (statesDb == null)
                return;

            List<LogicalNodeUIChart> charts = engine.nodes
                .Where(n => n is LogicalNodeUIChart)
                .Cast<LogicalNodeUIChart>()
                .ToList();

            foreach (var chart in charts)
            {
                if (!chart.WriteInDatabase) continue;

                List<NodeState> states = statesDb.GetStatesForNode(chart.Id);
                chart.SetStates(states);
            }
        }



        private void OnOutputUpdatedEvent(Output output)
        {
            LogicalNode node = engine.GetOutputOwner(output);
            if (node is LogicalNodeUI)
                OnUINodeUpdatedEvent?.Invoke((LogicalNodeUI)node);
        }

        private void OnNodeUpdatedEvent(LogicalNode node)
        {
            if (node is LogicalNodeUI)
                OnUINodeUpdatedEvent?.Invoke((LogicalNodeUI)node);


            if (node is LogicalNodeUIChart)
            {
                LogicalNodeUIChart chart = (LogicalNodeUIChart)node;
                if (chart.WriteInDatabase && chart.State != null)
                {
                    statesDb?.AddState(new NodeState(chart.Id, chart.State.ToString()));
                }
            }
        }

        private void OnRemoveNodeEvent(LogicalNode node)
        {
            if (node is LogicalNodeUI)
                OnRemoveUINodeEvent?.Invoke((LogicalNodeUI)node);

            if (node is LogicalNodeUIChart)
                statesDb?.RemoveStatesForNode(node.Id);
        }

        private void OnNewNodeEvent(LogicalNode node)
        {
            if (!(node is LogicalNodeUI)) return;

            LogicalNodeUI n = (LogicalNodeUI)node;

            OnNewUINodeEvent?.Invoke(n);

            n.Name = GenerateName(n);
            engine.UpdateNode(n, true);
        }

        private string GenerateName(LogicalNodeUI node)
        {
            //auto naming
            List<LogicalNodeUI> nodes = GetUINodesForPanel(node.PanelId);
            List<string> names = nodes.Select(x => x.Name).ToList();
            for (int i = 1; i <= names.Count + 1; i++)
            {
                if (!names.Contains($"{node.Name} {i}"))
                    return $"{node.Name} {i}";
            }
            return null;
        }


        public List<LogicalNodePanel> GetPanels()
        {
            return engine.nodes
                .Where(n => n is LogicalNodePanel)
                .Cast<LogicalNodePanel>()
                .ToList();
        }



        public LogicalNodePanel GetPanel(string id)
        {
            LogicalNode node = engine.GetNode(id);

            return node as LogicalNodePanel;
        }

        public LogicalNodeUI GetUINode(string id)
        {
            return engine.nodes.FirstOrDefault(n => n.Id == id) as LogicalNodeUI;
        }


        public List<LogicalNodeUI> GetUINodes()
        {
            return engine.nodes
                .Where(n => n is LogicalNodeUI)
                .Cast<LogicalNodeUI>()
                .ToList();
        }

        public List<LogicalNodeUI> GetUINodesForMainPage()
        {
            return engine.nodes
                .Where(n => n is LogicalNodeUI && ((LogicalNodeUI)n).ShowOnMainPage)
                .Cast<LogicalNodeUI>()
                .ToList();
        }

        public List<LogicalNodeUI> GetUINodesForPanel(string panelId)
        {
            return engine.nodes
                .Where(n => n is LogicalNodeUI && n.PanelId == panelId)
                .Cast<LogicalNodeUI>()
                .ToList();
        }


        public void ClearLog(string nodeId)
        {
            LogicalNode n = engine.GetNode(nodeId);
            if (!(n is LogicalNodeUILog))
                return;

            LogicalNodeUILog node = (LogicalNodeUILog)n;
            node.ClearLog();
        }


        public void ButtonClick(string nodeId)
        {
            LogicalNode n = engine.GetNode(nodeId);
            if (!(n is LogicalNodeUIButton))
                return;

            LogicalNodeUIButton node = (LogicalNodeUIButton)n;
            node.Click();
        }



        public void ToggleButtonClick(string nodeId)
        {
            LogicalNode n = engine.GetNode(nodeId);
            if (!(n is LogicalNodeUIToggleButton))
                return;

            LogicalNodeUIToggleButton node = (LogicalNodeUIToggleButton)n;
            node.Toggle();
        }

        public void SwitchClick(string nodeId)
        {
            LogicalNode n = engine.GetNode(nodeId);
            if (!(n is LogicalNodeUISwitch))
                return;

            LogicalNodeUISwitch node = (LogicalNodeUISwitch)n;
            node.Toggle();
        }

        public void SliderChange(string nodeId, int value)
        {
            LogicalNode n = engine.GetNode(nodeId);
            if (!(n is LogicalNodeUISlider))
                return;

            LogicalNodeUISlider node = (LogicalNodeUISlider)n;
            node.SetValue(value);
        }


        public void RGBSlidersChange(string nodeId, string value)
        {
            LogicalNode n = engine.GetNode(nodeId);
            if (!(n is LogicalNodeUIRGBSliders))
                return;

            LogicalNodeUIRGBSliders node = (LogicalNodeUIRGBSliders)n;
            node.SetValue(value);
        }


        public void RGBWSlidersChange(string nodeId, string value)
        {
            LogicalNode n = engine.GetNode(nodeId);
            if (!(n is LogicalNodeUIRGBWSliders))
                return;

            LogicalNodeUIRGBWSliders node = (LogicalNodeUIRGBWSliders)n;
            node.SetValue(value);
        }





        public void TextBoxSend(string nodeId, string value)
        {
            LogicalNode n = engine.GetNode(nodeId);
            if (!(n is LogicalNodeUITextBox))
                return;

            LogicalNodeUITextBox node = (LogicalNodeUITextBox)n;
            node.Send(value);
        }


        public void ClearChart(string nodeId)
        {
            LogicalNodeUIChart node = engine.GetNode(nodeId) as LogicalNodeUIChart;
            if (node == null)
                return;

            node.RemoveStates();
            statesDb?.RemoveStatesForNode(nodeId);

            //send update ivent
            engine.UpdateNode(node, false);
        }
    }
}
