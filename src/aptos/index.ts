import { getServerConfig, resourceType } from "../config/servers";
import axios, { AxiosError } from 'axios';
import { log } from "../logger";

export class clsFoFoAptos {
    constructor() {
        // 
    }
    async checkIfAptosServerIsReachable( serverEnvironment:'dev' | 'prod') {
        // Let us see if we can make an AXIOS call the server
        // If we can, then we can return true
        // If we cannot, then we can return false
        let bReachable = false
        const resourceObj = getServerConfig('aptos', serverEnvironment === 'prod' ? true : false)
        
        await axios.get(resourceObj.testEndpoint).then((response) => {

            if (response.status === 200 || response.status === 201) {
                bReachable = true
                log("Server is reachable", 'checkIfAptosServerIsReachable', 'info')
            }

            
            log(response.status, 'checkIfAptosServerIsReachable', 'info')



        }).catch((error:AxiosError) => {  
            log("Failed to reach the server", 'checkIfAptosServerIsReachable', 'error') 
            log(error.message, 'checkIfAptosServerIsReachable', 'error')                 
            log(error.code || 'No error code', 'checkIfAptosServerIsReachable', 'error')
        })

        return bReachable
    }
}