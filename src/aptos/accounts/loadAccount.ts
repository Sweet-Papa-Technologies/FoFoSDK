import { AptosAccountObject, AptosClient } from "aptos";
import { log } from "../../logger";
export interface AccountData {
    authentication_key: string;
    sequence_number: string;
}

export default async function (aptosAccountObj:AptosAccountObject, client:AptosClient|null):Promise<AccountData> {
    if (client){
        // let us load the account
        const account = await client.getAccount(aptosAccountObj.address || '')
        log(account.authentication_key, 'loadAptosAccount', 'info')    
        log(account.sequence_number, 'loadAptosAccount', 'info')
        return account
    } else {
        throw new Error("No client found")
    }
}

