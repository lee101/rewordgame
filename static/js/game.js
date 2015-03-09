var rewordgame = (function () {
    "use strict";
    var self = {};

    self.Game = function (level) {
        var gameState = {};

        function construct() {

            var $html = $(evutils.render('static/templates/shared/game.jinja2'));
            var draggingStates = [];
            for (var i = 0; i < level.words.length; i++) {
                draggingStates.push(false);
            }
            var $words = $('<div class="reword-words"></div>');
            for (var i = 0; i < level.words.length; i++) {

                var createReword = function (idx) {
                    var reSelf = {};

                    reSelf.stopDragging = function () {
                        self.isDragging = false;
                        $('body').removeClass('cursor-grabbing')
                    };
                    reSelf.startDragging = function () {
                        self.isDragging = true;
                        $('body').addClass('cursor-grabbing')
                    };

                    var word = level.words[idx];
                    var $wordEl = $('<div class="reword-word underline" data-index="' + idx + '">' + word + '</div>');

                    $wordEl.on('mousedown', function (evt) {
                        draggingStates[idx] = true;
                    });
                    $(document).on('mousemove', function (evt) {
                        if (draggingStates[idx]) {
                            var mousePosX = evt.pageX;
                            var mousePosY = evt.pageY;

                            $wordEl.css({
                                left: mousePosX - $wordEl.width() / 2,
                                top: mousePosY - $wordEl.height()
                            });
                        }
                    });
                    $(document).on('mouseup', function (evt) {
                        reSelf.stopDragging();
                    });

                    reSelf.render = function () {
                        return $wordEl;
                    };
                    return reSelf;
                };
                var word = createReword(i);
                $words.append(word.render());
            }

            $html.append($words);

            gameState.endHandler = new gameState.EndHandler();
            gameState.endHandler.render($html.find('.mm-end-condition'));
            gameState.$html = $html;


            if (typeof GAMESAPI === 'object') {
                GAMESAPI.beginGameSession(
                    function (response) {
                        // success callback.  response.statusCode == 200
                    },
                    function (response) {
                        // error handler callback.  response.statusCode != 200
                    }
                );
            }
        }


        gameState.EndHandler = function () {
            var endSelf = {};
            endSelf.moves = level.moves;
            endSelf.render = function (target) {
                endSelf.$target = $(target);
                if (level.moves) {
                    endSelf.$target.html('<p>Moves: ' + endSelf.moves + '</p>');
                }
                else {
                    endSelf.$target.html('<p>Time: <span class="gameon-clock"></span></p>');
                }
            };
            endSelf.setMoves = function (moves) {
                endSelf.moves = moves;
                if (moves <= 0) {
                    //todo settimeout so they can watch successanimation
                    endSelf.gameOver();
                    return;
                }
                endSelf.render(endSelf.$target);
            };

            endSelf.addToScore = function (score) {
            };

            endSelf.turnEnd = function () {
            };


            endSelf.gameOver = function () {

                gameState.destruct();
                APP.doneLevel(level);
                if (typeof GAMESAPI === 'object') {
                    GAMESAPI.postScore(gameState.starBar.getScore(), function () {
                    }, function () {
                    });
                    GAMESAPI.endGameSession(
                        function (response) {
                            // success callback.  response.statusCode == 200
                        },
                        function (response) {
                            // error handler callback.  response.statusCode != 200
                        }
                    );
                }
            };

            return endSelf;
        };


        gameState.render = function (target) {
            gameState.$target = $(target);
            gameState.$target.html(gameState.$html);
        };

        construct();
        return gameState;
    };

    return self;
})();
