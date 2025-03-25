/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumberish,
  BytesLike,
  FunctionFragment,
  Result,
  Interface,
  EventFragment,
  AddressLike,
  ContractRunner,
  ContractMethod,
  Listener,
} from "ethers";
import type {
  TypedContractEvent,
  TypedDeferredTopicFilter,
  TypedEventLog,
  TypedLogDescription,
  TypedListener,
  TypedContractMethod,
} from "../../common";

export type ERC20HoldDataStruct = {
  sender: AddressLike;
  recipient: AddressLike;
  notary: AddressLike;
  amount: BigNumberish;
  expirationDateTime: BigNumberish;
  secretHash: BytesLike;
  status: BigNumberish;
};

export type ERC20HoldDataStructOutput = [
  sender: string,
  recipient: string,
  notary: string,
  amount: bigint,
  expirationDateTime: bigint,
  secretHash: string,
  status: bigint
] & {
  sender: string;
  recipient: string;
  notary: string;
  amount: bigint;
  expirationDateTime: bigint;
  secretHash: string;
  status: bigint;
};

export interface IERC20HoldableTokenInterface extends Interface {
  getFunction(
    nameOrSignature:
      | "allowance"
      | "approve"
      | "balanceOf"
      | "balanceOnHold"
      | "executeHold(bytes32,bytes32)"
      | "executeHold(bytes32,bytes32,address)"
      | "executeHold(bytes32)"
      | "hold"
      | "holdStatus"
      | "releaseHold"
      | "retrieveHoldData"
      | "spendableBalanceOf"
      | "totalSupply"
      | "totalSupplyOnHold"
      | "transfer"
      | "transferFrom"
  ): FunctionFragment;

  getEvent(
    nameOrSignatureOrTopic:
      | "Approval"
      | "ExecutedHold"
      | "NewHold"
      | "ReleaseHold"
      | "Transfer"
  ): EventFragment;

  encodeFunctionData(
    functionFragment: "allowance",
    values: [AddressLike, AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "approve",
    values: [AddressLike, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "balanceOf",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "balanceOnHold",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "executeHold(bytes32,bytes32)",
    values: [BytesLike, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "executeHold(bytes32,bytes32,address)",
    values: [BytesLike, BytesLike, AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "executeHold(bytes32)",
    values: [BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "hold",
    values: [
      BytesLike,
      AddressLike,
      AddressLike,
      BigNumberish,
      BigNumberish,
      BytesLike
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "holdStatus",
    values: [BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "releaseHold",
    values: [BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "retrieveHoldData",
    values: [BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "spendableBalanceOf",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "totalSupply",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "totalSupplyOnHold",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "transfer",
    values: [AddressLike, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "transferFrom",
    values: [AddressLike, AddressLike, BigNumberish]
  ): string;

  decodeFunctionResult(functionFragment: "allowance", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "approve", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "balanceOf", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "balanceOnHold",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "executeHold(bytes32,bytes32)",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "executeHold(bytes32,bytes32,address)",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "executeHold(bytes32)",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "hold", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "holdStatus", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "releaseHold",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "retrieveHoldData",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "spendableBalanceOf",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "totalSupply",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "totalSupplyOnHold",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "transfer", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "transferFrom",
    data: BytesLike
  ): Result;
}

export namespace ApprovalEvent {
  export type InputTuple = [
    owner: AddressLike,
    spender: AddressLike,
    value: BigNumberish
  ];
  export type OutputTuple = [owner: string, spender: string, value: bigint];
  export interface OutputObject {
    owner: string;
    spender: string;
    value: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace ExecutedHoldEvent {
  export type InputTuple = [
    holdId: BytesLike,
    lockPreimage: BytesLike,
    recipient: AddressLike
  ];
  export type OutputTuple = [
    holdId: string,
    lockPreimage: string,
    recipient: string
  ];
  export interface OutputObject {
    holdId: string;
    lockPreimage: string;
    recipient: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace NewHoldEvent {
  export type InputTuple = [
    holdId: BytesLike,
    recipient: AddressLike,
    notary: AddressLike,
    amount: BigNumberish,
    expirationDateTime: BigNumberish,
    lockHash: BytesLike
  ];
  export type OutputTuple = [
    holdId: string,
    recipient: string,
    notary: string,
    amount: bigint,
    expirationDateTime: bigint,
    lockHash: string
  ];
  export interface OutputObject {
    holdId: string;
    recipient: string;
    notary: string;
    amount: bigint;
    expirationDateTime: bigint;
    lockHash: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace ReleaseHoldEvent {
  export type InputTuple = [holdId: BytesLike, sender: AddressLike];
  export type OutputTuple = [holdId: string, sender: string];
  export interface OutputObject {
    holdId: string;
    sender: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace TransferEvent {
  export type InputTuple = [
    from: AddressLike,
    to: AddressLike,
    value: BigNumberish
  ];
  export type OutputTuple = [from: string, to: string, value: bigint];
  export interface OutputObject {
    from: string;
    to: string;
    value: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export interface IERC20HoldableToken extends BaseContract {
  connect(runner?: ContractRunner | null): IERC20HoldableToken;
  waitForDeployment(): Promise<this>;

  interface: IERC20HoldableTokenInterface;

  queryFilter<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;
  queryFilter<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;

  on<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  on<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  once<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  once<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  listeners<TCEvent extends TypedContractEvent>(
    event: TCEvent
  ): Promise<Array<TypedListener<TCEvent>>>;
  listeners(eventName?: string): Promise<Array<Listener>>;
  removeAllListeners<TCEvent extends TypedContractEvent>(
    event?: TCEvent
  ): Promise<this>;

  allowance: TypedContractMethod<
    [owner: AddressLike, spender: AddressLike],
    [bigint],
    "view"
  >;

  approve: TypedContractMethod<
    [spender: AddressLike, amount: BigNumberish],
    [boolean],
    "nonpayable"
  >;

  balanceOf: TypedContractMethod<[account: AddressLike], [bigint], "view">;

  balanceOnHold: TypedContractMethod<[account: AddressLike], [bigint], "view">;

  "executeHold(bytes32,bytes32)": TypedContractMethod<
    [holdId: BytesLike, lockPreimage: BytesLike],
    [void],
    "nonpayable"
  >;

  "executeHold(bytes32,bytes32,address)": TypedContractMethod<
    [holdId: BytesLike, lockPreimage: BytesLike, recipient: AddressLike],
    [void],
    "nonpayable"
  >;

  "executeHold(bytes32)": TypedContractMethod<
    [holdId: BytesLike],
    [void],
    "nonpayable"
  >;

  hold: TypedContractMethod<
    [
      holdId: BytesLike,
      recipient: AddressLike,
      notary: AddressLike,
      amount: BigNumberish,
      expirationDateTime: BigNumberish,
      lockHash: BytesLike
    ],
    [void],
    "nonpayable"
  >;

  holdStatus: TypedContractMethod<[holdId: BytesLike], [bigint], "view">;

  releaseHold: TypedContractMethod<[holdId: BytesLike], [void], "nonpayable">;

  retrieveHoldData: TypedContractMethod<
    [holdId: BytesLike],
    [ERC20HoldDataStructOutput],
    "view"
  >;

  spendableBalanceOf: TypedContractMethod<
    [account: AddressLike],
    [bigint],
    "view"
  >;

  totalSupply: TypedContractMethod<[], [bigint], "view">;

  totalSupplyOnHold: TypedContractMethod<[], [bigint], "view">;

  transfer: TypedContractMethod<
    [to: AddressLike, amount: BigNumberish],
    [boolean],
    "nonpayable"
  >;

  transferFrom: TypedContractMethod<
    [from: AddressLike, to: AddressLike, amount: BigNumberish],
    [boolean],
    "nonpayable"
  >;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "allowance"
  ): TypedContractMethod<
    [owner: AddressLike, spender: AddressLike],
    [bigint],
    "view"
  >;
  getFunction(
    nameOrSignature: "approve"
  ): TypedContractMethod<
    [spender: AddressLike, amount: BigNumberish],
    [boolean],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "balanceOf"
  ): TypedContractMethod<[account: AddressLike], [bigint], "view">;
  getFunction(
    nameOrSignature: "balanceOnHold"
  ): TypedContractMethod<[account: AddressLike], [bigint], "view">;
  getFunction(
    nameOrSignature: "executeHold(bytes32,bytes32)"
  ): TypedContractMethod<
    [holdId: BytesLike, lockPreimage: BytesLike],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "executeHold(bytes32,bytes32,address)"
  ): TypedContractMethod<
    [holdId: BytesLike, lockPreimage: BytesLike, recipient: AddressLike],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "executeHold(bytes32)"
  ): TypedContractMethod<[holdId: BytesLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "hold"
  ): TypedContractMethod<
    [
      holdId: BytesLike,
      recipient: AddressLike,
      notary: AddressLike,
      amount: BigNumberish,
      expirationDateTime: BigNumberish,
      lockHash: BytesLike
    ],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "holdStatus"
  ): TypedContractMethod<[holdId: BytesLike], [bigint], "view">;
  getFunction(
    nameOrSignature: "releaseHold"
  ): TypedContractMethod<[holdId: BytesLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "retrieveHoldData"
  ): TypedContractMethod<
    [holdId: BytesLike],
    [ERC20HoldDataStructOutput],
    "view"
  >;
  getFunction(
    nameOrSignature: "spendableBalanceOf"
  ): TypedContractMethod<[account: AddressLike], [bigint], "view">;
  getFunction(
    nameOrSignature: "totalSupply"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "totalSupplyOnHold"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "transfer"
  ): TypedContractMethod<
    [to: AddressLike, amount: BigNumberish],
    [boolean],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "transferFrom"
  ): TypedContractMethod<
    [from: AddressLike, to: AddressLike, amount: BigNumberish],
    [boolean],
    "nonpayable"
  >;

  getEvent(
    key: "Approval"
  ): TypedContractEvent<
    ApprovalEvent.InputTuple,
    ApprovalEvent.OutputTuple,
    ApprovalEvent.OutputObject
  >;
  getEvent(
    key: "ExecutedHold"
  ): TypedContractEvent<
    ExecutedHoldEvent.InputTuple,
    ExecutedHoldEvent.OutputTuple,
    ExecutedHoldEvent.OutputObject
  >;
  getEvent(
    key: "NewHold"
  ): TypedContractEvent<
    NewHoldEvent.InputTuple,
    NewHoldEvent.OutputTuple,
    NewHoldEvent.OutputObject
  >;
  getEvent(
    key: "ReleaseHold"
  ): TypedContractEvent<
    ReleaseHoldEvent.InputTuple,
    ReleaseHoldEvent.OutputTuple,
    ReleaseHoldEvent.OutputObject
  >;
  getEvent(
    key: "Transfer"
  ): TypedContractEvent<
    TransferEvent.InputTuple,
    TransferEvent.OutputTuple,
    TransferEvent.OutputObject
  >;

  filters: {
    "Approval(address,address,uint256)": TypedContractEvent<
      ApprovalEvent.InputTuple,
      ApprovalEvent.OutputTuple,
      ApprovalEvent.OutputObject
    >;
    Approval: TypedContractEvent<
      ApprovalEvent.InputTuple,
      ApprovalEvent.OutputTuple,
      ApprovalEvent.OutputObject
    >;

    "ExecutedHold(bytes32,bytes32,address)": TypedContractEvent<
      ExecutedHoldEvent.InputTuple,
      ExecutedHoldEvent.OutputTuple,
      ExecutedHoldEvent.OutputObject
    >;
    ExecutedHold: TypedContractEvent<
      ExecutedHoldEvent.InputTuple,
      ExecutedHoldEvent.OutputTuple,
      ExecutedHoldEvent.OutputObject
    >;

    "NewHold(bytes32,address,address,uint256,uint256,bytes32)": TypedContractEvent<
      NewHoldEvent.InputTuple,
      NewHoldEvent.OutputTuple,
      NewHoldEvent.OutputObject
    >;
    NewHold: TypedContractEvent<
      NewHoldEvent.InputTuple,
      NewHoldEvent.OutputTuple,
      NewHoldEvent.OutputObject
    >;

    "ReleaseHold(bytes32,address)": TypedContractEvent<
      ReleaseHoldEvent.InputTuple,
      ReleaseHoldEvent.OutputTuple,
      ReleaseHoldEvent.OutputObject
    >;
    ReleaseHold: TypedContractEvent<
      ReleaseHoldEvent.InputTuple,
      ReleaseHoldEvent.OutputTuple,
      ReleaseHoldEvent.OutputObject
    >;

    "Transfer(address,address,uint256)": TypedContractEvent<
      TransferEvent.InputTuple,
      TransferEvent.OutputTuple,
      TransferEvent.OutputObject
    >;
    Transfer: TypedContractEvent<
      TransferEvent.InputTuple,
      TransferEvent.OutputTuple,
      TransferEvent.OutputObject
    >;
  };
}
