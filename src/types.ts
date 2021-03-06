import * as NetStubbing from 'cypress/types/net-stubbing';


declare global {

    type GqlRequestInterceptor = (req: NetStubbing.CyHttpMessages.IncomingHttpRequest) => void | Promise<void>

    interface VariableRule {
        propertyPath: string,
        value?: any
    }

    interface GraphQLOptions extends Cypress.Loggable, Cypress.Timeoutable, Cypress.Failable {
        auth: object
        encoding: Cypress.Encodings
        followRedirect: boolean
        form: boolean
        gzip: boolean
        headers: object
        qs: object
        variables: object
    }

    namespace Cypress {

        interface Chainable {
            /**
             * Custom command to execute GraphQL operations to the server.
             *
             * @example
             *      cy.gql(
             *          `query todo($id:Int!){
             *              todo(id:$id){
             *                  id
             *              }
             *          }`,
             *          {
             *              variables: { id: 1 },
             *          }
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
            gql<T>(query: string, options?: Partial<GraphQLOptions>): Chainable<Response<T>>

            /**
             * Use `cy.interceptGql()` to intercept a GraphQL request by its operationName.
             * 
             * @example
             *      cy.interceptGql('HelloWorld');
             *      cy.wait('@HelloWorld);
             * @example
             *      cy.interceptGql('GetTodos', (req) => req.alias = 'gqlGetTodos');
             *      cy.wait('@gqlGetTodos);
             *
             */
            interceptGql(operationName: string, callback?: GqlRequestInterceptor): Chainable<null>

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
            * Use `cy.interceptGql()` to intercept a GraphQL request by its operationName and its variables.
            *
            * @example
            *      cy.interceptGql('GetTodos', [{ propertyPath: 'showHidden', value:true }], (req) => req.alias = 'gqlGetTodos');
            *      cy.wait('@GetAllTodos);
            */
            interceptGql(operationName: string, variablesRules?: VariableRule[], callback?: GqlRequestInterceptor): Chainable<null>

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
}
