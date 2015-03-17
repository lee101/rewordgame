var fixtures = (function () {
    "use strict";
    var self = {};

    self.levels = [
        {
            "words": ['Word', 're', 'Game'],
            "correct_ordering": [1, 0, 2]
        },
        {
            "words": ['.com', 'Addicting', 'By', 'Games', 'Word'],
            "correct_ordering": [2, 1, 4, 3, 0]
        },
        {
            "words": ['this', 'doesn\'t', 'sense', 'make'],
            "correct_ordering": [0, 1, 3, 2]
        },
        {
            "words": ['and', 'this', 'puzzle', 'spans', 'multiple lines', 'the', 'test of time'],
            "correct_ordering": [1, 2, 3, 4, 0, 5, 6],
            "unmovables": {
                4: 1,
                6: 1
            }
        },
        {
            "words": ['beef', 'stayed', 'market', 'roast', 'home', 'went to'],
            "correct_ordering": [5, 2, 1, 4, 3, 0]
        },
        {
            "words": ['dust', 'brick', 'house', 'door', 'roof', 'window'],
            "correct_ordering": [0, 1, 5, 3, 4, 2],
            "unmovables": {
                0: 1
            }
        },
        {
            "words": ['yellow', 'orange', 'red', 'blue', 'purple', 'green', 'pink', 'aqua'],
            "correct_ordering": [0, 1, 2, 6, 4, 3, 7, 5],
            "unmovables": {
                0: 1,
                1: 1,
                2: 1
            }
        }
    ];
    for (var i = 0; i < self.levels.length; i++) {
        var level = self.levels[i];
        level.id = i;
        if (!level.unmovables) {
            level.unmovables = {};
        }
    }
    return self;
})();
