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
import type { NonPayableOverrides } from "../../../common";
import type {
  Pausable,
  PausableInterface,
} from "../../../contracts/tools/Pausable";

const _abi = [
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
        indexed: false,
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "Paused",
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
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "Unpaused",
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
    ],
    name: "pause",
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
    name: "paused",
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
  {
    inputs: [
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
    ],
    name: "unpause",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

const _bytecode =
  "0x6080604052348015600f57600080fd5b506105c58061001f6000396000f3fe608060405234801561001057600080fd5b506004361061007d5760003560e01c806357b001f91161005b57806357b001f9146100ea57806376a67a51146100fd578063eb5314bd14610110578063ed2f90951461012357600080fd5b80632e48152c146100825780632fd33398146100c257806341eb24bb146100d5575b600080fd5b6100ae610090366004610541565b6001600160a01b031660009081526001602052604090205460ff1690565b604051901515815260200160405180910390f35b6100ae6100d036600461055c565b610136565b6100e86100e3366004610541565b61015f565b005b6100e86100f8366004610541565b61016c565b6100e861010b366004610541565b610201565b6100e861011e36600461055c565b610292565b6100e861013136600461055c565b6102b5565b6001600160a01b038216600090815260208190526040812061015890836102d3565b9392505050565b610169813361035b565b50565b806101778133610136565b61018057600080fd5b6001600160a01b038216600090815260016020526040902054829060ff166101a757600080fd5b6001600160a01b038316600081815260016020908152604091829020805460ff1916905590513381527f3d072963433794eb417a69355df67d08bbd73d5076ef653d6863861161d60af391015b60405180910390a2505050565b8061020c8133610136565b61021557600080fd5b6001600160a01b038216600090815260016020526040902054829060ff161561023d57600080fd5b6001600160a01b038316600081815260016020818152604092839020805460ff191690921790915590513381527f3dd4f37ca5eaf6c357698a52c806820426d7c9a26adb0991c3bebb09cf23352a91016101f4565b8161029d8133610136565b6102a657600080fd5b6102b083836103c1565b505050565b816102c08133610136565b6102c957600080fd5b6102b0838361035b565b60006001600160a01b03821661033b5760405162461bcd60e51b815260206004820152602260248201527f526f6c65733a206163636f756e7420697320746865207a65726f206164647265604482015261737360f01b60648201526084015b60405180910390fd5b506001600160a01b03166000908152602091909152604090205460ff1690565b6001600160a01b038216600090815260208190526040902061037d9082610427565b806001600160a01b0316826001600160a01b03167fb75903ade4a0fdb07d60c882c22c779e2e1c751883c37aecdcc92a8ec72b046e60405160405180910390a35050565b6001600160a01b03821660009081526020819052604090206103e390826104a9565b806001600160a01b0316826001600160a01b03167fe0953c403a52f9dc1fef4202a8d33975c958b727bee0d7b5b328965ddad98d8160405160405180910390a35050565b61043182826102d3565b6104875760405162461bcd60e51b815260206004820152602160248201527f526f6c65733a206163636f756e7420646f6573206e6f74206861766520726f6c6044820152606560f81b6064820152608401610332565b6001600160a01b0316600090815260209190915260409020805460ff19169055565b6104b382826102d3565b156105005760405162461bcd60e51b815260206004820152601f60248201527f526f6c65733a206163636f756e7420616c72656164792068617320726f6c65006044820152606401610332565b6001600160a01b0316600090815260209190915260409020805460ff19166001179055565b80356001600160a01b038116811461053c57600080fd5b919050565b60006020828403121561055357600080fd5b61015882610525565b6000806040838503121561056f57600080fd5b61057883610525565b915061058660208401610525565b9050925092905056fea26469706673582212204d058d48cec832f05acaf698a0bd3184c2e8cbcc6f5910304f86348a90433b5c64736f6c634300081c0033";

type PausableConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: PausableConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class Pausable__factory extends ContractFactory {
  constructor(...args: PausableConstructorParams) {
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
      Pausable & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(runner: ContractRunner | null): Pausable__factory {
    return super.connect(runner) as Pausable__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): PausableInterface {
    return new Interface(_abi) as PausableInterface;
  }
  static connect(address: string, runner?: ContractRunner | null): Pausable {
    return new Contract(address, _abi, runner) as unknown as Pausable;
  }
}
