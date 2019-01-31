'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
function shotgun(id, instance) {
    return new Promise(function (resolve) {
        var shotgun = function (e) {
            if (e.detail !== id) {
                return;
            }
            var evt = new CustomEvent('shotgun-master', {
                detail: { name: id, master: instance }
            });
            window.dispatchEvent(evt);
        };
        var master = function (e) {
            if (e.detail.name === id) {
                if (e.detail.master !== instance) {
                    window.removeEventListener('shotgun', shotgun);
                }
                resolve(e.detail.master);
                window.removeEventListener('shotgun-master', master);
            }
        };
        window.addEventListener('shotgun-master', master);
        window.addEventListener('shotgun', shotgun);
        var evt = new CustomEvent('shotgun', { detail: id });
        window.dispatchEvent(evt);
    });
}
exports.shotgun = shotgun;
