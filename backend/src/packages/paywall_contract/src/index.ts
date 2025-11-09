import { Buffer } from "buffer";
import { Address } from '@stellar/stellar-sdk';
import {
  AssembledTransaction,
  Client as ContractClient,
  ClientOptions as ContractClientOptions,
  MethodOptions,
  Result,
  Spec as ContractSpec,
} from '@stellar/stellar-sdk/contract';
import type {
  u32,
  i32,
  u64,
  i64,
  u128,
  i128,
  u256,
  i256,
  Option,
  Typepoint,
  Duration,
} from '@stellar/stellar-sdk/contract';
export * from '@stellar/stellar-sdk'
export * as contract from '@stellar/stellar-sdk/contract'
export * as rpc from '@stellar/stellar-sdk/rpc'

if (typeof window !== 'undefined') {
  //@ts-ignore Buffer exists
  window.Buffer = window.Buffer || Buffer;
}


export const networks = {
  testnet: {
    networkPassphrase: "Test SDF Network ; September 2015",
    contractId: "CAELLNHR6MHAIUH6S4ECZ3GOHIXXU5XNLX6TTLKGIBJMZLID3VZ3WZFX",
  }
} as const

export const Errors = {
  1: {message:"InvalidPrice"},
  2: {message:"PostAlreadyExists"},
  3: {message:"PostNotFound"},
  4: {message:"PostNotActive"},
  5: {message:"AlreadyHasAccess"},
  6: {message:"Unauthorized"},
  7: {message:"NativeTokenNotConfigured"},
  8: {message:"AdminNotSet"}
}


export interface PostData {
  created_at: u64;
  creator: string;
  destination: string;
  is_active: boolean;
  price: i128;
}


export interface AccessRecord {
  paid_amount: i128;
  paid_at: u64;
  transaction_id: string;
  user: string;
}

export interface Client {
  /**
   * Construct and simulate a initialize transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  initialize: ({admin, native_token}: {admin: string, native_token: string}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a create_post transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  create_post: ({creator, post_id, price, destination}: {creator: string, post_id: string, price: i128, destination: string}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Result<void>>>

  /**
   * Construct and simulate a pay_for_access transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  pay_for_access: ({post_id, payer}: {post_id: string, payer: string}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Result<void>>>

  /**
   * Construct and simulate a register_external_payment transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  register_external_payment: ({post_id, payer, transaction_id}: {post_id: string, payer: string, transaction_id: string}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Result<void>>>

  /**
   * Construct and simulate a has_access transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  has_access: ({post_id, user}: {post_id: string, user: string}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<boolean>>

  /**
   * Construct and simulate a get_post transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_post: ({post_id}: {post_id: string}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Option<PostData>>>

  /**
   * Construct and simulate a get_access_record transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_access_record: ({post_id, user}: {post_id: string, user: string}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Option<AccessRecord>>>

  /**
   * Construct and simulate a deactivate_post transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  deactivate_post: ({post_id, caller}: {post_id: string, caller: string}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Result<void>>>

  /**
   * Construct and simulate a get_payment_count transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_payment_count: ({post_id}: {post_id: string}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<u32>>

  /**
   * Construct and simulate a update_price transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  update_price: ({post_id, caller, new_price}: {post_id: string, caller: string, new_price: i128}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Result<void>>>

}
export class Client extends ContractClient {
  static async deploy<T = Client>(
    /** Options for initializing a Client as well as for calling a method, with extras specific to deploying. */
    options: MethodOptions &
      Omit<ContractClientOptions, "contractId"> & {
        /** The hash of the Wasm blob, which must already be installed on-chain. */
        wasmHash: Buffer | string;
        /** Salt used to generate the contract's ID. Passed through to {@link Operation.createCustomContract}. Default: random. */
        salt?: Buffer | Uint8Array;
        /** The format used to decode `wasmHash`, if it's provided as a string. */
        format?: "hex" | "base64";
      }
  ): Promise<AssembledTransaction<T>> {
    return ContractClient.deploy(null, options)
  }
  constructor(public readonly options: ContractClientOptions) {
    super(
      new ContractSpec([ "AAAABAAAAAAAAAAAAAAABUVycm9yAAAAAAAACAAAAAAAAAAMSW52YWxpZFByaWNlAAAAAQAAAAAAAAARUG9zdEFscmVhZHlFeGlzdHMAAAAAAAACAAAAAAAAAAxQb3N0Tm90Rm91bmQAAAADAAAAAAAAAA1Qb3N0Tm90QWN0aXZlAAAAAAAABAAAAAAAAAAQQWxyZWFkeUhhc0FjY2VzcwAAAAUAAAAAAAAADFVuYXV0aG9yaXplZAAAAAYAAAAAAAAAGE5hdGl2ZVRva2VuTm90Q29uZmlndXJlZAAAAAcAAAAAAAAAC0FkbWluTm90U2V0AAAAAAg=",
        "AAAAAQAAAAAAAAAAAAAACFBvc3REYXRhAAAABQAAAAAAAAAKY3JlYXRlZF9hdAAAAAAABgAAAAAAAAAHY3JlYXRvcgAAAAATAAAAAAAAAAtkZXN0aW5hdGlvbgAAAAATAAAAAAAAAAlpc19hY3RpdmUAAAAAAAABAAAAAAAAAAVwcmljZQAAAAAAAAs=",
        "AAAAAQAAAAAAAAAAAAAADEFjY2Vzc1JlY29yZAAAAAQAAAAAAAAAC3BhaWRfYW1vdW50AAAAAAsAAAAAAAAAB3BhaWRfYXQAAAAABgAAAAAAAAAOdHJhbnNhY3Rpb25faWQAAAAAABAAAAAAAAAABHVzZXIAAAAT",
        "AAAAAAAAAAAAAAAKaW5pdGlhbGl6ZQAAAAAAAgAAAAAAAAAFYWRtaW4AAAAAAAATAAAAAAAAAAxuYXRpdmVfdG9rZW4AAAATAAAAAA==",
        "AAAAAAAAAAAAAAALY3JlYXRlX3Bvc3QAAAAABAAAAAAAAAAHY3JlYXRvcgAAAAATAAAAAAAAAAdwb3N0X2lkAAAAABAAAAAAAAAABXByaWNlAAAAAAAACwAAAAAAAAALZGVzdGluYXRpb24AAAAAEwAAAAEAAAPpAAAD7QAAAAAAAAAD",
        "AAAAAAAAAAAAAAAOcGF5X2Zvcl9hY2Nlc3MAAAAAAAIAAAAAAAAAB3Bvc3RfaWQAAAAAEAAAAAAAAAAFcGF5ZXIAAAAAAAATAAAAAQAAA+kAAAPtAAAAAAAAAAM=",
        "AAAAAAAAAAAAAAAZcmVnaXN0ZXJfZXh0ZXJuYWxfcGF5bWVudAAAAAAAAAMAAAAAAAAAB3Bvc3RfaWQAAAAAEAAAAAAAAAAFcGF5ZXIAAAAAAAATAAAAAAAAAA50cmFuc2FjdGlvbl9pZAAAAAAAEAAAAAEAAAPpAAAD7QAAAAAAAAAD",
        "AAAAAAAAAAAAAAAKaGFzX2FjY2VzcwAAAAAAAgAAAAAAAAAHcG9zdF9pZAAAAAAQAAAAAAAAAAR1c2VyAAAAEwAAAAEAAAAB",
        "AAAAAAAAAAAAAAAIZ2V0X3Bvc3QAAAABAAAAAAAAAAdwb3N0X2lkAAAAABAAAAABAAAD6AAAB9AAAAAIUG9zdERhdGE=",
        "AAAAAAAAAAAAAAARZ2V0X2FjY2Vzc19yZWNvcmQAAAAAAAACAAAAAAAAAAdwb3N0X2lkAAAAABAAAAAAAAAABHVzZXIAAAATAAAAAQAAA+gAAAfQAAAADEFjY2Vzc1JlY29yZA==",
        "AAAAAAAAAAAAAAAPZGVhY3RpdmF0ZV9wb3N0AAAAAAIAAAAAAAAAB3Bvc3RfaWQAAAAAEAAAAAAAAAAGY2FsbGVyAAAAAAATAAAAAQAAA+kAAAPtAAAAAAAAAAM=",
        "AAAAAAAAAAAAAAARZ2V0X3BheW1lbnRfY291bnQAAAAAAAABAAAAAAAAAAdwb3N0X2lkAAAAABAAAAABAAAABA==",
        "AAAAAAAAAAAAAAAMdXBkYXRlX3ByaWNlAAAAAwAAAAAAAAAHcG9zdF9pZAAAAAAQAAAAAAAAAAZjYWxsZXIAAAAAABMAAAAAAAAACW5ld19wcmljZQAAAAAAAAsAAAABAAAD6QAAA+0AAAAAAAAAAw==" ]),
      options
    )
  }
  public readonly fromJSON = {
    initialize: this.txFromJSON<null>,
        create_post: this.txFromJSON<Result<void>>,
        pay_for_access: this.txFromJSON<Result<void>>,
        register_external_payment: this.txFromJSON<Result<void>>,
        has_access: this.txFromJSON<boolean>,
        get_post: this.txFromJSON<Option<PostData>>,
        get_access_record: this.txFromJSON<Option<AccessRecord>>,
        deactivate_post: this.txFromJSON<Result<void>>,
        get_payment_count: this.txFromJSON<u32>,
        update_price: this.txFromJSON<Result<void>>
  }
}