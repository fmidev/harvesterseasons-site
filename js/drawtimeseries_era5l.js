function drawtimeseries() {
    // Outside Finland, no SMARTOBS or scaling
    if (!inFinland(lat, lon)) {
        graphLoad = $.getJSON("https://sm.harvesterseasons.com/timeseries?latlon=" + latlonPoint + "&param=" + param1 + "," + param2 + "," + param3 + "," + param4 + "," + param5 + "," + param6 + "," + param7 + "&starttime=" + dateString_timeseries + "&endtime=" + dateString_ecbsf + "&timestep=1440&format=json&source=grid&timeformat=xml&tz=utc",
            function (data) {
                var graphdata = [];
                for (i = 0, k = 0; i < data.length; i++) {
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

                // graphLoad3 = $.get("https://sm.harvesterseasons.com/timeseries?latlon=" + latlonPoint + "&param=utctime,SOILWET1-M:ECBSF::9:7:1:0" + SWensemble + ",SWVL2-M3M3:SMARTMET:5015&starttime=" + dateString_timeseries + "&endtime=" + dateString_ecbsf + "&timestep=1440&timeformat=sql&precision=full&separator=,&source=grid&tz=utc",
                graphLoad3 = $.get("https://sm.harvesterseasons.com/timeseries?latlon=" + latlonPoint + "&param=utctime,SOILWET-M3M3:ECBSF:::7:1:0" + SWensemble + ",SWVL2-M3M3:SMARTMET:5015&starttime=" + dateString_timeseries + "&endtime=" + dateString_ecbsf + "&timestep=1440&timeformat=sql&precision=full&separator=,&source=grid&tz=utc",
                // graphLoad3 = $.get("https://sm.harvesterseasons.com/timeseries?latlon=" + latlonPoint + "&param=utctime,SOILWET-M3M3:ECBSF::9:::0" + SWensemble + ",SWVL2-M3M3:SMARTMET:5015&starttime=" + dateString_timeseries + "&endtime=" + dateString_ecbsf + "&timestep=1440&timeformat=sql&precision=full&separator=,&source=grid&tz=utc",
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
                                gsw.updateOptions({ dateWindow: gsw.xAxisExtremes() })
                            }
                        } else {
                            document.getElementById("graphsw").innerHTML = "Error loading data";
                        }
                    })

                // graphLoad4 = $.get("https://sm.harvesterseasons.com/timeseries?latlon=" + latlonPoint + "&param=utctime,K2C{TSOIL-K:ECBSF::9:7:1:0}" + TGKensemble + ",TG-K:SMARTMET&starttime=" + dateString_timeseries + "&endtime=" + dateString_ecbsf + "&timestep=1440&timeformat=sql&precision=full&separator=,&source=grid&tz=utc",
                // graphLoad4 = $.get("https://sm.harvesterseasons.com/timeseries?latlon=" + latlonPoint + "&param=utctime,K2C{TSOIL-K:ECBSF::9:7:1:0}" + TGKensemble + "&starttime=" + dateString_timeseries + "&endtime=" + dateString_ecbsf + "&timestep=1440&timeformat=sql&precision=full&separator=,&source=grid&tz=utc",
                graphLoad4 = $.get("https://sm.harvesterseasons.com/timeseries?latlon=" + latlonPoint + "&param=utctime,K2C{TSOIL-K:ECBSF:::7:1:0}" + TGKensemble + "&starttime=" + dateString_timeseries + "&endtime=" + dateString_ecbsf + "&timestep=1440&timeformat=sql&precision=full&separator=,&source=grid&tz=utc",
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
                                gsw.updateOptions({ dateWindow: gsw.xAxisExtremes() })
                            }
                        } else {
                            document.getElementById("graphst").innerHTML = "Error loading data";
                            document.getElementById("graphst").style = "line-height: 240px;";
                        }
                    });

                graphLoad2 = $.get("https://sm.harvesterseasons.com/timeseries?latlon=" + latlonPoint + "&param=utctime," + SHensemble + ",SD-M:SMARTMET:5027&starttime=" + dateString_timeseries + "&endtime=" + dateString_ecbsf + "&timestep=1440&timeformat=sql&precision=full&separator=,&source=grid&tz=utc",
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
    } else {
        // Inside Finland, seasonal snow depth combined and scaled with SMARTOBS observations
        // var dataUrl2 = "https://sm.harvesterseasons.com/timeseries?latlon=" + latlonPoint + "&param=" + SHensemble2 + "&starttime=" + dateString_smartobs + "T000000Z&timesteps=1&format=json&precision=full";
        var dataUrl2 = "https://sm.harvesterseasons.com/timeseries?latlon=" + latlonPoint + "&param=utctime," + SHensemble2 + "&starttime=" + dateString_smartobs + "T000000Z&endtime=" + dateString_origintime +  "&timestep=1440&format=json&precision=full&tz=utc&timeformat=xml";
        $.getJSON(dataUrl2, function (data2) {
        // // Temporary fix for missing HSNOW-M:SMARTOBS data
        // var dataUrl2 = "https://sm.harvesterseasons.com/timeseries?latlon=" + latlonPoint + "&param=" + SHensemble2 + "&starttime=20210914T000000Z&timesteps=1&format=json&precision=full";
        // $.getJSON(dataUrl2, function (data2) {

            // Find the latest SMARTOBS value
            let smartobsIdx = -1;

            for (let i = 0; i < data2.length; i++) {
                if (data2[i][SHensemble2list[0]] !== null) {
                    smartobsIdx = i;
                }
            }
            // while (data2[smartobsIdx + 1][SHensemble2list[0]] !== null) {
            //     smartobsIdx++;
            //     // console.debug(smartobsIdx)
            // }



            let smartobsDate = new Date(data2[smartobsIdx]["utctime"]);

            // // Scale seasonal snow forecast using observations
            // var SHensemble3 = "DIFF{SD-M:ECBSF::1:0:1:0;" + data2[0][SHensemble2list[0]] + "}";
            // var SHensemble3ensover = "DIFF{SD-M:ECBSF::1:0:1:0;" + data2[0][SHensemble2list[0]] + "}";
            // var SHensemble3list = ["DIFF{SD-M:ECBSF::1:0:1:0;" + data2[0][SHensemble2list[0]] + "}"];
            // for (i = 1; i <= perturbations; i = i + 1) {
            //     SHensemble3 += ",DIFF{SD-M:ECBSF::1:0:3:" + i + ";" + data2[0][SHensemble2list[i]] + "}";
            //     SHensemble3list[i] = "DIFF{SD-M:ECBSF::1:0:3:" + i + ";" + data2[0][SHensemble2list[i]] + "}";
            //     SHensemble3ensover += ";DIFF{SD-M:ECBSF::1:0:3:" + i + ";" + data2[0][SHensemble2list[i]] + "}";
            // }
            
            // Scale seasonal snow forecast using observations
            var SHensemble3 = "DIFF{SD-M:ECBSF::1:0:1:0;" + data2[smartobsIdx][SHensemble2list[0]] + "}";
            var SHensemble3ensover = "DIFF{SD-M:ECBSF::1:0:1:0;" + data2[smartobsIdx][SHensemble2list[0]] + "}";
            var SHensemble3list = ["DIFF{SD-M:ECBSF::1:0:1:0;" + data2[smartobsIdx][SHensemble2list[0]] + "}"];
            for (i = 1; i <= perturbations; i = i + 1) {
                SHensemble3 += ",DIFF{SD-M:ECBSF::1:0:3:" + i + ";" + data2[smartobsIdx][SHensemble2list[i]] + "}";
                SHensemble3list[i] = "DIFF{SD-M:ECBSF::1:0:3:" + i + ";" + data2[smartobsIdx][SHensemble2list[i]] + "}";
                SHensemble3ensover += ";DIFF{SD-M:ECBSF::1:0:3:" + i + ";" + data2[smartobsIdx][SHensemble2list[i]] + "}";
            }
            var param4ensemble="ensover{0.4;0.9;" + SHensemble3ensover + "}";


            graphLoad = $.getJSON("https://sm.harvesterseasons.com/timeseries?latlon=" + latlonPoint + "&param=" + param1 + "," + param2 + "," + param3 + "," + param4ensemble + "," + param5 + "," + param6 + "," + param7 + "," + param8 + "&starttime=" + dateString_timeseries + "&endtime=" + dateString_ecbsf + "&timestep=1440&format=json&source=grid&timeformat=xml&tz=utc",
                function (data) {
                    var graphdata = [];
                    for (i = 0, k = 0; i < data.length; i++) {
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

                    // graphLoad3 = $.get("https://sm.harvesterseasons.com/timeseries?latlon=" + latlonPoint + "&param=utctime,SOILWET1-M:ECBSF::9:7:1:0" + SWensemble + ",SWVL2-M3M3:SMARTMET:5015&starttime=" + dateString_timeseries + "&endtime=" + dateString_ecbsf + "&timestep=1440&timeformat=sql&precision=full&separator=,&source=grid&tz=utc",
                    graphLoad3 = $.get("https://sm.harvesterseasons.com/timeseries?latlon=" + latlonPoint + "&param=utctime,SOILWET-M3M3:ECBSF:::7:1:0" + SWensemble + ",SWVL2-M3M3:SMARTMET:5015&starttime=" + dateString_timeseries + "&endtime=" + dateString_ecbsf + "&timestep=1440&timeformat=sql&precision=full&separator=,&source=grid&tz=utc",
                    // graphLoad3 = $.get("https://sm.harvesterseasons.com/timeseries?latlon=" + latlonPoint + "&param=utctime,SOILWET-M3M3:ECBSF::9:::0" + SWensemble + ",SWVL2-M3M3:SMARTMET:5015&starttime=" + dateString_timeseries + "&endtime=" + dateString_ecbsf + "&timestep=1440&timeformat=sql&precision=full&separator=,&source=grid&tz=utc",
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
                                    gsw.updateOptions({ dateWindow: gsw.xAxisExtremes() })
                                }
                            } else {
                                document.getElementById("graphsw").innerHTML = "Error loading data";
                            }
                        });

                    // graphLoad4 = $.get("https://sm.harvesterseasons.com/timeseries?latlon=" + latlonPoint + "&param=utctime,K2C{TSOIL-K:ECBSF::9:7:1:0}" + TGKensemble + ",TG-K:SMARTMET&starttime=" + dateString_timeseries + "&endtime=" + dateString_ecbsf + "&timestep=1440&timeformat=sql&precision=full&separator=,&source=grid&tz=utc&origintime=" + dateString_origintime,
                    // graphLoad4 = $.get("https://sm.harvesterseasons.com/timeseries?latlon=" + latlonPoint + "&param=utctime,K2C{TSOIL-K:ECBSF::9:7:1:0}" + TGKensemble + ",TG-K:SMARTMET&starttime=" + dateString_timeseries + "&endtime=" + dateString_ecbsf + "&timestep=1440&timeformat=sql&precision=full&separator=,&source=grid&tz=utc",
                    // graphLoad4 = $.get("https://sm.harvesterseasons.com/timeseries?latlon=" + latlonPoint + "&param=utctime,K2C{TSOIL-K:ECBSF::9:7:1:0}" + TGKensemble + "&starttime=" + dateString_timeseries + "&endtime=" + dateString_ecbsf + "&timestep=1440&timeformat=sql&precision=full&separator=,&source=grid&tz=utc",
                    graphLoad4 = $.get("https://sm.harvesterseasons.com/timeseries?latlon=" + latlonPoint + "&param=utctime,K2C{TSOIL-K:ECBSF:::7:1:0}" + TGKensemble + "&starttime=" + dateString_timeseries + "&endtime=" + dateString_ecbsf + "&timestep=1440&timeformat=sql&precision=full&separator=,&source=grid&tz=utc",
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
                                    gsw.updateOptions({ dateWindow: gsw.xAxisExtremes() })
                                }
                            } else {
                                document.getElementById("graphst").innerHTML = "Error loading data";
                                document.getElementById("graphst").style = "line-height: 240px;";
                            }
                        });


                    // Version json
                    // graphLoad2 = $.get("https://sm.harvesterseasons.com/timeseries?latlon=" + latlonPoint + "&param=utctime," + SHensemble + "," + SHensemble3 + ",HSNOW-M:SMARTOBS:13:4&starttime=" + dateString_timeseries + "&endtime=202105310000&timestep=1440&timeformat=sql&precision=full&separator=,&source=grid&tz=utc",
                    graphLoad2 = $.get("https://sm.harvesterseasons.com/timeseries?latlon=" + latlonPoint + "&param=utctime," + SHensemble + "," + SHensemble3 + ",HSNOW-M:SMARTOBS:13:4&starttime=" + dateString_timeseries + "&endtime=" + dateString_ecbsf + "&timestep=1440&timeformat=xml&precision=full&source=grid&tz=utc&format=json",
                        function (data) {
                            if (data.length > 0) {

                                var data3 = [];
                                for (k = 0; k < data.length; k++) {
                                    // console.debug(data[k]["utctime"])
                                    data3[k] = [];
                                    data3[k][0] = new Date(data[k]["utctime"]);
                                    for (i = 1; i <= perturbations + 1; i = i + 1) {
                                        // if (data3[k][0] < startDate_smartobs - 24 * 60 * 60000) {
                                        //     // Remove seasonal forecast before startDate_smartobs-1day
                                        if (data3[k][0] < smartobsDate) {
                                            // Remove seasonal forecast before smartobsDate
                                            data3[k][i] = "nan";
                                        } else if (data[k][SHensemblelist[i]] == 0 || data[k][SHensemble3list[i]] < 0) {
                                            // Set SD to 0 if non-scaled SD is 0 or scaled < 0
                                            data3[k][i] = 0;
                                        } else {
                                            data3[k][i] = data[k][SHensemble3list[i]];
                                        }
                                    }
                                    data3[k][perturbations + 2] = data[k]["HSNOW-M:SMARTOBS:13:4"];
                                }

                                gsh = new Dygraph(
                                    document.getElementById("graphsh"),
                                    data3,
                                    dyGraphSHOptions
                                );
                                if (typeof gsw !== 'undefined' && typeof gst !== 'undefined' && typeof gsh !== 'undefined') {
                                    var sync = Dygraph.synchronize(gsw, gst, gsh, {
                                        selection: false,
                                        zoom: true,
                                        range: false
                                    });
                                    gsw.updateOptions({ dateWindow: gsw.xAxisExtremes() })
                                }
                            } else {
                                document.getElementById("graphsh").innerHTML = "Error loading data";
                                document.getElementById("graphsh").style = "line-height: 240px;";
                            }
                        });
            });
        });
    }
}

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