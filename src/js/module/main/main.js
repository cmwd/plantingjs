(function(Core, EVENT, Main) {
    
    Main.View.Main = Core.View.extend({
        toolbox: null, 
        map: null,
        className: 'plantingjs-container',
        template: _.template('\
            <div class="plantingjs-proxy">\
                <div class="plantingjs-startbtn">\
                    <span class="icon-menu-hamburger"></span>\
                     Start planting!\
                </div>\
                <div class="layers-menu"></div>\
                <div class="plantingjs-toolbox"></div>\
                <div class="plantingjs-overlay ui-droppable"></div>\
                <div class="plantingjs-google"></div>\
                <div class="plantingjs-dialog"></div>\
            </div>\
        '),
        events: {
            'click .plantingjs-startbtn': 'startPlanting'
        },

        $proxy: null,

        initialize: function(opts) {
            this.render();
            this.$proxy = this.$el.children();
            this.dialog = new Main.View.Dialog({
                el: this.el.querySelector('.plantingjs-dialog'),
                app: this.app
            });
            this.app
                .on(EVENT.VISIBLE_CHANGED, function(visible) {
                    this.$el.find('.plantingjs-startbtn').toggle(visible);
                }, this)
                .on(EVENT.START_PLANTING, function() {
                    this.$el.find('.plantingjs-startbtn').hide();
                }, this);
        },

        render: function() {

            this.$el.html(this.template());
        },

        startPlanting: function() {
            
            this.app.trigger(EVENT.START_PLANTING);
        }
    });
    
}(
    Planting.module('core'),
    Planting.Event,
    Planting.module('main') 
));
