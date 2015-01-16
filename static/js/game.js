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
//            gameon.loopSound("theme");

            gameState.players_turn = 1;
            var tiles = gameState.initialBoardTiles();
            gameState.board = new gameon.Board(level.width, level.height, tiles);

            var $html = $(evutils.render('static/templates/shared/game.jinja2'));
            gameState.board.render($html.find('.gameon-board'));
            gameState.destruct = function () {
                gameon.cleanBoards();
//                gameon.pauseSound("theme");
            };

            if (level.computer_opponent) {
                gameState.aiHandler = new gameState.AIHandler();
            }


//            gameon.renderVolumeTo($html.find('.mm-volume'));

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
            initPlayerAt(tiles, [2, 2], 1);
            initPlayerAt(tiles, [14, 2], 2);
            initPlayerAt(tiles, [2, 14], 3);
            initPlayerAt(tiles, [14, 14], 4);
            initPlayerAt(tiles, [26, 14], 5);
            initPlayerAt(tiles, [26, 2], 6);

            return tiles;
        };
        function initPlayerAt(tiles, yxPos, playerNum) {
            var y = yxPos[0];
            var x = yxPos[1];
            tiles[y * level.width + x] = new MainTile("pawn", playerNum);
            tiles[y * level.width + x + 1] = new MainTile("pawn", playerNum);
            tiles[y * level.width + x + 2] = new MainTile("pawn", playerNum);
            tiles[y * level.width + x + 3] = new MainTile("pawn", playerNum);
            tiles[y * level.width + x + 4] = new MainTile("pawn", playerNum);
            tiles[y * level.width + x + 5] = new MainTile("pawn", playerNum);
            tiles[y * level.width + x + 6] = new MainTile("pawn", playerNum);
            tiles[y * level.width + x + 7] = new MainTile("pawn", playerNum);

            tiles[(y + 1) * level.width + x] = new MainTile("pawn", playerNum);
            tiles[(y + 2) * level.width + x] = new MainTile("pawn", playerNum);
            tiles[(y + 3) * level.width + x] = new MainTile("pawn", playerNum);
            tiles[(y + 4) * level.width + x] = new MainTile("pawn", playerNum);
            tiles[(y + 5) * level.width + x] = new MainTile("pawn", playerNum);
            tiles[(y + 6) * level.width + x] = new MainTile("pawn", playerNum);
            tiles[(y + 7) * level.width + x] = new MainTile("pawn", playerNum);

            tiles[(y + 7) * level.width + x + 1] = new MainTile("pawn", playerNum);
            tiles[(y + 7) * level.width + x + 2] = new MainTile("pawn", playerNum);
            tiles[(y + 7) * level.width + x + 3] = new MainTile("pawn", playerNum);
            tiles[(y + 7) * level.width + x + 4] = new MainTile("pawn", playerNum);
            tiles[(y + 7) * level.width + x + 5] = new MainTile("pawn", playerNum);
            tiles[(y + 7) * level.width + x + 6] = new MainTile("pawn", playerNum);
            tiles[(y + 7) * level.width + x + 7] = new MainTile("pawn", playerNum);

            tiles[(y + 6) * level.width + x + 7] = new MainTile("pawn", playerNum);
            tiles[(y + 5) * level.width + x + 7] = new MainTile("pawn", playerNum);
            tiles[(y + 4) * level.width + x + 7] = new MainTile("pawn", playerNum);
            tiles[(y + 3) * level.width + x + 7] = new MainTile("pawn", playerNum);
            tiles[(y + 2) * level.width + x + 7] = new MainTile("pawn", playerNum);
            tiles[(y + 1) * level.width + x + 7] = new MainTile("pawn", playerNum);

            tiles[(y + 1) * level.width + x + 1] = new MainTile("castle", playerNum);

            tiles[(y + 1) * level.width + x + 2] = new MainTile("horse", playerNum);
            tiles[(y + 2) * level.width + x + 1] = new MainTile("horse", playerNum);

            tiles[(y + 1) * level.width + x + 3] = new MainTile("bishop", playerNum);
            tiles[(y + 3) * level.width + x + 1] = new MainTile("bishop", playerNum);

            tiles[(y + 1) * level.width + x + 4] = new MainTile("bishop", playerNum);
            tiles[(y + 4) * level.width + x + 1] = new MainTile("bishop", playerNum);

            tiles[(y + 1) * level.width + x + 5] = new MainTile("horse", playerNum);
            tiles[(y + 5) * level.width + x + 1] = new MainTile("horse", playerNum);

            tiles[(y + 1) * level.width + x + 6] = new MainTile("castle", playerNum);
            tiles[(y + 6) * level.width + x + 1] = new MainTile("castle", playerNum);

            tiles[(y + 2) * level.width + x + 6] = new MainTile("horse", playerNum);
            tiles[(y + 6) * level.width + x + 2] = new MainTile("horse", playerNum);

            tiles[(y + 3) * level.width + x + 6] = new MainTile("bishop", playerNum);
            tiles[(y + 6) * level.width + x + 3] = new MainTile("bishop", playerNum);

            tiles[(y + 4) * level.width + x + 6] = new MainTile("bishop", playerNum);
            tiles[(y + 6) * level.width + x + 4] = new MainTile("bishop", playerNum);

            tiles[(y + 5) * level.width + x + 6] = new MainTile("horse", playerNum);
            tiles[(y + 6) * level.width + x + 5] = new MainTile("horse", playerNum);

            tiles[(y + 6) * level.width + x + 6] = new MainTile("castle", playerNum);

            tiles[(y + 3) * level.width + x + 3] = new MainTile("queen", playerNum);
            tiles[(y + 4) * level.width + x + 4] = new MainTile("king", playerNum);
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
                if (!gameState.currentSelected) {
                    return;
                }
                var moves = gameState.currentSelected.getAllowedMoves();
                var isValidMove = _.any(moves, function (move) {
                    return move.yPos == self.yPos && move.xPos == self.xPos;
                });
                if (isValidMove) {
                    //moveto this
                    var path = gameState.board.getPathFromTo(gameState.currentSelected, self);
                    if (path) {
                        var animationSpeed = 200;
                        if (gameState.players_turn != 1 && level.computer_opponent) {
                            animationSpeed = 400;
                        }
//                        gameon.unmuteSound('moving');
//                        gameon.playSound('moving');

                        //TODO start ai search ASAP
                        gameState.board.animateTileAlongPath(gameState.currentSelected, path, animationSpeed, function () {
                            gameState.endHandler.turnEnd(self, gameState.currentSelected);
//                            gameon.muteSound('moving');
//                            gameon.pauseSound('moving');
                        });
                    }
                }
            };

            self.render = function () {
                return '<div class="btn btn-lg btn-link"></div>';
            };
        };

        var MainTile = function (type, playerNum, halfgrown) {
            var self = new EmptyTile();
            if (typeof halfgrown == 'undefined') {
                halfgrown = false;
            }

            self.canPassThrough = true;

            self.setHalfgrown = function (halfgrown) {
                self.halfgrown = halfgrown;
                if (!self.halfgrown) {
                    self.oldClick = self.click;
                    self.click = function () {
                        var canClick = (self.playerNum == gameState.players_turn);
                        if (!canClick) {
                            return self.oldClick();
                        }
                        function clearHighlighting() {
                            $.each(gameState.board.tiles, function (i, tile) {
                                tile.getRenderedCell().removeClass('ws-cell-highlight');
                            })
                        }

                        if (!self.selected) {
                            gameState.unselectAll();
                            self.selected = true;
                            gameState.currentSelected = self;

                            clearHighlighting();
                            var allowedMoves = gameState.currentSelected.getAllowedMoves();
                            $.each(allowedMoves, function (i, move) {
                                move.getRenderedCell().addClass('ws-cell-highlight');
                            })
                        }
                        else {
                            gameState.currentSelected = null;
                            self.selected = false;
                            clearHighlighting();
                        }
                        self.reRender();
                    };
                }
                else {
                    if (self.oldClick) {
                        self.click = self.oldClick;
                    }
                }
            };

            self.setHalfgrown(halfgrown);


            self.type = type;
            self.points = 0;
            self.playerNum = playerNum;

            self.selected = false;

            self.getAllowedMoves = function () {
                function validateMoves(positions) {
                    return _.map(_.filter(positions, function (position) {
                        return gameState.board.isInBoard(position[0], position[1]) &&
                            gameState.board.getTile(position[0], position[1]).playerNum != gameState.players_turn;
                    }), function (move) {
                        return gameState.board.getTile(move[0], move[1]);
                    });
                }

                function addDiag(y, x) {
                    if (gameState.board.isInBoard(y, x) &&
                        gameState.board.getTile(y, x).playerNum &&
                        gameState.board.getTile(y, x).playerNum != gameState.players_turn) {
                        allowedMoves.push([y, x])
                    }
                }

                var allowedMoves = [];
                if (self.type == "pawn") {
                    allowedMoves = [
                        [self.yPos + 1, self.xPos],
                        [self.yPos, self.xPos + 1],
                        [self.yPos - 1, self.xPos ],
                        [self.yPos, self.xPos - 1]
                    ];
                    addDiag(self.yPos + 1, self.xPos + 1);
                    addDiag(self.yPos - 1, self.xPos + 1);
                    addDiag(self.yPos + 1, self.xPos - 1);
                    addDiag(self.yPos - 1, self.xPos - 1);
                }
                if (self.type == "horse") {
                    allowedMoves = [
                        [self.yPos + 2, self.xPos + 1],
                        [self.yPos + 2, self.xPos - 1],
                        [self.yPos - 2, self.xPos + 1],
                        [self.yPos - 2, self.xPos - 1],
                        [self.yPos + 1, self.xPos + 2],
                        [self.yPos + 1, self.xPos - 2],
                        [self.yPos - 1, self.xPos + 2],
                        [self.yPos - 1, self.xPos - 2]
                    ];
                }
                if (self.type == "bishop" || self.type == "queen") {
                    for (var i = 1; i < 8; i++) {
                        var move = [self.yPos + i, self.xPos + i];
                        if (gameState.board.getTile(move[0], move[1]).playerNum &&
                            gameState.board.getTile(move[0], move[1]).playerNum != gameState.players_turn) {
                            allowedMoves.push(move);
                            break;
                        }
                        else if (gameState.board.getTile(move[0], move[1]).playerNum) {
                            break;
                        }
                        else {
                            allowedMoves.push(move);
                        }
                    }
                    for (var i = 1; i < 8; i++) {
                        var move = [self.yPos - i, self.xPos + i];
                        if (gameState.board.getTile(move[0], move[1]).playerNum &&
                            gameState.board.getTile(move[0], move[1]).playerNum != gameState.players_turn) {
                            allowedMoves.push(move);
                            break;
                        }
                        else if (gameState.board.getTile(move[0], move[1]).playerNum) {
                            break;
                        }
                        else {
                            allowedMoves.push(move);
                        }
                    }
                    for (var i = 1; i < 8; i++) {
                        var move = [self.yPos + i, self.xPos - i];
                        if (gameState.board.getTile(move[0], move[1]).playerNum &&
                            gameState.board.getTile(move[0], move[1]).playerNum != gameState.players_turn) {
                            allowedMoves.push(move);
                            break;
                        }
                        else if (gameState.board.getTile(move[0], move[1]).playerNum) {
                            break;
                        }
                        else {
                            allowedMoves.push(move);
                        }
                    }
                    for (var i = 1; i < 8; i++) {
                        var move = [self.yPos - i, self.xPos - i];
                        if (gameState.board.getTile(move[0], move[1]).playerNum &&
                            gameState.board.getTile(move[0], move[1]).playerNum != gameState.players_turn) {
                            allowedMoves.push(move);
                            break;
                        }
                        else if (gameState.board.getTile(move[0], move[1]).playerNum) {
                            break;
                        }
                        else {
                            allowedMoves.push(move);
                        }
                    }
                }
                if (self.type == "castle" || self.type == "queen") {
                    for (var i = 1; i < 8; i++) {
                        var move = [self.yPos + i, self.xPos];
                        if (gameState.board.getTile(move[0], move[1]).playerNum &&
                            gameState.board.getTile(move[0], move[1]).playerNum != gameState.players_turn) {
                            allowedMoves.push(move);
                            break;
                        }
                        else if (gameState.board.getTile(move[0], move[1]).playerNum) {
                            break;
                        }
                        else {
                            allowedMoves.push(move);
                        }
                    }
                    for (var i = 1; i < 8; i++) {
                        var move = [self.yPos - i, self.xPos];
                        if (gameState.board.getTile(move[0], move[1]).playerNum &&
                            gameState.board.getTile(move[0], move[1]).playerNum != gameState.players_turn) {
                            allowedMoves.push(move);
                            break;
                        }
                        else if (gameState.board.getTile(move[0], move[1]).playerNum) {
                            break;
                        }
                        else {
                            allowedMoves.push(move);
                        }
                    }
                    for (var i = 1; i < 8; i++) {
                        var move = [self.yPos, self.xPos + i];
                        if (gameState.board.getTile(move[0], move[1]).playerNum &&
                            gameState.board.getTile(move[0], move[1]).playerNum != gameState.players_turn) {
                            allowedMoves.push(move);
                            break;
                        }
                        else if (gameState.board.getTile(move[0], move[1]).playerNum) {
                            break;
                        }
                        else {
                            allowedMoves.push(move);
                        }
                    }
                    for (var i = 1; i < 8; i++) {
                        var move = [self.yPos, self.xPos - i];
                        if (gameState.board.getTile(move[0], move[1]).playerNum &&
                            gameState.board.getTile(move[0], move[1]).playerNum != gameState.players_turn) {
                            allowedMoves.push(move);
                            break;
                        }
                        else if (gameState.board.getTile(move[0], move[1]).playerNum) {
                            break;
                        }
                        else {
                            allowedMoves.push(move);
                        }
                    }
                }
                return validateMoves(allowedMoves);

            };

            self.render = function () {
                var selectedClass = '';
                if (self.selected) {
                    selectedClass = ' chess-piece--selected';
                }
                var pieceText = fixtures.pieces[self.type];
                if (self.playerNum === 1) {
                    pieceText = fixtures.whitePieces[self.type];
                }
                return '<button type="button" class="chess-piece chess-piece--player-' + self.playerNum + selectedClass + '">' + pieceText +
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
                gameState.board.setTile(endTile.yPos, endTile.xPos, new EmptyTile());

                gameState.board.swapTiles(startTile, endTile);

                //TODO
                gameState.players_turn = gameState.players_turn++ % level.num_players + 1;

                if (gameState.players_turn != 1) {
                    if (level.computer_opponent) {
                        gameState.aiHandler.makeAiMove();
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
                var ourPieces = [];
                var totalNumMovesFound = 0;

                for (var y = 0; y < level.height; y++) {
                    for (var x = 0; x < level.width; x++) {
                        var currentTile = gameState.board.getTile(y, x);
                        if (currentTile.playerNum == gameState.players_turn) {
                            var allowedMoves = currentTile.getAllowedMoves();
                            totalNumMovesFound += allowedMoves.length
                            ourPieces.push([currentTile, allowedMoves]);
                        }
                    }
                }

                var maxScoreMove = [ourPieces[0][0], ourPieces[0][1][0]];
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
