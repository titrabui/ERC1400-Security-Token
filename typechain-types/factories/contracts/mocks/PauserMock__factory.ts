/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  Contract,
  ContractFactory,
  ContractTransactionResponse,
  Interface,
} from "ethers";
import type {
  Signer,
  AddressLike,
  ContractDeployTransaction,
  ContractRunner,
} from "ethers";
import type { NonPayableOverrides } from "../../../common";
import type {
  PauserMock,
  PauserMockInterface,
} from "../../../contracts/mocks/PauserMock";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "PauserAdded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "PauserRemoved",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "addPauser",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "isPauser",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        internalType: "bool",
        name: "mockActivated",
        type: "bool",
      },
    ],
    name: "mockFunction",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "removePauser",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
    ],
    name: "renouncePauser",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

const _bytecode =
  "0x608060405234801561001057600080fd5b5060405161068738038061068783398101604081905261002f916101a9565b610039813361003f565b506101d9565b6001600160a01b038216600090815260208190526040902061006190826100a5565b806001600160a01b0316826001600160a01b03167fe0953c403a52f9dc1fef4202a8d33975c958b727bee0d7b5b328965ddad98d8160405160405180910390a35050565b6100af8282610126565b156101015760405162461bcd60e51b815260206004820152601f60248201527f526f6c65733a206163636f756e7420616c72656164792068617320726f6c650060448201526064015b60405180910390fd5b6001600160a01b0316600090815260209190915260409020805460ff19166001179055565b60006001600160a01b0382166101895760405162461bcd60e51b815260206004820152602260248201527f526f6c65733a206163636f756e7420697320746865207a65726f206164647265604482015261737360f01b60648201526084016100f8565b506001600160a01b03166000908152602091909152604090205460ff1690565b6000602082840312156101bb57600080fd5b81516001600160a01b03811681146101d257600080fd5b9392505050565b61049f806101e86000396000f3fe608060405234801561001057600080fd5b50600436106100575760003560e01c80632fd333981461005c57806341eb24bb146100835780636c41d4ea14610098578063eb5314bd146100ab578063ed2f9095146100be575b600080fd5b61006f61006a3660046103df565b6100d1565b604051901515815260200160405180910390f35b610096610091366004610412565b6100fa565b005b6100966100a636600461042d565b610107565b6100966100b93660046103df565b610130565b6100966100cc3660046103df565b610153565b6001600160a01b03821660009081526020819052604081206100f39083610171565b9392505050565b61010481336101f9565b50565b8161011281336100d1565b61011b57600080fd5b506001805460ff191691151591909117905550565b8161013b81336100d1565b61014457600080fd5b61014e838361025f565b505050565b8161015e81336100d1565b61016757600080fd5b61014e83836101f9565b60006001600160a01b0382166101d95760405162461bcd60e51b815260206004820152602260248201527f526f6c65733a206163636f756e7420697320746865207a65726f206164647265604482015261737360f01b60648201526084015b60405180910390fd5b506001600160a01b03166000908152602091909152604090205460ff1690565b6001600160a01b038216600090815260208190526040902061021b90826102c5565b806001600160a01b0316826001600160a01b03167fb75903ade4a0fdb07d60c882c22c779e2e1c751883c37aecdcc92a8ec72b046e60405160405180910390a35050565b6001600160a01b03821660009081526020819052604090206102819082610347565b806001600160a01b0316826001600160a01b03167fe0953c403a52f9dc1fef4202a8d33975c958b727bee0d7b5b328965ddad98d8160405160405180910390a35050565b6102cf8282610171565b6103255760405162461bcd60e51b815260206004820152602160248201527f526f6c65733a206163636f756e7420646f6573206e6f74206861766520726f6c6044820152606560f81b60648201526084016101d0565b6001600160a01b0316600090815260209190915260409020805460ff19169055565b6103518282610171565b1561039e5760405162461bcd60e51b815260206004820152601f60248201527f526f6c65733a206163636f756e7420616c72656164792068617320726f6c650060448201526064016101d0565b6001600160a01b0316600090815260209190915260409020805460ff19166001179055565b80356001600160a01b03811681146103da57600080fd5b919050565b600080604083850312156103f257600080fd5b6103fb836103c3565b9150610409602084016103c3565b90509250929050565b60006020828403121561042457600080fd5b6100f3826103c3565b6000806040838503121561044057600080fd5b610449836103c3565b91506020830135801515811461045e57600080fd5b80915050925092905056fea2646970667358221220544c2c7f80d570d8f50d52cdc0453cf808e9f281c554b5a5cfedc9e675c315c864736f6c634300081c0033";

type PauserMockConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: PauserMockConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class PauserMock__factory extends ContractFactory {
  constructor(...args: PauserMockConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override getDeployTransaction(
    token: AddressLike,
    overrides?: NonPayableOverrides & { from?: string }
  ): Promise<ContractDeployTransaction> {
    return super.getDeployTransaction(token, overrides || {});
  }
  override deploy(
    token: AddressLike,
    overrides?: NonPayableOverrides & { from?: string }
  ) {
    return super.deploy(token, overrides || {}) as Promise<
      PauserMock & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(runner: ContractRunner | null): PauserMock__factory {
    return super.connect(runner) as PauserMock__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): PauserMockInterface {
    return new Interface(_abi) as PauserMockInterface;
  }
  static connect(address: string, runner?: ContractRunner | null): PauserMock {
    return new Contract(address, _abi, runner) as unknown as PauserMock;
  }
}
