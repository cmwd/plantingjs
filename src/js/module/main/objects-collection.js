import { range } from 'underscore';
import { Model } from 'backbone';
import { compose } from '../../core';

function objectModel() {
  return {
    idAttribute: 'objectId',
  };
}

export default function objectsCollection(Collection, instance) {
  return {
    model: compose(Model, [objectModel], instance),
    constructor(data) {
      /**
       * Use range to generate temporary object id.
       *
       * @todo
       * manifesto should provide object id.
       */
      const objectsId = range(data.length);
      const toolboxObjects = data.map(({ projections }, index) => ({ projections, objectId: objectsId[index] }));
      Collection.call(this, toolboxObjects);
    },

    /**
     * This functions exists only for test purposes
     * @param  {Number} multiplyN defines how many times duplicate collection data
     * @return {Array}   collection data
     */
    toJSONMultiply(multiplyN = 1) {
      const data = this.toJSON();
      let result = [];
      let multiply = multiplyN;

      while (multiply-- > 0) {
        result = result.concat(data);
      }

      return result;
    },
  };
}
