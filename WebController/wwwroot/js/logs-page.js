﻿/*  MyNodes.NET 
    Copyright (C) 2016 Derwish <derwish.pro@gmail.com>
    License: http://www.gnu.org/licenses/gpl-3.0.txt  
*/

var LogRecord = {
    LogRecordSource:
    {
        Gateway:0,
        GatewayMessages:1,
        GatewayDecodedMessages:2,
        DataBase:3,
        NodesEngine:4,
        Nodes:5,
        System:6

    },

    LogRecordType:
    {
        Info:0,
        Error:1
    }
}



var signalRServerConnected;

$(function () {
    //configure signalr
    var clientsHub = $.connection.logsHub;

    //var logType set from ViewBag in View

    clientsHub.client.OnLogRecord = OnLogRecord;


    clientsHub.client.OnGatewayConnected = function () {
        noty({ text: 'Gateway is connected.', type: 'alert', timeout: false });
    };

    clientsHub.client.OnGatewayDisconnected = function () {
        noty({ text: 'Gateway is disconnected!', type: 'error', timeout: false });
    };

    $.connection.hub.start(
    function () {
        clientsHub.server.join(logType);
    });

    $.connection.hub.stateChanged(function (change) {
        if (change.newState === $.signalR.connectionState.reconnecting) {
            noty({ text: 'Web server is not responding!', type: 'error', timeout: false });
            signalRServerConnected = false;
        }
        else if (change.newState === $.signalR.connectionState.connected) {
            if (signalRServerConnected == false) {
                noty({ text: 'Connected to web server.', type: 'alert', timeout: false });
                getGatewayInfo();
            }
            signalRServerConnected = true;
        }
    });


    //clear messages button
    $('#clear-log').on('click', function () {
        $.ajax({
            url: "/Logs/ClearLogs/",
            data: { logType: logType },
            success: function () {
                $('#log').empty();
            }
        });
    });





    //autoscroll
    $(function () {
        var window_height = $(window).height(),
            content_height = window_height - 320;
        $('#log').height(content_height);
    });

    $(window).resize(function () {
        var window_height = $(window).height(),
            content_height = window_height - 320;
        $('#log').height(content_height);
    });


    getLogs();
    getGatewayInfo();
});


function getGatewayInfo() {
    $.ajax({
        url: "/GatewayAPI/GetGatewayInfo/",
        type: "POST",
        success: function (gatewayInfo) {
            if (gatewayInfo.state == 1 || gatewayInfo.state == 2) {
                noty({ text: 'Gateway is not connected!', type: 'error', timeout: false });
            }
        }
    });
}


function getLogs() {
    $.ajax({
        url: "/Logs/GetLogs/",
        type: "POST",
        data: { logType: logType },
        success: function (messages) {
            onReturnMessages(messages);
        }
    });
}

function onReturnMessages(logRecords) {
    for (var i = 0; i < logRecords.length; i++) {
        addRecord(logRecords[i]);
    }
    $('#log').animate({ scrollTop: $('#log').get(0).scrollHeight }, 0);
};


function OnLogRecord(logRecord) {
    addRecord(logRecord);
    $('#log').animate({ scrollTop: $('#log').get(0).scrollHeight }, 0);
};


function addRecord(logRecord) {
    if (logType == "All")
        addSource(logRecord);

    addDate(logRecord);

    
    if (logRecord.Type == LogRecord.LogRecordType.Error) {
        $('#log').append("<span class='error-log-message'>" + logRecord.Message + "</span><br/>");
    } else {
        $('#log').append( logRecord.Message+"<br/>");
    }
};

function addSource(logRecord) {
    switch (logRecord.Source)
    {
        case LogRecord.LogRecordSource.Gateway:
            logRecord.Message= "GATEWAY: " + logRecord.Message;
            break;
        case LogRecord.LogRecordSource.GatewayMessages:
            logRecord.Message = "GATEWAY: " + logRecord.Message;
            break;
        case LogRecord.LogRecordSource.GatewayDecodedMessages:
            logRecord.Message = "GATEWAY: " + logRecord.Message;
            break;
        case LogRecord.LogRecordSource.DataBase:
            logRecord.Message = "DATABASE: " + logRecord.Message;
            break;
        case LogRecord.LogRecordSource.NodesEngine:
            logRecord.Message = "NODES ENGINE: " + logRecord.Message;
            break;
        case LogRecord.LogRecordSource.Nodes:
            logRecord.Message = "NODE: " + logRecord.Message;
            break;
        case LogRecord.LogRecordSource.System:
            logRecord.Message = "SYSTEM: " + logRecord.Message;
            break;
    }
}

function addDate(logRecord) {
    logRecord.Message = moment(logRecord.Date).format("DD.MM.YYYY H:mm:ss") + ": " + logRecord.Message;
    return logRecord;
}