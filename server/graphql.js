const { buildSchema } = require('graphql');

// Construct a schema, using GraphQL schema language
const schema = buildSchema(`
  type Query {
    hello: String
    todo(id: Int!): Todo
    todos(showHidden: Boolean): [Todo]
  }
  type Todo{
    id: Int
    text: String
    hidden: Boolean
  }
`);

const printHelloWorld = function () {
    return 'Hello world!';
}

const getTodo = function (args) {
    const id = args.id;
    return TODO.filter(todo => {
        return todo.id == id;
    })[0];
}

const getTodos = function (args) {
    const showHidden = args.showHidden ?? false;
    if (showHidden == false) {
        return TODO.filter(todo => todo.hidden === false);
    }
    return TODO;
}

const TODO = [
    {
        id: 1,
        text: 'Learn Node.js by building real-world applications with Node, Express, MongoDB, Mocha, and more!',
        hidden: false
    },
    {
        id: 2,
        text: 'Learn by example building & deploying real-world Node.js applications from absolute scratch',
        hidden: true
    },
    {
        id: 3,
        text: 'An advanced JavaScript course for everyone! Scope, closures, prototypes, this, build your own framework, and more.',
        hidden: false
    }
];

// The root provides a resolver function for each API endpoint
const root = {
    hello: printHelloWorld,
    todo: getTodo,
    todos: getTodos
};

module.exports = { root, schema, TODO };
