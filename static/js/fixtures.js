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
            "words": ['Joe liked', 'Joe', 'Mary', 'Mary', 'and', 'liked', 'too'],
            "correct_ordering": [0, 2, 4, 3, 5, 1, 6],
            "unmovables": {
                0: 1,
                2: 1,
                3: 1,
                5: 1
            }
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
            "correct_words": ['The', 'fastest', 'one', 'was', 'far', 'faster', 'than', 'the', 'slowest.'],
            "scrambling": [
                4, 6, 2, 3, 5, 8, 0, 1, 7
            ]
        },
        {
            "correct_words": ['We', 'decided', 'tapping', 'our', 'nose', 'and', 'sneezing', 'was', 'the', 'siginal.'],
            "scrambling": [
                8, 7, 3, 0, 2, 9, 1, 4, 6, 5
            ]
        },
        {
            "correct_words": ['Joe', 'didn\'t', 'want', 'to', 'go.', 'This', 'meant', 'he', 'would', 'avoid', 'going.'],
            "scrambling": [
                7,
                6,
                0,
                2,
                4,
                9,
                3,
                10,
                8,
                1,
                5
            ]
        },
        {
            "correct_words": ['We', 'found', 're', 'wording', 'sentences', 'was', 'easier', 'at', 'first', 'then', 'got', 'harder.'],
            "scrambling": [
                1,
                0,
                2,
                10,
                6,
                11,
                9,
                3,
                8,
                7,
                4,
                5
            ]
        },
        {
            "correct_words": [
                'I',
                'wonder',
                'if',
                'we',
                'should',
                'do',
                'a',
                'case study',
                'on',
                'how',
                'awesome',
                're',
                'Word',
                'Game',
                'is.'
            ],
            "scrambling": [
                1,
                0,
                2,
                10,
                6,
                14,
                11,
                13,
                9,
                3,
                12,
                8,
                7,
                4,
                5
            ]
        },
        {
            "correct_words": [
                'It',
                'can',
                'get',
                'much',
                'harder',
                'to',
                'find',
                'spelling',
                'mistakes',
                'with',
                'all',
                'these',
                'extra',
                'superfluous',
                'words.'
            ],
            "scrambling": [
                1,
                12,
                2,
                0,
                6,
                11,
                9,
                14,
                4,
                3,
                8,
                10,
                13,
                7,
                5
            ]
        },
        {
            "correct_words": [
                "In",
                "theory",
                "its",
                "much",
                "easier",
                "than",
                "this.",
                "But",
                "in",
                "practice",
                "theories",
                "don't",
                "always",
                "work."
            ],
            "scrambling": [
                12,
                6,
                11,
                0,
                8,
                4,
                3,
                5,
                9,
                10,
                13,
                1,
                2,
                7
            ]
        }
        //{
        //    "words": ['dust', 'brick', 'house', 'door', 'roof', 'window'],
        //    "correct_ordering": [0, 1, 5, 3, 4, 2],
        //    "unmovables": {
        //        0: 1
        //    }
        //},
        //{
        //    "words": ['yellow orange red', 'blue', 'purple', 'green', 'pink', 'aqua'],
        //    "correct_ordering": [0, 6, 4, 3, 7, 5],
        //    "unmovables": {
        //        0: 1
        //    }
        //}
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
