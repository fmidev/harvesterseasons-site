var startDate = new Date();
var startYear = startDate.getFullYear();
var startMonth = startDate.getMonth() + 1;
var startDay = startDate.getDate();
if (startMonth < 10) {
    startMonth = '0' + startMonth;
}
if (startDay < 10) {
    startDay = '0' + startDay;
}

var dateString = startYear + '-' + startMonth + '-' + startDay + '/P6M';


var map = L.map('map', {
    zoom: 6,
    minZoom: 6,
    maxZoom: 16,
    fullscreenControl: false,
    center: [64.0, 27.0],
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
    }
/*    timeDimensionControlOptions: {
        //timeZones: ["Local"],
        playerOptions: {
            transitionTime: 250,
        }
    }*/
});


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
        maxZoom: 15
    },
    strings: {
        title: "Show location"
    }
}).addTo(map);

// request location update and set location
lc.start();

//console.debug(L.timeDimension().getCurrentTime())
//map.on('timeloading',console.debug(L.timeDimension().getCurrentTime()));
//map.on('timeload',console.debug(L.timeDimension().getCurrentTime()));

const rasterUrl = "https://pta.data.lit.fmi.fi/geo/harvestability/KKL_SMK_Suomi_2019_06_25-UTM35.tif";

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

var dateslider = document.getElementById("date-range");
var dateoutput = document.getElementById("date-value");
var harvDynamic = document.getElementById("dynamic-checkbox");

dateslider.value = 0;
sliderDate.setDate(sliderDate.getDate() + Number(dateslider.value));
dateoutput.innerHTML = sliderDate.toLocaleDateString(); // Display the default slider value
//dateoutput.innerHTML = sliderDate.toDateString().substring(4); 

var repeatId;

dateslider.oninput = function () {
    sliderDate = new Date(startDate);
    sliderDate.setDate(sliderDate.getDate() + Number(this.value));
    dateoutput.innerHTML = sliderDate.toLocaleDateString();
    //dateoutput.innerHTML = sliderDate.toDateString().substring(4);
    //map.timeDimension.setCurrentTime(sliderDate.getTime());
}

dateslider.onchange = function () {
    if (harvDynamic.checked && georastercache) {
         plotgeotiff();
    }
    map.timeDimension.setCurrentTime(sliderDate.getTime());
}

function dateback() {
    if (Number(dateslider.value) > Number(dateslider.min)) {
        dateslider.value = Number(dateslider.value) - 1;
        sliderDate.setDate(sliderDate.getDate() - 1);
        dateoutput.innerHTML = sliderDate.toLocaleDateString();
        //dateoutput.innerHTML = sliderDate.toDateString().substring(4);
        if (harvDynamic.checked && georastercache) {
            plotgeotiff();
        }
        map.timeDimension.setCurrentTime(sliderDate.getTime());
    }
}

/*
function datebackweek() {
    if (Number(dateslider.value) > Number(dateslider.min)) {
        dateslider.value = Number(dateslider.value) - 7;
        sliderDate.setDate(sliderDate.getDate() - 7);
        dateoutput.innerHTML = sliderDate.toDateString().substring(4);
        plotgeotiff();
        // map.timeDimension.previousTime(1);
        map.timeDimension.setCurrentTime(sliderDate.getTime());
    }
}
*/

function datebackscroll() {
    repeatId = setInterval(function () {
        if (Number(dateslider.value) > Number(dateslider.min)) {
            dateslider.value = Number(dateslider.value) - 1;
            sliderDate.setDate(sliderDate.getDate() - 1);
            dateoutput.innerHTML = sliderDate.toLocaleDateString();
            //dateoutput.innerHTML = sliderDate.toDateString().substring(4);        
            if (harvDynamic.checked && georastercache) {
                plotgeotiff();
            }
            map.timeDimension.setCurrentTime(sliderDate.getTime());
        }
    }, 2000);
}

function datebackscrollfast() {
    repeatId = setInterval(function () {
        if (Number(dateslider.value) > Number(dateslider.min)) {
            dateslider.value = Number(dateslider.value) - 1;
            sliderDate.setDate(sliderDate.getDate() - 1);
            dateoutput.innerHTML = sliderDate.toLocaleDateString();
            //dateoutput.innerHTML = sliderDate.toDateString().substring(4);
            /*
            if (harvDynamic.checked && georastercache) {
                plotgeotiff();
            }
            map.timeDimension.setCurrentTime(sliderDate.getTime());
            */
        }
    }, 100);
}

function dateforward() {
    if (Number(dateslider.value) < Number(dateslider.max)) {
        dateslider.value = Number(dateslider.value) + 1;
        sliderDate.setDate(sliderDate.getDate() + 1);
        dateoutput.innerHTML = sliderDate.toLocaleDateString();
        //dateoutput.innerHTML = sliderDate.toDateString().substring(4);
        //console.debug(harvDynamic._map)
        if (harvDynamic.checked && georastercache) {
            plotgeotiff();
        }
        map.timeDimension.setCurrentTime(sliderDate.getTime());
    }
}

/*
function dateforwardweek() {
    if (Number(dateslider.value) < Number(dateslider.max)) {
        dateslider.value = Number(dateslider.value) + 7;
        sliderDate.setDate(sliderDate.getDate() + 7);
        dateoutput.innerHTML = sliderDate.toDateString().substring(4);
        plotgeotiff();
        //map.timeDimension.nextTime();
        map.timeDimension.setCurrentTime(sliderDate.getTime());
    }
}
*/

function dateforwardscroll() {
    repeatId = setInterval(function () {
        if (Number(dateslider.value) < Number(dateslider.max)) {
            dateslider.value = Number(dateslider.value) + 1;
            sliderDate.setDate(sliderDate.getDate() + 1);
            dateoutput.innerHTML = sliderDate.toLocaleDateString();
            //dateoutput.innerHTML = sliderDate.toDateString().substring(4);
            if (harvDynamic.checked && georastercache) {
                plotgeotiff();
            }
            map.timeDimension.setCurrentTime(sliderDate.getTime());
        }
    }, 2000);
}

function dateforwardscrollfast() {
    repeatId = setInterval(function () {
        if (Number(dateslider.value) < Number(dateslider.max)) {
            dateslider.value = Number(dateslider.value) + 1;
            sliderDate.setDate(sliderDate.getDate() + 1);
            dateoutput.innerHTML = sliderDate.toLocaleDateString();
            //dateoutput.innerHTML = sliderDate.toDateString().substring(4);
            /*
            if (harvDynamic.checked && georastercache) {
                plotgeotiff();
            }
            map.timeDimension.setCurrentTime(sliderDate.getTime());
            */
        }
    }, 100);
}

function datestop() {
    clearInterval(repeatId);
  }

function datestopscrollfast() {
    clearInterval(repeatId);
    if (harvDynamic.checked && georastercache) {
        plotgeotiff();
    }
    map.timeDimension.setCurrentTime(sliderDate.getTime());
  }


var playButton = document.getElementById("playbutton");
//console.debug(playButton.value)

function playbuttonfunc() {
    if (playButton.value == "Play") {
        playButton.value = "Stop";
        playButtonRepeatId = setInterval(function () {
            if (Number(dateslider.value) < Number(dateslider.max)) {
                dateslider.value = Number(dateslider.value) + 1;
                sliderDate.setDate(sliderDate.getDate() + 1);
                dateoutput.innerHTML = sliderDate.toLocaleDateString();
                //dateoutput.innerHTML = sliderDate.toDateString().substring(4);
                if (harvDynamic.checked && georastercache) {
                    plotgeotiff();
                }
                map.timeDimension.setCurrentTime(sliderDate.getTime());
            }
        }, 3000);
    } else {
        clearInterval(playButtonRepeatId);
        playButton.value = "Play"
    }
}




//harvestability = L.layerGroup();

//harvDynamic = L.layerGroup().addTo(map);
//var harvDynamicState = 1;
//document.getElementById("dynamic-checkbox").checked = true;

harvDynamic.checked = false;
harvDynamic.disabled = true;
document.getElementById("dynamic").style.color = "lightgray";

var harvDynamicState = true; // set by user

function changedynamic() {
    if (harvDynamicState == true) {
        harvDynamicState = false;
    } else {
        harvDynamicState = true;
    }
    //if (georastercache) { plotgeotiff(); };
    if (georastercache) { idx = -10; plotgeotiff(); }; // always re-draw
}

map.on('zoomend', function(e) {
    if (map.getZoom() < 13) {
        harvDynamic.checked = false;
        harvDynamic.disabled = true;
        document.getElementById("dynamic").style.color = "lightgray";
        //document.getElementById("dynamic").style.visibility = "hidden";
        //document.getElementById("dynamic-checkbox").style.visibility = "hidden";
        
    } else if (harvDynamic.disabled == true) {
        if (harvDynamicState == true) {
            harvDynamic.checked = true;
        }
        harvDynamic.disabled = false;
        document.getElementById("dynamic").style.color = "initial";
        //document.getElementById("dynamic").style.visibility = "visible";
        //document.getElementById("dynamic-checkbox").style.visibility = "visible";
    }
});

map.on('moveend', function(e) {
    if (harvDynamic.checked && georastercache) {
        plotgeotiff();
    }
});

param1="utctime";
param2="HARVIDX{0.4;SOILWET1-M:ECBSF:5009::7:3:1-50;SOILWET1-M:ECBSF:5009::7:1:0}";
param3="HARVIDX{273;TSOIL-K:ECBSF:5009::28:3:1-50;TSOIL-K:ECBSF:5009::28:1:0}";
param4="ensover{0.9;0.4;HSNOW-M:ECBSF:5009:1:0:3:1-50;HSNOW-M:ECBSF:5009:1:0:1:0}";

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
    [255, 38, 0], // Normal summer, peat soil (normaali kesä, turvemaa)
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

function plotgeotiff(e) {
    //console.debug(idx)

    if (harvDynamic.checked) {

        latlon = map.getCenter().toString();
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

        dataUrl2 = "https://sm.harvesterseasons.com/timeseries?latlon=" + latlonPoint + "&param=" + param2 + "," + param3 + "," + param4 + "&starttime=" + dataYear + dataMonth + dataDay + "T000000Z&timesteps=1&format=json&precision=full";

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
                            return `rgba(${colorMap[r][0]},${colorMap[r][1]},${colorMap[r][2]},.5)`;
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
                return `rgba(${colorMap[r][0]},${colorMap[r][1]},${colorMap[r][2]},.5)`;
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
                return `rgba(${colorMap[r][0]},${colorMap[r][1]},${colorMap[r][2]},.5)`;
            } else {
                return 'rgba(0,0,0,0.0)';
            }
        }
    };
    const resolution = 64;
    new GeoRasterLayer({
        minZoom: 9,
        maxZoom: 12,
        georaster, pixelValuesToColorFn, resolution,
        zIndex: 10,
    }).addTo(map);
}


var smartWMS = 'https://sm.harvesterseasons.com/wms?';

var temperatureLayerOptions = {
    crs: L.CRS.EPSG4326,
    version: '1.3.0',
    layers: 'harvester:ecsf:TSOIL-K',
    format: 'image/png',
    transparent: 'true',
    styles: 'default',
    source: 'grid',
    opacity: 0.5,
};
var temperatureLayer = L.tileLayer.wms(smartWMS, temperatureLayerOptions);
//var temperatureTimeLayer = L.timeDimension.layer.wms(temperatureLayer, {cache: 100, updateTimeDimension: true});
var temperatureTimeLayer = L.timeDimension.layer.wms(temperatureLayer);

var soilwetnessLayerOptions = {
    crs: L.CRS.EPSG4326,
    version: '1.3.0',
    layers: 'harvester:ecsf:SOILWET1-M',
    format: 'image/png',
    transparent: 'true',
    styles: 'default',
    source: 'grid',
    opacity: 0.5,
};
var soilwetnessLayer = L.tileLayer.wms(smartWMS, soilwetnessLayerOptions);
var soilwetnessTimeLayer = L.timeDimension.layer.wms(soilwetnessLayer);

var snowthicknessLayerOptions = {
    crs: L.CRS.EPSG4326,
    version: '1.3.0',
    layers: 'harvester:ecsf:HSNOW-M',
    format: 'image/png',
    transparent: 'true',
    styles: 'default',
    source: 'grid',
    opacity: 0.5,
};
var snowthicknessLayer = L.tileLayer.wms(smartWMS, snowthicknessLayerOptions);
var snowthicknessTimeLayer = L.timeDimension.layer.wms(snowthicknessLayer);


/*
var sd80LayerOptions = {
    crs: L.CRS.EPSG4326,
    version: '1.3.0',
    layers: 'temperature-forecast-contour',
    format: 'image/png',
    transparent: 'true',
};
var sd80Layer = L.tileLayer.wms(smartWMS, sd80LayerOptions);
var sd80TimeLayer = L.timeDimension.layer.wms(sd80Layer);

var fr20LayerOptions = {
    crs: L.CRS.EPSG4326,
    version: '1.3.0',
    layers: 'precipitation-forecast',
    format: 'image/png',
    transparent: 'true',
};
var fr20Layer = L.tileLayer.wms(smartWMS, fr20LayerOptions);
var fr20TimeLayer = L.timeDimension.layer.wms(fr20Layer);

var tempLegend = L.control({
    position: 'topleft'
});

var smartLegend = L.control({
    position: 'bottomright'
});

smartLegend.onAdd = function (map) {
    var src = 'https://openwms.fmi.fi/geoserver/Weather/wms?REQUEST=GetLegendGraphic&VERSION=1.3.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=precipitation-forecast';
    var div = L.DomUtil.create('div', 'info legend');
    div.style.width = '120px';
    div.style.height = '140px';
    div.style['background-image'] = 'url(' + src + ')';
    div.style['background-size'] = 'contain';
    div.style['background-repeat'] = 'no-repeat';
    return div;
};

tempLegend.onAdd = function (map) {
    var src = 'https://openwms.fmi.fi/geoserver/Weather/wms?REQUEST=GetLegendGraphic&VERSION=1.3.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=temperature-forecast';
    var div = L.DomUtil.create('div', 'info legend');
    div.style.width = '35px';
    div.style.height = '455px';
    div.style['background-image'] = 'url(' + src + ')';
    div.style['background-size'] = 'contain';
    div.style['background-repeat'] = 'no-repeat';
    return div;
};

var overlayMaps = {
    "Precipitation forecast": fr20TimeLayer,
    "Temperature forecast": sd20TimeLayer,
    "Temperature forecast contour": sd80TimeLayer,
};

map.on('overlayadd', function (eventLayer) {
    switch (eventLayer.name) {
        case "Precipitation forecast": smartLegend.addTo(this); break;
        case "Temperature forecast": tempLegend.addTo(this); break;
    }
});

map.on('overlayremove', function (eventLayer) {
    switch (eventLayer.name) {
        case "Precipitation forecast": map.removeControl(smartLegend); break;
        case "Temperature forecast": map.removeControl(tempLegend); break;
    }
});*/

/*
map.on('overlayadd', function (eventLayer) {
    switch (eventLayer.name) {
        //case "Dynamic harvestability": plotgeotiffcontrols; break;
        case "Dynamic harvestability": {
            harvDynamicState = 1; 
            console.debug(harvDynamicState); 
            plotgeotiff(); 
            break;
        }
    }
});

map.on('overlayremove', function (eventLayer) {
    switch (eventLayer.name) {
        //case "Dynamic harvestability": plotgeotiffcontrols; break;
        case "Dynamic harvestability": {
            harvDynamicState = 0; 
            //console.debug(harvDynamicState); 
            plotgeotiffstatic(); 
            //plotgeotiff(); 
            break;
        }
    }
});

var overlayMaps = {
    //"Harvestability": harvestability,
    "Dynamic harvestability": harvDynamic,
};

L.control.layers(null, overlayMaps, { collapsed: false }).addTo(map);
//L.control.layers( overlayMaps, null, { collapsed: false }).addTo(map);
*/

var overlayMaps = {
    "Snow Thickness": snowthicknessTimeLayer,
    "Soil Wetness": soilwetnessTimeLayer,
    "Soil Temperature": temperatureTimeLayer,
};

L.control.layers(baseMaps, overlayMaps, { collapsed: false }).addTo(map);

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

var latlonPoint = 'Kajaani';
var perturbations = 50;


var dyGraphBOptions = {
    title: latlonPoint,
    titleHeight: 28,
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
        y: { valueRange: [-0.1, 2.1], pixelsPerLabel: 20 },
    }
}

var SHensemble = "";
var label = ["date", "SH-0"];
var labelstxt = {'SH-0': { fillGraph: true }};
for (i = 1; i <= perturbations; i = i + 1) {
    label[i+1] = 'SH-' + i ;
    labelstxt[label[i]]= { fillGraph: false };
    SHensemble += ",HSNOW-M:ECBSF:5009:1:0:3:" + i ;
}
var dyGraphOptions = {
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
    }
}

var SWensemble = "";
var label = ["date", "SW-0"];
var labelstxt = {'SW-0': { fillGraph: true }};
for (i = 1; i <= perturbations; i = i + 1) {
    label[i+1] = 'SW-' + i ;
    labelstxt[label[i]]= { fillGraph: false };
    SWensemble += ",SOILWET1-M:ECBSF:5009::7:3:" + i ;
}
var dyGraph2Options = {
    legend: "always",
    ylabel: "Soil Wetness (m)",
    labels: label,
    series: labelstxt,
    labelsDiv: "labels",
    axes: {
        y: { valueRange: [-0.0, 1.01] },
    }
}
var label = ["date", "ST-0"];
var labelstxt = {'ST-0': { fillGraph: true }};
var TGKensemble = "";
for (i = 1; i <= perturbations; i = i + 1) {
    label[i+1] = 'ST-' + i ;
    labelstxt[label[i]]= { fillGraph: false };
    TGKensemble = TGKensemble + ",K2C{TSOIL-K:ECBSF:5009::28:3:" + i + "}";
}
var dyGraphGrdOptions = {
    legend: 'always',
    ylabel: "Soil Temperature (°C)",
    labels: label,
    series: labelstxt,
    labelsDiv: "labels"
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
    radius: 1000,
    interactive: false,
    zIndexOffset: 30,
});

var center = L.circle(null, {
    color: 'white',
    fillColor: 'blue',
    fillOpacity: 1,
    radius: 20,
    interactive: false,
    zIndexOffset: 30,
});

var graphLoad, graphTimer;
//var graphLoad2, graphLoad3, graphLoad4;

function onMapClick(e) {

    if (graphLoad) { graphLoad.abort(); }
    if (graphTimer) { clearTimeout(graphTimer); }

    lat = e.latlng.lat.toFixed(2);
    lon = e.latlng.lng.toFixed(2);

    latlonTitle = lat + ", " + lon;

    latlon = e.latlng.toString();
    //latlonTitle = latlon.substring(7, latlon.length - 1);
    latlonPoint = latlon.replace(" ", "").substring(7, latlon.length - 2);
    dyGraphBOptions.title = latlonTitle;

    gB = new Dygraph(
        document.getElementById("graphB"),
        [[0, 0, 0]],
        dyGraphBOptions
    );

    graphTimer = setTimeout(function () {
	$("body").css("cursor", "progress");
        graphLoad = $.getJSON("https://sm.harvesterseasons.com/timeseries?latlon=" + latlonPoint + "&param=" + param1 + "," + param2 + "," + param3 + "," + param4 + "&starttime=data&endtime=data&timestep=data&format=json&precision=full&source=grid&timeformat=sql",
            function (data) {
                //console.debug(data)
                var graphdata = [];
                for (i = 0; i < data.length; i++) {
                    graphdata[i] = [new Date(data[i][param1]), data[i][param2], Math.max(data[i][param3], data[i][param4])];
                }

                gB = new Dygraph(
                    document.getElementById("graphB"),
                    graphdata,
                    dyGraphBOptions
                );
                //});

                g = new Dygraph(
                    document.getElementById("graph"),
                    "https://sm.harvesterseasons.com/timeseries?latlon=" + latlonPoint + "&param=utctime,HSNOW-M:ECBSF:5009:1:0:1:0" + SHensemble + "&starttime=data&endtime=data&timestep=data&timeformat=sql&precision=full&separator=,&source=grid",
                    dyGraphOptions
                );
                gsd = new Dygraph(
                    document.getElementById("graphsd"),
                    "https://sm.harvesterseasons.com/timeseries?latlon=" + latlonPoint + "&param=utctime,SOILWET1-M:ECBSF:5009::7:1:0" + SWensemble + "&starttime=data&endtime=data&timestep=data&timeformat=sql&precision=full&separator=,&source=grid",
                    dyGraph2Options
                );
                grd = new Dygraph(
                    document.getElementById("graphgrd"),
                    "https://sm.harvesterseasons.com/timeseries?latlon=" + latlonPoint + "&param=utctime,K2C{TSOIL-K:ECBSF:5009::28:1:0}" + TGKensemble + "&starttime=data&endtime=data&timestep=data&timeformat=sql&separator=,&precision=full&source=grid",
                    dyGraphGrdOptions
                );
            });
	$("body").css("cursor", "default");
    }, 2000);

    /*popup
        .setLatLng(e.latlng)
        .setContent("Graphed point: " + latlonTitle)
        .openOn(map);*/

    marker.setLatLng(e.latlng).addTo(map);
    circle.setLatLng(e.latlng).addTo(map);
    //center.setLatLng(e.latlng).addTo(map);

//    if (map.getZoom() < 13) { map.zoomIn(2) }
//    else if (map.getZoom() == 13) { map.zoomIn(1) }

    if (map.getZoom() < 13) { map.setView(e.latlng, map.getZoom() + 2) }
    else if (map.getZoom() == 13) { map.setView(e.latlng, map.getZoom() + 1) }

}

function onLocationFound(e) {
    //console.debug('Found');

    harvDynamic.checked = true;
    harvDynamic.disabled = false;
    document.getElementById("dynamic").style.color = "initial";

    //if (georastercache) { plotgeotiff(); };
    lc.stop();
    //lc.stopFollowing();

    lat = e.latlng.lat.toFixed(2);
    lon = e.latlng.lng.toFixed(2);
    latlonTitle = lat + ", " + lon;

    latlon = e.latlng.toString();
    //latlonTitle = latlon.substring(7, latlon.length - 1);
    latlonPoint = latlon.replace(" ", "").substring(7, latlon.length - 2);
    dyGraphBOptions.title = latlonTitle;
    perturbations = 50;
    if (latlonPoint == "Kajaani") { latlonPoint = "64.22728,27.72846"; }

    gB = new Dygraph(
        document.getElementById("graphB"),
        [[0, 0, 0]],
        dyGraphBOptions
    );

    graphLoad = $.getJSON("https://sm.harvesterseasons.com/timeseries?latlon=" + latlonPoint + "&param=" + param1 + "," + param2 + "," + param3 + "," + param4 + "&starttime=data&endtime=data&timestep=data&format=json&precision=full&source=grid&timeformat=sql",
        function (data) {
            //console.debug(data)
            var graphdata = [];
            for (i = 0; i < data.length; i++) {
                graphdata[i] = [new Date(data[i][param1]), data[i][param2], Math.max(data[i][param3], data[i][param4])];
            }
            //console.debug(graphdata)

            // Fix the last date of dateslider to timeseries data
            var maxDate = new Date(data[data.length - 1][param1]);
            var maxDays = Math.ceil((maxDate - startDate) / 1000 / 60 / 60 / 24);
            if (dateslider.value > maxDays) {
                dateslider.value = maxDays;
                sliderDate = new Date(startDate);
                sliderDate.setDate(sliderDate.getDate() + Number(dateslider.value));
                dateoutput.innerHTML = sliderDate.toLocaleDateString();
                //dateoutput.innerHTML = sliderDate.toDateString().substring(4);
                map.timeDimension.setCurrentTime(sliderDate.getTime());
            }
            dateslider.max = maxDays;

            gB = new Dygraph(
                document.getElementById("graphB"),
                graphdata,
                dyGraphBOptions
            );
            //});

            g = new Dygraph(
                document.getElementById("graph"),
                "https://sm.harvesterseasons.com/timeseries?latlon=" + latlonPoint + "&param=utctime,HSNOW-M:ECBSF:5009:1:0:1:0" + SHensemble + "&starttime=data&endtime=data&timestep=data&timeformat=sql&precision=full&separator=,&source=grid",
                dyGraphOptions
            );
            gsd = new Dygraph(
                document.getElementById("graphsd"),
                "https://sm.harvesterseasons.com/timeseries?latlon=" + latlonPoint + "&param=utctime,SOILWET1-M:ECBSF:5009::7:1:0" + SWensemble + "&starttime=data&endtime=data&timestep=data&timeformat=sql&precision=full&separator=,&source=grid",
                dyGraph2Options
            );
            grd = new Dygraph(
                document.getElementById("graphgrd"),
                "https://sm.harvesterseasons.com/timeseries?latlon=" + latlonPoint + "&param=utctime,K2C{TSOIL-K:ECBSF:5009::28:1:0}" + TGKensemble + "&starttime=data&endtime=data&timestep=data&timeformat=sql&separator=,&precision=full&source=grid",
                dyGraphGrdOptions
            );
        });

    /*
    popup
        .setLatLng(e.latlng)
        .setContent("Graphed point: " + latlonTitle)
        .openOn(map);*/

    marker.setLatLng(e.latlng).addTo(map);
    circle.setLatLng(e.latlng).addTo(map);
    //center.setLatLng(e.latlng).addTo(map);

}

function onLocationError(e) {
    //console.debug('Not found');

    lat = map.getCenter().lat.toFixed(2);
    lon = map.getCenter().lng.toFixed(2);
    latlonTitle = lat + ", " + lon;

    latlon = map.getCenter().toString();
    //latlonTitle = latlon.substring(7, latlon.length - 1);
    latlonPoint = latlon.replace(" ", "").substring(7, latlon.length - 2);
    dyGraphBOptions.title = latlonTitle;
    perturbations = 50;
    if (latlonPoint == "Kajaani") { latlonPoint = "64.22728,27.72846"; }

    gB = new Dygraph(
        document.getElementById("graphB"),
        [[0, 0, 0]],
        dyGraphBOptions
    );

    graphLoad = $.getJSON("https://sm.harvesterseasons.com/timeseries?latlon=" + latlonPoint + "&param=" + param1 + "," + param2 + "," + param3 + "," + param4 + "&starttime=data&endtime=data&timestep=data&format=json&precision=full&source=grid&timeformat=sql",
        function (data) {
            //console.debug(data)
            var graphdata = [];
            for (i = 0; i < data.length; i++) {
                graphdata[i] = [new Date(data[i][param1]), data[i][param2], Math.max(data[i][param3], data[i][param4])];
            }

            // Fix the last date of dateslider to timeseries data
            var maxDate = new Date(data[data.length - 1][param1]);
            var maxDays = Math.ceil((maxDate - startDate) / 1000 / 60 / 60 / 24);
            if (dateslider.value > maxDays) {
                dateslider.value = maxDays;
                sliderDate = new Date(startDate);
                sliderDate.setDate(sliderDate.getDate() + Number(dateslider.value));
                dateoutput.innerHTML = sliderDate.toLocaleDateString();
                //dateoutput.innerHTML = sliderDate.toDateString().substring(4);
                map.timeDimension.setCurrentTime(sliderDate.getTime());
            }
            dateslider.max = maxDays;

            gB = new Dygraph(
                document.getElementById("graphB"),
                graphdata,
                dyGraphBOptions
            );
            //});

            g = new Dygraph(
                document.getElementById("graph"),
                "https://sm.harvesterseasons.com/timeseries?latlon=" + latlonPoint + "&param=utctime,HSNOW-M:ECBSF:5009:1:0:1:0" + SHensemble + "&starttime=data&endtime=data&timestep=data&timeformat=sql&precision=full&separator=,&source=grid",
                dyGraphOptions
            );
            gsd = new Dygraph(
                document.getElementById("graphsd"),
                "https://sm.harvesterseasons.com/timeseries?latlon=" + latlonPoint + "&param=utctime,SOILWET1-M:ECBSF:5009::7:1:0" + SWensemble + "&starttime=data&endtime=data&timestep=data&timeformat=sql&precision=full&separator=,&source=grid",
                dyGraph2Options
            );
            grd = new Dygraph(
                document.getElementById("graphgrd"),
                "https://sm.harvesterseasons.com/timeseries?latlon=" + latlonPoint + "&param=utctime,K2C{TSOIL-K:ECBSF:5009::28:1:0}" + TGKensemble + "&starttime=data&endtime=data&timestep=data&timeformat=sql&separator=,&precision=full&source=grid",
                dyGraphGrdOptions
            );
        });

    marker.setLatLng(map.getCenter()).addTo(map);
    circle.setLatLng(map.getCenter()).addTo(map);
    //center.setLatLng(map.getCenter()).addTo(map);
}

map.on('click', onMapClick);
