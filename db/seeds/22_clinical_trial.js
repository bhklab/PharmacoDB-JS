const csv = require('csvtojson');
const path = require('path');

const fileLocation = path.join('pharmacodi-data', 'clinical_trial.csv');
const parserParams = { 
    delimiter: ',', 
    quote: '"',
    ignoreEmpty: true
};

exports.seed = function (knex) {
    return knex('clinical_trial').del()
        .then(function () {
            return csv(parserParams).fromFile(fileLocation);
        })
        .then(function (data) {
            return knex('clinical_trial').insert(data);
        });
};
