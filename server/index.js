const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');

const app = express();
const port = 4000

app.get('/', (req, res) => {
  res.send(
    `<html>
      <body>
        <div id="app"></div>
        <script>
          fetch('/graphql', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
            body: JSON.stringify({
              operationName: "HelloWorld",
              query: "query HelloWorld{ hello }"
            })
          })
            .then(r => r.json())
            .then(json => document.querySelector('#app').innerHTML = json.data.hello || 'Error. Check console.');
        </script>
      </body>
    </html>`
  );
});

// Construct a schema, using GraphQL schema language
const schema = buildSchema(`
  type Query {
    hello: String
  }
`);

// The root provides a resolver function for each API endpoint
const root = {
  hello: () => {
    return 'Hello world!';
  },
};

app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));

app.listen(port);
console.log('Running server at http://localhost:4000 and GraphQl at http://localhost:4000/graphql');