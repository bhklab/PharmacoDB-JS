const csv = require('csvtojson');
const path = require('path');

const fileLocation = path.join('pharmacodi-data', 'gene.csv');
const parserParams = { 
    delimiter: ',', 
    quote: '"',
    ignoreEmpty: true
};

exports.seed = function (knex) {
    return knex('gene').del()
        .then(function () {
            return csv(parserParams).fromFile(fileLocation);
        })
        .then(function (data) {
            return knex('gene').insert(data);
        });
};
