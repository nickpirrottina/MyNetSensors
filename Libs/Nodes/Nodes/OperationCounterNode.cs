﻿/*  MyNetSensors 
    Copyright (C) 2015 Derwish <derwish.pro@gmail.com>
    License: http://www.gnu.org/licenses/gpl-3.0.txt  
*/

using System;

namespace MyNetSensors.Nodes
{

    public class OperationCounterNode : Node
    {

        public double Value { get; set; }


        public OperationCounterNode() : base(3, 1)
        {
            this.Title = "Counter";
            this.Type = "Operation/Counter";

            Inputs[0].Name = "Set Value";
            Inputs[1].Name = "Count Up";
            Inputs[2].Name = "Count Down";

            Inputs[0].Type = DataType.Number;
            Inputs[1].Type = DataType.Logical;
            Inputs[2].Type = DataType.Logical;
            Outputs[0].Type = DataType.Text;
            Outputs[0].Value = Value.ToString();
        }

        public override void Loop()
        {
        }

        public override void OnInputChange(Input input)
        {
            double oldValue = Value;

            if (input == Inputs[0] && input.Value != null)
                Value = double.Parse(input.Value);

            if (input == Inputs[1] && input.Value == "1")
                Value++;

            if (input == Inputs[2] && input.Value == "1")
                Value--;

            if (oldValue!= Value)
            {
                Outputs[0].Value = Value.ToString();
                UpdateMeInDb();
            }
        }
    }
}