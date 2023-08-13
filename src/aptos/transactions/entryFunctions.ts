import { BCS, HexString } from "aptos"

export interface entryFunctionObject {
    functionAddress: string,
    functionModule: string,
    functionName: string,
    coinTypeToTransfer: any[],
    args: Uint8Array[]
}

export interface chainWriteArgs {
    did: string, payback_address: HexString | string,
        data_hash: string, data_code: number, timestamp: number
        , content_uri: string, content_archive_uri: string, content_format: string}

export interface chainWriteConsentArgs {
    did: string, usage_terms: string, disallow_data_collection: boolean, data_level: number, timestamp: number
}

export const FoFoNetworkFunctions = {
    "fofoblockchain": {
        "write_to_fofochain": (chainWriteArgs:chainWriteArgs) => {

     
            
            const didBytes = BCS.bcsSerializeStr(chainWriteArgs.did)
            const payBackAddressBytes = BCS.bcsSerializeStr(chainWriteArgs.payback_address.toString()) 
            const dataHashBytes = BCS.bcsSerializeStr(chainWriteArgs.data_hash)
            const dataCodeBytes = BCS.bcsSerializeUint64(chainWriteArgs.data_code)
            const timestampBytes = BCS.bcsSerializeUint64(chainWriteArgs.timestamp)
            const contentUriBytes = BCS.bcsSerializeStr(chainWriteArgs.content_uri)
            const contentArchiveUriBytes = BCS.bcsSerializeStr(chainWriteArgs.content_archive_uri)
            const contentFormatBytes = BCS.bcsSerializeStr(chainWriteArgs.content_format)
            return {
                "functionAddress": "0x634273777daf1089df1b3e80c3d392f9cc3366f864d252cc9c59a17633630d1b",
                "functionModule": "fofoblockchain_v2",
                "functionName": "write_to_fofochain",
                "coinTypeToTransfer": <any[]>[],
                "args": [didBytes, payBackAddressBytes, dataHashBytes, dataCodeBytes, timestampBytes, contentUriBytes, contentArchiveUriBytes, contentFormatBytes]
            } as entryFunctionObject
        },
        "write_to_consent": (chainWriteConsentArgs:chainWriteConsentArgs) => {

            const didBytes = BCS.bcsSerializeStr(chainWriteConsentArgs.did)
            const usageTermsBytes = BCS.bcsSerializeStr(chainWriteConsentArgs.usage_terms)
            const disallowDataCollectionBytes = BCS.bcsSerializeBool(chainWriteConsentArgs.disallow_data_collection)
            const dataLevelBytes = BCS.bcsSerializeUint64(chainWriteConsentArgs.data_level)
            const timestampBytes = BCS.bcsSerializeUint64(chainWriteConsentArgs.timestamp)
            return {
                "functionAddress": "0x634273777daf1089df1b3e80c3d392f9cc3366f864d252cc9c59a17633630d1b",
                "functionModule": "fofoblockchain_v2",
                "functionName": "write_to_consent",
                "coinTypeToTransfer": <any[]>[],
                "args": [didBytes, usageTermsBytes, disallowDataCollectionBytes, dataLevelBytes, timestampBytes]
            } as entryFunctionObject

        }
    }
}


export default {
    FoFoNetworkFunctions
}

