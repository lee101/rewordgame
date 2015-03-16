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

            var $mouseFollower = $('#mouse-follower');

            var $words = $('<div class="reword-words"></div>');
            for (var i = 0; i < level.words.length; i++) {

                var createReword = function (idx) {
                    var reSelf = {};

                    var word = level.words[idx];

                    var unmovableClass = '';
                    if (level.unmovables[idx]) {
                        reSelf.unmovable = true;
                        unmovableClass = ' reword-word--unmovable'
                    }
                    var $wordEl = $('<div class="reword-word' + unmovableClass + '" data-index="' + idx + '">' + word + '</div>');

                    reSelf.stopDragging = function () {
                        if (draggingStates[idx]) {
                            gameState.endHandler.turnEnd($words.find('.reword-word'));
                        }
                        draggingStates[idx] = false;
                        $('body').removeClass('cursor-grabbing');
                        $wordEl.removeClass('reword-word--selected');
                        $mouseFollower.hide();
                    };
                    reSelf.startDragging = function () {
                        draggingStates[idx] = true;
                        $('body').addClass('cursor-grabbing');
                        $mouseFollower.show();
                    };


                    $wordEl.on('mousedown', function (evt) {
                        if (reSelf.unmovable) {
                            return false;
                        }
                        reSelf.startDragging();
                        reSelf.mouseMove(evt);
                        return false;
                    });
                    reSelf.swapAnimate = function ($wordEl1, $wordEl2) {
                        animateTransitionFinished = false;

                        var w1idx = $wordEl1.data('index');
                        var w2idx = $wordEl2.data('index');
                        $wordEl1.data('index', w2idx);
                        $wordEl2.data('index', w1idx);

                        $wordEl2.animate({left: -$wordEl1.outerWidth()}, 100);
                        $wordEl1.animate({left: $wordEl2.outerWidth()}, 100, function () {
                            $wordEl2.detach();
                            $wordEl1.before($wordEl2);
                            $wordEl2.css({left: 0});
                            $wordEl1.css({left: 0});
                            animateTransitionFinished = true;
                        })
                    };
                    var animateTransitionFinished = true;
                    reSelf.mouseMove = function (evt) {
                        if (draggingStates[idx]) {
                            var mousePosX = evt.pageX;
                            var mousePosY = evt.pageY;

                            $wordEl.addClass('reword-word--selected');

                            $mouseFollower.text(word);
                            $mouseFollower.css({
                                left: mousePosX - $wordEl.width() / 2,
                                top: mousePosY - $wordEl.height()
                            });

                            if (animateTransitionFinished) {
                                //todo get previous child properly
                                var $previous = $wordEl.prev();
                                if ($previous.length > 0) {
                                    var $previousBeforePos = $previous.offset().left + ($previous.outerWidth() / 2);
                                    if (mousePosX < $previousBeforePos) {
                                        reSelf.swapAnimate($previous, $wordEl)
                                    }
                                }
                                var $next = $wordEl.next();
                                if ($next.length > 0) {
                                    var $previousAfterPos = $next.offset().left + ($next.outerWidth() / 2);
                                    if (mousePosX >= $previousAfterPos) {
                                        reSelf.swapAnimate($wordEl, $next)
                                    }
                                }
                            }
                        }
                    };

                    $(document).on('mousemove', reSelf.mouseMove);
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

            endSelf.turnEnd = function ($words) {
                for (var i = 0; i < $words.length; i++) {
                    var $word = $words.eq(i);
                    if ($word.data('index') != level.correct_ordering[i]) {
                        return false;
                    }
                }
                //show done

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
