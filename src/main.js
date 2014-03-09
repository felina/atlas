(function($){
    /**
     * Creates a jQuery-wrapped HTML <button> element
     * @param {string} text - The text to display on the button.
     * @param {string} cls - A space-separated list of CSS classes to apply
     * to the button.
     */
    var makeButton = function (text, cls) {
        return $('<button>')
            .addClass(cls)
            .text(text);
    };

    // Initialises the Google Map for location picking
    $.fn.atlas = function(options) {
        var settings = $.extend({
            width: 500,
            height: 500,
            callback: function() {},
            style: {
                classes: '',
                css: {}
            }
        }, options);

        // TODO: make these arguments
        var dom = {
            saver: makeButton('Save location', settings.style.classes, settings.style.css),
            locator: makeButton('Find me', settings.style.classes, settings.style.css)
        };

        var map = new GMaps({
            div: $('<div>')[0],
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
                        settings.callback(results[0].formatted_address);
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

        this.append(dom.saver)
            .append(dom.locator)
            .append(
                $(map.el)
                    .height(settings.height)
                    .width(settings.width)
            );

        return map;
    };
})(jQuery);
