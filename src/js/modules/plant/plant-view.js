import Backbone from 'backbone';
import template from './plant-view-template.hbs';

const PlantView = Backbone.View.extend({
  tagName: 'LI',
  className: 'plantingjs-toolbox-item',

  render() {
    this.$el.html(template({
      imageUrl: this.model.attributes.projections[0],
    }));

    return this;
  },
});

export default PlantView;
