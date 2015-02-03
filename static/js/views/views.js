(function () {
    "use strict";
    window.APP = window.APP || {Routers: {}, Collections: {}, Models: {}, Views: {}};

    APP.Views['/'] = Backbone.View.extend({
        initialize: function (options) {
        },

        render: function () {
            this.$el.html(evutils.render('static/templates/shared/start.jinja2'));

            return this;
        }
    });

    var onePlayerLevel = Backbone.View.extend({
        initialize: function (options) {
        },

        render: function () {
            var self = this;

            var level = {
                "computer_opponent": true,
                "height": 12 * 3,
                "width": 12 * 2,
                "num_players": 6,
                "num_human_players": 1
            };

            APP.game = new mmochess.Game(level);
            APP.game.render(self.$el);

            return self;
        }
    });
    APP.Views['/play'] = onePlayerLevel;


    APP.Views['/done-level'] = Backbone.View.extend({
        initialize: function (options) {
            this.level = options.args[0];
        },

        render: function () {

        }

    });

    APP.Views['/versus'] = Backbone.View.extend({
        initialize: function (options) {
        },

        render: function () {
            this.$el.html(evutils.render('static/templates/shared/versus.jinja2'));
            return this;
        }
    });

    APP.Views['/versus/1player'] = onePlayerLevel;

    APP.Views['/versus/2player'] = Backbone.View.extend({
        initialize: function (options) {
        },

        render: function () {
            var self = this;

            var level = {
                "computer_opponent": true,
                "height": 12 * 3,
                "width": 12 * 2,
                "num_players": 6,
                "num_human_players": 2
            };

            APP.game = new mmochess.Game(level);
            APP.game.render(self.$el);

            return self;
        }
    });

    APP.Views['/versus/3player'] = Backbone.View.extend({
        initialize: function (options) {
        },

        render: function () {
        }
    });

    APP.Views['/contact'] = Backbone.View.extend({
        initialize: function (options) {
        },

        render: function () {
            this.$el.html(evutils.render('static/templates/shared/contact.jinja2'));
            return this;
        }
    });

    APP.Views['/about'] = Backbone.View.extend({
        initialize: function (options) {
        },

        render: function () {
            this.$el.html(evutils.render('static/templates/shared/about.jinja2'));
            return this;
        }
    });
    APP.Views['/terms'] = Backbone.View.extend({
        initialize: function (options) {
        },

        render: function () {
            this.$el.html(evutils.render('static/templates/shared/terms.jinja2'));
            return this;
        }
    });
    APP.Views['/privacy'] = Backbone.View.extend({
        initialize: function (options) {
        },

        render: function () {
            this.$el.html(evutils.render('static/templates/shared/privacy.jinja2'));
            return this;
        }
    });


    APP.Views.Header = Backbone.View.extend({
        initialize: function (options) {
            this.path = options.path;
        },

        render: function () {
            var self = this;
            gameon.getUser(function (user) {
                self.$el.html(evutils.render('static/templates/shared/header.jinja2', {'path': self.path, 'user': user}));
            });

            return self;
        }
    });

    APP.Views.Footer = Backbone.View.extend({
        initialize: function (options) {
            this.path = options.path;
        },

        render: function () {
            this.$el.html(evutils.render('static/templates/shared/footer.jinja2', {'path': this.path}));
            return this;
        }
    });

}());
