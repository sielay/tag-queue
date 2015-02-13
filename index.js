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

    // to support lack of console on IE
    var displayError = (console && console.log) ? console.error : function () {
    };

    // list of listeners and loaded libs
    var repository = {};

    /**
     * Listen for lib to load
     * @param {String|Array} library - library name
     * @param {Function} callback - callback
     * @param {Boolean} timer - decide, if we have to observer window for library addition
     */
    var tq = function (library, callback, timer) { // require lib

        // support for combined requirements
        if ( Array.isArray ? Array.isArray (library) : Object.prototype.toString.call (library) === '[object Array]' ) {
            var x, y = x = library.length;
            for ( var i = 0; i < y; i++ ) {
                tq (library[i], function () {
                    x--;
                    if ( x === 0 ) {
                        callback ();
                    }
                }, timer)
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

        // setup timers
        if ( timer === true ) {
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
        repository[library]._t = setInterval (function () {
            if ( !!root[library] ) {
                tq.got (library);
            }
        }, 100);
    };

    return tq;
});