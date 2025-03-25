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
} from "../../common";

export interface CertificateSignerMockInterface extends Interface {
  getFunction(
    nameOrSignature:
      | "addCertificateSigner"
      | "isCertificateSigner"
      | "removeCertificateSigner"
      | "renounceCertificateSigner"
  ): FunctionFragment;

  getEvent(
    nameOrSignatureOrTopic:
      | "CertificateSignerAdded"
      | "CertificateSignerRemoved"
  ): EventFragment;

  encodeFunctionData(
    functionFragment: "addCertificateSigner",
    values: [AddressLike, AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "isCertificateSigner",
    values: [AddressLike, AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "removeCertificateSigner",
    values: [AddressLike, AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "renounceCertificateSigner",
    values: [AddressLike]
  ): string;

  decodeFunctionResult(
    functionFragment: "addCertificateSigner",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "isCertificateSigner",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "removeCertificateSigner",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "renounceCertificateSigner",
    data: BytesLike
  ): Result;
}

export namespace CertificateSignerAddedEvent {
  export type InputTuple = [token: AddressLike, account: AddressLike];
  export type OutputTuple = [token: string, account: string];
  export interface OutputObject {
    token: string;
    account: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace CertificateSignerRemovedEvent {
  export type InputTuple = [token: AddressLike, account: AddressLike];
  export type OutputTuple = [token: string, account: string];
  export interface OutputObject {
    token: string;
    account: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export interface CertificateSignerMock extends BaseContract {
  connect(runner?: ContractRunner | null): CertificateSignerMock;
  waitForDeployment(): Promise<this>;

  interface: CertificateSignerMockInterface;

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

  addCertificateSigner: TypedContractMethod<
    [token: AddressLike, account: AddressLike],
    [void],
    "nonpayable"
  >;

  isCertificateSigner: TypedContractMethod<
    [token: AddressLike, account: AddressLike],
    [boolean],
    "view"
  >;

  removeCertificateSigner: TypedContractMethod<
    [token: AddressLike, account: AddressLike],
    [void],
    "nonpayable"
  >;

  renounceCertificateSigner: TypedContractMethod<
    [token: AddressLike],
    [void],
    "nonpayable"
  >;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "addCertificateSigner"
  ): TypedContractMethod<
    [token: AddressLike, account: AddressLike],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "isCertificateSigner"
  ): TypedContractMethod<
    [token: AddressLike, account: AddressLike],
    [boolean],
    "view"
  >;
  getFunction(
    nameOrSignature: "removeCertificateSigner"
  ): TypedContractMethod<
    [token: AddressLike, account: AddressLike],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "renounceCertificateSigner"
  ): TypedContractMethod<[token: AddressLike], [void], "nonpayable">;

  getEvent(
    key: "CertificateSignerAdded"
  ): TypedContractEvent<
    CertificateSignerAddedEvent.InputTuple,
    CertificateSignerAddedEvent.OutputTuple,
    CertificateSignerAddedEvent.OutputObject
  >;
  getEvent(
    key: "CertificateSignerRemoved"
  ): TypedContractEvent<
    CertificateSignerRemovedEvent.InputTuple,
    CertificateSignerRemovedEvent.OutputTuple,
    CertificateSignerRemovedEvent.OutputObject
  >;

  filters: {
    "CertificateSignerAdded(address,address)": TypedContractEvent<
      CertificateSignerAddedEvent.InputTuple,
      CertificateSignerAddedEvent.OutputTuple,
      CertificateSignerAddedEvent.OutputObject
    >;
    CertificateSignerAdded: TypedContractEvent<
      CertificateSignerAddedEvent.InputTuple,
      CertificateSignerAddedEvent.OutputTuple,
      CertificateSignerAddedEvent.OutputObject
    >;

    "CertificateSignerRemoved(address,address)": TypedContractEvent<
      CertificateSignerRemovedEvent.InputTuple,
      CertificateSignerRemovedEvent.OutputTuple,
      CertificateSignerRemovedEvent.OutputObject
    >;
    CertificateSignerRemoved: TypedContractEvent<
      CertificateSignerRemovedEvent.InputTuple,
      CertificateSignerRemovedEvent.OutputTuple,
      CertificateSignerRemovedEvent.OutputObject
    >;
  };
}
