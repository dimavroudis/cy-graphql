interface VariableRule {
    propertyPath: string,
    value?: any
}

declare namespace Cypress {

    interface Chainable {
        /**
         * Custom command to execute GraphQL operations to the server.
         *
         * @example
         *      cy.gql(
         *          `query GetProject($id: ID!){
         *              project(id: $id){
         *                  id
         *                  title
         *              }
         *          }`, 
         *          { id: 1 }
         *      ).then(response => {
         *          expect(response).to.include.keys([
         *              'status',
         *              'statusText',
         *              'body',
         *              'requestHeaders',
         *              'headers',
         *              'duration'
         *          ])
         *          expect(response.body).to.deep.equal({ 
         *              data: { 
         *                  project: { 
         *                      id:1, 
         *                      title:"Hello World" 
         *                  }
         *              } 
         *          });
         *      });
         */
        gql<T>(query: string, variables?: Object, options?: Partial<Cypress.RequestOptions>): Chainable<Response<T>>

        /**
         * Use `cy.interceptGql()` to intercept a GraphQL request by its operationName and its variables.
         *
         * @example
         *      cy.interceptGql('HelloWorld');
         *      cy.wait('@HelloWorld);
         * 
        * @example
         *      cy.interceptGql('GetTodos', [{ propertyPath: 'showHidden', value:true }], 'GetAllTodos');
         *      cy.wait('@GetAllTodos);
         */
        interceptGql(operationName: string, variablesRules?: VariableRule[], alias?: string): Chainable<null>

        /**
         * Use `cy.interceptGql()` to intercept a list of GraphQL requests by their operationName
         *
         * @example
         *      cy.interceptGql(['HelloWorld', 'getTodo']);
         *      cy.wait(['@HelloWorld', '@getTodo']);
         */
        interceptGql(operationName: string[]): Chainable<null>
    }
}
