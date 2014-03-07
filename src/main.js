(function($){
    var makeButton = function (cls, text) {
        return $('<button>')
            .addClass(cls)
            .text(text);
    };

    // Initialises the Google Map for location picking
    $.fn.atlas = function() {
        // TODO: make these arguments
        var dom = {
            map: $('<div>').attr('id', 'map'),
            saver: makeButton('location-saver', 'Save location'),
            locator: makeButton('geolocator', 'Find me'),
            field: 'location-field'
        };

        var map = new GMaps({
            div: dom.map,
            lat: 0,
            lng: 0,
            zoom: 2,
            click: function(e) {
                map.removeMarkers();
                map.addMarker({
                    lat: e.latLng.d,
                    lng: e.latLng.e
                });
            }
        });

        $(dom.saver).on('click', function() {
            if (map.markers.length === 0) {
                alert('Please choose a location');
                return;
            }
            var pos = map.markers[0].position;

            GMaps.geocode({
                lat: pos.d,
                lng: pos.e,
                callback: function(results, status) {
                    if (status === 'OK') {
                        $(dom.field).val(results[0].formatted_address);
                    }
                }
            });
        });

        $(dom.locator).on('click', function() {
            GMaps.geolocate({
                success: function(position) {
                    map.setCenter(position.coords.latitude, position.coords.longitude);
                    map.setZoom(12);
                },
                error: function(error) {
                    alert('Geolocation failed: ' + error.message);
                },
                not_supported: function() {
                    alert("Your browser does not support geolocation");
                }
            });
        });

        return this;
    };
})(jQuery)
