describe("fixtures", function () {

    it('other stuff', function () {
        var numEasyLevels = fixtures.EASY_LEVELS.length;
        var numMediumLevels = fixtures.MEDIUM_LEVELS.length;
        var numHardLevels = fixtures.HARD_LEVELS.length;
        var numExpertLevels = fixtures.EXPERT_LEVELS.length;
        expect(fixtures.LEVELS.length).toBe(numExpertLevels + numEasyLevels + numMediumLevels + numHardLevels);
    });

});
describe("mmochess", function () {

    it('lets you navigate around', function (done) {
        APP.goto('/');
        APP.goto('/play');
        specHelpers.once(function () {
            APP.game.board.getTile(0, 0).click();
            APP.game.board.getTile(3, 3).click();
            specHelpers.once(function () {
                done();
            })
        });
    });
    it('THEN you clock the game!', function (done) {
        var level = fixtures.EXPERT_LEVELS[fixtures.EXPERT_LEVELS.length -1];
        APP.gotoLevel(level);
//        APP.goto('/campaign/expert/12');
        specHelpers.once(function () {
            APP.game.starBar.setScore(9999999999999);
            APP.game.endHandler.setMoves(0);

            var isNextButtonVisible = $('#mm-next-level').is(':visible');
            expect(isNextButtonVisible).toBe(false);
            gameon.getUser(function(user){
                user.saveDifficultiesUnlocked(9)
            });
            done();
        })
    });

    it('tears down', function () {
        APP.goto('/tests');
    });
});
