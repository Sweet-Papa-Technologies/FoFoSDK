import { AptosAccount, AptosClient } from "aptos";

export async function getAccountTransactions (aptosAccount:AptosAccount, userAptosClient:AptosClient){

    const aptosClient = new AptosClient(userAptosClient.nodeUrl)
    const aptosAccountData = await aptosClient.getAccountTransactions(aptosAccount.address())

    console.log(aptosAccountData)

    return aptosAccountData as any
}

export default getAccountTransactions