import { Model, Collection } from './core';
import { extend } from 'underscore';

const ToolObject = Model.extend({
  defaults: {
    projections: [],
    id: null,
  },
  idAttribute: 'id',
});

export default Collection.extend({
  model: ToolObject,

  initialize(objects, settings) {
    objects = objects.map((object, id) => {
      return extend(object, { id });
    });

    Collection.prototype.initialize.call(this, objects, settings);
  },

  getProjectionsFor(objectId) {
    return this.get(objectId).get('projections');
  },
});
