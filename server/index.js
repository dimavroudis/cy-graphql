const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { schema, root } = require('./graphql');
const path = require('path');
const app = express();
const port = 4000;

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/index.html'));
});

const context = async req => {
  const { authorization: token } = req.headers;
  return { token };
};

app.use(
  '/graphql',
  graphqlHTTP(
    async (req) => ({
      schema: schema,
      rootValue: root,
      graphiql: true,
      context: () => context(req)
    })
  )
);

app.listen(port);
console.log('Running server at http://localhost:4000 and GraphQl at http://localhost:4000/graphql');