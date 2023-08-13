const FofoSDK = require('./dist').default

async function main (){
    const clsFofoSDK = new FofoSDK.clsFoFoAptos()

    // Create an Account on Chain
    const myNewAccount  = await clsFofoSDK.createAccountOnBlockChain()
    console.log('myNewAccount Result:')
    console.log(myNewAccount)

    // Write a Transaction:
    const myData = {
        user: await clsFofoSDK.loadAptosAccountFromObject(myNewAccount.account),
        post: {
            id: 'did:fofo:1234567890',
            hash: '0FAA6661234567890'
        }, 
        did: 'did:fofo:1234567890', 
        dataCode: 0, 
        content_id:'1', 
        content_format: 'Text'
    }

    const returndata = await FofoSDK.generateFoFoNetworkContent(myData)
    console.log('returndata Result:')
    console.log(returndata)

    // Get the Account Info
    const transactions = await clsFofoSDK.geTransactionsForAccount(myNewAccount.account)
    console.log('transactions Result:')
    console.log(transactions)
}


main().then(()=>{
    console.log('done')
})