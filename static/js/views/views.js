(function () {
    "use strict";
    window.APP = window.APP || {Routers: {}, Collections: {}, Models: {}, Views: {}};

    APP.Views['/'] = Backbone.View.extend({
        initialize: function (options) {
        },

        render: function () {
            this.$el.html(evutils.render('templates/shared/start.jinja2'));

            return this;
        }
    });

    APP.Views['/play'] = Backbone.View.extend({
        initialize: function (options) {
        },

        render: function () {
            var self = this;

            var level = {
                "computer_opponent": true,
                "height": 12*3,
                "width": 12*2,
                "num_players": 6
            };

            APP.game = new mmochess.Game(level);
            APP.game.render(self.$el);

            return self;
        }
    });


    APP.Views['/done-level'] = Backbone.View.extend({
        initialize: function (options) {
            this.level = options.args[0];
        },

        render: function () {

            var self = this;

            var $html = $(evutils.render('templates/shared/done-level.jinja2'));
            self.$el.html($html);

            $html.find('#mm-replay').click(function () {
                APP.gotoLevelSilently(self.level);
            });
            var endMessage = $html.find('.mm-end-message p');
            if (self.level.is_multiplayer) {
                if (self.level.computer_opponent) {
                    if (self.starBar.getScore() > self.starBar2.getScore()) {
                        endMessage.html('You Win!!!!');
                        gameon.loopSound('win');
                    }
                    else if (self.starBar.getScore() == self.starBar2.getScore()) {
                        endMessage.html('Tie!');
                    }
                    else {
                        endMessage.html('Blue Wins. Try Again!');
                    }
                }
                else {
                    if (self.starBar.getScore() > self.starBar2.getScore()) {
                        endMessage.html('Red Wins!');
                    }
                    else if (self.starBar.getScore() == self.starBar2.getScore()) {
                        endMessage.html('Tie!');
                    }
                    else {
                        endMessage.html('Blue Wins!');
                    }
                }
            }
            else if (self.starBar.numStars == 0) {
                endMessage.html('Try Again!');
            }
            else if (self.starBar.numStars == 1) {
                endMessage.html('Good!');
            }
            else if (self.starBar.numStars == 2) {
                endMessage.html('Great!');
            }
            endMessage.fadeIn();
            if (self.starBar.movesBonus && self.starBar.movesBonus.bonus) {
                $html.find('.mm-bonus-message').append(
                        'Moves Bonus: ' + self.starBar.movesBonus.bonus +
                        ' Points!'
                );
            }
            else if (self.starBar.timeBonus && self.starBar.timeBonus.bonus) {
                $html.find('.mm-bonus-message').append(
                        'Time Bonus: ' + self.starBar.timeBonus.bonus +
                        ' Points!'
                );
            }
            if (self.starBar.hasWon() && self.isLastLevel(self.level)) {
                endMessage.append(' <br /> Congratulations You have Won The Game!!!');
            }
            if (self.starBar.hasWon()) {
                gameon.loopSound('win');
            }
            $('.mm-responsivead-bottom').show();

            return self;
        },
        isLastLevel: function (lvl) {
            return lvl.id === fixtures.LEVELS[fixtures.LEVELS.length - 1].id;
        },
        nextLevel: function (level) {
            var nextLevel = fixtures.LEVELS[level.id];
            APP.gotoLevel(nextLevel);
        }

    });

    APP.Views['/versus'] = Backbone.View.extend({
        initialize: function (options) {
        },

        render: function () {
            this.$el.html(evutils.render('templates/shared/versus.jinja2'));
            return this;
        }
    });

    APP.Views['/versus/1player'] = Backbone.View.extend({
        initialize: function (options) {
        },

        render: function () {
            var self = this;

            var level = {
                "blocked_spaces": [],
                "growth_rate": 4,
                "id": null,
                "moves": 999,
                "time_left": null,
                "num_start_letters": 14,
                "difficulty": 3,
                "locked_spaces": [],
                "height": 9,
                "width": 9,
                "star_rating": [900],
                "is_multiplayer": true,
                "min_num_letters_in_a_word": 3,
                "computer_opponent": true
            };

            APP.game = new mmochess.Game(level);
            APP.game.render(self.$el);

            return self;
        }
    });

    APP.Views['/versus/2player'] = Backbone.View.extend({
        initialize: function (options) {
        },

        render: function () {
            var self = this;

            var level = {
                "blocked_spaces": [],
                "growth_rate": 4,
                "id": null,
                "moves": 999,
                "time_left": null,
                "num_start_letters": 14,
                "difficulty": 3,
                "locked_spaces": [],
                "height": 9,
                "width": 9,
                "star_rating": [900],
                "is_multiplayer": true,
                "min_num_letters_in_a_word": 3,
                "computer_opponent": false
            };

            APP.game = new mmochess.Game(level);
            APP.game.render(self.$el);

            return self;
        }
    });

    APP.Views['/contact'] = Backbone.View.extend({
        initialize: function (options) {
        },

        render: function () {
            this.$el.html(evutils.render('templates/shared/contact.jinja2'));
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
