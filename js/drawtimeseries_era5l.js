function drawtimeseries() {
    // Inside Finland, seasonal snow depth combined and scaled with SMARTOBS/SMARTMET observations

    // var dataUrlSW = "https://desm.harvesterseasons.com/timeseries?latlon=" + latlonPoint + "&param=utctime,SWI2-0TO1:SWI:5059,SWVL2-M3M3:SMARTMET:5015,SWI2-0TO1:EDTE:5068," + SWensemble + "&starttime=" + dateString_timeseries + "&endtime=" + dateString_ecbsf + "&timestep=1440&format=json&precision=full&source=grid&timeformat=sql&tz=utc";
    // $.getJSON(dataUrlSW, function (dataSW) {

    var dataUrlSW = "https://desm.harvesterseasons.com/timeseries?latlon=" + latlonPoint + "&param=utctime,HSNOW-M:SMARTOBS:13:4,SWI2-0TO1:SWI:5059," + SWensemble + "," + SWensemble_ecxens + "&starttime=" + dateString_timeseries + "&endtime=" + dateString_ecbsf + "&timestep=1440&format=json&precision=full&source=grid&timeformat=sql&tz=utc";
    $.getJSON(dataUrlSW, function (dataSW) {

        // Find the latest HSNOW-M:SMARTOBS:13:4 value
        let smartmetIdx = -1;
        for (let i = 0; i < dataSW.length; i++) {
            if (dataSW[i]["HSNOW-M:SMARTOBS:13:4"] !== null) {
                smartmetIdx = i;
            }
        }

        // Find the latest SWI2-0TO1:ECXENS value
        let ecxensIdx = -1;
        for (let i = 0; i < dataSW.length; i++) {
            if (dataSW[i][SWensemblelist_ecxens[0]] !== null) {
                ecxensIdx = i;
            }
        }

        if (smartmetIdx == -1) {
            drawOutsideFinland(dataSW, ecxensIdx);
        // } else if (ecxensIdx == -1) {
        //     drawOutsideECENS()
        } else {

            // // // Fix soilwetnessDay for the WMS-layers using smartmetIdx

            // let smartmetIdxDateYear = dataSW[smartmetIdx]["utctime"].substr(0, 4);
            // let smartmetIdxDateMonth = dataSW[smartmetIdx]["utctime"].substr(5, 2);
            // let smartmetIdxDateDay = dataSW[smartmetIdx]["utctime"].substr(8, 2);

            // let smartmetIdxDate = new Date(Date.UTC(smartmetIdxDateYear, smartmetIdxDateMonth - 1, smartmetIdxDateDay));

            // if (smartmetIdxDate.getTime() !== soilwetnessDate.getTime()) {
            //     soilwetnessDate = smartmetIdxDate;
            // }

            // let smartmetDate = new Date(dataSW[smartmetIdx]["utctime"]);
            // Date format that works also in mobile safari
            // let smartmetDate = new Date(dataSW[smartmetIdx]["utctime"].replace(/-/g, "/"));

            // // Scale seasonal soil wetness using SMARTMET-forecast
            // let dataSWscaled = [];
            // // dataSWscaled = scalingFunction(dataSW, SWensemblelist, smartmetIdx, perturbations, "SWVL2-M3M3:SMARTMET:5015");
            // dataSWscaled = dataSW;


            // // Fetch snow depth data
            // var dataUrlSH = "https://desm.harvesterseasons.com/timeseries?latlon=" + latlonPoint + "&param=utctime,HSNOW-M:SMARTOBS:13:4,HSNOW-M:SMARTMET:5027," + SHensemble + "&starttime=" + dateString_timeseries + "&endtime=" + dateString_ecbsf + "&timestep=1440&format=json&precision=full&source=grid&timeformat=sql&tz=utc";
            // $.getJSON(dataUrlSH, function (dataSH) {

            // Fetch snow depth data
            var dataUrlSH = "https://desm.harvesterseasons.com/timeseries?latlon=" + latlonPoint + "&param=utctime,HSNOW-M:SMARTOBS:13:4," + SHensemble + "," + SHensemble_ecens + "&starttime=" + dateString_timeseries + "&endtime=" + dateString_ecbsf + "&timestep=1440&format=json&precision=full&source=grid&timeformat=sql&tz=utc";
            $.getJSON(dataUrlSH, function (dataSH) {

                // Find the latest HSNOW-M:SMARTOBS value
                let smartobsIdx = -1;
                for (let i = 0; i < dataSH.length; i++) {
                    if (dataSH[i]["HSNOW-M:SMARTOBS:13:4"] !== null) {
                        smartobsIdx = i;
                    }
                }

                // Find the latest HSNOW-M:ECENS value
                let SHecensIdx = -1;
                for (let i = 0; i < dataSH.length; i++) {
                    if (dataSH[i][SHensemblelist_ecens[0]] !== null) {
                        SHecensIdx = i;
                    }
                }

                let smartobsDate = new Date(dataSH[smartobsIdx]["utctime"]);

                // Scale seasonal snow forecast using SMARTOBS-observations
                let dataSHscaled = [];
                // dataSHscaled = scalingFunction(dataSH, SHensemblelist, smartobsIdx, perturbations, "HSNOW-M:SMARTOBS:13:4", "HSNOW-M:SMARTMET:5027");
                dataSHscaled = scalingFunction(dataSH, SHensemblelist, smartobsIdx, perturbations, "HSNOW-M:SMARTOBS:13:4");

                // Scale ECENS snow forecast using SMARTOBS-observations?
                let dataSHscaled_ecens = [];
                dataSHscaled_ecens = scalingFunction(dataSH, SHensemblelist_ecens, smartobsIdx, perturbations, "HSNOW-M:SMARTOBS:13:4");

                // // // // Summer index from the scaled seasonal soil wetness
                // let summer1series = [];
                // summer1series = harvidx(0.4, dataSWscaled, SWensemblelist, perturbations, "SWVL2-M3M3:SMARTMET:5015")

                // // // Winter index from the scaled seasonal snow depth
                let winter1series = [];
                winter1series = ensover(0.4, 0.9, dataSHscaled, SHensemblelist, perturbations, "HSNOW-M:SMARTOBS:13:4")

                // // // Winter index from the scaled seasonal snow depth
                let winter2series = [];
                winter2series = ensover(0.4, 0.9, dataSHscaled_ecens, SHensemblelist_ecens, perturbations, "HSNOW-M:SMARTOBS:13:4")

                graphLoad = $.getJSON("https://desm.harvesterseasons.com/timeseries?latlon=" + latlonPoint + "&param=utctime," + param_ecxsf_swi2 + "," + param_ecxens_swi2 + "," + param_ecbsf_tsoil + "," + param_ecens_tsoil + "," + param_swi_swi2 + "," + param_smartobs_hsnow + "&starttime=" + dateString_timeseries + "&endtime=" + dateString_ecbsf + "&timestep=1440&format=json&source=grid&timeformat=xml&tz=utc",
                    function (data) {
                        var graphdata = [];
                        for (i = 0, k = 0; i < data.length; i++) {
                            var summer1, summer2, winter1, winter2;

                            // // Seasonal summer index scaled with observations (SWI2-0TO1:ECXSF & ?)
                            // if (summer1series.length == data.length) { summer1 = summer1series[i]; }
                            // else { summer1 = 'nan'; }

                            // Seasonal summer index (SWI2:ECXSF)
                            if (data[i][param_ecxsf_swi2] !== null) { summer1 = data[i][param_ecxsf_swi2]; }
                            else { summer1 = 'nan'; }

                            // Seasonal winter index, combined and scaled with observations (HSNOW-M:ECBSF & HSNOW-M:SMARTOBS, TSOIL-K:ECBSF)                                    
                            if (data[i][param_smartobs_hsnow] !== null) { 
                                winter1 = Math.max(data[i][param_ecbsf_tsoil], data[i][param_smartobs_hsnow]); 
                            }
                            else if (data[i][param_ecbsf_tsoil] !== null || winter1series[i] !== null && winter1series.length == data.length) 
                                { winter1 = Math.max(data[i][param_ecbsf_tsoil], winter1series[i]); }
                            else { winter1 = 'nan'; }
                            
                            // // 10 day forecast summer index (SWI2:SWI)                      
                            // if (data[i][param_swi_swi2] !== null) { summer2 = data[i][param_swi_swi2]; }
                            // else { summer2 = 'nan'; }

                            // 15 day forecast summer index (SWI2:ECXENS)
                            if (data[i][param_ecxens_swi2] !== null) { 
                                summer2 = data[i][param_ecxens_swi2]; 
                            }
                            else { summer2 = 'nan'; }

                            // // // 10 day forecast winter index (HSNOW-M:SMARTOBS, HSNOW-M:SMARTMET, TSOIL-K:ECBSF)                      
                            // // First HSNOW-M:SMARTOBS and then HSNOW-M:SMARTMET
                            // if (data[i][param_smartobs_hsnow] !== null) { winter2 = Math.max(data[i][param_ecbsf_tsoil], data[i][param_smartobs_hsnow]); }
                            // // else if (data[i][param_smartmet_hsnow] !== null) { winter2 = Math.max(data[i][param_ecbsf_tsoil], data[i][param_smartmet_hsnow]); }
                            // else { winter2 = 'nan'; }

                            // 15 day winter index, combined and scaled with observations (HSNOW-M:ECENS & HSNOW-M:SMARTOBS, TSOIL-K:ECENS)                     
                            if (data[i][param_smartobs_hsnow] !== null) { 
                                winter2 = Math.max(data[i][param_ecens_tsoil], data[i][param_smartobs_hsnow]); 
                            }
                            else if (data[i][param_ecbsf_tsoil] !== null || winter2series[i] !== null && winter2series.length == data.length) 
                                { winter2 = Math.max(data[i][param_ecens_tsoil], winter2series[i]); }
                            else { winter2 = 'nan'; }

                            // Combined trafficability index time series
                            if (summer1 !== 'nan' || winter1 !== 'nan' || summer2 !== 'nan' || winter2 !== 'nan') {
                                graphdata[k] = [new Date(data[i][param_utctime]), summer1, winter1, summer2, winter2];
                                k++;
                            }
                        }

                        if (!dateFixed && data.length > 0) {
                            // Fix the last date of dateslider to timeseries data
                            var maxDate = new Date(data[data.length - 1][param_utctime]);
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

                        // // Plot soil wetness time series
                        // var dataSW2 = [];
                        // for (k = 0; k < dataSW.length; k++) {
                        //     dataSW2[k] = [];
                        //     // Date format that works also in mobile safari
                        //     dataSW2[k][0] = new Date(dataSW[k]["utctime"].replace(/-/g, "/"));
                        //     for (i = 0; i <= perturbations; i = i + 1) {
                        //         dataSW2[k][i + 1] = dataSW[k][SWensemblelist[i]];
                        //     }
                        //     dataSW2[k][perturbations + 2] = dataSW[k]["SWI2-0TO1:SWI:5059"];
                        // }

                        // Plot combined soil wetness time series
                        var dataSW2 = [];
                        for (k = 0; k <= ecxensIdx; k++) {
                            dataSW2[k] = [];
                            // Date format that works also in mobile safari
                            dataSW2[k][0] = new Date(dataSW[k]["utctime"].replace(/-/g, "/"));
                            for (i = 0; i <= perturbations; i = i + 1) {
                                dataSW2[k][i + 1] = dataSW[k][SWensemblelist_ecxens[i]];
                            }
                            dataSW2[k][perturbations + 2] = dataSW[k]["SWI2-0TO1:SWI:5059"];
                        }
                        for (k = ecxensIdx + 1; k < dataSW.length; k++) {
                            dataSW2[k] = [];
                            // Date format that works also in mobile safari
                            dataSW2[k][0] = new Date(dataSW[k]["utctime"].replace(/-/g, "/"));
                            for (i = 0; i <= perturbations; i = i + 1) {
                                dataSW2[k][i + 1] = dataSW[k][SWensemblelist[i]];
                            }
                            dataSW2[k][perturbations + 2] = dataSW[k]["SWI2-0TO1:SWI:5059"];
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

                        // // Fetch and plot soil temperature time series
                        // graphLoad4 = $.get("https://desm.harvesterseasons.com/timeseries?latlon=" + latlonPoint + "&param=utctime," + TGKensemble + "&starttime=" + dateString_timeseries + "&endtime=" + dateString_ecbsf + "&timestep=1440&timeformat=sql&precision=full&separator=,&source=grid&tz=utc",

                        // Fetch and plot soil temperature time series
                        graphLoad4 = $.getJSON("https://desm.harvesterseasons.com/timeseries?latlon=" + latlonPoint + "&param=utctime," + TGKensemble + "," + TGKensemble_ecens + "&starttime=" + dateString_timeseries + "&endtime=" + dateString_ecbsf + "&timestep=1440&timeformat=sql&precision=full&separator=,&source=grid&tz=utc&format=json",
                            function (data) {

                                // Find the latest SWI2-0TO1:ECENS value
                                let ecensIdx = -1;
                                for (let i = 0; i < data.length; i++) {
                                    if (data[i][TGKensemblelist_ecens[0]] !== null) {
                                        ecensIdx = i;
                                    }
                                }

                                // Plot combined soil temperature time series
                                var data2 = [];
                                for (k = 0; k <= ecensIdx; k++) {
                                    data2[k] = [];
                                    // Date format that works also in mobile safari
                                    data2[k][0] = new Date(data[k]["utctime"].replace(/-/g, "/"));
                                    for (i = 0; i <= perturbations; i = i + 1) {
                                        data2[k][i + 1] = data[k][TGKensemblelist_ecens[i]];
                                    }
                                }
                                for (k = ecensIdx + 1; k < data.length; k++) {
                                    data2[k] = [];
                                    // Date format that works also in mobile safari
                                    data2[k][0] = new Date(data[k]["utctime"].replace(/-/g, "/"));
                                    for (i = 0; i <= perturbations; i = i + 1) {
                                        data2[k][i + 1] = data[k][TGKensemblelist[i]];
                                    }
                                }

                                if (data.length > 0) {
                                    gst = new Dygraph(
                                        document.getElementById("graphst"),
                                        data2,
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


                        // // Plot scaled snow depth time series
                        // var dataSH2 = [];
                        // for (k = 0; k < dataSHscaled.length; k++) {
                        //     dataSH2[k] = [];
                        //     // Date format that works also in mobile safari
                        //     dataSH2[k][0] = new Date(dataSHscaled[k]["utctime"].replace(/-/g, "/"));
                        //     for (i = 0; i <= perturbations; i = i + 1) {
                        //         // Remove seasonal forecast before startDate_smartobs-1day
                        //         if (dataSH2[k][0] < smartobsDate) {
                        //             // Remove seasonal forecast before smartobsDate
                        //             dataSH2[k][i+1] = null;
                        //         } else if (dataSH[k][SHensemblelist[i]] == 0 || dataSHscaled[k][SHensemblelist[i]] < 0) {
                        //             // Set SD to 0 if non-scaled SD is 0 or scaled < 0
                        //             dataSH2[k][i+1] = 0;
                        //         } else {
                        //             dataSH2[k][i+1] = dataSHscaled[k][SHensemblelist[i]];
                        //         }
                        //     }
                        //     if (dataSHscaled[k]["HSNOW-M:SMARTOBS:13:4"] !== null) {
                        //         dataSH2[k][perturbations + 2] = dataSHscaled[k]["HSNOW-M:SMARTOBS:13:4"];
                        //     } else {
                        //         dataSH2[k][perturbations + 2] = dataSHscaled[k]["HSNOW-M:SMARTMET:5027"];
                        //     }
                        // }

                        // Plot scaled and combined snow depth time series
                        var dataSH2 = [];
                        for (k = 0; k <= SHecensIdx; k++) {
                            dataSH2[k] = [];
                            // Date format that works also in mobile safari
                            dataSH2[k][0] = new Date(dataSHscaled_ecens[k]["utctime"].replace(/-/g, "/"));
                            for (i = 0; i <= perturbations; i = i + 1) {
                                // Remove seasonal forecast before startDate_smartobs-1day
                                if (dataSH2[k][0] < smartobsDate) {
                                    // Remove seasonal forecast before smartobsDate
                                    dataSH2[k][i+1] = null;
                                } else if (dataSH[k][SHensemblelist_ecens[i]] == 0 || dataSHscaled_ecens[k][SHensemblelist_ecens[i]] < 0) {
                                    // Set SD to 0 if non-scaled SD is 0 or scaled < 0
                                    dataSH2[k][i+1] = 0;
                                } else {
                                    dataSH2[k][i+1] = dataSHscaled_ecens[k][SHensemblelist_ecens[i]];
                                }
                            }
                            if (dataSHscaled_ecens[k]["HSNOW-M:SMARTOBS:13:4"] !== null) {
                                dataSH2[k][perturbations + 2] = dataSHscaled_ecens[k]["HSNOW-M:SMARTOBS:13:4"];
                            }
                        }
                        for (k = SHecensIdx + 1; k < dataSHscaled.length; k++) {
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

function drawOutsideFinland(dataSW, ecxensIdx) {

    // // Outside Finland, no SMARTOBS or scaling
    // Fetch snow depth data
    var dataUrlSH = "https://desm.harvesterseasons.com/timeseries?latlon=" + latlonPoint + "&param=utctime,HSNOW-M:SMARTOBS:13:4," + SHensemble + "," + SHensemble_ecens + "&starttime=" + dateString_timeseries + "&endtime=" + dateString_ecbsf + "&timestep=1440&format=json&precision=full&source=grid&timeformat=sql&tz=utc";
    $.getJSON(dataUrlSH, function (dataSH) {
    
        // Find the latest HSNOW-M:ECENS value
        let SHecensIdx = -1;
        for (let i = 0; i < dataSH.length; i++) {
            if (dataSH[i][SHensemblelist_ecens[0]] !== null) {
                SHecensIdx = i;
            }
        }

        graphLoad = $.getJSON("https://desm.harvesterseasons.com/timeseries?latlon=" + latlonPoint + "&param=utctime," + param_ecxsf_swi2 + "," + param_ecxens_swi2 + "," + param_ecbsf_tsoil + "," + param_ecens_tsoil + "," + param_swi_swi2 + "," + param_ecbsf_hsnow + "," + param_ecens_hsnow + "&starttime=" + dateString_timeseries + "&endtime=" + dateString_ecbsf + "&timestep=1440&format=json&source=grid&timeformat=xml&tz=utc",
            function (data) {
                var graphdata = [];
                for (i = 0, k = 0; i < data.length; i++) {
                    var summer1, summer2, winter1, winter2;

                    // Seasonal summer index (SWI2:ECXSF)
                    if (data[i][param_ecxsf_swi2] !== null) { 
                        summer1 = data[i][param_ecxsf_swi2]; 
                    }
                    else { summer1 = 'nan'; }

                    // Seasonal winter index (HSNOW-M:ECBSF, TSOIL-K:ECBSF)      
              
                    if (data[i][param_ecbsf_tsoil] !== null || data[i][param_ecbsf_hsnow] !== null ) { 
                        winter1 = Math.max(data[i][param_ecbsf_tsoil], data[i][param_ecbsf_hsnow]);
                    } else { winter1 = 'nan'; }

                    // // 10 day forecast summer index (SWI2:SWI)                      
                    // if (data[i][param_swi_swi2] !== null) { summer2 = data[i][param_swi_swi2]; }
                    // else { summer2 = 'nan'; }

                    // 15 day forecast summer index (SWI2:ECXENS)
                    if (data[i][param_ecxens_swi2] !== null) { 
                        summer2 = data[i][param_ecxens_swi2]; 
                    }
                    else { summer2 = 'nan'; }

                    // 15 day winter index (HSNOW-M:ECENS , TSOIL-K:ECENS)
                
                    if (data[i][param_ecens_tsoil] !== null || data[i][param_ecens_hsnow] !== null ) { 
                        winter2 = Math.max(data[i][param_ecens_tsoil], data[i][param_ecens_hsnow]); }
                    else { winter2 = 'nan'; }

                    // Combined trafficability index time series
                    if (summer1 !== 'nan' || winter1 !== 'nan' || summer2 !== 'nan' || winter2 !== 'nan') {
                        graphdata[k] = [new Date(data[i][param_utctime]), summer1, winter1, summer2, winter2];
                        k++;
                    }
                }

                if (!dateFixed && data.length > 0) {
                    // Fix the last date of dateslider to timeseries data
                    var maxDate = new Date(data[data.length - 1][param_utctime]);
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

                // // Plot soil wetness time series
                // var dataSW2 = [];
                // for (k = 0; k < dataSW.length; k++) {
                //     dataSW2[k] = [];
                //     // Date format that works also in mobile safari
                //     dataSW2[k][0] = new Date(dataSW[k]["utctime"].replace(/-/g, "/"));
                //     for (i = 0; i <= perturbations; i = i + 1) {
                //         dataSW2[k][i + 1] = dataSW[k][SWensemblelist[i]];
                //     }
                //     dataSW2[k][perturbations + 2] = dataSW[k]["SWI2-0TO1:SWI:5059"];
                // }

                // Plot combined soil wetness time series
                var dataSW2 = [];
                for (k = 0; k <= ecxensIdx; k++) {
                    dataSW2[k] = [];
                    // Date format that works also in mobile safari
                    dataSW2[k][0] = new Date(dataSW[k]["utctime"].replace(/-/g, "/"));
                    for (i = 0; i <= perturbations; i = i + 1) {
                        dataSW2[k][i + 1] = dataSW[k][SWensemblelist_ecxens[i]];
                    }
                    dataSW2[k][perturbations + 2] = dataSW[k]["SWI2-0TO1:SWI:5059"];
                }
                for (k = ecxensIdx + 1; k < dataSW.length; k++) {
                    dataSW2[k] = [];
                    // Date format that works also in mobile safari
                    dataSW2[k][0] = new Date(dataSW[k]["utctime"].replace(/-/g, "/"));
                    for (i = 0; i <= perturbations; i = i + 1) {
                        dataSW2[k][i + 1] = dataSW[k][SWensemblelist[i]];
                    }
                    dataSW2[k][perturbations + 2] = dataSW[k]["SWI2-0TO1:SWI:5059"];
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

                // // Fetch and plot soil temperature time series
                // graphLoad4 = $.get("https://desm.harvesterseasons.com/timeseries?latlon=" + latlonPoint + "&param=utctime," + TGKensemble + "&starttime=" + dateString_timeseries + "&endtime=" + dateString_ecbsf + "&timestep=1440&timeformat=sql&precision=full&separator=,&source=grid&tz=utc",

                // Fetch and plot soil temperature time series
                graphLoad4 = $.getJSON("https://desm.harvesterseasons.com/timeseries?latlon=" + latlonPoint + "&param=utctime," + TGKensemble + "," + TGKensemble_ecens + "&starttime=" + dateString_timeseries + "&endtime=" + dateString_ecbsf + "&timestep=1440&timeformat=sql&precision=full&separator=,&source=grid&tz=utc&format=json",
                    function (data) {

                        // Find the latest SWI2-0TO1:ECENS value
                        let ecensIdx = -1;
                        for (let i = 0; i < data.length; i++) {
                            if (data[i][TGKensemblelist_ecens[0]] !== null) {
                                ecensIdx = i;
                            }
                        }

                        // Plot combined soil temperature time series
                        var data2 = [];
                        for (k = 0; k <= ecensIdx; k++) {
                            data2[k] = [];
                            // Date format that works also in mobile safari
                            data2[k][0] = new Date(data[k]["utctime"].replace(/-/g, "/"));
                            for (i = 0; i <= perturbations; i = i + 1) {
                                data2[k][i + 1] = data[k][TGKensemblelist_ecens[i]];
                            }
                        }
                        for (k = ecensIdx + 1; k < data.length; k++) {
                            data2[k] = [];
                            // Date format that works also in mobile safari
                            data2[k][0] = new Date(data[k]["utctime"].replace(/-/g, "/"));
                            for (i = 0; i <= perturbations; i = i + 1) {
                                data2[k][i + 1] = data[k][TGKensemblelist[i]];
                            }
                        }

                        if (data.length > 0) {
                            gst = new Dygraph(
                                document.getElementById("graphst"),
                                data2,
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


                // Plot combined snow depth time series
                var dataSH2 = [];
                for (k = 0; k <= SHecensIdx; k++) {
                    dataSH2[k] = [];
                    // Date format that works also in mobile safari
                    dataSH2[k][0] = new Date(dataSH[k]["utctime"].replace(/-/g, "/"));
                    for (i = 0; i <= perturbations; i = i + 1) {
                        dataSH2[k][i + 1] = dataSH[k][SHensemblelist_ecens[i]];
                    }
                    dataSH2[k][perturbations + 2] = dataSH[k]["HSNOW-M:SMARTOBS:13:4"];
                }
                for (k = SHecensIdx + 1; k < dataSH.length; k++) {
                    dataSH2[k] = [];
                    // Date format that works also in mobile safari
                    dataSH2[k][0] = new Date(dataSH[k]["utctime"].replace(/-/g, "/"));
                    for (i = 0; i <= perturbations; i = i + 1) {
                        dataSH2[k][i + 1] = dataSH[k][SHensemblelist[i]];
                    }
                    dataSH2[k][perturbations + 2] = dataSH[k]["HSNOW-M:SMARTOBS:13:4"];
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