// import GeoTIFF, { fromUrl, fromUrls, fromArrayBuffer, fromBlob } from './geotiff.js';
// import GeoTIFF, { fromUrl, fromUrls, fromArrayBuffer } from './node_modules/geotiff/dist-browser/geotiff.js';

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

var dateString = startYear.toString() + '-' + startMonth + '-' + startDay + '/P7M';
//var dateString = startYear + '-' + startMonth + '-' + startDay + 'T00:00:00Z/P7M';

var dateString_era5 = startYear.toString() + startMonth + startDay + '0000';

var dateString_sdate = startYear.toString() + '-' + startMonth + '-' + startDay;

var startMonth_edate = now.getUTCMonth() + 2;
if (startMonth_edate < 10) {
    startMonth_edate = '0' + startMonth_edate;
}
var dateString_edate = startYear.toString() + '-' + startMonth_edate + '-' + startDay;


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

var startDate_timeseries = new Date();

if (startDate_timeseries.getUTCDate() < 15) {
    startDate_timeseries.setMonth(startDate_timeseries.getUTCMonth() - 1);
} 

var startMonth_timeseries = startDate_timeseries.getUTCMonth() + 1;
if (startMonth_timeseries < 10) {
    startMonth_timeseries = '0' + startMonth_timeseries;
}
var dateString_timeseries = startDate_timeseries.getUTCFullYear().toString() + startMonth_timeseries + '020000';


const param1="utctime";
// const param2="HARVIDX{0.4;SOILWET1-M:ECBSF::9:7:3:1-50;SOILWET1-M:ECBSF::9:7:1:0}";
// const param3="HARVIDX{273;TSOIL-K:ECBSF::9:7:3:1-50;TSOIL-K:ECBSF::9:7:1:0}";

const param2="HARVIDX{0.4;SOILWET-M3M3:ECBSF:::7:3:1-50;SOILWET-M3M3:ECBSF:::7:1:0}";
const param3="HARVIDX{273;TSOIL-K:ECBSF:::7:3:1-50;TSOIL-K:ECBSF:::7:1:0}";
const param4="ensover{0.4;0.9;SD-M:ECBSF::1:0:3:1-50;SD-M:ECBSF::1:0:1:0}";

const param5 = "HARVIDX{0.4;SWVL2-M3M3:SMARTMET:5015}";
const param6 = "HARVIDX{-0.7;TG-K:SMARTMET}";
const param7 = "ensover{0.4;0.9;SD-M:SMARTMET:5027}";

const param8 = "ensover{0.4;0.9;HSNOW-M:SMARTOBS:13:4}";

var startDate_smartobs = new Date();
if (startDate_smartobs.getUTCHours() >= 4) {
    startDate_smartobs.setDate(startDate_smartobs.getUTCDate() - 1);
} else {
    startDate_smartobs.setDate(startDate_smartobs.getUTCDate() - 2);
}
var startMonth_smartobs = startDate_smartobs.getUTCMonth() + 1;
if (startMonth_smartobs < 10) {
    startMonth_smartobs = '0' + startMonth_smartobs;
}
var dateString_smartobs = startDate_smartobs.getUTCFullYear().toString() + startMonth_smartobs + startDate_smartobs.getUTCDate();


var perturbations = 50;

var SHensemblelist = ["SD-M:ECBSF::1:0:1:0"];
var SHensemble2 = "DIFF{SD-M:ECBSF::1:0:1:0;HSNOW-M:SMARTOBS:13:4}";
var SHensemble2list = ["DIFF{SD-M:ECBSF::1:0:1:0;HSNOW-M:SMARTOBS:13:4}"];
for (var p = 1; p <= perturbations; p++) {
    SHensemblelist[p] = "SD-M:ECBSF::1:0:3:" + p ;
    SHensemble2 += ",DIFF{SD-M:ECBSF::1:0:3:" + p + ";HSNOW-M:SMARTOBS:13:4}";
    SHensemble2list[p] = "DIFF{SD-M:ECBSF::1:0:3:" + p + ";HSNOW-M:SMARTOBS:13:4}";
}

// var latlonPoint;

/* Dygraph.prototype.doZoomX_ = function(lowX, highX) {
    return;
}; */

// Dygraph.prototype.doZoomY_ = function (lowY, highY) {
//     return;
// };

// var dyGraphBOptions = {
//     //title: latlonPoint,
//     //titleHeight: 28,
//     drawAxesAtZero: false,
//     legend: 'always',
//     // ylabel: "Trafficability",
//     // labels: ["date", "Summer Forecast", "Winter Forecast", "Summer Observation", "Winter Observation"],
//     // labels: ["date", "Summer Index", "Winter Index", "Summer 10 days", "Winter 10 days"],

//     // labels: ["date", "Index", "Index 10 days"],
//     labels: ["date", "KUK", "MÄK", "KOK", "KUT", "MÄT", "KOT"],

//     //labels: ["date", "Summer Index", "Winter Index"],

//     //labels: ["date", "Harvestability Index"],
//     //labels: ["date", "Harvestability Index SW", "Harvestability Index ST", "Harvestability Index HS"],
//     // labelsDiv: "labelsB0",
//     connectSeparatedPoints: true,
//     series: {
//         //"Harvestability Index": { fillGraph: true },
// /*         "Summer Index": { fillGraph: true },
//         "Winter Index": { fillGraph: true }, */
// /*         "Summer Forecast": { fillGraph: true, color: 'green' },
//         "Winter Forecast": { fillGraph: true, color: 'rgb(0,0,150)' },
//         "Summer Observation": { fillGraph: true, strokeWidth: 3, color: 'rgb(75,75,75)' },
//         "Winter Observation": { fillGraph: true, strokeWidth: 3, color: 'rgb(150,0,0)' }, */

//         // "Summer Index": { fillGraph: true, color: 'green' },
//         // "Winter Index": { fillGraph: true, color: 'rgb(0,0,150)' },
//         // "Summer 10 days": { fillGraph: true, strokeWidth: 3, color: 'rgb(75,75,75)' },
//         // "Winter 10 days": { fillGraph: true, strokeWidth: 3, color: 'rgb(150,0,0)' },

//         // "Index": { fillGraph: true, color: 'rgb(0,0,150)' },
//         // "Index 10 days": { fillGraph: true, strokeWidth: 3, color: 'rgb(150,0,0)' },

//         "KUK": { fillGraph: true },
//         "MÄK": { fillGraph: true },
//         "KOK": { fillGraph: true },
//         "KUT": { fillGraph: true },
//         "MÄT": { fillGraph: true },
//         "KOT": { fillGraph: true },
//         // "KUK": { fillGraph: false },
//         // "MÄK": { fillGraph: false },
//         // "KOK": { fillGraph: false },
//         // "KUT": { fillGraph: false },
//         // "MÄT": { fillGraph: false },
//         // "KOT": { fillGraph: false },
//     },
//     axes: {
//         y: { 
//             // valueRange: [-0.1, 2.1], 
//             // valueRange: [-0.1, 1.1], 
//             pixelsPerLabel: 20,
//             // axisLabelFormatter: function(y) {
//             //     // if (y == 0) { return 'Bad'; }
//             //     // if (y == 2) { return 'Good'; }
//             //     if (y == 0) { return '0 %'; }
//             //     if (y == 1) { return '100 %'; }
//             // }
//         },
//         // x: { 
//         //     drawAxis: false
//         //     // axisLabelFontSize: 0
//         // }
//     },
//     //interactionModel:{'click': timeserieclick},
//     // underlayCallback: timeseriedateline,
//     // clickCallback: timeserieclick,
//     // zoomCallback: function() {
//     //     this.resetZoom();
//     //   },
// }

// var dyGraphBOptions2 = {
//     drawAxesAtZero: false,
//     legend: 'always',
//     // labels: ["date", "Summer Index", "Winter Index", "Summer 10 days", "Winter 10 days"],
//     // labels: ["date", "Index", "Index 10 days"],
//     labels: ["date", "KUK", "MÄK", "KOK", "KUT", "MÄT", "KOT"],

//     connectSeparatedPoints: true,
//     series: {

//         // "Summer Index": { fillGraph: true, color: 'green' },
//         // "Winter Index": { fillGraph: true, color: 'rgb(0,0,150)' },
//         // "Summer 10 days": { fillGraph: true, strokeWidth: 3, color: 'rgb(75,75,75)' },
//         // "Winter 10 days": { fillGraph: true, strokeWidth: 3, color: 'rgb(150,0,0)' },

//         // "Index": { fillGraph: true, color: 'rgb(0,0,150)' },
//         // "Index 10 days": { fillGraph: true, strokeWidth: 3, color: 'rgb(150,0,0)' },
//         "KUK": { fillGraph: true },
//         "MÄK": { fillGraph: true },
//         "KOK": { fillGraph: true },
//         "KUT": { fillGraph: true },
//         "MÄT": { fillGraph: true },
//         "KOT": { fillGraph: true },
//         // "KUK": { fillGraph: false },
//         // "MÄK": { fillGraph: false },
//         // "KOK": { fillGraph: false },
//         // "KUT": { fillGraph: false },
//         // "MÄT": { fillGraph: false },
//         // "KOT": { fillGraph: false },
//     },
//     axes: {
//         y: { 
//             // valueRange: [-0.1, 2.1],
//             // valueRange: [-0.1, 1.1],  
//             pixelsPerLabel: 25,
//             // axisLabelFormatter: function(y) {
//             //     // if (y == 0) { return 'Bad'; }
//             //     // if (y == 2) { return 'Good'; }
//             //     if (y == 0) { return '0 %'; }
//             //     if (y == 1) { return '100 %'; }
//             // }
//         },
//         x: { 
//             drawAxis: false
//             // axisLabelFontSize: 0
//         }
//     },
// }

// var titleB = document.getElementById("titleB");

// var sdate = document.getElementById("sdate"); 
// var edate = document.getElementById("edate");

// console.debug(dateString_sdate)
// console.debug(dateString_edate)

sdate.value = dateString_sdate;
edate.value = dateString_edate;

// console.debug(sdate.value)
// console.debug(edate.value)

// console.debug(hakkuutapa.value)
// console.debug(pixmin.value)
// console.debug(daymin.value)

var results = document.getElementById("results"); 
var resultsAll = document.getElementById("resultsAll"); 

// var tr = results.insertRow();

// var td = tr.insertCell();
// td.appendChild(document.createTextNode("Trade Cont"));
// var td = tr.insertCell();
// td.appendChild(document.createTextNode("KUK"));
// var td = tr.insertCell();
// td.appendChild(document.createTextNode("MAK"));
// var td = tr.insertCell();
// td.appendChild(document.createTextNode("KOK"));
// var td = tr.insertCell();
// td.appendChild(document.createTextNode("KUT"));
// var td = tr.insertCell();
// td.appendChild(document.createTextNode("MAT"));
// var td = tr.insertCell();
// td.appendChild(document.createTextNode("KOT"));

// var td = tr.insertCell();
// td.appendChild(document.createTextNode("Good days"));

var graphLoad;

var graphList = [];

var graphIdx;

var volumesum;

var siteList = [];

// var trAll;
var trAll = resultsAll.insertRow();
var tdAll = trAll.insertCell();



// function ifunction() {
//     drawtimeseries();
// }

document.getElementById("ibutton").onclick = function(){

    document.getElementById("ibutton").disabled = true;

    // console.debug(sdate.value)
    // console.debug(edate.value)
    // console.debug(dateString_timeseries)

    volumesum = {
        kuk: 0,
        mak: 0,
        kok: 0,
        kut: 0,
        mat: 0,
        kot: 0,
    };

    results.innerHTML = "";
    resultsAll.innerHTML = "";
    trAll = resultsAll.insertRow();
    tdAll = trAll.insertCell();
    var td = trAll.insertCell();
    var td = trAll.insertCell();
    var td = trAll.insertCell();
    var td = trAll.insertCell();
    var td = trAll.insertCell();
    var td = trAll.insertCell();
    var td = trAll.insertCell();
    var td = trAll.insertCell();

    var tr = results.insertRow();
    var td = tr.insertCell();
    // td.appendChild(document.createTextNode("Trade Cont"));
    var td = tr.insertCell();
    // td.appendChild(document.createTextNode("Felling me"));
    var td = tr.insertCell();
    td.appendChild(document.createTextNode("KUK"));
    var td = tr.insertCell();
    td.appendChild(document.createTextNode("MAK"));
    var td = tr.insertCell();
    td.appendChild(document.createTextNode("KOK"));
    var td = tr.insertCell();
    td.appendChild(document.createTextNode("KUT"));
    var td = tr.insertCell();
    td.appendChild(document.createTextNode("MAT"));
    var td = tr.insertCell();
    td.appendChild(document.createTextNode("KOT"));
    var td = tr.insertCell();
    // td.appendChild(document.createTextNode("Good days"));
    td.appendChild(document.createTextNode("Sum"));

    var tr = results.insertRow();
    var td = tr.insertCell();
    var td = tr.insertCell();
    td.appendChild(document.createTextNode("Total"));
    var td = tr.insertCell();
    td.appendChild(document.createTextNode(volumesum.kuk));
    var td = tr.insertCell();
    td.appendChild(document.createTextNode(volumesum.mak));
    var td = tr.insertCell();
    td.appendChild(document.createTextNode(volumesum.kok));
    var td = tr.insertCell();
    td.appendChild(document.createTextNode(volumesum.kut));
    var td = tr.insertCell();
    td.appendChild(document.createTextNode(volumesum.mat));
    var td = tr.insertCell();
    td.appendChild(document.createTextNode(volumesum.kot));
    var td = tr.insertCell();
    // td.appendChild(document.createTextNode(daysum));
    td.appendChild(document.createTextNode(Object.values(volumesum).reduce((a, b) => a + b, 0)));

    var tr = results.insertRow();
    var td = tr.insertCell();
    var td = tr.insertCell();
    var td = tr.insertCell();
    var td = tr.insertCell();
    var td = tr.insertCell();
    var td = tr.insertCell();
    var td = tr.insertCell();
    var td = tr.insertCell();
    var td = tr.insertCell();

    var tr = results.insertRow();
    var td = tr.insertCell();
    td.appendChild(document.createTextNode("Trade Cont"));
    var td = tr.insertCell();
    td.appendChild(document.createTextNode("Felling me"));
    var td = tr.insertCell();
    td.appendChild(document.createTextNode("KUK"));
    var td = tr.insertCell();
    td.appendChild(document.createTextNode("MAK"));
    var td = tr.insertCell();
    td.appendChild(document.createTextNode("KOK"));
    var td = tr.insertCell();
    td.appendChild(document.createTextNode("KUT"));
    var td = tr.insertCell();
    td.appendChild(document.createTextNode("MAT"));
    var td = tr.insertCell();
    td.appendChild(document.createTextNode("KOT"));
    var td = tr.insertCell();
    td.appendChild(document.createTextNode("Good days"));

    

    drawtimeseries();
};

function scaleTheArray(array, width, height, nTimes) {
    var newArray = new Uint8Array(array.length * nTimes * nTimes);
    for (var i = 0; i < height; i++) {
        for (var j = 0; j < width; j++) {
            for (var k = 0; k < nTimes; k++) {
                for (var n = 0; n < nTimes; n++) {
                    newArray[ (i * width * nTimes * nTimes) + (j * nTimes) + (k * width * nTimes) + n ] = array[(i * width) + j];
                    // console.debug(i, j, k, n)
                    // console.debug(newArray)
                }
            }
        }
    }
    return newArray;
};

// drawtimeseries();

// function show (elem) {  
//     elem.style.display="block";
// }
// function hide (elem) { 
//     elem.style.display=""; 
// }

function drawtimeseries() {

    // plotty.addColorScale("traffcolors", 
    //     ['#000000',
    //     '#006100',
    //     '#619900',
    //     '#A0DB00',
    //     '#FFFA00',
    //     '#FF8400',
    //     '#FF2600'], 
    //     [0, 1/6, 2/6, 3/6, 4/6, 5/6, 1]);
    //     // (identifier,
    //     //  color_steps,
    //     //  percentage_steps)

    // while (timeseries.hasChildNodes()) {
    //     timeseries.removeChild(timeseries.firstChild);
    // }

    graphList = [];

    graphIdx = 0;

    siteList = [];

    var dataLoad = $.getJSON("https://harvesterseasons.com/custom/labels.json",
        function (data) {

            // for (var n = 0; n <= data.features.length; n++) {

            for (var n = 0; n < data.features.length; n++) {
                // for (var n = 0; n < 10; n++) {
                // for (var n = 0; n < 1; n++) {

                // console.debug(data.features[n].properties["Trade Cont"])

                // if (n == data.features.length) { 

                //     var tr = results.insertRow();

                //     var td = tr.insertCell();
                //     td.appendChild(document.createTextNode("Total"));
                //     var td = tr.insertCell();
                //     // td.appendChild(document.createTextNode(felling));
                //     var td = tr.insertCell();
                //     td.appendChild(document.createTextNode(volumesum.kuk));
                //     var td = tr.insertCell();
                //     td.appendChild(document.createTextNode(volumesum.mak));
                //     var td = tr.insertCell();
                //     td.appendChild(document.createTextNode(volumesum.kok));
                //     var td = tr.insertCell();
                //     td.appendChild(document.createTextNode(volumesum.kut));
                //     var td = tr.insertCell();
                //     td.appendChild(document.createTextNode(volumesum.mat));
                //     var td = tr.insertCell();
                //     td.appendChild(document.createTextNode(volumesum.kot));

                //     var td = tr.insertCell();
                //     // td.appendChild(document.createTextNode(daysum));

                // } else {
                    var lat = data.features[n].geometry.coordinates[1];
                    var lon = data.features[n].geometry.coordinates[0];
                    var sitename = data.features[n].properties["Trade Cont"];
                    var felling = data.features[n].properties["Felling me"];
                    var volume = {
                        kuk: data.features[n].properties["KUK"],
                        mak: data.features[n].properties["MÄK"],
                        kok: data.features[n].properties["KOK"],
                        kut: data.features[n].properties["KUT"],
                        mat: data.features[n].properties["MÄT"],
                        kot: data.features[n].properties["KOT"],
                    };

                    // if (n > 0) {
                    //     var lat = data.features[n - 1].geometry.coordinates[1];
                    //     var lon = data.features[n - 1].geometry.coordinates[0];
                    //     var sitename = data.features[n - 1].properties["Trade Cont"];
                    //     var volume = {
                    //         kuk: data.features[n - 1].properties["KUK"],
                    //         mak: data.features[n - 1].properties["MÄK"],
                    //         kok: data.features[n - 1].properties["KOK"],
                    //         kut: data.features[n - 1].properties["KUT"],
                    //         mat: data.features[n - 1].properties["MÄT"],
                    //         kot: data.features[n - 1].properties["KOT"],
                    //     };

                    //     // console.debug(volume)
                    // } else { // last location pinned to the bottom of the page
                    //     var lat = data.features[data.features.length - 1].geometry.coordinates[1];
                    //     var lon = data.features[data.features.length - 1].geometry.coordinates[0];
                    //     var sitename = data.features[data.features.length - 1].properties["Trade Cont"];
                    //     var volume = {
                    //         kuk: data.features[data.features.length - 1].properties["KUK"],
                    //         mak: data.features[data.features.length - 1].properties["MÄK"],
                    //         kok: data.features[data.features.length - 1].properties["KOK"],
                    //         kut: data.features[data.features.length - 1].properties["KUT"],
                    //         mat: data.features[data.features.length - 1].properties["MÄT"],
                    //         kot: data.features[data.features.length - 1].properties["KOT"],
                    //     };
                    // }


                    // var graphblock = document.createElement('div');
                    // graphblock.id = "graphblock" + graphIdx;

                    // var title = document.createElement('div');
                    // title.id = "titleB" + graphIdx;

                    // var resultline = document.createElement('div');
                    // resultline.id = "resultlineB" + graphIdx;

                    // var labels = document.createElement('div');
                    // labels.id = "labelsB" + graphIdx;
                    // var graph = document.createElement('div');
                    // graph.id = "graphB" + graphIdx;

                    // var plotcanvas = document.createElement('canvas');
                    // plotcanvas.id = "plotB" + graphIdx;

                    // plotcanvas.onmouseover="show()";
                    // plotcanvas.onmouseout="hide()";

                    // results.appendChild(graphblock);

                    // // graphblock.appendChild(title);
                    // graphblock.appendChild(resultline);


                    // graphblock.appendChild(labels);
                    // graphblock.appendChild(graph);
                    // graphblock.appendChild(plotcanvas);
                    // // timeseries.appendChild(plotcanvas);

                    // // var url = "https://harvesterseasons.com/custom/131468895_x.tif";
                    // var url = "https://harvesterseasons.com/custom/" + sitename + "_x.tif";
                    // var canvas = document.getElementById("plotB" + graphIdx);
                    // plottiff(canvas,url);

                    // if (n==0) {
                    //     canvas.style.cssText = "position: absolute; display: none; margin-top: -170px; margin-left: 120px; z-index: 100;"
                    //     // canvas.style.cssText = "float: right; padding-top: 3px; padding-right: 3%; display:none;"
                    // } else {
                    //     canvas.style.cssText = "position: absolute; display: none; margin-top: -86px; margin-left: 120px; z-index: 100;"
                    //     // canvas.style.cssText = "float: right; padding-top: 3px; display:none;"
                    //     // // canvas.style.cssText = "display: inline-block;"
                    //     // // canvas.style.cssText = "display: inline-block; height: 86px; width: 80%; padding-left: 10px; margin-top: 0px; margin-bottom: 0px; text-align: center;"
                    // }

                    // Read histogram file
                    var histUrl = "https://harvesterseasons.com/custom/" + sitename + "_x.tif.aux.xml";

                    drawtimeseries_histogram(lat, lon, "titleB" + graphIdx, "resultlineB" + graphIdx, "graphblock" + graphIdx, graphIdx, sitename, histUrl, volume, felling);
                    // drawtimeseries_histogram(lat, lon, "titleB" + graphIdx, "resultlineB" + graphIdx, "graphblock" + graphIdx, graphIdx, sitename, "plotB" + graphIdx, histUrl, volume);

                    // drawtimeseries_ecbsf(lat, lon, "titleB" + graphIdx, "labelsB" + graphIdx, "graphB" + graphIdx, "graphblock" + graphIdx, graphIdx, sitename, "plotB" + graphIdx);

                    // console.debug(lat, lon, "titleB" + graphIdx, "resultlineB" + graphIdx, "graphblock" + graphIdx, graphIdx, sitename, histUrl, volume);

                    graphIdx++;

                // }
            }

        });
}

// async function plottiff(canvas,url) {
//     const tiff = await GeoTIFF.fromUrl(url);
//     const image = await tiff.getImage();
//     const datatiff = await image.readRasters();
//     // const datatiff = await image.readRasters({ height: 100 });
//     // const datatiff = await image.readRasters({ width: 40, height: 40, resampleMethod: 'bilinear' });

//     // var scale = 2;

//     if (image.getWidth() < 10 || image.getHeight() < 10) {
//         var scale = 20;
//     } else if (image.getWidth() < 50 && image.getHeight() < 50) {
//         var scale = 5;
//     } else if (image.getWidth() < 80 && image.getHeight() < 80) {
//         var scale = 3;
//     } else if (image.getWidth() < 80 || image.getHeight() < 80) {
//         var scale = 2;
//     } else {
//         var scale = 1;
//     }

//     // console.debug(datatiff[0])
//     // console.debug(image)

//     // const canvas = document.getElementById("plotB" + graphIdx);

//     const plot = new plotty.plot({
//         canvas,
//         //   data: datatiff[0],
//         //   width: image.getWidth(),
//         //   height: image.getHeight(),
//         data: scaleTheArray(datatiff[0], image.getWidth(), image.getHeight(), scale),
//         width: image.getWidth() * scale,
//         height: image.getHeight() * scale,
//         //   domain: [0, 256],
//         //   colorScale: "viridis"
//         domain: [0, 6],
//         colorScale: "traffcolors",
//         // colorScale: "blackbody",
//         // applyDisplayRange: true,
//         // displayRange: [0, 6],
//         // useWebGL: false
//     });
//     plot.render();
//     // console.debug(plot)

// };

// function drawtimeseries_histogram(lat, lon, titleID, labelsID, graphID, graphblockID, gB, sitename, plotID, histUrl, volume) {
    
function drawtimeseries_histogram(lat, lon, titleID, resultlineID, graphblockID, gB, sitename, histUrl, volume, felling) {

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            // Typical action to be performed when the document is ready:
            // console.debug(xhttp.responseXML.getElementsByTagName("HistCounts"));
            // console.debug(xhttp.responseXML.getElementsByTagName("HistCounts")[0].childNodes[0].nodeValue);

            var histVec = [];
            var hist = xhttp.responseXML.getElementsByTagName("HistCounts")[0].childNodes[0].nodeValue;
            // console.debug(hist.split("|")))
            for (var p = 1; p < 7; p++) {
                // console.debug(Number(hist.split("|")[p]))
                histVec[p-1] = Number(hist.split("|")[p]);
            }
            // console.debug(histVec)
            // console.debug(histVec.reduce((a, b) => a + b, 0))

            drawtimeseries_ecbsf(lat, lon, titleID, resultlineID, graphblockID, gB, sitename, histVec, volume, felling);
            // drawtimeseries_ecbsf(lat, lon, titleID, labelsID, graphID, graphblockID, gB, sitename, plotID, histVec, volume);

            // After all data has been loaded
            $(document).ajaxStop(function(){
                document.getElementById("ibutton").disabled = false;
                
                // console.debug(typeof trAll)

                // if (typeof trAll === 'undefined') {
                // var trAll = results.insertRow();
                // console.debug(typeof trAll)

                // td.appendChild(document.createTextNode(sitename));
                var a = document.createElement('a');
                a.appendChild(document.createTextNode("All"));
                // a.href = "https://harvesterseasons.com/custom/index_timeseries.html?tradecont=" + siteList[0];
                a.href = "https://harvesterseasons.com/custom/index_timeseries.html?dates=" + sdate.value + "," + edate.value + "&tradecont=" + siteList.toString();
                a.target="_blank";
                // tdAll.appendChild(a);
                tdAll.replaceWith(a);

                // console.debug(siteList)
                // }
                $(document).unbind("ajaxStop");
            });
        }
    };
    xhttp.open("GET", histUrl, true);
    xhttp.send();
    // console.debug(histUrl)

};

// function drawtimeseries_ecbsf(lat, lon, titleID, labelsID, graphID, graphblockID, gB, sitename, plotID, histVec, volume) {
    function drawtimeseries_ecbsf(lat, lon, titleID, resultlineID, graphblockID, gB, sitename, histVec, volume, felling) {

            // $(document).ajaxStop(function(){
            //     alert("All AJAX requests completed");
            //   });

    // document.getElementById(titleID).style.cssText = "font-size: 20px; font-weight: bold; height: 8px; text-align: left; padding-top: 10px;"
    // document.getElementById(labelsID).style.cssText = "float: left; width: 88px; font-size: 11px; height: 92px; padding-top: 26px; text-align: left;"
    // document.getElementById(graphID).style.cssText = "display: inline-block; height: 86px; width: 90%; padding-left: 10px; margin-top: 0px; margin-bottom: 0px; text-align: center;"

    // // document.getElementById(labelsID).onmouseover = function () { plottiff(document.getElementById(plotID), url); };
 
    // document.getElementById(titleID).onmouseover = function () { document.getElementById(plotID).style.display = "block"; };
    // document.getElementById(titleID).onmouseout = function () { document.getElementById(plotID).style.display = "none"; };

    // document.getElementById(labelsID).onmouseover = function () { document.getElementById(plotID).style.display = "block"; };
    // document.getElementById(labelsID).onmouseout = function () { document.getElementById(plotID).style.display = "none"; };


    // var graphCssText2 = "display: inline-block; height: 80px; width: 90%; padding-left: 10px; margin-top: 0px; margin-bottom: 0px; text-align: center;";

    // // gB = 0
    // var graphCssText3 = "display: inline-block; height: 100px; width: " + document.getElementById(graphID).offsetWidth + "px; padding-left: 10px; margin-top: 0px; text-align: center;"
    // var graphCssText4 = "float: left; width: 88px; font-size: 11px; height: 92px; padding-top: 26px; margin-bottom: 20px; text-align: left;"

    // var graphblockCssText = "position: fixed; bottom: 0; background-color: white; z-index: 99; width: 100%; border-width: 1px; border-top-style: solid;"

    var latlonPoint = lat + "," + lon;

    // document.getElementById(titleID).innerHTML = sitename;

    // document.getElementById(graphID).innerHTML = "Loading...";
    // document.getElementById(graphID).style.lineHeight = "86px";

    // Outside Finland, no SMARTOBS or scaling
    if (!inFinland(lat, lon)) {
        // graphLoad = $.getJSON("https://sm1.harvesterseasons.com/timeseries?latlon=" + latlonPoint + "&param=" + param1 + "," + param2 + "," + param3 + "," + param4 + "," + param5 + "," + param6 + "," + param7 + "&starttime=" + dateString_timeseries + "&endtime=" + dateString_ecbsf + "&timestep=1440&format=json&source=grid&timeformat=xml&tz=utc",
        // // graphLoad = $.getJSON("https://sm1.harvesterseasons.com/timeseries?latlon=" + latlonPoint + "&param=" + param1 + "," + param5 + "," + param6 + "," + param7 + "&starttime=" + dateString_timeseries + "&endtime=" + dateString_ecbsf + "&timestep=1440&format=json&source=grid&timeformat=xml&tz=utc",
        // function (data) {
        //         var graphdata = [];
        //         for (var i = 0, k = 0; i < data.length; i++) {
        //             var summer1, summer2, winter1, winter2;

        //             // Seasonal summer index
        //             if (data[i][param2] !== null) { summer1 = data[i][param2]; }
        //             else { summer1 = 'nan'; }

        //             // Seasonal winter index
        //             if (data[i][param3] !== null || data[i][param4] !== null) { winter1 = Math.max(data[i][param3], data[i][param4]); }
        //             else { winter1 = 'nan'; }

        //             // 10 day forecast summer index                        
        //             if (data[i][param5] !== null) { summer2 = data[i][param5]; }
        //             else { summer2 = 'nan'; }

        //             // // 10 day forecast winter index                        
        //             // if (data[i][param6] !== null || data[i][param7] !== null) { winter2 = Math.max(data[i][param6], data[i][param7]); }
        //             if (data[i][param7] !== null) { winter2 = data[i][param7]; }
        //             else { winter2 = 'nan'; }

        //             if (summer1 !== 'nan' || winter1 !== 'nan' || summer2 !== 'nan' || winter2 !== 'nan') {
        //                 graphdata[k] = [new Date(data[i][param1]), summer1, winter1, summer2, winter2];
        //                 k++;
        //             }
        //         }

        //         if (graphdata.length > 0) {
        //             // if (gB < graphIdx - 1) {
        //             if (gB > 0) {
        //                 document.getElementById(graphID).style.cssText = graphCssText2;

        //                 dyGraphBOptions2.labelsDiv = labelsID;
        //                 graphList[gB] = new Dygraph(
        //                     document.getElementById(graphID),
        //                     graphdata,
        //                     dyGraphBOptions2,
        //                 );
        //             } else {
        //                 document.getElementById(graphblockID).style.cssText = graphblockCssText;
        //                 document.getElementById(graphID).style.cssText = graphCssText3;
        //                 document.getElementById(labelsID).style.cssText = graphCssText4;

        //                 dyGraphBOptions.labelsDiv = labelsID;
        //                 graphList[gB] = new Dygraph(
        //                     document.getElementById(graphID),
        //                     graphdata,
        //                     dyGraphBOptions,
        //                 );

        //                 var footer = document.createElement('div');
        //                 footer.id = "footer";
        //                 footer.innerHTML = `<a href="https://harvesterseasons.com/">Harvester Seasons</a>
        //                 <a href="../privacy-policy/" target="_blank" style="float: right;">Privacy Policy / Terms of Use</a>`;
        //                 document.getElementById(graphblockID).appendChild(footer);

        //             }
        //             // if (graphList.length > 1) {
        //             //     var sync = Dygraph.synchronize(graphList);
        //             // }
        //             document.getElementById(graphID).style.lineHeight = "1";
        //         } else {
        //             document.getElementById(graphID).innerHTML = "Error loading data";
        //         }
        //     });
    } else {
        // Inside Finland, seasonal snow depth combined and scaled with SMARTOBS observations
        var dataUrl2 = "https://sm1.harvesterseasons.com/timeseries?latlon=" + latlonPoint + "&param=" + SHensemble2 + "&starttime=" + dateString_smartobs + "T000000Z&timesteps=1&format=json&precision=full";
        $.getJSON(dataUrl2, function (data2) {
        // // Temporary fix for missing HSNOW-M:SMARTOBS data
        // var dataUrl2 = "https://sm.harvesterseasons.com/timeseries?latlon=" + latlonPoint + "&param=" + SHensemble2 + "&starttime=20210914T000000Z&timesteps=1&format=json&precision=full";
        // $.getJSON(dataUrl2, function (data2) {

            // Scale seasonal snow forecast using observations
            var SHensemble3 = "DIFF{SD-M:ECBSF::1:0:1:0;" + data2[0][SHensemble2list[0]] + "}";
            var SHensemble3ensover = "DIFF{SD-M:ECBSF::1:0:1:0;" + data2[0][SHensemble2list[0]] + "}";
            var SHensemble3list = ["DIFF{SD-M:ECBSF::1:0:1:0;" + data2[0][SHensemble2list[0]] + "}"];
            for (p = 1; p <= perturbations; p++) {
                SHensemble3 += ",DIFF{SD-M:ECBSF::1:0:3:" + p + ";" + data2[0][SHensemble2list[p]] + "}";
                SHensemble3list[p] = "DIFF{SD-M:ECBSF::1:0:3:" + p + ";" + data2[0][SHensemble2list[p]] + "}";
                SHensemble3ensover += ";DIFF{SD-M:ECBSF::1:0:3:" + p + ";" + data2[0][SHensemble2list[p]] + "}";
            }

            var param4ensemble="ensover{0.4;0.9;" + SHensemble3ensover + "}";


            graphLoad = $.getJSON("https://sm1.harvesterseasons.com/timeseries?latlon=" + latlonPoint + "&param=" + param1 + "," + param2 + "," + param3 + "," + param4ensemble + "," + param5 + "," + param6 + "," + param7 + "," + param8 + "&starttime=" + sdate.value + "&endtime=" + edate.value + "&timestep=1440&format=json&source=grid&timeformat=xml&tz=utc",
            // graphLoad = $.getJSON("https://sm1.harvesterseasons.com/timeseries?latlon=" + latlonPoint + "&param=" + param1 + "," + param2 + "," + param3 + "," + param4ensemble + "," + param5 + "," + param6 + "," + param7 + "," + param8 + "&starttime=" + dateString_timeseries + "&endtime=" + dateString_ecbsf + "&timestep=1440&format=json&source=grid&timeformat=xml&tz=utc",
            // graphLoad = $.getJSON("https://sm1.harvesterseasons.com/timeseries?latlon=" + latlonPoint + "&param=" + param1 + "," + param3 + "," + param4ensemble + "," + param5 + "," + param6 + "," + param7 + "," + param8 + "&starttime=" + dateString_timeseries + "&endtime=" + dateString_ecbsf + "&timestep=1440&format=json&source=grid&timeformat=xml&tz=utc",
                function (data) {
                    var graphdata = [];
                    for (var i = 0, k = 0; i < data.length; i++) {
                        var summer1, summer2, winter1, winter2;

                        // Seasonal summer index
                        if (data[i][param2] !== null) { summer1 = data[i][param2]; }
                        else { summer1 = 'nan'; }

                        // Seasonal winter index, combined and scaled with observations                      
                        if (data[i][param8] !== null) { winter1 = Math.max(data[i][param3], data[i][param8]); }
                        else if (data[i][param3] !== null || data[i][param4ensemble] !== null) { winter1 = Math.max(data[i][param3], data[i][param4ensemble]); }
                        else { winter1 = 'nan'; }

                        // 10 day forecast summer index                        
                        if (data[i][param5] !== null) { summer2 = data[i][param5]; }
                        else { summer2 = 'nan'; }

                        // // 10 day forecast winter index                        
                        // if (data[i][param6] !== null || data[i][param7] !== null) { winter2 = Math.max(data[i][param6], data[i][param7]); }
                        if (data[i][param7] !== null) { winter2 = data[i][param7]; }
                        else { winter2 = 'nan'; }

                        // if (summer1 !== 'nan' || winter1 !== 'nan' || summer2 !== 'nan' || winter2 !== 'nan') {
                        //     graphdata[k] = [new Date(data[i][param1]), summer1, winter1, summer2, winter2];
                        //     k++;
                        // }

                        // Hist based graph 
                        var hist1, hist2;
                        var histSum = histVec.reduce((a, b) => a + b, 0);

                        if (histSum > 0) {
                            if (summer1 !== 'nan' || winter1 !== 'nan') {
                                if (winter1 == 2) { hist1 = 1 }
                                else if (summer1 == 2) { hist1 = (histSum - histVec[5]) / histSum }
                                else { hist1 = histVec[0] / histSum }
                            }
                            else { hist1 = NaN; }

                            if (summer2 !== 'nan' || winter2 !== 'nan') {
                                if (winter2 == 2) { hist2 = 1 }
                                else if (summer2 == 2) { hist2 = (histSum - histVec[5]) / histSum }
                                else { hist2 = histVec[0] / histSum }
                            }
                            else { hist2 = NaN; }
                        }
                        else { hist1 = NaN; hist2 = NaN; }

                        // hist1 = hist1 * 2;
                        // hist2 = hist2 * 2;

                        // // Volumes, only seasonal forecast
                        // graphdata[k] = [new Date(data[i][param1]), hist1 * volume.kuk, hist1 * volume.mak, hist1 * volume.kok, hist1 * volume.kut, hist1 * volume.mat, hist1 * volume.kot];
                        // k++;

                        // graphdata[k] = [new Date(data[i][param1]), hist1*100 ];
                        graphdata[k] = [new Date(data[i][param1]), hist1*100, hist2*100 ];
                        k++;

                    }

                    // console.debug(graphdata)
                    
                    if (graphdata.length > 0) {

                        var daysum = 0;
                        for (var l = 0; l < graphdata.length; l++) {
                            // 10 day forecast
                            if (!isNaN(graphdata[l][2])) {
                                if (graphdata[l][2] > Number(pixmin.value)) {
                                    daysum++;
                                }
                            // Seasonal forecast
                            } else {
                                if (graphdata[l][1] > Number(pixmin.value)) {
                                    daysum++;
                                }  
                            }
                        }



                        // document.getElementById(resultlineID).innerHTML = [sitename, volume.kuk, volume.mak, volume.kok, volume.kut, volume.mat, volume.kot];

                        // console.debug(felling)
                        // console.debug(daysum)
                        // console.debug(hakkuutapa.value)
                        // console.debug(daymin.value)


                        if ((felling == hakkuutapa.value || hakkuutapa.value == "Kaikki") && daysum >= Number(daymin.value)) {
                            siteList.push(sitename)
                            
                            var tr = results.insertRow();

                            var td = tr.insertCell();
                            // td.appendChild(document.createTextNode(sitename));
                            var a = document.createElement('a');
                            a.appendChild(document.createTextNode(sitename));
                            // a.href = "https://harvesterseasons.com/custom/index_timeseries.html?tradecont=" + sitename;
                            a.href = "https://harvesterseasons.com/custom/index_timeseries.html?dates=" + sdate.value + "," + edate.value + "&tradecont=" + sitename;
                            a.target="_blank";
                            td.appendChild(a);
                            var td = tr.insertCell();
                            td.appendChild(document.createTextNode(felling));
                            var td = tr.insertCell();
                            td.appendChild(document.createTextNode(volume.kuk));
                            var td = tr.insertCell();
                            td.appendChild(document.createTextNode(volume.mak));
                            var td = tr.insertCell();
                            td.appendChild(document.createTextNode(volume.kok));
                            var td = tr.insertCell();
                            td.appendChild(document.createTextNode(volume.kut));
                            var td = tr.insertCell();
                            td.appendChild(document.createTextNode(volume.mat));
                            var td = tr.insertCell();
                            td.appendChild(document.createTextNode(volume.kot));

                            var td = tr.insertCell();
                            td.appendChild(document.createTextNode(daysum));

                            volumesum.kuk = volumesum.kuk + Number(volume.kuk);
                            volumesum.mak = volumesum.mak + Number(volume.mak);
                            volumesum.kok = volumesum.kok + Number(volume.kok);
                            volumesum.kut = volumesum.kut + Number(volume.kut);
                            volumesum.mat = volumesum.mat + Number(volume.mat);
                            volumesum.kot = volumesum.kot + Number(volume.kot);

                            // console.debug(volumesum)

                            results.rows[1].cells[2].innerHTML = volumesum.kuk;
                            results.rows[1].cells[3].innerHTML = volumesum.mak;
                            results.rows[1].cells[4].innerHTML = volumesum.kok;
                            results.rows[1].cells[5].innerHTML = volumesum.kut;
                            results.rows[1].cells[6].innerHTML = volumesum.mat;
                            results.rows[1].cells[7].innerHTML = volumesum.kot;
                            results.rows[1].cells[8].innerHTML = Object.values(volumesum).reduce((a, b) => a + b, 0);
                        }

                        // td.appendChild(document.createTextNode(graphdata.length));

                            // document.getElementById(graphblockID).style.cssText = graphblockCssText;
                            // document.getElementById(graphID).style.cssText = graphCssText3;
                            // document.getElementById(labelsID).style.cssText = graphCssText4;

                            // dyGraphBOptions.labelsDiv = labelsID;
                            // graphList[gB] = new Dygraph(
                            //     document.getElementById(graphID),
                            //     graphdata,
                            //     dyGraphBOptions,
                            // );

                            // var footer = document.createElement('div');
                            // footer.id = "footer";
                            // footer.innerHTML = `<a href="https://harvesterseasons.com/">Harvester Seasons</a>
                            // <a href="../privacy-policy/" target="_blank" style="float: right;">Privacy Policy / Terms of Use</a>`;
                            // document.getElementById(graphblockID).appendChild(footer);
                        
                        // document.getElementById(graphID).style.lineHeight = "1";
                    } else {
                        document.getElementById(graphID).innerHTML = "Error loading data";
                    }

                    // console.debug(graphLoad)
                            
                    // if (graphdata.length > 0) {
                    //     // if (gB < graphIdx - 1) {
                    //     if (gB > 0) {
                    //         document.getElementById(graphID).style.cssText = graphCssText2;

                    //         dyGraphBOptions2.labelsDiv = labelsID;
                    //         graphList[gB] = new Dygraph(
                    //             document.getElementById(graphID),
                    //             graphdata,
                    //             dyGraphBOptions2,
                    //         );
                    //     } else {
                    //         document.getElementById(graphblockID).style.cssText = graphblockCssText;
                    //         document.getElementById(graphID).style.cssText = graphCssText3;
                    //         document.getElementById(labelsID).style.cssText = graphCssText4;

                    //         dyGraphBOptions.labelsDiv = labelsID;
                    //         graphList[gB] = new Dygraph(
                    //             document.getElementById(graphID),
                    //             graphdata,
                    //             dyGraphBOptions,
                    //         );

                    //         var footer = document.createElement('div');
                    //         footer.id = "footer";
                    //         footer.innerHTML = `<a href="https://harvesterseasons.com/">Harvester Seasons</a>
                    //         <a href="../privacy-policy/" target="_blank" style="float: right;">Privacy Policy / Terms of Use</a>`;
                    //         document.getElementById(graphblockID).appendChild(footer);

                    //     }
                    //     // if (graphList.length > 1) {
                    //     //     var sync = Dygraph.synchronize(graphList);
                    //     // }
                    //     document.getElementById(graphID).style.lineHeight = "1";
                    // } else {
                    //     document.getElementById(graphID).innerHTML = "Error loading data";
                    // }
            });
        });
    }
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

function inFinland(lat,lon) {

    var finlandArea = false;

    //The Northest Finland
    if (lat > 68.9 && lat <= 70.1 && lon >= 25.6 && lon <= 29.34) {
        finlandArea = true;
    }
    //Käsivarsi
    else if (lat >= 68.47 && lat <= 69.31 && lon >= 20.55 && lon < 22.3) {
        finlandArea = true;
    }
    //North Finland
    else if (lat >= 68.2 && lat <= 68.9 && lon >= 22.3 && lon <= 28.8) {
        finlandArea = true;
    }
    //North-Middle Finland
    else if (lat >= 64.4 && lat < 68.2 && lon >= 23 && lon <= 30.2) {
        finlandArea = true;
    }
    //South-Middle Finland
    else if (lat >= 63.5 && lat < 64.4 && lon >= 21.7 && lon <= 30.56) {
        finlandArea = true;
    }
    //South Finland
    else if (lat >= 60.6 && lat < 63.5 && lon >= 20 && lon <= 31.6) {
        finlandArea = true;
    }
    //The Southest Finland
    else if (lat >= 59.7 && lat < 60.6 && lon >= 19.1 && lon <= 27.9) {
        finlandArea = true;
    }

    return finlandArea;
}