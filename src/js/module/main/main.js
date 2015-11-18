import { View } from 'core';
import MainViewDialog from 'module/main/dialog';
import { Event, State } from 'const';

const MainViewMain = View.extend({
  toolbox: null,
  map: null,
  className: 'plantingjs-container',
  template: require('./main.hbs'),
  events: {
    'click .plantingjs-startbtn': 'startPlanting',
  },

  $proxy: null,

  initialize: function() {
    this.render();
    this.$proxy = this.$el.children();
    this.dialog = new MainViewDialog({
      el: this.el.querySelector('.plantingjs-dialog'),
      app: this.app,
    });
    this.app
      .on(Event.VISIBLE_CHANGED, function(visible) {
        if (this.app.getState() !== State.VIEWER) {
          this.$el.find('.plantingjs-startbtn').toggle(visible);
        }
      }, this)
      .on(Event.START_PLANTING, function() {
        this.$el.find('.plantingjs-startbtn').hide();
      }, this)
      .on(Event.STATE_CHANGED, function(state) {
        this.$el
          .children().attr('data-state', state);
      }, this);
  },

  render: function() {
    this.$el.html(this.template());
  },

  startPlanting: function() {
    this.app.trigger(Event.START_PLANTING);
  },
});

const Main = {
  View: {
    Main: MainViewMain,
    Dialog: MainViewDialog,
  },
};

module.exports = Main;
