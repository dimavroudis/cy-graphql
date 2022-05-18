/// <reference types="cypress" />

const { get, has } = Cypress._;

Cypress.Commands.add('gql', (query: string, options: Partial<GraphQLOptions> = {}) => {
    let _options = { ...options };
    //Use options.url if exists and use GQL_URL as fallback
    const url = get(_options, 'url', get(Cypress.env(), 'GQL_URL', null));
    const body = { query, variables: {} };

    if (_options.variables) {
        body.variables = _options.variables;
        delete _options.variables;
    }

    const headers = {
        ...(get(options, 'headers') || {}),
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    };

    if (!url) {
        throw new Error('Environment variable GQL_URL is not defined.');
    }

    const requestOptions = {
        ..._options,
        headers,
        body,
        url,
    };

    const message = get(requestOptions.body, 'query', requestOptions.url);

    // log the message before requests in case it fails
    Cypress.log({
        message,
        consoleProps() {
            return {
                request: requestOptions
            }
        }
    });

    cy.request({ ...requestOptions, log: false }).then((response) => {
        // log the response
        Cypress.log({
            name: 'response',
            message,
            consoleProps() {
                return {
                    response: response.body
                }
            }
        });

        return response;
    });

})

Cypress.Commands.add('interceptGql', (operationName: string | string[], variableRules?: VariableRule[], alias?: string) => {
    const url = get(Cypress.env(), 'GQL_URL', null);
    if (!url) {
        throw new Error('Environment variable GQL_URL is not defined.');
    }

    let operationNames: string[] = [];

    if (typeof operationName === 'string') {
        operationNames.push(operationName);
    }

    if (Array.isArray(operationName)) {
        operationNames = [...operationName];
        variableRules = undefined;
        alias = undefined;
    }

    const matchesOperationName = (req: any, operationName: string) => {
        const { body } = req;
        return (
            has(body, 'operationName') && body.operationName === operationName
        );
    };

    const matchesVariables = (req: any) => {
        const variables = get(req.body, 'variables', null)
        if (!variableRules || !variables) {
            return true;
        }

        for (let rule of variableRules) {
            if (has(variables, rule.propertyPath) && (!has(rule, 'value') || get(variables, rule.propertyPath) === rule.value)) {
                return true;
            }
        }

    }

    cy.intercept('POST', url, (req) => {
        for (const name of operationNames) {
            if (matchesOperationName(req, name) && matchesVariables(req)) {
                req.alias = alias ?? name;
            }
        }
    });
});