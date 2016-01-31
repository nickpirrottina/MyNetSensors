﻿//planer-pro copyright 2015 GPL - license.

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MyNetSensors.Nodes
{

    public class MathRoundNode : Node
    {
        /// <summary>
        /// Math Round (1 inputs, 1 output).
        /// </summary>
        public MathRoundNode() : base(1, 1)
        {
            this.Title = "Math Round";
            this.Type = "Math/Round";

            Inputs[0].Type = DataType.Number;
            Outputs[0].Type = DataType.Number;
        }

        public override void Loop()
        {
        }

        public override void OnInputChange(Input input)
        {
            if (Inputs.Any(i => i.Value == null))
            {
                LogInfo("[NULL]");
                Outputs[0].Value = null;
                return;
            }

            Double a = Double.Parse(Inputs[0].Value);
            int b = (int)Math.Round(a);

            LogInfo($"[{a}] rounded to [{b}]");
            Outputs[0].Value = b.ToString();
        }
    }
}