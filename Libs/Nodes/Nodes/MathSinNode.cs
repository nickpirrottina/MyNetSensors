﻿/*  MyNetSensors 
    Copyright (C) 2015 Derwish <derwish.pro@gmail.com>
    License: http://www.gnu.org/licenses/gpl-3.0.txt  
*/

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MyNetSensors.Nodes
{
    public class MathSinNode : Node
    {
        /// <summary>
        /// Math Sin (1 inputs, 1 output).
        /// </summary>
        public MathSinNode() : base(1, 1)
        {
            this.Title = "Math Sin";
            this.Type = "Math/Sin";

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
            Double b = Math.Sin(a);

            LogInfo($"Sin [{a}] = [{b}]");
            Outputs[0].Value = b.ToString();
        }
    }
}
