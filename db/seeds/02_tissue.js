const csv = require('csvjson');
const fs = require('fs');
const path = require('path');

const fileLocation = path.join('..', 'data', 'latest', 'tissue.csv');
const file = fs.readFileSync(fileLocation, 'utf8');
const options = { delimiter: ',' };
const data = csv.toObject(file, options);

exports.seed = function (knex) {
    return knex('tissue').del()
        .then(function () {
            return knex('tissue').insert(data);
        });
};
