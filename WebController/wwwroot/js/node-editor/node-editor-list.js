(function () {


            //BasicConstantNode
            function BasicConstantNode () {
                this.properties = {
                    'ObjectType': 'MyNodes.Nodes.BasicConstantNode',
                    'Assembly': 'Nodes, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null'
                };
            }
            BasicConstantNode.title = 'Constant';
            LiteGraph.registerNodeType('Basic/Constant', BasicConstantNode);

            

            //ConnectionGateNode
            function ConnectionGateNode () {
                this.properties = {
                    'ObjectType': 'MyNodes.Nodes.ConnectionGateNode',
                    'Assembly': 'Nodes, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null'
                };
            }
            ConnectionGateNode.title = 'Gate';
            LiteGraph.registerNodeType('Connection/Gate', ConnectionGateNode);

            

            //ConnectionHubNode
            function ConnectionHubNode () {
                this.properties = {
                    'ObjectType': 'MyNodes.Nodes.ConnectionHubNode',
                    'Assembly': 'Nodes, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null'
                };
            }
            ConnectionHubNode.title = 'Hub';
            LiteGraph.registerNodeType('Connection/Hub', ConnectionHubNode);

            

            //ConnectionLocalReceiverNode
            function ConnectionLocalReceiverNode () {
                this.properties = {
                    'ObjectType': 'MyNodes.Nodes.ConnectionLocalReceiverNode',
                    'Assembly': 'Nodes, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null'
                };
            }
            ConnectionLocalReceiverNode.title = 'Local Receiver';
            LiteGraph.registerNodeType('Connection/Local Receiver', ConnectionLocalReceiverNode);

            

            //ConnectionLocalTransmitterNode
            function ConnectionLocalTransmitterNode () {
                this.properties = {
                    'ObjectType': 'MyNodes.Nodes.ConnectionLocalTransmitterNode',
                    'Assembly': 'Nodes, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null'
                };
            }
            ConnectionLocalTransmitterNode.title = 'Local Transmitter';
            LiteGraph.registerNodeType('Connection/Local Transmitter', ConnectionLocalTransmitterNode);

            

            //ConnectionRemoteReceiverNode
            function ConnectionRemoteReceiverNode () {
                this.properties = {
                    'ObjectType': 'MyNodes.Nodes.ConnectionRemoteReceiverNode',
                    'Assembly': 'Nodes, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null'
                };
            }
            ConnectionRemoteReceiverNode.title = 'Remote Receiver';
            LiteGraph.registerNodeType('Connection/Remote Receiver', ConnectionRemoteReceiverNode);

            

            //ConnectionRemoteTransmitterNode
            function ConnectionRemoteTransmitterNode () {
                this.properties = {
                    'ObjectType': 'MyNodes.Nodes.ConnectionRemoteTransmitterNode',
                    'Assembly': 'Nodes, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null'
                };
            }
            ConnectionRemoteTransmitterNode.title = 'Remote Transmitter';
            LiteGraph.registerNodeType('Connection/Remote Transmitter', ConnectionRemoteTransmitterNode);

            

            //ConnectionRouterMultipleToOneNode
            function ConnectionRouterMultipleToOneNode () {
                this.properties = {
                    'ObjectType': 'MyNodes.Nodes.ConnectionRouterMultipleToOneNode',
                    'Assembly': 'Nodes, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null'
                };
            }
            ConnectionRouterMultipleToOneNode.title = 'Router Multiple-One';
            LiteGraph.registerNodeType('Connection/Router Multiple-One', ConnectionRouterMultipleToOneNode);

            

            //ConnectionRouterOneToMultipleNode
            function ConnectionRouterOneToMultipleNode () {
                this.properties = {
                    'ObjectType': 'MyNodes.Nodes.ConnectionRouterOneToMultipleNode',
                    'Assembly': 'Nodes, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null'
                };
            }
            ConnectionRouterOneToMultipleNode.title = 'Router One-Multiple';
            LiteGraph.registerNodeType('Connection/Router One-Multiple', ConnectionRouterOneToMultipleNode);

            

            //FiltersOnlyFromRangeNode
            function FiltersOnlyFromRangeNode () {
                this.properties = {
                    'ObjectType': 'MyNodes.Nodes.FiltersOnlyFromRangeNode',
                    'Assembly': 'Nodes, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null'
                };
            }
            FiltersOnlyFromRangeNode.title = 'Only From Range';
            LiteGraph.registerNodeType('Filters/Only From Range', FiltersOnlyFromRangeNode);

            

            //FiltersOnlyGreaterNode
            function FiltersOnlyGreaterNode () {
                this.properties = {
                    'ObjectType': 'MyNodes.Nodes.Nodes.FiltersOnlyGreaterNode',
                    'Assembly': 'Nodes, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null'
                };
            }
            FiltersOnlyGreaterNode.title = 'Only Greater';
            LiteGraph.registerNodeType('Filters/Only Greater', FiltersOnlyGreaterNode);

            

            //FiltersOnlyLogicNode
            function FiltersOnlyLogicNode () {
                this.properties = {
                    'ObjectType': 'MyNodes.Nodes.FiltersOnlyLogicNode',
                    'Assembly': 'Nodes, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null'
                };
            }
            FiltersOnlyLogicNode.title = 'Only Logic';
            LiteGraph.registerNodeType('Filters/Only Logic', FiltersOnlyLogicNode);

            

            //FiltersOnlyLowerNode
            function FiltersOnlyLowerNode () {
                this.properties = {
                    'ObjectType': 'MyNodes.Nodes.Nodes.FiltersOnlyLowerNode',
                    'Assembly': 'Nodes, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null'
                };
            }
            FiltersOnlyLowerNode.title = 'Only Lower';
            LiteGraph.registerNodeType('Filters/Only Lower', FiltersOnlyLowerNode);

            

            //FiltersOnlyNumbersNode
            function FiltersOnlyNumbersNode () {
                this.properties = {
                    'ObjectType': 'MyNodes.Nodes.FiltersOnlyNumbersNode',
                    'Assembly': 'Nodes, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null'
                };
            }
            FiltersOnlyNumbersNode.title = 'Only Numbers';
            LiteGraph.registerNodeType('Filters/Only Numbers', FiltersOnlyNumbersNode);

            

            //FiltersOnlyOneNode
            function FiltersOnlyOneNode () {
                this.properties = {
                    'ObjectType': 'MyNodes.Nodes.FiltersOnlyOneNode',
                    'Assembly': 'Nodes, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null'
                };
            }
            FiltersOnlyOneNode.title = 'Only One';
            LiteGraph.registerNodeType('Filters/Only One', FiltersOnlyOneNode);

            

            //FiltersOnlySpecifiedNode
            function FiltersOnlySpecifiedNode () {
                this.properties = {
                    'ObjectType': 'MyNodes.Nodes.FiltersOnlySpecifiedNode',
                    'Assembly': 'Nodes, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null'
                };
            }
            FiltersOnlySpecifiedNode.title = 'Only Specified';
            LiteGraph.registerNodeType('Filters/Only Specified', FiltersOnlySpecifiedNode);

            

            //FiltersOnlyZeroNode
            function FiltersOnlyZeroNode () {
                this.properties = {
                    'ObjectType': 'MyNodes.Nodes.FiltersOnlyZeroNode',
                    'Assembly': 'Nodes, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null'
                };
            }
            FiltersOnlyZeroNode.title = 'Only Zero';
            LiteGraph.registerNodeType('Filters/Only Zero', FiltersOnlyZeroNode);

            

            //FiltersPreventDuplicationNode
            function FiltersPreventDuplicationNode () {
                this.properties = {
                    'ObjectType': 'MyNodes.Nodes.FiltersPreventDuplicationNode',
                    'Assembly': 'Nodes, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null'
                };
            }
            FiltersPreventDuplicationNode.title = 'Prevent Duplication';
            LiteGraph.registerNodeType('Filters/Prevent Duplication', FiltersPreventDuplicationNode);

            

            //FiltersPreventNullNode
            function FiltersPreventNullNode () {
                this.properties = {
                    'ObjectType': 'MyNodes.Nodes.FiltersPreventNullNode',
                    'Assembly': 'Nodes, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null'
                };
            }
            FiltersPreventNullNode.title = 'Prevent Null';
            LiteGraph.registerNodeType('Filters/Prevent Null', FiltersPreventNullNode);

            

            //FiltersPreventSpecifiedNode
            function FiltersPreventSpecifiedNode () {
                this.properties = {
                    'ObjectType': 'MyNodes.Nodes.FiltersPreventSpecifiedNode',
                    'Assembly': 'Nodes, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null'
                };
            }
            FiltersPreventSpecifiedNode.title = 'Prevent Specified';
            LiteGraph.registerNodeType('Filters/Prevent Specified', FiltersPreventSpecifiedNode);

            

            //FiltersReduceEventsNode
            function FiltersReduceEventsNode () {
                this.properties = {
                    'ObjectType': 'MyNodes.Nodes.FiltersReduceEventsNode',
                    'Assembly': 'Nodes, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null'
                };
            }
            FiltersReduceEventsNode.title = 'Reduce Events';
            LiteGraph.registerNodeType('Filters/Reduce Events', FiltersReduceEventsNode);

            

            function MySensorsNode() {
                this.properties = {
                    'ObjectType': 'MyNodes.Nodes.MySensorsNode',
                    'Assembly': 'Nodes.MySensors'
                };
                this.clonable = false;
            }
            MySensorsNode.title = 'MySensors Node';
            MySensorsNode.skip_list = true;
            LiteGraph.registerNodeType('Hardware/MySensors', MySensorsNode);

            

            //LogicAndNode
            function LogicAndNode () {
                this.properties = {
                    'ObjectType': 'MyNodes.Nodes.LogicAndNode',
                    'Assembly': 'Nodes, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null'
                };
            }
            LogicAndNode.title = 'AND';
            LiteGraph.registerNodeType('Logic/AND', LogicAndNode);

            

            //CheckInRangeNode
            function CheckInRangeNode () {
                this.properties = {
                    'ObjectType': 'MyNodes.Nodes.CheckInRangeNode',
                    'Assembly': 'Nodes, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null'
                };
            }
            CheckInRangeNode.title = 'Check In Range';
            LiteGraph.registerNodeType('Logic/Check In Range', CheckInRangeNode);

            

            //LogicCompareEqualNode
            function LogicCompareEqualNode () {
                this.properties = {
                    'ObjectType': 'MyNodes.Nodes.LogicCompareEqualNode',
                    'Assembly': 'Nodes, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null'
                };
            }
            LogicCompareEqualNode.title = 'Compare Equal';
            LiteGraph.registerNodeType('Logic/Compare Equal', LogicCompareEqualNode);

            

            //LogicCompareGreaterNode
            function LogicCompareGreaterNode () {
                this.properties = {
                    'ObjectType': 'MyNodes.Nodes.LogicCompareGreaterNode',
                    'Assembly': 'Nodes, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null'
                };
            }
            LogicCompareGreaterNode.title = 'Compare Greater';
            LiteGraph.registerNodeType('Logic/Compare Greater', LogicCompareGreaterNode);

            

            //LogicCompareLowerNode
            function LogicCompareLowerNode () {
                this.properties = {
                    'ObjectType': 'MyNodes.Nodes.LogicCompareLowerNode',
                    'Assembly': 'Nodes, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null'
                };
            }
            LogicCompareLowerNode.title = 'Compare Lower';
            LiteGraph.registerNodeType('Logic/Compare Lower', LogicCompareLowerNode);

            

            //LogicCompareNotEqualNode
            function LogicCompareNotEqualNode () {
                this.properties = {
                    'ObjectType': 'MyNodes.Nodes.LogicCompareNotEqualNode',
                    'Assembly': 'Nodes, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null'
                };
            }
            LogicCompareNotEqualNode.title = 'Compare NotEqual';
            LiteGraph.registerNodeType('Logic/Compare NotEqual', LogicCompareNotEqualNode);

            

            //LogicNotNode
            function LogicNotNode () {
                this.properties = {
                    'ObjectType': 'MyNodes.Nodes.LogicNotNode',
                    'Assembly': 'Nodes, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null'
                };
            }
            LogicNotNode.title = 'NOT';
            LiteGraph.registerNodeType('Logic/NOT', LogicNotNode);

            

            //LogicOrNode
            function LogicOrNode () {
                this.properties = {
                    'ObjectType': 'MyNodes.Nodes.LogicOrNode',
                    'Assembly': 'Nodes, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null'
                };
            }
            LogicOrNode.title = 'OR';
            LiteGraph.registerNodeType('Logic/OR', LogicOrNode);

            

            //PanelNode
            function PanelNode() {
                this.properties = {
                    'ObjectType': 'MyNodes.Nodes.PanelNode',
                    'Assembly': 'Nodes'
                };
            }
            PanelNode.title = 'Panel';
            PanelNode.prototype.getExtraMenuOptions = function (graphcanvas) {
                var that = this;
                return [
                    { content: 'Open', callback: function () { window.location = '/NodeEditor/Panel/' + that.id; } },
                    null, //null for horizontal line
                    { content: 'Show on Dashboard', callback: function () { var win = window.open('/Dashboard/Panel/' + that.id, '_blank'); win.focus(); } },
                    null,
                    { content: 'Export to file', callback: function () { var win = window.open('/NodeEditorAPI/SerializePanelToFile/' + that.id, '_blank'); win.focus(); } },
                    { content: 'Export to script', callback: function () { editor.exportPanelToScript(that.id) } },
                    { content: 'Export URL', callback: function () { editor.exportPanelURL(that.id) } },
                    null
                ];
            }
            LiteGraph.registerNodeType('Main/Panel', PanelNode);

            

            //PanelInputNode
            function PanelInputNode () {
                this.properties = {
                    'ObjectType': 'MyNodes.Nodes.PanelInputNode',
                    'Assembly': 'Nodes, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null'
                };
            }
            PanelInputNode.title = 'Panel Input';
            LiteGraph.registerNodeType('Main/Panel Input', PanelInputNode);

            

            //PanelOutputNode
            function PanelOutputNode () {
                this.properties = {
                    'ObjectType': 'MyNodes.Nodes.PanelOutputNode',
                    'Assembly': 'Nodes, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null'
                };
            }
            PanelOutputNode.title = 'Panel Output';
            LiteGraph.registerNodeType('Main/Panel Output', PanelOutputNode);

            

            //MathAverageNode
            function MathAverageNode () {
                this.properties = {
                    'ObjectType': 'MyNodes.Nodes.MathAverageNode',
                    'Assembly': 'Nodes, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null'
                };
            }
            MathAverageNode.title = 'Average';
            LiteGraph.registerNodeType('Math/Average', MathAverageNode);

            

            //MathClampNode
            function MathClampNode () {
                this.properties = {
                    'ObjectType': 'MyNodes.Nodes.MathClampNode',
                    'Assembly': 'Nodes, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null'
                };
            }
            MathClampNode.title = 'Clamp';
            LiteGraph.registerNodeType('Math/Clamp', MathClampNode);

            

            //MathCosNode
            function MathCosNode () {
                this.properties = {
                    'ObjectType': 'MyNodes.Nodes.MathCosNode',
                    'Assembly': 'Nodes, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null'
                };
            }
            MathCosNode.title = 'Cos';
            LiteGraph.registerNodeType('Math/Cos', MathCosNode);

            

            //MathDivideNode
            function MathDivideNode () {
                this.properties = {
                    'ObjectType': 'MyNodes.Nodes.MathDivideNode',
                    'Assembly': 'Nodes, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null'
                };
            }
            MathDivideNode.title = 'Divide';
            LiteGraph.registerNodeType('Math/Divide', MathDivideNode);

            

            //MathMaxNode
            function MathMaxNode () {
                this.properties = {
                    'ObjectType': 'MyNodes.Nodes.MathMaxNode',
                    'Assembly': 'Nodes, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null'
                };
            }
            MathMaxNode.title = 'Max';
            LiteGraph.registerNodeType('Math/Max', MathMaxNode);

            

            //MathMinNode
            function MathMinNode () {
                this.properties = {
                    'ObjectType': 'MyNodes.Nodes.MathMinNode',
                    'Assembly': 'Nodes, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null'
                };
            }
            MathMinNode.title = 'Min';
            LiteGraph.registerNodeType('Math/Min', MathMinNode);

            

            //MathMinusNode
            function MathMinusNode () {
                this.properties = {
                    'ObjectType': 'MyNodes.Nodes.MathMinusNode',
                    'Assembly': 'Nodes, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null'
                };
            }
            MathMinusNode.title = 'Minus';
            LiteGraph.registerNodeType('Math/Minus', MathMinusNode);

            

            //MathModulusNode
            function MathModulusNode () {
                this.properties = {
                    'ObjectType': 'MyNodes.Nodes.MathModulusNode',
                    'Assembly': 'Nodes, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null'
                };
            }
            MathModulusNode.title = 'Modulus';
            LiteGraph.registerNodeType('Math/Modulus', MathModulusNode);

            

            //MathMultiplyNode
            function MathMultiplyNode () {
                this.properties = {
                    'ObjectType': 'MyNodes.Nodes.MathMultiplyNode',
                    'Assembly': 'Nodes, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null'
                };
            }
            MathMultiplyNode.title = 'Multiply';
            LiteGraph.registerNodeType('Math/Multiply', MathMultiplyNode);

            

            //MathPlusNode
            function MathPlusNode () {
                this.properties = {
                    'ObjectType': 'MyNodes.Nodes.MathPlusNode',
                    'Assembly': 'Nodes, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null'
                };
            }
            MathPlusNode.title = 'Plus';
            LiteGraph.registerNodeType('Math/Plus', MathPlusNode);

            

            //MathPowNode
            function MathPowNode () {
                this.properties = {
                    'ObjectType': 'MyNodes.Nodes.MathPowNode',
                    'Assembly': 'Nodes, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null'
                };
            }
            MathPowNode.title = 'Pow';
            LiteGraph.registerNodeType('Math/Pow', MathPowNode);

            

            //MathRemapNode
            function MathRemapNode () {
                this.properties = {
                    'ObjectType': 'MyNodes.Nodes.MathRemapNode',
                    'Assembly': 'Nodes, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null'
                };
            }
            MathRemapNode.title = 'Remap';
            LiteGraph.registerNodeType('Math/Remap', MathRemapNode);

            

            //MathRoundNode
            function MathRoundNode () {
                this.properties = {
                    'ObjectType': 'MyNodes.Nodes.MathRoundNode',
                    'Assembly': 'Nodes, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null'
                };
            }
            MathRoundNode.title = 'Round';
            LiteGraph.registerNodeType('Math/Round', MathRoundNode);

            

            //MathSinNode
            function MathSinNode () {
                this.properties = {
                    'ObjectType': 'MyNodes.Nodes.MathSinNode',
                    'Assembly': 'Nodes, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null'
                };
            }
            MathSinNode.title = 'Sin';
            LiteGraph.registerNodeType('Math/Sin', MathSinNode);

            

            //MathSqrtNode
            function MathSqrtNode () {
                this.properties = {
                    'ObjectType': 'MyNodes.Nodes.MathSqrtNode',
                    'Assembly': 'Nodes, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null'
                };
            }
            MathSqrtNode.title = 'Sqrt';
            LiteGraph.registerNodeType('Math/Sqrt', MathSqrtNode);

            

            //MathSumNode
            function MathSumNode () {
                this.properties = {
                    'ObjectType': 'MyNodes.Nodes.Nodes.MathSumNode',
                    'Assembly': 'Nodes, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null'
                };
            }
            MathSumNode.title = 'Sum';
            LiteGraph.registerNodeType('Math/Sum', MathSumNode);

            

            //MathTanNode
            function MathTanNode () {
                this.properties = {
                    'ObjectType': 'MyNodes.Nodes.MathTanNode',
                    'Assembly': 'Nodes, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null'
                };
            }
            MathTanNode.title = 'Tan';
            LiteGraph.registerNodeType('Math/Tan', MathTanNode);

            

            //OperationAnyToOneNode
            function OperationAnyToOneNode () {
                this.properties = {
                    'ObjectType': 'MyNodes.Nodes.OperationAnyToOneNode',
                    'Assembly': 'Nodes, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null'
                };
            }
            OperationAnyToOneNode.title = 'Any To One';
            LiteGraph.registerNodeType('Operation/Any To One', OperationAnyToOneNode);

            

            //OperationCounterNode
            function OperationCounterNode () {
                this.properties = {
                    'ObjectType': 'MyNodes.Nodes.OperationCounterNode',
                    'Assembly': 'Nodes, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null'
                };
            }
            OperationCounterNode.title = 'Counter';
            LiteGraph.registerNodeType('Operation/Counter', OperationCounterNode);

            

            //OperationCrossfadeNode
            function OperationCrossfadeNode () {
                this.properties = {
                    'ObjectType': 'MyNodes.Nodes.OperationCrossfadeNode',
                    'Assembly': 'Nodes, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null'
                };
            }
            OperationCrossfadeNode.title = 'Crossfade';
            LiteGraph.registerNodeType('Operation/Crossfade', OperationCrossfadeNode);

            

            //OperationEventCounterNode
            function OperationEventCounterNode () {
                this.properties = {
                    'ObjectType': 'MyNodes.Nodes.OperationEventCounterNode',
                    'Assembly': 'Nodes, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null'
                };
            }
            OperationEventCounterNode.title = 'Event Counter';
            LiteGraph.registerNodeType('Operation/Event Counter', OperationEventCounterNode);

            

            //OperationFlipflopNode
            function OperationFlipflopNode () {
                this.properties = {
                    'ObjectType': 'MyNodes.Nodes.OperationFlipflopNode',
                    'Assembly': 'Nodes, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null'
                };
            }
            OperationFlipflopNode.title = 'Flip-Flop';
            LiteGraph.registerNodeType('Operation/Flip-Flop', OperationFlipflopNode);

            

            //OperationFreqDividerNode
            function OperationFreqDividerNode () {
                this.properties = {
                    'ObjectType': 'MyNodes.Nodes.OperationFreqDividerNode',
                    'Assembly': 'Nodes, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null'
                };
            }
            OperationFreqDividerNode.title = 'Freq Divider';
            LiteGraph.registerNodeType('Operation/Freq Divider', OperationFreqDividerNode);

            

            //OperationLinearShaperNode
            function OperationLinearShaperNode () {
                this.properties = {
                    'ObjectType': 'MyNodes.Nodes.OperationLinearShaperNode',
                    'Assembly': 'Nodes, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null'
                };
            }
            OperationLinearShaperNode.title = 'Linear Shaper';
            LiteGraph.registerNodeType('Operation/Linear Shaper', OperationLinearShaperNode);

            

            //OperationQueueNode
            function OperationQueueNode () {
                this.properties = {
                    'ObjectType': 'MyNodes.Nodes.Nodes.OperationQueueNode',
                    'Assembly': 'Nodes, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null'
                };
            }
            OperationQueueNode.title = 'Queue';
            LiteGraph.registerNodeType('Operation/Queue', OperationQueueNode);

            

            //OperationRandomNode
            function OperationRandomNode () {
                this.properties = {
                    'ObjectType': 'MyNodes.Nodes.OperationRandomNode',
                    'Assembly': 'Nodes, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null'
                };
            }
            OperationRandomNode.title = 'Random';
            LiteGraph.registerNodeType('Operation/Random', OperationRandomNode);

            

            //OperationStackNode
            function OperationStackNode () {
                this.properties = {
                    'ObjectType': 'MyNodes.Nodes.Nodes.OperationStackNode',
                    'Assembly': 'Nodes, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null'
                };
            }
            OperationStackNode.title = 'Stack';
            LiteGraph.registerNodeType('Operation/Stack', OperationStackNode);

            

            //RgbCrossfadeRgbNode
            function RgbCrossfadeRgbNode () {
                this.properties = {
                    'ObjectType': 'MyNodes.Nodes.RgbCrossfadeRgbNode',
                    'Assembly': 'Nodes, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null'
                };
            }
            RgbCrossfadeRgbNode.title = 'Crossfade RGB';
            LiteGraph.registerNodeType('RGB/Crossfade RGB', RgbCrossfadeRgbNode);

            

            //RgbCrossfadeRgbwNode
            function RgbCrossfadeRgbwNode () {
                this.properties = {
                    'ObjectType': 'MyNodes.Nodes.RgbCrossfadeRgbwNode',
                    'Assembly': 'Nodes, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null'
                };
            }
            RgbCrossfadeRgbwNode.title = 'Crossfade RGBW';
            LiteGraph.registerNodeType('RGB/Crossfade RGBW', RgbCrossfadeRgbwNode);

            

            //RgbFadeRgbNode
            function RgbFadeRgbNode () {
                this.properties = {
                    'ObjectType': 'MyNodes.Nodes.RgbFadeRgbNode',
                    'Assembly': 'Nodes, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null'
                };
            }
            RgbFadeRgbNode.title = 'Fade RGB';
            LiteGraph.registerNodeType('RGB/Fade RGB', RgbFadeRgbNode);

            

            //RgbFadeRgbwNode
            function RgbFadeRgbwNode () {
                this.properties = {
                    'ObjectType': 'MyNodes.Nodes.RgbFadeRgbwNode',
                    'Assembly': 'Nodes, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null'
                };
            }
            RgbFadeRgbwNode.title = 'Fade RGBW';
            LiteGraph.registerNodeType('RGB/Fade RGBW', RgbFadeRgbwNode);

            

            //RgbNumbersToRgbNode
            function RgbNumbersToRgbNode () {
                this.properties = {
                    'ObjectType': 'MyNodes.Nodes.Nodes.RgbNumbersToRgbNode',
                    'Assembly': 'Nodes, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null'
                };
            }
            RgbNumbersToRgbNode.title = 'Numbers to RGB';
            LiteGraph.registerNodeType('RGB/Numbers to RGB', RgbNumbersToRgbNode);

            

            //RgbNumbersToRgbwNode
            function RgbNumbersToRgbwNode () {
                this.properties = {
                    'ObjectType': 'MyNodes.Nodes.Nodes.RgbNumbersToRgbwNode',
                    'Assembly': 'Nodes, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null'
                };
            }
            RgbNumbersToRgbwNode.title = 'Numbers to RGBW';
            LiteGraph.registerNodeType('RGB/Numbers to RGBW', RgbNumbersToRgbwNode);

            

            //RgbRandomRgbNode
            function RgbRandomRgbNode () {
                this.properties = {
                    'ObjectType': 'MyNodes.Nodes.RgbRandomRgbNode',
                    'Assembly': 'Nodes, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null'
                };
            }
            RgbRandomRgbNode.title = 'Random RGB';
            LiteGraph.registerNodeType('RGB/Random RGB', RgbRandomRgbNode);

            

            //RgbRandomRgbwNode
            function RgbRandomRgbwNode () {
                this.properties = {
                    'ObjectType': 'MyNodes.Nodes.RgbRandomRgbwNode',
                    'Assembly': 'Nodes, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null'
                };
            }
            RgbRandomRgbwNode.title = 'Random RGBW';
            LiteGraph.registerNodeType('RGB/Random RGBW', RgbRandomRgbwNode);

            

            //RgbRgbRemapNode
            function RgbRgbRemapNode () {
                this.properties = {
                    'ObjectType': 'MyNodes.Nodes.Nodes.RgbRgbRemapNode',
                    'Assembly': 'Nodes, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null'
                };
            }
            RgbRgbRemapNode.title = 'RGB Remap';
            LiteGraph.registerNodeType('RGB/RGB Remap', RgbRgbRemapNode);

            

            //RgbRgbToNumbersNode
            function RgbRgbToNumbersNode () {
                this.properties = {
                    'ObjectType': 'MyNodes.Nodes.Nodes.RgbRgbToNumbersNode',
                    'Assembly': 'Nodes, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null'
                };
            }
            RgbRgbToNumbersNode.title = 'RGB to Numbers';
            LiteGraph.registerNodeType('RGB/RGB to Numbers', RgbRgbToNumbersNode);

            

            //RgbRgbwRemapNode
            function RgbRgbwRemapNode () {
                this.properties = {
                    'ObjectType': 'MyNodes.Nodes.Nodes.RgbRgbwRemapNode',
                    'Assembly': 'Nodes, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null'
                };
            }
            RgbRgbwRemapNode.title = 'RGBW Remap';
            LiteGraph.registerNodeType('RGB/RGBW Remap', RgbRgbwRemapNode);

            

            //RgbRgbwToNumbersNode
            function RgbRgbwToNumbersNode () {
                this.properties = {
                    'ObjectType': 'MyNodes.Nodes.Nodes.RgbRgbwToNumbersNode',
                    'Assembly': 'Nodes, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null'
                };
            }
            RgbRgbwToNumbersNode.title = 'RGBW to Numbers';
            LiteGraph.registerNodeType('RGB/RGBW to Numbers', RgbRgbwToNumbersNode);

            

            //RgbSmoothRgbNode
            function RgbSmoothRgbNode () {
                this.properties = {
                    'ObjectType': 'MyNodes.Nodes.RgbSmoothRgbNode',
                    'Assembly': 'Nodes, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null'
                };
            }
            RgbSmoothRgbNode.title = 'Smooth RGB';
            LiteGraph.registerNodeType('RGB/Smooth RGB', RgbSmoothRgbNode);

            

            //RgbSmoothRgbwNode
            function RgbSmoothRgbwNode () {
                this.properties = {
                    'ObjectType': 'MyNodes.Nodes.RgbSmoothRgbwNode',
                    'Assembly': 'Nodes, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null'
                };
            }
            RgbSmoothRgbwNode.title = 'Smooth RGBW';
            LiteGraph.registerNodeType('RGB/Smooth RGBW', RgbSmoothRgbwNode);

            

            //SystemFileNode
            function SystemFileNode () {
                this.properties = {
                    'ObjectType': 'MyNodes.Nodes.SystemFileNode',
                    'Assembly': 'Nodes, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null'
                };
            }
            SystemFileNode.title = 'File';
            LiteGraph.registerNodeType('System/File', SystemFileNode);

            

            //SystemJsonFileNode
            function SystemJsonFileNode () {
                this.properties = {
                    'ObjectType': 'MyNodes.Nodes.SystemJsonFileNode',
                    'Assembly': 'Nodes, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null'
                };
            }
            SystemJsonFileNode.title = 'Json File';
            LiteGraph.registerNodeType('System/Json File', SystemJsonFileNode);

            

            //SystemRunNode
            function SystemRunNode () {
                this.properties = {
                    'ObjectType': 'MyNodes.Nodes.SystemRunNode',
                    'Assembly': 'Nodes, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null'
                };
            }
            SystemRunNode.title = 'Run';
            LiteGraph.registerNodeType('System/Run', SystemRunNode);

            

            //TextASCIICharNode
            function TextASCIICharNode () {
                this.properties = {
                    'ObjectType': 'MyNodes.Nodes.TextASCIICharNode',
                    'Assembly': 'Nodes, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null'
                };
            }
            TextASCIICharNode.title = 'ASCII Char';
            LiteGraph.registerNodeType('Text/ASCII Char', TextASCIICharNode);

            

            //TextASCIICodeNode
            function TextASCIICodeNode () {
                this.properties = {
                    'ObjectType': 'MyNodes.Nodes.TextASCIICodeNode',
                    'Assembly': 'Nodes, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null'
                };
            }
            TextASCIICodeNode.title = 'ASCII Code';
            LiteGraph.registerNodeType('Text/ASCII Code', TextASCIICodeNode);

            

            //TextCharAtIndexNode
            function TextCharAtIndexNode () {
                this.properties = {
                    'ObjectType': 'MyNodes.Nodes.TextCharAtIndexNode',
                    'Assembly': 'Nodes, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null'
                };
            }
            TextCharAtIndexNode.title = 'Char At Index';
            LiteGraph.registerNodeType('Text/Char At Index', TextCharAtIndexNode);

            

            //TextConcatenationNode
            function TextConcatenationNode () {
                this.properties = {
                    'ObjectType': 'MyNodes.Nodes.TextConcatenationNode',
                    'Assembly': 'Nodes, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null'
                };
            }
            TextConcatenationNode.title = 'Concatenation';
            LiteGraph.registerNodeType('Text/Concatenation', TextConcatenationNode);

            

            //TextCutSubstringNode
            function TextCutSubstringNode () {
                this.properties = {
                    'ObjectType': 'MyNodes.Nodes.TextCutSubstringNode',
                    'Assembly': 'Nodes, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null'
                };
            }
            TextCutSubstringNode.title = 'Cut Substring';
            LiteGraph.registerNodeType('Text/Cut Substring', TextCutSubstringNode);

            

            //TextSplitStringsNode
            function TextSplitStringsNode () {
                this.properties = {
                    'ObjectType': 'MyNodes.Nodes.TextSplitStringsNode',
                    'Assembly': 'Nodes, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null'
                };
            }
            TextSplitStringsNode.title = 'Split Strings';
            LiteGraph.registerNodeType('Text/Split Strings', TextSplitStringsNode);

            

            //TextStringLengthNode
            function TextStringLengthNode () {
                this.properties = {
                    'ObjectType': 'MyNodes.Nodes.TextStringLengthNode',
                    'Assembly': 'Nodes, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null'
                };
            }
            TextStringLengthNode.title = 'String Length';
            LiteGraph.registerNodeType('Text/String Length', TextStringLengthNode);

            

            //TimeClockNode
            function TimeClockNode () {
                this.properties = {
                    'ObjectType': 'MyNodes.Nodes.TimeClockNode',
                    'Assembly': 'Nodes, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null'
                };
            }
            TimeClockNode.title = 'Clock';
            LiteGraph.registerNodeType('Time/Clock', TimeClockNode);

            

            //TimeDelayNode
            function TimeDelayNode () {
                this.properties = {
                    'ObjectType': 'MyNodes.Nodes.TimeDelayNode',
                    'Assembly': 'Nodes, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null'
                };
            }
            TimeDelayNode.title = 'Delay';
            LiteGraph.registerNodeType('Time/Delay', TimeDelayNode);

            

            //TimeDelayMeterNode
            function TimeDelayMeterNode () {
                this.properties = {
                    'ObjectType': 'MyNodes.Nodes.TimeDelayMeterNode',
                    'Assembly': 'Nodes, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null'
                };
            }
            TimeDelayMeterNode.title = 'Delay Meter';
            LiteGraph.registerNodeType('Time/Delay Meter', TimeDelayMeterNode);

            

            //TimeFadeNode
            function TimeFadeNode () {
                this.properties = {
                    'ObjectType': 'MyNodes.Nodes.TimeFadeNode',
                    'Assembly': 'Nodes, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null'
                };
            }
            TimeFadeNode.title = 'Fade';
            LiteGraph.registerNodeType('Time/Fade', TimeFadeNode);

            

            //TimeFrequencyMeterNode
            function TimeFrequencyMeterNode () {
                this.properties = {
                    'ObjectType': 'MyNodes.Nodes.TimeFrequencyMeterNode',
                    'Assembly': 'Nodes, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null'
                };
            }
            TimeFrequencyMeterNode.title = 'Frequency Meter';
            LiteGraph.registerNodeType('Time/Frequency Meter', TimeFrequencyMeterNode);

            

            //TimeIntervalTimerNode
            function TimeIntervalTimerNode () {
                this.properties = {
                    'ObjectType': 'MyNodes.Nodes.TimeIntervalTimerNode',
                    'Assembly': 'Nodes, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null'
                };
            }
            TimeIntervalTimerNode.title = 'Interval Timer';
            LiteGraph.registerNodeType('Time/Interval Timer', TimeIntervalTimerNode);

            

            //TimeIteratorNode
            function TimeIteratorNode () {
                this.properties = {
                    'ObjectType': 'MyNodes.Nodes.TimeIteratorNode',
                    'Assembly': 'Nodes, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null'
                };
            }
            TimeIteratorNode.title = 'Iterator';
            LiteGraph.registerNodeType('Time/Iterator', TimeIteratorNode);

            

            //TimeSmoothByRangeNode
            function TimeSmoothByRangeNode () {
                this.properties = {
                    'ObjectType': 'MyNodes.Nodes.TimeSmoothByRangeNode',
                    'Assembly': 'Nodes, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null'
                };
            }
            TimeSmoothByRangeNode.title = 'Smooth By Range';
            LiteGraph.registerNodeType('Time/Smooth By Range', TimeSmoothByRangeNode);

            

            //TimeSmoothByTimeNode
            function TimeSmoothByTimeNode () {
                this.properties = {
                    'ObjectType': 'MyNodes.Nodes.TimeSmoothByTimeNode',
                    'Assembly': 'Nodes, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null'
                };
            }
            TimeSmoothByTimeNode.title = 'Smooth By Time';
            LiteGraph.registerNodeType('Time/Smooth By Time', TimeSmoothByTimeNode);

            

            //TimeTickerNode
            function TimeTickerNode () {
                this.properties = {
                    'ObjectType': 'MyNodes.Nodes.TimeTickerNode',
                    'Assembly': 'Nodes, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null'
                };
            }
            TimeTickerNode.title = 'Ticker';
            LiteGraph.registerNodeType('Time/Ticker', TimeTickerNode);

            

            //UiAudioNode
            function UiAudioNode () {
                this.properties = {
                    'ObjectType': 'MyNodes.Nodes.UiAudioNode',
                    'Assembly': 'Nodes.UI, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null'
                };
            }
            UiAudioNode.title = 'Audio';
            LiteGraph.registerNodeType('UI/Audio', UiAudioNode);

            

            //UiButtonNode
            function UiButtonNode () {
                this.properties = {
                    'ObjectType': 'MyNodes.Nodes.UiButtonNode',
                    'Assembly': 'Nodes.UI, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null'
                };
            }
            UiButtonNode.title = 'Button';
            LiteGraph.registerNodeType('UI/Button', UiButtonNode);

            

            //UiChartNode
            function UiChartNode () {
                this.properties = {
                    'ObjectType': 'MyNodes.Nodes.UiChartNode',
                    'Assembly': 'Nodes.UI, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null'
                };
            }
            UiChartNode.title = 'Chart';
            LiteGraph.registerNodeType('UI/Chart', UiChartNode);

            

            //UiLabelNode
            function UiLabelNode () {
                this.properties = {
                    'ObjectType': 'MyNodes.Nodes.UiLabelNode',
                    'Assembly': 'Nodes.UI, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null'
                };
            }
            UiLabelNode.title = 'Label';
            LiteGraph.registerNodeType('UI/Label', UiLabelNode);

            

            //UiLogNode
            function UiLogNode () {
                this.properties = {
                    'ObjectType': 'MyNodes.Nodes.UiLogNode',
                    'Assembly': 'Nodes.UI, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null'
                };
            }
            UiLogNode.title = 'Log';
            LiteGraph.registerNodeType('UI/Log', UiLogNode);

            

            //UiProgressNode
            function UiProgressNode () {
                this.properties = {
                    'ObjectType': 'MyNodes.Nodes.UiProgressNode',
                    'Assembly': 'Nodes.UI, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null'
                };
            }
            UiProgressNode.title = 'Progress';
            LiteGraph.registerNodeType('UI/Progress', UiProgressNode);

            

            //UiRgbSlidersNode
            function UiRgbSlidersNode () {
                this.properties = {
                    'ObjectType': 'MyNodes.Nodes.UiRgbSlidersNode',
                    'Assembly': 'Nodes.UI, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null'
                };
            }
            UiRgbSlidersNode.title = 'RGB Sliders';
            LiteGraph.registerNodeType('UI/RGB Sliders', UiRgbSlidersNode);

            

            //UiRgbwSlidersNode
            function UiRgbwSlidersNode () {
                this.properties = {
                    'ObjectType': 'MyNodes.Nodes.UiRgbwSlidersNode',
                    'Assembly': 'Nodes.UI, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null'
                };
            }
            UiRgbwSlidersNode.title = 'RGBW Sliders';
            LiteGraph.registerNodeType('UI/RGBW Sliders', UiRgbwSlidersNode);

            

            //UiSliderNode
            function UiSliderNode () {
                this.properties = {
                    'ObjectType': 'MyNodes.Nodes.UiSliderNode',
                    'Assembly': 'Nodes.UI, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null'
                };
            }
            UiSliderNode.title = 'Slider';
            LiteGraph.registerNodeType('UI/Slider', UiSliderNode);

            

            //UiStateNode
            function UiStateNode () {
                this.properties = {
                    'ObjectType': 'MyNodes.Nodes.UiStateNode',
                    'Assembly': 'Nodes.UI, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null'
                };
            }
            UiStateNode.title = 'State';
            LiteGraph.registerNodeType('UI/State', UiStateNode);

            

            //UiSwitchNode
            function UiSwitchNode () {
                this.properties = {
                    'ObjectType': 'MyNodes.Nodes.UiSwitchNode',
                    'Assembly': 'Nodes.UI, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null'
                };
            }
            UiSwitchNode.title = 'Switch';
            LiteGraph.registerNodeType('UI/Switch', UiSwitchNode);

            

            //UiTextBoxNode
            function UiTextBoxNode () {
                this.properties = {
                    'ObjectType': 'MyNodes.Nodes.UiTextBoxNode',
                    'Assembly': 'Nodes.UI, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null'
                };
            }
            UiTextBoxNode.title = 'TextBox';
            LiteGraph.registerNodeType('UI/TextBox', UiTextBoxNode);

            

            //UiTimerNode
            function UiTimerNode() {
                this.properties = {
                    'ObjectType': 'MyNodes.Nodes.UiTimerNode',
                    'Assembly': 'Nodes.UI'
                };
            }
            UiTimerNode.prototype.getExtraMenuOptions = function(graphcanvas)
            {
                var that = this;
                return [
                { content: 'Open interface', callback: function() { var win = window.open('/UITimer/Tasks/' + that.id, '_blank'); win.focus(); } }
                    , null
                ];
            }
            UiTimerNode.title = 'Timer';
            LiteGraph.registerNodeType('UI/Timer', UiTimerNode);

            

            //UiToggleButtonNode
            function UiToggleButtonNode () {
                this.properties = {
                    'ObjectType': 'MyNodes.Nodes.UiToggleButtonNode',
                    'Assembly': 'Nodes.UI, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null'
                };
            }
            UiToggleButtonNode.title = 'Toggle';
            LiteGraph.registerNodeType('UI/Toggle', UiToggleButtonNode);

            

            //UiVoiceGoogleNode
            function UiVoiceGoogleNode () {
                this.properties = {
                    'ObjectType': 'MyNodes.Nodes.UiVoiceGoogleNode',
                    'Assembly': 'Nodes.UI, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null'
                };
            }
            UiVoiceGoogleNode.title = 'Voice Google';
            LiteGraph.registerNodeType('UI/Voice Google', UiVoiceGoogleNode);

            

            //UiVoiceYandexNode
            function UiVoiceYandexNode () {
                this.properties = {
                    'ObjectType': 'MyNodes.Nodes.UiVoiceYandexNode',
                    'Assembly': 'Nodes.UI, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null'
                };
            }
            UiVoiceYandexNode.title = 'Voice Yandex';
            LiteGraph.registerNodeType('UI/Voice Yandex', UiVoiceYandexNode);

            

            //UtilityBeepNode
            function UtilityBeepNode () {
                this.properties = {
                    'ObjectType': 'MyNodes.Nodes.UtilityBeepNode',
                    'Assembly': 'Nodes, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null'
                };
            }
            UtilityBeepNode.title = 'Beep';
            LiteGraph.registerNodeType('Utility/Beep', UtilityBeepNode);

            
})();