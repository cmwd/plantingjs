import jquery from 'jquery';
import { View, Collection } from 'backbone';
import template from './sidebar.hbs';
import { Event } from 'const';

const USER_ACTIVE_CLASS = 'is-user-active';
const ACTIVITY_TIMEOUT_VALUE = 1500;

export default View.extend({
  className: 'plantingjs-toolbox',
  events: {
    'dragstart .js-draggable-object': 'onDragStart',
    'mouseenter': 'onMouseEnter',
    'mouseleave': 'onMouseLeave',
  },
  userActivityTimeout: null,
  mouseOver: false,
  constructor({ app, ...opts }) {
    this.app = app;
    View.call(this, opts);
  },

  initialize() {
    this.render();
    this.app.on(Event.START_PLANTING, () => {
      this.renewUserActivity(ACTIVITY_TIMEOUT_VALUE * 3);
    });
  },

  render() {
    const objects = this.collection
      .toJSONMultiply(5);

    this.$el.html(template({ objects }));
    this.makeObjectsDraggable();
  },

  makeObjectsDraggable() {
    const config = {
      containment: '.plantingjs-overlay',
      helper: 'clone',
      appendTo: '.plantingjs-overlay',
      zIndex: 10000,
    };

    this.$el.find('.js-draggable-object')
      .draggable(config);
  },

  onDragStart(el) {
    const $el = jquery(el.currentTarget);
    const object = this.collection
      .getToolboxObjects()
      .find(({ objectId }) => objectId === $el.data('objectId'));
    console.log(object);
    // const model = this.collection.get(cid).clone();

    // $el.data('model', model.toJSON());
  },

  onMouseEnter() {
    this.mouseOver = true;
    this.renewUserActivity();
  },

  onMouseLeave() {
    this.mouseOver = false;
    this.renewUserActivity();
  },

  renewUserActivity(timeout = ACTIVITY_TIMEOUT_VALUE) {
    this.$el.toggleClass(USER_ACTIVE_CLASS, true);
    clearTimeout(this.userActivityTimeout);
    this.userActivityTimeout = setTimeout(() => {
      if (this.mouseOver) {
        this.renewUserActivity(timeout);
        return;
      }

      this.$el.toggleClass(USER_ACTIVE_CLASS, false);
    }, timeout);
  },
});
