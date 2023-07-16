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
}

export interface IndyServerConfig extends ServerConfig {
    nodeName: string
}

export const defaultServerConfig = {
    servers: [
        {
            name: 'fofonetwork-aptos-prod',
            ip: '192.168.1.1',
            port: 8080,
            resource: 'aptos',
            environment: 'prod',
            apiURL: `https://fofonetwork.com:8080/v1`,
            networkID: '180',
            testEndpoint: 'https://fofonetwork.com:8080/v1/healthcheck'

        },
        {
            name: 'fofonetwork-aptos-dev',
            ip: '0.0.0.0',
            port: 8080,
            resource: 'aptos',
            environment: 'dev',
            apiURL: `http://localhost:8080/v1`,
            networkID: '181',
            testEndpoint: 'http://localhost:8080/v1/transactions'
        },
        {
            name: 'fofonetwork-dev',
            ip: '0.0.0.0',
            port: 8080,
            resource: 'indy',
            environment: 'dev',
            nodeName: 'Fofo1'
        },
        {
            name: 'fofonetwork',
            ip: '0.0.0.0',
            port: 8080,
            resource: 'indy',
            environment: 'prod',
            nodeName: 'Fofo1'
        },

    ] as ServerConfig[] | AptosServerConfig[] | IndyServerConfig []
}

export function getServerConfig(resourceType:resourceType, bProduction=false ): ServerConfig | AptosServerConfig | IndyServerConfig {
    return defaultServerConfig.servers.find((server:ServerConfig | AptosServerConfig | IndyServerConfig) => {
        return server.resource === resourceType && server.environment === (bProduction === true ? 'prod' : 'dev')
    }) || {} as ServerConfig | AptosServerConfig | IndyServerConfig
}