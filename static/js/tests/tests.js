describe("fixtures", function () {

    it('other stuff', function () {
    });

});
describe("mmochess", function () {

    it('lets you navigate around', function (done) {
        APP.goto('/');
        APP.goto('/play');
        specHelpers.once = function () {
            done();
        }
    });

    it('THEN test ai', function (done) {
        APP.goto('/play');
        specHelpers.once = function () {
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
            var p2CurrentScore = game.aiHandler.scoreBoard()
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

            APP.goto('/tests');
            done();
        }
    });


    it('THEN you clock the game!', function (done) {
        done();
    });

    it('tears down', function () {
        APP.goto('/tests');
    });
});
