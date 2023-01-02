var now = new Date();

var startYear = now.getUTCFullYear();
var startMonth = now.getUTCMonth() + 1;
var startDay = now.getUTCDate();
if (startMonth < 10) {
    startMonth = '0' + startMonth;
}
if (startDay < 10) {
    startDay = '0' + startDay;
}

var startDate = new Date(Date.UTC(startYear, startMonth - 1, startDay));

var dateString = startYear + '-' + startMonth + '-' + startDay + '/P7M';
//var dateString = startYear + '-' + startMonth + '-' + startDay + 'T00:00:00Z/P7M';

var dateString_era5 = startYear.toString() + startMonth + startDay + '0000';

/* var endDate = new Date();
endDate.setMonth(endDate.getUTCMonth() + 8);

var endMonth = endDate.getUTCMonth();
if (endMonth < 10) {
    endMonth = '0' + endMonth;
}

var dateString_ecbsf = endDate.getUTCFullYear() + endMonth + '040000'; */

var endDate = new Date();

if (endDate.getUTCDate() < 15) {
    endDate.setMonth(endDate.getUTCMonth() + 6);
} else {
    endDate.setMonth(endDate.getUTCMonth() + 7);
}

var endMonth = endDate.getUTCMonth() + 1;
if (endMonth < 10) {
    endMonth = '0' + endMonth;
}
var dateString_ecbsf = endDate.getUTCFullYear().toString() + endMonth + '040000';



//console.debug(startDate)
//console.debug(dateString)
//console.debug(dateString_ecbsf)


//var latlonPoint = 'Kajaani';
var latlonPoint;
var perturbations = 50;

/* Dygraph.prototype.doZoomX_ = function(lowX, highX) {
    return;
}; */

Dygraph.prototype.doZoomY_ = function (lowY, highY) {
    return;
};

/* var dyGraphBOptions = {
    //title: latlonPoint,
    //titleHeight: 28,
    drawAxesAtZero: false,
    legend: 'always',
    ylabel: "Trafficability",
    labels: ["date", "Summer Index", "Winter Index"],
    //labels: ["date", "Harvestability Index"],
    //labels: ["date", "Harvestability Index SW", "Harvestability Index ST", "Harvestability Index HS"],
    labelsDiv: "labelsB",
    connectSeparatedPoints: true,
    series: {
        //"Harvestability Index": { fillGraph: true },
        "Summer Index": { fillGraph: true },
        "Winter Index": { fillGraph: true },
    },
    axes: {
        y: { 
            valueRange: [-0.1, 2.1], 
            pixelsPerLabel: 20,
            axisLabelFormatter: function(y) {
                if (y == 0) { return 'Bad'; }
                if (y == 2) { return 'Good'; }
            }
        }
    },
    //interactionModel:{'click': timeserieclick},
    //underlayCallback: timeseriedateline,
    //clickCallback: timeserieclick,
    zoomCallback: function() {
        this.resetZoom();
      },
} */

var dyGraphBOptions_era5 = {
    drawAxesAtZero: false,
    legend: 'always',
    //ylabel: "Trafficability",
    //labels: ["date", "Summer Index", "Winter Index"],
    labels: ["date", "Summer Observation", "Winter Observation"],
    labelsDiv: "labelsB_era5",
    connectSeparatedPoints: true,
    series: {
        //"Summer Index": { fillGraph: true },
        //"Winter Index": { fillGraph: true },
        "Summer Observation": { strokeWidth: 3, color: 'black' },
        "Winter Observation": { strokeWidth: 3, color: 'red' },
    },
    axes: {
        y: {
            valueRange: [-0.1, 2.1],
            pixelsPerLabel: 20,
            axisLabelFormatter: function (y) {
                if (y == 0) { return 'Bad'; }
                if (y == 2) { return 'Good'; }
            }
        }
    },
    /*     zoomCallback: function() {
            this.resetZoom();
          }, */
}

var dyGraphBOptions_fmi = {
    drawAxesAtZero: false,
    legend: 'always',
    //ylabel: "Trafficability",
    labels: ["date", "Summer Forecast", "Winter Forecast", "Summer Observation", "Winter Observation"],
    labelsDiv: "labelsB_fmi",
    connectSeparatedPoints: true,
    series: {
        "Summer Forecast": { fillGraph: true, color: 'green' },
        "Winter Forecast": { fillGraph: true, color: 'rgb(0,0,150)' },
        "Summer Observation": { fillGraph: true, strokeWidth: 3, color: 'rgb(75,75,75)' },
        "Winter Observation": { fillGraph: true, strokeWidth: 3, color: 'rgb(150,0,0)' },
    },
    axes: {
        y: {
            valueRange: [-0.1, 2.1],
            pixelsPerLabel: 20,
            axisLabelFormatter: function (y) {
                if (y == 0) { return 'Bad'; }
                if (y == 2) { return 'Good'; }
            }
        }
    },
    /*     zoomCallback: function() {
            this.resetZoom();
          }, */
}

var dyGraphBOptions_ecsf = {
    drawAxesAtZero: false,
    legend: 'always',
    //ylabel: "Trafficability",
    labels: ["date", "Summer Forecast", "Winter Forecast", "Summer Observation", "Winter Observation"],
    labelsDiv: "labelsB_ecsf",
    connectSeparatedPoints: true,
    series: {
        "Summer Forecast": { fillGraph: true, color: 'green' },
        "Winter Forecast": { fillGraph: true, color: 'rgb(0,0,150)' },
        "Summer Observation": { fillGraph: true, strokeWidth: 3, color: 'rgb(75,75,75)' },
        "Winter Observation": { fillGraph: true, strokeWidth: 3, color: 'rgb(150,0,0)' },
    },
    axes: {
        y: {
            valueRange: [-0.1, 2.1],
            pixelsPerLabel: 20,
            axisLabelFormatter: function (y) {
                if (y == 0) { return 'Bad'; }
                if (y == 2) { return 'Good'; }
            }
        }
    },
    /*     zoomCallback: function() {
            this.resetZoom();
          }, */
}

var dyGraphBOptions_ecbsf = {
    drawAxesAtZero: false,
    legend: 'always',
    //ylabel: "Trafficability",
    //labels: ["date", "Summer Index", "Winter Index"],
    labels: ["date", "Summer Forecast", "Winter Forecast", "Summer Observation", "Winter Observation"],
    labelsDiv: "labelsB_ecbsf",
    connectSeparatedPoints: true,
    series: {
        //"Summer Index": { fillGraph: true },
        //"Winter Index": { fillGraph: true },
        "Summer Forecast": { fillGraph: true, color: 'green' },
        "Winter Forecast": { fillGraph: true, color: 'rgb(0,0,150)' },
        "Summer Observation": { fillGraph: true, strokeWidth: 3, color: 'rgb(75,75,75)' },
        "Winter Observation": { fillGraph: true, strokeWidth: 3, color: 'rgb(150,0,0)' },
    },
    axes: {
        y: {
            valueRange: [-0.1, 2.1],
            pixelsPerLabel: 20,
            axisLabelFormatter: function (y) {
                if (y == 0) { return 'Bad'; }
                if (y == 2) { return 'Good'; }
            }
        }
    },
    /*     zoomCallback: function() {
            this.resetZoom();
          }, */
}

var dyGraphBOptions_ecb2sf = {
    drawAxesAtZero: false,
    legend: 'always',
    //ylabel: "Trafficability",
    //labels: ["date", "Summer Observation", "Winter Observation", "Summer Forecast", "Winter Forecast"],
    labels: ["date", "Summer Forecast", "Winter Forecast", "Summer Observation", "Winter Observation"],
    labelsDiv: "labelsB_ecb2sf",
    connectSeparatedPoints: true,
    series: {
        "Summer Forecast": { fillGraph: true, color: 'green' },
        "Winter Forecast": { fillGraph: true, color: 'rgb(0,0,150)' },
        "Summer Observation": { fillGraph: true, strokeWidth: 3, color: 'rgb(75,75,75)' },
        "Winter Observation": { fillGraph: true, strokeWidth: 3, color: 'rgb(150,0,0)' },
    },
    axes: {
        y: {
            valueRange: [-0.1, 2.1],
            pixelsPerLabel: 20,
            axisLabelFormatter: function (y) {
                if (y == 0) { return 'Bad'; }
                if (y == 2) { return 'Good'; }
            }
        }
    },
    /*     zoomCallback: function() {
            this.resetZoom();
          }, */
}

var SWensemble = "";
var label = ["date", "SW-0"];
var labelstxt = { 'SW-0': { fillGraph: true } };
for (i = 1; i <= perturbations; i = i + 1) {
    label[i + 1] = 'SW-' + i;
    labelstxt[label[i]] = { fillGraph: false };
    SWensemble += ",SOILWET1-M:ECBSF::9:7:3:" + i;
}
var dyGraphSWOptions = {
    legend: "always",
    ylabel: "Soil Wetness (m\u00B3/m\u00B3)",
    labels: label,
    series: labelstxt,
    labelsDiv: "labels",
    axes: {
        y: { valueRange: [-0.0, 1.01] },
    },
    //underlayCallback: timeseriedateline,
    //clickCallback: timeserieclick,
    animatedZooms: true,
}
var label = ["date", "ST-0"];
var labelstxt = { 'ST-0': { fillGraph: true } };
var TGKensemble = "";
for (i = 1; i <= perturbations; i = i + 1) {
    label[i + 1] = 'ST-' + i;
    labelstxt[label[i]] = { fillGraph: false };
    TGKensemble = TGKensemble + ",K2C{TSOIL-K:ECBSF::9:7:3:" + i + "}";
}
var dyGraphSTOptions = {
    legend: 'always',
    ylabel: "Soil Temperature (°C)",
    labels: label,
    series: labelstxt,
    labelsDiv: "labels",
    axes: {
        y: { valueRange: [-20, 41] },
    },
    //underlayCallback: timeseriedateline,
    //clickCallback: timeserieclick,
    animatedZooms: true,
}
var SHensemble = "";
var label = ["date", "SH-0"];
var labelstxt = { 'SH-0': { fillGraph: true } };
for (i = 1; i <= perturbations; i = i + 1) {
    label[i + 1] = 'SH-' + i;
    labelstxt[label[i]] = { fillGraph: false };
    SHensemble += ",SD-M:ECBSF::1:0:3:" + i;
}
var dyGraphSHOptions = {
    drawAxesAtZero: true,
    axisLineWidth: 0.5,
    legend: 'always',
    //ylabel: "Snow",
    //labels: ["date", "Snow Height", "Snowfall Accumulation"],
    ylabel: "Snow Height (m)",
    labels: label,
    series: labelstxt,
    connectSeparatedPoints: true,
    labelsDiv: "labels",
    /*series: {
        "Snow Height": { fillGraph: true },
        "Snowfall Accumulation": { fillGraph: true },
    },*/
    includeZero: true,
    //digitsAfterDecimal: 3,
    axes: {
        y: { valueRange: [-0.0, 0.41] },
    },
    //underlayCallback: timeseriedateline,
    //clickCallback: timeserieclick,
    animatedZooms: true,
}

//var dateFixed = false;

var graphLoad_era5, graphLoad_fmi, graphLoad_ecsf, graphLoad_ecbsf, graphLoad_ecb2sf;

//console.debug(document.getElementById("latitude").value)


//latlonPoint = "64.0,27.0";

drawtimeseries();

function drawtimeseries() {
    var lat = document.getElementById("latitude").value;
    var lon = document.getElementById("longitude").value;
    latlonPoint = lat + "," + lon;

    //console.debug(latlonPoint)

   // drawtimeseries_era5();
    drawtimeseries_fmi();
    drawtimeseries_ecsf();
    drawtimeseries_ecbsf();
    drawtimeseries_ecb2sf();
}

// var graphLoad, graphTimer;
// var graphLoad2, graphLoad3, graphLoad4;

function drawtimeseries_ecbsf() {

    document.getElementById("graphB_ecbsf").innerHTML = "Loading...";
    document.getElementById("graphB_ecbsf").style = "line-height: 120px;";

    const param1 = "utctime";
    const param2 = "HARVIDX{0.4;SOILWET1-M:ECBSF::9:7:3:1-50;SOILWET1-M:ECBSF::9:7:1:0}";
    const param3 = "HARVIDX{273;TSOIL-K:ECBSF::9:7:3:1-50;TSOIL-K:ECBSF::9:7:1:0}";
    const param4 = "ensover{0.4;0.9;SD-M:ECBSF::1:0:3:1-50;SD-M:ECBSF::1:0:1:0}";

    //graphLoad_ecbsf = $.getJSON("https://sm.harvesterseasons.com/timeseries?latlon=" + latlonPoint + "&param=" + param1 + "," + param2 + "," + param3 + "," + param4 + "&starttime=data&endtime=data&timestep=data&format=json&source=grid&timeformat=xml",

    const param5 = "HARVIDX{0.4;SOILWET1-M:ERA5}";
    const param6 = "HARVIDX{273;TSOIL-K:ERA5}";
    const param7 = "ensover{0.4;0.9;SD-M:ERA5}";

    graphLoad_ecbsf = $.getJSON("https://sm.harvesterseasons.com/timeseries?latlon=" + latlonPoint + "&param=" + param1 + "," + param2 + "," + param3 + "," + param4 + "," + param5 + "," + param6 + "," + param7 + "&starttime=202005020000&endtime=" + dateString_ecbsf + "&timestep=1440&format=json&source=grid&timeformat=xml&tz=utc",
        function (data) {
            let graphdata = [];
            /*             for (i = 0; i < data.length; i++) {
                            graphdata[i] = [new Date(data[i][param1]), data[i][param2], Math.max(data[i][param3], data[i][param4])];
                        } */
            /*             for (i = 0, k = 0; i < data.length; i++) {
                            if (data[i][param3] !== null || data[i][param4] !== null) {
                                graphdata[k] = [new Date(data[i][param1]), data[i][param2], Math.max(data[i][param3], data[i][param4])];
                                k++;
                            }
                        } */
            for (i = 0, k = 0; i < data.length; i++) {
                if ((data[i][param3] !== null || data[i][param4] !== null) && (data[i][param6] !== null || data[i][param7] !== null)) {
                    graphdata[k] = [new Date(data[i][param1]), data[i][param2], Math.max(data[i][param3], data[i][param4]), data[i][param5], Math.max(data[i][param6], data[i][param7])];
                    k++;
                } else if (data[i][param3] !== null || data[i][param4] !== null) {
                    graphdata[k] = [new Date(data[i][param1]), data[i][param2], Math.max(data[i][param3], data[i][param4]), data[i][param5], 'nan'];
                    k++;
                } else if (data[i][param6] !== null || data[i][param7] !== null) {
                    graphdata[k] = [new Date(data[i][param1]), data[i][param2], 'nan', data[i][param5], Math.max(data[i][param6], data[i][param7])];
                    k++;
                } else {
                    graphdata[k] = [new Date(data[i][param1]), data[i][param2], 'nan', data[i][param5], 'nan'];
                    k++;
                }
            }

            if (graphdata.length > 0) {
                //console.debug(graphdata_ecbsf.length)
                //console.debug(param2)
                //console.debug(data)

                gB_ecbsf = new Dygraph(
                    document.getElementById("graphB_ecbsf"),
                    graphdata,
                    dyGraphBOptions_ecbsf
                );
                document.getElementById("graphB_ecbsf").style = "line-height: 1;";

                if (typeof gB_fmi !== 'undefined' && typeof gB_ecsf !== 'undefined' && typeof gB_ecbsf !== 'undefined' && typeof gB_ecb2sf !== 'undefined') {
                    var sync = Dygraph.synchronize(gB_fmi, gB_ecsf, gB_ecbsf, gB_ecb2sf);
                    gB_ecsf.updateOptions({ dateWindow: gB_ecbsf.xAxisExtremes() })
                }

/*                 if (typeof gB_era5 !== 'undefined' && gB_fmi !== 'undefined' && typeof gB_ecsf !== 'undefined' && typeof gB_ecbsf !== 'undefined' && typeof gB_ecb2sf !== 'undefined') {
                    var sync = Dygraph.synchronize(gB_era5, gB_fmi, gB_ecsf, gB_ecbsf, gB_ecb2sf);
                    gB_ecsf.updateOptions({ dateWindow: gB_ecbsf.xAxisExtremes() })
                }
 */                /* if (typeof gB_ecsf !== 'undefined' && typeof gB_ecbsf !== 'undefined') {
                    var sync = Dygraph.synchronize(gB_ecsf, gB_ecbsf);
                    gB_ecsf.updateOptions({dateWindow: gB_ecbsf.xAxisExtremes()})                    
                } */
            } else {
                document.getElementById("graphB_ecbsf").innerHTML = "Error loading data";
            }

            /*             graphLoad3 = $.get("https://sm.harvesterseasons.com/timeseries?latlon=" + latlonPoint + "&param=utctime,SOILWET1-M:ECBSF::9:7:1:0" + SWensemble + "&starttime=data&endtime=data&timestep=data&timeformat=sql&precision=full&separator=,&source=grid",
                            function (data) {
                                if (data.length > 0) {
                                    gsw = new Dygraph(
                                        document.getElementById("graphsw"),
                                        data,
                                        dyGraphSWOptions
                                    );
                                    document.getElementById("graphsw").style = "line-height: 1;";
                                } else {
                                    document.getElementById("graphsw").innerHTML = "Error loading data";
                                }
                            })
            
                        graphLoad4 = $.get("https://sm.harvesterseasons.com/timeseries?latlon=" + latlonPoint + "&param=utctime,K2C{TSOIL-K:ECBSF::9:7:1:0}" + TGKensemble + "&starttime=data&endtime=data&timestep=data&timeformat=sql&separator=,&precision=full&source=grid",
                            function (data) {
                                if (data.length > 0) {
                                    gst = new Dygraph(
                                        document.getElementById("graphst"),
                                        data,
                                        dyGraphSTOptions
                                    );
                                } else {
                                    document.getElementById("graphst").innerHTML = "Error loading data";
                                    document.getElementById("graphst").style = "line-height: 240px;";
                                }
                            });
            
                        graphLoad2 = $.get("https://sm.harvesterseasons.com/timeseries?latlon=" + latlonPoint + "&param=utctime,SD-M:ECBSF::1:0:1:0" + SHensemble + "&starttime=data&endtime=data&timestep=data&timeformat=sql&precision=full&separator=,&source=grid",
                            function (data) {
                                if (data.length > 0) {
                                    gsh = new Dygraph(
                                        document.getElementById("graphsh"),
                                        data,
                                        dyGraphSHOptions
                                    );
                                } else {
                                    document.getElementById("graphsh").innerHTML = "Error loading data";
                                    document.getElementById("graphsh").style = "line-height: 240px;";
                                }
                            }); */
        });
}

function drawtimeseries_ecsf() {

    document.getElementById("graphB_ecsf").innerHTML = "Loading...";
    document.getElementById("graphB_ecsf").style = "line-height: 120px;";

    const param1 = "utctime";
    //const param2 = "HARVIDX{0.4;SOILWET1-M:ECSF:5014:9:7:3:1-50;SOILWET1-M:ECSF:5014:9:7:1:0}";
    //const param3 = "HARVIDX{272;TG-K:ECSF:5014:9:7:3:1-50;TG-K:ECSF:5014:9:7:1:0}";
    const param2 = "HARVIDX{0.4;SOILWET1-M:ECSF:5014}";
    const param3 = "HARVIDX{272.45;TG-K:ECSF:5014}";
    //const param4 = "ensover{0.4;0.9;SD-M:ECSF::1:0:3:1-50;SD-M:ECSF::1:0:1:0}";
    //const param4 = "ensover{0.4;0.9;HSNOW-M:ECSF:5014:1:0:3:1-50;HSNOW-M:ECSF:5014:1:0:1:0}";
    const param4="ensover{0.4;0.9;SD-M:ECSF:5014}";

    //const param21 = "SOILWET1-M:ECSF:5014:14:7:1:0";

    //graphLoad_ecsf = $.getJSON("https://sm.harvesterseasons.com/timeseries?latlon=" + latlonPoint + "&param=" + param1 + "," + param2 + "," + param3 + "," + param4 + "&starttime=data&endtime=data&timestep=data&format=json&source=grid&timeformat=xml",
    //graphLoad_ecsf = $.getJSON("https://sm.harvesterseasons.com/timeseries?latlon=" + latlonPoint + "&param=" + param1 + "," + param2 + "," + param3 + "," + param4 + "," + param21 + "&starttime=data&endtime=data&timestep=data&format=json&source=grid&timeformat=xml",

    const param5 = "HARVIDX{0.4;SOILWET1-M:ERA5}";
    const param6 = "HARVIDX{273;TSOIL-K:ERA5}";
    const param7 = "ensover{0.4;0.9;SD-M:ERA5}";

    graphLoad_ecsf = $.getJSON("https://sm.harvesterseasons.com/timeseries?latlon=" + latlonPoint + "&param=" + param1 + "," + param2 + "," + param3 + "," + param4 + "," + param5 + "," + param6 + "," + param7 + "&starttime=202005020000&endtime=" + dateString_ecbsf + "&timestep=1440&format=json&source=grid&timeformat=xml&tz=utc",
        function (data) {
            let graphdata = [];
            /*             for (i = 0; i < data.length; i++) {
                            graphdata[i] = [new Date(data[i][param1]), data[i][param2], Math.max(data[i][param3], data[i][param4])];
                        } */
            /*             for (i = 0, k = 0; i < data.length; i++) {
                            if (data[i][param21] !== null) {
                                graphdata[k] = [new Date(data[i][param1]), data[i][param2], Math.max(data[i][param3], data[i][param4])];
                                k++;
                            }
                        } */
            /*             for (i = 0, k = 0; i < data.length; i++) {
                            if (data[i][param3] !== null || data[i][param4] !== null) {
                                graphdata[k] = [new Date(data[i][param1]), data[i][param2], Math.max(data[i][param3], data[i][param4])];
                                k++;
                            }
                        } */
            for (i = 0, k = 0; i < data.length; i++) {
                if ((data[i][param3] !== null || data[i][param4] !== null) && (data[i][param6] !== null || data[i][param7] !== null)) {
                    graphdata[k] = [new Date(data[i][param1]), data[i][param2], Math.max(data[i][param3], data[i][param4]), data[i][param5], Math.max(data[i][param6], data[i][param7])];
                    k++;
                } else if (data[i][param3] !== null || data[i][param4] !== null) {
                    graphdata[k] = [new Date(data[i][param1]), data[i][param2], Math.max(data[i][param3], data[i][param4]), data[i][param5], 'nan'];
                    k++;
                } else if (data[i][param6] !== null || data[i][param7] !== null) {
                    graphdata[k] = [new Date(data[i][param1]), data[i][param2], 'nan', data[i][param5], Math.max(data[i][param6], data[i][param7])];
                    k++;
                } else {
                    graphdata[k] = [new Date(data[i][param1]), data[i][param2], 'nan', data[i][param5], 'nan'];
                    k++;
                }
            }

            if (graphdata.length > 0) {
                //console.debug(graphdata_ecsf)
                //console.debug(param2)
                //console.debug(data)

                gB_ecsf = new Dygraph(
                    document.getElementById("graphB_ecsf"),
                    graphdata,
                    dyGraphBOptions_ecsf
                );
                document.getElementById("graphB_ecsf").style = "line-height: 1;";

                if (typeof gB_fmi !== 'undefined' && typeof gB_ecsf !== 'undefined' && typeof gB_ecbsf !== 'undefined' && typeof gB_ecb2sf !== 'undefined') {
                    var sync = Dygraph.synchronize(gB_fmi, gB_ecsf, gB_ecbsf, gB_ecb2sf);
                    gB_ecsf.updateOptions({ dateWindow: gB_ecbsf.xAxisExtremes() })
                }
/*                 if (typeof gB_era5 !== 'undefined' && gB_fmi !== 'undefined' && typeof gB_ecsf !== 'undefined' && typeof gB_ecbsf !== 'undefined' && typeof gB_ecb2sf !== 'undefined') {
                    var sync = Dygraph.synchronize(gB_era5, gB_fmi, gB_ecsf, gB_ecbsf, gB_ecb2sf);
                    //gB_era5.updateOptions({dateWindow: gB_ecbsf.xAxisExtremes()})                    
                    gB_ecsf.updateOptions({ dateWindow: gB_ecbsf.xAxisExtremes() })
                } */
                /*                 if (typeof gB_ecsf !== 'undefined' && typeof gB_ecbsf !== 'undefined') {
                                    var sync = Dygraph.synchronize(gB_ecsf, gB_ecbsf);
                                    gB_ecsf.updateOptions({dateWindow: gB_ecbsf.xAxisExtremes()})
                                } */

            } else {
                document.getElementById("graphB_ecsf").innerHTML = "Error loading data";
            }
        });
}


function drawtimeseries_ecb2sf() {

    document.getElementById("graphB_ecb2sf").innerHTML = "Loading...";
    document.getElementById("graphB_ecb2sf").style = "line-height: 120px;";

    const param1 = "utctime";
    const param2 = "HARVIDX{0.4;SOILWET1-M:ECB2SF::9:7:3:1-50;SOILWET1-M:ECB2SF::9:7:1:0}";
    const param3 = "HARVIDX{273;TSOIL-K:ECB2SF::9:7:3:1-50;TSOIL-K:ECB2SF::9:7:1:0}";
    const param4 = "ensover{0.4;0.9;SD-M:ECB2SF::1:0:3:1-50;SD-M:ECB2SF::1:0:1:0}";

    const param5 = "HARVIDX{0.4;SOILWET1-M:ERA5}";
    const param6 = "HARVIDX{273;TSOIL-K:ERA5}";
    //const param4 = "ensover{0.4;0.9;SNOWDEPTH{HSNOW-M:ERA5;SND-KGM3:ERA5}}";
    const param7 = "ensover{0.4;0.9;SD-M:ERA5}";

    //graphLoad_ecb2sf = $.getJSON("https://sm.harvesterseasons.com/timeseries?latlon=" + latlonPoint + "&param=" + param1 + "," + param2 + "," + param3 + "," + param4 + "&starttime=data&endtime=data&timestep=data&format=json&source=grid&timeformat=xml",
    graphLoad_ecb2sf = $.getJSON("https://sm.harvesterseasons.com/timeseries?latlon=" + latlonPoint + "&param=" + param1 + "," + param2 + "," + param3 + "," + param4 + "," + param5 + "," + param6 + "," + param7 + "&starttime=202005020000&endtime=" + dateString_ecbsf + "&timestep=1440&format=json&source=grid&timeformat=xml&tz=utc",
        function (data) {
            let graphdata = [];
            /*                 for (i = 0; i < data.length; i++) {
                                graphdata[i] = [new Date(data[i][param1]), data[i][param2], Math.max(data[i][param3], data[i][param4]), data[i][param5], Math.max(data[i][param6], data[i][param7])];
                            } */
/*             for (i = 0, k = 0; i < data.length; i++) {
                if (data[i][param6] !== null || data[i][param7] !== null) {
                    graphdata[k] = [new Date(data[i][param1]), data[i][param2], Math.max(data[i][param3], data[i][param4]), data[i][param5], Math.max(data[i][param6], data[i][param7])];
                    k++;
                } else {
                    //graphdata[k] = [new Date(data[i][param1]), data[i][param2], 'nan', data[i][param5], Math.max(data[i][param6], data[i][param7])];
                    graphdata[k] = [new Date(data[i][param1]), data[i][param2], Math.max(data[i][param3], data[i][param4]), data[i][param5], 'nan'];
                    k++;
                }
            } */
            for (i = 0, k = 0; i < data.length; i++) {
                if ((data[i][param3] !== null || data[i][param4] !== null) && (data[i][param6] !== null || data[i][param7] !== null)) {
                    graphdata[k] = [new Date(data[i][param1]), data[i][param2], Math.max(data[i][param3], data[i][param4]), data[i][param5], Math.max(data[i][param6], data[i][param7])];
                    k++;
                } else if (data[i][param3] !== null || data[i][param4] !== null) {
                    graphdata[k] = [new Date(data[i][param1]), data[i][param2], Math.max(data[i][param3], data[i][param4]), data[i][param5], 'nan'];
                    k++;
                } else if (data[i][param6] !== null || data[i][param7] !== null) {
                    graphdata[k] = [new Date(data[i][param1]), data[i][param2], 'nan', data[i][param5], Math.max(data[i][param6], data[i][param7])];
                    k++;
                } else {
                    graphdata[k] = [new Date(data[i][param1]), data[i][param2], 'nan', data[i][param5], 'nan'];
                    k++;
                }
            }

            //console.debug(graphdata)

            if (graphdata.length > 0) {
                gB_ecb2sf = new Dygraph(
                    document.getElementById("graphB_ecb2sf"),
                    graphdata,
                    dyGraphBOptions_ecb2sf
                );
                document.getElementById("graphB_ecb2sf").style = "line-height: 1;";

                if (typeof gB_fmi !== 'undefined' && typeof gB_ecsf !== 'undefined' && typeof gB_ecbsf !== 'undefined' && typeof gB_ecb2sf !== 'undefined') {
                    var sync = Dygraph.synchronize(gB_fmi, gB_ecsf, gB_ecbsf, gB_ecb2sf);
                    gB_ecsf.updateOptions({ dateWindow: gB_ecbsf.xAxisExtremes() })
                }
/*                 if (typeof gB_era5 !== 'undefined' && gB_fmi !== 'undefined' && typeof gB_ecsf !== 'undefined' && typeof gB_ecbsf !== 'undefined' && typeof gB_ecb2sf !== 'undefined') {
                    var sync = Dygraph.synchronize(gB_era5, gB_fmi, gB_ecsf, gB_ecbsf, gB_ecb2sf);
                    //gB_era5.updateOptions({dateWindow: gB_ecbsf.xAxisExtremes()})                    
                    gB_ecsf.updateOptions({ dateWindow: gB_ecbsf.xAxisExtremes() })
                } */

            } else {
                document.getElementById("graphB_ecb2sf").innerHTML = "Error loading data";
            }
        });
}

function drawtimeseries_era5() {

    document.getElementById("graphB_era5").innerHTML = "Loading...";
    document.getElementById("graphB_era5").style = "line-height: 120px;";

    const param1 = "utctime";
    const param2 = "HARVIDX{0.4;SOILWET1-M:ERA5}";
    const param3 = "HARVIDX{273;TSOIL-K:ERA5}";
    //const param4 = "ensover{0.4;0.9;SNOWDEPTH{HSNOW-M:ERA5;SND-KGM3:ERA5}}";
    const param4 = "ensover{0.4;0.9;SD-M:ERA5}";

    //const param21 = "SOILWET1-M:ERA5";

    //graphLoad_era5 = $.getJSON("https://sm.harvesterseasons.com/timeseries?latlon=" + latlonPoint + "&param=" + param1 + "," + param2 + "," + param3 + "," + param4 + "," + param21 + "&starttime=202005020000&endtime=" + dateString_era5 + "&timestep=1440&format=json&source=grid&timeformat=xml&tz=utc",
    graphLoad_era5 = $.getJSON("https://sm.harvesterseasons.com/timeseries?latlon=" + latlonPoint + "&param=" + param1 + "," + param2 + "," + param3 + "," + param4 + "&starttime=202005020000&endtime=" + dateString_era5 + "&timestep=1440&format=json&source=grid&timeformat=xml&tz=utc",
        function (data) {
            let graphdata = [];
            /*                 for (i = 0, k = 0; i < data.length; i++) {
                                if (data[i][param21] !== null) {
                                    graphdata[k] = [new Date(data[i][param1]), data[i][param2], Math.max(data[i][param3], data[i][param4])];
                                    k++;
                                }
                            } */
            for (i = 0, k = 0; i < data.length; i++) {
                if (data[i][param3] !== null || data[i][param4] !== null) {
                    graphdata[k] = [new Date(data[i][param1]), data[i][param2], Math.max(data[i][param3], data[i][param4])];
                    k++;
                }
            }

            if (graphdata.length > 0) {
                //console.debug(graphdata_era5)
                //console.debug(param2)
                //console.debug(data)

                gB_era5 = new Dygraph(
                    document.getElementById("graphB_era5"),
                    graphdata,
                    dyGraphBOptions_era5
                );
                document.getElementById("graphB_era5").style = "line-height: 1;";

                if (typeof gB_fmi !== 'undefined' && typeof gB_ecsf !== 'undefined' && typeof gB_ecbsf !== 'undefined' && typeof gB_ecb2sf !== 'undefined') {
                    var sync = Dygraph.synchronize(gB_fmi, gB_ecsf, gB_ecbsf, gB_ecb2sf);
                    gB_ecsf.updateOptions({ dateWindow: gB_ecbsf.xAxisExtremes() })
                }
/*                 if (typeof gB_era5 !== 'undefined' && gB_fmi !== 'undefined' && typeof gB_ecsf !== 'undefined' && typeof gB_ecbsf !== 'undefined' && typeof gB_ecb2sf !== 'undefined') {
                    var sync = Dygraph.synchronize(gB_era5, gB_fmi, gB_ecsf, gB_ecbsf, gB_ecb2sf);
                    //gB_era5.updateOptions({dateWindow: gB_ecbsf.xAxisExtremes()})                    
                    gB_ecsf.updateOptions({ dateWindow: gB_ecbsf.xAxisExtremes() })
                } */
                /*                 if (typeof gB_ecsf !== 'undefined' && typeof gB_ecbsf !== 'undefined') {
                                    var sync = Dygraph.synchronize(gB_ecsf, gB_ecbsf);
                                    gB_ecsf.updateOptions({dateWindow: gB_ecbsf.xAxisExtremes()})
                                } */

            } else {
                document.getElementById("graphB_era5").innerHTML = "Error loading data";
            }
        });
}

function drawtimeseries_fmi() {

    document.getElementById("graphB_fmi").innerHTML = "Loading...";
    document.getElementById("graphB_fmi").style = "line-height: 120px;";

    const param1 = "utctime";
    const param2="HARVIDX{0.4;SWVL2-M3M3:SMARTMET:5015}";
    const param3="HARVIDX{-0.7;TG-K:SMARTMET}";
    const param4 = "ensover{0.4;0.9;SD-M:SMARTMET}";

    //const param21 = "SOILWET1-M:SMARTMET:5015";

    //graphLoad_fmi = $.getJSON("https://sm.harvesterseasons.com/timeseries?latlon=" + latlonPoint + "&param=" + param1 + "," + param2 + "," + param3 + "," + param4 + "," + param21 + "&starttime=202005020000&endtime=" + dateString_era5 + "&timestep=1440&format=json&source=grid&timeformat=xml&tz=utc",
    //graphLoad_fmi = $.getJSON("https://sm.harvesterseasons.com/timeseries?latlon=" + latlonPoint + "&param=" + param1 + "," + param2 + "," + param3 + "," + param4 + "&starttime=202005020000&endtime=" + dateString_era5 + "&timestep=1440&format=json&source=grid&timeformat=xml&tz=utc",
    //graphLoad_fmi = $.getJSON("https://sm.harvesterseasons.com/timeseries?latlon=" + latlonPoint + "&param=" + param1 + "," + param2 + "," + param3 + "," + param4 + "&starttime=data&endtime=data&timestep=data&format=json&source=grid&timeformat=xml",

    const param5 = "HARVIDX{0.4;SOILWET1-M:ERA5}";
    const param6 = "HARVIDX{273;TSOIL-K:ERA5}";
    const param7 = "ensover{0.4;0.9;SD-M:ERA5}";

    graphLoad_fmi = $.getJSON("https://sm.harvesterseasons.com/timeseries?latlon=" + latlonPoint + "&param=" + param1 + "," + param2 + "," + param3 + "," + param4 + "," + param5 + "," + param6 + "," + param7 + "&starttime=202005020000&endtime=" + dateString_ecbsf + "&timestep=1440&format=json&source=grid&timeformat=xml&tz=utc",
        function (data) {
            let graphdata = [];
            /*                     for (i = 0, k = 0; i < data.length; i++) {
                                    if (data[i][param21] !== null) {
                                        graphdata[k] = [new Date(data[i][param1]), data[i][param2], Math.max(data[i][param3], data[i][param4])];
                                        k++;
                                    }
                                } */
            /*                     for (i = 0; i < data.length; i++) {
                                    graphdata[i] = [new Date(data[i][param1]), data[i][param2], Math.max(data[i][param3], data[i][param4])];
                                } */
            /*                     for (i = 0, k = 0; i < data.length; i++) {
                                    // filter out 12:00 observations
                                    if (data[i][param1][11]==0) {
                                        graphdata[k] = [new Date(data[i][param1]), data[i][param2], Math.max(data[i][param3], data[i][param4])];
                                        k++;
                                    }
                                } */
/*             for (i = 0, k = 0; i < data.length; i++) {
                if (data[i][param3] !== null || data[i][param4] !== null) {
                    graphdata[k] = [new Date(data[i][param1]), data[i][param2], Math.max(data[i][param3], data[i][param4])];
                    k++;
                }
            } */
            for (i = 0, k = 0; i < data.length; i++) {
                if ((data[i][param3] !== null || data[i][param4] !== null) && (data[i][param6] !== null || data[i][param7] !== null)) {
                    graphdata[k] = [new Date(data[i][param1]), data[i][param2], Math.max(data[i][param3], data[i][param4]), data[i][param5], Math.max(data[i][param6], data[i][param7])];
                    k++;
                } else if (data[i][param3] !== null || data[i][param4] !== null) {
                    graphdata[k] = [new Date(data[i][param1]), data[i][param2], Math.max(data[i][param3], data[i][param4]), data[i][param5], 'nan'];
                    k++;
                } else if (data[i][param6] !== null || data[i][param7] !== null) {
                    graphdata[k] = [new Date(data[i][param1]), data[i][param2], 'nan', data[i][param5], Math.max(data[i][param6], data[i][param7])];
                    k++;
                } else {
                    graphdata[k] = [new Date(data[i][param1]), data[i][param2], 'nan', data[i][param5], 'nan'];
                    k++;
                }
            }


            if (graphdata.length > 0) {
                //console.debug(graphdata_era5)
                //console.debug(param2)
                //console.debug(data)

                gB_fmi = new Dygraph(
                    document.getElementById("graphB_fmi"),
                    graphdata,
                    dyGraphBOptions_fmi
                );
                document.getElementById("graphB_fmi").style = "line-height: 1;";

                if (typeof gB_fmi !== 'undefined' && typeof gB_ecsf !== 'undefined' && typeof gB_ecbsf !== 'undefined' && typeof gB_ecb2sf !== 'undefined') {
                    var sync = Dygraph.synchronize(gB_fmi, gB_ecsf, gB_ecbsf, gB_ecb2sf);
                    gB_ecsf.updateOptions({ dateWindow: gB_ecbsf.xAxisExtremes() })
                }
/*                 if (typeof gB_era5 !== 'undefined' && gB_fmi !== 'undefined' && typeof gB_ecsf !== 'undefined' && typeof gB_ecbsf !== 'undefined' && typeof gB_ecb2sf !== 'undefined') {
                    var sync = Dygraph.synchronize(gB_era5, gB_fmi, gB_ecsf, gB_ecbsf, gB_ecb2sf);
                    //gB_era5.updateOptions({dateWindow: gB_ecbsf.xAxisExtremes()})                    
                    gB_ecsf.updateOptions({ dateWindow: gB_ecbsf.xAxisExtremes() })
                } */
                /*                 if (typeof gB_ecsf !== 'undefined' && typeof gB_ecbsf !== 'undefined') {
                                    var sync = Dygraph.synchronize(gB_ecsf, gB_ecbsf);
                                    gB_ecsf.updateOptions({dateWindow: gB_ecbsf.xAxisExtremes()})
                                } */

            } else {
                document.getElementById("graphB_fmi").innerHTML = "Error loading data";
            }
        });
}

/* function timeseriedateline(canvas, area, g) {
    var userTimezoneOffset = sliderDate.getTimezoneOffset() * 60000;
    var line = sliderDate.getTime() + userTimezoneOffset;
    var canvasx = g.toDomXCoord(line);
    //var range = g.yAxisRange();

    canvas.fillStyle = 'black';
    canvas.fillRect(canvasx, area.y, 2, area.h);
    //(left, area.y, right - left, area.h);
} */


