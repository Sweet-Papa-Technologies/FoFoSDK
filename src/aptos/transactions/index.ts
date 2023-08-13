import { AptosAccount, BCS, AptosClient, CoinClient, TxnBuilderTypes } from "aptos";
import { postObj } from "../../interfaces";
import { AptosServerConfig, getServerConfig } from "../../config/servers";
import entryFunctions, { chainWriteArgs, entryFunctionObject } from "./entryFunctions";

const NODE_URL = getServerConfig('aptos', false) as AptosServerConfig // TODO => Need to load correct env automatically
const client = new AptosClient(NODE_URL.apiURL);
const coinClient = new CoinClient(client);

// Helper Functions and Stuff

const {
    AccountAddress,
    EntryFunction,
    TransactionPayloadEntryFunction,
    RawTransaction,
    ChainId,
} = TxnBuilderTypes;

export type dataCode = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
export type contentFormat = "image" | "video" | "audio" | "text" | "other"
export interface FoFoContentObj {
    user: AptosAccount, post: postObj, did:string, dataCode:dataCode, content_id?:string, content_uri?:string, timeStamp?:number, content_archive_uri?:string, content_format: contentFormat
}

const generateEntryFunction = (blockchinData:entryFunctionObject)=>{
    return new TransactionPayloadEntryFunction(
        EntryFunction.natural(
            // Fully qualified module name, `AccountAddress::ModuleName`
            `${blockchinData.functionAddress}::${blockchinData.functionModule}`,
            // Module function
            blockchinData.functionName,
            // The coin type to transfer
            blockchinData.coinTypeToTransfer,
            // Arguments for function `transfer`: receiver account address and amount to transfer
            blockchinData.args
        )
    );
}

const performWriteAction = async (user: AptosAccount, entryFunctionPayload:any, bWait=true) => {

    // TS SDK support 3 types of transaction payloads: `EntryFunction`, `Script` and `Module`.
    // See https://aptos-labs.github.io/ts-sdk-doc/ for the details.
    const [{ sequence_number: sequenceNumber }, chainId] = await Promise.all([
        client.getAccount(user.address()),
        client.getChainId(),
    ]);

    // See class definiton here
    // https://aptos-labs.github.io/ts-sdk-doc/classes/TxnBuilderTypes.RawTransaction.html#constructor.
    const rawTxn = new RawTransaction(
        // Transaction sender account address
        AccountAddress.fromHex(user.address()),
        BigInt(sequenceNumber),
        entryFunctionPayload,
        // Max gas unit to spend
        BigInt(2000),
        // Gas price per unit
        BigInt(100),
        // Expiration timestamp. Transaction is discarded if it is not executed within 10 seconds from now.
        BigInt(Math.floor(Date.now() / 1000) + 10),
        new ChainId(chainId),
    );

    // Sign the raw transaction with account1's private key
    const bcsTxn = AptosClient.generateBCSTransaction(user, rawTxn);
    const transactionRes = await client.submitSignedBCSTransaction(bcsTxn);

    console.log(transactionRes)
    console.log(`Account Balance: ${await coinClient.checkBalance(user)}`);
    console.log("Waiting for Transaction to Settle on BlockChain")
    
    if (bWait === true){
        console.log("Waiting for Transaction to Settle on BlockChain")
        await client.waitForTransaction(transactionRes.hash, { checkSuccess: true, timeoutSecs: 30 })
    }

    return await client.getTransactionByHash(transactionRes.hash) as any // todo=> Need to add a proper defintion here

}

// Core FoFo Network Functions:

export const generateFoFoNetworkContent = async (FoFoContentObj:FoFoContentObj ) => {
    console.log(`Adding ${FoFoContentObj.content_id || 'Some Data'} to Blockchain for ${FoFoContentObj.user.address()}`)
    const timestamp = Math.floor(Date.now() / 1000)
    const args:chainWriteArgs = {
        did: FoFoContentObj.did,
        payback_address: FoFoContentObj.user.address(),
        data_hash: FoFoContentObj.post.hash,
        data_code: FoFoContentObj.dataCode,
        timestamp: FoFoContentObj.timeStamp || timestamp,
        content_uri: FoFoContentObj.content_uri || "",
        content_archive_uri: FoFoContentObj.content_archive_uri || "",
        content_format: FoFoContentObj.content_format || "",
    }
    const entryFunctionPayload = generateEntryFunction(entryFunctions.FoFoNetworkFunctions.fofoblockchain.write_to_fofochain(args))
    return await performWriteAction(FoFoContentObj.user, entryFunctionPayload) as any
}













export default {

}