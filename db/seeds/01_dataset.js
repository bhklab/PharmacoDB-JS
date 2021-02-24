const csv = require('csvjson');
const fs = require('fs');
const path = require('path');

//const fileLocation = path.join()
const data = csv.toObject(file, options);

exports.seed = function (knex) {
    // Deletes ALL existing entries
    return knex('dataset').del()
        .then(function () {
            // Inserts seed entries
            return knex('dataset').insert(data);
        });
};
