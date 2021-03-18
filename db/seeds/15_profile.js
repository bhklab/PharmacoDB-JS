const csv = require('csvtojson');
const fs = require('fs');
const { validate } = require('graphql');
const path = require('path');

// Create readStream because profile is a large table
const fileLocation = path.join('pharmacodi-data', 'profile.csv');
const readStream = fs.createReadStream(fileLocation); 

// Create a converter to pipe to
const parserParams = { 
    delimiter: ',', 
    quote: '"',
    ignoreEmpty: true
};

let rows = [];
let numRows = 0;
const chunkSize = 100000; // number of table rows to insert at once

const insertRows = async (knex) => {
    await knex('profile').insert(rows)
            .then(data => {
                let startRow = numRows + 1;
                let endRow = numRows + rows.length;
                console.log('Inserted rows ' + startRow + 
                            ' to ' + endRow + 
                            ' into profile table.')
                numRows = endRow;
                rows = [];
            })
            .catch(error => {
                console.log(error.stack);
            });
    
}

exports.seed = async function (knex) {
    await knex('profile').del()
        .on('query', function () {
            console.log('Deleting rows from profile table...')
        })
        .on('query-response', function (data) {
            console.log("Deleted all rows from profile table.");
        })
        .on('query-error', function(error, obj) {
            console.log(error.stack);
        })

    await csv(parserParams)
        .fromStream(readStream)
        .subscribe(async function(obj) {
            // Replace inf and -inf with NULL (mostly for IC50)
            Object.keys(obj).forEach(key => {
                if (obj[key] == 'inf' || obj[key] == '-inf') {
                    delete obj[key];
                }
            })

            rows.push(obj);
            
            if (rows.length >= chunkSize) {
                readStream.pause();
                await insertRows(knex);
                readStream.resume();
            }
        },
        function(error) { 
            console.log(error.stack);
        })

    // Insert any remaining rows (onCompleted cannot be async?)
    await insertRows(knex);    
};
