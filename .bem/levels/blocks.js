var PATH = require('path'),
    BEM = require('bem'),
    environ = require('bem-environ'),

    PRJ_TECHS = PATH.resolve(__dirname, '../techs'),
    join = PATH.join;

exports.getTechs = function() {
    var techs = {
        'bemjson.js' : 'bem/lib/tech/v2',
        'bemhtml.js' : 'bem/lib/tech/v2',
        'md'         : 'bem/lib/tech/v2',
        'wiki'       : 'bem/lib/tech/v2',
        'bemdecl.js' : 'v2/bemdecl.js',
        'deps.js'    : 'v2/deps.js',
        'css'        : 'v2/css',
        'ie.css'     : 'v2/ie.css',
        'js'         : 'v2/js-i'
    };

    [
        'test.js',
        'sets',
        'test.js+browser.js+bemhtml'
    ].forEach(function(name) {
        techs[name] = environ.getLibPath('bem-pr', 'bem', 'techs', name + '.js');
    });

    [
        'bemhtml',
        'bemtree',
        'html',
        'examples',
        'tests',
        'vanilla.js',
        'browser.js',
        'node.js',
        'browser.js+bemhtml',
        'i18n',
        'i18n.js',
        'i18n.html'
    ].forEach(function(name) {
        techs[name] = join(PRJ_TECHS, name + '.js');
    });

    return techs;
};
