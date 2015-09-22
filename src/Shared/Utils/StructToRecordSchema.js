'use strict';

export default (struct) => {
    let schema = { id: null };

    for(let propname in struct) {
        let propspecs = struct[propname];
        let def = null;

        if('default' in propspecs) {
            def = propspecs.default;
        } else {
            if('required' in propspecs && propspecs.required) {
                switch(propspecs.type) {
                    case 'String': { def = ''; break; }
                    case 'Array': { def = []; break; }
                    case 'Object': { def = {}; break; }
                }
            }
        }

        schema[propname] = def;
    }

    return schema;
};
