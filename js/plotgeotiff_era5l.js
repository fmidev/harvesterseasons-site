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

        // if (typeof geotiffSmartobsDate == 'undefined'
        //     || typeof geotiffSmartmetDate == 'undefined') {
        
        if (typeof geotiffSmartobsDate == 'undefined') {

            // // Find the latest EDTE and SMARTOBS values
            let smartobsUrl = "https://desm.harvesterseasons.com/timeseries?latlon=" + latlonPoint + "&param=utctime,HSNOW-M:SMARTOBS:13:4,SWI2-0TO1:EDTE:5068&starttime=" + dateString_smartobs + "T000000Z&endtime=" + dateString_smartmet + "&timestep=1440&format=json&precision=full&tz=utc&timeformat=xml";
            $.getJSON(smartobsUrl, function (smartobsData) {

                // // Find the latest EDTE value
                // let geotiffSmartmetIdx = -1;

                // for (let i = 0; i < smartobsData.length; i++) {
                //     if (smartobsData[i]["SWI2-0TO1:EDTE:5068"] !== null) {
                //         geotiffSmartmetIdx = i;
                //     }
                // }

                // geotiffSmartmetDate = smartobsData[geotiffSmartmetIdx]["utctime"].substr(0, 10).replace(/-/g, "");

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

    // Inside Finland (where SMARTOBS data available), seasonal snow depth is combined and scaled with SMARTOBS observations
    // Snow depth at the SMARTOBS scaling point
    let dataUrl3 = "https://desm.harvesterseasons.com/timeseries?latlon=" + latlonPoint + "&param=" + SHensemble2 + "&starttime=" + geotiffSmartobsDate + "T000000Z&timesteps=1&format=json&precision=full";
    $.getJSON(dataUrl3, function (data2) {

        // Scale seasonal snow forecast using SMARTOBS observations
        let SHensemble3ensover = "DIFF{HSNOW-M:ECBSF::1:0:1:0;" + data2[0][SHensemble2list[0]] + "}";
        for (i = 1; i <= perturbations; i = i + 1) {
            SHensemble3ensover += ";DIFF{HSNOW-M:ECBSF::1:0:3:" + i + ";" + data2[0][SHensemble2list[i]] + "}";
        }

        let param_ecbsf_hsnow_ensemble = "ensover{0.4;0.9;" + SHensemble3ensover + "}";

        // HSNOW-M:SMARTOBS (param_smartobs_hsnow) and HSNOW-M:SMARTMET (param_smartmet_hsnow)
        let dataUrl2 = "https://desm.harvesterseasons.com/timeseries?latlon=" + latlonPoint + "&param=" + param_utctime + "," + param_ecxsf_swi2 + "," + param_ecbsf_tsoil + "," + param_ecbsf_hsnow_ensemble + "," + param_swi_swi2 + "," + param_smartobs_hsnow + "&starttime=" + dataYear + dataMonth + dataDay + "T000000Z&timesteps=1&format=json";

        // const param_ecxsf_swi2 = "HARVIDX{0.69;SWI2-0TO1:ECXSF:5062:1:0:0:0-50}";
        // const param_ecbsf_tsoil = "HARVIDX{273;TSOIL-K:ECBSF:::7:3:1-50;TSOIL-K:ECBSF:::7:1:0}";
        // const param_ecbsf_hsnow = "ensover{0.4;0.9;HSNOW-M:ECBSF::1:0:3:1-50;HSNOW-M:ECBSF::1:0:1:0}";
        // const param_swi_swi2 = "HARVIDX{0.69;SWI2-0TO1:EDTE:5068}";
        // const param_smartmet_hsnow = "ensover{0.4;0.9;HSNOW-M:SMARTMET:5027}";
        // const param_smartobs_hsnow = "ensover{0.4;0.9;HSNOW-M:SMARTOBS:13:4}";

        $.getJSON(dataUrl2, function (data) {

            // Use EDTE when available            
            if (data[0][param_swi_swi2] !== null) {
                idxSummer = data[0][param_swi_swi2];
            } else {
                idxSummer = data[0][param_ecxsf_swi2];
                // idxSummer = summer1;
            }

            // // Use SMARTOBS (param_smartobs_hsnow) and SMARTMET (param_smartmet_hsnow)
            if (data[0][param_smartobs_hsnow] !== null) {
                idxWinter = Math.max(data[0][param_ecbsf_tsoil], data[0][param_smartobs_hsnow]);
            // } else if (data[0][param_smartmet_hsnow] !== null) {
            //     idxWinter = Math.max(data[0][param_ecbsf_tsoil], data[0][param_smartmet_hsnow]);
            } else {
                idxWinter = Math.max(data[0][param_ecbsf_tsoil], data[0][param_ecbsf_hsnow_ensemble]);
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
};