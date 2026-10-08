(function () {
    "use strict";
    var SITE = 'https://rewordgame.v5games.com/';
    function shareText() {
        var lvl = window.APP && APP.currentLevel;
        return lvl ? 'I reached level ' + lvl + ' in reWord Game. Can you unscramble the sentences?' :
            'reWord Game: swap the words until the sentence makes sense.';
    }
    function flash(btn, msg) {
        var old = btn.getAttribute('data-label') || btn.textContent;
        btn.setAttribute('data-label', old);
        btn.textContent = msg;
        setTimeout(function () { btn.textContent = old; }, 1800);
    }
    function copy(text, btn) {
        var done = function () { flash(btn, 'Link copied'); };
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(done, function () { window.prompt('Copy this link', text); });
        } else {
            window.prompt('Copy this link', text);
        }
    }
    document.addEventListener('click', function (e) {
        var btn = e.target.closest && e.target.closest('[data-share],[data-copy-link]');
        if (!btn) return;
        e.preventDefault();
        var text = shareText();
        if (btn.hasAttribute('data-copy-link')) return copy(SITE, btn);
        if (navigator.share) {
            navigator.share({title: 'reWord Game', text: text, url: SITE}).catch(function () {});
        } else {
            copy(text + ' ' + SITE, btn);
        }
    });
})();
