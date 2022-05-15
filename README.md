# @bahmutov/cy-api
![cypress version](https://img.shields.io/badge/cypress-9.6.1-brightgreen)
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

## Configuration

| var env | default value | description |
|---------|---------------|-------------|
| CYPRESS_GQL_URL | null | The url of the GraphQL endpoint (Required) |

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
