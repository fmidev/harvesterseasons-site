function drawtimeseries() {
    // Inside Finland, seasonal snow depth and soil wetness combined and scaled with SMARTOBS/SMARTMET observations

    // Fetch soil wetness data
    var dataUrlSW = "https://desm.harvesterseasons.com/timeseries?latlon=" + latlonPoint + "&param=utctime,SWI2-0TO1:SWI:5059,SWVL2-M3M3:SMARTMET:5015" + SWensemble + "&starttime=" + dateString_timeseries + "&endtime=" + dateString_ecbsf + "&timestep=1440&format=json&precision=full&source=grid&timeformat=sql&tz=utc";
    $.getJSON(dataUrlSW, function (dataSW) {

        // Find the latest SWVL2-M3M3:SMARTMET value
        let smartmetIdx = -1;

        for (let i = 0; i < dataSW.length; i++) {
            if (dataSW[i]["SWVL2-M3M3:SMARTMET:5015"] !== null) {
                smartmetIdx = i;
            }
        }

        if (smartmetIdx == -1) {
            drawOutsideFinland()
        } else {

            // // Fix soilwetnessDay for the WMS-layers using smartmetIdx

            let smartmetIdxDateYear = dataSW[smartmetIdx]["utctime"].substr(0, 4);
            let smartmetIdxDateMonth = dataSW[smartmetIdx]["utctime"].substr(5, 2);
            let smartmetIdxDateDay = dataSW[smartmetIdx]["utctime"].substr(8, 2);

            let smartmetIdxDate = new Date(Date.UTC(smartmetIdxDateYear, smartmetIdxDateMonth - 1, smartmetIdxDateDay));

            if (smartmetIdxDate.getTime() !== soilwetnessDate.getTime()) {
                soilwetnessDate = smartmetIdxDate;
            }

            // let smartmetDate = new Date(dataSW[smartmetIdx]["utctime"]);
            // Date format that works also in mobile safari
            // let smartmetDate = new Date(dataSW[smartmetIdx]["utctime"].replace(/-/g, "/"));

            // // Scale seasonal soil wetness using SMARTMET-forecast
            // let dataSWscaled = [];
            // // dataSWscaled = scalingFunction(dataSW, SWensemblelist, smartmetIdx, perturbations, "SWVL2-M3M3:SMARTMET:5015");
            // dataSWscaled = dataSW;


            // Fetch snow depth data
            var dataUrlSH = "https://desm.harvesterseasons.com/timeseries?latlon=" + latlonPoint + "&param=utctime,HSNOW-M:SMARTOBS:13:4,HSNOW-M:SMARTMET:5027," + SHensemble + "&starttime=" + dateString_timeseries + "&endtime=" + dateString_ecbsf + "&timestep=1440&format=json&precision=full&source=grid&timeformat=sql&tz=utc";
            $.getJSON(dataUrlSH, function (dataSH) {

                // Find the latest HSNOW-M:SMARTOBS value
                let smartobsIdx = -1;

                for (let i = 0; i < dataSH.length; i++) {
                    if (dataSH[i]["HSNOW-M:SMARTOBS:13:4"] !== null) {
                        smartobsIdx = i;
                    }
                }

                let smartobsDate = new Date(dataSH[smartobsIdx]["utctime"]);

                // Scale seasonal snow forecast using SMARTOBS-observations
                let dataSHscaled = [];
                dataSHscaled = scalingFunction(dataSH, SHensemblelist, smartobsIdx, perturbations, "HSNOW-M:SMARTOBS:13:4", "HSNOW-M:SMARTMET:5027");


                // // // // Summer index from the scaled seasonal soil wetness
                // let summer1series = [];
                // summer1series = harvidx(0.4, dataSWscaled, SWensemblelist, perturbations, "SWVL2-M3M3:SMARTMET:5015")

                // // // Winter index from the scaled seasonal snow depth
                let winter1series = [];
                winter1series = ensover(0.4, 0.9, dataSHscaled, SHensemblelist, perturbations, "HSNOW-M:SMARTOBS:13:4")

                // const param2 = "HARVIDX{55;SWI2:ECXSF:5062:1:0:0:0-50}";
                // const param3 = "HARVIDX{273;TSOIL-K:ECBSF:::7:3:1-50;TSOIL-K:ECBSF:::7:1:0}";
                // const param5 = "HARVIDX{0.4;SWVL2-M3M3:SMARTMET:5015}";
                // const param7 = "ensover{0.4;0.9;HSNOW-M:SMARTMET:5027}";
                // const param8 = "ensover{0.4;0.9;HSNOW-M:SMARTOBS:13:4}";

                // Fetch rest of the trafficability index series
                graphLoad = $.getJSON("https://desm.harvesterseasons.com/timeseries?latlon=" + latlonPoint + "&param=utctime,SWI2-0TO1:SWI:5059,SWVL2-M3M3:SMARTMET:5015," + param2 + "," + param3 + "," + param5 + "," + param7 + "," + param8 + "&starttime=" + dateString_timeseries + "&endtime=" + dateString_ecbsf + "&timestep=1440&format=json&source=grid&timeformat=xml&tz=utc",
                    function (data) {
                        var graphdata = [];
                        for (i = 0, k = 0; i < data.length; i++) {
                            var summer1, summer2, winter1, winter2;

                            // // Seasonal summer index scaled with observations (VSW-M3M3:ECBSF & SWVL2-M3M3:SMARTMET)
                            // if (summer1series.length == data.length) { summer1 = summer1series[i]; }
                            // else { summer1 = 'nan'; }

                            // Seasonal summer index (SWI2:ECXSF)
                            if (data[i][param2] !== null) { summer1 = data[i][param2]; }
                            else { summer1 = 'nan'; }

                            // Seasonal winter index, combined and scaled with observations (HSNOW-M:ECBSF & HSNOW-M:SMARTOBS, TSOIL-K:ECBSF)                     
                            if (data[i][param8] !== null) { winter1 = Math.max(data[i][param3], data[i][param8]); }
                            else if (data[i][param3] !== null || winter1series[i] !== null && winter1series.length == data.length) 
                                { winter1 = Math.max(data[i][param3], winter1series[i]); }
                            else { winter1 = 'nan'; }
                            
                            // 10 day forecast summer index (SWVL2-M3M3:SMARTMET)                      
                            if (data[i][param5] !== null) { summer2 = data[i][param5]; }
                            else { summer2 = 'nan'; }

                            // // 10 day forecast winter index (HSNOW-M:SMARTOBS, HSNOW-M:SMARTMET, TSOIL-K:ECBSF)                      
                            // First HSNOW-M:SMARTOBS and then HSNOW-M:SMARTMET
                            if (data[i][param8] !== null) { winter2 = Math.max(data[i][param3], data[i][param8]); }
                            else if (data[i][param7] !== null) { winter2 = Math.max(data[i][param3], data[i][param7]); }
                            else { winter2 = 'nan'; }

                            // Combined trafficability index time series
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

                        // // Plot scaled soil wetness time series
                        // var dataSW2 = [];
                        // for (k = 0; k < dataSWscaled.length; k++) {
                        //     dataSW2[k] = [];
                        //     // Date format that works also in mobile safari
                        //     dataSW2[k][0] = new Date(dataSWscaled[k]["utctime"].replace(/-/g, "/"));
                        //     for (i = 0; i <= perturbations; i = i + 1) {
                        //         // Remove seasonal forecast before startDate_smartobs-1day
                        //         if (dataSW2[k][0] < smartmetDate) {
                        //             // Remove seasonal forecast before smartobsDate
                        //             dataSW2[k][i+1] = null;
                        //         } else if (dataSW[k][SWensemblelist[i]] == 0 || dataSWscaled[k][SWensemblelist[i]] < 0) {
                        //             // Set SW to 0 if non-scaled SW is 0 or scaled < 0
                        //             dataSW2[k][i+1] = 0;
                        //         } else {
                        //             dataSW2[k][i+1] = dataSWscaled[k][SWensemblelist[i]];
                        //         }
                        //     }
                        //     dataSW2[k][perturbations + 2] = dataSW[k]["SWVL2-M3M3:SMARTMET:5015"];
                        //     if (dataSW[k]["SWI2-0TO1:SWI:5059"] > 0) {
                        //         dataSW2[k][perturbations + 3] = dataSW[k]["SWI2-0TO1:SWI:5059"]/100;
                        //     }
                        // }

                        // Plot soil wetness time series
                        var dataSW2 = [];
                        for (k = 0; k < dataSW.length; k++) {
                            dataSW2[k] = [];
                            // Date format that works also in mobile safari
                            dataSW2[k][0] = new Date(dataSW[k]["utctime"].replace(/-/g, "/"));
                            for (i = 0; i <= perturbations; i = i + 1) {
                                dataSW2[k][i + 1] = dataSW[k][SWensemblelist[i]];
                            }
                            dataSW2[k][perturbations + 2] = dataSW[k]["SWVL2-M3M3:SMARTMET:5015"];
                            dataSW2[k][perturbations + 3] = dataSW[k]["SWI2-0TO1:SWI:5059"];
                            // if (dataSW[k]["SWI2:SWI:5059"] > 0) {
                            //     dataSW2[k][perturbations + 3] = dataSW[k]["SWI2:SWI:5059"]/100;
                            // }
                        }

                        gsw = new Dygraph(
                            document.getElementById("graphsw"),
                            dataSW2,
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

                        // Fetch and plot soil temperature time series
                        graphLoad4 = $.get("https://desm.harvesterseasons.com/timeseries?latlon=" + latlonPoint + "&param=utctime,K2C{TSOIL-K:ECBSF:::7:1:0}" + TGKensemble + "&starttime=" + dateString_timeseries + "&endtime=" + dateString_ecbsf + "&timestep=1440&timeformat=sql&precision=full&separator=,&source=grid&tz=utc",
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


                        // Plot scaled snow depth time series
                        var dataSH2 = [];
                        for (k = 0; k < dataSHscaled.length; k++) {
                            dataSH2[k] = [];
                            // Date format that works also in mobile safari
                            dataSH2[k][0] = new Date(dataSHscaled[k]["utctime"].replace(/-/g, "/"));
                            for (i = 0; i <= perturbations; i = i + 1) {
                                // Remove seasonal forecast before startDate_smartobs-1day
                                if (dataSH2[k][0] < smartobsDate) {
                                    // Remove seasonal forecast before smartobsDate
                                    dataSH2[k][i+1] = null;
                                } else if (dataSH[k][SHensemblelist[i]] == 0 || dataSHscaled[k][SHensemblelist[i]] < 0) {
                                    // Set SD to 0 if non-scaled SD is 0 or scaled < 0
                                    dataSH2[k][i+1] = 0;
                                } else {
                                    dataSH2[k][i+1] = dataSHscaled[k][SHensemblelist[i]];
                                }
                            }
                            if (dataSHscaled[k]["HSNOW-M:SMARTOBS:13:4"] !== null) {
                                dataSH2[k][perturbations + 2] = dataSHscaled[k]["HSNOW-M:SMARTOBS:13:4"];
                            } else {
                                dataSH2[k][perturbations + 2] = dataSHscaled[k]["HSNOW-M:SMARTMET:5027"];
                            }
                        }

                        gsh = new Dygraph(
                            document.getElementById("graphsh"),
                            dataSH2,
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
                    });
            });
        }
    });
}

function drawOutsideFinland() {
    // // Outside Finland, no SMARTOBS or scaling
    graphLoad = $.getJSON("https://desm.harvesterseasons.com/timeseries?latlon=" + latlonPoint + "&param=" + param1 + "," + param2 + "," + param3 + "," + param4 + "," + param5 + "," + param6 + "," + param7 + "&starttime=" + dateString_timeseries + "&endtime=" + dateString_ecbsf + "&timestep=1440&format=json&source=grid&timeformat=xml&tz=utc",
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
                // if (data[i][param7] !== null) { winter2 = data[i][param7]; }
                if (data[i][param7] !== null) { winter2 = Math.max(data[i][param3], data[i][param7]); }
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

            // graphLoad3 = $.get("https://desm.harvesterseasons.com/timeseries?latlon=" + latlonPoint + "&param=utctime,SOILWET1-M:ECBSF::9:7:1:0" + SWensemble + ",SWVL2-M3M3:SMARTMET:5015&starttime=" + dateString_timeseries + "&endtime=" + dateString_ecbsf + "&timestep=1440&timeformat=sql&precision=full&separator=,&source=grid&tz=utc",
            // graphLoad3 = $.get("https://desm.harvesterseasons.com/timeseries?latlon=" + latlonPoint + "&param=utctime,SOILWET-M3M3:ECBSF:::7:1:0" + SWensemble + ",SWVL2-M3M3:SMARTMET:5015&starttime=" + dateString_timeseries + "&endtime=" + dateString_ecbsf + "&timestep=1440&timeformat=sql&precision=full&separator=,&source=grid&tz=utc",
            graphLoad3 = $.get("https://desm.harvesterseasons.com/timeseries?latlon=" + latlonPoint + "&param=utctime,VSW-M3M3:ECBSF:5022:9:7:0:0" + SWensemble + ",SWVL2-M3M3:SMARTMET:5015&starttime=" + dateString_timeseries + "&endtime=" + dateString_ecbsf + "&timestep=1440&timeformat=sql&precision=full&separator=,&source=grid&tz=utc",
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

            // graphLoad4 = $.get("https://desm.harvesterseasons.com/timeseries?latlon=" + latlonPoint + "&param=utctime,K2C{TSOIL-K:ECBSF::9:7:1:0}" + TGKensemble + ",TG-K:SMARTMET&starttime=" + dateString_timeseries + "&endtime=" + dateString_ecbsf + "&timestep=1440&timeformat=sql&precision=full&separator=,&source=grid&tz=utc",
            // graphLoad4 = $.get("https://desm.harvesterseasons.com/timeseries?latlon=" + latlonPoint + "&param=utctime,K2C{TSOIL-K:ECBSF::9:7:1:0}" + TGKensemble + "&starttime=" + dateString_timeseries + "&endtime=" + dateString_ecbsf + "&timestep=1440&timeformat=sql&precision=full&separator=,&source=grid&tz=utc",
            graphLoad4 = $.get("https://desm.harvesterseasons.com/timeseries?latlon=" + latlonPoint + "&param=utctime,K2C{TSOIL-K:ECBSF:::7:1:0}" + TGKensemble + "&starttime=" + dateString_timeseries + "&endtime=" + dateString_ecbsf + "&timestep=1440&timeformat=sql&precision=full&separator=,&source=grid&tz=utc",
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

            graphLoad2 = $.get("https://desm.harvesterseasons.com/timeseries?latlon=" + latlonPoint + "&param=utctime," + SHensemble + ",HSNOW-M:SMARTMET:5027&starttime=" + dateString_timeseries + "&endtime=" + dateString_ecbsf + "&timestep=1440&timeformat=sql&precision=full&separator=,&source=grid&tz=utc",
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



function scalingFunction(data, ensemblelist, smartIdx, perturbations, smartvariable1, smartvariable2) {

    // Scale seasonal forecast using observations
    let datascaled = [];
    for (let i = 0; i < data.length; i++) {
        datascaled[i] = [];
        datascaled[i]["utctime"] = data[i]["utctime"];
        datascaled[i][smartvariable1] = data[i][smartvariable1];
        if (smartvariable2 !== undefined) {
            datascaled[i][smartvariable2] = data[i][smartvariable2];
        }
        for (let j = 0; j <= perturbations; j++) {
            if (data[i][ensemblelist[j]] !== null) {
                datascaled[i][ensemblelist[j]] = data[i][ensemblelist[j]] - (data[smartIdx][ensemblelist[j]] - data[smartIdx][smartvariable1]);
            } else {
                datascaled[i][ensemblelist[j]] = null;
            }
        }
    }
    return datascaled;
}

// -- ###########################################################################################
// -- FUNCTION for an index if ensemble members are to 90 % under a threshold or only 10 %?
// --  The function returns 0 for only 10% are over, 1 for between 10 and 90 % and 2 for over 90%
// -- ###########################################################################################

function harvidx(threshold, datascaled, ensemblelist, perturbations, smartvariable) {
    let resultseries = [];

    for (k = 0; k < datascaled.length; k++) {
        // No result when smartvariable !== null
        if (datascaled[k][smartvariable] !== null
            || datascaled[k][ensemblelist[0]] == null) {
                resultseries[k] = 'nan';

        } else {
            let nans = agree = disagree = count = 0;
            // let threshold = 0.4;
            for (i = 0; i <= perturbations; i++) {
                let value = datascaled[k][ensemblelist[i]];
                if (isNaN(value)) { nans++ }
                else if (value < threshold) { agree++; count++; }
                else { disagree++; count++; }
            }
            if (count < nans) { resultseries[k] = 'nan'; }
            else if (agree / count >= 0.9) { resultseries[k] = 2; }
            else if (agree / count <= 0.1) { resultseries[k] = 0; }
            else { resultseries[k] = 1; }
        }
    }
    return resultseries;
}

// -- ################################################################################################
// -- FUNCTION for an index if ensemble members are to a given percent over a threshold or 1-percent?
// --  The function returns 0 for only (1-percent) are over, 1 for between boundaries and 2 for over
// -- calling ENSOVER{threshold;percent;parameterlist} percent as value 0..1
// -- #################################################################################################

function ensover(threshold, percent, datascaled, ensemblelist, perturbations, smartvariable) {
    let resultseries = [];

    for (k = 0; k < datascaled.length; k++) {
        // No result when smartvariable !== null
        if (datascaled[k][smartvariable] !== null
            || datascaled[k][ensemblelist[0]] == null) {
                resultseries[k] = 'nan';

        } else {
            let nans = agree = disagree = count = 0;
            // let threshold = 0.4;
            for (i = 0; i <= perturbations; i++) {
                let value = datascaled[k][ensemblelist[i]];
                if (isNaN(value)) { nans++ }
                else if (value >= threshold) { agree++; count++; }
                else { disagree++; count++; }
            }
            if (count < nans) { resultseries[k] = 'nan'; }
            else if (agree / count >= percent) { resultseries[k] = 2; }
            else if (agree / count <= (1 - percent)) { resultseries[k] = 0; }
            else { resultseries[k] = 1; }
        }
    }
    return resultseries;
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