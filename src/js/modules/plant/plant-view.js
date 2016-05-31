import Backbone from 'backbone';
import template from './plant-view-template.hbs';
const IS_DRAGGING_CLASS = 'plantingjs-is-dragging';

const PlantView = Backbone.View.extend({
  tagName: 'LI',
  className: 'plantingjs-toolbox-item',
  events: {
    dragstart: 'onDragstart',
    dragend: 'onDragend',
  },
  attributes: {
    draggable: true,
  },

  render() {
    this.$el.html(template({
      imageUrl: this.model.attributes.projections[0],
    }));

    return this;
  },

  onDragstart() {
    this.el.classList.add(IS_DRAGGING_CLASS);
  },

  onDragend() {
    this.el.classList.remove(IS_DRAGGING_CLASS);
  },
});

export default PlantView;
