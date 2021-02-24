const csv = require('csvjson');
const fs = require('fs');
const path = require('path');

// assume we are running this from PharmacoDB-JS directory
const fileLocation = path.join('..', 'data', 'latest', 'dataset.csv');
const file = fs.readFileSync(fileLocation, 'utf8'); //why readFileSync instead of readFile?
const options = { delimiter: ',' };
const data = csv.toObject(file, options);

exports.seed = function (knex) {
    // Deletes ALL existing entries
    return knex('dataset').del()
        .then(function () {
            // Inserts seed entries
            return knex('dataset').insert(data);
        });
};
