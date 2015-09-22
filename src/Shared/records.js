'use strict';

import Immutable from 'immutable';
import moment from 'moment';

import Struct from './structs';
import Role from './StaticData/Role';
import StructToRecordSchema from './Utils/StructToRecordSchema';

class Collaborateur extends Immutable.Record(StructToRecordSchema(Struct.Collaborateur)) {

    label() { return this.get('prenom') + ' ' + this.get('nom'); }

    shortLabel() { return this.get('nom'); }

    isEnabled() { return !this.get('desactive'); }

    getRoles() { return Immutable.fromJS(this.get('roles')); }

    isAdmin() { return this.getRoles().contains(Role.ADMIN); }

    isFacturation() { return this.isAdmin() || this.getRoles().contains(Role.FACTURATION); }

    isPilotage() { return this.isAdmin() || this.getRoles().contains(Role.PILOTAGE); }

    isAgentAdministratif() { return this.isAdmin() || this.getRoles().contains(Role.AGENTADMINISTRATIF); }

    isEvaluateur() { return this.getRoles().contains(Role.EVALUATEUR); }

    isConcerneParDepartement(deptcode) { return this.get('departements').indexOf(deptcode) > -1; }

    validate(...options) { return CollaborateurValidation(this, ...options); }
}

export default {
    Collaborateur
};
