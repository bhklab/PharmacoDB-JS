const csv = require('csvtojson');
const fs = require('fs');
const path = require('path');

// Create readStream because dose_response is a large table
const fileLocation = path.join('pharmacodi-data', 'dose_response.csv');
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
    await knex('dose_response').insert(rows)
            .then(data => {
                let startRow = numRows + 1;
                let endRow = numRows + rows.length;
                console.log('Inserted rows ' + startRow + 
                            ' to ' + endRow + 
                            ' into dose_response table.')
                numRows = endRow;
                rows = [];
            })
            .catch(error => {
                console.log(error.stack);
            });
    
}


exports.seed = async function (knex) {
    await knex('dose_response').del()
        .on('query', function () {
            console.log('Deleting rows from dose_response table...')
        })
        .on('query-response', function (data) {
            console.log("Deleted all rows from dose_response table.");
        })
        .on('query-error', function(error, obj) {
            console.log(error.stack);
        })

    await csv(parserParams)
        .fromStream(readStream)
        .subscribe(async function(obj) {
            rows.push(obj);
            if (rows.length >= chunkSize) {
                readStream.pause();
                await insertRows(knex);
                readStream.resume();
            }
        },
        (error) => { console.log(error.stack); }, 
        async () => { await insertRows(knex); } )
    
    return;
};
