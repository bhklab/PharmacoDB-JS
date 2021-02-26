const csv = require('csvtojson');
const path = require('path');

const fileLocation = path.join('..', 'data', 'latest', 'cell_synonym.csv');
const parserParams = { 
    delimiter: ',', 
    quote: '"',
    ignoreEmpty: true
};

exports.seed = function (knex) {
    return knex('cell_synonym').del()
        .then(function () {
            return csv(parserParams).fromFile(fileLocation);
        })
        .then(function (data) {
            return knex('cell_synonym').insert(data);
        });
};
