const csv = require('csvtojson');
const path = require('path');

const fileLocation = path.join('pharmacodi-data', 'tissue.csv');
const parserParams = { 
    delimiter: ',', 
    quote: '"',
    ignoreEmpty: true
};

exports.seed = function (knex) {
    return knex('tissue').del()
        .then(function () {
            return csv(parserParams).fromFile(fileLocation);
        })
        .then(function (data) {
            return knex('tissue').insert(data);
        });
};
