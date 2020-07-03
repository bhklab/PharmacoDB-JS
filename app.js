const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const knexLogger = require('knex-logger');
const morgan = require('morgan');
const db = require('./db/knex');
const cors = require('cors');

// importing the graphql schema and resolver functions.
const graphQlSchema = require('./graphql/schema/index');
const graphQlResolvers = require('./graphql/resolvers/index');

// express server.
const app = express();
app.use(cors());

// logging.
app.use(knexLogger(db));
app.use(morgan('dev'));

// body parser.
app.use(bodyParser.json());
// serves static build files
app.use(express.static(path.join(__dirname, 'client/build')));

// setting up the graphql end points.
// passing in the graphql schema and resolver functions.
app.use(
    '/graphql',
    graphqlHttp({
        schema: graphQlSchema,
        rootValue: graphQlResolvers,
        graphiql: true
    })
);

// renders react files if request doesn't go to api
app.get('/*', (req, res) => {
    res.sendFile('index.html', { root: './client/build' });
});

// use port no. 5000 for server if environment variable is not present.
const port = process.env.PORT || 5000;
const server = app.listen(port, () => {
    console.log('Server Started');
});

module.exports = server;