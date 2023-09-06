L.Permalink = {
    //gets the map center, zoom-level and rotation from the URL if present, else uses default values
    getMapLocation: function (zoom, center, date) {
        'use strict';
        zoom = (zoom || zoom === 0) ? zoom : 6;
        center = (center) ? center : [64.0, 27.0];
        date = (date) ? date : new Date().toISOString().split('T')[0];

        if (window.location.hash !== '') {
            var hash = window.location.hash.replace('#', '');
            var parts = hash.split(',');
            // if (parts.length === 3) {
            if (parts.length === 4) {
                center = {
                    lat: parseFloat(parts[0]),
                    lng: parseFloat(parts[1])
                };
                zoom = parseInt(parts[2].slice(0, -1), 10);
                date = parts[3];
            }
        }
        return {zoom: zoom, center: center, date: date};
    },

    // updatePermalinkFunction: function (shouldUpdate) {
    //     if (!shouldUpdate) {
    //         // do not update the URL when the view was changed in the 'popstate' handler (browser history navigation)
    //         shouldUpdate = true;
    //         return;
    //     }

    //     date = (sliderDate) ? date : new Date();

    //     var center = map.getCenter();
    //     // var hash = '#' +
    //     //         Math.round(center.lat * 100000) / 100000 + ',' +
    //     //         Math.round(center.lng * 100000) / 100000 + ',' +
    //     //         map.getZoom() + 'z';
    //     var hash = '#' +
    //         Math.round(center.lat * 100000) / 100000 + ',' +
    //         Math.round(center.lng * 100000) / 100000 + ',' +
    //         map.getZoom() + 'z' + ',' +
    //         date.toISOString().split('T')[0];
    //     var state = {
    //         zoom: map.getZoom(),
    //         center: center,
    //         date: date.toISOString().split('T')[0]
    //     };
    //     window.history.pushState(state, 'map', hash);
    // },

    setup: function (map) {
        'use strict';
        var shouldUpdate = true;
        // var updatePermalink = L.Permalink.updatePermalinkFunction(shouldUpdate);

        var updatePermalink = function () {
            if (!shouldUpdate) {
                // do not update the URL when the view was changed in the 'popstate' handler (browser history navigation)
                shouldUpdate = true;
                return;
            }

            var center = map.getCenter();
            // var hash = '#' +
            //         Math.round(center.lat * 100000) / 100000 + ',' +
            //         Math.round(center.lng * 100000) / 100000 + ',' +
            //         map.getZoom() + 'z';
            var hash = '#' +
                Math.round(center.lat * 100000) / 100000 + ',' +
                Math.round(center.lng * 100000) / 100000 + ',' +
                map.getZoom() + 'z' + ',' +
                sliderDate.toISOString().split('T')[0];
            var state = {
                zoom: map.getZoom(),
                center: center,
                date: sliderDate.toISOString().split('T')[0]
            };
            window.history.pushState(state, 'map', hash);
        };

        map.on('moveend', updatePermalink);

        // restore the view state when navigating through the history, see
        // https://developer.mozilla.org/en-US/docs/Web/API/WindowEventHandlers/onpopstate
        window.addEventListener('popstate', function (event) {
            if (event.state === null) {
                return;
            }
            map.setView(event.state.center, event.state.zoom);
            shouldUpdate = false;
        });
    }
};

function updatePermalinkFunction() {
    // date = (sliderDate) ? date : new Date();

    var center = map.getCenter();
    // var hash = '#' +
    //         Math.round(center.lat * 100000) / 100000 + ',' +
    //         Math.round(center.lng * 100000) / 100000 + ',' +
    //         map.getZoom() + 'z';
    var hash = '#' +
        Math.round(center.lat * 100000) / 100000 + ',' +
        Math.round(center.lng * 100000) / 100000 + ',' +
        map.getZoom() + 'z' + ',' +
        sliderDate.toISOString().split('T')[0];
    var state = {
        zoom: map.getZoom(),
        center: center,
        date: sliderDate.toISOString().split('T')[0]
    };
    window.history.pushState(state, 'map', hash);
    // window.location.hash = hash;

    // const urlParams = new URLSearchParams(window.location.hash);
    // urlParams.set('date', '1');
    // window.location.hash = new URLSearchParams(hash);

    // console.debug(hash)
};