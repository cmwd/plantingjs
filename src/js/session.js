import { Model, Collection } from './core';
import { isFunction, extend } from 'underscore';

const ObjectModel = Model.extend({
  defauts: {
    id: null,
    projection: null,
  },
  idAttribute: 'id',
});

const ObjectsCollection = Collection.extend({
  model: ObjectModel,
});

export default Model.extend({

  initialize() {
    this.objects = new ObjectsCollection(null, this.context());
  },

  pushObject({ id, projection }) {
    if (this.objects.get(id)) {
      this.objects.get(id).set({ projection });
    } else {
      this.objects.add({ id, projection });
    }
  },

  save() {
    const data = extend({
      objects: this.objects.toJSON(),
    }, this.coords().toJSON());

    if (isFunction(this.app.options.onSave)) {
      this.app.options.onSave.call(this.context(), data);
    }
  },
});
