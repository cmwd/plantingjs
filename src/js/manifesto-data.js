import { Model } from 'core';
import Const from 'const';
import { range } from 'underscore';

export default Model.extend({
  constructor(data, options) {
    this.url = options.url;
    Model.call(this, data, options);
  },

  initialize() {
    this.on('fetch', () => {
      this.app.trigger(Const.EVENT.MANIFESTO_INITED, this);
    }, this);
  },

  getProjectionsFor(objectId) {
    const toolboxObjects = this.get('toolboxobjects')[objectId];
    return toolboxObjects.projections;
  },

  getToolboxObjects() {
    const toolboxObjects = this.get('toolboxobjects');
    /**
     * Use range to generate temporary object id.
     *
     * @todo
     * manifesto should provide object id.
     */
    const toolboxObjectsRange = range(toolboxObjects.length);
    return toolboxObjects.map(({ projections }, index) => ({ projections, objectId: toolboxObjectsRange[index] }));
  },
});
