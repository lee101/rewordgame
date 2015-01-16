describe("fixtures", function () {

    it('other stuff', function () {
    });

});
describe("mmochess", function () {

    it('lets you navigate around', function (done) {
        APP.goto('/');
        APP.goto('/play');
        done();
    });
    it('THEN you clock the game!', function (done) {

        done();
    });

    it('tears down', function () {
        APP.goto('/tests');
    });
});
