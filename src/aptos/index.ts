import { AptosServerConfig, getServerConfig, IndyServerConfig, resourceType, ServerConfig } from "../config/servers";
import axios, { AxiosError } from 'axios';
import { log } from "../logger";
import { AptosAccount, AptosAccountObject, AptosClient } from "aptos";
import loadAccount from "./accounts/loadAccount";

export class clsFoFoAptos {

    bDevMode:boolean = true
    nodeURL:string = ''
    resourceObj: AptosServerConfig |  null = null
    client:AptosClient | null = null

    constructor(bProd=false) {

        // let's set the mod for the servers, etc
        if (bProd === true){
            this.bDevMode = false
        }


        log(`Running in ${this.bDevMode === true ? 'DEV' : 'PROD'} mode`, 'clsFoFoAptos', 'info')  
        
        this.resourceObj = getServerConfig('aptos', !this.bDevMode) as AptosServerConfig

        if (this.resourceObj) {
            log(`Using ${this.resourceObj.name} server`, 'clsFoFoAptos', 'info')
            log(`Server URL: ${this.resourceObj.apiURL}`, 'clsFoFoAptos', 'info')
        }

        this.nodeURL = this.resourceObj ? this.resourceObj.apiURL : ''

        this.client = new AptosClient(this.nodeURL)
        
    }

    async checkIfAptosServerIsReachable( ) {
        // Let us see if we can make an AXIOS call the server
        // If we can, then we can return true
        // If we cannot, then we can return false
        let bReachable = false

        if (!this.resourceObj) {
            log("No resource object found", 'checkIfAptosServerIsReachable', 'error')
            return bReachable
        }
        
        await axios.get(this.resourceObj.testEndpoint).then((response) => {

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

    async createNewAccountKey() {
        const newAccount = new AptosAccount()
        return newAccount.toPrivateKeyObject()
    }

    async loadAccount(accountObj:AptosAccountObject) {
        const account = await loadAccount(accountObj, this.client)
        return account
    }
}