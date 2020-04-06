var startDate = new Date();
var startYear = startDate.getUTCFullYear();
var startMonth = startDate.getUTCMonth() + 1;
var startDay = startDate.getUTCDate();
if (startMonth < 10) {
    startMonth = '0' + startMonth;
}
if (startDay < 10) {
    startDay = '0' + startDay;
}
var startHour = startDate.getUTCHours();
if (startHour < 10) {
    startHour = '0' + startHour;
}

var dateString = startYear + '-' + startMonth + '-' + startDay + 'T' + startHour + ':00:00Z/P2D';

var map = L.map('map', {
    zoom: 6,
    maxZoom: 16,
    fullscreenControl: false,
    center: [64.0, 27.0],
    timeDimension: true,
    timeDimensionControl: true,
    timeDimensionOptions: {
        timeInterval: dateString,
        period: "PT1H",
    },
    timeDimensionControlOptions: {
        playerOptions: {
            transitionTime: 250,
        }
    }
});

// load a tile layer
L.tileLayer('https://{s}.tile.thunderforest.com/landscape/{z}/{x}/{y}.png?apikey=e60422e636f34988a79015402724757b',
    {
        attribution: 'Tiles by <a href="http://www.thunderforest.com/">Thunderforest</a> Data by <a href="http://www.fmi.fi/">Finnish Meteorological Institute</a>',
        maxZoom: 22,
        minZoom: 0,
    }).addTo(map);

// load a tile layer
L.tileLayer('https://avoin-karttakuva.maanmittauslaitos.fi/avoin/wmts/1.0.0/kiinteistojaotus/default/WGS84_Pseudo-Mercator/{z}/{y}/{x}.png',
    {
        maxZoom: 16,
        minZoom: 13,
    }).addTo(map);


// create control and add to map
var lc = L.control.locate({
    strings: {
        title: "Show location"
    }
}).addTo(map);

// request location update and set location
lc.start();

const rasterUrl = "https://pta.data.lit.fmi.fi/geo/harvestability/KKL_SMK_Suomi_2019_06_25-UTM35.tif";

var georastercache;

parseGeoraster(rasterUrl).then(georaster => {
    georastercache = georaster;
    plotgeotiff();
});

map.on('locationfound', onLocationFound);
map.on('locationerror', onLocationError);

// GeoTIFF-layer time management

sliderDate = new Date(startDate);

var dateslider = document.getElementById("date-range");
var dateoutput = document.getElementById("date-value");

dateslider.value = 1;
sliderDate.setDate(sliderDate.getDate() + Number(dateslider.value));
dateoutput.innerHTML = sliderDate.toDateString().substring(4); // Display the default slider value

dateslider.oninput = function () {
    sliderDate = new Date(startDate);
    sliderDate.setDate(sliderDate.getDate() + Number(this.value));
    dateoutput.innerHTML = sliderDate.toDateString().substring(4);
    plotgeotiff();
}

function dateback() {
    if (Number(dateslider.value) > Number(dateslider.min)) {
        dateslider.value = Number(dateslider.value) - 1;
        sliderDate.setDate(sliderDate.getDate() - 1);
        dateoutput.innerHTML = sliderDate.toDateString().substring(4);
        plotgeotiff();
    }
}

function dateforward() {
    if (Number(dateslider.value) < Number(dateslider.max)) {
        dateslider.value = Number(dateslider.value) + 1;
        sliderDate.setDate(sliderDate.getDate() + 1);
        dateoutput.innerHTML = sliderDate.toDateString().substring(4);
        plotgeotiff();
    }
}

harvestability = L.layerGroup();
var snow = -100;
map.on('mouseup', plotgeotiff);

function plotgeotiff(e) {
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

    param = "K2C{TG-K:ECSF:5008:14:7:1:0}"
    dataUrl2 = "https://sm.harvesterseasons.com/timeseries?latlon=" + latlonPoint + "&param=" + param + "&starttime=" + dataYear + dataMonth + dataDay + "T000000Z&timesteps=1&format=json";


    var snowLoad = $.getJSON(dataUrl2, function (data) {
    });
    $.when(snowLoad).done(function () {
        console.debug(snowLoad.responseJSON[0][param])
        snow2 = snowLoad.responseJSON[0][param];
        limit = -1;
        if (snow == -100 || (snow <= limit && snow2 > limit) || (snow > limit && snow2 <= limit)) {
            snow = snowLoad.responseJSON[0][param];

            const georaster = georastercache;
            const { noDataValue } = georaster;

            if (snow > limit) {
                var colorMap = [
                    [0, 0, 0],
                    [0, 97, 0],
                    [97, 153, 0],
                    [160, 219, 0],
                    [255, 250, 0],
                    [255, 132, 0],
                    [255, 38, 0],
                    [128, 255, 255], // water
                ];
            } else {
                var colorMap = [
                    [0, 0, 0],
                    [0, 97, 200],
                    [97, 153, 200],
                    [160, 219, 200],
                    [255, 250, 200],
                    [255, 132, 200],
                    [255, 38, 200],
                    [128, 255, 255], // water
                ];
            };

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
            var layer = new GeoRasterLayer({
                minZoom: 6,
                georaster, pixelValuesToColorFn, resolution
            });

            harvestability.clearLayers();
            harvestability.addLayer(layer).addTo(map);
        };
    });
}

var smartWMS = 'https://openwms.fmi.fi/geoserver/Weather/wms?';

var sd20LayerOptions = {
    crs: L.CRS.EPSG4326,
    version: '1.3.0',
    layers: 'temperature-forecast',
    format: 'image/png',
    transparent: 'true',
};
var sd20Layer = L.tileLayer.wms(smartWMS, sd20LayerOptions);
var sd20TimeLayer = L.timeDimension.layer.wms(sd20Layer);

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
});

L.control.layers(null, overlayMaps, { collapsed: false }).addTo(map);

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

var latlonPoint = 'Kajaani';

var dyGraphBOptions = {
    title: latlonPoint,
    titleHeight: 28,
    drawAxesAtZero: false,
    legend: 'always',
    ylabel: "Harvestability Index",
    labels: ["date", "Harvestability Index"],
    labelsDiv: "labels",
    connectSeparatedPoints: true,
    series: {
        "Harvestability Index": { fillGraph: true },
    },
}
var dyGraphOptions = {
    drawAxesAtZero: true,
    axisLineWidth: 0.5,
    legend: 'always',
    ylabel: "Snow",
    labels: ["date", "Snow Height", "Snowfall Accumulation"],
    connectSeparatedPoints: true,
    labelsDiv: "labels",
    series: {
        "Snow Height": { fillGraph: true },
        "Snowfall Accumulation": { fillGraph: true },
    },
    includeZero: true,
}

var dyGraph2Options = {
    legend: 'always',
    ylabel: "Soil Wetness",
    labels: ["date", "Soil Wetness"],
    series: {
        "Soil Wetness (m3/m3)": { fillGraph: true },
    },
    labelsDiv: "labels",
    axes: {
        y: { valueRange: [-0.1, 1.1] },
    }
}
var perturbations = 50;
var seriesobj = { "Ground Temperature": { fillGraph: true } };
var labelstxt = "";
var TGKensemble = "";
for (i = 10; i <= perturbations; i = i + 10) {
    label = '"TG ' + i + '"';
    input = "{ fillGraph: true }";
    labelstxt = labelstxt + label + ': { fillGraph: true },';
    TGKensemble = TGKensemble + ",K2C{TG-K:ECSF:5008:14:7:3:" + i + "}";
}

var dyGraphGrdOptions = {
    legend: 'always',
    ylabel: "Ground Temperature (°C)",
    labels: ["date", "Ground Temperature", "Ground Temperature1", "Ground Temperature2", "Ground Temperature3", "Ground Temperature4", "Ground Temperature5",],
    series: { "Ground Temperature": { fillGraph: true }, "Ground Temperature1": { fillGraph: true }, "Ground Temperature2": { fillGraph: true }, "Ground Temperature3": { fillGraph: true }, "Ground Temperature4": { fillGraph: true }, "Ground Temperature5": { fillGraph: true } },
    labelsDiv: "labels"
}

var popup = L.popup();

function onMapClick(e) {
    latlon = e.latlng.toString();
    latlonTitle = latlon.substring(7, latlon.length - 1);

    latlonPoint = latlon.replace(" ", "").substring(7, latlon.length - 2);
    dyGraphBOptions.title = latlonTitle;
    gB = new Dygraph(
        document.getElementById("graphB"),
        "https://sm.harvesterseasons.com/timeseries?latlon=" + latlonPoint + "&param=utctime,HARVIDX{280;TG-K:ECSF:5008:14:7:3:1-50;TG-K:ECSF:5008:14:7:1:0}&starttime=data&endtime=data&timestep=data&timeformat=sql&separator=,&source=grid",
        dyGraphBOptions
    );

    g = new Dygraph(
        document.getElementById("graph"),
        "https://sm.harvesterseasons.com/timeseries?latlon=" + latlonPoint + "&param=utctime,HSNOW-M:ECSF:5008:1:0:1:0,SNACC-KGM2:ECSF:5008:1:0:1:0&starttime=data&endtime=data&timestep=data&timeformat=sql&separator=,&source=grid",
        dyGraphOptions
    );
    gsd = new Dygraph(
        document.getElementById("graphsd"),
        "https://sm.harvesterseasons.com/timeseries?latlon=" + latlonPoint + "&param=utctime,SOILWET-M3M3:ECSF:5008:14:7:1:0&starttime=data&endtime=data&timestep=data&timeformat=sql&separator=,&source=grid", dyGraph2Options
    );
    grd = new Dygraph(
        document.getElementById("graphgrd"),
        "https://sm.harvesterseasons.com/timeseries?latlon=" + latlonPoint + "&param=utctime,K2C{TG-K:ECSF:5008:14:7:1:0}" + TGKensemble + "&starttime=data&endtime=data&timestep=data&timeformat=sql&separator=,&source=grid", dyGraphGrdOptions
    );
    popup
        .setLatLng(e.latlng)
        .setContent("Graphed point: " + latlonTitle)
        .openOn(map);
}

function onLocationFound(e) {
    if (georastercache) { plotgeotiff(); };
    lc.stop();

    latlon = e.latlng.toString();
    latlonTitle = latlon.substring(7, latlon.length - 1);
    latlonPoint = latlon.replace(" ", "").substring(7, latlon.length - 2);
    dyGraphBOptions.title = latlonTitle;
    perturbations = 50;
    if (latlonPoint == "Kajaani") { latlonPoint = "64.22728,27.72846"; }
    gB = new Dygraph(
        document.getElementById("graphB"),
        "https://sm.harvesterseasons.com/timeseries?latlon=" + latlonPoint + "&param=utctime,HARVIDX{280;TG-K:ECSF:5008:14:7:3:1-50;TG-K:ECSF:5008:14:7:1:0}&starttime=data&endtime=data&timestep=data&timeformat=sql&separator=,&source=grid",
        dyGraphBOptions
    );
    g = new Dygraph(
        document.getElementById("graph"),
        "https://sm.harvesterseasons.com/timeseries?latlon=" + latlonPoint + "&param=utctime,HSNOW-M:ECSF:5008:1:0:1:0,SNACC-KGM2:ECSF:5008:1:0:1:0&starttime=data&endtime=data&timestep=data&timeformat=sql&separator=,&source=grid",
        dyGraphOptions
    );
    gsd = new Dygraph(
        document.getElementById("graphsd"),
        "https://sm.harvesterseasons.com/timeseries?latlon=" + latlonPoint + "&param=utctime,SOILWET-M3M3:ECSF:5008:14:7:1:0&starttime=data&endtime=data&timestep=data&timeformat=sql&separator=,&source=grid", dyGraph2Options
    );
    TGKensemble = "";
    for (i = 10; i <= perturbations; i = i + 10) { TGKensemble = TGKensemble + ",K2C{TG-K:ECSF:5008:14:7:3:" + i + "}"; }
    grd = new Dygraph(
        document.getElementById("graphgrd"),
        "https://sm.harvesterseasons.com/timeseries?latlon=" + latlonPoint + "&param=utctime,K2C{TG-K:ECSF:5008:14:7:1:0}" + TGKensemble + "&starttime=data&endtime=data&timestep=data&timeformat=sql&separator=,&source=grid", dyGraphGrdOptions
    );
    popup
        .setLatLng(e.latlng)
        .setContent("Graphed point: " + latlonTitle)
        .openOn(map);
}

function onLocationError(e) {
    latlon = map.getCenter().toString();
    latlonTitle = latlon.substring(7, latlon.length - 1);
    latlonPoint = latlon.replace(" ", "").substring(7, latlon.length - 2);
    dyGraphBOptions.title = latlonTitle;
    perturbations = 50;
    if (latlonPoint == "Kajaani") { latlonPoint = "64.22728,27.72846"; }
    gB = new Dygraph(
        document.getElementById("graphB"),
        "https://sm.harvesterseasons.com/timeseries?latlon=" + latlonPoint + "&param=utctime,HARVIDX{280;TG-K:ECSF:5008:14:7:3:1-50;TG-K:ECSF:5008:14:7:1:0}&starttime=data&endtime=data&timestep=data&timeformat=sql&separator=,&source=grid",
        dyGraphBOptions
    );
    g = new Dygraph(
        document.getElementById("graph"),
        "https://sm.harvesterseasons.com/timeseries?latlon=" + latlonPoint + "&param=utctime,HSNOW-M:ECSF:5008:1:0:1:0,SNACC-KGM2:ECSF:5008:1:0:1:0&starttime=data&endtime=data&timestep=data&timeformat=sql&separator=,&source=grid",
        dyGraphOptions
    );
    gsd = new Dygraph(
        document.getElementById("graphsd"),
        "https://sm.harvesterseasons.com/timeseries?latlon=" + latlonPoint + "&param=utctime,SOILWET-M3M3:ECSF:5008:14:7:1:0&starttime=data&endtime=data&timestep=data&timeformat=sql&separator=,&source=grid", dyGraph2Options
    );
    TGKensemble = "";
    for (i = 10; i <= perturbations; i = i + 10) { TGKensemble = TGKensemble + ",K2C{TG-K:ECSF:5008:14:7:3:" + i + "}"; }
    grd = new Dygraph(
        document.getElementById("graphgrd"),
        "https://sm.harvesterseasons.com/timeseries?latlon=" + latlonPoint + "&param=utctime,K2C{TG-K:ECSF:5008:14:7:1:0}" + TGKensemble + "&starttime=data&endtime=data&timestep=data&timeformat=sql&separator=,&source=grid", dyGraphGrdOptions
    );
}

map.on('click', onMapClick);