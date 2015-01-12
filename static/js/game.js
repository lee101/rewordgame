gameon.loadSound('theme', 'http://commondatastorage.googleapis.com/wordsmashing%2Fws-piano-theme2.mp3');
gameon.loadSound('score', '/gameon/static/music/star.mp3');
gameon.loadSound('win', '/gameon/static/music/winning-level.mp3');
gameon.loadSound('moved', '/static/music/moved-letter.m4a');
gameon.loadSound('moving', '/static/music/moving-letter.m4a');

var mmochess = new (function () {
    "use strict";
    var self = this;

    self.Game = function (level) {
        var gameState = this;

        function construct() {
            gameon.pauseAll();
            gameon.loopSound("theme");

            gameState.players_turn = 1;
            var tiles = gameState.initialBoardTiles();
            gameState.board = new gameon.Board(level.width, level.height, tiles);

            var $html = $(evutils.render('templates/shared/game.jinja2'));
            gameState.board.render($html.find('.gameon-board'));
            gameState.destruct = function () {
                gameon.cleanBoards();
                gameon.pauseSound("theme");
            };

            if (level.is_multiplayer) {
                gameState.starBar = new gameon.StarBar(level.star_rating, 'progress-bar-danger');
                gameState.starBar.render($html.find('.mm-starbar'));
                gameState.starBar2 = new gameon.StarBar(level.star_rating, 'progress-bar-primary');
                gameState.starBar2.render($html.find('.mm-starbar2'));

                if (level.computer_opponent) {
                    gameState.aiHandler = new gameState.AIHandler();
                }
            }
            else {
                gameState.starBar = new gameon.StarBar(level.star_rating);

                gameState.starBar.render($html.find('.mm-starbar'));
            }
            gameState.starBar.setCenterMessage(level.min_num_letters_in_a_word + '+ letter words');


            gameon.renderVolumeTo($html.find('.mm-volume'));

            gameState.requiredWords = [].concat(level.required_words || []);
            var requiredWordsDiv = $html.find('.learn-english-level_required-words');

            for (var i = 0; i < gameState.requiredWords.length; i++) {
                var word = gameState.requiredWords[i];
                requiredWordsDiv.append('<button type="button" id="learn-english-words-' + word + '" class="learn-english-level_required-word btn">' +
                        word + '</button>'
                )
            }

            gameState.endHandler = new gameState.EndHandler();
            gameState.endHandler.render($html.find('.mm-end-condition'));
            gameState.$html = $html;

            if (level.id == 1) {
                window.setTimeout(function () {
                    var $firstLevelFirstTile = $('#firstLevelFirstTile');
                    $firstLevelFirstTile.popover('show');
                }, 400);
            }
            if (level.id == 2) {
                window.setTimeout(function () {
                    var $firstPopup = $('#firstPopup');
                    $firstPopup.popover('show');
                }, 400);
            }
            if (level.id == 3) {
                window.setTimeout(function () {
                    var $canMoveIfClearPath = $('#canMoveIfClearPath');
                    $canMoveIfClearPath.popover('show');
                }, 400);
            }
            else if (level.id == 4) {
                window.setTimeout(function () {
                    var halfgrownTile = gameState.board.viewWhere(function (tile) {
                        return tile.halfgrown;
                    }).get(0).getRenderedTile();
                    halfgrownTile.attr('data-toggle', 'popover');
                    halfgrownTile.attr('data-placement', 'top');
                    halfgrownTile.attr('data-trigger', 'manual');
                    halfgrownTile.attr('data-content', 'Each turn letters grow onto the board. When the board fills up its game over!');
                    halfgrownTile.popover('show');

                    window.setTimeout(function () {
                        halfgrownTile.popover('hide');
                    }, 8000);
                }, 400);
            }
            else if (level.id == 6) {
                window.setTimeout(function () {
                    var lockedTile = gameState.board.viewWhere(function (tile) {
                        return tile.locked;
                    }).get(0).getRenderedTile();
                    lockedTile.attr('data-toggle', 'popover');
                    lockedTile.attr('data-placement', 'top');
                    lockedTile.attr('data-trigger', 'manual');
                    lockedTile.attr('data-content', 'Break locks by getting a word nearby!');
                    lockedTile.popover('show');

                    window.setTimeout(function () {
                        lockedTile.popover('hide');
                    }, 7000);
                }, 400);
            }

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

        gameState.initialBoardTiles = function () {
            var tiles = [];

            for (var i = 0; i < level.width * level.height; i++) {
                tiles.push(new EmptyTile());
            }
            //TODO automate init
//            for (var i = 0; i < level.num_players; i++) {
//                initPlayerAt(tiles, [2, 2], 1);
//            }
            initPlayerAt(tiles, [2,2], 1);
            initPlayerAt(tiles, [11,2], 2);
            initPlayerAt(tiles, [2,11], 3);

            return tiles;
        };
        function initPlayerAt(tiles, yxPos, playerNum) {
            var y = yxPos[0];
            var x = yxPos[1];
            tiles[y * level.width + x] = new MainTile("pawn", playerNum);
            tiles[y * level.width + x+1] = new MainTile("pawn", playerNum);
            tiles[y * level.width + x+2] = new MainTile("pawn", playerNum);
            tiles[y * level.width + x+3] = new MainTile("pawn", playerNum);
            tiles[y * level.width + x+4] = new MainTile("pawn", playerNum);
            tiles[y * level.width + x+5] = new MainTile("pawn", playerNum);
            tiles[y * level.width + x+6] = new MainTile("pawn", playerNum);
            tiles[y * level.width + x+7] = new MainTile("pawn", playerNum);

            tiles[y+1 * level.width + x] = new MainTile("pawn", playerNum);
            tiles[y+2 * level.width + x] = new MainTile("pawn", playerNum);
            tiles[y+3 * level.width + x] = new MainTile("pawn", playerNum);
            tiles[y+4 * level.width + x] = new MainTile("pawn", playerNum);
            tiles[y+5 * level.width + x] = new MainTile("pawn", playerNum);
            tiles[y+6 * level.width + x] = new MainTile("pawn", playerNum);
            tiles[y+7 * level.width + x] = new MainTile("pawn", playerNum);

            tiles[y+7 * level.width + x+1] = new MainTile("pawn", playerNum);
            tiles[y+7 * level.width + x+2] = new MainTile("pawn", playerNum);
            tiles[y+7 * level.width + x+3] = new MainTile("pawn", playerNum);
            tiles[y+7 * level.width + x+4] = new MainTile("pawn", playerNum);
            tiles[y+7 * level.width + x+5] = new MainTile("pawn", playerNum);
            tiles[y+7 * level.width + x+6] = new MainTile("pawn", playerNum);
            tiles[y+7 * level.width + x+7] = new MainTile("pawn", playerNum);

            tiles[y+6 * level.width + x+7] = new MainTile("pawn", playerNum);
            tiles[y+5 * level.width + x+7] = new MainTile("pawn", playerNum);
            tiles[y+4 * level.width + x+7] = new MainTile("pawn", playerNum);
            tiles[y+3 * level.width + x+7] = new MainTile("pawn", playerNum);
            tiles[y+2 * level.width + x+7] = new MainTile("pawn", playerNum);
            tiles[y+1 * level.width + x+7] = new MainTile("pawn", playerNum);

            tiles[y+1 * level.width + x+1] = new MainTile("castle", playerNum);

            tiles[y+1 * level.width + x+2] = new MainTile("horse", playerNum);
            tiles[y+2 * level.width + x+1] = new MainTile("horse", playerNum);

            tiles[y+1 * level.width + x+3] = new MainTile("bishop", playerNum);
            tiles[y+3 * level.width + x+1] = new MainTile("bishop", playerNum);

            tiles[y+1 * level.width + x+4] = new MainTile("bishop", playerNum);
            tiles[y+4 * level.width + x+1] = new MainTile("bishop", playerNum);

            tiles[y+1 * level.width + x+5] = new MainTile("horse", playerNum);
            tiles[y+5 * level.width + x+1] = new MainTile("horse", playerNum);

            tiles[y+1 * level.width + x+6] = new MainTile("castle", playerNum);
            tiles[y+6 * level.width + x+1] = new MainTile("castle", playerNum);

            tiles[y+2 * level.width + x + 6] = new MainTile("horse", playerNum);
            tiles[y+6 * level.width + x + 2] = new MainTile("horse", playerNum);

            tiles[y+3 * level.width + x + 6] = new MainTile("bishop", playerNum);
            tiles[y+6 * level.width + x + 3] = new MainTile("bishop", playerNum);

            tiles[y+4 * level.width + x + 6] = new MainTile("bishop", playerNum);
            tiles[y+6 * level.width + x + 4] = new MainTile("bishop", playerNum);

            tiles[y + 5 * level.width + x + 6] = new MainTile("horse", playerNum);
            tiles[y + 6 * level.width + x + 5] = new MainTile("horse", playerNum);

            tiles[y + 6 * level.width + x + 6] = new MainTile("castle", playerNum);
        }

        gameState.currentSelected = null;
        gameState.unselectAll = function () {
            if (!gameState.currentSelected) {
                return;
            }
            gameState.currentSelected.selected = false;
            gameState.currentSelected.reRender();
            gameState.currentSelected = null;
        };

        gameState.moveFromTo = function (startTile, endTile) {

        };

        var EmptyTile = function () {
            var self = this;
            self.canPassThrough = true;

            self.click = function () {
                //moveto this
                var path = gameState.board.getPathFromTo(gameState.currentSelected, self);
                if (path) {
                    var animationSpeed = 200;
                    if (gameState.players_turn != 1 && level.computer_opponent) {
                        animationSpeed = 400;
                    }
                    gameon.unmuteSound('moving');
                    gameon.playSound('moving');
                    gameState.board.animateTileAlongPath(gameState.currentSelected, path, animationSpeed, function () {
                        gameState.endHandler.turnEnd(self, gameState.currentSelected);
                        gameon.muteSound('moving');
                        gameon.pauseSound('moving');
                    });
                }
            };

            self.render = function () {
                return '<div class="btn btn-lg btn-link"></div>';
            };
        };

        var MainTile = function (type, playerNum) {
            var self = new EmptyTile();

            self.type = type;
            self.points = 0;
            self.playerNum = playerNum;



            self.selected = false;

            self.render = function () {
                var pieceText = fixtures.pieces[type];
                if (self.playerNum === 1) {
                    pieceText = fixtures.whitePieces[type];
                }
                return '<button type="button" class="chess-piece chess-piece--player-'+playerNum+'">' + pieceText +
                    '</button>';
            };
            return self;
        };

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

            function showScore(word, score) {
                gameState.board.fadingPopup('<button type="button" class="btn btn-success">' +
                    gameon.wordutils.capitaliseFirstLetter(word) + ' ' + score + ' Points!</button>');
            }

            function showDouble() {
                gameState.board.fadingPopup('<button type="button" class="btn btn-success">Double Points!</button>');
            }

            function getCombo(comboCount) {
                gameState.board.fadingPopup('<button type="button" class="btn btn-success">' + comboCount + 'X Combo. ' + comboCount + ' Points!</button>');
                return comboCount;
            }

            function growTiles() {
                for (var y = 0; y < level.height; y++) {
                    for (var x = 0; x < level.width; x++) {
                        var currentTile = gameState.board.getTile(y, x);
                        currentTile.justgrown = false;
                        if (currentTile.halfgrown) {
                            currentTile.setHalfgrown(false);
                            currentTile.justgrown = true;
                        }
                    }
                }
            }

            //ungrows tiles which just grew (only works once)
            function unGrowTiles() {
                for (var y = 0; y < level.height; y++) {
                    for (var x = 0; x < level.width; x++) {
                        var currentTile = gameState.board.getTile(y, x);
                        if (currentTile.justgrown) {
                            currentTile.setHalfgrown(true);
                            currentTile.justgrown = false;
                        }
                        else {
                            currentTile.justgrown = false;
                        }
                    }
                }
            }


            function unlock(y, x) {
                if (!gameState.board.isInBoard(y, x)) {
                    return;
                }
                var tile = gameState.board.getTile(y, x);
                if (!tile.locked) {
                    return;
                }
                gameState.board.setTile(y, x, new EmptyTile());

            }

            function unlockVWord(startTile, endTile) {
                //unlocks a horizontal word takes two xy coordinate pairs
                //try left and right
                unlock(startTile.yPos - 1, startTile.xPos);
                unlock(endTile.yPos + 1, endTile.xPos);
                for (var i = startTile.yPos; i <= endTile.yPos; i++) {
                    unlock(i, startTile.xPos + 1);
                    unlock(i, endTile.xPos - 1);
                }
            }

            function unlockHWord(startTile, endTile) {
                //unlocks a horizontal word takes two xy coordinate pairs
                //try left and right
                unlock(startTile.yPos, startTile.xPos - 1);
                unlock(endTile.yPos, endTile.xPos + 1);
                for (var i = startTile.xPos; i <= endTile.xPos; i++) {
                    unlock(startTile.yPos + 1, i);
                    unlock(startTile.yPos - 1, i);
                }
            }

            endSelf.addToScore = function (score) {
            };


            function inRequiredWord(word) {
                var reverseword = word.reverse();
                for (var i = 0; i < gameState.requiredWords.length; i++) {
                    if (gameState.requiredWords[i].indexOf(word) != -1) {
                        return true;
                    }
                    if (gameState.requiredWords[i].indexOf(reverseword) != -1) {
                        return true;
                    }
                }
                return false;
            }

            function isRequiredWord(word) {
                for (var i = 0; i < gameState.requiredWords.length; i++) {
                    if (gameState.requiredWords[i] === word) {
                        return true;
                    }
                }
                return false;
            }

            function removeRequiredWord(word) {
                for (var i = 0; i < gameState.requiredWords.length; i++) {
                    if (gameState.requiredWords[i] === word) {
                        //preserve end then pop off
                        var endPos = gameState.requiredWords.length - 1;
                        gameState.requiredWords[i] = gameState.requiredWords[endPos];
                        gameState.requiredWords.pop();
                        return;
                    }
                }
            }

            var numRequiredWordsFound = 0;

            function updateRequiredWordsView(word) {
                removeRequiredWord(word);
                numRequiredWordsFound++;
                $('#learn-english-words-' + word).addClass('btn-success');
                if (numRequiredWordsFound >= level.required_words.length) {
                    gameState.endHandler.gameOver();
                }
            }

            endSelf.turnEnd = function (startTile, endTile) {
                //figure out if endtile should be removed(ifpiece is taken)
                gameState.board.swapTiles(startTile, endTile);

                //

                gameon.shuffle(growers);
                //place them
                var currpos = 0;
                for (var y = 0; y < level.height; y++) {
                    for (var x = 0; x < level.width; x++) {

                        if (!gameState.board.getTile(y, x).letter && !gameState.board.getTile(y, x).blocked) {
                            if (growers[currpos].letter) {
                                gameState.board.setTile(y, x, growers[currpos])
                            }
                            currpos++
                        }
                    }
                }
                if (level.is_multiplayer) {
                    if (gameState.players_turn == 1) {
                        gameState.players_turn = 2;
                        if (level.computer_opponent) {
                            gameState.aiHandler.makeAiMove();
                        }
                    }
                    else {
                        gameState.players_turn = 1;
                    }
                }

                gameState.board.render();
            };
            endSelf.scoreMove = function (startTile, endTile) {

                // == 1 simulate move on the board

                gameState.board.swapTiles(startTile, endTile);
                var tmp = endTile;
                endTile = startTile;
                startTile = tmp;

                growTiles();


                // == 2 score the move
                var currentMovesScore = 0;
                ///////////////////////////////////
                var matches = 0;
                var scores = 0;
                ////////////////check horizontally then vertically
                var numLeft = 0;
                var numRight = 0;
                var x = endTile.xPos;
                while (x > 0) {
                    x--;
                    if (!gameState.board.getTile(endTile.yPos, x).letter) {
                        break;
                    }
                    numLeft++
                }
                var x = endTile.xPos;
                while (x < level.width - 1) {
                    x++;
                    if (!gameState.board.getTile(endTile.yPos, x).letter) {
                        break;
                    }
                    numRight++
                }
                var startlen = numRight + numLeft + 1;

                //try all lengths down to difficulty (2 3 or 4)
                //
                //drag leftStart and rightStart alongto consider all possibilities
                hfinder:
                    while (startlen >= fixtures.EASY) {
                        //try options
                        //go as far left as pos while still including endTile.xPos
                        var leftStart = endTile.xPos;
                        for (var i = 0; i < startlen - 1 && leftStart - 1 >= 0; i++) {
                            if (!gameState.board.getTile(endTile.yPos, leftStart - 1).letter) {
                                break;
                            }
                            leftStart--
                        }
                        var rightStart = leftStart + startlen - 1;
                        //consider all options from leftStart

                        for (; leftStart <= endTile.xPos && rightStart <= numRight + endTile.xPos; leftStart++, rightStart++) {



                            //take startlen characters starting at leftStart+i
                            var possibleword = "";
                            for (var j = leftStart; j <= rightStart; j++) {
                                possibleword += gameState.board.getTile(endTile.yPos, j).letter
                            }
                            possibleword = possibleword.toLowerCase();

                            if (words[possibleword]) {
                                //scoreword
                                matches = 1;
                                scores = gameon.wordutils.scoreWord(possibleword);
                                currentMovesScore += scores;
                            }
                            else if (words[possibleword.reverse()]) {
                                //scoreword
                                matches = 1;
                                scores = gameon.wordutils.scoreWord(possibleword);
                                currentMovesScore += scores;
                            }
                            if (matches >= 1) {
                                break hfinder;
                            }
                        }

                        startlen--
                    }
                ////////// Vertical check
                var numTop = 0;
                var numBottom = 0;
                var y = endTile.yPos;
                while (y > 0) {
                    y--;
                    if (!gameState.board.getTile(y, endTile.xPos).letter) {
                        break;
                    }
                    numTop++
                }
                var y = endTile.yPos;
                while (y < level.height - 1) {
                    y++;
                    if (!gameState.board.getTile(y, endTile.xPos).letter) {
                        break;
                    }
                    numBottom++
                }
                var startlen = numBottom + numTop + 1;

                //try all lengths down to 3
                //
                //drag topStart and bottomStart alongto consider all possibilities
                vfinder:
                    while (startlen >= fixtures.EASY) {
                        //try options
                        //go as far left as pos while still including endTile.xPos
                        var topStart = endTile.yPos;
                        for (var i = 0; i < startlen - 1 && topStart - 1 >= 0; i++) {
                            if (!gameState.board.getTile(topStart - 1, endTile.xPos).letter) {
                                break;
                            }
                            topStart--
                        }
                        var bottomStart = topStart + startlen - 1;
                        //consider all options from topStart

                        for (; topStart <= endTile.yPos && bottomStart <= numBottom + endTile.yPos; topStart++, bottomStart++) {


                            possibleword = "";
                            for (var j = topStart; j <= bottomStart; j++) {
                                possibleword += gameState.board.getTile(j, endTile.xPos).letter
                            }
                            possibleword = possibleword.toLowerCase();
                            if (words[possibleword]) {
                                //scoreword
                                matches++;
                                var currentWordsScore = gameon.wordutils.scoreWord(possibleword);
                                scores += currentWordsScore;
                                currentMovesScore += currentWordsScore;
                            }
                            else if (words[possibleword.reverse()]) {
                                //scoreword
                                matches++;
                                var currentWordsScore = gameon.wordutils.scoreWord(possibleword);
                                scores += currentWordsScore;
                                currentMovesScore += currentWordsScore;
                            }
                            if (matches >= 1) {
                                break vfinder;
                            }
                        }

                        startlen--
                    }
                //getdouble
                if (matches == 2) {
                    currentMovesScore += scores;
                }

                ///////////////////////////////////
                // == 3 rollback the board
                gameState.board.swapTiles(startTile, endTile);
                unGrowTiles();

                return currentMovesScore
            };


            endSelf.gameOver = function () {
                if ($.isNumeric(level.id)) {
                    gameon.getUser(function (user) {
                        user.saveScore(level.id, gameState.starBar.getScore());
                        if (gameState.starBar.hasWon()) {
                            if (user.levels_unlocked < level.id) {
                                user.saveLevelsUnlocked(level.id);
                                var numLevels = fixtures.getLevelsByDifficulty(level.difficulty).length;
                                if (user.levels_unlocked % numLevels === 0) {
                                    user.saveDifficultiesUnlocked(user.difficulties_unlocked + 1);
                                }
                            }
                        }
                    });
                }

                gameState.destruct();
                APP.doneLevel(gameState.starBar, gameState.starBar2, level);
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

        gameState.AIHandler = function () {
            var AISelf = {};

            AISelf.makeAiMove = function () {
                //TODO figure out if people can move!
                gameon.blockUI();

                //find a place to move to
                // - find all blue movables
                var blueTiles = [];
                for (var y = 0; y < level.height; y++) {
                    for (var x = 0; x < level.width; x++) {
                        var currentTile = gameState.board.getTile(y, x);
                        if (currentTile.isRed == false &&
                            currentTile.letter && !currentTile.halfgrown) {

                            blueTiles.push(currentTile);
                        }
                    }
                }
                //get the move with best score
                var maxScoreMove = [
                    gameState.board.getTile(0, 0),
                    gameState.board.getTile(0, 0)
                ];
                var maxScore = 0;
                var totalNumMovesFound = 0;
                for (var i = 0; i < blueTiles.length; i++) {
                    var allMovesFrom = gameState.board.getAllReachableTilesFrom(blueTiles[i]);
                    totalNumMovesFound += allMovesFrom.length;
                    for (var j = 0; j < allMovesFrom.length; j++) {
                        var currentMovesScore = gameState.endHandler.scoreMove(blueTiles[i], allMovesFrom[j]);
                        if (currentMovesScore >= maxScore) {
                            maxScore = currentMovesScore;
                            maxScoreMove = [blueTiles[i], allMovesFrom[j]];
                        }
                    }
                }
                if (totalNumMovesFound == 0) {
                    //no moves! TODO something
                    gameState.endHandler.gameOver();
                    gameon.unblockUI()
                }

                //update view
                maxScoreMove[0].click();
                setTimeout(function () {
                    //move there
                    maxScoreMove[1].click();
//                    gameon.unblockUI();
                    //gameState.unselectAll();
                }, 800);
            };


            return AISelf;
        };

        gameState.render = function (target) {
            gameState.$target = $(target);
            gameState.$target.html(gameState.$html);
        };

        construct();
        return gameState;
    }


})();
