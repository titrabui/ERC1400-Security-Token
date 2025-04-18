/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  Contract,
  ContractFactory,
  ContractTransactionResponse,
  Interface,
} from "ethers";
import type { Signer, ContractDeployTransaction, ContractRunner } from "ethers";
import type { NonPayableOverrides } from "../../../../common";
import type {
  MinterMock,
  MinterMockInterface,
} from "../../../../contracts/mocks/MinterRoleMock.sol/MinterMock";

const _abi = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "MinterAdded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "MinterRemoved",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "addMinter",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "isMinter",
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
        name: "account",
        type: "address",
      },
    ],
    name: "removeMinter",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceMinter",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

const _bytecode =
  "0x608060405234801561001057600080fd5b5061001a3361001f565b610165565b61002a600082610061565b6040516001600160a01b038216907f6ae172837ea30b801fbfcdd4108aa1d5bf8ff775444fd70256b44e6bf3dfc3f690600090a250565b61006b82826100e2565b156100bd5760405162461bcd60e51b815260206004820152601f60248201527f526f6c65733a206163636f756e7420616c72656164792068617320726f6c650060448201526064015b60405180910390fd5b6001600160a01b0316600090815260209190915260409020805460ff19166001179055565b60006001600160a01b0382166101455760405162461bcd60e51b815260206004820152602260248201527f526f6c65733a206163636f756e7420697320746865207a65726f206164647265604482015261737360f01b60648201526084016100b4565b506001600160a01b03166000908152602091909152604090205460ff1690565b61036e806101746000396000f3fe608060405234801561001057600080fd5b506004361061004c5760003560e01c80633092afd514610051578063983b2d56146100665780639865027514610079578063aa271e1a14610081575b600080fd5b61006461005f366004610308565b6100a8565b005b610064610074366004610308565b6100c6565b6100646100e1565b61009461008f366004610308565b6100ec565b604051901515815260200160405180910390f35b6100b1336100ec565b6100ba57600080fd5b6100c3816100fe565b50565b6100cf336100ec565b6100d857600080fd5b6100c381610140565b6100ea336100fe565b565b60006100f88183610182565b92915050565b61010960008261020a565b6040516001600160a01b038216907fe94479a9f7e1952cc78f2d6baab678adc1b772d936c6583def489e524cb6669290600090a250565b61014b60008261028c565b6040516001600160a01b038216907f6ae172837ea30b801fbfcdd4108aa1d5bf8ff775444fd70256b44e6bf3dfc3f690600090a250565b60006001600160a01b0382166101ea5760405162461bcd60e51b815260206004820152602260248201527f526f6c65733a206163636f756e7420697320746865207a65726f206164647265604482015261737360f01b60648201526084015b60405180910390fd5b506001600160a01b03166000908152602091909152604090205460ff1690565b6102148282610182565b61026a5760405162461bcd60e51b815260206004820152602160248201527f526f6c65733a206163636f756e7420646f6573206e6f74206861766520726f6c6044820152606560f81b60648201526084016101e1565b6001600160a01b0316600090815260209190915260409020805460ff19169055565b6102968282610182565b156102e35760405162461bcd60e51b815260206004820152601f60248201527f526f6c65733a206163636f756e7420616c72656164792068617320726f6c650060448201526064016101e1565b6001600160a01b0316600090815260209190915260409020805460ff19166001179055565b60006020828403121561031a57600080fd5b81356001600160a01b038116811461033157600080fd5b939250505056fea264697066735822122000590a526505fd8a354ab75ae029d7a0d532e4fdb66299fcb6fd9871c840dfa964736f6c634300081c0033";

type MinterMockConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: MinterMockConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class MinterMock__factory extends ContractFactory {
  constructor(...args: MinterMockConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override getDeployTransaction(
    overrides?: NonPayableOverrides & { from?: string }
  ): Promise<ContractDeployTransaction> {
    return super.getDeployTransaction(overrides || {});
  }
  override deploy(overrides?: NonPayableOverrides & { from?: string }) {
    return super.deploy(overrides || {}) as Promise<
      MinterMock & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(runner: ContractRunner | null): MinterMock__factory {
    return super.connect(runner) as MinterMock__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): MinterMockInterface {
    return new Interface(_abi) as MinterMockInterface;
  }
  static connect(address: string, runner?: ContractRunner | null): MinterMock {
    return new Contract(address, _abi, runner) as unknown as MinterMock;
  }
}
