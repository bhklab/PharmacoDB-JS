const csv = require('csvtojson');
const path = require('path');

const fileLocation = path.join('pharmacodi-data', 'dataset_cell.csv');
const parserParams = { 
    delimiter: ',', 
    quote: '"',
    ignoreEmpty: true
};

exports.seed = function (knex) {
    return knex('dataset_cell').del()
        .then(function () {
            return csv(parserParams).fromFile(fileLocation);
        })
        .then(function (data) {
            return knex('dataset_cell').insert(data);
        });
};
