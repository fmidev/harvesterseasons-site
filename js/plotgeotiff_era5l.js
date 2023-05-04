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

        // console.debug(geotiffSmartobsDate)

        if (typeof geotiffSmartobsDate == 'undefined'
            || typeof geotiffSmartmetDate == 'undefined') {

            // // Find the latest SMARTMET and SMARTOBS values
            let smartobsUrl = "https://desm.harvesterseasons.com/timeseries?latlon=" + latlonPoint + "&param=utctime,HSNOW-M:SMARTOBS:13:4,SWVL2-M3M3:SMARTMET:5015&starttime=" + dateString_smartobs + "T000000Z&endtime=" + dateString_smartmet + "&timestep=1440&format=json&precision=full&tz=utc&timeformat=xml";
            $.getJSON(smartobsUrl, function (smartobsData) {

                // Find the latest SMARTMET value
                let geotiffSmartmetIdx = -1;

                for (let i = 0; i < smartobsData.length; i++) {
                    if (smartobsData[i]["SWVL2-M3M3:SMARTMET:5015"] !== null) {
                        geotiffSmartmetIdx = i;
                    }
                }

                geotiffSmartmetDate = smartobsData[geotiffSmartmetIdx]["utctime"].substr(0, 10).replace(/-/g, "");

                // Find the latest SMARTOBS value
                let geotiffSmartobsIdx = -1;

                for (let i = 0; i < smartobsData.length; i++) {
                    if (smartobsData[i]["HSNOW-M:SMARTOBS:13:4"] !== null) {
                        geotiffSmartobsIdx = i;
                    }
                }

                geotiffSmartobsDate = smartobsData[geotiffSmartobsIdx]["utctime"].substr(0, 10).replace(/-/g, "");

                // console.debug(geotiffSmartmetDate)
                // console.debug(geotiffSmartobsDate)

                plotgeotiff_scaling();
            });
        } else {
            plotgeotiff_scaling();
        }

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
                    return `rgba(${colorMap[r][0]},${colorMap[r][1]},${colorMap[r][2]},${opacity / 100})`;
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
                    return `rgba(${colorMap[r][0]},${colorMap[r][1]},${colorMap[r][2]},${opacity / 100})`;
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

function plotgeotiff_scaling() {

    var dataYear = sliderDate.getUTCFullYear();
    var dataMonth = sliderDate.getUTCMonth() + 1;
    var dataDay = sliderDate.getUTCDate();
    if (dataMonth < 10) {
        dataMonth = '0' + dataMonth;
    }
    if (dataDay < 10) {
        dataDay = '0' + dataDay;
    }

    // Soil wetness at the SMARTMET scaling point
    let dataUrlSWgeotiff = "https://desm.harvesterseasons.com/timeseries?latlon=" + latlonPoint + "&param=" + SWensemble2 + "&starttime=" + geotiffSmartmetDate + "T000000Z&timesteps=1&format=json&precision=full";
    $.getJSON(dataUrlSWgeotiff, function (dataSWgeotiff) {
        // console.debug(dataSWgeotiff)

        // // Scale seasonal soil wetness forecast using SMARTMET forecast
        // let SWensemble3geotiff = "DIFF{SOILWET-M3M3:ECBSF:::7:1:0;" + dataSWgeotiff[0][SWensemble2list[0]] + "}";
        // let SWensemble3list = ["DIFF{SOILWET-M3M3:ECBSF:::7:1:0;" + dataSWgeotiff[0][SWensemble2list[0]] + "}"];
        // for (i = 1; i <= perturbations; i = i + 1) {
        //     SWensemble3geotiff += ",DIFF{SOILWET-M3M3:ECBSF:::7:3:" + i + ";" + dataSWgeotiff[0][SWensemble2list[i]] + "}";
        //     SWensemble3list[i] = "DIFF{SOILWET-M3M3:ECBSF:::7:3:" + i + ";" + dataSWgeotiff[0][SWensemble2list[i]] + "}";
        // }
        // // console.debug(SWensemble3geotiff)

        // Scale seasonal soil wetness forecast using SMARTMET forecast
        let SWensemble3geotiff = "DIFF{VSW-M3M3:ECBSF:5022:9:7:0:0;" + dataSWgeotiff[0][SWensemble2list[0]] + "}";
        let SWensemble3list = ["DIFF{VSW-M3M3:ECBSF:5022:9:7:0:0;" + dataSWgeotiff[0][SWensemble2list[0]] + "}"];
        for (i = 1; i <= perturbations; i = i + 1) {
            SWensemble3geotiff += ",DIFF{VSW-M3M3:ECBSF:5022:9:7:0:" + i + ";" + dataSWgeotiff[0][SWensemble2list[i]] + "}";
            SWensemble3list[i] = "DIFF{VSW-M3M3:ECBSF:5022:9:7:0:" + i + ";" + dataSWgeotiff[0][SWensemble2list[i]] + "}";
        }
        // console.debug(SWensemble3geotiff)
        
        // Inside Finland (where SMARTOBS data available), seasonal snow depth is combined and scaled with SMARTOBS observations
        // Snow depth at the SMARTOBS scaling point
        let dataUrl3 = "https://desm.harvesterseasons.com/timeseries?latlon=" + latlonPoint + "&param=" + SHensemble2 + "&starttime=" + geotiffSmartobsDate + "T000000Z&timesteps=1&format=json&precision=full";
        $.getJSON(dataUrl3, function (data2) {

            // Scale seasonal snow forecast using SMARTOBS observations
            let SHensemble3ensover = "DIFF{HSNOW-M:ECBSF::1:0:1:0;" + data2[0][SHensemble2list[0]] + "}";
            for (i = 1; i <= perturbations; i = i + 1) {
                SHensemble3ensover += ";DIFF{HSNOW-M:ECBSF::1:0:3:" + i + ";" + data2[0][SHensemble2list[i]] + "}";
            }

            let param4ensemble = "ensover{0.4;0.9;" + SHensemble3ensover + "}";

            // Soil wetness at the current time (sliderDate)
            $.getJSON("https://desm.harvesterseasons.com/timeseries?latlon=" + latlonPoint + "&param=utctime,SWVL2-M3M3:SMARTMET:5015," + SWensemble3geotiff + "&starttime=" + dataYear + dataMonth + dataDay + "T000000Z&timesteps=1&format=json&precision=full",
                function (dataSWensemble) {

                    // console.debug(dataSWensemble)

                    // // Seasonal summer index
                    // let summer1series = [];
                    let summer1;

                    // // harvidx(0.4)
                    if (dataSWensemble[0]["SWVL2-M3M3:SMARTMET:5015"] !== null
                        || dataSWensemble[0][SWensemble3list[0]] == null) {
                        summer1 = 'nan';
                        // console.debug(dataSWensemble[0]["SWVL2-M3M3:SMARTMET:5015"])
                        // console.debug(dataSWensemble[0][SWensemble3list[0]])
                        // console.debug(SWensemble3list[0])

                    } else {
                        let nans = agree = disagree = count = 0;
                        let threshold = 0.4;
                        for (i = 0; i <= perturbations; i++) {
                            let value = dataSWensemble[0][SWensemble3list[i]];
                            if (isNaN(value)) { nans++ }
                            else if (value < threshold) { agree++; count++; }
                            else { disagree++; count++; }
                        }
                        if (count < nans) { summer1 = 'nan'; }
                        else if (agree / count >= 0.9) { summer1 = 2; }
                        else if (agree / count <= 0.1) { summer1 = 0; }
                        else { summer1 = 1; }
                    }
                    // console.debug(summer1)

                    // // SMARTOBS scaling 
                    // let dataUrl2 = "https://desm.harvesterseasons.com/timeseries?latlon=" + latlonPoint + "&param=" + param1 + "," + param2 + "," + param3 + "," + param4ensemble + "," + param5 + "," + param6 + "," + param7 + "&starttime=" + dataYear + dataMonth + dataDay + "T000000Z&timesteps=1&format=json";

                    // HSNOW-M:SMARTOBS (param8) instead of SD-M:SMARTMET (param7)
                    let dataUrl2 = "https://desm.harvesterseasons.com/timeseries?latlon=" + latlonPoint + "&param=" + param1 + "," + param2 + "," + param3 + "," + param4ensemble + "," + param5 + "," + param6 + "," + param8 + "&starttime=" + dataYear + dataMonth + dataDay + "T000000Z&timesteps=1&format=json";

                    // // const param2="HARVIDX{0.4;SOILWET-M3M3:ECBSF:::7:3:1-50;SOILWET-M3M3:ECBSF:::7:1:0}";
                    // const param2="HARVIDX{0.4;VSW-M3M3:ECBSF:5022:9:7:0:1-50;VSW-M3M3:ECBSF:5022:9:7:0:0}";
                    // const param3 = "HARVIDX{273;TSOIL-K:ECBSF:::7:3:1-50;TSOIL-K:ECBSF:::7:1:0}";
                    // const param4 = "ensover{0.4;0.9;HSNOW-M:ECBSF::1:0:3:1-50;HSNOW-M:ECBSF::1:0:1:0}";
                    // const param5 = "HARVIDX{0.4;SWVL2-M3M3:SMARTMET:5015}";
                    // const param6 = "HARVIDX{-0.7;STL1-K:SMARTMET}";
                    // const param7 = "ensover{0.4;0.9;SD-M:SMARTMET:5027}";
                    // const param8 = "ensover{0.4;0.9;HSNOW-M:SMARTOBS:13:4}";

                    $.getJSON(dataUrl2, function (data) {

                        // Use SMARTMET when available            
                        if (data[0][param5] !== null) {
                            idxSummer = data[0][param5];
                        } else {
                            // idxSummer = data[0][param2];
                            idxSummer = summer1;
                        }
                        // if (data[0][param6] !== null || data[0][param7] !== null) {
                        //     idxWinter = Math.max(data[0][param6], data[0][param7]);
                        // if (data[0][param7] !== null) {
                        //     // idxWinter = data[0][param7];
                        //     idxWinter = Math.max(data[0][param3], data[0][param7]);
                        // // Use SMARTOBS (param8) instead of SMARTMET (param7) to match time series (when SMARTMET is not available)
                        if (data[0][param8] !== null) {
                            idxWinter = Math.max(data[0][param3], data[0][param8]);
                        } else {
                            idxWinter = Math.max(data[0][param3], data[0][param4ensemble]);
                        }

                        if (idxWinter == 2) { idx2 = 3 }
                        else if (idxSummer == 2) { idx2 = 2 }
                        else if (idxSummer == 0 && idxWinter == 0) { idx2 = 0 }
                        else { idx2 = 1 }


                        // console.debug(idxSummer, idxWinter)

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
                                        return `rgba(${colorMap[r][0]},${colorMap[r][1]},${colorMap[r][2]},${opacity / 100})`;
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
        });
    });

}