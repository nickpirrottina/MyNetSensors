﻿/*  MyNetSensors 
    Copyright (C) 2015 Derwish <derwish.pro@gmail.com>
    License: http://www.gnu.org/licenses/gpl-3.0.txt  
*/

using System;
using System.Collections.Generic;

namespace MyNetSensors.Gateways.MySensors.Serial
{
    public delegate void OnDataReceivedEventHandler(string message);

    public interface IComPort
    {
        event OnDataReceivedEventHandler OnDataReceived;
        event Action OnConnected;
        event Action OnDisconnected;
        event ExceptionEventHandler OnWritingError;
        event ExceptionEventHandler OnConnectingError;
        event LogEventHandler OnLogMessage;
        event LogEventHandler OnLogInfo;
        event LogEventHandler OnLogError;

        List<string> GetPortsList();
        void Connect(string portName, int baudRate= 115200);
        void Disconnect();
        void SendMessage(string message);
        bool IsConnected();
        string GetPortName();
    }
}
