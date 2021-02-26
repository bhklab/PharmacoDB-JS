const csv = require('csvtojson');
const path = require('path');

const fileLocation = path.join('..', 'data', 'latest', 'gene_target.csv');
const parserParams = { 
    delimiter: ',', 
    quote: '"',
    ignoreEmpty: true
};

exports.seed = function (knex) {
    return knex('gene_target').del()
        .then(function () {
            return csv(parserParams).fromFile(fileLocation);
        })
        .then(function (data) {
            return knex('gene_target').insert(data);
        });
};
