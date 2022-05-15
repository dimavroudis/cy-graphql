
declare namespace Cypress {

    interface Chainable {
        /**
         * Custom command to execute GraphQl operations to the server.
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
        * Use `cy.interceptGql()` to stub and intercept GraphQl requests and responses.
        *
        * @example
        *      cy.interceptGql('gqlGetProject');
        *      cy.wait('@gqlGetProject);
        */
        interceptGql(operationName:string): Chainable<null>
    }
}
