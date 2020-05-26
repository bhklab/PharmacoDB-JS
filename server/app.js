const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');

// importing the graphql schema and resolver functions.
const graphQlSchema = require('./graphql/schema/index');
const graphQlResolvers = require('./graphql/resolvers/index');

// express server.
const app = express();

// body parser.
app.use(bodyParser.json());


// setting up the graphql end points.
// passing in the graphql schema and resolver functions.
app.use('/graphql', graphqlHttp({
    schema: graphQlSchema,
    rootValue: graphQlResolvers,
    graphiql: true
}));



app.listen(5000);