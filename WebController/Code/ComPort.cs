﻿/*  MyNetSensors 
    Copyright (C) 2015 Derwish <derwish.pro@gmail.com>
    License: http://www.gnu.org/licenses/gpl-3.0.txt  
*/

using System;
using System.Collections.Generic;
using System.IO.Ports;
using System.Linq;
using MyNetSensors.Gateways;
using MyNetSensors.Gateways.MySensors.Serial;

namespace MyNetSensors.WebController.Code
{
    public class ComPort : IComPort
    {
        public event OnDataReceivedEventHandler OnDataReceived;
        public event Action OnConnected;
        public event Action OnDisconnected;
        public event ExceptionEventHandler OnWritingError;
        public event ExceptionEventHandler OnConnectingError;
        public event LogEventHandler OnLogMessage;
        public event LogEventHandler OnLogInfo;
        public event LogEventHandler OnLogError;

        private bool isConnected;
        private SerialPort serialPort;

        private string portName;

        public bool IsConnected()
        {
            return isConnected;
        }

        public string GetPortName()
        {
            return portName;
        }


        public List<string> GetPortsList()
        {
            return SerialPort.GetPortNames().ToList();
        }
        

        public void Connect(string portName, int baudRate)
        {
            this.portName = portName;

            try
            {
                serialPort = new SerialPort(portName)
                {
                    BaudRate = baudRate,
                    Parity = Parity.None,
                    StopBits = StopBits.One,
                    DataBits = 8
                };
                serialPort.DataReceived += serialPort_DataReceived;
                serialPort.Open();

                isConnected = true;
                LogInfo($"Connected to port {portName}.");
                OnConnected?.Invoke();
            }
            catch (Exception ex)
            {
                LogError($"Failed to connect to port {portName}.");
                OnConnectingError?.Invoke(ex);
            }
        }





        public void SendMessage(string message)
        {
            if (serialPort == null || !isConnected)
            {
                LogError("Failed to write data. Port is not connected.");
                return;
            }

            LogMessage("TX: " + message.TrimEnd('\r', '\n'));

            try
            {
                serialPort.Write(message);
            }
            catch (Exception ex)
            {
                LogError($"Failed to write data. {ex.Message}");

                OnWritingError?.Invoke(ex);

                Disconnect();
            }
        }


        public void Disconnect()
        {
            if (isConnected || serialPort != null)
            {
                isConnected = false;

                //LogPortState("Port disconnected.");

                serialPort?.Dispose();
                serialPort = null;

                OnDisconnected?.Invoke();
            }
        }

        private void serialPort_DataReceived(object sender, SerialDataReceivedEventArgs e)
        {
            string data = serialPort.ReadExisting();
            InvokeDataRecievedEvents(data);
        }

        private void InvokeDataRecievedEvents(string receivedData)
        {
            LogMessage("RX: " + receivedData);

            OnDataReceived?.Invoke(receivedData);
        }



        private void LogMessage(string message)
        {
            OnLogMessage?.Invoke(message);
        }

        private void LogInfo(string message)
        {
            OnLogInfo?.Invoke(message);
        }

        private void LogError(string message)
        {
            OnLogError?.Invoke(message);
        }
    }
}
