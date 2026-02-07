const { makeExecutableSchema } = require('@graphql-tools/schema');

// Construct a schema, using GraphQL schema language
const typeDefs = `
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
`;

const printHelloWorld = function (_source, _args, context, _info) {
    const { token } = context;
    if (token) {
        return 'Hello you!';
    }
    return 'Hello world!';
};

const getTodo = function (_source, args, _context, _info) {
    const id = args.id;
    return TODO.filter(todo => {
        return todo.id == id;
    })[0];
};

const getTodos = function (_source, args, _context, _info) {
    const showHidden = args.showHidden ?? false;
    if (showHidden == false) {
        return TODO.filter(todo => todo.hidden === false);
    }
    return TODO;
};

const TODO = [
    {
        id: 1,
        text: 'Learn Node.js by building real-world applications with Node, Express, MongoDB, Mocha, and more!',
        hidden: false,
    },
    {
        id: 2,
        text: 'Learn by example building & deploying real-world Node.js applications from absolute scratch',
        hidden: true,
    },
    {
        id: 3,
        text: 'An advanced JavaScript course for everyone! Scope, closures, prototypes, this, build your own framework, and more.',
        hidden: false,
    },
];

const resolvers = {
    Query: {
        hello: printHelloWorld,
        todo: getTodo,
        todos: getTodos,
    },
};

const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
});

module.exports = { schema, TODO };
