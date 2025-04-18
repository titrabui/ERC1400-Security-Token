/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
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
} from "../../../common";

export interface MinterMockInterface extends Interface {
  getFunction(
    nameOrSignature:
      | "addMinter"
      | "isMinter"
      | "removeMinter"
      | "renounceMinter"
  ): FunctionFragment;

  getEvent(
    nameOrSignatureOrTopic: "MinterAdded" | "MinterRemoved"
  ): EventFragment;

  encodeFunctionData(
    functionFragment: "addMinter",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "isMinter",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "removeMinter",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "renounceMinter",
    values?: undefined
  ): string;

  decodeFunctionResult(functionFragment: "addMinter", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "isMinter", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "removeMinter",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "renounceMinter",
    data: BytesLike
  ): Result;
}

export namespace MinterAddedEvent {
  export type InputTuple = [account: AddressLike];
  export type OutputTuple = [account: string];
  export interface OutputObject {
    account: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace MinterRemovedEvent {
  export type InputTuple = [account: AddressLike];
  export type OutputTuple = [account: string];
  export interface OutputObject {
    account: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export interface MinterMock extends BaseContract {
  connect(runner?: ContractRunner | null): MinterMock;
  waitForDeployment(): Promise<this>;

  interface: MinterMockInterface;

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

  addMinter: TypedContractMethod<[account: AddressLike], [void], "nonpayable">;

  isMinter: TypedContractMethod<[account: AddressLike], [boolean], "view">;

  removeMinter: TypedContractMethod<
    [account: AddressLike],
    [void],
    "nonpayable"
  >;

  renounceMinter: TypedContractMethod<[], [void], "nonpayable">;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "addMinter"
  ): TypedContractMethod<[account: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "isMinter"
  ): TypedContractMethod<[account: AddressLike], [boolean], "view">;
  getFunction(
    nameOrSignature: "removeMinter"
  ): TypedContractMethod<[account: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "renounceMinter"
  ): TypedContractMethod<[], [void], "nonpayable">;

  getEvent(
    key: "MinterAdded"
  ): TypedContractEvent<
    MinterAddedEvent.InputTuple,
    MinterAddedEvent.OutputTuple,
    MinterAddedEvent.OutputObject
  >;
  getEvent(
    key: "MinterRemoved"
  ): TypedContractEvent<
    MinterRemovedEvent.InputTuple,
    MinterRemovedEvent.OutputTuple,
    MinterRemovedEvent.OutputObject
  >;

  filters: {
    "MinterAdded(address)": TypedContractEvent<
      MinterAddedEvent.InputTuple,
      MinterAddedEvent.OutputTuple,
      MinterAddedEvent.OutputObject
    >;
    MinterAdded: TypedContractEvent<
      MinterAddedEvent.InputTuple,
      MinterAddedEvent.OutputTuple,
      MinterAddedEvent.OutputObject
    >;

    "MinterRemoved(address)": TypedContractEvent<
      MinterRemovedEvent.InputTuple,
      MinterRemovedEvent.OutputTuple,
      MinterRemovedEvent.OutputObject
    >;
    MinterRemoved: TypedContractEvent<
      MinterRemovedEvent.InputTuple,
      MinterRemovedEvent.OutputTuple,
      MinterRemovedEvent.OutputObject
    >;
  };
}
