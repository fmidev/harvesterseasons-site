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

var startMonth2 = now.getUTCMonth();

if (now.getUTCDate() < 9) {
    // var startDate = new Date(Date.UTC(startYear, startMonth2 - 1, 2));
    var startDate = new Date(Date.UTC(startYear, startMonth2 - 1, 1));
}
else {
    // var startDate = new Date(Date.UTC(startYear, startMonth2, 2));
    var startDate = new Date(Date.UTC(startYear, startMonth2, 1));
}

var currentDate = new Date(Date.UTC(startYear, startMonth-1, startDay));

var startDateYear = startDate.getUTCFullYear();
var startDateMonth = startDate.getUTCMonth() + 1;
if (startDateMonth < 10) {
    startDateMonth = '0' + startDateMonth;
}
// var dateString = startDateYear + '-' + startDateMonth + '-02/P7M';
var dateString = startDateYear + '-' + startDateMonth + '-01/P7M';

// Date for the latest NDVI data
let ndviDateString, ndviDateYear, ndviDateMonth, ndviDateDay;
let ndviDate, ndviEndDate;

// // Data available on the second day
// if (now.getUTCDate() <= 1) {
//     ndviDate = new Date(Date.UTC(startYear, startMonth2 - 1, 11));
// }
// else if (now.getUTCDate() <= 11) {
//     ndviDate = new Date(Date.UTC(startYear, startMonth2 - 1, 21));
// }
// else if (now.getUTCDate() <= 21) {
//     ndviDate = new Date(Date.UTC(startYear, startMonth2, 1));
// }
// else {
//     ndviDate = new Date(Date.UTC(startYear, startMonth2, 11));
// }

// Data available on the fourth day
if (now.getUTCDate() <= 3) {
    ndviDate = new Date(Date.UTC(startYear, startMonth2 - 1, 11));
}
else if (now.getUTCDate() <= 13) {
    ndviDate = new Date(Date.UTC(startYear, startMonth2 - 1, 21));
}
else if (now.getUTCDate() <= 23) {
    ndviDate = new Date(Date.UTC(startYear, startMonth2, 1));
}
else {
    ndviDate = new Date(Date.UTC(startYear, startMonth2, 11));
}

ndviDateYear = ndviDate.getUTCFullYear();
ndviDateMonth = ndviDate.getUTCMonth() + 1;
if (ndviDateMonth < 10) {
    ndviDateMonth = '0' + ndviDateMonth;
}
ndviDateDay = ndviDate.getUTCDate();
if (ndviDateDay < 10) {
    ndviDateDay = '0' + ndviDateDay;
}

ndviDateString = ndviDateYear + '-' + ndviDateMonth + '-' + ndviDateDay;

// ndviEndDate = new Date(Date.UTC(ndviDate.getUTCFullYear(), ndviDate.getUTCMonth(), ndviDate.getUTCDate()+21)); // 22 days (data available on the second day)

ndviEndDate = new Date(Date.UTC(ndviDate.getUTCFullYear(), ndviDate.getUTCMonth(), ndviDate.getUTCDate()+23)); // 24 days (data available on the fourth day)

var dateString_origintime = startYear.toString() + startMonth + startDay + '0000';

let smartmetDate = new Date(Date.UTC(startYear, startMonth - 1, now.getUTCDate() + 10));

var smartmetYear = smartmetDate.getUTCFullYear();
var smartmetMonth = smartmetDate.getUTCMonth() + 1;
var smartmetDay = smartmetDate.getUTCDate();
if (smartmetMonth < 10) {
    smartmetMonth = '0' + smartmetMonth;
}
if (smartmetDay < 10) {
    smartmetDay = '0' + smartmetDay;
}

var dateString_smartmet = smartmetYear.toString() + smartmetMonth + smartmetDay + '0000';


let swiDate, swiEndDate;
let edteDate, edteDate2, edteStartDate, edteEndDate;
let ecensStartDate, ecensEndDate;
let ecxensStartDate, ecxensEndDate;

// Initial estimate
let swiEndDay = now.getUTCDate() - 4;
swiEndDate = new Date(Date.UTC(startYear, startMonth-1, swiEndDay));

let edteStartDay = now.getUTCDate() - 1;
edteEndDate = new Date(Date.UTC(startYear, startMonth-1, edteStartDay));

let edteEndDay = now.getUTCDate() + 2;
edteEndDate = new Date(Date.UTC(startYear, startMonth-1, edteEndDay));

// console.debug(swiEndDate)

ecensStartDate = new Date(Date.UTC(2025, 5, 22)); // 22.6.2025
let ecensEndDay = now.getUTCDate() + 13;
ecensEndDate = new Date(Date.UTC(startYear, startMonth-1, ecensEndDay));

// console.debug(ecensEndDate);

ecxensStartDate = new Date(Date.UTC(2025, 5, 22)); // 22.6.2025
let ecxensEndDay = now.getUTCDate() + 12;
ecxensEndDate = new Date(Date.UTC(startYear, startMonth-1, ecxensEndDay));


$.get('https://desm.harvesterseasons.com/wms?&service=WMS&request=GetCapabilities', function (data) {

    let layerlist = data.getElementsByTagName("Layer");

    let swiDateList;
    for (i = 0; i < layerlist.length; i++) {
        // console.debug(layerlist[i].childNodes[1].firstChild.nodeValue)  
        if (layerlist[i].childNodes[1].firstChild.nodeValue === 'harvester:swi:SWI2-M3M3') {
        // if (layerlist[i].childNodes[1].firstChild.nodeValue === 'harvester:swi:SWI1') { // 10.6.2025 Quick fix for missing SWI2 time dimension
        // if (layerlist[i].childNodes[1].firstChild.nodeValue === 'harvester:swi:SWI2-0TO1') {
        // if (layerlist[i].childNodes[1].firstChild.nodeValue === 'gui:isobands:SWI_SWI2') {
            // console.debug(layerlist[i].childNodes)
            // console.debug(layerlist[i].childNodes[1].firstChild.nodeValue)
            // console.debug(layerlist[i].childNodes[41].firstChild)
            // console.debug(layerlist[i].childNodes[41].firstChild.nodeValue)
            swiDateList = layerlist[i].childNodes[41].firstChild.nodeValue.split(",");
            // swiDateList = layerlist[i].childNodes[29].firstChild.nodeValue.split(",");
            break;
        }
    }
    // ndviDate = new Date('2022-05-10');   
    swiDate = new Date(swiDateList[swiDateList.length-1]);

    // console.debug(swiDateList[swiDateList.length-1])
    // console.debug(swiDate)

    swiEndDate = new Date(Date.UTC(swiDate.getUTCFullYear(), swiDate.getUTCMonth(), swiDate.getUTCDate()));

    // console.debug(swiEndDate)

    let edteDateList;
    for (i = 0; i < layerlist.length; i++) {
        if (layerlist[i].childNodes[1].firstChild.nodeValue === 'harvester:edte') {
            // console.debug(layerlist[i].childNodes)
            // console.debug(layerlist[i].childNodes[1].firstChild.nodeValue)
            // console.debug(layerlist[i].childNodes[37].firstChild)
            // console.debug(layerlist[i].childNodes[37].firstChild.nodeValue)
            edteDateList = layerlist[i].childNodes[37].firstChild.nodeValue.split(",");
            break;
        }
    }

    edteDate = new Date(edteDateList[0]);

    // console.debug(edteDateList[0])
    // console.debug(edteDate)

    // edteDate2 = new Date(edteDateList[edteDateList.length-1]);
    edteDate2 = new Date(edteDateList[edteDateList.length-2]);

    // console.debug(edteDateList[edteDateList.length-1])
    // console.debug(edteDate2)

    edteStartDate = new Date(Date.UTC(edteDate.getUTCFullYear(), edteDate.getUTCMonth(), edteDate.getUTCDate()));
    edteEndDate = new Date(Date.UTC(edteDate2.getUTCFullYear(), edteDate2.getUTCMonth(), edteDate2.getUTCDate()));

    // console.debug(edteStartDate)
    // console.debug(edteEndDate)

    // NDVI layer enabled
    lcontrol._overlaysList.children[6].control.disabled = false;
    lcontrol._overlaysList.children[6].style.color = "initial";
    ndviLayerLoaded = true;

})


var mappos = L.Permalink.getMapLocation();

var map = L.map('map', {
    //zoom: 6,
    // minZoom: 5,
    minZoom: 3,
    maxZoom: 16,
    fullscreenControl: false,
    //center: [64.0, 27.0],
    timeDimension: true,
    timeDimensionControl: true,
    //timeDimensionControl: false,
    timeDimensionOptions: {
        timeInterval: dateString,
        period: "P1D",
    },
    timeDimensionControlOptions: {
        //timeZones: "Local Time",
        backwardButton: false,
        forwardButton: false,
        playButton: false,
        timeSlider: false,
        speedSlider: false,        
    },
    center: mappos.center,
    zoom: mappos.zoom,
/*    timeDimensionControlOptions: {
        //timeZones: ["Local"],
        playerOptions: {
            transitionTime: 250,
        }
    }*/
    maxBounds: [[-90, -180],[90, 180]]
});

L.Permalink.setup(map);

// load a tile layer
var thunderforest = L.tileLayer('https://{s}.tile.thunderforest.com/landscape/{z}/{x}/{y}.png?apikey=e60422e636f34988a79015402724757b',
    {
        attribution: 'Tiles by <a href="https://www.thunderforest.com/">Thunderforest</a> Data by <a href="https://www.fmi.fi/">Finnish Meteorological Institute</a>',
        maxZoom: 22,
        minZoom: 0,
        noWrap: true
    })//.addTo(map);

// load a tile layer
var maastokartta = L.tileLayer('https://avoin-karttakuva.maanmittauslaitos.fi/avoin/wmts/1.0.0/maastokartta/default/WGS84_Pseudo-Mercator/{z}/{y}/{x}.png?api-key=45deef08-fd2f-42ae-9953-5550fff43b17',
{
    attribution: 'Tiles by <a href="https://www.maanmittauslaitos.fi/">Maanmittauslaitos</a> Data by <a href="https://www.fmi.fi/">Finnish Meteorological Institute</a>',
    maxZoom: 16,
    minZoom: 5,
    noWrap: true
}).addTo(map);


// load a tile layer
var taustakartta = L.tileLayer('https://avoin-karttakuva.maanmittauslaitos.fi/avoin/wmts/1.0.0/taustakartta/default/WGS84_Pseudo-Mercator/{z}/{y}/{x}.png?api-key=45deef08-fd2f-42ae-9953-5550fff43b17',
{
    attribution: 'Tiles by <a href="https://www.maanmittauslaitos.fi/">Maanmittauslaitos</a> Data by <a href="https://www.fmi.fi/">Finnish Meteorological Institute</a>',
    maxZoom: 16,
    minZoom: 5,
    noWrap: true
})//.addTo(map);

// // load a tile layer
// L.tileLayer('https://avoin-karttakuva.maanmittauslaitos.fi/avoin/wmts/1.0.0/kiinteistojaotus/default/WGS84_Pseudo-Mercator/{z}/{y}/{x}.png?api-key=45deef08-fd2f-42ae-9953-5550fff43b17',
//     {
//         maxZoom: 16,
//         minZoom: 13,
//         zIndex: 20,
//         noWrap: true
//     }).addTo(map);

// load a tile layer
var estates = L.tileLayer('https://avoin-karttakuva.maanmittauslaitos.fi/avoin/wmts/1.0.0/kiinteistojaotus/default/WGS84_Pseudo-Mercator/{z}/{y}/{x}.png?api-key=45deef08-fd2f-42ae-9953-5550fff43b17',
    {
        maxZoom: 16,
        minZoom: 13,
        zIndex: 20,
        noWrap: true
    }).addTo(map);

var baseMaps = {
    "Thunderforest": thunderforest,
    "Maastokartta": maastokartta,
    "Taustakartta": taustakartta,
};


// create scale control and add to map
L.control.scale({imperial: false, maxWidth: 200, position: 'bottomright'}).addTo(map);

// create location control and add to map
var lc = L.control.locate({
    showCompass: false,
    //drawCircle: false,
    //drawMarker: false,
    //timeout: 100,
    //initialZoomLevel: 13,
    locateOptions: {
        //maxZoom: 15
        maxZoom: 14
    },
    strings: {
        title: "Show location"
    },
}).addTo(map);

//console.debug(mappos.center)
//console.debug(mappos.center[0] == 64 && mappos.center[1] == 27 )

if (mappos.center[0] == 64 && mappos.center[1] == 27) {
    // request location update and set location
    lc.start();
} 

// const rasterUrl = "https://copernicus.data.lit.fmi.fi/harvestability/Europe-2023-trfy-r30m.tif";
const rasterUrl = "https://pta.data.lit.fmi.fi/geo/harvestability/KKL_SMK_Suomi_2021_06_01-UTM35.tif";

var georastercache;

// var geotiffSmartmetDate;
var geotiffSmartobsDate;

parseGeoraster(rasterUrl).then(georaster => {
    georastercache = georaster;
    plotgeotiffstatic();
    plotgeotiff();
});

map.on('locationfound', onLocationFound);
map.on('locationerror', onLocationError);

// GeoTIFF-layer time management

var titleB = document.getElementById("titleB");

var dateslider = document.getElementById("date-range");
var dateoutput = document.getElementById("date-value");
var harvDynamic = document.getElementById("dynamic-checkbox");

var sliderDate = new Date(startDate);

dateslider.value = (currentDate-startDate)/(24*60*60*1000);

sliderDate.setUTCDate(sliderDate.getUTCDate() + Number(dateslider.value));
dateoutput.innerHTML = sliderDate.toLocaleDateString(); // Display the default slider value

map.timeDimension.setCurrentTime(sliderDate.getTime());

//console.debug(sliderDate)

var repeatId = 0;
var dateforwardRepeatId = 0;
var datebackRepeatId = 0;

dateslider.oninput = function () {
    clearInterval(playButtonRepeatId);
    //playButton.value = "Play";
    sliderDate = new Date(startDate);
    sliderDate.setUTCDate(sliderDate.getUTCDate() + Number(this.value));
    dateoutput.innerHTML = sliderDate.toLocaleDateString();
}

dateslider.onchange = function () {
    if (harvDynamic.checked && georastercache && map.hasLayer(traffLayer)) {
         plotgeotiff();
    }
    map.timeDimension.setCurrentTime(sliderDate.getTime());
    if (playButton.value == "Stop" ) {
        clearInterval(playButtonRepeatId);
        playButtonRepeatId = setInterval(playButtonIntervalFunc, 500);
        //console.debug('timeload')
    }
    if (typeof gB !== 'undefined') { gB.updateOptions({underlayCallback: timeseriedateline}) };
    if (typeof gsh !== 'undefined') {gsh.updateOptions({underlayCallback: timeseriedateline}) };
    if (typeof gsw !== 'undefined') {gsw.updateOptions({underlayCallback: timeseriedateline}) };
    if (typeof gst !== 'undefined') {gst.updateOptions({underlayCallback: timeseriedateline}) };
    plotndvi();
    plotsoilwetness();
    plotsoiltemperature();
    plotsnowthickness();
}

function dateback() {
    clearInterval(playButtonRepeatId);
    playButton.value = "Play";
    if (Number(dateslider.value) > Number(dateslider.min)) {
        dateslider.value = Number(dateslider.value) - 1;
        sliderDate.setUTCDate(sliderDate.getUTCDate() - 1);
        dateoutput.innerHTML = sliderDate.toLocaleDateString();
        //dateoutput.innerHTML = sliderDate.toDateString().substring(4);
        if (harvDynamic.checked && georastercache && map.hasLayer(traffLayer)) {
            plotgeotiff();
        }
        map.timeDimension.setCurrentTime(sliderDate.getTime());
        if (typeof gB !== 'undefined') { gB.updateOptions({underlayCallback: timeseriedateline}) };
        if (typeof gsh !== 'undefined') {gsh.updateOptions({underlayCallback: timeseriedateline}) };
        if (typeof gsw !== 'undefined') {gsw.updateOptions({underlayCallback: timeseriedateline}) };
        if (typeof gst !== 'undefined') {gst.updateOptions({underlayCallback: timeseriedateline}) };
        plotndvi();
        plotsoilwetness();
        plotsoiltemperature();
        plotsnowthickness();
    }
}

function datebackscrollIntervalFunc() {
    if (Number(dateslider.value) > Number(dateslider.min)) {
        dateslider.value = Number(dateslider.value) - 1;
        sliderDate.setUTCDate(sliderDate.getUTCDate() - 1);
        dateoutput.innerHTML = sliderDate.toLocaleDateString();
        //dateoutput.innerHTML = sliderDate.toDateString().substring(4);        
        if (harvDynamic.checked && georastercache && map.hasLayer(traffLayer)) {
            plotgeotiff();
        }
        map.timeDimension.setCurrentTime(sliderDate.getTime());
        if (typeof gB !== 'undefined') { gB.updateOptions({underlayCallback: timeseriedateline}) };
        if (typeof gsh !== 'undefined') {gsh.updateOptions({underlayCallback: timeseriedateline}) };
        if (typeof gsw !== 'undefined') {gsw.updateOptions({underlayCallback: timeseriedateline}) };
        if (typeof gst !== 'undefined') {gst.updateOptions({underlayCallback: timeseriedateline}) };
        plotndvi();
        plotsoilwetness();
        plotsoiltemperature();
        plotsnowthickness();
    }
}

function datebackscroll() {
    clearInterval(playButtonRepeatId);
    playButton.value = "Play";
    datebackRepeatId = setInterval(datebackscrollIntervalFunc, 500);
}

function datebackscrollfast() {
    clearInterval(playButtonRepeatId);
    //playButton.value = "Play";
    repeatId = setInterval(function () {
        if (Number(dateslider.value) > Number(dateslider.min)) {
            dateslider.value = Number(dateslider.value) - 1;
            sliderDate.setUTCDate(sliderDate.getUTCDate() - 1);
            dateoutput.innerHTML = sliderDate.toLocaleDateString();
        }
    }, 60);
}

function dateforward() {
    clearInterval(playButtonRepeatId);
    playButton.value = "Play";
    if (Number(dateslider.value) < Number(dateslider.max)) {
        dateslider.value = Number(dateslider.value) + 1;
        sliderDate.setUTCDate(sliderDate.getUTCDate() + 1);
        dateoutput.innerHTML = sliderDate.toLocaleDateString();

        if (harvDynamic.checked && georastercache && map.hasLayer(traffLayer)) {
            plotgeotiff();
        }
        map.timeDimension.setCurrentTime(sliderDate.getTime());
        if (typeof gB !== 'undefined') { gB.updateOptions({underlayCallback: timeseriedateline}) };
        if (typeof gsh !== 'undefined') {gsh.updateOptions({underlayCallback: timeseriedateline}) };
        if (typeof gsw !== 'undefined') {gsw.updateOptions({underlayCallback: timeseriedateline}) };
        if (typeof gst !== 'undefined') {gst.updateOptions({underlayCallback: timeseriedateline}) };
        plotndvi();
        plotsoilwetness();
        plotsoiltemperature();
        plotsnowthickness();
    }
}

function dateforwardscrollIntervalFunc() {
    if (Number(dateslider.value) < Number(dateslider.max)) {
        dateslider.value = Number(dateslider.value) + 1;
        sliderDate.setUTCDate(sliderDate.getUTCDate() + 1);
        dateoutput.innerHTML = sliderDate.toLocaleDateString();

        if (harvDynamic.checked && georastercache && map.hasLayer(traffLayer)) {
            plotgeotiff();
        }

        map.timeDimension.setCurrentTime(sliderDate.getTime());
        if (typeof gB !== 'undefined') { gB.updateOptions({underlayCallback: timeseriedateline}) };
        if (typeof gsh !== 'undefined') {gsh.updateOptions({underlayCallback: timeseriedateline}) };
        if (typeof gsw !== 'undefined') {gsw.updateOptions({underlayCallback: timeseriedateline}) };
        if (typeof gst !== 'undefined') {gst.updateOptions({underlayCallback: timeseriedateline}) };
        plotndvi();
        plotsoilwetness();
        plotsoiltemperature();
        plotsnowthickness();
    }
}

function dateforwardscroll() {
    clearInterval(playButtonRepeatId);
    playButton.value = "Play";
    dateforwardRepeatId = setInterval(dateforwardscrollIntervalFunc, 500);
}

function dateforwardscrollfast() {
    clearInterval(playButtonRepeatId);

    repeatId = setInterval(function () {
        if (Number(dateslider.value) < Number(dateslider.max)) {
            dateslider.value = Number(dateslider.value) + 1;
            sliderDate.setUTCDate(sliderDate.getUTCDate() + 1);
            dateoutput.innerHTML = sliderDate.toLocaleDateString();
        }
    }, 60);
}

function datestop() {
    clearInterval(dateforwardRepeatId);
    dateforwardRepeatId = 0;
    clearInterval(datebackRepeatId);
    datebackRepeatId = 0;
  }

function datestopscrollfast() {
    if (repeatId > 0 && harvDynamic.checked && georastercache && map.hasLayer(traffLayer)) {
        plotgeotiff();
        //console.debug(repeatId)
    }
    clearInterval(repeatId);
    repeatId = 0;
    map.timeDimension.setCurrentTime(sliderDate.getTime());
    if (typeof gB !== 'undefined') { gB.updateOptions({underlayCallback: timeseriedateline}) };
    if (typeof gsh !== 'undefined') {gsh.updateOptions({underlayCallback: timeseriedateline}) };
    if (typeof gsw !== 'undefined') {gsw.updateOptions({underlayCallback: timeseriedateline}) };
    if (typeof gst !== 'undefined') {gst.updateOptions({underlayCallback: timeseriedateline}) };
    plotndvi();
    plotsoilwetness();
    plotsoiltemperature();
    plotsnowthickness();

  }


var playButton = document.getElementById("playbutton");
//console.debug(playButton.value)
var playButtonRepeatId;

function playButtonIntervalFunc() {
    if (Number(dateslider.value) < Number(dateslider.max)) {
        dateslider.value = Number(dateslider.value) + 1;
        sliderDate.setUTCDate(sliderDate.getUTCDate() + 1);
        dateoutput.innerHTML = sliderDate.toLocaleDateString();
        //dateoutput.innerHTML = sliderDate.toDateString().substring(4);
        if (harvDynamic.checked && georastercache && map.hasLayer(traffLayer)) {
            plotgeotiff();
        }
        map.timeDimension.setCurrentTime(sliderDate.getTime());
        if (typeof gB !== 'undefined') { gB.updateOptions({underlayCallback: timeseriedateline}) };
        if (typeof gsh !== 'undefined') {gsh.updateOptions({underlayCallback: timeseriedateline}) };
        if (typeof gsw !== 'undefined') {gsw.updateOptions({underlayCallback: timeseriedateline}) };
        if (typeof gst !== 'undefined') {gst.updateOptions({underlayCallback: timeseriedateline}) };
        plotndvi();
        plotsoilwetness();
        plotsoiltemperature();
        plotsnowthickness();
    } else {
        clearInterval(playButtonRepeatId);
        playButton.value = "Play";
    }
}

function playbuttonfunc() {
    //console.debug(playButton.clicked)

    if (playButton.value == "Play") {
        playButton.value = "Stop";
        //playButton.style.color = "red";
        playButtonRepeatId = setInterval(playButtonIntervalFunc, 500);
    } else {
        clearInterval(playButtonRepeatId);
        playButton.value = "Play";
        //playButton.style.color = "initial";
    }
}

map.timeDimension.on('timeloading', function(e) {
    if (playButton.value == "Stop") {
        clearInterval(playButtonRepeatId);
        //console.debug('timeloading')
    }
    if (dateforwardRepeatId > 0) {
        clearInterval(dateforwardRepeatId);
    }
    if (datebackRepeatId > 0) {
        clearInterval(datebackRepeatId);
    }
});

map.timeDimension.on('timeload', function(e) {
    if (playButton.value == "Stop"  && repeatId == 0) {
            clearInterval(playButtonRepeatId);
            playButtonRepeatId = setInterval(playButtonIntervalFunc, 500);
            //console.debug('timeload')
    }
    if (dateforwardRepeatId > 0) {
        clearInterval(dateforwardRepeatId);
        dateforwardRepeatId = setInterval(dateforwardscrollIntervalFunc, 500);
    }
    if (datebackRepeatId > 0) {
        clearInterval(datebackRepeatId);
        datebackRepeatId = setInterval(datebackscrollIntervalFunc, 500);
    }
});


harvDynamic.checked = false;
harvDynamic.disabled = true;
document.getElementById("dynamic").style.color = "rgb(190, 190, 190)";

playButton.disabled = false;

var harvDynamicState = true; // set by user
var traffState = true; // set by user


function changedynamic() {
    if (!harvDynamic.checked && !map.hasLayer(snowthicknessTimeLayer) &&
        !map.hasLayer(soilwetnessTimeLayer) && !map.hasLayer(temperatureTimeLayer)) {
            playButton.disabled = true;
            if (playButton.value == "Stop") {
                clearInterval(playButtonRepeatId);
                playButton.value = "Play";
            }
    } else if (harvDynamic.checked && playButton.disabled) {
        playButton.disabled = false;
    }
    if (harvDynamicState == true) {
        harvDynamicState = false;
    } else {
        harvDynamicState = true;
    }
    //if (georastercache) { plotgeotiff(); };
    if (georastercache) { 
        idx = -10; // redraw trafficability
        setTimeout( function () { plotgeotiff() }, 1000); 
    }; // always re-draw
}


const param_utctime="utctime";

// const param_ecxsf_swi2="HARVIDX{0.55;SWI2-0TO1:ECXSF:5062:1:0:0:0-50}";
// const param_ecxsf_swi2="HARVIDX{0.69;SWI2-0TO1:ECXSF:5062:1:0:0:0-50}";
const param_ecxsf_swi2="HARVIDX{0.69;SWI2-0TO1:ECXSF:5062:1:0:3:1-50;SWI2-0TO1:ECXSF:5062:1:0:1:0}";

const param_ecxens_swi2="HARVIDX{0.69;SWI2-0TO1:ECXENS:5072:1:0:3:1-50;SWI2-0TO1:ECXENS:5072:1:0:1:0}";

const param_ecbsf_tsoil="HARVIDX{273;TSOIL-K:ECBSF:::7:3:1-50;TSOIL-K:ECBSF:::7:1:0}";

const param_ecens_tsoil="HARVIDX{273;TSOIL-K:ECENS::::3:1-50;TSOIL-K:ECENS::::1:0}";

const param_ecbsf_hsnow="ensover{0.4;0.9;HSNOW-M:ECBSF::1:0:3:1-50;HSNOW-M:ECBSF::1:0:1:0}";

const param_ecens_hsnow="ensover{0.4;0.9;HSNOW-M:ECENS::1:0:3:1-50;HSNOW-M:ECENS::1:0:1:0}";

// const param_swi_swi2 = "HARVIDX{0.55;SWI2-0TO1:SWI}";
// const param_swi_swi2 = "HARVIDX{0.55;SWI2-0TO1:EDTE:5068}";
// const param_swi_swi2 = "HARVIDX{0.69;SWI2-0TO1:EDTE:5068}";
const param_swi_swi2 = "HARVIDX{0.69;SWI2-0TO1:SWI}";


// const param6 = "HARVIDX{-0.7;TG-K:SMARTMET}";
// const param6 = "HARVIDX{273.05;TSOIL-K:EDTE}";

// const param_smartmet_hsnow = "ensover{0.4;0.9;HSNOW-M:SMARTMET:5027}";
const param_smartobs_hsnow = "ensover{0.4;0.9;HSNOW-M:SMARTOBS:13:4}";

var harvLayer, harvStaticLayer;


var startDate_smartobs = new Date();

startDate_smartobs.setDate(startDate_smartobs.getUTCDate() - 30);

var startMonth_smartobs = startDate_smartobs.getUTCMonth() + 1;
if (startMonth_smartobs < 10) {
    startMonth_smartobs = '0' + startMonth_smartobs;
}
var startDay_smartobs = startDate_smartobs.getUTCDate();
if (startDay_smartobs < 10) {
    startDay_smartobs = '0' + startDay_smartobs;
}
var dateString_smartobs = startDate_smartobs.getUTCFullYear().toString() + startMonth_smartobs + startDay_smartobs;


var perturbations = 50;

// var SWensemblelist = ["SWI2-0TO1:ECXSF:5062:1:0:0:0"];
// for (i = 1; i <= perturbations; i = i + 1) {
//     SWensemblelist[i] = "SWI2-0TO1:ECXSF:5062:1:0:0:" + i;
// }
var SWensemblelist = ["SWI2-0TO1:ECXSF:5062:1:0:1:0"];
var SWensemblelist_ecxens = ["SWI2-0TO1:ECXENS:5072:1:0:1:0"];

var TGKensemblelist = ["K2C{TSOIL-K:ECBSF:::7:1:0}"];
var TGKensemblelist_ecens = ["K2C{TSOIL-K:ECENS::::1:0}"];


for (i = 1; i <= perturbations; i = i + 1) {
    SWensemblelist[i] = "SWI2-0TO1:ECXSF:5062:1:0:3:" + i;
    SWensemblelist_ecxens[i] = "SWI2-0TO1:ECXENS:5072:1:0:3:" + i;

    TGKensemblelist[i] = "K2C{TSOIL-K:ECBSF:::7:3:" + i + "}";
    TGKensemblelist_ecens[i] = "K2C{TSOIL-K:ECENS::::3:" + i + "}";
}


var SHensemblelist = ["HSNOW-M:ECBSF::1:0:1:0"];
var SHensemblelist_ecens = ["HSNOW-M:ECENS::1:0:1:0"];

var SHensemble2 = "DIFF{HSNOW-M:ECBSF::1:0:1:0;HSNOW-M:SMARTOBS:13:4}";
var SHensemble2list = ["DIFF{HSNOW-M:ECBSF::1:0:1:0;HSNOW-M:SMARTOBS:13:4}"];

var SHensemble2_ecens = "DIFF{HSNOW-M:ECENS::1:0:1:0;HSNOW-M:SMARTOBS:13:4}";
var SHensemble2list_ecens = ["DIFF{HSNOW-M:ECENS::1:0:1:0;HSNOW-M:SMARTOBS:13:4}"];

for (i = 1; i <= perturbations; i = i + 1) {
    SHensemblelist[i] = "HSNOW-M:ECBSF::1:0:3:" + i ;
    SHensemblelist_ecens[i] = "HSNOW-M:ECENS::1:0:3:" + i ;  

    SHensemble2 += ",DIFF{HSNOW-M:ECBSF::1:0:3:" + i + ";HSNOW-M:SMARTOBS:13:4}";
    SHensemble2list[i] = "DIFF{HSNOW-M:ECBSF::1:0:3:" + i + ";HSNOW-M:SMARTOBS:13:4}";

    SHensemble2_ecens += ",DIFF{HSNOW-M:ECENS::1:0:3:" + i + ";HSNOW-M:SMARTOBS:13:4}";
    SHensemble2list_ecens[i] = "DIFF{HSNOW-M:ECENS::1:0:3:" + i + ";HSNOW-M:SMARTOBS:13:4}";
}

// Default colormap
const colorFrost = [0, 97, 0];
const colorNormalMineral = [97, 153, 0];
const colorDryMineral = [160, 219, 0];
const colorNormalPeat = [255, 250, 0];
const colorDryPeat = [255, 132, 0];
const colorWinter = [255, 38, 0]; 

const colorWater = [128, 255, 255];

// idx = 1
var colorMap1 = [
    [0, 0, 0],
    colorFrost, // Frost heave (kelirikko)
    colorNormalMineral, // Normal summer, mineral soil (normaali kesä, kivennäismaa)
    colorDryMineral, // Dry summer, mineral soil (kuiva kesä, kivennäismaa)
    colorNormalPeat, // Normal summer, peat soil (normaali kesä, turvemaa)
    colorDryPeat, // Dry summer, peat soil (kuiva kesä, turvemaa)
    colorWinter, // Winter (talvi)
    colorWater, // Water
];

// idx = 0
var colorMapSummer0 = [
    [0, 0, 0],
    colorFrost, // Frost heave (kelirikko)
    colorNormalMineral, // Normal summer, mineral soil (normaali kesä, kivennäismaa)
    colorWinter, // Dry summer, mineral soil (kuiva kesä, kivennäismaa)
    colorNormalPeat, // Normal summer, peat soil (normaali kesä, turvemaa)
    colorWinter, // Dry summer, peat soil (kuiva kesä, turvemaa)
    colorWinter, // Winter (talvi)
    colorWater, // Water
];

// idx = 2
var colorMapSummer2 = [
    [0, 0, 0],
    colorFrost, // Frost heave (kelirikko)
    colorFrost, // Normal summer, mineral soil (normaali kesä, kivennäismaa)
    colorFrost, // Dry summer, mineral soil (kuiva kesä, kivennäismaa)
    colorFrost, // Normal summer, peat soil (normaali kesä, turvemaa)
    colorFrost, // Dry summer, peat soil (kuiva kesä, turvemaa)
    colorWinter, // Winter (talvi)
    colorWater, // Water
];

// idx = 3
var colorMapWinter2 = [
    [0, 0, 0],
    colorFrost, // Frost heave (kelirikko)
    colorFrost, // Normal summer, mineral soil (normaali kesä, kivennäismaa)
    colorFrost, // Dry summer, mineral soil (kuiva kesä, kivennäismaa)
    colorFrost, // Normal summer, peat soil (normaali kesä, turvemaa)
    colorFrost, // Dry summer, peat soil (kuiva kesä, turvemaa)
    colorFrost, // Winter (talvi)
    colorWater, // Water
];

var idxSummer, idxWinter, idx2;

var idx = -100;

// var opacity = 70;

var slider = document.getElementById("opacity-range");
var output = document.getElementById("opacity-value");
slider.value = 70;
output.innerHTML = slider.value + " %"; // Display the default slider value
var opacity = slider.value;

// function plotgeotiff() {
// }

// function plotgeotiffstatic() {
// }

var smartWMS = 'https://desm.harvesterseasons.com/wms?';

var temperatureLayerOptions = {
    // crs: L.CRS.EPSG4326,
    version: '1.3.0',
    layers: 'harvester:ecens:TSOIL-K',
    // layers: 'harvester:ecbsf:TSOIL-K',
    // layers: 'harvester:smartmet:STL1-K',
    format: 'image/png',
    transparent: 'true',
    styles: 'default',
    //source: 'grid',
    opacity: 0.7,
    maxZoom: 9,
    zIndex: 20,
};
var temperatureLayer = L.tileLayer.wms(smartWMS, temperatureLayerOptions);
//var temperatureTimeLayer = L.timeDimension.layer.wms(temperatureLayer, {cache: 100, updateTimeDimension: true});
var temperatureTimeLayer = L.timeDimension.layer.wms(temperatureLayer, {cache: 100});

var temperatureLayerOptions2 = {
    // crs: L.CRS.EPSG4326,
    version: '1.3.0',
    layers: 'harvester:ecbsf:TSOIL-K',
    // layers: 'harvester:smartmet:STL1-K',
    format: 'image/png',
    transparent: 'true',
    styles: 'default',
    //source: 'grid',
    opacity: 0.7,
    maxZoom: 9,
    zIndex: 20,
};
var temperatureLayer2 = L.tileLayer.wms(smartWMS, temperatureLayerOptions2);
//var temperatureTimeLayer = L.timeDimension.layer.wms(temperatureLayer, {cache: 100, updateTimeDimension: true});
var temperatureTimeLayer2 = L.timeDimension.layer.wms(temperatureLayer2, {cache: 100});


var soilwetnessLayerOptions = {
    // crs: L.CRS.EPSG4326,
    version: '1.3.0',
    layers: 'harvester:swi:SWI2-0TO1',
    // layers: 'gui:isobands:SWI_SWI2',
    // layers: 'gui:isobands:SWI_SWI2-M3M3',
    // layers: 'harvester:smartmet:SWVL2-M3M3',
    // layers: 'harvester:ecbsf:SOILWET-M3M3',
    // layers: 'harvester:ecbsf:SOILWET1-M',
    format: 'image/png',
    transparent: 'true',
    styles: 'default',
    //source: 'grid',
    opacity: 0.7,
    // maxZoom: 9,
    zIndex: 20,
};
var soilwetnessLayer = L.tileLayer.wms(smartWMS, soilwetnessLayerOptions);
var soilwetnessTimeLayer = L.timeDimension.layer.wms(soilwetnessLayer, {cache: 100});

var soilwetnessLayerOptions2 = {
    // crs: L.CRS.EPSG4326,
    version: '1.3.0',
    layers: 'gui:isobands:ECXSF_SWI2-0TO1',
    // layers: 'harvester:ecbsf:SOILWET-M3M3',
    // layers: 'harvester:ecbsf:SOILWET1-M',
    format: 'image/png',
    transparent: 'true',
    styles: 'default',
    //source: 'grid',
    opacity: 0.7,
    // maxZoom: 9,
    zIndex: 20,
};
var soilwetnessLayer2 = L.tileLayer.wms(smartWMS, soilwetnessLayerOptions2);
var soilwetnessTimeLayer2 = L.timeDimension.layer.wms(soilwetnessLayer2, {cache: 100});


// var soilwetnessLayerOptions3 = {
//     // crs: L.CRS.EPSG4326,
//     version: '1.3.0',
//     layers: 'harvester:edte:SWI2-0TO1',
//     format: 'image/png',
//     transparent: 'true',
//     styles: 'default',
//     //source: 'grid',
//     opacity: 0.7,
//     // maxZoom: 9,
//     zIndex: 20,
// };
// var soilwetnessLayer3 = L.tileLayer.wms(smartWMS, soilwetnessLayerOptions3);
// var soilwetnessTimeLayer3 = L.timeDimension.layer.wms(soilwetnessLayer3, {cache: 10});

var soilwetnessLayerOptions3 = {
    // crs: L.CRS.EPSG4326,
    version: '1.3.0',
    layers: 'harvester:ecxens:SWI2-0TO1',
    format: 'image/png',
    transparent: 'true',
    styles: 'default',
    //source: 'grid',
    opacity: 0.7,
    // maxZoom: 9,
    zIndex: 20,
};
var soilwetnessLayer3 = L.tileLayer.wms(smartWMS, soilwetnessLayerOptions3);
var soilwetnessTimeLayer3 = L.timeDimension.layer.wms(soilwetnessLayer3, {cache: 100});


var snowthicknessLayerOptions = {
    // crs: L.CRS.EPSG4326,
    version: '1.3.0',
    layers: 'harvester:ecens:HSNOW-M',
    // layers: 'harvester:ecbsf:HSNOW-M',
    format: 'image/png',
    transparent: 'true',
    styles: 'default',
    //source: 'grid',
    opacity: 0.7,
    maxZoom: 9,
    zIndex: 20,
};
var snowthicknessLayer = L.tileLayer.wms(smartWMS, snowthicknessLayerOptions);
var snowthicknessTimeLayer = L.timeDimension.layer.wms(snowthicknessLayer, {cache: 100});

var snowthicknessLayerOptions2 = {
    // crs: L.CRS.EPSG4326,
    version: '1.3.0',
    layers: 'harvester:ecbsf:HSNOW-M',
    format: 'image/png',
    transparent: 'true',
    styles: 'default',
    //source: 'grid',
    opacity: 0.7,
    maxZoom: 9,
    zIndex: 20,
};
var snowthicknessLayer2 = L.tileLayer.wms(smartWMS, snowthicknessLayerOptions2);
var snowthicknessTimeLayer2 = L.timeDimension.layer.wms(snowthicknessLayer2, {cache: 100});

// Latest NDVI product (shown for 22 days)
var ndviLayerOptions = {
    // crs: L.CRS.EPSG4326,
    version: '1.3.0',
    // layers: 'harvester:s3sy:NDVI',
    layers: 'gui:isobands:CLMS_NDVI',
    // layers: 'harvester:clms:CLMS_NDVI',
    format: 'image/png',
    transparent: 'true',
    styles: 'default',
    //source: 'grid',
    opacity: 0.7,
    // maxZoom: 9,
    zIndex: 20,
    // time: '2024-11-01'
    time: ndviDateString
};
var ndviLayer = L.tileLayer.wms(smartWMS, ndviLayerOptions);
// var ndviTimeLayer = L.timeDimension.layer.wms(ndviLayer, {cache: 100});

// Previous NDVI products
var ndviLayerOptions2 = {
    // crs: L.CRS.EPSG4326,
    version: '1.3.0',
    // layers: 'harvester:s3sy:NDVI',
    layers: 'gui:isobands:CLMS_NDVI',
    // layers: 'harvester:clms:CLMS_NDVI',
    format: 'image/png',
    transparent: 'true',
    styles: 'default',
    //source: 'grid',
    opacity: 0.7,
    // maxZoom: 9,
    zIndex: 20,
    attribution: 'NDVI / Source: <a href=https://www.copernicus.eu/en>Copernicus</a>'
};
var ndviLayer2 = L.tileLayer.wms(smartWMS, ndviLayerOptions2);
var ndviTimeLayer = L.timeDimension.layer.wms(ndviLayer2, {cache: 100});

fireWMS = "https://data.fmi.fi/fmi-apikey/edfa704e-69a2-45e2-89bf-d173d79b6b76/wms?";

var forestfireLayerOptions = {
    // crs: L.CRS.EPSG4326,
    version: '1.3.0',
    //layers: 'fmi:kosteusmalli:1km:obs:forestfireindex',
    layers: 'fmi:kosteusmalli:10km:forestfireindex',
    format: 'image/png',
    transparent: 'true',
    styles: 'default',
    opacity: 0.7,
    maxZoom: 9,
    zIndex: 20,
    exceptions: 'blank',
};
var forestfireLayer = L.tileLayer.wms(fireWMS, forestfireLayerOptions);
var firedateString = startYear + '-' + startMonth + '-' + startDay + 'T12:00:00Z/P7M';
var forestfireTimeLayer = L.timeDimension.layer.wms(forestfireLayer, {cache: 10, timeInterval: firedateString});

var forestfire1kmLayerOptions = {
    // crs: L.CRS.EPSG4326,
    version: '1.3.0',
    layers: 'fmi:kosteusmalli:1km:obs:forestfireindex',
    format: 'image/png',
    transparent: 'true',
    styles: 'default',
    opacity: 0.7,
    maxZoom: 9,
    zIndex: 20,
    exceptions: 'blank',
};
var forestfire1kmLayer = L.tileLayer.wms(fireWMS, forestfire1kmLayerOptions);
var forestfire1kmTimeLayer = L.timeDimension.layer.wms(forestfire1kmLayer, {cache: 10});
//forestfire1kmTimeLayer.addTo(map);

var copernicusWMS = 'https://image.discomap.eea.europa.eu/arcgis/services/GioLandPublic/HRL_TreeCoverDensity_2018/ImageServer/WMSServer?';

var treecoverLayerOptions = {
    // crs: L.CRS.EPSG4326,
    version: '1.3.0',
    layers: 'HRL_TreeCoverDensity_2018:TCD_MosaicSymbology',
    format: 'image/png',
    transparent: 'true',
    styles: 'default',
    //source: 'grid',
    opacity: 0.7,
    //maxZoom: 9,
    zIndex: 20,
    attribution: 'Tree Cover Density / Source: <a href=https://www.copernicus.eu/en>Copernicus</a>'
};
var treecoverLayer = L.tileLayer.wms(copernicusWMS, treecoverLayerOptions);

var frostWMS = 'https://paikkatiedot.ymparisto.fi/geoserver/vespa/wms?';

var frostLayerOptions = {
    // crs: L.CRS.EPSG4326,
    version: '1.3.0',
    layers: 'vespa:finnrouy_absoluteValue',
    format: 'image/png',
    transparent: 'true',
    styles: 'rouY_daddy',
    //source: 'grid',
    opacity: 0.7,
    maxZoom: 9,
    zIndex: 20,
    attribution: 'Ground Frost / Source: <a href=https://www.syke.fi/en>Syke</a>'
};
var frostLayer = L.tileLayer.wms(frostWMS, frostLayerOptions);
var frostTimeLayer = L.timeDimension.layer.wms(frostLayer, {cache: 100});

var tempLegend = L.control({
    position: 'bottomright'
});

var snowLegend = L.control({
    position: 'bottomright'
});

var soilwetLegend = L.control({
    position: 'bottomright'
});

var fireLegend = L.control({
    position: 'bottomright'
});

var treecoverLegend = L.control({
    position: 'bottomright'
});

var ndviLegend = L.control({
    position: 'bottomright'
});

var frostLegend = L.control({
    position: 'bottomright'
});

tempLegend.onAdd = function (map) {
    var src = 'https://desm.harvesterseasons.com/wms?REQUEST=GetLegendGraphic&VERSION=1.3.0&LAYER=harvester:ecbsf:TSOIL-C-short&sld_version=1.1.0&style=&format=image/png'; //&WIDTH=60&HEIGHT=455
    var div = L.DomUtil.create('div', 'info legend');
    if (screen.width < 425) {
        div.style.width = '40px';
        div.style.height = '245px';
    } else {
        div.style.width = '48px';
        div.style.height = '270px';
    }
    div.style['background-image'] = 'url(' + src + ')';
    // div.style['background-size'] = 'contain';
    div.style['background-size'] = 'cover';
    div.style['background-repeat'] = 'no-repeat';
    return div;
};

snowLegend.onAdd = function (map) {
    var src = 'https://desm.harvesterseasons.com/wms?REQUEST=GetLegendGraphic&VERSION=1.3.0&LAYER=harvester:ecbsf:SD-M&sld_version=1.1.0&style=&FORMAT=image/png'; //&WIDTH=60&HEIGHT=345
    var div = L.DomUtil.create('div', 'info legend');
    if (screen.width < 425) {
        div.style.width = '50px';
        div.style.height = '245px';
    } else {
        div.style.width = '55px';
        div.style.height = '270px';
    }
    div.style['background-image'] = 'url(' + src + ')';
    // div.style['background-size'] = 'contain';
    div.style['background-size'] = 'cover';
    div.style['background-repeat'] = 'no-repeat';
    return div;
};

soilwetLegend.onAdd = function (map) {
    var src = 'https://desm.harvesterseasons.com/wms?REQUEST=GetLegendGraphic&VERSION=1.3.0&LAYER=harvester:swi:SWI2-0TO1&sld_version=1.1.0&style=&FORMAT=image/png'; //&WIDTH=65&HEIGHT=345
    var div = L.DomUtil.create('div', 'info legend');
    if (screen.width < 425) {
        div.style.width = '75px';
        div.style.height = '245px';
    } else {
        div.style.width = '85px';
        div.style.height = '270px';
    }
    div.style['background-image'] = 'url(' + src + ')';
    // div.style['background-size'] = 'contain';
    div.style['background-size'] = 'cover';
    div.style['background-repeat'] = 'no-repeat';
    return div;
};

fireLegend.onAdd = function (map) {
    var src = 'https://desm.harvesterseasons.com/wms?service=WMS&request=GetLegendGraphic&version=1.3.0&sld_version=1.1.0&style=default&format=image%2Fpng&layer=harvester%3Afmi%3Aforestfireindexlegend'; //&WIDTH=65&HEIGHT=110
    var div = L.DomUtil.create('div', 'info legend');
    div.style.width = '75px';
    div.style.height = '120px';
    div.style['background-image'] = 'url(' + src + ')';
    // div.style['background-size'] = 'contain';
    div.style['background-size'] = 'cover';
    div.style['background-repeat'] = 'no-repeat';
    return div;
};

treecoverLegend.onAdd = function (map) {
    var src = 'https://desm.harvesterseasons.com/wms?REQUEST=GetLegendGraphic&VERSION=1.3.0&LAYER=harvester:copernicus:treecoverdensitylegend&sld_version=1.1.0&style=&FORMAT=image/png'; //&WIDTH=65&HEIGHT=345
    var div = L.DomUtil.create('div', 'info legend');
    if (screen.width < 425) {
        div.style.width = '50px';
        div.style.height = '245px';
    } else {
        div.style.width = '55px';
        div.style.height = '270px';
    }
    div.style['background-image'] = 'url(' + src + ')';
    // div.style['background-size'] = 'contain';
    div.style['background-size'] = 'cover';
    div.style['background-repeat'] = 'no-repeat';
    return div;
};

ndviLegend.onAdd = function (map) {
    var src = 'https://desm.harvesterseasons.com/wms?service=WMS&request=GetLegendGraphic&version=1.3.0&sld_version=1.1.0&style=default&format=image%2Fpng&layer=harvester%3As3sy%3ANDVI'; // &width=85&height=185
    var div = L.DomUtil.create('div', 'info legend');
    div.style.width = '100px';
    div.style.height = '180px';
    div.style['background-image'] = 'url(' + src + ')';
    // div.style['background-size'] = 'contain';
    div.style['background-size'] = 'cover';
    div.style['background-repeat'] = 'no-repeat';
    return div;
};

frostLegend.onAdd = function (map) {
    var src = 'https://paikkatiedot.ymparisto.fi/geoserver/vespa/ows?service=WMS&version=1.3.0&request=GetLegendGraphic&format=image%2Fpng&layer=finnrouy_absoluteValue&style=rouY_daddy'; // &width=20&height=20
    var div = L.DomUtil.create('div', 'info legend');
    div.style.width = '85px';
    div.style.height = '185px';
    div.style['background-image'] = 'url(' + src + ')';
    // div.style['background-size'] = 'contain';
    div.style['background-size'] = 'cover';
    div.style['background-repeat'] = 'no-repeat';
    return div;
};

var traffLayer = L.tileLayer('');

var overlayMaps = {
    "Soil Water Index": soilwetnessTimeLayer,
    "Soil Temperature": temperatureTimeLayer.addTo(map),
    // "Soil Temperature": temperatureTimeLayer,
    "Snow Height": snowthicknessTimeLayer,
    "Forest Fire Index": forestfireTimeLayer,
    "Tree Cover % 2018": treecoverLayer,
    "Trafficability": traffLayer,
    "NDVI": ndviTimeLayer,
    "Ground Frost": frostTimeLayer,
    "Real Estate Borders": estates,
};

if (screen.width < 425) {
    var lcontrol = L.control.layers(baseMaps, overlayMaps).addTo(map);
} else {
    var lcontrol = L.control.layers(baseMaps, overlayMaps, { collapsed: false }).addTo(map);
}

// Trafficability layer disabled
lcontrol._overlaysList.children[5].control.disabled = true;
lcontrol._overlaysList.children[5].style.color = "rgb(190, 190, 190)";

// NDVI layer disabled until GetCapabalities have been loaded
lcontrol._overlaysList.children[6].control.disabled = true;
lcontrol._overlaysList.children[6].style.color = "rgb(190, 190, 190)";
let ndviLayerLoaded = false;

// Real Estate Borders layer grayed out
lcontrol._overlaysList.children[8].style.color = "rgb(190, 190, 190)";


//soilwetLegend.addTo(map); 
tempLegend.addTo(map);

// frostLegend.addTo(map); 
//fireLegend.addTo(map); 

map.on('overlayremove', function (e) {

    if (map.getZoom() <= 9 && !map.hasLayer(snowthicknessTimeLayer) &&
    !map.hasLayer(soilwetnessTimeLayer) && !map.hasLayer(temperatureTimeLayer) &&
    !map.hasLayer(forestfireTimeLayer) && !map.hasLayer(traffLayer)
    && !map.hasLayer(ndviTimeLayer) && !map.hasLayer(treecoverLayer)
    && !map.hasLayer(frostTimeLayer)
    ) {
        forecast = -1;
    }

    if (!harvDynamic.checked && !map.hasLayer(snowthicknessTimeLayer) &&
        !map.hasLayer(soilwetnessTimeLayer) && !map.hasLayer(temperatureTimeLayer) &&
        !map.hasLayer(forestfireTimeLayer) 
        && !map.hasLayer(ndviTimeLayer)
        && !map.hasLayer(frostTimeLayer)
        ) {
        clearInterval(playButtonRepeatId);
        playButton.value = "Play";
        playButton.disabled = true;
    }

    switch (e.name) {
        case "Snow Height": {
            if (map.hasLayer(snowthicknessTimeLayer2)) {
                map.removeLayer(snowthicknessTimeLayer2);
            }
            map.removeControl(snowLegend);
            break;
        }
        case "Soil Water Index": {
            if (map.hasLayer(soilwetnessTimeLayer2)) {
                map.removeLayer(soilwetnessTimeLayer2);
            }
            if (map.hasLayer(soilwetnessTimeLayer3)) {
                map.removeLayer(soilwetnessTimeLayer3);
            }
            map.removeControl(soilwetLegend);
            break;
        }
        case "Soil Temperature": {
            if (map.hasLayer(temperatureTimeLayer2)) {
                map.removeLayer(temperatureTimeLayer2);
            }
            map.removeControl(tempLegend);
            break;
        }
        case "Forest Fire Index": {
            map.removeLayer(forestfire1kmTimeLayer);
            map.removeControl(fireLegend);
            break;
        }
        case "Tree Cover % 2018": {
            map.removeControl(treecoverLegend);
            break;
        }
        case "Ground Frost": {
            map.removeControl(frostLegend);
            break;
        }
        case "NDVI": {
            if (map.hasLayer(ndviLayer)) { 
                map.removeLayer(ndviLayer); 
            }
            if (map.hasLayer(ndviTimeLayer)) { 
                map.removeLayer(ndviTimeLayer);
            }
            map.removeControl(ndviLegend);
            break;
        }
        case "Trafficability": {
            if (map.hasLayer(harvLayer)) {
                map.removeLayer(harvLayer);
            }
            map.removeLayer(harvStaticLayer);
            if (map.getZoom() > 9) {
                traffState = false;
            }
            harvDynamic.disabled = true;
            document.getElementById("dynamic").style.color = "rgb(190, 190, 190)";
            // playButton.disabled = true;

            if (!map.hasLayer(snowthicknessTimeLayer) &&
                !map.hasLayer(soilwetnessTimeLayer) && !map.hasLayer(temperatureTimeLayer) &&
                !map.hasLayer(forestfireTimeLayer)
                && !map.hasLayer(ndviTimeLayer)
            ) {
                playButton.disabled = true;
            }

            break;
        }
    }
});

map.on('overlayadd', function (e) {
    playButton.disabled = false;
    switch (e.name) {
        case "Snow Height": {
            forecast = 2;
            if (map.hasLayer(soilwetnessTimeLayer)) { 
                map.removeLayer(soilwetnessTimeLayer);
                map.removeLayer(soilwetnessTimeLayer2);
                map.removeLayer(soilwetnessTimeLayer3);
                lcontrol._update();
            }
            else if (map.hasLayer(temperatureTimeLayer)) { 
                map.removeLayer(temperatureTimeLayer);
                map.removeLayer(temperatureTimeLayer2);
                lcontrol._update();
            }
            else if (map.hasLayer(forestfireTimeLayer)) { 
                map.removeLayer(forestfireTimeLayer);
                map.removeLayer(forestfire1kmTimeLayer);
                lcontrol._update();
            }
            else if (map.hasLayer(treecoverLayer)) { 
                map.removeLayer(treecoverLayer);
                lcontrol._update();
            }
            else if (map.hasLayer(ndviTimeLayer)) { 
                map.removeLayer(ndviTimeLayer);
                lcontrol._update();
            }
            else if (map.hasLayer(frostTimeLayer)) { 
                map.removeLayer(frostTimeLayer);
                lcontrol._update();
            }

            plotsnowthickness();

            if (!snowthicknessTimeLayer._currentLayer._map) {
                snowthicknessTimeLayer.setParams({});
                snowthicknessTimeLayer2.setParams({});
            }
            snowLegend.addTo(this);
            lcontrol._overlaysList.children[5].control.disabled = true;
            lcontrol._overlaysList.children[5].style.color = "rgb(190, 190, 190)";

            // Real Estate Borders
            if (map.getZoom() < 13) {
                lcontrol._overlaysList.children[8].style.color = "rgb(190, 190, 190)";
            } else {
                lcontrol._overlaysList.children[8].style.color = "initial";
            }
            break;
        }
        case "Soil Water Index": {
            // playButton.disabled = true;
            harvDynamic.disabled = true;
            document.getElementById("dynamic").style.color = "rgb(190, 190, 190)";

            if (map.getZoom() > 9) {
                traffState = false;
            }
            
            forecast = 0;
            if (map.hasLayer(snowthicknessTimeLayer)) { 
                map.removeLayer(snowthicknessTimeLayer);
                map.removeLayer(snowthicknessTimeLayer2);                
                lcontrol._update();
            }
            else if (map.hasLayer(temperatureTimeLayer)) { 
                map.removeLayer(temperatureTimeLayer);
                map.removeLayer(temperatureTimeLayer2);
                lcontrol._update();
            }
            else if (map.hasLayer(forestfireTimeLayer)) { 
                map.removeLayer(forestfireTimeLayer);
                map.removeLayer(forestfire1kmTimeLayer);
                lcontrol._update();
            }
            else if (map.hasLayer(treecoverLayer)) { 
                map.removeLayer(treecoverLayer);
                lcontrol._update();
            }
            else if (map.hasLayer(harvLayer)) { 
                map.removeLayer(harvLayer); 
                idx = -1;
            }
            else if (map.hasLayer(ndviTimeLayer)) { 
                map.removeLayer(ndviTimeLayer);
                lcontrol._update();
            }
            else if (map.hasLayer(frostTimeLayer)) { 
                map.removeLayer(frostTimeLayer);
                lcontrol._update();
            }

            if (map.hasLayer(traffLayer)) { 
                map.removeLayer(traffLayer); 
                lcontrol._update(); 
            }

            map.removeLayer(harvStaticLayer);

            if (map.getZoom() > 9) {
                // lcontrol._overlaysList.children[0].control.disabled = true;
                lcontrol._overlaysList.children[1].control.disabled = true;
                lcontrol._overlaysList.children[2].control.disabled = true;
                lcontrol._overlaysList.children[3].control.disabled = true;
                lcontrol._overlaysList.children[7].control.disabled = true;
                        
                // lcontrol._overlaysList.children[0].style.color = "rgb(190, 190, 190)";
                lcontrol._overlaysList.children[1].style.color = "rgb(190, 190, 190)";
                lcontrol._overlaysList.children[2].style.color = "rgb(190, 190, 190)";
                lcontrol._overlaysList.children[3].style.color = "rgb(190, 190, 190)";
                lcontrol._overlaysList.children[7].style.color = "rgb(190, 190, 190)";
            } else {
                lcontrol._overlaysList.children[5].control.disabled = true;        
                lcontrol._overlaysList.children[5].style.color = "rgb(190, 190, 190)";
            }

            // soilwetnessTimeLayer2.addTo(map);

            plotsoilwetness();

            if (!soilwetnessTimeLayer._currentLayer._map) {
                soilwetnessTimeLayer.setParams({});
                soilwetnessTimeLayer2.setParams({});
                soilwetnessTimeLayer3.setParams({});
            }
            soilwetLegend.addTo(this);
            // lcontrol._overlaysList.children[5].control.disabled = true;
            // lcontrol._overlaysList.children[5].style.color = "rgb(190, 190, 190)";

            // Real Estate Borders
            if (map.getZoom() < 13) {
                lcontrol._overlaysList.children[8].style.color = "rgb(190, 190, 190)";
            } else {
                lcontrol._overlaysList.children[8].style.color = "initial";
            }
            break;
        }
        case "Soil Temperature": {
            forecast = 1;
            if (map.hasLayer(snowthicknessTimeLayer)) { 
                map.removeLayer(snowthicknessTimeLayer);
                lcontrol._update();
            }
            else if (map.hasLayer(soilwetnessTimeLayer)) { 
                map.removeLayer(soilwetnessTimeLayer);
                map.removeLayer(soilwetnessTimeLayer2);
                map.removeLayer(soilwetnessTimeLayer3);
                lcontrol._update();
            }
            else if (map.hasLayer(forestfireTimeLayer)) { 
                map.removeLayer(forestfireTimeLayer);
                map.removeLayer(forestfire1kmTimeLayer);
                lcontrol._update();
            }
            else if (map.hasLayer(treecoverLayer)) { 
                map.removeLayer(treecoverLayer);
                lcontrol._update();
            }
            else if (map.hasLayer(ndviTimeLayer)) { 
                map.removeLayer(ndviTimeLayer);
                lcontrol._update();
            }
            else if (map.hasLayer(frostTimeLayer)) { 
                map.removeLayer(frostTimeLayer);
                lcontrol._update();
            }
            
            plotsoiltemperature();

            if (!temperatureTimeLayer._currentLayer._map) {
                temperatureTimeLayer.setParams({});
                temperatureTimeLayer2.setParams({});
            }
            tempLegend.addTo(this);
            lcontrol._overlaysList.children[5].control.disabled = true;
            lcontrol._overlaysList.children[5].style.color = "rgb(190, 190, 190)";

            // Real Estate Borders
            if (map.getZoom() < 13) {
                lcontrol._overlaysList.children[8].style.color = "rgb(190, 190, 190)";
            } else {
                lcontrol._overlaysList.children[8].style.color = "initial";
            }
            break;
        }
        case "Forest Fire Index": {
            forecast = 3;
            if (map.hasLayer(soilwetnessTimeLayer)) { 
                map.removeLayer(soilwetnessTimeLayer);
                map.removeLayer(soilwetnessTimeLayer2);
                map.removeLayer(soilwetnessTimeLayer3);
                lcontrol._update();
            }
            else if (map.hasLayer(temperatureTimeLayer)) { 
                map.removeLayer(temperatureTimeLayer);
                map.removeLayer(temperatureTimeLayer2);
                lcontrol._update();
            }
            else if (map.hasLayer(snowthicknessTimeLayer)) { 
                map.removeLayer(snowthicknessTimeLayer);
                map.removeLayer(snowthicknessTimeLayer2);
                lcontrol._update();
            }
            else if (map.hasLayer(treecoverLayer)) { 
                map.removeLayer(treecoverLayer);
                lcontrol._update();
            }
            else if (map.hasLayer(ndviTimeLayer)) { 
                map.removeLayer(ndviTimeLayer);
                lcontrol._update();
            }
            else if (map.hasLayer(frostTimeLayer)) { 
                map.removeLayer(frostTimeLayer);
                lcontrol._update();
            }

            forestfire1kmTimeLayer.addTo(map);
            if (!forestfireTimeLayer._currentLayer._map) {
                forestfireTimeLayer.setParams({});
                forestfire1kmTimeLayer.setParams({});
            }
            // // When only one forest fire layer:
            // forestfireTimeLayer.setParams({});
            fireLegend.addTo(this);
            lcontrol._overlaysList.children[5].control.disabled = true;
            lcontrol._overlaysList.children[5].style.color = "rgb(190, 190, 190)";

            // Real Estate Borders
            if (map.getZoom() < 13) {
                lcontrol._overlaysList.children[8].style.color = "rgb(190, 190, 190)";
            } else {
                lcontrol._overlaysList.children[8].style.color = "initial";
            }
            break;
        }
        case "Tree Cover % 2018": {
            playButton.disabled = true;
            harvDynamic.disabled = true;
            document.getElementById("dynamic").style.color = "rgb(190, 190, 190)";

            if (map.getZoom() > 9) {
                traffState = false;
            }
            forecast = 4;
            if (map.hasLayer(soilwetnessTimeLayer)) { 
                map.removeLayer(soilwetnessTimeLayer);
                map.removeLayer(soilwetnessTimeLayer2);
                map.removeLayer(soilwetnessTimeLayer3);
                lcontrol._update();
            }
            else if (map.hasLayer(temperatureTimeLayer)) { 
                map.removeLayer(temperatureTimeLayer);
                map.removeLayer(temperatureTimeLayer2);
                lcontrol._update();
            }
            else if (map.hasLayer(snowthicknessTimeLayer)) { 
                map.removeLayer(snowthicknessTimeLayer);
                map.removeLayer(snowthicknessTimeLayer2);
                lcontrol._update();
            }
            else if (map.hasLayer(forestfireTimeLayer)) { 
                map.removeLayer(forestfireTimeLayer);
                map.removeLayer(forestfire1kmTimeLayer);
                lcontrol._update();
            }
            else if (map.hasLayer(harvLayer)) { 
                map.removeLayer(harvLayer); 
                idx = -1;
            }
            else if (map.hasLayer(ndviTimeLayer)) { 
                map.removeLayer(ndviTimeLayer);
                lcontrol._update();
            }
            else if (map.hasLayer(frostTimeLayer)) { 
                map.removeLayer(frostTimeLayer);
                lcontrol._update();
            }

            if (map.hasLayer(traffLayer)) { 
                map.removeLayer(traffLayer); 
                lcontrol._update(); 
            }

            map.removeLayer(harvStaticLayer);

            if (map.getZoom() > 9) {
                // lcontrol._overlaysList.children[0].control.disabled = true;
                lcontrol._overlaysList.children[1].control.disabled = true;
                lcontrol._overlaysList.children[2].control.disabled = true;
                lcontrol._overlaysList.children[3].control.disabled = true;
                lcontrol._overlaysList.children[7].control.disabled = true;
                        
                // lcontrol._overlaysList.children[0].style.color = "rgb(190, 190, 190)";
                lcontrol._overlaysList.children[1].style.color = "rgb(190, 190, 190)";
                lcontrol._overlaysList.children[2].style.color = "rgb(190, 190, 190)";
                lcontrol._overlaysList.children[3].style.color = "rgb(190, 190, 190)";
                lcontrol._overlaysList.children[7].style.color = "rgb(190, 190, 190)";
            } else {
                lcontrol._overlaysList.children[5].control.disabled = true;        
                lcontrol._overlaysList.children[5].style.color = "rgb(190, 190, 190)";
            }

            treecoverLegend.addTo(this);

            // Real Estate Borders
            if (map.getZoom() < 13) {
                lcontrol._overlaysList.children[8].style.color = "rgb(190, 190, 190)";
            } else {
                lcontrol._overlaysList.children[8].style.color = "initial";
            }
            break;
        }
        case "Trafficability": {
            playButton.disabled = true;
            traffState = true;

            if (map.hasLayer(soilwetnessTimeLayer)) { 
                map.removeLayer(soilwetnessTimeLayer);
                map.removeLayer(soilwetnessTimeLayer2);
                map.removeLayer(soilwetnessTimeLayer3);
                lcontrol._update();
            }
            else if (map.hasLayer(temperatureTimeLayer)) { 
                map.removeLayer(temperatureTimeLayer);
                map.removeLayer(temperatureTimeLayer2);
                lcontrol._update();
            }
            else if (map.hasLayer(snowthicknessTimeLayer)) { 
                map.removeLayer(snowthicknessTimeLayer);
                map.removeLayer(snowthicknessTimeLayer2);
                lcontrol._update();
            }
            else if (map.hasLayer(forestfireTimeLayer)) { 
                map.removeLayer(forestfireTimeLayer);
                map.removeLayer(forestfire1kmTimeLayer);
                lcontrol._update();
            }
            else if (map.hasLayer(treecoverLayer)) { 
                map.removeLayer(treecoverLayer);
                lcontrol._update();
            }
            else if (map.hasLayer(ndviTimeLayer)) { 
                map.removeLayer(ndviTimeLayer);
                lcontrol._update();
            }
            else if (map.hasLayer(frostTimeLayer)) { 
                map.removeLayer(frostTimeLayer);
                lcontrol._update();
            }

            if (map.getZoom() >= 13) {
                if (harvDynamicState == true) {
                    harvDynamic.checked = true;
                    playButton.disabled = false;
                }
                harvDynamic.disabled = false;
                document.getElementById("dynamic").style.color = "initial";
            }
            if (georastercache) {
                idx = -10; // redraw trafficability
                plotgeotiff();
                plotgeotiffstatic();
            }

            if (map.getZoom() > 9) {
                // lcontrol._overlaysList.children[0].control.disabled = true;
                lcontrol._overlaysList.children[1].control.disabled = true;
                lcontrol._overlaysList.children[2].control.disabled = true;
                lcontrol._overlaysList.children[3].control.disabled = true;
                lcontrol._overlaysList.children[7].control.disabled = true;
        
                // lcontrol._overlaysList.children[0].style.color = "rgb(190, 190, 190)";
                lcontrol._overlaysList.children[1].style.color = "rgb(190, 190, 190)";
                lcontrol._overlaysList.children[2].style.color = "rgb(190, 190, 190)";
                lcontrol._overlaysList.children[3].style.color = "rgb(190, 190, 190)";
                lcontrol._overlaysList.children[7].style.color = "rgb(190, 190, 190)";
            }
            // Real Estate Borders
            if (map.getZoom() < 13) {
                lcontrol._overlaysList.children[8].style.color = "rgb(190, 190, 190)";
            } else {
                lcontrol._overlaysList.children[8].style.color = "initial";
            }
            break;
        }
        case "NDVI": {
            // playButton.disabled = true;
            harvDynamic.disabled = true;
            document.getElementById("dynamic").style.color = "rgb(190, 190, 190)";

            if (map.getZoom() > 9) {
                traffState = false;
            }
            forecast = 5;
            if (map.hasLayer(soilwetnessTimeLayer)) { 
                map.removeLayer(soilwetnessTimeLayer);
                map.removeLayer(soilwetnessTimeLayer2);
                map.removeLayer(soilwetnessTimeLayer3);
                lcontrol._update();
            }
            else if (map.hasLayer(temperatureTimeLayer)) { 
                map.removeLayer(temperatureTimeLayer);
                map.removeLayer(temperatureTimeLayer2);
                lcontrol._update();
            }
            else if (map.hasLayer(snowthicknessTimeLayer)) { 
                map.removeLayer(snowthicknessTimeLayer);
                map.removeLayer(snowthicknessTimeLayer2);
                lcontrol._update();
            }
            else if (map.hasLayer(forestfireTimeLayer)) { 
                map.removeLayer(forestfireTimeLayer);
                map.removeLayer(forestfire1kmTimeLayer);
                lcontrol._update();
            }
            else if (map.hasLayer(harvLayer)) { 
                map.removeLayer(harvLayer); 
                idx = -1;
            }
            else if (map.hasLayer(treecoverLayer)) { 
                map.removeLayer(treecoverLayer);
                lcontrol._update();
            }
            else if (map.hasLayer(frostTimeLayer)) {
                map.removeLayer(frostTimeLayer);
                lcontrol._update();
            }

            if (map.hasLayer(traffLayer)) { 
                map.removeLayer(traffLayer); 
                lcontrol._update(); 
            }

            map.removeLayer(harvStaticLayer);

            plotndvi();

            // ndviLayer.addTo(map);

            if (map.getZoom() > 9) {
                // lcontrol._overlaysList.children[0].control.disabled = true;
                lcontrol._overlaysList.children[1].control.disabled = true;
                lcontrol._overlaysList.children[2].control.disabled = true;
                lcontrol._overlaysList.children[3].control.disabled = true;
                lcontrol._overlaysList.children[7].control.disabled = true;
                        
                // lcontrol._overlaysList.children[0].style.color = "rgb(190, 190, 190)";
                lcontrol._overlaysList.children[1].style.color = "rgb(190, 190, 190)";
                lcontrol._overlaysList.children[2].style.color = "rgb(190, 190, 190)";
                lcontrol._overlaysList.children[3].style.color = "rgb(190, 190, 190)";
                lcontrol._overlaysList.children[7].style.color = "rgb(190, 190, 190)";
            } else {
                lcontrol._overlaysList.children[5].control.disabled = true;        
                lcontrol._overlaysList.children[5].style.color = "rgb(190, 190, 190)";
            }

            // Real Estate Borders
            if (map.getZoom() < 13) {
                lcontrol._overlaysList.children[8].style.color = "rgb(190, 190, 190)";
            } else {
                lcontrol._overlaysList.children[8].style.color = "initial";
            }

            ndviLegend.addTo(this);
            break;
        }
        case "Ground Frost": {
            forecast = 6;
            if (map.hasLayer(soilwetnessTimeLayer)) { 
                map.removeLayer(soilwetnessTimeLayer);
                map.removeLayer(soilwetnessTimeLayer2);
                map.removeLayer(soilwetnessTimeLayer3);
                lcontrol._update();
            }
            else if (map.hasLayer(temperatureTimeLayer)) { 
                map.removeLayer(temperatureTimeLayer);
                map.removeLayer(temperatureTimeLayer2);
                lcontrol._update();
            }
            else if (map.hasLayer(snowthicknessTimeLayer)) { 
                map.removeLayer(snowthicknessTimeLayer);
                map.removeLayer(snowthicknessTimeLayer2);
                lcontrol._update();
            }
            else if (map.hasLayer(forestfireTimeLayer)) { 
                map.removeLayer(forestfireTimeLayer);
                map.removeLayer(forestfire1kmTimeLayer);
                lcontrol._update();
            }
            else if (map.hasLayer(treecoverLayer)) { 
                map.removeLayer(treecoverLayer);
                lcontrol._update();
            }
            else if (map.hasLayer(ndviTimeLayer)) { 
                map.removeLayer(ndviTimeLayer);
                lcontrol._update();
            }

            if (!frostTimeLayer._currentLayer._map) {
                frostTimeLayer.setParams({});
            }
            frostLegend.addTo(this);
            lcontrol._overlaysList.children[5].control.disabled = true;
            lcontrol._overlaysList.children[5].style.color = "rgb(190, 190, 190)";

            // Real Estate Borders
            if (map.getZoom() < 13) {
                lcontrol._overlaysList.children[8].style.color = "rgb(190, 190, 190)";
            } else {
                lcontrol._overlaysList.children[8].style.color = "initial";
            }
            break;
        }
    }
});

//var forecast = 0; // soilwetness
var forecast = 1; // soil temperature

// var forecast;

//var forecast = 3; // forestfire

map.on('zoomend', function(e) {
    // console.debug(map.getZoom());

    // Thunderforest when zoomed out
    if (map.getZoom() < 5) {
        if (map.hasLayer(maastokartta)) {
            map.removeLayer(maastokartta);
        }
        else if (map.hasLayer(taustakartta)) {
            map.removeLayer(taustakartta);
        }
        if (!map.hasLayer(thunderforest)) {
            thunderforest.addTo(map);
        }
        lcontrol._baseLayersList.children[1].style.color = "rgb(190, 190, 190)";
        lcontrol._baseLayersList.children[2].style.color = "rgb(190, 190, 190)";
    } else {
        lcontrol._baseLayersList.children[1].style.color = "initial";
        lcontrol._baseLayersList.children[2].style.color = "initial";
    }

    if (map.getZoom() < 13) {
        harvDynamic.checked = false;
        harvDynamic.disabled = true;
        document.getElementById("dynamic").style.color = "rgb(190, 190, 190)";
        //if (!map.hasLayer(snowthicknessTimeLayer) &&
        //    !map.hasLayer(soilwetnessTimeLayer) && !map.hasLayer(temperatureTimeLayer)) {
        if (!map.hasLayer(snowthicknessTimeLayer) 
            && !map.hasLayer(soilwetnessTimeLayer) 
            && !map.hasLayer(temperatureTimeLayer) 
            && !map.hasLayer(forestfireTimeLayer) 
            && !map.hasLayer(ndviTimeLayer)
            && !map.hasLayer(frostTimeLayer)
            ) {
            playButton.disabled = true;
            if (playButton.value == "Stop") {
                clearInterval(playButtonRepeatId);
                playButton.value = "Play";
            }
        }       
    //} else if (harvDynamic.disabled == true) {
    // } else if (harvDynamic.disabled == true && !map.hasLayer(treecoverLayer)) {
    } else if (harvDynamic.disabled == true 
        && !map.hasLayer(treecoverLayer)
        && !map.hasLayer(ndviTimeLayer) 
        && !map.hasLayer(soilwetnessTimeLayer)
        ) {
        if (harvDynamicState == true) {
            harvDynamic.checked = true;
            playButton.disabled = false;
        }
        harvDynamic.disabled = false;
        document.getElementById("dynamic").style.color = "initial";
    }

    if (map.getZoom() > 9 && map.getZoom() < 13) {
        // playButton.disabled = true;
        if (!map.hasLayer(soilwetnessTimeLayer) && !map.hasLayer(ndviTimeLayer)
        ) {
            playButton.disabled = true;
        }
    }

    if (map.getZoom() > 9) {
        // if (traffState && !map.hasLayer(treecoverLayer)) {
        if (traffState && !map.hasLayer(treecoverLayer) 
            && !map.hasLayer(ndviTimeLayer)
            && !map.hasLayer(soilwetnessTimeLayer)) {
            traffLayer.addTo(map);
            lcontrol._overlaysList.children[5].control.checked = true;
        }

        // if (map.hasLayer(soilwetnessTimeLayer)) { 
        //     map.removeLayer(soilwetnessTimeLayer);
        //     forecast = 0; 
        // }
        // else 
        if (map.hasLayer(temperatureTimeLayer)) {
            map.removeLayer(temperatureTimeLayer);
            map.removeLayer(temperatureTimeLayer2); 
            forecast = 1; 
        }
        else if (map.hasLayer(snowthicknessTimeLayer)) {
            map.removeLayer(snowthicknessTimeLayer);
            map.removeLayer(snowthicknessTimeLayer2); 
            forecast = 2; 
        }
        else if (map.hasLayer(forestfireTimeLayer)) {
            map.removeLayer(forestfireTimeLayer); 
            map.removeLayer(forestfire1kmTimeLayer); 
            forecast = 3; 
        }
        else if (map.hasLayer(frostTimeLayer)) {
            map.removeLayer(frostTimeLayer); 
            forecast = 6; 
        }
        // else if (map.hasLayer(ndviTimeLayer)) {
        //     map.removeLayer(ndviLayer); 
        //     map.removeLayer(ndviTimeLayer); 
        //     forecast = 4; 
        // }

        // lcontrol._overlaysList.children[0].control.disabled = true;
        lcontrol._overlaysList.children[1].control.disabled = true;
        lcontrol._overlaysList.children[2].control.disabled = true;
        lcontrol._overlaysList.children[3].control.disabled = true;
        lcontrol._overlaysList.children[7].control.disabled = true;

        // lcontrol._overlaysList.children[0].style.color = "rgb(190, 190, 190)";
        lcontrol._overlaysList.children[1].style.color = "rgb(190, 190, 190)";
        lcontrol._overlaysList.children[2].style.color = "rgb(190, 190, 190)";
        lcontrol._overlaysList.children[3].style.color = "rgb(190, 190, 190)";
        lcontrol._overlaysList.children[7].style.color = "rgb(190, 190, 190)";

        // Trafficability layer control
        lcontrol._overlaysList.children[5].style.color = "initial";
        lcontrol._overlaysList.children[5].control.disabled = false;

        map.removeControl(snowLegend);
        // map.removeControl(soilwetLegend);
        map.removeControl(tempLegend);
        map.removeControl(fireLegend);
        map.removeControl(frostLegend);

        // if (ndviEndDate == undefined) {
        if (ndviLayerLoaded !== true) {
        // NDVI layer disabled until GetCapabalities have been loaded
            lcontrol._overlaysList.children[6].control.disabled = true;
            lcontrol._overlaysList.children[6].style.color = "rgb(190, 190, 190)";
        }   

    } else {
        if (!map.hasLayer(treecoverLayer)
            && !map.hasLayer(ndviTimeLayer)
            && !map.hasLayer(soilwetnessTimeLayer)) {
            if (!map.hasLayer(soilwetnessTimeLayer) && forecast == 0) {
            soilwetnessTimeLayer.addTo(map);
            } 
            else if (!map.hasLayer(temperatureTimeLayer) && forecast == 1) {
                temperatureTimeLayer.addTo(map);
                plotsoiltemperature();
            } 
            else if (!map.hasLayer(snowthicknessTimeLayer) && forecast == 2) {
                snowthicknessTimeLayer.addTo(map);
                plotsnowthickness();
            } 
            else if (!map.hasLayer(forestfireTimeLayer) && forecast == 3) {
                forestfireTimeLayer.addTo(map);
                forestfire1kmTimeLayer.addTo(map);
            } 
            else if (!map.hasLayer(treecoverLayer) && forecast == 4) {
                treecoverLayer.addTo(map);
            }
            else if (!map.hasLayer(ndviTimeLayer) && forecast == 5) {
            ndviTimeLayer.addTo(map);
            // ndviLayer.addTo(map);
            }
            else if (!map.hasLayer(frostTimeLayer) && forecast == 6) {
                frostTimeLayer.addTo(map);
            }
        }

        // lcontrol._overlaysList.children[0].style.color = "initial";
        lcontrol._overlaysList.children[1].style.color = "initial";
        lcontrol._overlaysList.children[2].style.color = "initial";
        lcontrol._overlaysList.children[3].style.color = "initial";
        lcontrol._overlaysList.children[7].style.color = "initial";

        // Trafficability layer control
        lcontrol._overlaysList.children[5].control.disabled = true;
        lcontrol._overlaysList.children[5].style.color = "rgb(190, 190, 190)";
        lcontrol._overlaysList.children[5].control.checked = false;

        // if (lcontrol._overlaysList.children[0].control.checked) { 
        //     soilwetLegend.addTo(this); 
        // }
        // else 
        if (lcontrol._overlaysList.children[1].control.checked) { 
            tempLegend.addTo(this); 
        }
        else if (lcontrol._overlaysList.children[2].control.checked) { 
            snowLegend.addTo(this); 
        }
        else if (lcontrol._overlaysList.children[3].control.checked) { 
            fireLegend.addTo(this); 
        }
        else if (lcontrol._overlaysList.children[4].control.checked) { 
            treecoverLegend.addTo(this); 
        }
        else if (lcontrol._overlaysList.children[7].control.checked) { 
            frostLegend.addTo(this); 
        }
    }

    // if (ndviEndDate == undefined) {
    if (ndviLayerLoaded !== true) {
        // NDVI layer disabled until GetCapabalities have been loaded
        lcontrol._overlaysList.children[6].control.disabled = true;
        lcontrol._overlaysList.children[6].style.color = "rgb(190, 190, 190)";
    }   

    // Real Estate Borders
    if (map.getZoom() < 13) {
        lcontrol._overlaysList.children[8].style.color = "rgb(190, 190, 190)";
    } else {
        lcontrol._overlaysList.children[8].style.color = "initial";
    }
});

map.on('moveend', function(e) {
    //if (harvDynamic.checked && georastercache) {
    if (harvDynamic.checked && georastercache && !map.hasLayer(treecoverLayer)
    && !map.hasLayer(ndviTimeLayer) && !map.hasLayer(soilwetnessTimeLayer)
    ) {
        plotgeotiff();
    }
});


slider.oninput = function () {
    if (soilwetnessTimeLayer) {
        opacity = this.value;
        soilwetnessTimeLayer.setOpacity(this.value / 100);
        soilwetnessTimeLayer2.setOpacity(this.value / 100);
        soilwetnessTimeLayer3.setOpacity(this.value / 100);
        output.innerHTML = this.value + " %";
    }
    if (temperatureTimeLayer) {
        opacity = this.value;
        temperatureTimeLayer.setOpacity(this.value / 100);
        temperatureTimeLayer2.setOpacity(this.value / 100);
        output.innerHTML = this.value + " %";
    }
    if (snowthicknessTimeLayer) {
        opacity = this.value;
        snowthicknessTimeLayer.setOpacity(this.value / 100);
        snowthicknessTimeLayer2.setOpacity(this.value / 100);
        output.innerHTML = this.value + " %";
    }
    if (forestfireTimeLayer) {
        opacity = this.value;
        forestfireTimeLayer.setOpacity(this.value / 100);
        forestfire1kmTimeLayer.setOpacity(this.value / 100);
        output.innerHTML = this.value + " %";
    }
    if (treecoverLayer) {
        opacity = this.value;
        treecoverLayer.setOpacity(this.value / 100);
        output.innerHTML = this.value + " %";
    }
    if (ndviTimeLayer) {
        opacity = this.value;
        ndviTimeLayer.setOpacity(this.value / 100);
        ndviLayer.setOpacity(this.value / 100);
        output.innerHTML = this.value + " %";
    }
    if (frostTimeLayer) {
        opacity = this.value;
        frostTimeLayer.setOpacity(this.value / 100);
        output.innerHTML = this.value + " %";
    }
}

slider.onchange = function () {
    if (georastercache && map.hasLayer(harvLayer)) {
        idx = -1;
        plotgeotiff();
    }
    if (georastercache && map.hasLayer(harvStaticLayer)) { 
        map.removeLayer(harvStaticLayer);
        plotgeotiffstatic();
    }

}

//var latlonPoint = 'Kajaani';
var latlonPoint;

/* Dygraph.prototype.doZoomX_ = function(lowX, highX) {
    return;
}; */

var dyGraphBOptions = {
    //title: latlonPoint,
    //titleHeight: 28,
    drawAxesAtZero: false,
    legend: 'always',
    ylabel: "Trafficability",
    // labels: ["date", "Summer Forecast", "Winter Forecast", "Summer Observation", "Winter Observation"],
    labels: ["date", "Summer Index", "Winter Index", "Summer 15 days", "Winter 15 days"],

    //labels: ["date", "Summer Index", "Winter Index"],

    //labels: ["date", "Harvestability Index"],
    //labels: ["date", "Harvestability Index SW", "Harvestability Index ST", "Harvestability Index HS"],
    labelsDiv: "labelsB",
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
        "Summer 15 days": { fillGraph: true, strokeWidth: 3, color: 'rgb(75,75,75)' },
        "Winter 15 days": { fillGraph: true, strokeWidth: 3, color: 'rgb(150,0,0)' },
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
    underlayCallback: timeseriedateline,
    clickCallback: timeserieclick,
    zoomCallback: function() {
        this.resetZoom();
      },
}

// var SWensemble = "";
// var label = ["date", "SWI-0"];
// var labelstxt = {'SWI-0': { fillGraph: false }};
// for (i = 0; i <= perturbations; i = i + 1) {
//     label[i+1] = 'SWI-' + i ;
//     labelstxt[label[i+1]]= { fillGraph: false };
//     SWensemble += ",SWI2-0TO1:ECXSF:5062:1:0:0:" + i;
// }
var SWensemble = "SWI2-0TO1:ECXSF:5062:1:0:1:0";
var SWensemble_ecxens = "SWI2-0TO1:ECXENS:5072:1:0:1:0";

var label = ["date", "SWI-0"];
var labelstxt = {'SWI-0': { fillGraph: false }};
for (i = 1; i <= perturbations; i = i + 1) {
    label[i+1] = 'SWI-' + i ;
    labelstxt[label[i+1]]= { fillGraph: false };
    SWensemble += ",SWI2-0TO1:ECXSF:5062:1:0:3:" + i;
    SWensemble_ecxens += ",SWI2-0TO1:ECXENS:5072:1:0:3:" + i;
}

label[perturbations+2] = 'SWI2';
labelstxt[label[perturbations+2]]= { fillGraph: false, strokeWidth: 3, color: 'blue' };

// label[perturbations+2] = 'SW-FMI';
// label[perturbations+3] = 'SWI-EDTE';
// label[perturbations+4] = 'SWI2';
// labelstxt[label[perturbations+2]]= { fillGraph: false, strokeWidth: 3, color: 'black' };
// labelstxt[label[perturbations+3]]= { fillGraph: false, strokeWidth: 3, color: 'red' };
// labelstxt[label[perturbations+4]]= { fillGraph: false, strokeWidth: 3, color: 'blue' };

var dyGraphSWOptions = {
    legend: "always",
    ylabel: "Soil Water Index",
    // ylabel: "Soil Wetness (m\u00B3/m\u00B3)",
    // ylabel: "Snow Density (kg/m\u00B3)",
    labels: label,
    series: labelstxt,
    labelsDiv: "labels",
    axes: {
        y: { valueRange: [-0.0, 1.01] },
    },
    underlayCallback: timeseriedateline,
    //clickCallback: timeserieclick,
    animatedZooms: true,
}

var label = ["date", "ST-0"];
var labelstxt = {'ST-0': { fillGraph: false }};
//var label = ["date", "ST-FMI", "ST-0"];
//var labelstxt = {'ST-FMI': { fillGraph: false, strokeWidth: 3, color: 'rgb(75,75,75)' },
//                'ST-0': { fillGraph: false }};
var TGKensemble = "K2C{TSOIL-K:ECBSF:::7:1:0}";
var TGKensemble_ecens = "K2C{TSOIL-K:ECENS::::1:0}";

for (i = 1; i <= perturbations; i = i + 1) {
    label[i+1] = 'ST-' + i ;
    labelstxt[label[i+1]]= { fillGraph: false };
    //label[i+2] = 'ST-' + i ;
    //labelstxt[label[i+2]]= { fillGraph: false };
    TGKensemble += ",K2C{TSOIL-K:ECBSF:::7:3:" + i + "}";
    TGKensemble_ecens += ",K2C{TSOIL-K:ECENS::::3:" + i + "}";
}
// label[perturbations+2] = 'ST-FMI';
// labelstxt[label[perturbations+2]]= { fillGraph: false, strokeWidth: 3, color: 'red' };

var dyGraphSTOptions = {
    legend: 'always',
    ylabel: "Soil Temperature (°C)",
    labels: label,
    series: labelstxt,
    labelsDiv: "labels",
    axes: {
        y: { valueRange: [-30, 31] },
    },
    underlayCallback: timeseriedateline,
    //clickCallback: timeserieclick,
    animatedZooms: true,
}

// var SHensemble = "";
var SHensemble = "HSNOW-M:ECBSF::1:0:1:0";
var SHensemble_ecens = "HSNOW-M:ECENS::1:0:1:0";
var label = ["date", "SH-0"];
var labelstxt = {'SH-0': { fillGraph: false }};
for (i = 1; i <= perturbations; i = i + 1) {
    label[i+1] = 'SH-' + i ;
    labelstxt[label[i+1]]= { fillGraph: false };
    SHensemble += ",HSNOW-M:ECBSF::1:0:3:" + i ;
    SHensemble_ecens += ",HSNOW-M:ECENS::1:0:3:" + i;
}
label[perturbations+2] = 'SH-FMI';
labelstxt[label[perturbations+2]]= { fillGraph: false, strokeWidth: 3, color: 'red' };

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
        y: { valueRange: [-0.0, 1.51] },
    },
    underlayCallback: timeseriedateline,
    //clickCallback: timeserieclick,
    animatedZooms: true,
}

//var popup = L.popup();
var marker = L.marker(null, {
    interactive: false,
    zIndexOffset: 30,
});

var circle = L.circle(null, {
    color: 'blue',
    fillColor: '#fff',
    fillOpacity: 0,
    radius: 2500,
    interactive: false,
    zIndexOffset: 30,
});

var endDate = new Date();

if (endDate.getUTCDate() < 9) {
    endDate.setMonth(endDate.getUTCMonth() + 6);
} else {
    endDate.setMonth(endDate.getUTCMonth() + 7);
}

var endMonth = endDate.getUTCMonth() + 1;
if (endMonth < 10) {
    endMonth = '0' + endMonth;
}
var dateString_ecbsf = endDate.getUTCFullYear().toString() + endMonth + '040000';
// console.debug(dateString_ecbsf)

var startDate_timeseries = new Date();

if (startDate_timeseries.getUTCDate() < 9) {
    startDate_timeseries.setMonth(startDate_timeseries.getUTCMonth() - 1);
} 

var startMonth_timeseries = startDate_timeseries.getUTCMonth() + 1;
if (startMonth_timeseries < 10) {
    startMonth_timeseries = '0' + startMonth_timeseries;
}
// var dateString_timeseries = startDate_timeseries.getUTCFullYear().toString() + startMonth_timeseries + '020000';
var dateString_timeseries = startDate_timeseries.getUTCFullYear().toString() + startMonth_timeseries + '010000';



var dateFixed = false;

var graphLoad, graphTimer;
var graphLoad2, graphLoad3, graphLoad4;


function onMapClick(e) {

    //console.debug('click')

    if (graphLoad) { graphLoad.abort(); }
    if (graphLoad2) { graphLoad2.abort(); }
    if (graphLoad3) { graphLoad3.abort(); }
    if (graphLoad4) { graphLoad4.abort(); }
    if (graphTimer) { clearTimeout(graphTimer); }

    lat = e.latlng.lat.toFixed(2);
    lon = e.latlng.lng.toFixed(2);

    latlonTitle = lat + ", " + lon;

    latlon = e.latlng.toString();
    latlonPoint = latlon.replace(" ", "").substring(7, latlon.length - 2);
    titleB.innerHTML = latlonTitle;

    document.getElementById("graphB").innerHTML = "Loading...";
    document.getElementById("graphB").style = "line-height: 120px;";
    document.getElementById("graphsw").innerHTML = "Loading...";
    document.getElementById("graphsw").style = "line-height: 240px;";
    document.getElementById("graphsh").innerHTML = "";
    document.getElementById("graphsh").style = "line-height: 1;";
    document.getElementById("graphst").innerHTML = "";
    document.getElementById("graphst").style = "line-height: 1;";


    graphTimer = setTimeout(function () {
        drawtimeseries();
    }, 2000);


    marker.setLatLng(e.latlng).addTo(map);
    circle.setLatLng(e.latlng).addTo(map);

    //    if (map.getZoom() < 13) { map.zoomIn(2) }
    //    else if (map.getZoom() == 13) { map.zoomIn(1) }

    //if (map.getZoom() < 12) { map.setView(e.latlng, map.getZoom() + 2) }
    //else if (map.getZoom() == 12) { map.setView(e.latlng, map.getZoom() + 1) }

    if (map.getZoom() < 11) { map.setView(e.latlng, map.getZoom() + 3) }
    else if (map.getZoom() == 11) { map.setView(e.latlng, map.getZoom() + 2) }
    else if (map.getZoom() == 12) { map.setView(e.latlng, map.getZoom() + 1) }
    else { map.setView(e.latlng) }

    var geotiffArea = false;

/*     if (lat >= 59.7 && lat <= 69.3 && lon >= 21 && lon <= 31.6) {
        geotiffArea = true;
    } */

    //The Northest Finland
    if (lat >= 68.7 && lat <= 69.3 && lon >= 26 && lon <= 29) {
        geotiffArea = true;
    }
    //North Finland
    else if (lat >= 68 && lat < 68.7 && lon >= 22 && lon <= 28.8) {
        geotiffArea = true;
    }
    //North-Middle Finland
    else if (lat >= 64.4 && lat < 68 && lon >= 23.3 && lon <= 30.2) {
        geotiffArea = true;
    }
    //South-Middle Finland
    else if (lat >= 63.5 && lat < 64.4 && lon >= 22 && lon <= 30.6) {
        geotiffArea = true;
    }
    //South Finland
    else if (lat >= 60.3 && lat < 63.5 && lon >= 21 && lon <= 31.6) {
        geotiffArea = true;
    }
    //The Southest Finland
    else if (lat >= 59.7 && lat < 60.3 && lon >= 21 && lon <= 26.9) {
        geotiffArea = true;
    }

    if (map.getZoom() > 6 && geotiffArea) {
        if (map.hasLayer(treecoverLayer)) {
            map.removeLayer(treecoverLayer);
            map.removeControl(treecoverLegend);
            lcontrol._update();
            forecast = 4;
        }
        traffState = true;
        traffLayer.addTo(map);
        lcontrol._overlaysList.children[5].control.checked = true;
        if (georastercache) {
            // idx = -100; // redraw dynamic trafficability
            plotgeotiff();
            plotgeotiffstatic();
        }
    }

    if (map.getZoom() > 6 && geotiffArea) {
        if (map.hasLayer(soilwetnessTimeLayer)) {
            map.removeLayer(soilwetnessTimeLayer);
            map.removeLayer(soilwetnessTimeLayer2);
            map.removeLayer(soilwetnessTimeLayer3);
            map.removeControl(soilwetnessLegend);
            lcontrol._update();
            forecast = 0;
        }
        traffState = true;
        traffLayer.addTo(map);
        lcontrol._overlaysList.children[5].control.checked = true;
        if (georastercache) {
            // idx = -100; // redraw dynamic trafficability
            plotgeotiff();
            plotgeotiffstatic();
        }
    }

    maastokarttaAreaFunction(lat,lon);

}

function maastokarttaAreaFunction(lat,lon) {
    if (!inFinland(lat,lon)) { 
        thunderforest.addTo(map); 
        maastokartta.remove(); 
        taustakartta.remove(); 
        //console.debug(lat,lon, maastokarttaArea)
    }
}

function onLocationFound(e) {

    map.setView(e.latlng,14);

    if (graphLoad) { graphLoad.abort(); }
    if (graphLoad2) { graphLoad2.abort(); }
    if (graphLoad3) { graphLoad3.abort(); }
    if (graphLoad4) { graphLoad4.abort(); }
    if (graphTimer) { clearTimeout(graphTimer); }

    harvDynamic.checked = true;
    harvDynamic.disabled = false;
    document.getElementById("dynamic").style.color = "initial";
    playButton.disabled = false;

    lc.stop();

    lat = e.latlng.lat.toFixed(2);
    lon = e.latlng.lng.toFixed(2);
    latlonTitle = lat + ", " + lon;

    latlon = e.latlng.toString();
    latlonPoint = latlon.replace(" ", "").substring(7, latlon.length - 2);
    titleB.innerHTML = latlonTitle;

    perturbations = 50;
    //if (latlonPoint == "Kajaani") { latlonPoint = "64.22728,27.72846"; }

    document.getElementById("graphB").innerHTML = "Loading...";
    document.getElementById("graphB").style = "line-height: 120px;";
    document.getElementById("graphsw").innerHTML = "Loading...";
    document.getElementById("graphsw").style = "line-height: 240px;";
    document.getElementById("graphsh").innerHTML = "";
    document.getElementById("graphsh").style = "line-height: 1;";
    document.getElementById("graphst").innerHTML = "";
    document.getElementById("graphst").style = "line-height: 1;";

    drawtimeseries();

    marker.setLatLng(e.latlng).addTo(map);
    circle.setLatLng(e.latlng).addTo(map);

    maastokarttaAreaFunction(lat,lon);

}

function onLocationError(e) {
    //console.debug('Not found');

    lat = map.getCenter().lat.toFixed(2);
    lon = map.getCenter().lng.toFixed(2);
    latlonTitle = lat + ", " + lon;

    latlon = map.getCenter().toString();
    //latlonTitle = latlon.substring(7, latlon.length - 1);
    latlonPoint = latlon.replace(" ", "").substring(7, latlon.length - 2);

    //dyGraphBOptions.title = latlonTitle;
    titleB.innerHTML = latlonTitle;

    perturbations = 50;
    //if (latlonPoint == "Kajaani") { latlonPoint = "64.22728,27.72846"; }

    document.getElementById("graphB").innerHTML = "Loading...";
    document.getElementById("graphB").style = "line-height: 120px;";
    document.getElementById("graphsw").innerHTML = "Loading...";
    document.getElementById("graphsw").style = "line-height: 240px;";
    document.getElementById("graphsh").innerHTML = "";
    document.getElementById("graphsh").style = "line-height: 1;";
    document.getElementById("graphst").innerHTML = "";
    document.getElementById("graphst").style = "line-height: 1;";

    drawtimeseries();

    marker.setLatLng(map.getCenter()).addTo(map);
    circle.setLatLng(map.getCenter()).addTo(map);

    maastokarttaAreaFunction(lat,lon);

}

function onPermalink() {

    if (graphLoad) { graphLoad.abort(); }
    if (graphLoad2) { graphLoad2.abort(); }
    if (graphLoad3) { graphLoad3.abort(); }
    if (graphLoad4) { graphLoad4.abort(); }
    if (graphTimer) { clearTimeout(graphTimer); }

    lat = mappos.center.lat.toFixed(2);
    lon = mappos.center.lng.toFixed(2);

    latlonTitle = lat + ", " + lon;

    latlonPoint = mappos.center.lat + "," + mappos.center.lng;

    titleB.innerHTML = latlonTitle;

    document.getElementById("graphB").innerHTML = "Loading...";
    document.getElementById("graphB").style = "line-height: 120px;";
    document.getElementById("graphsw").innerHTML = "Loading...";
    document.getElementById("graphsw").style = "line-height: 240px;";
    document.getElementById("graphsh").innerHTML = "";
    document.getElementById("graphsh").style = "line-height: 1;";
    document.getElementById("graphst").innerHTML = "";
    document.getElementById("graphst").style = "line-height: 1;";

    drawtimeseries();

    marker.setLatLng(mappos.center).addTo(map);
    circle.setLatLng(mappos.center).addTo(map);

    maastokarttaAreaFunction(lat,lon);
}

map.on('click', onMapClick);

if (mappos.center[0] != 64 || mappos.center[1] != 27) {
    onPermalink();
    map.fire('zoomend');
}

function timeseriedateline(canvas, area, g) {
    var userTimezoneOffset = sliderDate.getTimezoneOffset() * 60000;
    var line = sliderDate.getTime() + userTimezoneOffset;
    var canvasx = g.toDomXCoord(line);
    //var range = g.yAxisRange();

    canvas.fillStyle = 'black';
    canvas.fillRect(canvasx, area.y, 2, area.h);
    //(left, area.y, right - left, area.h);
}

function timeserieclick(e, x, points) {
    xDays = Math.round(x/(24*60*60*1000));
    sliderDate = new Date(xDays*24*60*60*1000);
    if (sliderDate < startDate) { sliderDate = startDate; }

    dateoutput.innerHTML = sliderDate.toLocaleDateString();
    if (harvDynamic.checked && georastercache) {
        plotgeotiff();
    }
    map.timeDimension.setCurrentTime(sliderDate.getTime());

    dateslider.value = (sliderDate-startDate)/(24*60*60*1000);

    if (typeof gB !== 'undefined') { gB.updateOptions({ underlayCallback: timeseriedateline }) };
    if (typeof gsh !== 'undefined') { gsh.updateOptions({ underlayCallback: timeseriedateline }) };
    if (typeof gsw !== 'undefined') { gsw.updateOptions({ underlayCallback: timeseriedateline }) };
    if (typeof gst !== 'undefined') { gst.updateOptions({ underlayCallback: timeseriedateline }) };
    plotndvi();
    plotsoilwetness();
    plotsoiltemperature();
    plotsnowthickness();
}

function altcolors() {
    urlpos=L.Permalink.getMapLocation();
    // location.href = "index_smartmet_era5l_altcolors.html";
    if (isNaN(urlpos.center.lat)) {urlpos.center.lat = 64}
    if (isNaN(urlpos.center.lng)) {urlpos.center.lng = 27}
    // location.href = "https://harvesterseasons.com/altcolors/#" + urlpos.center.lat + "," + urlpos.center.lng + "," + urlpos.zoom + "z";
    location.href = "../altcolors/#" + urlpos.center.lat + "," + urlpos.center.lng + "," + urlpos.zoom + "z";
}

function showtext1()
{
    if (document.getElementById('carbontext1').style.display == "none") {
       $("#carbontext1").show();
    } else {
        $("#carbontext1").hide();
    }
}

function showtext2()
{
    if (document.getElementById('carbontext2').style.display == "none") {
       $("#carbontext2").show();
    } else {
        $("#carbontext2").hide();
    }
}

function showtext3()
{
    if (document.getElementById('carbontext3').style.display == "none") {
       $("#carbontext3").show();
    } else {
        $("#carbontext3").hide();
    }
}

function showtext4()
{
    if (document.getElementById('carbontext4').style.display == "none") {
       $("#carbontext4").show();
    } else {
        $("#carbontext4").hide();
    }
}


function plotndvi()
{

    if (sliderDate > ndviDate && sliderDate <= ndviEndDate &&
        map.hasLayer(ndviTimeLayer) && !map.hasLayer(ndviLayer)) {
        ndviLayer.addTo(map);
    }
    else if (sliderDate > ndviEndDate && map.hasLayer(ndviLayer)) {
        map.removeLayer(ndviLayer);
    }
    else if (sliderDate <= ndviDate && map.hasLayer(ndviLayer)) {
        map.removeLayer(ndviLayer);
    }

}


function plotsoilwetness() {
    if (map.hasLayer(soilwetnessTimeLayer)) {
        if (sliderDate > swiEndDate) {
            // if (sliderDate >= edteStartDate && sliderDate <= edteEndDate) {
            if (sliderDate >= ecxensStartDate && sliderDate <= ecxensEndDate) {
                if (map.hasLayer(soilwetnessTimeLayer2)) {
                    map.removeLayer(soilwetnessTimeLayer2);
                }
                if (!map.hasLayer(soilwetnessTimeLayer3)) {
                    soilwetnessTimeLayer3.addTo(map);
                    soilwetnessTimeLayer3.setParams({});
                }
            } else {
                if (map.hasLayer(soilwetnessTimeLayer3)) {
                    map.removeLayer(soilwetnessTimeLayer3);
                }
                if (!map.hasLayer(soilwetnessTimeLayer2)) {
                    soilwetnessTimeLayer2.addTo(map);
                    soilwetnessTimeLayer2.setParams({});
                }
            }
        } else {
            if (map.hasLayer(soilwetnessTimeLayer2)) {
                map.removeLayer(soilwetnessTimeLayer2);
            }
            if (map.hasLayer(soilwetnessTimeLayer3)) {
                map.removeLayer(soilwetnessTimeLayer3);
            }
        }
    }
}

function plotsoiltemperature() {
    if (map.hasLayer(temperatureTimeLayer)) {
        if (sliderDate > ecensEndDate) {
            if (!map.hasLayer(temperatureTimeLayer2)) {
                temperatureTimeLayer2.addTo(map);
                temperatureTimeLayer2.setParams({});
            }
        } else {
            if (map.hasLayer(temperatureTimeLayer2)) {
                map.removeLayer(temperatureTimeLayer2);
            }
        }
    }
}

function plotsnowthickness() {
    if (map.hasLayer(snowthicknessTimeLayer)) {
        if (sliderDate > ecensEndDate) {
            if (!map.hasLayer(snowthicknessTimeLayer2)) {
                snowthicknessTimeLayer2.addTo(map);
                snowthicknessTimeLayer2.setParams({});
            }
        } else {
            if (map.hasLayer(snowthicknessTimeLayer2)) {
                map.removeLayer(snowthicknessTimeLayer2);
            }
        }
    }
}


// function plotsoiltemperature()
// {
//     // let soilwetnessDate = new Date('2022-09-15');

//     // console.debug(soilwetnessDate)

//     if (map.hasLayer(temperatureTimeLayer)) {
//         if (sliderDate > soilwetnessDate && !map.hasLayer(temperatureTimeLayer2)) {
//             temperatureTimeLayer2.addTo(map);
//             temperatureTimeLayer2.setParams({});
//         }
//         else if (sliderDate <= soilwetnessDate && map.hasLayer(temperatureTimeLayer2)) {
//             map.removeLayer(temperatureTimeLayer2);
//         }
//     }

// }