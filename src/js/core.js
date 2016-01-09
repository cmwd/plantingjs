import Backbone from 'backbone';
import underscore, { assign } from 'underscore';

export function compose(baseClass, factories, instance) {
  const components = factories.map(factory => factory.call(null, baseClass, instance));

  return baseClass.extend(assign({}, ...components));
}

const coreMembers = {
  app: null,
  session() {
    return this.app.data.session;
  },

  manifesto() {
    return this.app.data.manifesto;
  },
};

function _setContext(options) {
  if (underscore.isObject(options) && underscore.has(options, 'app')) {
    this.app = options.app;
  }
}

export const View = Backbone.View.extend(
    underscore.extend({
      constructor(options) {
        _setContext.call(this, options);
        Backbone.View.call(this, options);
      },
    }, coreMembers)
);

export const Model = Backbone.Model.extend(
    underscore.extend({
      constructor(modelAttrs, options) {
        _setContext.call(this, options);
        Backbone.Model.call(this, modelAttrs, options);
      },
    }, coreMembers)
);

export const Collection = Backbone.Collection.extend(
    underscore.extend({
      constructor(models, options) {
        _setContext.call(this, options);
        Backbone.Collection.call(this, models, options);
      },
    }, coreMembers)
);
