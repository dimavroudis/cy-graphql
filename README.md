# @mavrou/cy-graphql
[![build](https://github.com/dimavroudis/cy-graphql/actions/workflows/build.yml/badge.svg?branch=master)](https://github.com/dimavroudis/cy-graphql/actions/workflows/build.yml) ![cypress version](https://img.shields.io/badge/cypress-9.6.1-brightgreen)
> A collection of custom commands for end-to-end GraphQL testing

## Install

```
npm install --save-dev @mavrou/cy-graphql
```

or

```
yarn add -D @mavrou/cy-graphql
```

Add the following line to your Cypress support file

```js
// usually cypress/support/index.js
import '@mavrou/cy-graphql'
```

Set the `GQL_URL` environment variable to your cypress.json to point to you GraphQL endpoint.

```json
{
    "env": {
        //replace value with your own GraphQL endpoint
        "GQL_URL": "http://localhost:4000/graphql" 
    }
}
```
## Usage

### cy.gql

cy.gql is wrapper od cy.request that makes it easy to create GraphQL requests from a cypress test
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

The second argument accepts options similar to `cy.request` [(accepts these value)](https://docs.cypress.io/api/commands/request#Arguments, except `url`, `body` and  `method`). It also accepts an additional option `variables` that allows you to pass GraphQL variables.
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

`cy.interceptGql` allows fast and easy interception of GraphQL requests using only the operationName.
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

You can also intercept multiple GraphQL requests by passing an array of operationNames
```js
cy.interceptGql(['HelloWorld', 'GetTodo']);
cy.visit('');
cy.wait(['@HelloWorld', '@GetTodo'])
```

You can use variables to improve selection. The 2nd argument accepts an array of rules to match against the variables. 
In this case, you can also add a 3rd argument for a custom alias.
```js
cy.interceptGql('GetTodo', [{ propertyPath: 'showHidden', value: false }], 'GetPublicTodo');
cy.visit('');
cy.wait('@GetPublicTodo').then(intercept => {
    expect(intercept.request.body).to.have.property('operationName', 'GetTodo');
    expect(intercept.request.body).to.have.nested.property('variables.showHidden', false);
})
```
Using a nested propertyPath will also work. If no 'value' is passed, it matches requests that have the property)
```js
cy.interceptGql('GetTodo', [{ propertyPath: 'params.showHidden' }], 'GetPublicTodo');
cy.visit('');
cy.wait('@GetPublicTodo').then(intercept => {
    expect(intercept.request.body).to.have.property('operationName', 'GetTodo');
    expect(intercept.request.body).to.have.nested.property('variables.showHidden', false);
})
```

## Configuration

| var env         | default value | description                                |
| --------------- | ------------- | ------------------------------------------ |
| CYPRESS_GQL_URL | null          | The url of the GraphQL endpoint (Required) |

## TypeScript

If your using TypeScript with Cypress, you can add type in your `tsconfig.json`

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
