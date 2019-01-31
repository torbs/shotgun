'use strict';

/* eslint-disable import/no-extraneous-dependencies */

let evts = [];
let queue = [];
let timer = false;

global.CustomEvent = function (type, detail = {}) {
    this.type = type;
    Object.assign(this, detail);
};

function dispatchEvent(evt) {
    evts.forEach((item) => {
        if (item.type === evt.type) {
            queue.push(() => {
                if (evts.indexOf(item) !== -1) {
                    item.func(evt);
                }
            });
        }
    });
    if (!timer) {
        timer = setTimeout(() => {
            while (queue[0]) {
                queue.pop()();
            }
            timer = false;
        }, 0);
    }
}

global.self = global.window = {
    addEventListener: (type, func) => {
        evts.push({
            type,
            func,
        });
    },
    removeEventListener: (type, func) => {
        evts = evts.filter((evt) => {
            if (!func) {
                return evt.type !== type;
            }
            return evt.type !== type || evt.func !== func;
        });
    },
    dispatchEvent,
};

module.exports = {
    reset: () => {
        evts = [];
        queue = [];
        timer = false;
        Object.keys(global.localStorage).forEach((key => global.localStorage.removeItem(key)));
    },
};
