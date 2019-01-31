'use strict';

export function shotgun(id, instance):Promise<any> {
    return new Promise(resolve => {
        const shotgun = function (e) {
            if (e.detail !== id) {
                return;
            }
            
            const evt = new CustomEvent('shotgun-master', { 
                detail: { name: id, master: instance } });
            window.dispatchEvent(evt);
        };

        const master = function (e) {
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

        const evt = new CustomEvent('shotgun', { detail: id });
        window.dispatchEvent(evt);
    })
}
