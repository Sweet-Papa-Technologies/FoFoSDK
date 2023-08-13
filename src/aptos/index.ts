import { apiEndpoints, AptosServerConfig, getServerConfig, IndyServerConfig, resourceType, ServerConfig } from "../config/servers";
import axios, { AxiosError } from 'axios';
import { log } from "../logger";
import { AptosAccount, AptosAccountObject, AptosClient } from "aptos";
import loadAccount from "./accounts/loadAccount";
import { apiCallerPublic } from "../api";
import { encryptString, kyberHandshaker } from '@fofonet/crypto';
import getAccountTransactions from "./accounts/getAccountTransactions";

export interface FoFoNetExchangeKeyObj {
    publicKey: string | number[];
}
export interface FoFoNetEncryptedMsgObj {
    credsUID: string;
    encryptedData: string;
}
export interface FoFoNetExchangeKeyResponse {
    message: string;
    credsUID: string;
    handshakeObject: any;
}

export class clsFoFoAptos {

    bDevMode:boolean = true
    nodeURL:string = ''
    resourceObj: AptosServerConfig |  null = null
    fofoClientObj: ServerConfig | null = null
    client:AptosClient | null = null

    constructor(bProd=false) {

        // let's set the mod for the servers, etc
        if (bProd === true){
            this.bDevMode = false
        }


        log(`Running in ${this.bDevMode === true ? 'DEV' : 'PROD'} mode`, 'clsFoFoAptos', 'info')  
        
        this.resourceObj = getServerConfig('aptos', !this.bDevMode) as AptosServerConfig
        this.fofoClientObj = getServerConfig('fofo', !this.bDevMode) as ServerConfig

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

    async loadAAptosAccountFromObject(accountObj:AptosAccountObject) {
        const account = AptosAccount
        return account.fromAptosAccountObject(accountObj)
    }

    async loadAccountDataFromObject(accountObj:AptosAccountObject) {
        const account = await loadAccount(accountObj, this.client)
        return account
    }

    async createAccountOnBlockChain(accountObj:AptosAccountObject|null=null) {

            if (!accountObj) {
                accountObj = await this.createNewAccountKey()
            }

            const account = JSON.stringify(accountObj)

            if (!this.fofoClientObj) {
                log("No resource object found", 'createAccountOnBlockChain', 'error')
                throw new Error("No resource object found, cannot make API call")
            }

            // WE need to securely exchange information with our backend
            const handshaker = new kyberHandshaker();
            const { PublicKey, PrivateKey } = handshaker.generateKeys();

            const fofoExchangeObj:FoFoNetExchangeKeyObj = {
                publicKey: PublicKey
            }

            // Get the data we need to get our established password to use and our queue id
            const response = await apiCallerPublic(fofoExchangeObj,apiEndpoints.fofo.handshake.method, this.fofoClientObj, apiEndpoints.fofo.handshake.endpoint) as FoFoNetExchangeKeyResponse
            const SharedSecret = handshaker.ConsumeHandshake(response.handshakeObject, PrivateKey);

            if (!SharedSecret) {
                log("Failed to get shared secret", 'createAccountOnBlockChain', 'error')
                throw new Error("Failed to get shared secret")
            }

            // Now we can encrypt our data
            const encryptedData = encryptString(account, SharedSecret);

            const fofoEncryptedObj:FoFoNetEncryptedMsgObj = {
                credsUID: response.credsUID,
                encryptedData: encryptedData
            }

            // Now we can send our data to the server
            const fofoResponse = await apiCallerPublic(fofoEncryptedObj,apiEndpoints.fofo["create-account"].method, this.fofoClientObj, apiEndpoints.fofo["create-account"].endpoint) as FoFoNetEncryptedMsgObj
           
            return {
                fofoResponse: fofoResponse,
                account: accountObj
            }
    }

    async geTransactionsForAccount(accountObj:AptosAccountObject): Promise<any> {

   
        const aptosAccount = await this.loadAAptosAccountFromObject(accountObj)

        if (!this.client){
            log("No client found", 'geTransactionsForAccount', 'error')
            throw new Error("No client found")
        }
        
        return await getAccountTransactions(aptosAccount, this.client)
    }
}