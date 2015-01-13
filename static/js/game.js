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

            var $html = $(evutils.render('static/templates/shared/game.jinja2'));
            gameState.board.render($html.find('.gameon-board'));
            gameState.destruct = function () {
                gameon.cleanBoards();
                gameon.pauseSound("theme");
            };

            if (level.computer_opponent) {
                gameState.aiHandler = new gameState.AIHandler();
            }


            gameon.renderVolumeTo($html.find('.mm-volume'));

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
            initPlayerAt(tiles, [14,2], 2);
            initPlayerAt(tiles, [2,14], 3);
            initPlayerAt(tiles, [14,14], 4);
            initPlayerAt(tiles, [26,14], 5);
            initPlayerAt(tiles, [26,2], 6);

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

            tiles[(y+1) * level.width + x] = new MainTile("pawn", playerNum);
            tiles[(y+2) * level.width + x] = new MainTile("pawn", playerNum);
            tiles[(y+3) * level.width + x] = new MainTile("pawn", playerNum);
            tiles[(y+4) * level.width + x] = new MainTile("pawn", playerNum);
            tiles[(y+5) * level.width + x] = new MainTile("pawn", playerNum);
            tiles[(y+6) * level.width + x] = new MainTile("pawn", playerNum);
            tiles[(y+7) * level.width + x] = new MainTile("pawn", playerNum);

            tiles[(y+7) * level.width + x+1] = new MainTile("pawn", playerNum);
            tiles[(y+7) * level.width + x+2] = new MainTile("pawn", playerNum);
            tiles[(y+7) * level.width + x+3] = new MainTile("pawn", playerNum);
            tiles[(y+7) * level.width + x+4] = new MainTile("pawn", playerNum);
            tiles[(y+7) * level.width + x+5] = new MainTile("pawn", playerNum);
            tiles[(y+7) * level.width + x+6] = new MainTile("pawn", playerNum);
            tiles[(y+7) * level.width + x+7] = new MainTile("pawn", playerNum);

            tiles[(y+6) * level.width + x+7] = new MainTile("pawn", playerNum);
            tiles[(y+5) * level.width + x+7] = new MainTile("pawn", playerNum);
            tiles[(y+4) * level.width + x+7] = new MainTile("pawn", playerNum);
            tiles[(y+3) * level.width + x+7] = new MainTile("pawn", playerNum);
            tiles[(y+2) * level.width + x+7] = new MainTile("pawn", playerNum);
            tiles[(y+1) * level.width + x+7] = new MainTile("pawn", playerNum);

            tiles[(y+1) * level.width + x+1] = new MainTile("castle", playerNum);

            tiles[(y+1) * level.width + x+2] = new MainTile("horse", playerNum);
            tiles[(y+2) * level.width + x+1] = new MainTile("horse", playerNum);

            tiles[(y+1) * level.width + x+3] = new MainTile("bishop", playerNum);
            tiles[(y+3) * level.width + x+1] = new MainTile("bishop", playerNum);

            tiles[(y+1) * level.width + x+4] = new MainTile("bishop", playerNum);
            tiles[(y+4) * level.width + x+1] = new MainTile("bishop", playerNum);

            tiles[(y+1) * level.width + x+5] = new MainTile("horse", playerNum);
            tiles[(y+5) * level.width + x+1] = new MainTile("horse", playerNum);

            tiles[(y+1) * level.width + x+6] = new MainTile("castle", playerNum);
            tiles[(y+6) * level.width + x+1] = new MainTile("castle", playerNum);

            tiles[(y+2) * level.width + x + 6] = new MainTile("horse", playerNum);
            tiles[(y+6) * level.width + x + 2] = new MainTile("horse", playerNum);

            tiles[(y+3) * level.width + x + 6] = new MainTile("bishop", playerNum);
            tiles[(y+6) * level.width + x + 3] = new MainTile("bishop", playerNum);

            tiles[(y+4) * level.width + x + 6] = new MainTile("bishop", playerNum);
            tiles[(y+6) * level.width + x + 4] = new MainTile("bishop", playerNum);

            tiles[(y + 5) * level.width + x + 6] = new MainTile("horse", playerNum);
            tiles[(y + 6) * level.width + x + 5] = new MainTile("horse", playerNum);

            tiles[(y + 6) * level.width + x + 6] = new MainTile("castle", playerNum);
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

            endSelf.addToScore = function (score) {
            };

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
