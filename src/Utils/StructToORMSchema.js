'use strict';

import Sequelize from 'sequelize';

export default (struct) => {

    let schema = {};

    for(let propname in struct) {
        const propspecs = struct[propname];
        const propschema = {};

        switch(propspecs.type) {
            case 'String': {
                propschema.type = Sequelize.STRING;
                break;
            }
            case 'Date': {
                propschema.type = Sequelize.DATE;
                break;
            }
            case 'Integer': {
                propschema.type = Sequelize.INTEGER;
                break;
            }
            case 'Float': {
                propschema.type = Sequelize.FLOAT;
                break;
            }
            case 'Boolean': {
                propschema.type = Sequelize.BOOLEAN;
                break;
            }
            case 'Array':
            case 'Object': {
                //propschema.type = Sequelize.JSONB;
                propschema.type = Sequelize.JSON;
                //propschema.get = function() { return JSON.parse(this.getDataValue(propname)); };
                //propschema.set = function(val) { this.setDataValue(propname, JSON.stringify(val)); };
                break;
            }
            case 'UUID': {
                propschema.type = Sequelize.UUID;
                propschema.defaultValue = Sequelize.UUIDV4;
                break;
            }
        }

        if('required' in propspecs && propspecs.required) {
            propschema.allowNull = false;
        } else {
            propschema.allowNull = true;
        }

        if('default' in propspecs) {
            let defaultValue;
            if(['Array', 'Object'].indexOf(propspecs.type) > -1) {
                defaultValue = JSON.stringify(propspecs.default);
            } else {
                defaultValue = propspecs.default
            }
            propschema.defaultValue = defaultValue;
        }

        if('primaryKey' in propspecs && propspecs.primaryKey) {
            propschema.primaryKey = true;
        }

        schema[propname] = propschema;
    }

    return schema;
};
