const csv = require('csvtojson');
const path = require('path');

const fileLocation = path.join('pharmacodi-data', 'drug_annotation.csv');
const parserParams = { 
    delimiter: ',', 
    quote: '"',
    ignoreEmpty: true
};

exports.seed = function (knex) {
    return knex('drug_annotation').del()
        .then(function () {
            return csv(parserParams).fromFile(fileLocation);
        })
        .then(function (data) {
            return knex('drug_annotation').insert(data);
        });
};
