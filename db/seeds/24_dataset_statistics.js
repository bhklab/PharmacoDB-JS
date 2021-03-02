const csv = require('csvtojson');
const path = require('path');

const fileLocation = path.join('pharmacodi-data', 'dataset_statistics.csv');
const parserParams = { 
    delimiter: ',', 
    quote: '"',
    ignoreEmpty: true
};

exports.seed = function (knex) {
    return knex('dataset_statistics').del()
        .then(function () {
            return csv(parserParams).fromFile(fileLocation);
        })
        .then(function (data) {
            return knex('dataset_statistics').insert(data);
        });
};
