var BEM = require('bem'),
    Q = BEM.require('q'),
    PATH = require('path'),
    compat = require('bemhtml-compat');

exports.API_VER = 2;

exports.techMixin = {

    getBuildSuffixesMap: function() {
        return {
            'bemhtml.js': ['bemhtml', 'bemhtml.xjst']
        };
    },

    getCreateSuffixes : function() {
        return ['bemhtml'];
    },

    getBuildResultChunk : function(relPath, path, suffix) {
        var content = this.readContent(path, suffix);
        return (suffix !== 'bemhtml.xjst' ?
            content.then(function(source) { return compat.transpile(source); }) :
            content)
                .then(function(source) {
                    return '\n/* begin: ' + relPath + ' */\n' +
                        source +
                        '\n/* end: ' + relPath + ' */\n';
                });
    },

    getBuildResult : function(files, suffix, output, opts) {
        var _t = this;
        return this.__base(files, suffix, output, opts)
            .then(_t.getCompiledResult.bind(_t));
    },

    getCompiledResult : function(sources) {
        sources = sources.join('\n');

        var BEMHTML = require('bem-xjst/lib/bemhtml'),
            exportName = this.getExportName(),
            xjstJS = BEMHTML.generate(sources, {
                optimize: process.env[exportName + '_ENV'] == 'development',
                cache   : process.env[exportName + '_CACHE'] == 'on'
            });

        return this.getWrappedResult(xjstJS);
    },

    getExportName: function() {
        return 'BEMHTML';
    },

    getWrappedResult: function(xjstJS) {
        var exportName = this.getExportName();

        return [
            '(function(g) {\n',
            '  var __xjst = (function(exports) {\n',
            '     ' + xjstJS + ';',
            '     return exports;',
            '  })({});',
            '  var defineAsGlobal = true;',
            '  if(typeof exports === "object") {',
            '    exports["' + exportName + '"] = __xjst;',
            '    defineAsGlobal = false;',
            '  }',
            '  if(typeof modules === "object") {',
            '    modules.define("' + exportName + '", function(provide) { provide(__xjst) });',
            '    defineAsGlobal = false;',
            '  }',
            '  defineAsGlobal && (g["' + exportName + '"] = __xjst);',
            '})(this);'
        ].join('\n');
    }

};
