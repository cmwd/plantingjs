import { View } from '../../core';
import Template from './button.hbs';
import { Model } from 'backbone';
import { isFunction } from 'underscore';

export default View.extend({
  tagName: 'a',
  template: Template,
  attributes: {
    href: '#'
  },

  constructor(args) {
    const defaults = {...args.defaults};
    this.model = new Model(defaults);

    const modifier = this.model.get('modifier');
    const blockName = 'plantingjs-component-button';
    let classes = [`${blockName}`];

    if (modifier) {
      classes.push(`${blockName}-${modifier}`);
    }

    this.className = classes.join(' ');
    View.call(this, args);

    window.ButtonTest = this;
  },

  initialize() {
    this.model.on('change', this.render, this);
    this.render();
  },

  render() {
    const view = this.template(this.model.toJSON());
    this.$el
        .html(view)
        .toggleClass('hidden', !this.model.get('visible'));
  },

  onClick(event) {
    console.log(this);
  }
});