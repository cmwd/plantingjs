import { Model } from './core';

export function pegmanCoords(object) {
  const { heading, pitch } = object;
  return { heading, pitch };
}

export function mapCoords(object) {
  const { lng, lat, zoom } = object;
  return { lng, lat, zoom };
}

export default Model.extend({
  defaults: {
    lat: null,
    lng: null,
    zoom: null,
    pitch: null,
    heading: null,
  },

  getMapCoords() {
    return mapCoords(this.attributes);
  },

  getPegmanCoords() {
    return pegmanCoords(this.attributes);
  },
});
