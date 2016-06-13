import lodash from 'lodash';
import { View } from '../../core';
import PlantViewTools from '../plant/tools';
import Const from '../../const';
import { moveableComponent, MOVE_END } from '../components/moveable';

export default View.extend({
  className: 'plantingjs-plantedobject-container',
  template: require('./object.hbs'),
  events: {
    'mouseover': 'setUserActivity',
    'mouseleave': 'unsetUserActivity',
  },
  moveable: null,
  $img: null,

  initialize: function(options) {
    const isViewerMode = this.app.getState() === Const.State.VIEWER;

    this.overlay = options.overlay;
    this.moveable = moveableComponent({ view: this, staticMode: isViewerMode });
    this.listenTo(this.model, 'change:scale', this.resize);
    this.render();
    this.$img
        .one('load', function() {
          if (lodash.isNull(this.model.get('scale'))) {
            this.model.set('scale', this.$img.width() / this.overlay.width());
          }
          this.resize();
        }.bind(this));

    this.tools = new PlantViewTools({
      el: this.el.querySelector('.plantingjs-plantedobject-tools'),
      model: this.model,
      parent: this,
      options: this.app.data.options,
    });

    this.model
      .on('change:currentProjection', this.updateProjection, this)
      .on('change:layerIndex', this.setLayer, this);

    if (!isViewerMode) {
      this.on(MOVE_END, ({ x, y }) => {
        this.model.setPosX({ x, width: this.overlay.width() });
        this.model.setPosY({ y,
          width: this.overlay.width(),
          height: this.overlay.height() });
      });
    }
  },

  render: function() {
    const x = this.model.getPosX({ width: this.overlay.width() });
    const y = this.model.getPosY({
      width: this.overlay.width(),
      height: this.overlay.height() });

    this.$el
      .html(this.template({
        projectionUrl: this.model.getProjection(),
      }))
      .attr('data-cid', this.model.cid)
      .css('zIndex', this.model.get('layerIndex'));
    this.moveable.moveTo({ x, y });
    this.$img = this.$el.children('img');

    return this;
  },

  setLayer: function(model) {
    this.$el.css('zIndex', model.get('layerIndex'));
  },

  resize: function() {
    this.$img.height(this.overlay.width() * this.model.get('scale'));
    this.$img.width(this.overlay.width() * this.model.get('scale'));
    return this;
  },

  updateProjection: function(model) {
    this.$img.attr('src', model.getProjection());
  },

  setUserActivity: function() {
    this.model.set('userActivity', true);
  },

  unsetUserActivity: function() {
    this.model.set('userActivity', false);
  },
});
