import { View } from 'core';
import { State, Event } from 'const';
import GoogleMaps from 'google-maps';
import { isNull } from 'underscore';


const MapView = View.extend({
  map: null,
  panorama: null,

  initialize() {
    this.map = null;
    this.model = this.coords();
    this.app.setState(State.MAP);
    GoogleMaps.KEY = this.app.options.googleApiKey;

    this.initializeMaps()
      .then((google) => {
        const { lat, lng, zoom } = this.model.getMapCoords();
        const { heading, pitch } = this.model.getPegmanCoords();

        this.map = new google.maps.Map(this.el, {
          scrollwheel: this.app.options.scrollwheel || false,
          center: new google.maps.LatLng(lat, lng),
          zoom: zoom,
        });
        this.panorama = this.map.getStreetView();

        google.maps.event.addListener(this.panorama, 'visible_changed', () => {
          this.app.trigger(Event.VISIBLE_CHANGED, this.panorama.getVisible());
          this.setupPanoEvents();
        });
        google.maps.event.addListener(this.map, 'dragend', () => {
          this.model.set({
            lat: this.map.center.lat(),
            lng: this.map.center.lng(),
          });
        });
        google.maps.event.addListener(this.map, 'zoom_changed', () => {
          this.model.set('zoom', this.map.zoom);
        });

        if (!isNull(heading) && !isNull(pitch)) {
          this.map = new google.maps.StreetViewPanorama(this.el, {
            position: { lat, lng },
            pov: { heading, pitch },
          });
          this.setupPanoEvents();
        }
      });

    this.model.on('all', (type, model) => {
      console.log(type, model.toJSON());
    });

    this.app
      .on(Event.START_PLANTING, this.disableUIElements, this)
      .on(Event.START_PLANTING, this.storePanoCoords, this);
  },

  setupPanoEvents() {
    this.panorama.addListener('position_changed', () => {
      console.log('position_changed');
    });
    this.panorama.addListener('pov_changed', () => {
      console.log('pov_changed');
    });
  },

  initializeViewer: function(options) {
    const element = this.el;

    this.app.setState(Const.State.VIEWER);
    GoogleMaps.KEY = this.app.options.googleApiKey;

    this.initializeMaps()
      .then(function(google) {
        this.map = new google.maps.StreetViewPanorama(element, options);
      }.bind(this));
  },

  getDisableUIOptions() {
    return {
      panControl: false,
      zoomControl: false,
      addressControl: false,
      linksControl: false,
    };
  },

  disableUIElements() {
    this.panorama.setOptions(this.getDisableUIOptions());
  },

  storePanoCoords() {
    const position = this.panorama.getPosition();

    this.session()
      .setPanoCoords({
        lat: position.lat(),
        lng: position.lng(),
        zoom: this.panorama.getZoom(),
      });
  },
});

module.exports = {
  View: MapView,
};
