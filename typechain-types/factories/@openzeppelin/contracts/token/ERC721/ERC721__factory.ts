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
import type { NonPayableOverrides } from "../../../../../common";
import type {
  ERC721,
  ERC721Interface,
} from "../../../../../@openzeppelin/contracts/token/ERC721/ERC721";

const _abi = [
  {
    inputs: [
      {
        internalType: "string",
        name: "name_",
        type: "string",
      },
      {
        internalType: "string",
        name: "symbol_",
        type: "string",
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
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "approved",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
    ],
    name: "ApprovalForAll",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "getApproved",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
    ],
    name: "isApprovedForAll",
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
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "ownerOf",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
    ],
    name: "setApprovalForAll",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "interfaceId",
        type: "bytes4",
      },
    ],
    name: "supportsInterface",
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
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "tokenURI",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

const _bytecode =
  "0x608060405234801561001057600080fd5b506040516113c43803806113c483398101604081905261002f91610109565b600061003b83826101fb565b50600161004882826101fb565b5050506102b9565b634e487b7160e01b600052604160045260246000fd5b600082601f83011261007757600080fd5b81516001600160401b0381111561009057610090610050565b604051601f8201601f19908116603f011681016001600160401b03811182821017156100be576100be610050565b6040528181528382016020018510156100d657600080fd5b60005b828110156100f5576020818601810151838301820152016100d9565b506000918101602001919091529392505050565b6000806040838503121561011c57600080fd5b82516001600160401b0381111561013257600080fd5b61013e85828601610066565b602085015190935090506001600160401b0381111561015c57600080fd5b61016885828601610066565b9150509250929050565b600181811c9082168061018657607f821691505b6020821081036101a657634e487b7160e01b600052602260045260246000fd5b50919050565b601f8211156101f657806000526020600020601f840160051c810160208510156101d35750805b601f840160051c820191505b818110156101f357600081556001016101df565b50505b505050565b81516001600160401b0381111561021457610214610050565b610228816102228454610172565b846101ac565b6020601f82116001811461025c57600083156102445750848201515b600019600385901b1c1916600184901b1784556101f3565b600084815260208120601f198516915b8281101561028c578785015182556020948501946001909201910161026c565b50848210156102aa5786840151600019600387901b60f8161c191681555b50505050600190811b01905550565b6110fc806102c86000396000f3fe608060405234801561001057600080fd5b50600436106100cf5760003560e01c80636352211e1161008c578063a22cb46511610066578063a22cb465146101b3578063b88d4fde146101c6578063c87b56dd146101d9578063e985e9c5146101ec57600080fd5b80636352211e1461017757806370a082311461018a57806395d89b41146101ab57600080fd5b806301ffc9a7146100d457806306fdde03146100fc578063081812fc14610111578063095ea7b31461013c57806323b872dd1461015157806342842e0e14610164575b600080fd5b6100e76100e2366004610c7f565b610228565b60405190151581526020015b60405180910390f35b61010461027a565b6040516100f39190610cec565b61012461011f366004610cff565b61030c565b6040516001600160a01b0390911681526020016100f3565b61014f61014a366004610d34565b610333565b005b61014f61015f366004610d5e565b61044d565b61014f610172366004610d5e565b61047e565b610124610185366004610cff565b610499565b61019d610198366004610d9b565b6104f9565b6040519081526020016100f3565b61010461057f565b61014f6101c1366004610db6565b61058e565b61014f6101d4366004610e08565b61059d565b6101046101e7366004610cff565b6105d5565b6100e76101fa366004610eec565b6001600160a01b03918216600090815260056020908152604080832093909416825291909152205460ff1690565b60006001600160e01b031982166380ac58cd60e01b148061025957506001600160e01b03198216635b5e139f60e01b145b8061027457506301ffc9a760e01b6001600160e01b03198316145b92915050565b60606000805461028990610f1f565b80601f01602080910402602001604051908101604052809291908181526020018280546102b590610f1f565b80156103025780601f106102d757610100808354040283529160200191610302565b820191906000526020600020905b8154815290600101906020018083116102e557829003601f168201915b5050505050905090565b600061031782610649565b506000908152600460205260409020546001600160a01b031690565b600061033e82610499565b9050806001600160a01b0316836001600160a01b0316036103b05760405162461bcd60e51b815260206004820152602160248201527f4552433732313a20617070726f76616c20746f2063757272656e74206f776e656044820152603960f91b60648201526084015b60405180910390fd5b336001600160a01b03821614806103cc57506103cc81336101fa565b61043e5760405162461bcd60e51b815260206004820152603d60248201527f4552433732313a20617070726f76652063616c6c6572206973206e6f7420746f60448201527f6b656e206f776e6572206f7220617070726f76656420666f7220616c6c00000060648201526084016103a7565b61044883836106ab565b505050565b6104573382610719565b6104735760405162461bcd60e51b81526004016103a790610f59565b610448838383610798565b6104488383836040518060200160405280600081525061059d565b6000818152600260205260408120546001600160a01b0316806102745760405162461bcd60e51b8152602060048201526018602482015277115490cdcc8c4e881a5b9d985b1a59081d1bdad95b88125160421b60448201526064016103a7565b60006001600160a01b0382166105635760405162461bcd60e51b815260206004820152602960248201527f4552433732313a2061646472657373207a65726f206973206e6f7420612076616044820152683634b21037bbb732b960b91b60648201526084016103a7565b506001600160a01b031660009081526003602052604090205490565b60606001805461028990610f1f565b6105993383836108fc565b5050565b6105a73383610719565b6105c35760405162461bcd60e51b81526004016103a790610f59565b6105cf848484846109ca565b50505050565b60606105e082610649565b60006105f760408051602081019091526000815290565b905060008151116106175760405180602001604052806000815250610642565b80610621846109fd565b604051602001610632929190610fa6565b6040516020818303038152906040525b9392505050565b6000818152600260205260409020546001600160a01b03166106a85760405162461bcd60e51b8152602060048201526018602482015277115490cdcc8c4e881a5b9d985b1a59081d1bdad95b88125160421b60448201526064016103a7565b50565b600081815260046020526040902080546001600160a01b0319166001600160a01b03841690811790915581906106e082610499565b6001600160a01b03167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92560405160405180910390a45050565b60008061072583610499565b9050806001600160a01b0316846001600160a01b0316148061076c57506001600160a01b0380821660009081526005602090815260408083209388168352929052205460ff165b806107905750836001600160a01b03166107858461030c565b6001600160a01b0316145b949350505050565b826001600160a01b03166107ab82610499565b6001600160a01b0316146107d15760405162461bcd60e51b81526004016103a790610fd5565b6001600160a01b0382166108335760405162461bcd60e51b8152602060048201526024808201527f4552433732313a207472616e7366657220746f20746865207a65726f206164646044820152637265737360e01b60648201526084016103a7565b826001600160a01b031661084682610499565b6001600160a01b03161461086c5760405162461bcd60e51b81526004016103a790610fd5565b600081815260046020908152604080832080546001600160a01b03199081169091556001600160a01b0387811680865260038552838620805460001901905590871680865283862080546001019055868652600290945282852080549092168417909155905184937fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef91a4505050565b816001600160a01b0316836001600160a01b03160361095d5760405162461bcd60e51b815260206004820152601960248201527f4552433732313a20617070726f766520746f2063616c6c65720000000000000060448201526064016103a7565b6001600160a01b03838116600081815260056020908152604080832094871680845294825291829020805460ff191686151590811790915591519182527f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31910160405180910390a3505050565b6109d5848484610798565b6109e184848484610a90565b6105cf5760405162461bcd60e51b81526004016103a79061101a565b60606000610a0a83610b91565b600101905060008167ffffffffffffffff811115610a2a57610a2a610df2565b6040519080825280601f01601f191660200182016040528015610a54576020820181803683370190505b5090508181016020015b600019016f181899199a1a9b1b9c1cb0b131b232b360811b600a86061a8153600a8504945084610a5e57509392505050565b60006001600160a01b0384163b15610b8657604051630a85bd0160e11b81526001600160a01b0385169063150b7a0290610ad490339089908890889060040161106c565b6020604051808303816000875af1925050508015610b0f575060408051601f3d908101601f19168201909252610b0c918101906110a9565b60015b610b6c573d808015610b3d576040519150601f19603f3d011682016040523d82523d6000602084013e610b42565b606091505b508051600003610b645760405162461bcd60e51b81526004016103a79061101a565b805181602001fd5b6001600160e01b031916630a85bd0160e11b149050610790565b506001949350505050565b60008072184f03e93ff9f4daa797ed6e38ed64bf6a1f0160401b8310610bd05772184f03e93ff9f4daa797ed6e38ed64bf6a1f0160401b830492506040015b6d04ee2d6d415b85acef81000000008310610bfc576d04ee2d6d415b85acef8100000000830492506020015b662386f26fc100008310610c1a57662386f26fc10000830492506010015b6305f5e1008310610c32576305f5e100830492506008015b6127108310610c4657612710830492506004015b60648310610c58576064830492506002015b600a83106102745760010192915050565b6001600160e01b0319811681146106a857600080fd5b600060208284031215610c9157600080fd5b813561064281610c69565b60005b83811015610cb7578181015183820152602001610c9f565b50506000910152565b60008151808452610cd8816020860160208601610c9c565b601f01601f19169290920160200192915050565b6020815260006106426020830184610cc0565b600060208284031215610d1157600080fd5b5035919050565b80356001600160a01b0381168114610d2f57600080fd5b919050565b60008060408385031215610d4757600080fd5b610d5083610d18565b946020939093013593505050565b600080600060608486031215610d7357600080fd5b610d7c84610d18565b9250610d8a60208501610d18565b929592945050506040919091013590565b600060208284031215610dad57600080fd5b61064282610d18565b60008060408385031215610dc957600080fd5b610dd283610d18565b915060208301358015158114610de757600080fd5b809150509250929050565b634e487b7160e01b600052604160045260246000fd5b60008060008060808587031215610e1e57600080fd5b610e2785610d18565b9350610e3560208601610d18565b925060408501359150606085013567ffffffffffffffff811115610e5857600080fd5b8501601f81018713610e6957600080fd5b803567ffffffffffffffff811115610e8357610e83610df2565b604051601f8201601f19908116603f0116810167ffffffffffffffff81118282101715610eb257610eb2610df2565b604052818152828201602001891015610eca57600080fd5b8160208401602083013760006020838301015280935050505092959194509250565b60008060408385031215610eff57600080fd5b610f0883610d18565b9150610f1660208401610d18565b90509250929050565b600181811c90821680610f3357607f821691505b602082108103610f5357634e487b7160e01b600052602260045260246000fd5b50919050565b6020808252602d908201527f4552433732313a2063616c6c6572206973206e6f7420746f6b656e206f776e6560408201526c1c881bdc88185c1c1c9bdd9959609a1b606082015260800190565b60008351610fb8818460208801610c9c565b835190830190610fcc818360208801610c9c565b01949350505050565b60208082526025908201527f4552433732313a207472616e736665722066726f6d20696e636f72726563742060408201526437bbb732b960d91b606082015260800190565b60208082526032908201527f4552433732313a207472616e7366657220746f206e6f6e20455243373231526560408201527131b2b4bb32b91034b6b83632b6b2b73a32b960711b606082015260800190565b6001600160a01b038581168252841660208201526040810183905260806060820181905260009061109f90830184610cc0565b9695505050505050565b6000602082840312156110bb57600080fd5b815161064281610c6956fea264697066735822122037a6bf9cce5bee0468901a17f496259d80e325b88c5247d8c15b7e8acbd3cc8b64736f6c634300081c0033";

type ERC721ConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: ERC721ConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class ERC721__factory extends ContractFactory {
  constructor(...args: ERC721ConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override getDeployTransaction(
    name_: string,
    symbol_: string,
    overrides?: NonPayableOverrides & { from?: string }
  ): Promise<ContractDeployTransaction> {
    return super.getDeployTransaction(name_, symbol_, overrides || {});
  }
  override deploy(
    name_: string,
    symbol_: string,
    overrides?: NonPayableOverrides & { from?: string }
  ) {
    return super.deploy(name_, symbol_, overrides || {}) as Promise<
      ERC721 & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(runner: ContractRunner | null): ERC721__factory {
    return super.connect(runner) as ERC721__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): ERC721Interface {
    return new Interface(_abi) as ERC721Interface;
  }
  static connect(address: string, runner?: ContractRunner | null): ERC721 {
    return new Contract(address, _abi, runner) as unknown as ERC721;
  }
}
