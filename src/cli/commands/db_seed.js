'use strict';

import Chalk from 'chalk';

export const meta = function() {
    return {
        'command': 'db:seed',
        'description': `Injection des données d'initialisation dans la BDD.`
    };
};

export default function() {

    return function *({ args, trunk }) {

        const { Collaborateur } = trunk.models;

        yield Collaborateur.create({
            email: "contact@netgusto.com",
            password: "$2a$10$zdhifpOumiiG.yBHNLnlsusCDbLfMLBBpYWcj0AtMHNm/PFDBPuVC",
            nom: 'Schneider',
            prenom: 'Jérôme',
            roles: ['ROLE_ADMIN'],
            departements: ["67", "68"],
            desactive: false
        });

        console.log(Chalk.yellow('Utilisateur contact@netgusto.com créé.'));
    };
}
