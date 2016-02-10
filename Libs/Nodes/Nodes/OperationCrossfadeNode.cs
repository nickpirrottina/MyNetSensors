﻿//planer-pro copyright 2015 GPL - license.

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MyNetSensors.Nodes
{

    public class OperationCrossfadeNode : Node
    {

        public OperationCrossfadeNode() : base(3, 1)
        {
            this.Title = "Crossfade";
            this.Type = "Operation/Crossfade";

            Inputs[0].Type = DataType.Number;
            Inputs[1].Type = DataType.Number;
            Inputs[2].Type = DataType.Number;
            Outputs[0].Type = DataType.Number;

            Inputs[0].Name = "Crossfade";
            Inputs[1].Name = "A";
            Inputs[2].Name = "B";

        }

        public override void Loop()
        {
        }

        public override void OnInputChange(Input input)
        {
            if (Inputs.Any(i => i.Value == null))
            {
                ResetOutputs();
                return;
            }

            Double xf = Double.Parse(Inputs[0].Value);
            Double a = Double.Parse(Inputs[1].Value);
            Double b = Double.Parse(Inputs[2].Value);

            Double xout = a * (1 - xf / 100) + b * xf / 100;

            Outputs[0].Value = xout.ToString();
        }
    }
}