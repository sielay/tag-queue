(function (r, f) {
    if ( typeof define === 'function' && define.amd ) {
        return define (function () {
            return f;
        });
    }
    if ( typeof exports === 'object' ) {
        module.exports = f;
        return;
    }
    r.tq = f (r);
}) (this, function (r) {
    'use strict';
    var _ = (console && console.log) ? console.error : function(){};
    var d = {};
    /**
     * Listen for lib
     * @param l - lib name
     * @param c - callback
     */
    var tq = function(l,c,t) { // require lib

        if(Array.isArray ? Array.isArray(l) : Object.prototype.toString.call(l) === '[object Array]') {
            var x = l.length;
            for(var i = 0; i < l.length; i++) {
                tq(l[i],function() {
                    x--;
                    if(x === 0) {
                        c();
                    }
                },t)
            }
            return;
        }

        if(d[l] === true) { // has been loaded
            return c(); // fire
        };
        d[l] = d[l] || [];d[l].push(c); // queue cb
        if(t === true) {
            tq.t(l);
        }
        return;
    };
    tq.got = function(l) {
        if(d[l] === true) return;
        if(d[l]) {
            if(d[l]._t) {
                clearInterval(d[l]._t);
            }
            var c = d[l].shift();
            while(c) {
                try {
                    c();
                } catch(e) {
                    _(e);
                } finally {
                    c = d[l].shift();
                }
            }
        }
        d[l] = true;
    };
    tq.t = function(l) {
        d[l] = d[l] || [];
        d[l]._t = setInterval(function(){
            if(!!r[l]) {
                tq.got(l);
            }
        },100);
    };
    return tq;
});