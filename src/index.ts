// Entry point for the SDK

import { clsFoFoAptos } from "./aptos"
import { generateFoFoNetworkContent } from "./aptos/transactions"

// let us load different things based on the argments passed to the SDK
// If the user wants to test server connectivity, they can pass: --test-connection
// If the user wants to work with DEV resources, they can pass: --dev

// Check to see what arguments were passed to the script
const args = process.argv.slice(2)

// Check to see if the user wants to run in dev mode
const bDevMode = args.includes("--prod") === false
const bTestConnection = args.includes("--test-connection")

// run the SDK in an async function
async function runSDKArgs() {
    // If the user wants to test the connection, then we can do that here
    if (bTestConnection === true) {
        const clsAptos = new clsFoFoAptos()
        clsAptos.checkIfAptosServerIsReachable()
    }
}

runSDKArgs()

const exportObj = {
    clsFoFoAptos,
    generateFoFoNetworkContent
}

export {
    clsFoFoAptos,
    generateFoFoNetworkContent
}
 

export default exportObj