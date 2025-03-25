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
  AddressLike,
  ContractRunner,
  ContractMethod,
  Listener,
} from "ethers";
import type {
  TypedContractEvent,
  TypedDeferredTopicFilter,
  TypedEventLog,
  TypedListener,
  TypedContractMethod,
} from "../../../common";

export interface BatchTokenIssuerInterface extends Interface {
  getFunction(
    nameOrSignature: "batchIssueByPartition" | "canImplementInterfaceForAddress"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "batchIssueByPartition",
    values: [AddressLike, BytesLike[], AddressLike[], BigNumberish[]]
  ): string;
  encodeFunctionData(
    functionFragment: "canImplementInterfaceForAddress",
    values: [BytesLike, AddressLike]
  ): string;

  decodeFunctionResult(
    functionFragment: "batchIssueByPartition",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "canImplementInterfaceForAddress",
    data: BytesLike
  ): Result;
}

export interface BatchTokenIssuer extends BaseContract {
  connect(runner?: ContractRunner | null): BatchTokenIssuer;
  waitForDeployment(): Promise<this>;

  interface: BatchTokenIssuerInterface;

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

  batchIssueByPartition: TypedContractMethod<
    [
      token: AddressLike,
      partitions: BytesLike[],
      tokenHolders: AddressLike[],
      values: BigNumberish[]
    ],
    [void],
    "nonpayable"
  >;

  canImplementInterfaceForAddress: TypedContractMethod<
    [interfaceHash: BytesLike, arg1: AddressLike],
    [string],
    "view"
  >;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "batchIssueByPartition"
  ): TypedContractMethod<
    [
      token: AddressLike,
      partitions: BytesLike[],
      tokenHolders: AddressLike[],
      values: BigNumberish[]
    ],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "canImplementInterfaceForAddress"
  ): TypedContractMethod<
    [interfaceHash: BytesLike, arg1: AddressLike],
    [string],
    "view"
  >;

  filters: {};
}
