import { View, compose } from 'core';
import MainViewDialog from 'module/main/dialog';
import Const from 'const';
import Button from '../component/button';
import Sidebar from '../toolbox/sidebar';
import objectsCollection from './objects-collection';
import { Collection } from 'backbone';

const IS_PLANTING_CLASS = 'is-planting';

const MainViewMain = View.extend({
  toolbox: null,
  map: null,
  className: 'plantingjs-container',
  template: require('./main.hbs'),
  events: {
    'click .plantingjs-startbtn': 'startPlanting',
  },

  $proxy: null,

  initialize: function({ manifesto }) {
    const ObjectsCollection = compose(Collection, [objectsCollection], this.app);

    this.collection = new ObjectsCollection(manifesto.toolboxobjects);
    this.render();
    this.submit = new Button({
      defaults: {
        modifier: 'finish-session',
        label: 'zrobione!',
        visible: false,
      },
    });
    this.submit.delegateEvents({
      click: this.onClickSubmit,
    });
    this.$proxy = this.$el.children();
    this.$proxy.append(this.submit.$el);
    this.dialog = new MainViewDialog({
      el: this.el.querySelector('.plantingjs-dialog'),
      app: this.app,
    });
    this.toolbox = new Sidebar({
      app: this.app,
      el: this.el.querySelector('.plantingjs-toolbox'),
      collection: this.collection,
    });
    this.app
      .on(Const.Event.VISIBLE_CHANGED, function(visible) {
        if (this.app.getState() !== Const.State.VIEWER) {
          this.$el.find('.plantingjs-startbtn').toggle(visible);
        }
      }, this)
      .on(Const.Event.START_PLANTING, function() {
        this.$el.find('.plantingjs-startbtn').hide();
        this.$el.toggleClass(IS_PLANTING_CLASS, true);
        this.submit.model.set('visible', true);
      }, this)
      .on(Const.Event.STATE_CHANGED, function(state) {
        this.$el
          .children().attr('data-state', state);
      }, this);
  },

  render: function() {
    this.$el.html(this.template());
  },

  startPlanting: function() {
    this.app.trigger(Const.Event.START_PLANTING);
  },

  onClickSubmit(event) {
    /**
     * @todo
     * Show submit popup. For now just save session.
     */
    event.preventDefault();
    this.session().save();
  },
});

const Main = {
  View: {
    Main: MainViewMain,
    Dialog: MainViewDialog,
  },
};

module.exports = Main;
