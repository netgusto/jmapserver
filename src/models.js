'use strict';

import Record from './Shared/records';
import Struct from './Shared/structs';

import StructToORMSchema from './Utils/StructToORMSchema';

export default function({ db }) {

    const sequelizeModelOptions = {
        freezeTableName: true,  // Model tableName will be the same as the model name
        underscored: true       // updated_at instead of updatedAt
    };

    /* Collaborateur *****************************************************************/

    const CollaborateurSchema = StructToORMSchema(Struct.Collaborateur);
    const Collaborateur = db.define('collaborateur', CollaborateurSchema, {
        instanceMethods: {
            toRecord: function() {
                return new Record.Collaborateur(this.get({ plain: true }));
            }
        },
        ...sequelizeModelOptions
    });

    return {
        Collaborateur
    };
}
