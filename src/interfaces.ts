export interface AccountAddress {
    address: Uint8Array;
}
export interface ModuleId {
    address: AccountAddress;
    name: string;
}
export interface ScriptFunction {
    module: ModuleId;
    function: string;
    ty_args: string[];
    args: Uint8Array[];
}
export interface RawTransaction {
    sender: AccountAddress;
    sequence_number: number;
    payload: ScriptFunction;
    max_gas_amount: number;
    gas_unit_price: number;
    expiration_timestamp_secs: number;
    chain_id: number;
}
export interface postObj {
    id: string;
    hash: string;
}
export interface FofoTransactionResult extends postObj {
}
export interface FoFoNetExchangeKeyObj {
    publicKey: string;
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
