import { Model } from '../../core';

export default Model.extend({
  defaults: {
    x: null,
    y: null,
    scale: null,
    layerIndex: null,
    projection: 0,
    width: 0,
    height: 0,
    userActivity: false,
  },

  getProjection() {
    return this.get('projections')[this.get('projection')];
  },

  setProjection(at_) {
    const projections = this.get('projections');
    let at = at_ > projections.length ? 0 : at_;
    at = at < 0 ? projections.length : at;
    this.set('projection', at);
  },

  setPosX({ x, width }) {
    this.set('x', x / width);

    return this;
  },

  getPosX({ width }) {
    return width * this.get('x');
  },

  setPosY({ y, height, width }) {
    this.set('y', (y - (height / 2)) / width );

    return this;
  },

  getPosY({ width, height }) {
    return height / 2 + this.get('y') * width;
  },
});
