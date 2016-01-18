﻿/*  MyNetSensors 
    Copyright (C) 2015 Derwish <derwish.pro@gmail.com>
    License: http://www.gnu.org/licenses/gpl-3.0.txt  
*/

using MyNetSensors.LogicalNodes;

namespace MyNetSensors.LogicalNodesUI
{
  public class LogicalNodeUIToggleButton : LogicalNodeUI
    {
      public string Value { get; set; }

      public LogicalNodeUIToggleButton() : base(0, 1)
      {
            this.Title = "UI Toggle";
            this.Type = "UI/Toggle Button";
            this.Name = "Toggle";

            Value = "0";
            Outputs[0].Value = Value;
        }

        public override void Loop()
        {
        }

        public override void OnInputChange(Input input)
        {
        }

        public void Toggle()
        {
            Value = Value == "0" ? "1" : "0";
            LogInfo($"UI Toggle Button [{Name}]: [{Value}]");
            Outputs[0].Value = Value;
        }
    }
}
