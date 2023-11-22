function drawtimeseries() {

    graphLoad = $.get("https://desm.harvesterseasons.com/timeseries?latlon=" + latlonPoint + "&param=utctime,RR-M:ECXB2SF:5054:1:0:1:0" + SWensemble2 + "&starttime=" + dateString_timeseries + "&endtime=" + dateString_ecbsf + "&timestep=1440&timeformat=sql&precision=full&separator=,&source=grid&tz=utc",
        function (data) {
            if (data.length > 0) {
                grr = new Dygraph(
                    document.getElementById("graphrr"),
                    data,
                    dyGraphRROptions
                );
                document.getElementById("graphsw").style = "line-height: 1;";
                if (typeof grr !== 'undefined' && typeof gsw !== 'undefined' && typeof gst !== 'undefined' && typeof gsh !== 'undefined') {
                    var sync = Dygraph.synchronize(grr, gsw, gst, gsh, {
                        selection: false,
                        zoom: true,
                        range: false
                    });
                    //gB_ecsf.updateOptions({dateWindow: gB_ecbsf.xAxisExtremes()})
                    grr.updateOptions({ dateWindow: grr.xAxisExtremes() })
                }
            } else {
                document.getElementById("graphrr").innerHTML = "Error loading data";
            }
        })

    // graphLoad3 = $.get("https://desm.harvesterseasons.com/timeseries?latlon=" + latlonPoint + "&param=utctime,SOILWET1-M:ECBSF::9:7:1:0" + SWensemble + ",SWVL2-M3M3:SMARTMET:5015&starttime=" + dateString_timeseries + "&endtime=" + dateString_ecbsf + "&timestep=1440&timeformat=sql&precision=full&separator=,&source=grid&tz=utc",
    graphLoad3 = $.get("https://desm.harvesterseasons.com/timeseries?latlon=" + latlonPoint + "&param=utctime,RR-M:ECBSF:5022:1:0:1:0" + SWensemble + "&starttime=" + dateString_timeseries + "&endtime=" + dateString_ecbsf + "&timestep=1440&timeformat=sql&precision=full&separator=,&source=grid&tz=utc",
        function (data) {
            if (data.length > 0) {
                gsw = new Dygraph(
                    document.getElementById("graphsw"),
                    data,
                    dyGraphSWOptions
                );
                document.getElementById("graphsw").style = "line-height: 1;";
                if (typeof grr !== 'undefined' && typeof gsw !== 'undefined' && typeof gst !== 'undefined' && typeof gsh !== 'undefined') {
                    var sync = Dygraph.synchronize(grr, gsw, gst, gsh, {
                        selection: false,
                        zoom: true,
                        range: false
                    });
                    //gB_ecsf.updateOptions({dateWindow: gB_ecbsf.xAxisExtremes()})
                    gsw.updateOptions({ dateWindow: gsw.xAxisExtremes() })
                }
            } else {
                document.getElementById("graphsw").innerHTML = "Error loading data";
            }
        })

    // graphLoad4 = $.get("https://desm.harvesterseasons.com/timeseries?latlon=" + latlonPoint + "&param=utctime,K2C{TSOIL-K:ECBSF::9:7:1:0}" + TGKensemble + ",TG-K:SMARTMET&starttime=" + dateString_timeseries + "&endtime=" + dateString_ecbsf + "&timestep=1440&timeformat=sql&precision=full&separator=,&source=grid&tz=utc",
    // graphLoad4 = $.get("https://desm.harvesterseasons.com/timeseries?latlon=" + latlonPoint + "&param=utctime,K2C{TSOIL-K:ECBSF::9:7:1:0}" + TGKensemble + "&starttime=" + dateString_timeseries + "&endtime=" + dateString_ecbsf + "&timestep=1440&timeformat=sql&precision=full&separator=,&source=grid&tz=utc",
    graphLoad4 = $.get("https://desm.harvesterseasons.com/timeseries?latlon=" + latlonPoint + "&param=utctime,K2C{T2-K:ECBSF:5022:1:0:1:0}" + TGKensemble + "&starttime=" + dateString_timeseries + "&endtime=" + dateString_ecbsf + "&timestep=1440&timeformat=sql&precision=full&separator=,&source=grid&tz=utc",
        function (data) {
            if (data.length > 0) {
                gst = new Dygraph(
                    document.getElementById("graphst"),
                    data,
                    dyGraphSTOptions
                );
                if (typeof grr !== 'undefined' && typeof gsw !== 'undefined' && typeof gst !== 'undefined' && typeof gsh !== 'undefined') {
                    var sync = Dygraph.synchronize(grr, gsw, gst, gsh, {
                        selection: false,
                        zoom: true,
                        range: false
                    });
                    //gB_ecsf.updateOptions({dateWindow: gB_ecbsf.xAxisExtremes()})
                    gsw.updateOptions({ dateWindow: gsw.xAxisExtremes() })
                }
            } else {
                document.getElementById("graphst").innerHTML = "Error loading data";
                document.getElementById("graphst").style = "line-height: 240px;";
            }
        });

    graphLoad2 = $.get("https://desm.harvesterseasons.com/timeseries?latlon=" + latlonPoint + "&param=utctime," + SHensemble + "&starttime=" + dateString_timeseries + "&endtime=" + dateString_ecbsf + "&timestep=1440&timeformat=sql&precision=full&separator=,&source=grid&tz=utc",
        function (data) {
            if (data.length > 0) {
                gsh = new Dygraph(
                    document.getElementById("graphsh"),
                    data,
                    dyGraphSHOptions
                );
                if (typeof grr !== 'undefined' && typeof gsw !== 'undefined' && typeof gst !== 'undefined' && typeof gsh !== 'undefined') {
                    var sync = Dygraph.synchronize(grr, gsw, gst, gsh, {
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
}

function inFinland(lat, lon) {

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