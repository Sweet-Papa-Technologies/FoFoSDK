import axios, { AxiosRequestConfig } from "axios"
import { ServerConfig } from "./config/servers"

export type postType = 'GET' | 'POST' | 'PUT' | 'DELETE'


export const apiCallerPublic = async (data:any, postType:postType='GET', serverInformation:ServerConfig, endpoint:string,authUser?:string, authPass?:string) => {

    // Default values for authUser and authPass, these credentials are meant to be public and only work for certain endpoints. Better than no auth?
    const apiPublicPass = typeof authPass === 'string' ? authPass : 'DaFoF0N3^t3DaFoF0N3^t5DaFoF0N3^t6DaFoF0N3^t6DaFoF0N3^t9DaFoF0N3^t'
    const apiPublicUser = typeof authUser === 'string' ? authUser : 'fofonet-public-sdk'
    
    const { ip, port } = serverInformation

    const url = `http${serverInformation.environment === 'dev' ? '' : 's'}://${ip}:${port}${endpoint}` 

    const config:AxiosRequestConfig = {
        url: url,
        method: postType,
        headers: {
            'Content-Type': 'application/json',
            'Authorization' : `Basic ${Buffer.from(`${apiPublicUser}:${apiPublicPass}`).toString('base64')}`
        },
        data: data
    }

    if (postType === 'GET'){
        delete config.data
    } 
    
    const response = await axios(url, config)

    return response.data
}
