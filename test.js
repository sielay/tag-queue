var
    window = {w : 1},
    tqLib = require('./index'),
    tq = tqLib (window),
    atomus = require ('atomus'),
    should = require ('should');

describe ('load-queue', function () {

    it ('lib loads', function () {
        should.exist (tq);
    });

    it ('loads deferred', function () {

        var list = [];

        tq.got ('A');
        tq ('A', function () {
            list.push (1);
        });
        tq ('B', function () {
            list.push (3);
        });
        tq ('C', function () {
            list.push (5);
        });
        tq ('B', function () {
            list.push (4);
        });
        tq ('A', function () {
            list.push (2);
        });
        tq.got ('B');
        tq.got ('C');

        list[0].should.eql (1);
        list[1].should.eql (2);
        list[2].should.eql (3);
        list[3].should.eql (4);
        list[4].should.eql (5);

    });

    it ('loads timers', function (done) {

        var c = 0;

        tq ('D', function () {
            c++;
        }, true);

        tq ('D', function () {
            c.should.eql (1);
            done ();
        });

        setTimeout (function () {
            window.D = {};
        }, 500);

    });

    it ('define timers', function (done) {

        var c = 0;

        tq.t ('E');

        tq ('E', function () {
            c++;
        });

        tq ('E', function () {
            c.should.eql (1);
            done ();
        });

        setTimeout (function () {
            window.E = {};
        }, 500);

    });

    it ('combined', function () {

        var y = 0;

        tq (['A', 'B', 'E', 'F', 'G'], function () {
            y++;
        });

        y.should.eql (0);
        tq.got ('F');
        y.should.eql (0);
        tq.got ('G');
        y.should.eql (1);

    });

    it ( 'Reject non-function callbacks', function () {
        var err = 0
        try { tq(['A'], 'string'); } catch(e) { err++ };
        try { tq(['A'], 123 ); } catch(e) { err++ };
        try { tq(['A'], {}); } catch(e) { err++ };
        try { tq(['A'], function(){}); } catch(e) { err++ };
        try { tq(['A'], true); } catch(e) { err++ };
        try { tq(['A'], false); } catch(e) { err++ };
        err.should.eql(5);

    } );

    it( 'Loads external libs', function(done) {

        atomus ().html ('<html><head></head><body><div id="fb-root"></div></body></html>').ready(function (errors, window) {
            var tq2 = tqLib(window);
            should.not.exist(window.FB);
            tq2('https://connect.facebook.net/en_US/sdk.js', function() {
                should.exist(window.FB);
                tq2('https://connect.facebook.net/en_US/sdk.js', function() {
                    done();
                });
            });
        });
    } );

    it('Uses global queue', function(done) {

        var html = '';
        html += '<html><head>';
        html += '<script>var myOwnQueue = myOwnQueue || []; myOwnQueue.push(function(){ throw new Error(\'Hola!\');});</script>';
        html += '</head><body>';
        html += '<script>var myOwnQueue = myOwnQueue || []; myOwnQueue.push([\'abc\',function(t){ t.got(\'end\');}]);</script>';
        html += '<script>var myOwnQueue = myOwnQueue || []; myOwnQueue.push([\'bca\',function(t){t.got(\'abc\');},true]);</script>';
        html += '<script>var myOwnQueue = myOwnQueue || []; myOwnQueue.push(function(t){ t.got(\'bca\');});</script>';
        html += '</body></html>';

        atomus ().html (html).ready(function (errors, window) {
            var tq2 = tqLib(window);
            var errors = [];

            window.myOwnQueue.push(['end', function(){
                done();
            }]);

            tq2.process(window.myOwnQueue, function(callback) {
                try {
                    callback(tq2);
                } catch(e) {
                    errors.push(e);
                }
            });
        });

    });
});