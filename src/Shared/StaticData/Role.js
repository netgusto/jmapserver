'use strict';

const Role = {
    EVALUATEUR: 'ROLE_EVALUATEUR',
    AGENTADMINISTRATIF: 'ROLE_AGENTADMINISTRATIF',
    PILOTAGE: 'ROLE_PILOTAGE',
    FACTURATION: 'ROLE_FACTURATION',
    ADMIN: 'ROLE_ADMIN'
};

export const Label = {
    [Role.EVALUATEUR]: 'Évaluateur',
    [Role.AGENTADMINISTRATIF]: 'Agent administratif',
    [Role.PILOTAGE]: 'Pilotage',
    [Role.FACTURATION]: 'Facturation',
    [Role.ADMIN]: 'Administrateur'
};

export default Role;
