function plotgeotiff() {
    //console.debug(idx)
    //console.debug(harvDynamic.checked)
    //console.debug(marker.getLatLng())
    //console.debug(map.getBounds().contains(marker.getLatLng()))

    if (harvDynamic.checked) {
        if (marker.getLatLng() !== null && map.getBounds().contains(marker.getLatLng())) {
            latlon = marker.getLatLng().toString();
            lat = marker.getLatLng().lat;
            lon = marker.getLatLng().lng;
        }
        else {
            latlon = map.getCenter().toString();
            lat = map.getCenter().lat;
            lon = map.getCenter().lng;
        }
        latlonPoint = latlon.replace(" ", "").substring(7, latlon.length - 2);

        // console.debug(latlon)
        // console.debug(lat)
        // console.debug(lon)

        var dataYear = sliderDate.getUTCFullYear();
        var dataMonth = sliderDate.getUTCMonth() + 1;
        var dataDay = sliderDate.getUTCDate();
        if (dataMonth < 10) {
            dataMonth = '0' + dataMonth;
        }
        if (dataDay < 10) {
            dataDay = '0' + dataDay;
        }

        // Inside Finland (where SMARTOBS data available), seasonal snow depth is combined and scaled with SMARTOBS observations

        var dataUrl3 = "https://sm.harvesterseasons.com/timeseries?latlon=" + latlonPoint + "&param=" + SHensemble2 + "&starttime=" + dateString_smartobs + "T000000Z&timesteps=1&format=json&precision=full";
        $.getJSON(dataUrl3, function (data2) {

            // Scale seasonal snow forecast using observations
            var SHensemble3ensover = "DIFF{SD-M:ECB2SF::1:0:1:0;" + data2[0][SHensemble2list[0]] + "}";
            for (i = 1; i <= perturbations; i = i + 1) {
                SHensemble3ensover += ";DIFF{SD-M:ECB2SF::1:0:3:" + i + ";" + data2[0][SHensemble2list[i]] + "}";
            }

            var param4ensemble = "ensover{0.4;0.9;" + SHensemble3ensover + "}";

            // // No scaling
            // dataUrl2 = "https://sm.harvesterseasons.com/timeseries?latlon=" + latlonPoint + "&param=" + param2 + "," + param3 + "," + param4 + "&origintime=" + dataYear + dataMonth + dataDay + "T000000Z&starttime=" + dataYear + dataMonth + dataDay + "T000000Z&timesteps=1&format=json";
            // dataUrl2 = "https://sm.harvesterseasons.com/timeseries?latlon=" + latlonPoint + "&param=" + param2 + "," + param3 + "," + param4 + "," + param5 + "," + param6 + "," + param7 + "&origintime=" + dataYear + dataMonth + dataDay + "T000000Z&starttime=" + dataYear + dataMonth + dataDay + "T000000Z&timesteps=1&format=json";

            // // SMARTOBS scaling 
            // dataUrl2 = "https://sm.harvesterseasons.com/timeseries?latlon=" + latlonPoint + "&param=" + param1 + "," + param2 + "," + param3 + "," + param4ensemble + "," + param5 + "," + param6 + "," + param7 + "," + param8 + "&starttime=" + dateString_timeseries + "&endtime=" + dateString_ecbsf + "&timestep=1440&format=json&source=grid&timeformat=xml&tz=utc";
            // dataUrl2 = "https://sm.harvesterseasons.com/timeseries?latlon=" + latlonPoint + "&param=" + param1 + "," + param2 + "," + param3 + "," + param4ensemble + "," + param5 + "," + param6 + "," + param7 + "&origintime=" + dataYear + dataMonth + dataDay + "T000000Z&starttime=" + dataYear + dataMonth + dataDay + "T000000Z&timesteps=1&format=json";
            var dataUrl2 = "https://sm.harvesterseasons.com/timeseries?latlon=" + latlonPoint + "&param=" + param1 + "," + param2 + "," + param3 + "," + param4ensemble + "," + param5 + "," + param6 + "," + param7 + "&starttime=" + dataYear + dataMonth + dataDay + "T000000Z&timesteps=1&format=json";

            $.getJSON(dataUrl2, function (data) {

                // Use SMARTMET when available            
                if (data[0][param5] !== null) {
                    idxSummer = data[0][param5];
                } else {
                    idxSummer = data[0][param2];
                }
                // if (data[0][param6] !== null || data[0][param7] !== null) {
                //     idxWinter = Math.max(data[0][param6], data[0][param7]);
                if (data[0][param7] !== null) {
                    idxWinter = data[0][param7];
                } else {
                    idxWinter = Math.max(data[0][param3], data[0][param4ensemble]);
                }

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
                                // return `rgba(${colorMap[r][0]},${colorMap[r][1]},${colorMap[r][2]},.7)`;
                                return `rgba(${colorMap[r][0]},${colorMap[r][1]},${colorMap[r][2]},${opacity/100})`;
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
                        zIndex: 10,
                        debugLevel: 0,
                    }).addTo(map);
                };
            });
        });
        // }
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
                // return `rgba(${colorMap[r][0]},${colorMap[r][1]},${colorMap[r][2]},.7)`;
                return `rgba(${colorMap[r][0]},${colorMap[r][1]},${colorMap[r][2]},${opacity/100})`;
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
        zIndex: 10,
        debugLevel: 0,
    }).addTo(map);

    }
}

function plotgeotiffstatic() {

    if (!map.hasLayer(harvStaticLayer)) {

        var colorMap = colorMap1;

        const georaster = georastercache;
        const { noDataValue } = georaster;

        var pixelValuesToColorFn = values => {
            if (values.some(value => value === noDataValue)) {
                return 'rgba(0,0,0,0.0)';
            } else {
                const [r] = values;
                if (r < 7) {
                    // return `rgba(${colorMap[r][0]},${colorMap[r][1]},${colorMap[r][2]},.7)`;
                    return `rgba(${colorMap[r][0]},${colorMap[r][1]},${colorMap[r][2]},${opacity/100})`;
                } else {
                    return 'rgba(0,0,0,0.0)';
                }
            }
        };
        const resolution = 64;
        harvStaticLayer = new GeoRasterLayer({
            minZoom: 10,
            maxZoom: 12,
            georaster, pixelValuesToColorFn, resolution,
            zIndex: 10,
            debugLevel: 0,
        }).addTo(map);
    }
}