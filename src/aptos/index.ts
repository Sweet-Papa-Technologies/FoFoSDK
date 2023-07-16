import { getServerConfig, resourceType } from "../config/servers";
import axios, { AxiosError } from 'axios';

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
                console.log("Server is reachable")
            }

            console.log(response.data)
            console.log(response.status)



        }).catch((error:AxiosError) => {  
            console.log("Failed to reach the server") 
            console.log(error.message)                 
            console.log(error.code)
        })

        return bReachable
    }
}