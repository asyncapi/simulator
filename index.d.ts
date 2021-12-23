

interface createReqHandler {

}

interface startOperation {

}

interface startScenario {

}

/**
 *  Asynchronously creates a manager instance that can run scenarios and operations.
 */
export function requestManager(
): Promise<{
    createReqHandler : () => {},
    startOperation: (operationName:string) => {},
    startScenario: (scenarioName:string) => {}
}>;

/**
 * Parses the provided asyncApi and scenario files producing a structured information object.
 */
export function parserAndGenerator(
    asyncApiFilepath: string,
    scenarioFilepath: string
): Promise<Object>;

