'use strict';

import R from 'ramda';

export default function(deps, generator) {
    if(generator.constructor.name !== 'GeneratorFunction') { throw new Error('Injected function must be a generator !'); }
    return function* (next) {
        const resolved = Object.values(R.pickAll(deps, this.app.trunk));
        yield generator.apply(this, [next, ...resolved]);
    };
}
