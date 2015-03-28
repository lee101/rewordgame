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
            "words": ['words', "can't", 'be', 'swapped', 'some'],
            "correct_ordering": [4, 0, 1, 2, 3],
            "unmovables": {
                0: 1,
                1: 1,
                2: 1,
                3: 1
            }
        },
        {
            "words": ['joe liked', 'joe', 'mary', 'mary', 'and', 'liked', 'too'],
            "correct_ordering": [0, 2, 4, 3, 5, 1, 6],
            "unmovables": {
                0: 1,
                2: 1,
                3: 1,
                5: 1
            }
        },
        {
            "words": ['beef', 'stayed', 'market', 'roast', 'home', 'went to'],
            "correct_ordering": [5, 2, 1, 4, 3, 0]
        },

        {
            "correct_words": [
                'The',
                'quick',
                'fox',
                'jumps',
                'over',
                'the',
                'lazy',
                'dog.'
            ],
            "scrambling": [
                5,
                2,
                6,
                3,
                0,
                1,
                4,
                7
            ]
        },
        {
            "words": ['and', 'turtle', 'big', 'slow', 'the', 'was'],
            "correct_ordering": [4, 1, 5, 2, 0, 3],
            "unmovables": {
                2: 1,
                3: 1
            }
        },
        {
            "words": ['dust', 'brick', 'house', 'door', 'roof', 'window'],
            "correct_ordering": [0, 1, 5, 3, 4, 2],
            "unmovables": {
                0: 1
            }
        },
        {
            "words": ['yellow orange red', 'blue', 'purple', 'green', 'pink', 'aqua'],
            "correct_ordering": [0, 6, 4, 3, 7, 5],
            "unmovables": {
                0: 1
            }
        }
    ];
    self.scrambleWords = function (words, scrambling) {
        var scrambled_words = [];
        for (var orderIdx = 0; orderIdx < scrambling.length; orderIdx++) {
            var scrambleIdx = scrambling[orderIdx];
            scrambled_words[orderIdx] = words[scrambleIdx]
        }
        return scrambled_words;
    };
    self.descrambling = function (scrambling) {
        var descrambling = [];
        var indexOf_map = {};
        for (var i = 0; i < scrambling.length; i++) {
            indexOf_map[scrambling[i]] = i;
        }
        for (var i = 0; i < scrambling.length; i++) {
            descrambling[i] = indexOf_map[i];
        }
        return descrambling;
    };
    for (var i = 0; i < self.levels.length; i++) {
        var level = self.levels[i];
        level.id = i + 1;
        if (!level.unmovables) {
            level.unmovables = {};
        }
        if (level.correct_words) {
            level.words = self.scrambleWords(level.correct_words, level.scrambling);
            level.correct_ordering = self.descrambling(level.scrambling)
        }
    }
    return self;
})();
