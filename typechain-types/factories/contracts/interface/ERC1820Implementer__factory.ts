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
  ERC1820Implementer,
  ERC1820ImplementerInterface,
} from "../../../contracts/interface/ERC1820Implementer";

const _abi = [
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "interfaceHash",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "canImplementInterfaceForAddress",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

const _bytecode =
  "0x6080604052348015600f57600080fd5b5061011d8061001f6000396000f3fe6080604052348015600f57600080fd5b506004361060285760003560e01c8063249cb3fa14602d575b600080fd5b603c603836600460ad565b604e565b60405190815260200160405180910390f35b60008281526020819052604081205460ff161560a35760405173455243313832305f4143434550545f4d4147494360601b602082015260340160405160208183030381529060405280519060200120905060a7565b5060005b92915050565b6000806040838503121560bf57600080fd5b8235915060208301356001600160a01b038116811460dc57600080fd5b80915050925092905056fea26469706673582212205c85859483328c31a9c48e52c23010358d27635a5566cff361a80bcf5974a62464736f6c634300081c0033";

type ERC1820ImplementerConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: ERC1820ImplementerConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class ERC1820Implementer__factory extends ContractFactory {
  constructor(...args: ERC1820ImplementerConstructorParams) {
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
      ERC1820Implementer & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(runner: ContractRunner | null): ERC1820Implementer__factory {
    return super.connect(runner) as ERC1820Implementer__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): ERC1820ImplementerInterface {
    return new Interface(_abi) as ERC1820ImplementerInterface;
  }
  static connect(
    address: string,
    runner?: ContractRunner | null
  ): ERC1820Implementer {
    return new Contract(address, _abi, runner) as unknown as ERC1820Implementer;
  }
}
