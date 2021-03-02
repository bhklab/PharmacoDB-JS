const csv = require('csvtojson');
const path = require('path');

const fileLocation = path.join('pharmacodi-data', 'tissue_synonym.csv');
const parserParams = { 
    delimiter: ',', 
    quote: '"',
    ignoreEmpty: true
};

exports.seed = function (knex) {
    return knex('tissue_synonym').del()
        .then(function () {
            return csv(parserParams).fromFile(fileLocation);
        })
        .then(function (data) {
            return knex('tissue_synonym').insert(data);
        });
};
