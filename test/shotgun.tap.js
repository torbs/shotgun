'use strict';

/* eslint-disable import/no-extraneous-dependencies*/

const { shotgun } = require('../dist/shotgun');
const tap = require('tap');
require('./helpers');

// tap.runOnly = true;

tap.test('should return the object', (t) => {
    class X {
        y() {
            return this;
        }
    }

    shotgun('test1', new X())
        .then((x) => {
            t.ok(x instanceof X);
            t.end();
        });
});

tap.test('One class should become master and the other slave', (t) => {
    class X {
        constructor() {
            this.data = [];
        }
        push() {
            this.data.push('X');
        }
    }

    const master = new X();
    const slave = new X();
    Promise.all([shotgun('test2', master), shotgun('test2', slave)])
        .then(([x, y]) => {
            x.push();
            y.push();
            t.ok(x === y);
            t.notSame(master.data, slave.data);
            const lengths = [master.data.length, slave.data.length].sort();
            t.equal(lengths[0], 0);
            t.equal(lengths[1], 2);
            t.end();
        });
});

tap.test('Both class should become master if id is different', (t) => {
    class X {
        test() {
            return this;
        }
    }

    Promise.all([shotgun('t1', new X()), shotgun('t2', new X())])
        .then(([x, y]) => {
            y.test();
            x.test();
            t.ok(x !== y);
            t.ok(x.test() !== y.test());
            t.end();
        });
});

tap.test('Three instances. Two master, one slave', (t) => {
    class X {
        test() {
            return this;
        }
    }

    Promise.all([shotgun('t4', new X()), shotgun('t4', new X()), shotgun('t3', new X())])
        .then(([x, y, z]) => {
            t.ok(x !== z);
            t.ok(x === y);
            t.end();
        });
});
