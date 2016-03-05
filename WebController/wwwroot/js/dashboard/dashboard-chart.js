﻿/*  MyNodes.NET 
    Copyright (C) 2016 Derwish <derwish.pro@gmail.com>
    License: http://www.gnu.org/licenses/gpl-3.0.txt  
*/



var chartTemplate = Handlebars.compile($('#chartTemplate').html());

var elementsFadeTime = 300;

var CHART_HEIGHT = "190px";




var container = [];
var dataset = [];
var graph2d = [];
var options = [];
var autoScroll = [];
var chartType = [];



function createChart(node) {

    $(chartTemplate(node)).hide().appendTo("#uiContainer-" + node.PanelId).fadeIn(elementsFadeTime);


    $('#chart-clear-' + node.Id).click(function () {
        $.ajax({
            url: "/DashboardAPI/SetValues/",
            type: "POST",
            data: { 'nodeId': node.Id, 'values': { Clear: "true" } },
            success: function () {
                dataset[node.Id].clear();
            }
        });
    });

    $('#chart-now-' + node.Id).click(function () {
        showNow(node.Id);
    });

    $('#chart-all-' + node.Id).click(function () {
        showAll(node.Id);
    });

    $('#chart-style-' + node.Id).click(function () {
        changeStyle(node.Id);
    });



    container[node.Id] = document.getElementById('chart-body-' + node.Id);

    autoScroll[node.Id] = "continuous";

    if (node.Style == null)
        chartType[node.Id] = "bars";
    else
        chartType[node.Id] = node.Style;


    options[node.Id] = {
        height: CHART_HEIGHT,
        style: 'bar',
        drawPoints: false,
        barChart: { width: 50, align: 'right', sideBySide: false }
    };

    dataset[node.Id] = new vis.DataSet();
    graph2d[node.Id] = new vis.Graph2d(container[node.Id], dataset[node.Id], options[node.Id]);

    updateChartType(node.Id);



    //Loading data frow server
    $.ajax({
        url: "/DashboardAPI/GetValue/",
        data: { 'nodeId': node.Id, 'name': "chartData" },
        dataType: "json",
        success: function (chartData) {
           // dataset[node.Id].clear();
            if (chartData != null) {
                addChartData(chartData, node.Id, node.Settings.MaxRecords.Value);

                var options = {
                    start: vis.moment().add(-30, 'seconds'),
                    end: vis.moment()
                };

                graph2d[node.Id].setOptions(options);
            } else {
                showNow(node.Id);
            }
        }
    });
}

var lastChartData = {};


function addChartData(chartData, nodeId, maxRecords) {
    dataset[nodeId].add(chartData);
    if (chartData.length != undefined)
        lastChartData[nodeId] = chartData[chartData.length - 1].x;
    else
        lastChartData[nodeId] = chartData.x;


    //var options = {
    //    dataAxis: {
    //        left: {
    //            range: {
    //                min: Number(dataset[nodeId].min('y').y),
    //                max: Number(dataset[nodeId].max('y').y)
    //            }
    //        }
    //    }
    //};
    //graph2d[nodeId].setOptions(options);

    //graph2d[nodeId].linegraph.options.dataAxis.left.range.min = dataset[nodeId].min('y').y;
    //graph2d[nodeId].linegraph.options.dataAxis.left.range.max = dataset[nodeId].max('y').y;

    var unwanted = dataset[nodeId].length - maxRecords;
    if (unwanted > 0) {
        var items = dataset[nodeId].get();
        for (var i = 0; i < unwanted; i++) {
            dataset[nodeId].remove(items[i]);
        }
    }
}



function updateChart(node) {
    $('#chartName-' + node.Id).html(node.Settings["Name"].Value);

    if (node.LastRecord == null || lastChartData[node.Id] == node.LastRecord.x)
        return;

    addChartData(node.LastRecord, node.Id, node.Settings.MaxRecords.Value);
}


function removeChart(node) {
    graph2d[node.Id].destroy();

    delete container[node.Id];
    delete dataset[node.Id];
    delete graph2d[node.Id];
    delete options[node.Id];
    delete autoScroll[node.Id];
    delete chartType[node.Id];
}



renderStep();

function renderStep() {
    var now = vis.moment();

    for (var i = 0; i < Object.keys(graph2d).length; i++) {
        var key = Object.keys(graph2d)[i];

        var range = graph2d[key].getWindow();
        var interval = range.end - range.start;
        switch (autoScroll[key]) {
            case 'continuous':
                graph2d[key].setWindow(now - interval, now, { animation: false });
                break;
            case 'none':
                break;
            default: // 'static'
                // move the window 90% to the left when now is larger than the end of the window
                if (now > range.end) {
                    graph2d[key].setWindow(now - 0.1 * interval, now + 0.9 * interval);
                }
                break;
        }
    }
    requestAnimationFrame(renderStep);
}






function updateChartType(nodeId) {
    switch (chartType[nodeId]) {
        case 'bars':
            options[nodeId] = {
                height: CHART_HEIGHT,
                style: 'bar',
                drawPoints: false,
                barChart: { width: 50, align: 'right', sideBySide: false }
            };
            break;
        case 'splines':
            options[nodeId] = {
                height: CHART_HEIGHT,
                style: 'line',
                drawPoints: { style: 'circle', size: 6 },
                shaded: { enabled: false },
                interpolation: { enabled: true }
            };
            break;
        case 'shadedsplines':
            options[nodeId] = {
                style: 'line',
                height: CHART_HEIGHT,
                drawPoints: { style: 'circle', size: 6 },
                shaded: { enabled: true, orientation: 'bottom' },
                interpolation: { enabled: true }
            };
            break;
        case 'lines':
            options[nodeId] = {
                height: CHART_HEIGHT,
                style: 'line',
                drawPoints: { style: 'square', size: 6 },
                shaded: { enabled: false },
                interpolation: { enabled: false }
            };
            break;
        case 'shadedlines':
            options[nodeId] = {
                height: CHART_HEIGHT,
                style: 'line',
                drawPoints: { style: 'square', size: 6 },
                shaded: { enabled: true, orientation: 'bottom' },
                interpolation: { enabled: false }
            };
            break;
        case 'dots':
            options[nodeId] = {
                height: CHART_HEIGHT,
                style: 'points',
                drawPoints: { style: 'circle', size: 10 }
            };
            break;
        default:
            break;
    }



    //setOptions cause a bug when switching to dots!!!
    graph2d[nodeId].setOptions(options[nodeId]);
    //thats why we need redraw:
    //redrawChart(options);


}

function redrawChart(options, nodeId) {
    var window = graph2d[node.Id].getWindow();
    options.start = window.start;
    options.end = window.end;
    graph2d[node.Id].destroy();
    graph2d[node.Id] = new vis.Graph2d(container[nodeId], dataset[nodeId], options[nodeId]);
}




var zoomTimer;
function showNow(nodeId) {

    clearTimeout(zoomTimer);
    autoScroll[nodeId] = "none";
    var window = {
        start: vis.moment().add(-30, 'seconds'),
        end: vis.moment()
    };
    graph2d[nodeId].setWindow(window);
    //timer needed for prevent zoomin freeze bug
    zoomTimer = setTimeout(function (parameters) {
        autoScroll[nodeId] = "continuous";
    }, 1000);

}

function showAll(nodeId) {
    clearTimeout(zoomTimer);
    autoScroll[nodeId] = "none";
    //   graph2d.fit();

    var start, end;

    if (dataset[nodeId].length == 0) {
        start = vis.moment().add(-1, 'seconds');
        end = vis.moment().add(60, 'seconds');
    } else {
        var min = dataset[nodeId].min('x');
        var max = dataset[nodeId].max('x');
        start = vis.moment(min.x).add(-1, 'seconds');
        end = vis.moment(max.x).add(60, 'seconds');
    }

    var window = {
        start: start,
        end: end
    };
    graph2d[nodeId].setWindow(window);
}


function changeStyle(nodeId) {
    switch (chartType[nodeId]) {
        case 'bars':
            chartType[nodeId] = 'splines';
            break;
        case 'splines':
            chartType[nodeId] = 'shadedsplines';
            break;
        case 'shadedsplines':
            chartType[nodeId] = 'lines';
            break;
        case 'lines':
            chartType[nodeId] = 'shadedlines';
            break;
        case 'shadedlines':
            chartType[nodeId] = 'dots';
            break;
        case 'dots':
            chartType[nodeId] = 'bars';
            break;
        default:
            break;
    }

    updateChartType(nodeId);

    $.ajax({
        url: "/DashboardAPI/SetValues/",
        type: "POST",
        data: { 'nodeId': nodeId, 'values': { Style: chartType[nodeId] } }
    });
}