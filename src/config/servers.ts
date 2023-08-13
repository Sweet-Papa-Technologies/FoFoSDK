import { postType } from "../api"

export type resourceType = 'aptos' | 'indy' | 'fofo'

export interface ServerConfig {
    name: string
    ip: string
    port: number
    resource: resourceType
    environment: 'dev' | 'prod'
    testEndpoint: string
}

export interface AptosServerConfig extends ServerConfig {
    apiURL: string
    networkID: string | number
    faucetURL?: string
}

export interface IndyServerConfig extends ServerConfig {
    nodeName: string
}


export const apiEndpoints = {
    fofo: {
        'handshake': {
            endpoint: '/handshake',
            method: 'POST' as postType
        },
        'create-account':{
            endpoint: '/create-account',
            method: 'POST' as postType
        }
    }
}

export const defaultServerConfig = {
    servers: [
        {
            name: 'fofonetwork-aptos-prod',
            ip: 'localhost',
            port: 8080,
            resource: 'aptos',
            environment: 'prod',
            apiURL: `https://fofonetwork.com:8080/v1`,
            networkID: '181',
            testEndpoint: 'https://fofonetwork.com:8080/v1/healthcheck'

        },
        {
            name: 'fofonetwork-aptos-dev',
            ip: 'localhost',
            port: 8080,
            resource: 'aptos',
            environment: 'dev',
            apiURL: `http://localhost:8080/v1`,
            networkID: '180',
            faucetURL: 'http://localhost:8081',
            testEndpoint: 'http://localhost:8080/v1/transactions'
        },
        {
            name: 'fofonetwork-dev',
            ip: 'localhost',
            port: 8080,
            resource: 'indy',
            environment: 'dev',
            nodeName: 'Fofo1'
        },
        {
            name: 'fofonetwork',
            ip: 'localhost',
            port: 8080,
            resource: 'indy',
            environment: 'prod',
            nodeName: 'Fofo1'
        },
        {
            name: 'fofonetwork-api-dev',
            ip: 'localhost',
            port: 3000,
            resource: 'fofo',
            environment: 'dev',
            nodeName: 'Fofo1'
        },

    ] as ServerConfig[] | AptosServerConfig[] | IndyServerConfig []
}

export function getServerConfig(resourceType:resourceType, bProduction=false ): ServerConfig | AptosServerConfig | IndyServerConfig {
    return defaultServerConfig.servers.find((server:ServerConfig | AptosServerConfig | IndyServerConfig) => {
        return server.resource === resourceType && server.environment === (bProduction === true ? 'prod' : 'dev')
    }) || {} as ServerConfig | AptosServerConfig | IndyServerConfig
}