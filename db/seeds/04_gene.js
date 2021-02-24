const csv = require('csvjson');
const fs = require('fs');
const path = require('path');

const fileLocation = path.join('..', 'data', 'latest', 'gene.csv');
const file = fs.readFileSync(fileLocation, 'utf8');
const options = { delimiter: ',' };
const data = csv.toObject(file, options);

exports.seed = function (knex) {
    return knex('gene').del()
        .then(function () {
            return knex('gene').insert(data);
        });
};
