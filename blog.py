import os

DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'blogposts')

POSTS = [
    {'slug': 'word-puzzle-tips', 'title': 'Word Puzzle Tips: Solve Jumbled Sentences Faster',
     'description': 'Practical tips for sentence ordering puzzles: start with locked words, find the subject and verb, join natural pairs and use hints well.',
     'date': '2026-10-22'},
    {'slug': 'learn-vocabulary-with-word-games', 'title': 'Learn Vocabulary and Grammar with Word Games',
     'description': 'Turn short reWord sessions into steady language practice with chunks, word order patterns, a mini notebook and smart hint use.',
     'date': '2026-10-22'},
    {'slug': 'how-reword-game-works', 'title': 'How reWord Game Works: A Quick Guide',
     'description': 'Learn how to swap words, read locked tiles, use moves, time and hints, and progress through reWord Game levels in your browser.',
     'date': '2026-10-22'},
]
BY_SLUG = {p['slug']: p for p in POSTS}


def body(slug):
    with open(os.path.join(DIR, slug + '.html'), encoding='utf-8') as f:
        return f.read()
