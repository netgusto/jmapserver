'use strict';

const Collaborateur = {
    id: { type: 'UUID', primaryKey: true },
    email: { type: 'String', required: true },
    password: { type: 'String' },
    nom: { type: 'String', required: true },
    prenom: { type: 'String', required: true },
    roles: { type: 'Array', required: true },
    departements: { type: 'Array', required: false },
    desactive: { type: 'Boolean', required: true, default: false }
};

export default {
    Collaborateur
};
