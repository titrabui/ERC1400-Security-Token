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
} from "../../common";

export interface ERC1400TokensRecipientMockInterface extends Interface {
  getFunction(
    nameOrSignature:
      | "canImplementInterfaceForAddress"
      | "canReceive"
      | "tokensReceived"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "canImplementInterfaceForAddress",
    values: [BytesLike, AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "canReceive",
    values: [
      BytesLike,
      BytesLike,
      AddressLike,
      AddressLike,
      AddressLike,
      BigNumberish,
      BytesLike,
      BytesLike
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "tokensReceived",
    values: [
      BytesLike,
      BytesLike,
      AddressLike,
      AddressLike,
      AddressLike,
      BigNumberish,
      BytesLike,
      BytesLike
    ]
  ): string;

  decodeFunctionResult(
    functionFragment: "canImplementInterfaceForAddress",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "canReceive", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "tokensReceived",
    data: BytesLike
  ): Result;
}

export interface ERC1400TokensRecipientMock extends BaseContract {
  connect(runner?: ContractRunner | null): ERC1400TokensRecipientMock;
  waitForDeployment(): Promise<this>;

  interface: ERC1400TokensRecipientMockInterface;

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

  canImplementInterfaceForAddress: TypedContractMethod<
    [interfaceHash: BytesLike, arg1: AddressLike],
    [string],
    "view"
  >;

  canReceive: TypedContractMethod<
    [
      arg0: BytesLike,
      arg1: BytesLike,
      arg2: AddressLike,
      from: AddressLike,
      to: AddressLike,
      value: BigNumberish,
      data: BytesLike,
      arg7: BytesLike
    ],
    [boolean],
    "view"
  >;

  tokensReceived: TypedContractMethod<
    [
      arg0: BytesLike,
      arg1: BytesLike,
      arg2: AddressLike,
      from: AddressLike,
      to: AddressLike,
      value: BigNumberish,
      data: BytesLike,
      arg7: BytesLike
    ],
    [void],
    "view"
  >;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "canImplementInterfaceForAddress"
  ): TypedContractMethod<
    [interfaceHash: BytesLike, arg1: AddressLike],
    [string],
    "view"
  >;
  getFunction(
    nameOrSignature: "canReceive"
  ): TypedContractMethod<
    [
      arg0: BytesLike,
      arg1: BytesLike,
      arg2: AddressLike,
      from: AddressLike,
      to: AddressLike,
      value: BigNumberish,
      data: BytesLike,
      arg7: BytesLike
    ],
    [boolean],
    "view"
  >;
  getFunction(
    nameOrSignature: "tokensReceived"
  ): TypedContractMethod<
    [
      arg0: BytesLike,
      arg1: BytesLike,
      arg2: AddressLike,
      from: AddressLike,
      to: AddressLike,
      value: BigNumberish,
      data: BytesLike,
      arg7: BytesLike
    ],
    [void],
    "view"
  >;

  filters: {};
}
