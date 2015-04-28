/**
 * Browser / CommonjS / AMD wrapper
 * @param root - window or other THIS context
 * @param factory - library script
 */
(function (root, factory) {
    if ( typeof define === 'function' && define.amd ) {
        return define (function () {
            return factory;
        });
    }
    if ( typeof exports === 'object' ) {
        module.exports = factory;
        return;
    }
    root.tq = factory (root);
}) (this, function (root) {

    'use strict';

    var loadURLRegExp = /^(http|https|):\/\/(.+?)\/(.+)$/;

    // to support lack of console on IE
    var displayError = (console && console.log) ? console.error : function () {
    };

    // list of listeners and loaded libs
    var repository = {};

    var externals = {};

    var load = function(url) {
        if(externals[url]) return;
        if(!root.document) {
            throw Error('URL loads are not supported without document');
        }
        var document = root.document,
        head = document.getElementsByTagName("head")[0] || document.documentElement,
        script = document.createElement("script");
        script.src = url;
        externals[url] = script;
        script.onload = script.onreadystatechange = function() {
            if ( externals[url] !== true && (!this.readyState ||
                this.readyState === "loaded" || this.readyState === "complete") ) {
                externals[url] = true;
                // Handle memory leak in IE
                script.onload = script.onreadystatechange = null;
                if ( head && script.parentNode ) {
                    head.removeChild( script );
                }
                tq.got(url);
            }
        };
        head.insertBefore( script, head.firstChild );
    };

    /**
     * Listen for lib to load
     * @param {String|Array} library - library name
     * @param {Function} callback - callback
     * @param {Boolean} useTimer - decide, if we have to observer window for library addition
     */
    var tq = function (library, callback, useTimer) { // require lib

        if(!(callback && callback.constructor && callback.call && callback.apply))
        {
            throw Error('Callback has to be a function.');
        }

        // support for combined requirements
        if ( Array.isArray ? Array.isArray (library) : Object.prototype.toString.call (library) === '[object Array]' ) {
            var x, y = x = library.length;
            for ( var i = 0; i < y; i++ ) {
                tq (library[i], function () {
                    x--;
                    if ( x === 0 ) {
                        callback ();
                    }
                }, useTimer)
            }
            return;
        }

        // has been already loaded
        if ( repository[library] === true ) {
            return callback (); // fire
        }

        // ensure entry exists
        repository[library] = repository[library] || [];

        // append listener
        repository[library].push (callback);

        if(loadURLRegExp.test(library)) {
            load(library);
        }

        // setup timers
        if ( useTimer === true ) {
            tq.t (library);
        }
    };

    /**
     * Report that library has been loaded
     * @param {String} library
     */
    tq.got = function (library) {

        // ignore for already reported
        if ( repository[library] === true ) return;

        // ensure listeners exists
        if ( repository[library] ) {

            // cleanup interval listeners
            if ( repository[library]._t ) {
                clearInterval (repository[library]._t);
            }

            // iterate on callbacks
            var callback = repository[library].shift ();
            while ( callback ) {
                try {
                    callback ();
                } catch ( error ) {
                    displayError (error);
                } finally {
                    callback = repository[library].shift ();
                }
            }
        }
        repository[library] = true;
    };

    /**
     * Inform registry that specific library require observing window
     * @param {String} library
     */
    tq.t = function (library) {
        repository[library] = repository[library] || [];

        function tick() {
            repository[library]._t = setTimeout (function () {
                if ( !!root[library] ) {
                    return tq.got (library);
                }
                tick();
            }, 100);
        }
        tick();
    };

    return tq;
});