# @mavrou/cy-graphql
[![build](https://github.com/dimavroudis/cy-graphql/actions/workflows/build.yml/badge.svg?branch=master)](https://github.com/dimavroudis/cy-graphql/actions/workflows/build.yml) [![NPM Version](https://img.shields.io/npm/v/%40mavrou%2Fcy-graphql?logo=npm)](https://www.npmjs.com/package/@mavrou/cy-graphql) ![npms.io](https://img.shields.io/npms-io/final-score/%40mavrou%2Fcy-graphql?logo=npm)
 [![NPM Downloads](https://img.shields.io/npm/dw/%40mavrou%2Fcy-graphql?logo=npm)](https://www.npmjs.com/package/@mavrou/cy-graphql)

> A collection of custom commands for end-to-end GraphQL testing

## Install

```
npm install --save-dev @mavrou/cy-graphql
```

or
```
yarn add -D @mavrou/cy-graphql
```

Add the following line to your Cypress support file.
```js
// usually cypress/support/index.js
import '@mavrou/cy-graphql'
```

Add the `gqlUrl` environmental variable to your `cypress.config.ts` or `cypress.config.js`. Change the value with your own GraphQL endpoint url.
```json
{
    "env": {
        "gqlUrl": "http://localhost:4000/graphql" 
    }
}
```

## Usage

### cy.gql

`cy.gql` is a wrapper of `cy.request` that makes it easy to create GraphQL requests from a cypress test.
```js
cy.gql(
    `query HelloWorld{
        hello
    }`,
).then(response => {
    expect(response).to.include.keys([
        'status',
        'statusText',
        'body',
        'requestHeaders',
        'headers',
        'duration'
    ])
    expect(response.body).to.deep.equal({
        data: {
            hello: 'Hello world!'
        }
    });
});
```

The second argument accepts options similar to `cy.request` ([accepts these values](https://docs.cypress.io/api/commands/request#Arguments), except `body` and  `method`). It also accepts an additional option `variables` that allows you to pass GraphQL variables.
```js
cy.gql(
    `query GetTodo($id: Int){
        todo(id:$id){
            id
            text
        }
    }`,
    { 
        variables:{ id: 1 }
        auth: { bearer: 'bearerToken' }
    }
)
```

### cy.interceptGql

`cy.interceptGql` allows fast and easy interception of GraphQL requests using only the `operationName`.
```js
cy.interceptGql("HelloWorld");
cy.visit('');
cy.wait('@HelloWorld').then(intercept => {
    expect(intercept.response.body).to.deep.equal({
        data: {
            hello: 'Hello world!'
        }
    });
})
```

You can also intercept multiple GraphQL requests by passing an array of operationNames.
```js
cy.interceptGql(['HelloWorld', 'GetTodo']);
cy.visit('');
cy.wait(['@HelloWorld', '@GetTodo'])
```

Similar to intercept you can pass a [routeHandler](https://docs.cypress.io/api/commands/intercept#routeHandler-lt-code-gtFunctionlt-code-gt).
The `routeHandler` function is called whenever a request is matched, with the first argument being the request object. From inside the callback, you have access to the entire request-response where you can modify the outgoing request, send a response, access the real response, and more.
```js
cy.interceptGql("HelloWorld", (req) => req.alias = 'Lesson101'));
cy.visit('');
cy.wait('@Lesson101').then(intercept => {
    expect(intercept.response.body).to.deep.equal({
        data: {
            hello: 'Hello world!'
        }
    });
})
```

Sometimes you can have a lot of request with the same operationName, but different variables. Using the `variableRules` you can intercept requests based on the property path and/or value of a variable. Nested property paths are supported and the `value` property is optional to allow matching only with propertyPath.
```js
cy.interceptGql('GetTodo', [{ propertyPath: 'params.showHidden', value: false }]);
cy.visit('');
cy.wait('@GetPublicTodo').then(intercept => {
    expect(intercept.request.body).to.have.property('operationName', 'GetTodo');
    expect(intercept.request.body).to.have.nested.property('variables.showHidden', false);
})
```
```js
cy.interceptGql('GetTodo', [{ propertyPath: 'params.showHidden' }]);
cy.visit('');
cy.wait('@GetPublicTodo').then(intercept => {
    expect(intercept.request.body).to.have.property('operationName', 'GetTodo');
    expect(intercept.request.body).to.have.nested.property('variables.showHidden', false);
})
```
```js
cy.interceptGql('GetTodo', [{ propertyPath: 'params.showHidden' }], , (req) => req.alias = 'GetAllTodo'));
cy.visit('');
cy.wait('@GetPublicTodo').then(intercept => {
    expect(intercept.request.body).to.have.property('operationName', 'GetTodo');
    expect(intercept.request.body).to.have.nested.property('variables.showHidden', false);
})
```

You can even shorten the last example, by passing a custom `alias` as the 3rd argument.
```js
cy.interceptGql('GetTodo', [{ propertyPath: 'params.showHidden' }], 'GetAllTodo');
cy.visit('');
cy.wait('@GetPublicTodo').then(intercept => {
    expect(intercept.request.body).to.have.property('operationName', 'GetTodo');
    expect(intercept.request.body).to.have.nested.property('variables.showHidden', false);
})
```

## TypeScript

If your using TypeScript with Cypress, you can add type in your `tsconfig.json`.

```json
{
    "compilerOptions": {
        "types": [
            "cypress",
            "@mavrou/cy-graphql"
        ]
    }
}
```

## MIT License

Copyright (c) 2022 Dimitris Mavroudis &lt;im.dimitris.mavroudis@gmail.com&gt;

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.

[renovate-badge]: https://img.shields.io/badge/renovate-app-blue.svg
[renovate-app]: https://renovateapp.com/
