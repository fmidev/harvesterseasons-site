//var startDate = new Date();
//startDate.setHours(startDate.getUTCDate() + Number(dateslider.value));

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

var startDate = new Date(Date.UTC(startYear, startMonth-1, startDay));

var dateString = startYear + '-' + startMonth + '-' + startDay + '/P7M';
//var dateString = startYear + '-' + startMonth + '-' + startDay + 'T00:00:00Z/P7M';

var dateString_origintime = startYear + startMonth + startDay + '0000';

//console.debug(startDate)
//console.debug(dateString)

$.get('https://api.ipify.org/', function (data) {
    document.getElementById('userIP_en').value = data;
    document.getElementById('userIP_fi').value = data;
})

var mappos = L.Permalink.getMapLocation();

var map = L.map('map', {
    //zoom: 6,
    minZoom: 6,
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
    zoom: mappos.zoom
/*    timeDimensionControlOptions: {
        //timeZones: ["Local"],
        playerOptions: {
            transitionTime: 250,
        }
    }*/
});

L.Permalink.setup(map);

// load a tile layer
var thunderforest = L.tileLayer('https://{s}.tile.thunderforest.com/landscape/{z}/{x}/{y}.png?apikey=e60422e636f34988a79015402724757b',
    {
        attribution: 'Tiles by <a href="https://www.thunderforest.com/">Thunderforest</a> Data by <a href="https://www.fmi.fi/">Finnish Meteorological Institute</a>',
        maxZoom: 22,
        minZoom: 0,
    }).addTo(map);

// load a tile layer
var maastokartta = L.tileLayer('https://avoin-karttakuva.maanmittauslaitos.fi/avoin/wmts/1.0.0/maastokartta/default/WGS84_Pseudo-Mercator/{z}/{y}/{x}.png',
{
    attribution: 'Tiles by <a href="https://www.maanmittauslaitos.fi/">Maanmittauslaitos</a> Data by <a href="https://www.fmi.fi/">Finnish Meteorological Institute</a>',
    maxZoom: 16,
    minZoom: 0,
})//.addTo(map);


// load a tile layer
var taustakartta = L.tileLayer('https://avoin-karttakuva.maanmittauslaitos.fi/avoin/wmts/1.0.0/taustakartta/default/WGS84_Pseudo-Mercator/{z}/{y}/{x}.png',
{
    attribution: 'Tiles by <a href="https://www.maanmittauslaitos.fi/">Maanmittauslaitos</a> Data by <a href="https://www.fmi.fi/">Finnish Meteorological Institute</a>',
    maxZoom: 16,
    minZoom: 0,
})//.addTo(map);

// load a tile layer
L.tileLayer('https://avoin-karttakuva.maanmittauslaitos.fi/avoin/wmts/1.0.0/kiinteistojaotus/default/WGS84_Pseudo-Mercator/{z}/{y}/{x}.png',
    {
        maxZoom: 16,
        minZoom: 13,
        zIndex:20,
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

//console.debug(L.timeDimension().getCurrentTime())
//map.on('timeloading',console.debug(L.timeDimension().getCurrentTime()));
//map.on('timeload',console.debug(L.timeDimension().getCurrentTime()));

const rasterUrl = "https://pta.data.lit.fmi.fi/geo/harvestability/KKL_SMK_Suomi_2020_09_02-UTM35.tif";

var georastercache;

parseGeoraster(rasterUrl).then(georaster => {
    georastercache = georaster;
    plotgeotiffstatic();
    plotgeotiff();
});

map.on('locationfound', onLocationFound);
map.on('locationerror', onLocationError);

// GeoTIFF-layer time management

var sliderDate = new Date(startDate);
//console.debug(sliderDate)

var titleB = document.getElementById("titleB");

var dateslider = document.getElementById("date-range");
var dateoutput = document.getElementById("date-value");
var harvDynamic = document.getElementById("dynamic-checkbox");
//var test = document.getElementById("test");
//console.debug(test.classList)


dateslider.value = 0;
sliderDate.setUTCDate(sliderDate.getUTCDate() + Number(dateslider.value));
dateoutput.innerHTML = sliderDate.toLocaleDateString(); // Display the default slider value
//dateoutput.innerHTML = sliderDate.toDateString().substring(4); 

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
    //dateoutput.innerHTML = sliderDate.toDateString().substring(4);
    //map.timeDimension.setCurrentTime(sliderDate.getTime());
    /*
    if (typeof gB !== 'undefined') { gB.updateOptions({underlayCallback: timeseriedateline}) };
    if (typeof gsh !== 'undefined') {gsh.updateOptions({underlayCallback: timeseriedateline}) };
    if (typeof gsw !== 'undefined') {gsw.updateOptions({underlayCallback: timeseriedateline}) };
    if (typeof gst !== 'undefined') {gst.updateOptions({underlayCallback: timeseriedateline}) };
    
    gB.updateOptions({underlayCallback: timeseriedateline})
    g.updateOptions({underlayCallback: timeseriedateline})
    gsw.updateOptions({underlayCallback: timeseriedateline})
    gst.updateOptions({underlayCallback: timeseriedateline})
    */
}

dateslider.onchange = function () {
    if (harvDynamic.checked && georastercache) {
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
}

function dateback() {
    clearInterval(playButtonRepeatId);
    playButton.value = "Play";
    if (Number(dateslider.value) > Number(dateslider.min)) {
        dateslider.value = Number(dateslider.value) - 1;
        sliderDate.setUTCDate(sliderDate.getUTCDate() - 1);
        dateoutput.innerHTML = sliderDate.toLocaleDateString();
        //dateoutput.innerHTML = sliderDate.toDateString().substring(4);
        if (harvDynamic.checked && georastercache) {
            plotgeotiff();
        }
        map.timeDimension.setCurrentTime(sliderDate.getTime());
        if (typeof gB !== 'undefined') { gB.updateOptions({underlayCallback: timeseriedateline}) };
        if (typeof gsh !== 'undefined') {gsh.updateOptions({underlayCallback: timeseriedateline}) };
        if (typeof gsw !== 'undefined') {gsw.updateOptions({underlayCallback: timeseriedateline}) };
        if (typeof gst !== 'undefined') {gst.updateOptions({underlayCallback: timeseriedateline}) };
    }
}

function datebackscrollIntervalFunc() {
    if (Number(dateslider.value) > Number(dateslider.min)) {
        dateslider.value = Number(dateslider.value) - 1;
        sliderDate.setUTCDate(sliderDate.getUTCDate() - 1);
        dateoutput.innerHTML = sliderDate.toLocaleDateString();
        //dateoutput.innerHTML = sliderDate.toDateString().substring(4);        
        if (harvDynamic.checked && georastercache) {
            plotgeotiff();
        }
        map.timeDimension.setCurrentTime(sliderDate.getTime());
        if (typeof gB !== 'undefined') { gB.updateOptions({underlayCallback: timeseriedateline}) };
        if (typeof gsh !== 'undefined') {gsh.updateOptions({underlayCallback: timeseriedateline}) };
        if (typeof gsw !== 'undefined') {gsw.updateOptions({underlayCallback: timeseriedateline}) };
        if (typeof gst !== 'undefined') {gst.updateOptions({underlayCallback: timeseriedateline}) };
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
            //dateoutput.innerHTML = sliderDate.toDateString().substring(4);
            /*
            if (harvDynamic.checked && georastercache) {
                plotgeotiff();
            }
            map.timeDimension.setCurrentTime(sliderDate.getTime());
            */
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
        //dateoutput.innerHTML = sliderDate.toDateString().substring(4);
        //console.debug(harvDynamic._map)
        if (harvDynamic.checked && georastercache) {
            plotgeotiff();
        }
        map.timeDimension.setCurrentTime(sliderDate.getTime());
        if (typeof gB !== 'undefined') { gB.updateOptions({underlayCallback: timeseriedateline}) };
        if (typeof gsh !== 'undefined') {gsh.updateOptions({underlayCallback: timeseriedateline}) };
        if (typeof gsw !== 'undefined') {gsw.updateOptions({underlayCallback: timeseriedateline}) };
        if (typeof gst !== 'undefined') {gst.updateOptions({underlayCallback: timeseriedateline}) };
    }
}

function dateforwardscrollIntervalFunc() {
    if (Number(dateslider.value) < Number(dateslider.max)) {
        dateslider.value = Number(dateslider.value) + 1;
        sliderDate.setUTCDate(sliderDate.getUTCDate() + 1);
        dateoutput.innerHTML = sliderDate.toLocaleDateString();
        //dateoutput.innerHTML = sliderDate.toDateString().substring(4);
        if (harvDynamic.checked && georastercache) {
            plotgeotiff();
        }
        map.timeDimension.setCurrentTime(sliderDate.getTime());
        if (typeof gB !== 'undefined') { gB.updateOptions({underlayCallback: timeseriedateline}) };
        if (typeof gsh !== 'undefined') {gsh.updateOptions({underlayCallback: timeseriedateline}) };
        if (typeof gsw !== 'undefined') {gsw.updateOptions({underlayCallback: timeseriedateline}) };
        if (typeof gst !== 'undefined') {gst.updateOptions({underlayCallback: timeseriedateline}) };
    }
}

function dateforwardscroll() {
    clearInterval(playButtonRepeatId);
    playButton.value = "Play";
    dateforwardRepeatId = setInterval(dateforwardscrollIntervalFunc, 500);
}

function dateforwardscrollfast() {
    clearInterval(playButtonRepeatId);
    //playButton.value = "Play";
    //console.debug(Number(dateslider.value))
    //console.debug(Number(dateslider.max))

    repeatId = setInterval(function () {
        if (Number(dateslider.value) < Number(dateslider.max)) {
            dateslider.value = Number(dateslider.value) + 1;
            sliderDate.setUTCDate(sliderDate.getUTCDate() + 1);
            dateoutput.innerHTML = sliderDate.toLocaleDateString();
            //dateoutput.innerHTML = sliderDate.toDateString().substring(4);
            /*
            if (harvDynamic.checked && georastercache) {
                plotgeotiff();
            }
            map.timeDimension.setCurrentTime(sliderDate.getTime());
            */
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
    if (repeatId > 0 && harvDynamic.checked && georastercache) {
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

    /*if (playButton.value == "Stop" ) {
        clearInterval(playButtonRepeatId);
        playButtonRepeatId = setInterval(playButtonIntervalFunc, 500);
        //console.debug('timeload')
    }*/
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
        if (harvDynamic.checked && georastercache) {
            plotgeotiff();
        }
        map.timeDimension.setCurrentTime(sliderDate.getTime());
        if (typeof gB !== 'undefined') { gB.updateOptions({underlayCallback: timeseriedateline}) };
        if (typeof gsh !== 'undefined') {gsh.updateOptions({underlayCallback: timeseriedateline}) };
        if (typeof gsw !== 'undefined') {gsw.updateOptions({underlayCallback: timeseriedateline}) };
        if (typeof gst !== 'undefined') {gst.updateOptions({underlayCallback: timeseriedateline}) };
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


//harvestability = L.layerGroup();

//harvDynamic = L.layerGroup().addTo(map);
//var harvDynamicState = 1;
//document.getElementById("dynamic-checkbox").checked = true;

harvDynamic.checked = false;
harvDynamic.disabled = true;
document.getElementById("dynamic").style.color = "rgb(190, 190, 190)";

playButton.disabled = false;

var harvDynamicState = true; // set by user

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
        idx = -10; 
        setTimeout( function () { plotgeotiff() }, 1000); 
    }; // always re-draw
}


param1="utctime";
param2="HARVIDX{20;ULSM-M3M3:HOPSSF:5026::0:3:1-50;ULSM-M3M3:HOPSSF:5026::0:1:0}";
param3="HARVIDX{0;TSOIL-K:HOPSSF:5026::3:1-50;TSOIL-K:HOPSSF:5026::1:0}";
param4="ensover{40;0.9;HSNOW-M:HOPSSF:5026::3:1-50;HSNOW-M:HOPSSF:5026::1:0}";

var harvLayer;

// idx = 1
var colorMap1 = [
    [0, 0, 0],
    [0, 97, 0], // Frost heave (kelirikko)
    [97, 153, 0], // Normal summer, mineral soil (normaali kesä, kivennäismaa)
    [160, 219, 0], // Dry summer, mineral soil (kuiva kesä, kivennäismaa)
    [255, 250, 0], // Normal summer, peat soil (normaali kesä, turvemaa)
    [255, 132, 0], // Dry summer, peat soil (kuiva kesä, turvemaa)
    [255, 38, 0], // Winter (talvi)
    [128, 255, 255], // Water
];

// idx = 0
var colorMapSummer0 = [
    [0, 0, 0],
    [0, 97, 0], // Frost heave (kelirikko)
    [97, 153, 0], // Normal summer, mineral soil (normaali kesä, kivennäismaa)
    [255, 38, 0], // Dry summer, mineral soil (kuiva kesä, kivennäismaa)
    [255, 250, 0], // Normal summer, peat soil (normaali kesä, turvemaa)
    [255, 38, 0], // Dry summer, peat soil (kuiva kesä, turvemaa)
    [255, 38, 0], // Winter (talvi)
    [128, 255, 255], // Water
];

// idx = 2
var colorMapSummer2 = [
    [0, 0, 0],
    [0, 97, 0], // Frost heave (kelirikko)
    [0, 97, 0], // Normal summer, mineral soil (normaali kesä, kivennäismaa)
    [0, 97, 0], // Dry summer, mineral soil (kuiva kesä, kivennäismaa)
    [0, 97, 0], // Normal summer, peat soil (normaali kesä, turvemaa)
    [255, 132, 0], // Dry summer, peat soil (kuiva kesä, turvemaa)
    [255, 38, 0], // Winter (talvi)
    [128, 255, 255], // Water
];

/*
var colorMapWinter0 = [
    [0, 0, 0],
    [0, 97, 0], // Frost heave (kelirikko)
    [255, 38, 0], // Normal summer, mineral soil (normaali kesä, kivennäismaa)
    [255, 38, 0], // Dry summer, mineral soil (kuiva kesä, kivennäismaa)
    [255, 38, 0], // Normal summer, peat soil (normaali kesä, turvemaa)
    [255, 38, 0], // Dry summer, peat soil (kuiva kesä, turvemaa)
    [255, 38, 0], // Winter (talvi)
    [128, 255, 255], // Water
];*/

// idx = 3
var colorMapWinter2 = [
    [0, 0, 0],
    [0, 97, 0], // Frost heave (kelirikko)
    [0, 97, 0], // Normal summer, mineral soil (normaali kesä, kivennäismaa)
    [0, 97, 0], // Dry summer, mineral soil (kuiva kesä, kivennäismaa)
    [0, 97, 0], // Normal summer, peat soil (normaali kesä, turvemaa)
    [0, 97, 0], // Dry summer, peat soil (kuiva kesä, turvemaa)
    [0, 97, 0], // Winter (talvi)
    [128, 255, 255], // Water
];

var idxSummer, idxWinter, idx2;

var idx = -100;

function plotgeotiff() {
    //console.debug(idx)
    //console.debug(harvDynamic.checked)

    if (harvDynamic.checked) {

        if (map.getBounds().contains(marker.getLatLng())) {
            latlon = marker.getLatLng().toString();
        }
        else {
            latlon = map.getCenter().toString();
        }
        latlonPoint = latlon.replace(" ", "").substring(7, latlon.length - 2);

        var dataYear = sliderDate.getUTCFullYear();
        var dataMonth = sliderDate.getUTCMonth() + 1;
        var dataDay = sliderDate.getUTCDate();
        if (dataMonth < 10) {
            dataMonth = '0' + dataMonth;
        }
        if (dataDay < 10) {
            dataDay = '0' + dataDay;
        }

        dataUrl2 = "https://sm.harvesterseasons.com/timeseries?latlon=" + latlonPoint + "&param=" + param2 + "," + param3 + "," + param4 + "&origintime=" + dataYear + dataMonth + dataDay + "T000000Z&starttime=" + dataYear + dataMonth + dataDay + "T000000Z&timesteps=1&format=json";

        $.getJSON(dataUrl2, function (data) {
            //console.debug(data[0][param2], data[0][param3], data[0][param4])
            //idx2 = Math.max(data[0][param2], data[0][param3], data[0][param4]);
            //console.debug(idx2)
            //console.debug(dataDay)

            idxSummer = data[0][param2];
            idxWinter = Math.max(data[0][param3], data[0][param4]);

            if (idxWinter == 2) { idx2 = 3 }
            else if (idxSummer == 2) { idx2 = 2 }
            else if (idxSummer == 0 && idxWinter == 0) { idx2 = 0 }
            else { idx2 = 1 }

            //console.debug(idx)
            //console.debug(idx2)
            //console.debug(harvDynamicState)

            //console.debug(latlon)
            //console.debug(idx2)

            /*
            Logic:
            talvi 2, kesä 2 -> talvi 2, idx = 3
            talvi 2, kesä 0 -> talvi 2, idx = 3
            talvi 2, kesä 1 -> talvi 2, idx = 3

            talvi 0, kesä 2 -> kesä 2, idx = 2
            talvi 1, kesä 2 -> kesä 2, idx = 2

            0, 0 -> kesä 0
            0, 1 -> 1
            */

            if (idx == -100 || idx2 !== idx) {
                idx = idx2;

                const georaster = georastercache;
                const { noDataValue } = georaster;

                if (idx == 0) { var colorMap = colorMapSummer0; } 
                else if (idx == 2) { var colorMap = colorMapSummer2; }
                else if (idx == 3) { var colorMap = colorMapWinter2; }
                else { var colorMap = colorMap1; };

                var pixelValuesToColorFn = values => {
                    if (values.some(value => value === noDataValue)) {
                        return 'rgba(0,0,0,0.0)';
                    } else {
                        const [r] = values;
                        if (r < 7) {
                            return `rgba(${colorMap[r][0]},${colorMap[r][1]},${colorMap[r][2]},.7)`;
                        } else {
                            return 'rgba(0,0,0,0.0)';
                        }
                    }
                };
                const resolution = 64;
                if (map.hasLayer(harvLayer)) { map.removeLayer(harvLayer); }
                harvLayer = new GeoRasterLayer({
                        minZoom: 13,
                    georaster, pixelValuesToColorFn, resolution,
                    zIndex:10,
                }).addTo(map);
            };
        });
    } else if (idx !== 1 && idx !== -100) {

    //console.debug(idx)

    idx = 1;
    var colorMap = colorMap1;

    const georaster = georastercache;
    const { noDataValue } = georaster;

    var pixelValuesToColorFn = values => {
        if (values.some(value => value === noDataValue)) {
            return 'rgba(0,0,0,0.0)';
        } else {
            const [r] = values;
            if (r < 7) {
                return `rgba(${colorMap[r][0]},${colorMap[r][1]},${colorMap[r][2]},.7)`;
            } else {
                return 'rgba(0,0,0,0.0)';
            }
        }
    };
    const resolution = 64;
    if (map.hasLayer(harvLayer)) { map.removeLayer(harvLayer); }
    harvLayer = new GeoRasterLayer({
            minZoom: 13,
        georaster, pixelValuesToColorFn, resolution,
        zIndex:10,
    }).addTo(map);

    }
}

function plotgeotiffstatic() {

    var colorMap = colorMap1;

    const georaster = georastercache;
    const { noDataValue } = georaster;

    var pixelValuesToColorFn = values => {
        if (values.some(value => value === noDataValue)) {
            return 'rgba(0,0,0,0.0)';
        } else {
            const [r] = values;
            if (r < 7) {
                return `rgba(${colorMap[r][0]},${colorMap[r][1]},${colorMap[r][2]},.7)`;
            } else {
                return 'rgba(0,0,0,0.0)';
            }
        }
    };
    const resolution = 64;
    new GeoRasterLayer({
        minZoom: 10,
        maxZoom: 12,
        georaster, pixelValuesToColorFn, resolution,
        zIndex: 10,
    }).addTo(map);
}


var smartWMS = 'https://sm.harvesterseasons.com/wms?';

var temperatureLayerOptions = {
    crs: L.CRS.EPSG4326,
    version: '1.3.0',
    layers: 'harvester:hopssf:TSOIL-K',
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

var soilwetnessLayerOptions = {
    crs: L.CRS.EPSG4326,
    version: '1.3.0',
    layers: 'harvester:hopssf:ULSM-M3M3',
    format: 'image/png',
    transparent: 'true',
    styles: 'default',
    //source: 'grid',
    opacity: 0.7,
    maxZoom: 9,
    zIndex: 20,
};
var soilwetnessLayer = L.tileLayer.wms(smartWMS, soilwetnessLayerOptions);
var soilwetnessTimeLayer = L.timeDimension.layer.wms(soilwetnessLayer, {cache: 100});

var snowthicknessLayerOptions = {
    crs: L.CRS.EPSG4326,
    version: '1.3.0',
    layers: 'harvester:hopssf:HSNOW-M',
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

fireWMS = "https://data.fmi.fi/fmi-apikey/edfa704e-69a2-45e2-89bf-d173d79b6b76/wms?";

var forestfireLayerOptions = {
    crs: L.CRS.EPSG4326,
    version: '1.3.0',
    //layers: 'fmi:kosteusmalli:1km:obs:forestfireindex',
    layers: 'fmi:kosteusmalli:10km:forestfireindex',
    format: 'image/png',
    transparent: 'true',
    styles: 'default',
    opacity: 0.7,
    maxZoom: 9,
    zIndex: 20,
};
var forestfireLayer = L.tileLayer.wms(fireWMS, forestfireLayerOptions);
//var firedateString = startYear + '-' + startMonth + '-' + startDay + 'T12:00:00Z/P7M';
//var forestfireTimeLayer = L.timeDimension.layer.wms(forestfireLayer, {cache: 10, timeInterval: firedateString});
var forestfireTimeLayer = L.timeDimension.layer.wms(forestfireLayer, {cache: 10});

var forestfire1kmLayerOptions = {
    crs: L.CRS.EPSG4326,
    version: '1.3.0',
    layers: 'fmi:kosteusmalli:1km:obs:forestfireindex',
    format: 'image/png',
    transparent: 'true',
    styles: 'default',
    opacity: 0.7,
    maxZoom: 9,
    zIndex: 20,
};
var forestfire1kmLayer = L.tileLayer.wms(fireWMS, forestfire1kmLayerOptions);
var forestfire1kmTimeLayer = L.timeDimension.layer.wms(forestfire1kmLayer, {cache: 1});
//forestfire1kmTimeLayer.addTo(map);

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

tempLegend.onAdd = function (map) {
    var src = 'https://sm.harvesterseasons.com/wms?REQUEST=GetLegendGraphic&VERSION=1.3.0&LAYER=harvester:ecbsf:TSOIL-C-short&sld_version=1.1.0&style=&format=image/png&WIDTH=60&HEIGHT=455';
    var div = L.DomUtil.create('div', 'info legend');
    if (screen.width < 425) {
        div.style.width = '48px';
        div.style.height = '345px';
    } else {
        div.style.width = '50px';
        div.style.height = '380px';
    }
    div.style['background-image'] = 'url(' + src + ')';
    div.style['background-size'] = 'contain';
    div.style['background-repeat'] = 'no-repeat';
    return div;
};

snowLegend.onAdd = function (map) {
    var src = 'https://sm.harvesterseasons.com/wms?REQUEST=GetLegendGraphic&VERSION=1.3.0&LAYER=harvester:hopssf:HSNOW-M&sld_version=1.1.0&style=&FORMAT=image/png&WIDTH=60&HEIGHT=345';
    var div = L.DomUtil.create('div', 'info legend');
    div.style.width = '65px';
    div.style.height = '345px';
    div.style['background-image'] = 'url(' + src + ')';
    div.style['background-size'] = 'contain';
    div.style['background-repeat'] = 'no-repeat';
    return div;
};

soilwetLegend.onAdd = function (map) {
    var src = 'https://sm.harvesterseasons.com/wms?REQUEST=GetLegendGraphic&VERSION=1.3.0&LAYER=harvester:hopssf:ULSM-M3M3&sld_version=1.1.0&style=&FORMAT=image/png&WIDTH=65&HEIGHT=345';
    var div = L.DomUtil.create('div', 'info legend');
    div.style.width = '65px';
    div.style.height = '345px';
    div.style['background-image'] = 'url(' + src + ')';
    div.style['background-size'] = 'contain';
    div.style['background-repeat'] = 'no-repeat';
    return div;
};

fireLegend.onAdd = function (map) {
    var src = 'https://sm.harvesterseasons.com/wms?service=WMS&request=GetLegendGraphic&version=1.3.0&sld_version=1.1.0&style=default&format=image%2Fpng&layer=fmi%3Akosteusmalli%3A10km%3Aforestfireindexlegend&WIDTH=65&HEIGHT=110';
    var div = L.DomUtil.create('div', 'info legend');
    div.style.width = '65px';
    div.style.height = '110px';
    //div.style.width = '75px';
    //div.style.height = '120px';
    div.style['background-image'] = 'url(' + src + ')';
    div.style['background-size'] = 'contain';
    div.style['background-repeat'] = 'no-repeat';
    return div;
};


var overlayMaps = {
    "Soil Wetness": soilwetnessTimeLayer,
    "Soil Temperature": temperatureTimeLayer.addTo(map),
    //"Snow Thickness": snowthicknessTimeLayer,
    "SWE": snowthicknessTimeLayer,
    "Forest Fire Index": forestfireTimeLayer,
};

var lcontrol = L.control.layers(baseMaps, overlayMaps, { collapsed: false }).addTo(map);
//var soilwetControl = lcontrol._overlaysList.children[0].control;
//var tempControl = lcontrol._overlaysList.children[1].control;
//var snowControl = lcontrol._overlaysList.children[2].control;

//console.debug(lcontrol._overlaysList.children[0])

//forestfire1kmTimeLayer.addTo(map);

//soilwetLegend.addTo(map); 
tempLegend.addTo(map); 

//fireLegend.addTo(map); 

map.on('overlayremove', function (e) {
    forecast = -1;
    //if (!harvDynamic.checked && !map.hasLayer(snowthicknessTimeLayer) &&
    //    !map.hasLayer(soilwetnessTimeLayer) && !map.hasLayer(temperatureTimeLayer)) {
        if (!harvDynamic.checked && !map.hasLayer(snowthicknessTimeLayer) &&
          !map.hasLayer(soilwetnessTimeLayer) && !map.hasLayer(temperatureTimeLayer) &&
          !map.hasLayer(forestfireTimeLayer)) {
            clearInterval(playButtonRepeatId);
            playButton.value = "Play";
            playButton.disabled = true;
    }
    switch (e.name) {
        //case "Snow Thickness": {
        case "SWE": {
                map.removeControl(snowLegend);
            break;
        }
        case "Soil Wetness": {
            map.removeControl(soilwetLegend);
            break;
        }
        case "Soil Temperature": {
            map.removeControl(tempLegend);
            break;
        }
        case "Forest Fire Index": {
            map.removeLayer(forestfire1kmTimeLayer);
            map.removeControl(fireLegend);
            break;
        }
    }
});

map.on('overlayadd', function (e) {
    playButton.disabled = false;
    switch (e.name) {
        //case "Snow Thickness": {
        case "SWE": {
            forecast = 2;
            if (map.hasLayer(soilwetnessTimeLayer)) { 
                map.removeLayer(soilwetnessTimeLayer);
                lcontrol._update();
            }
            else if (map.hasLayer(temperatureTimeLayer)) { 
                map.removeLayer(temperatureTimeLayer);
                lcontrol._update();
            }
            else if (map.hasLayer(forestfireTimeLayer)) { 
                map.removeLayer(forestfireTimeLayer);
                map.removeLayer(forestfire1kmTimeLayer);
                lcontrol._update();
            }
            if (!snowthicknessTimeLayer._currentLayer._map) {
                //console.debug(snowthicknessTimeLayer._currentLayer._map)
                snowthicknessTimeLayer.setParams({});
            }
            snowLegend.addTo(this);
            break;
        }
        case "Soil Wetness": {
            forecast = 0;
            if (map.hasLayer(snowthicknessTimeLayer)) { 
                map.removeLayer(snowthicknessTimeLayer);
                lcontrol._update();
            }
            else if (map.hasLayer(temperatureTimeLayer)) { 
                map.removeLayer(temperatureTimeLayer);
                lcontrol._update();
            }
            else if (map.hasLayer(forestfireTimeLayer)) { 
                map.removeLayer(forestfireTimeLayer);
                map.removeLayer(forestfire1kmTimeLayer);
                lcontrol._update();
            }
            if (!soilwetnessTimeLayer._currentLayer._map) {
                //console.debug(soilwetnessTimeLayer._currentLayer._map)
                soilwetnessTimeLayer.setParams({});
            }
            soilwetLegend.addTo(this);
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
                lcontrol._update();
            }
            else if (map.hasLayer(forestfireTimeLayer)) { 
                map.removeLayer(forestfireTimeLayer);
                map.removeLayer(forestfire1kmTimeLayer);
                lcontrol._update();
            }
            if (!temperatureTimeLayer._currentLayer._map) {
                //console.debug(temperatureTimeLayer._currentLayer._map)
                temperatureTimeLayer.setParams({});
            }
            tempLegend.addTo(this);
            break;
        }
        case "Forest Fire Index": {
            forecast = 3;
            if (map.hasLayer(soilwetnessTimeLayer)) { 
                map.removeLayer(soilwetnessTimeLayer);
                lcontrol._update();
            }
            else if (map.hasLayer(temperatureTimeLayer)) { 
                map.removeLayer(temperatureTimeLayer);
                lcontrol._update();
            }
            else if (map.hasLayer(snowthicknessTimeLayer)) { 
                map.removeLayer(snowthicknessTimeLayer);
                lcontrol._update();
            }
            forestfire1kmTimeLayer.addTo(map);
            //if (!forestfireTimeLayer._currentLayer._map) {
                forestfireTimeLayer.setParams({});
                forestfire1kmTimeLayer.setParams({});
            //}
            fireLegend.addTo(this);
            break;
        }
    }
});

//var forecast = 0; // soilwetness
var forecast = 1; // soil temperature

//var forecast = 3; // forestfire

map.on('zoomend', function(e) {
    if (map.getZoom() < 13) {
        harvDynamic.checked = false;
        harvDynamic.disabled = true;
        document.getElementById("dynamic").style.color = "rgb(190, 190, 190)";
        //if (!map.hasLayer(snowthicknessTimeLayer) &&
        //    !map.hasLayer(soilwetnessTimeLayer) && !map.hasLayer(temperatureTimeLayer)) {
            if (!map.hasLayer(snowthicknessTimeLayer) &&
              !map.hasLayer(soilwetnessTimeLayer) && !map.hasLayer(temperatureTimeLayer) &&
              !map.hasLayer(forestfireTimeLayer)) {
                playButton.disabled = true;
                if (playButton.value == "Stop") {
                    clearInterval(playButtonRepeatId);
                    playButton.value = "Play";
                }
        }       
    } else if (harvDynamic.disabled == true) {
        if (harvDynamicState == true) {
            harvDynamic.checked = true;
            playButton.disabled = false;
        }
        harvDynamic.disabled = false;
        document.getElementById("dynamic").style.color = "initial";
    }
    if (map.getZoom() > 9 && map.getZoom() < 13) {
        playButton.disabled = true;
    }
    if (map.getZoom() > 9) {
        if (map.hasLayer(soilwetnessTimeLayer)) { 
            map.removeLayer(soilwetnessTimeLayer);
            forecast = 0; 
        }
        else if (map.hasLayer(temperatureTimeLayer)) {
            map.removeLayer(temperatureTimeLayer); 
            forecast = 1; 
        }
        else if (map.hasLayer(snowthicknessTimeLayer)) {
            map.removeLayer(snowthicknessTimeLayer); 
            forecast = 2; 
        }
        else if (map.hasLayer(forestfireTimeLayer)) {
            map.removeLayer(forestfireTimeLayer); 
            map.removeLayer(forestfire1kmTimeLayer); 
            forecast = 3; 
        }
        lcontrol._overlaysList.children[0].control.disabled = true;
        lcontrol._overlaysList.children[1].control.disabled = true;
        lcontrol._overlaysList.children[2].control.disabled = true;
        lcontrol._overlaysList.children[3].control.disabled = true;

        lcontrol._overlaysList.children[0].style.color = "rgb(190, 190, 190)";
        lcontrol._overlaysList.children[1].style.color = "rgb(190, 190, 190)";
        lcontrol._overlaysList.children[2].style.color = "rgb(190, 190, 190)";
        lcontrol._overlaysList.children[3].style.color = "rgb(190, 190, 190)";

        map.removeControl(snowLegend);
        map.removeControl(soilwetLegend);
        map.removeControl(tempLegend);
        map.removeControl(fireLegend);

    } else {
        if (!map.hasLayer(soilwetnessTimeLayer) && forecast == 0) {
            soilwetnessTimeLayer.addTo(map);
        } else if (!map.hasLayer(temperatureTimeLayer) && forecast == 1) {
            temperatureTimeLayer.addTo(map);
        } else if (!map.hasLayer(snowthicknessTimeLayer) && forecast == 2) {
            snowthicknessTimeLayer.addTo(map);
        } else if (!map.hasLayer(forestfireTimeLayer) && forecast == 3) {
            forestfireTimeLayer.addTo(map);
            forestfire1kmTimeLayer.addTo(map);
        }

        lcontrol._overlaysList.children[0].style.color = "initial";
        lcontrol._overlaysList.children[1].style.color = "initial";
        lcontrol._overlaysList.children[2].style.color = "initial";
        lcontrol._overlaysList.children[3].style.color = "initial";

        if (lcontrol._overlaysList.children[0].control.checked) { 
            soilwetLegend.addTo(this); 
        }
        else if (lcontrol._overlaysList.children[1].control.checked) { 
            tempLegend.addTo(this); 
        }
        else if (lcontrol._overlaysList.children[2].control.checked) { 
            snowLegend.addTo(this); 
        }
        else if (lcontrol._overlaysList.children[3].control.checked) { 
            fireLegend.addTo(this); 
        }
    }

});

map.on('moveend', function(e) {
    if (harvDynamic.checked && georastercache) {
        plotgeotiff();
    }
});


/*
var slider = document.getElementById("opacity-range");
var output = document.getElementById("opacity-value");
output.innerHTML = slider.value + " %"; // Display the default slider value
opacity = slider.value;

slider.oninput = function () {
    if (fr20TimeLayer) {
        opacity = this.value;
        fr20TimeLayer.setOpacity(this.value / 100);
        output.innerHTML = this.value + " %";
    }
    if (sd20TimeLayer) {
        opacity = this.value;
        sd20TimeLayer.setOpacity(this.value / 100);
        output.innerHTML = this.value + " %";
    }
    if (sd80TimeLayer) {
        opacity = this.value;
        sd80TimeLayer.setOpacity(this.value / 100);
        output.innerHTML = this.value + " %";
    }
}
*/

//var latlonPoint = 'Kajaani';
var latlonPoint;
var perturbations = 50;

/* Dygraph.prototype.doZoomX_ = function(lowX, highX) {
    return;
}; */

var dyGraphBOptions = {
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
    underlayCallback: timeseriedateline,
    clickCallback: timeserieclick,
    zoomCallback: function() {
        this.resetZoom();
      },
}

var SWensemble = "";
var label = ["date", "SW-0"];
var labelstxt = {'SW-0': { fillGraph: true }};
for (i = 1; i <= perturbations; i = i + 1) {
    label[i+1] = 'SW-' + i ;
    labelstxt[label[i]]= { fillGraph: false };
    SWensemble += ",ULSM-M3M3:HOPSSF:5026::0:3:" + i ;
}
var dyGraphSWOptions = {
    legend: "always",
    //ylabel: "Soil Wetness (m\u00B3/m\u00B3)",
    ylabel: "Soil Wetness (%)",
    labels: label,
    series: labelstxt,
    labelsDiv: "labels",
    axes: {
        //y: { valueRange: [-0.0, 1.01] },
        y: { valueRange: [-0.0, 101] },
    },
    underlayCallback: timeseriedateline,
    //clickCallback: timeserieclick,
    animatedZooms: true,
}

var label = ["date", "ST-0"];
var labelstxt = {'ST-0': { fillGraph: true }};
var TGKensemble = "";
for (i = 1; i <= perturbations; i = i + 1) {
    label[i+1] = 'ST-' + i ;
    labelstxt[label[i]]= { fillGraph: false };
    TGKensemble = TGKensemble + ",TSOIL-K:HOPSSF:5026::0:3:" + i + "}";
}
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

var SHensemble = "";
var label = ["date", "SH-0"];
var labelstxt = {'SH-0': { fillGraph: true }};
for (i = 1; i <= perturbations; i = i + 1) {
    label[i+1] = 'SH-' + i ;
    labelstxt[label[i]]= { fillGraph: false };
    SHensemble += ",HSNOW-M:HOPSSF:5026::0:3:" + i ;
}
var dyGraphSHOptions = {
    drawAxesAtZero: true,
    axisLineWidth: 0.5,
    legend: 'always',
    //ylabel: "Snow",
    //labels: ["date", "Snow Height", "Snowfall Accumulation"],
    ///ylabel: "Snow Height (m)",
    ylabel: "SWE (mm)",
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
/*     axes: {
        y: { valueRange: [-0.0, 1.51] },
    }, */
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

/*
var center = L.circle(null, {
    color: 'white',
    fillColor: 'blue',
    fillOpacity: 1,
    radius: 20,
    interactive: false,
    zIndexOffset: 30,
});
*/

var dateFixed = false;

var graphLoad, graphTimer;
var graphLoad2, graphLoad3, graphLoad4;

function drawtimeseries() {
    graphLoad = $.getJSON("https://sm.harvesterseasons.com/timeseries?latlon=" + latlonPoint + "&param=" + param1 + "," + param2 + "," + param3 + "," + param4 + "&starttime=data&endtime=data&timestep=data&format=json&source=grid&timeformat=xml&origintime=" + dateString_origintime,
        function (data) {
            var graphdata = [];
            for (i = 0; i < data.length; i++) {
                graphdata[i] = [new Date(data[i][param1]), data[i][param2], Math.max(data[i][param3], data[i][param4])];
            }

            if (!dateFixed && data.length > 0) {
                // Fix the last date of dateslider to timeseries data
                var maxDate = new Date(data[data.length - 1][param1]);
                var maxDays = Math.ceil((maxDate - startDate) / 1000 / 60 / 60 / 24);
                if (dateslider.value > maxDays) {
                    dateslider.value = maxDays;
                    sliderDate = new Date(startDate);
                    sliderDate.setUTCDate(sliderDate.getUTCDate() + Number(dateslider.value));
                    dateoutput.innerHTML = sliderDate.toLocaleDateString();
                    map.timeDimension.setCurrentTime(sliderDate.getTime());
                }
                dateslider.max = maxDays;
                dateFixed = true;
            }

            if (graphdata.length > 0) {
                gB = new Dygraph(
                    document.getElementById("graphB"),
                    graphdata,
                    dyGraphBOptions
                );
                document.getElementById("graphB").style = "line-height: 1;";
            } else {
                document.getElementById("graphB").innerHTML = "Error loading data";
            }

            graphLoad3 = $.get("https://sm.harvesterseasons.com/timeseries?latlon=" + latlonPoint + "&param=utctime,ULSM-M3M3:HOPSSF:5026::0:1:0" + SWensemble + "&starttime=data&endtime=data&timestep=data&timeformat=sql&precision=full&separator=,&source=grid&origintime=" + dateString_origintime,
                function (data) {
                    if (data.length > 0) {
                        gsw = new Dygraph(
                            document.getElementById("graphsw"),
                            data,
                            dyGraphSWOptions
                        );
                        document.getElementById("graphsw").style = "line-height: 1;";
                        if (typeof gsw !== 'undefined' && typeof gst !== 'undefined' && typeof gsh !== 'undefined') {
                            var sync = Dygraph.synchronize(gsw, gst, gsh, {
                                selection: false,
                                zoom: true,
                                range: false
                            });
                            //gB_ecsf.updateOptions({dateWindow: gB_ecbsf.xAxisExtremes()})                    
                        }
                    } else {
                        document.getElementById("graphsw").innerHTML = "Error loading data";
                    }
                })

            graphLoad4 = $.get("https://sm.harvesterseasons.com/timeseries?latlon=" + latlonPoint + "&param=utctime,TSOIL-K:HOPSSF:5026::0:1:0" + TGKensemble + "&starttime=data&endtime=data&timestep=data&timeformat=sql&separator=,&precision=full&source=grid&origintime=" + dateString_origintime,
                function (data) {
                    if (data.length > 0) {
                        gst = new Dygraph(
                            document.getElementById("graphst"),
                            data,
                            dyGraphSTOptions
                        );
                        if (typeof gsw !== 'undefined' && typeof gst !== 'undefined' && typeof gsh !== 'undefined') {
                            var sync = Dygraph.synchronize(gsw, gst, gsh, {
                                selection: false,
                                zoom: true,
                                range: false
                            });
                            //gB_ecsf.updateOptions({dateWindow: gB_ecbsf.xAxisExtremes()})                    
                        }
                    } else {
                        document.getElementById("graphst").innerHTML = "Error loading data";
                        document.getElementById("graphst").style = "line-height: 240px;";
                    }
                });

            graphLoad2 = $.get("https://sm.harvesterseasons.com/timeseries?latlon=" + latlonPoint + "&param=utctime,HSNOW-M:HOPSSF:5026::0:1:0" + SHensemble + "&starttime=data&endtime=data&timestep=data&timeformat=sql&precision=full&separator=,&source=grid&origintime=" + dateString_origintime,
                function (data) {
                    if (data.length > 0) {
                        gsh = new Dygraph(
                            document.getElementById("graphsh"),
                            data,
                            dyGraphSHOptions
                        );
                        if (typeof gsw !== 'undefined' && typeof gst !== 'undefined' && typeof gsh !== 'undefined') {
                            var sync = Dygraph.synchronize(gsw, gst, gsh, {
                                selection: false,
                                zoom: true,
                                range: false
                            });
                            //gB_ecsf.updateOptions({dateWindow: gB_ecbsf.xAxisExtremes()})                    
                        }
                    } else {
                        document.getElementById("graphsh").innerHTML = "Error loading data";
                        document.getElementById("graphsh").style = "line-height: 240px;";
                    }
                });
        });
}


function onMapClick(e) {

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
}

map.on('click', onMapClick);

if (mappos.center[0] != 64 || mappos.center[1] != 27) {
    onPermalink();
    map.fire('zoomend');
}

$('#feedback').keyup(function () {
    if ($(this).val().length != 0)
        $('.feedbackButton').attr('disabled', false);
    else
        $('.feedbackButton').attr('disabled', true);
});

$('#palaute').keyup(function(){
    if($(this).val().length !=0)
        $('.palauteButton').attr('disabled', false);            
    else
        $('.palauteButton').attr('disabled', true);
})

function submitFunc() {
    document.getElementById('userlatlon_en').value = latlonTitle;
    document.getElementById('userlatlon_fi').value = latlonTitle;

    //lat = map.getCenter().lat.toFixed(2);
    //lon = map.getCenter().lng.toFixed(2);
    lat = map.getCenter().lat;
    lon = map.getCenter().lng;

    document.getElementById('mapviewlatlon_en').value = lat + ", " + lon;
    document.getElementById('mapviewlatlon_fi').value = lat + ", " + lon;

    document.getElementById('zoomlevel_en').value = map.getZoom();
    document.getElementById('zoomlevel_fi').value = map.getZoom();

    document.getElementById('date_en').value = startYear + '-' + startMonth + '-' + startDay;
    document.getElementById('date_fi').value = startYear + '-' + startMonth + '-' + startDay;
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

}

