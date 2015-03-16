(function () {
    "use strict";
    window.APP = window.APP || {Routers: {}, Collections: {}, Models: {}, Views: {}};

    var levels = [
        {
            "words": ['Word', 're', 'Game'],
            "correct_ordering": [1,0,2]
        },
        {
            "words": ['this', 'doesn\'t', 'sense', 'make'],
            "correct_ordering": [0, 1, 3, 2]
        },
        {
            "words": ['and', 'this', 'puzzle', 'spans', 'multiple lines', 'the', 'test of time'],
            "correct_ordering": [1,2,3,4,0,5,6],
            "unmovables": {
                4:1,
                6:1
            }
        },
    ]

    APP.Views['/'] = Backbone.View.extend({
        initialize: function (options) {
        },

        render: function () {
            var self = this;

            var level = levels[2];

            APP.game = new rewordgame.Game(level);
            APP.game.render(self.$el);

            return self;
        }
    });


    APP.Views['/done-level'] = Backbone.View.extend({
        initialize: function (options) {
            this.level = options.args[0];
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
