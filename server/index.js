const express = require('express');
const { createYoga } = require('graphql-yoga');
const { schema } = require('./graphql');
const path = require('path');
const app = express();
const port = 4000;

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});

const context = ({ request }) => ({
    token: request.headers.get('authorization'),
});

app.use(
    '/graphql',
    createYoga({
        schema,
        graphiql: true,
        context,
    })
);
app.use(express.json()); // Add JSON parser

app.listen(port);
console.log('Running server at http://localhost:4000 and GraphQl at http://localhost:4000/graphql');
