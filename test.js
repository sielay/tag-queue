var
    window = {w : 1},
    tq = require ('./index') (window),
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
});