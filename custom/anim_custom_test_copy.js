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
const param2="HARVIDX{0.4;SOILWET1-M:ECBSF::9:7:3:1-50;SOILWET1-M:ECBSF::9:7:1:0}";
const param3="HARVIDX{273;TSOIL-K:ECBSF::9:7:3:1-50;TSOIL-K:ECBSF::9:7:1:0}";
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

Dygraph.prototype.doZoomY_ = function (lowY, highY) {
    return;
};

var dyGraphBOptions = {
    //title: latlonPoint,
    //titleHeight: 28,
    drawAxesAtZero: false,
    legend: 'always',
    // ylabel: "Trafficability",
    // labels: ["date", "Summer Forecast", "Winter Forecast", "Summer Observation", "Winter Observation"],
    labels: ["date", "Summer Index", "Winter Index", "Summer 10 days", "Winter 10 days"],

    //labels: ["date", "Summer Index", "Winter Index"],

    //labels: ["date", "Harvestability Index"],
    //labels: ["date", "Harvestability Index SW", "Harvestability Index ST", "Harvestability Index HS"],
    // labelsDiv: "labelsB0",
    connectSeparatedPoints: true,
    series: {
        //"Harvestability Index": { fillGraph: true },
/*         "Summer Index": { fillGraph: true },
        "Winter Index": { fillGraph: true }, */
/*         "Summer Forecast": { fillGraph: true, color: 'green' },
        "Winter Forecast": { fillGraph: true, color: 'rgb(0,0,150)' },
        "Summer Observation": { fillGraph: true, strokeWidth: 3, color: 'rgb(75,75,75)' },
        "Winter Observation": { fillGraph: true, strokeWidth: 3, color: 'rgb(150,0,0)' }, */
        "Summer Index": { fillGraph: true, color: 'green' },
        "Winter Index": { fillGraph: true, color: 'rgb(0,0,150)' },
        "Summer 10 days": { fillGraph: true, strokeWidth: 3, color: 'rgb(75,75,75)' },
        "Winter 10 days": { fillGraph: true, strokeWidth: 3, color: 'rgb(150,0,0)' },
    },
    axes: {
        y: { 
            valueRange: [-0.1, 2.1], 
            pixelsPerLabel: 20,
            axisLabelFormatter: function(y) {
                if (y == 0) { return 'Bad'; }
                if (y == 2) { return 'Good'; }
            }
        },
        // x: { 
        //     drawAxis: false
        //     // axisLabelFontSize: 0
        // }
    },
    //interactionModel:{'click': timeserieclick},
    // underlayCallback: timeseriedateline,
    // clickCallback: timeserieclick,
    // zoomCallback: function() {
    //     this.resetZoom();
    //   },
}

var dyGraphBOptions2 = {
    drawAxesAtZero: false,
    legend: 'always',
    labels: ["date", "Summer Index", "Winter Index", "Summer 10 days", "Winter 10 days"],

    connectSeparatedPoints: true,
    series: {
        "Summer Index": { fillGraph: true, color: 'green' },
        "Winter Index": { fillGraph: true, color: 'rgb(0,0,150)' },
        "Summer 10 days": { fillGraph: true, strokeWidth: 3, color: 'rgb(75,75,75)' },
        "Winter 10 days": { fillGraph: true, strokeWidth: 3, color: 'rgb(150,0,0)' },
    },
    axes: {
        y: { 
            valueRange: [-0.1, 2.1], 
            pixelsPerLabel: 25,
            axisLabelFormatter: function(y) {
                if (y == 0) { return 'Bad'; }
                if (y == 2) { return 'Good'; }
            }
        },
        x: { 
            drawAxis: false
            // axisLabelFontSize: 0
        }
    },
}

var titleB = document.getElementById("titleB");

// var coordinates = document.getElementById("coordinates"); 

/* const queryString = window.location.search;
var urlParams = new URLSearchParams(queryString);

if (!urlParams.has('coordinates')) {
    coordinates.value = "66.0, 28.0\n64.0, 27.0\n62.0, 26.0";
} else {
    coordinates.value = urlParams.getAll('coordinates')[0].replace(";", "\n");
}
 */
// coordinates.value = "64.0, 27.0";
// coordinates.value = "64.0, 27.0\n65.0, 27.0\n66.0, 28.0\n64.0, 28.0\n65.0, 28.0";

// var coordinates = [];
// coordinates.value = "64.0, 27.0";



var timeseries = document.getElementById("timeseries"); 


//var dateFixed = false;

var graphLoad;

var graphList = [];
// console.debug(document.getElementById("latitude").value)

var graphIdx;

// function scaleTheArray(arrayToScale, nTimes) {
//     for (var idx = 0, i = 0, len = arrayToScale.length * nTimes; i < len; i++) {
//       var elem = arrayToScale[idx];

//       /* Insert the element into (idx + 1) */
//       arrayToScale.splice(idx + 1, 0, elem);

//       /* Add idx for the next elements */
//       if ((i + 1) % nTimes === 0) {
//         idx += nTimes + 1;
//       }
//     }
//   };

        // arr[3 + 1 * numrows] = 1; // col = 3, row = 1
        // newArray.slice(i*nTimes,(i+1)*nTimes)=array[i];
        // newArray.slice((i * nTimes) + (j * width), ((i+1) * nTimes) + (j * width)) = array[i];

// function scaleTheArray(array, width, nTimes) {
//     var newArray = new Uint8Array(array.length * nTimes * nTimes);
//     for (var i = 0, len = array.length; i < len; i++) {
//         for (var j = 0; j < nTimes; j++) {
//             for (var k = 0; k < nTimes; k++) {
//                 newArray[ (i * nTimes) + (j * width * nTimes) + k ] = array[i];
//                 console.debug(i,j,k)
//                 console.debug(newArray)
//             }
//         }
//     }
//     return newArray;
// };

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

// // var arr=[0,1,2,3];
// var arr=[1,2,3,4];
// // console.debug(arr)
// var newArr=scaleTheArray(arr,2,2,2);
// // console.debug(newArr)


//latlonPoint = "64.0,27.0";

// var url = "https://harvesterseasons.com/custom/131468895_x.tif";

// (async function() {
//     const tiff = await GeoTIFF.fromUrl(url);
//     const image = await tiff.getImage();
//     const datatiff = await image.readRasters();


//     const canvas = document.getElementById("canvas");

//     const plot = new plotty.plot({
//       canvas,
//       data: datatiff[0],
//       width: image.getWidth(),
//       height: image.getHeight(),
//     domain: [0, 6],
//     colorScale: "blackbody",
//     });
//     plot.render();
// })();

// (async function() {
//     const tiff = await GeoTIFF.fromUrl(url);
//     const image = await tiff.getImage();
//     const datatiff = await image.readRasters();

//     var scale = 10;
//     // console.debug(datatiff[0])

//     const canvas = document.getElementById("canvas2");

//     const plot = new plotty.plot({
//       canvas,
//     //   data: datatiff[0],
//     //   width: image.getWidth(),
//     //   height: image.getHeight(),
//       data: scaleTheArray(datatiff[0],image.getWidth(),image.getHeight(),scale),
//       width: image.getWidth()*scale,
//       height: image.getHeight()*scale,
//     //   domain: [0, 256],
//     //   colorScale: "viridis"
//     domain: [0, 6],
//     colorScale: "blackbody",
//     // applyDisplayRange: true,
//     // displayRange: [0, 6],
//     // useWebGL: false
//     });
//     plot.render();
//     // console.debug(plot)
// })();

drawtimeseries();

function drawtimeseries() {

    plotty.addColorScale("traffcolors", 
        ['#000000',
        '#006100',
        '#619900',
        '#A0DB00',
        '#FFFA00',
        '#FF8400',
        '#FF2600'], 
        [0, 1/6, 2/6, 3/6, 4/6, 5/6, 1]);
        // (identifier,
        //  color_steps,
        //  percentage_steps)

    while (timeseries.hasChildNodes()) {
        timeseries.removeChild(timeseries.firstChild);
    }

    graphList = [];

    graphIdx = 0;

    var dataLoad = $.getJSON("https://harvesterseasons.com/custom/labels.json",
        function (data) {
            // console.debug(data.features[0].geometry.coordinates)

            // var lines = coordinates.value.split("\n");
            // console.debug(lines)

            // for (var n = 0; n < data.features.length; n++) {
            for (var n = 0; n < 10; n++) {
            // for (var n = 0; n < 1; n++) {

                // console.debug(data.features[n].properties["Trade Cont"])

                if (n > 0) {
                    var lat = data.features[n - 1].geometry.coordinates[1];
                    var lon = data.features[n - 1].geometry.coordinates[0];
                    var sitename = data.features[n - 1].properties["Trade Cont"];
                } else { // last location pinned to the bottom of the page
                    var lat = data.features[data.features.length - 1].geometry.coordinates[1];
                    var lon = data.features[data.features.length - 1].geometry.coordinates[0];
                    var sitename = data.features[data.features.length - 1].properties["Trade Cont"];
                }

                var graphblock = document.createElement('div');
                graphblock.id = "graphblock" + graphIdx;

                var title = document.createElement('div');
                title.id = "titleB" + graphIdx;
                var labels = document.createElement('div');
                labels.id = "labelsB" + graphIdx;
                var graph = document.createElement('div');
                graph.id = "graphB" + graphIdx;

                var plotcanvas = document.createElement('canvas');
                plotcanvas.id = "plotB" + graphIdx;

                timeseries.appendChild(graphblock);

                graphblock.appendChild(title);
                graphblock.appendChild(labels);
                graphblock.appendChild(graph);
                graphblock.appendChild(plotcanvas);
                // timeseries.appendChild(plotcanvas);

                // var url = "https://harvesterseasons.com/custom/131468895_x.tif";
                var url = "https://harvesterseasons.com/custom/" + sitename + "_x.tif";

                // (async function() {
                //     const tiff = await GeoTIFF.fromUrl(url);
                //     const image = await tiff.getImage();
                //     const datatiff = await image.readRasters();
                
                //     const canvas = document.getElementById("plotB" + graphIdx);
                //     const plot = new plotty.plot({
                //       canvas,
                //       data: datatiff[0],
                //       width: image.getWidth(),
                //       height: image.getHeight(),
                //     //   domain: [0, 256],
                //     //   colorScale: "viridis"
                //     // domain: [0, 6],
                //     // colorScale: "blackbody",
                //     // applyDisplayRange: true,
                //     // displayRange: [0, 6],
                //     // useWebGL: false
                //     });
                //     plot.render();
                //     // console.debug(plot)
                //   })();

                var canvas = document.getElementById("plotB" + graphIdx);
                plottiff(canvas,url);

                if (n==0) {
                    canvas.style.cssText = "float: right; padding-top: 3px; padding-right: 3%;"
                } else {
                    canvas.style.cssText = "float: right; padding-top: 3px;"
                    // canvas.style.cssText = "display: inline-block;"
                    // canvas.style.cssText = "display: inline-block; height: 86px; width: 80%; padding-left: 10px; margin-top: 0px; margin-bottom: 0px; text-align: center;"
                }

                // document.getElementById("plotB" + graphIdx).style.cssText = "width: 500; height: 500;"

                // document.getElementById("plotB" + graphIdx).style.cssText = "z-index: 0;"

                // timeseries.appendChild(title);
                // timeseries.appendChild(labels);
                // timeseries.appendChild(graph);

                // graphList[i] = "gB"+i;
                // console.debug(graphList)

                drawtimeseries_ecbsf(lat, lon, "titleB" + graphIdx, "labelsB" + graphIdx, "graphB" + graphIdx, "graphblock" + graphIdx, graphIdx, sitename);

                graphIdx++;

            }

            // var lat = document.getElementById("latitude").value;
            // var lon = document.getElementById("longitude").value;

            // console.debug(latlonPoint)

        });

}

// var graphLoad, graphTimer;
// var graphLoad2, graphLoad3, graphLoad4;

async function plottiff(canvas,url) {
    const tiff = await GeoTIFF.fromUrl(url);
    const image = await tiff.getImage();
    const datatiff = await image.readRasters();
    // const datatiff = await image.readRasters({ height: 100 });
    // const datatiff = await image.readRasters({ width: 40, height: 40, resampleMethod: 'bilinear' });

    // var scale = 2;
    // console.debug(datatiff[0])
    // console.debug(image)

    // const canvas = document.getElementById("plotB" + graphIdx);

    const plot = new plotty.plot({
        canvas,
          data: datatiff[0],
          width: image.getWidth(),
          height: image.getHeight(),
        // data: scaleTheArray(datatiff[0], image.getWidth(), image.getHeight(), scale),
        // width: image.getWidth() * scale,
        // height: image.getHeight() * scale,
        //   domain: [0, 256],
        //   colorScale: "viridis"
        domain: [0, 6],
        colorScale: "traffcolors",
        // colorScale: "blackbody",
        // applyDisplayRange: true,
        // displayRange: [0, 6],
        // useWebGL: false
    });
    plot.render();
    // console.debug(plot)

};

function drawtimeseries_ecbsf(lat, lon, titleID, labelsID, graphID, graphblockID, gB, sitename) {

    // document.getElementById(titleID).style.cssText = document.getElementById("titleB0").style.cssText;
    // document.getElementById(labelsID).style.cssText = document.getElementById("labelsB0").style.cssText;
    // document.getElementById(graphID).style.cssText = document.getElementById("graphB0").style.cssText;

    // document.getElementById(titleID).style = document.getElementById("titleB0").style;
    // document.getElementById(labelsID).style = document.getElementById("labelsB0").style;
    // document.getElementById(graphID).style = document.getElementById("graphB0").style;

    // document.getElementById(titleID).style.cssText = "font-size: 22px; font-weight: bold; height: 28px; margin-bottom: 23px; text-align: center;"
    // document.getElementById(labelsID).style.cssText = "margin-left: 82px; font-size: 11px; height: 28px; line-height: 28px; margin-top: -23px; text-align: left;"
    // document.getElementById(graphID).style.cssText = "height: 92px; width: 95%; padding-left: 50px; margin-top: 0px; margin-bottom: 15px; text-align: center;"

    // document.getElementById(titleID).style.cssText = "float: left; font-size: 22px; font-weight: bold; height: 28px; text-align: center; padding-top: 10px;"
    // document.getElementById(labelsID).style.cssText = "margin-left: 82px; font-size: 11px; height: 28px; line-height: 28px; margin-top: -23px; text-align: left;"
    // document.getElementById(graphID).style.cssText = "height: 92px; width: 95%; padding-left: 50px; margin-top: 0px; margin-bottom: 15px; text-align: center;"

    document.getElementById(titleID).style.cssText = "font-size: 20px; font-weight: bold; height: 8px; text-align: left; padding-top: 10px;"
    document.getElementById(labelsID).style.cssText = "float: left; width: 88px; font-size: 11px; height: 92px; padding-top: 26px; text-align: left;"
    document.getElementById(graphID).style.cssText = "display: inline-block; height: 86px; width: 80%; padding-left: 10px; margin-top: 0px; margin-bottom: 0px; text-align: center;"

    var graphCssText2 = "display: inline-block; height: 80px; width: 80%; padding-left: 10px; margin-top: 0px; margin-bottom: 0px; text-align: center;";

    // var graphCssText3 = "position: fixed; bottom: 0; display: inline-block; height: 100px; width: " + document.getElementById(graphID).offsetWidth + "px; padding-left: 10px; margin-top: 0px; margin-bottom: 60px; text-align: center; background-color: white;"
    // var graphCssText3 = "position: fixed; bottom: 0; display: inline-block; height: 100px; width: " + document.getElementById(graphID).offsetWidth + "px; padding-left: 10px; margin-top: 0px; margin-bottom: 60px; text-align: center;"

    // gB = 0
    var graphCssText3 = "display: inline-block; height: 100px; width: " + document.getElementById(graphID).offsetWidth + "px; padding-left: 10px; margin-top: 0px; text-align: center;"
    var graphCssText4 = "float: left; width: 88px; font-size: 11px; height: 92px; padding-top: 26px; margin-bottom: 20px; text-align: left;"

    var graphblockCssText = "position: fixed; bottom: 0; background-color: white; z-index: 99; width: 100%; border-width: 1px; border-top-style: solid;"
    // var graphblockCssText = "position: fixed; bottom: 0; z-index: 99; width: 100%; border-width: 1px; border-top-style: solid;"

    // console.debug(document.getElementById(graphID).offsetWidth)
    // console.debug(document.getElementById(graphID).clientWidth)

    var latlonPoint = lat + "," + lon;
    // var latlonTitle = lat + ", " + lon;

    // var latlonTitle = lat.toFixed(2) + ", " + lon.toFixed(2);
    // document.getElementById(titleID).innerHTML = latlonTitle;

    document.getElementById(titleID).innerHTML = sitename;

    document.getElementById(graphID).innerHTML = "Loading...";
    document.getElementById(graphID).style.lineHeight = "86px";

    // Outside Finland, no SMARTOBS or scaling
    if (!inFinland(lat, lon)) {
        graphLoad = $.getJSON("https://sm1.harvesterseasons.com/timeseries?latlon=" + latlonPoint + "&param=" + param1 + "," + param2 + "," + param3 + "," + param4 + "," + param5 + "," + param6 + "," + param7 + "&starttime=" + dateString_timeseries + "&endtime=" + dateString_ecbsf + "&timestep=1440&format=json&source=grid&timeformat=xml&tz=utc",
        // graphLoad = $.getJSON("https://sm1.harvesterseasons.com/timeseries?latlon=" + latlonPoint + "&param=" + param1 + "," + param5 + "," + param6 + "," + param7 + "&starttime=" + dateString_timeseries + "&endtime=" + dateString_ecbsf + "&timestep=1440&format=json&source=grid&timeformat=xml&tz=utc",
        function (data) {
                var graphdata = [];
                for (var i = 0, k = 0; i < data.length; i++) {
                    var summer1, summer2, winter1, winter2;

                    // Seasonal summer index
                    if (data[i][param2] !== null) { summer1 = data[i][param2]; }
                    else { summer1 = 'nan'; }

                    // Seasonal winter index
                    if (data[i][param3] !== null || data[i][param4] !== null) { winter1 = Math.max(data[i][param3], data[i][param4]); }
                    else { winter1 = 'nan'; }

                    // 10 day forecast summer index                        
                    if (data[i][param5] !== null) { summer2 = data[i][param5]; }
                    else { summer2 = 'nan'; }

                    // // 10 day forecast winter index                        
                    // if (data[i][param6] !== null || data[i][param7] !== null) { winter2 = Math.max(data[i][param6], data[i][param7]); }
                    if (data[i][param7] !== null) { winter2 = data[i][param7]; }
                    else { winter2 = 'nan'; }

                    if (summer1 !== 'nan' || winter1 !== 'nan' || summer2 !== 'nan' || winter2 !== 'nan') {
                        graphdata[k] = [new Date(data[i][param1]), summer1, winter1, summer2, winter2];
                        k++;
                    }
                }

                if (graphdata.length > 0) {
                    // if (gB < graphIdx - 1) {
                    if (gB > 0) {
                        document.getElementById(graphID).style.cssText = graphCssText2;

                        dyGraphBOptions2.labelsDiv = labelsID;
                        graphList[gB] = new Dygraph(
                            document.getElementById(graphID),
                            graphdata,
                            dyGraphBOptions2,
                        );
                    } else {
                        document.getElementById(graphblockID).style.cssText = graphblockCssText;
                        document.getElementById(graphID).style.cssText = graphCssText3;
                        document.getElementById(labelsID).style.cssText = graphCssText4;

                        dyGraphBOptions.labelsDiv = labelsID;
                        graphList[gB] = new Dygraph(
                            document.getElementById(graphID),
                            graphdata,
                            dyGraphBOptions,
                        );

                        var footer = document.createElement('div');
                        footer.id = "footer";
                        footer.innerHTML = `<a href="https://harvesterseasons.com/">Harvester Seasons</a>
                        <a href="../privacy-policy/" target="_blank" style="float: right;">Privacy Policy / Terms of Use</a>`;
                        document.getElementById(graphblockID).appendChild(footer);

                    }
                    // if (graphList.length > 1) {
                    //     var sync = Dygraph.synchronize(graphList);
                    // }
                    document.getElementById(graphID).style.lineHeight = "1";
                } else {
                    document.getElementById(graphID).innerHTML = "Error loading data";
                }
            });
    } else {
        // Inside Finland, seasonal snow depth combined and scaled with SMARTOBS observations
        var dataUrl2 = "https://sm1.harvesterseasons.com/timeseries?latlon=" + latlonPoint + "&param=" + SHensemble2 + "&starttime=" + dateString_smartobs + "T000000Z&timesteps=1&format=json&precision=full";
        $.getJSON(dataUrl2, function (data2) {

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


            graphLoad = $.getJSON("https://sm1.harvesterseasons.com/timeseries?latlon=" + latlonPoint + "&param=" + param1 + "," + param2 + "," + param3 + "," + param4ensemble + "," + param5 + "," + param6 + "," + param7 + "," + param8 + "&starttime=" + dateString_timeseries + "&endtime=" + dateString_ecbsf + "&timestep=1440&format=json&source=grid&timeformat=xml&tz=utc",
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

                        if (summer1 !== 'nan' || winter1 !== 'nan' || summer2 !== 'nan' || winter2 !== 'nan') {
                            graphdata[k] = [new Date(data[i][param1]), summer1, winter1, summer2, winter2];
                            k++;
                        }
                    }

                    if (graphdata.length > 0) {
                        // if (gB < graphIdx - 1) {
                        if (gB > 0) {
                            document.getElementById(graphID).style.cssText = graphCssText2;

                            dyGraphBOptions2.labelsDiv = labelsID;
                            graphList[gB] = new Dygraph(
                                document.getElementById(graphID),
                                graphdata,
                                dyGraphBOptions2,
                            );
                        } else {
                            document.getElementById(graphblockID).style.cssText = graphblockCssText;
                            document.getElementById(graphID).style.cssText = graphCssText3;
                            document.getElementById(labelsID).style.cssText = graphCssText4;

                            dyGraphBOptions.labelsDiv = labelsID;
                            graphList[gB] = new Dygraph(
                                document.getElementById(graphID),
                                graphdata,
                                dyGraphBOptions,
                            );

                            var footer = document.createElement('div');
                            footer.id = "footer";
                            footer.innerHTML = `<a href="https://harvesterseasons.com/">Harvester Seasons</a>
                            <a href="../privacy-policy/" target="_blank" style="float: right;">Privacy Policy / Terms of Use</a>`;
                            document.getElementById(graphblockID).appendChild(footer);

                        }
                        // if (graphList.length > 1) {
                        //     var sync = Dygraph.synchronize(graphList);
                        // }
                        document.getElementById(graphID).style.lineHeight = "1";
                    } else {
                        document.getElementById(graphID).innerHTML = "Error loading data";
                    }
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