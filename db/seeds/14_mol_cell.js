const csv = require('csvtojson');
const path = require('path');

const fileLocation = path.join('pharmacodi-data', 'mol_cell.csv');
const parserParams = { 
    delimiter: ',', 
    quote: '"',
    ignoreEmpty: true
};

exports.seed = function (knex) {
    return knex('mol_cell').del()
        .then(function () {
            return csv(parserParams).fromFile(fileLocation);
        })
        .then(function (data) {
            return knex('mol_cell').insert(data);
        });
};
