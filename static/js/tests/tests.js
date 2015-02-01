gameon.noAnimation = true;
jasmine.DEFAULT_TIMEOUT_INTERVAL = 15000;

describe("fixtures", function () {

    it('other stuff', function () {
    });

});
describe("mmochess", function () {
    beforeEach(function () {
        jasmine.clock().install();
        jasmine.clock().tick(1001);
    });
    afterEach(function () {
        jasmine.clock().uninstall();
    });

    it('lets you navigate around', function (done) {
        APP.goto('/');
        jasmine.clock().tick(1001);
        jasmine.clock().tick(1001);

        APP.goto('/play');
        jasmine.clock().tick(1001);

        done();
    });

    var playRound = function (done) {
        var game = APP.game;
        var board = game.board;
        var tiles = board.tiles;

        game.players_turn = 1;
        for (var i = 0; i < tiles.length; i++) {
            var tile = tiles[i];
            if (tile.playerNum == 1) {
                tile.click();
                expect(tile.selected).toBe(true);
                break;
            }
        }
        var moves = tile.getAllowedMoves();
        jasmine.clock().tick(1001);

        moves[0].click();
        expect(game.players_turn).toBe(2);//and eventually be 1
        jasmine.clock().tick(1001);
        jasmine.clock().tick(1001);
        jasmine.clock().tick(1001);
        jasmine.clock().tick(1001);
        jasmine.clock().tick(1001);
        jasmine.clock().tick(1001);
        jasmine.clock().tick(1001);
        jasmine.clock().tick(1001);
        jasmine.clock().tick(1001);
        expect(game.players_turn).toBe(1);
        done()
    };

    it('THEN lets you play a round', playRound);

    it('Then round is played with a player down', function (done) {
        var game = APP.game;
        var board = game.board;
        var tiles = board.tiles;

        game.players_turn = 1;

        for (var i = 0; i < tiles.length; i++) {
            var tile = tiles[i];
            if (tile.playerNum == 3) {
                board.setTile(tile.yPos, tile.xPos, new game.EmptyTile());
            }
        }
        playRound(done);
    });

    it('You straight take a king and gain all their pieces', function (done) {
        APP.goto('/');
        jasmine.clock().tick(1001);
        jasmine.clock().tick(1001);

        APP.goto('/play');
        jasmine.clock().tick(1001);
        jasmine.clock().tick(1001);
        var game = APP.game;
        var board = game.board;
        var tiles = board.tiles;

        var startTile, endTile;
        for (var i = 0; i < tiles.length; i++) {
            var tile = tiles[i];
            if (tile.playerNum == 1 && tile.type == "queen") {
                startTile = tile;
            }
            else if (tile.playerNum == 2 && tile.type == "king") {
                endTile = tile;
            }
        }
        game.endHandler.turnEnd(startTile, endTile);

        var hasPiece = false;
        for (var i = 0; i < tiles.length; i++) {
            var tile = tiles[i];
            if (tile.playerNum == 2) {
                hasPiece = true;
                break;
            }
        }
        expect(hasPiece).toBe(false)
        done()
    });

    it('AI scoreBoard', function (done) {
        APP.goto('/');
        jasmine.clock().tick(1001);
        jasmine.clock().tick(1001);

        APP.goto('/play');
        jasmine.clock().tick(1001);
        jasmine.clock().tick(1001);

        var game = APP.game;
        var board = game.board;
        var tiles = board.tiles;

        game.players_turn = 1;

        var scoreBoard = game.aiHandler.scoreBoard();

        for (var i = 0; i < tiles.length; i++) {
            var tile = tiles[i];
            if (tile.playerNum == 1) {
                board.setTile(tile.yPos, tile.xPos, new game.EmptyTile());
            }
        }
        var currentScore = game.aiHandler.scoreBoard();
        expect(scoreBoard).toBeGreaterThan(currentScore);

        game.players_turn = 2;
        //score board is relative to a players turn
        var p2CurrentScore = game.aiHandler.scoreBoard();
        expect(currentScore).toBeLessThan(p2CurrentScore);

        for (var i = 0; i < tiles.length; i++) {
            var tile = tiles[i];
            if (tile.playerNum == 3) {
                board.setTile(tile.yPos, tile.xPos, new game.EmptyTile());
            }
        }
        var newCurrentScore = game.aiHandler.scoreBoard();
        expect(p2CurrentScore).toBeLessThan(newCurrentScore);

        expect(newCurrentScore).toBe(game.aiHandler.scoreBoard());

        for (var i = 0; i < tiles.length; i++) {
            var tile = tiles[i];
            if (tile.playerNum == 2 && tile.type == "pawn") {
                var pawn = tile;
                var queenPos = [tile.yPos + 1, tile.xPos + 1];
                board.setTile(queenPos, new game.MainTile('queen', 1));
                break;
            }
        }

        var ownedByQueenScore = game.aiHandler.scoreBoard();
        expect(newCurrentScore).toBeGreaterThan(ownedByQueenScore);

        //compare moving horse to taking the queen

        board.setTile(queenPos, new game.EmptyTile());
        var notOwnedByQueenScore = game.aiHandler.scoreBoard();
        expect(notOwnedByQueenScore).toBeGreaterThan(ownedByQueenScore);

        board.setTile(queenPos, new game.MainTile('queen', 1));

        board.setTile(queenPos[0] - 2, queenPos[1] - 2, new game.MainTile('pawn', 2));
        var stillOwnedByQueenScore = game.aiHandler.scoreBoard();

        expect(notOwnedByQueenScore).toBeGreaterThan(stillOwnedByQueenScore);

        //compare to king

        board.setTile(queenPos, new game.EmptyTile());
        var notOwnedScore = game.aiHandler.scoreBoard();
        expect(notOwnedScore).toBeGreaterThan(ownedByQueenScore);

        board.setTile(queenPos, new game.MainTile('king', 1));
        var ownedByKingScore = game.aiHandler.scoreBoard();
        expect(ownedByQueenScore).toBeGreaterThan(ownedByKingScore);
        expect(notOwnedScore).toBeGreaterThan(ownedByKingScore);


        board.setTile(queenPos[0] - 3, queenPos[1] - 3, new game.MainTile('pawn', 2));
        var stillOwnedByKingScore = game.aiHandler.scoreBoard();

        expect(stillOwnedByKingScore).toBeGreaterThan(ownedByKingScore);
        expect(notOwnedScore).toBeGreaterThan(stillOwnedByKingScore);

        APP.goto('/tests');
        done();
    });


    it('AI find max move', function (done) {
        APP.goto('/play');
        jasmine.clock().tick(1001);

        var game = APP.game;
        var board = game.board;
        var tiles = board.tiles;

        game.players_turn = 2;

        for (var i = 0; i < tiles.length; i++) {
            var tile = tiles[i];
            if (tile.playerNum == 2 && tile.type == "pawn") {
                var pawn = tile;
                var queenPos = [tile.yPos + 1, tile.xPos + 1];
                board.setTile(queenPos, new game.MainTile('queen', 1));
                break;
            }
        }
        var move = game.aiHandler.findMaxScoreMove();
//            expect(move[0].type).toBe("pawn");

        expect(move[1].type).toBe("queen");

        for (var i = 0; i < tiles.length; i++) {
            var tile = tiles[i];
            if (tile.playerNum == 2 && tile.type == "pawn") {
                var pawn = tile;
                var queenPos = [tile.yPos + 1, tile.xPos + 1];
                board.setTile(queenPos, new game.MainTile('king', 1));
                break;
            }
        }
        var move = game.aiHandler.findMaxScoreMove();

        expect(move[0].type).toBe("pawn");

        expect(move[1].type).toBe("king");


        APP.goto('/tests');
        done();
    });

    it('tears down', function () {
        APP.goto('/tests');
        jasmine.clock().tick(1001);

    });
});
