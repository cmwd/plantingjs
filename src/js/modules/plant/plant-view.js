import Backbone from 'backbone';
import template from './plant-view-template.hbs';
import dragable from '../components/dragable';

const PlantView = Backbone.View.extend({
  tagName: 'LI',
  className: 'plantingjs-toolbox-item',

  initialize() {
    dragable({ view: this });

    return this;
  },

  render() {
    this.$el.html(template({
      imageUrl: this.model.attributes.projections[0],
    }));

    return this;
  },
});

export default PlantView;
