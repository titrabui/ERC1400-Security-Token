import { expect } from "chai";
import { ethers } from "hardhat";
import { BaseContract, ContractTransactionResponse, Log, Signer, solidityPackedKeccak256 } from "ethers";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { ERC1400 } from "../typechain-types";

const ERC1820_ACCEPT_MAGIC = "ERC1820_ACCEPT_MAGIC";

const ERC20_INTERFACE_NAME = "ERC20Token";
const ERC1400_INTERFACE_NAME = "ERC1400Token";

const ZERO_BYTES32 = "0x0000000000000000000000000000000000000000000000000000000000000000";
const ZERO_BYTE = "0x";

const CERTIFICATE_SIGNER = "0xe31C41f0f70C5ff39f73B4B94bcCD767b3071630";

const partitionFlag = "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"; // Flag to indicate a partition change
const otherFlag = "0xdddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd"; // Other flag
const partition1_short = "7265736572766564000000000000000000000000000000000000000000000000"; // reserved in hex
const partition2_short = "6973737565640000000000000000000000000000000000000000000000000000"; // issued in hex
const partition3_short = "6c6f636b65640000000000000000000000000000000000000000000000000000"; // locked in hex
const changeToPartition1 = partitionFlag.concat(partition1_short);
const changeToPartition2 = partitionFlag.concat(partition2_short);
const changeToPartition3 = partitionFlag.concat(partition3_short);
const doNotChangePartition = otherFlag.concat(partition2_short);
const partition1 = "0x".concat(partition1_short);
const partition2 = "0x".concat(partition2_short);
const partition3 = "0x".concat(partition3_short);

const partitions = [partition1, partition2, partition3];
const reversedPartitions = [partition3, partition1, partition2];

const documentName = "0x446f63756d656e74204e616d6500000000000000000000000000000000000000";
const documentURI =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit,sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."; // SHA-256 of documentURI
const documentHash = "0x1c81c608a616183cc4a38c09ecc944eb77eaff465dd87aae0290177f2b70b6f8"; // SHA-256 of documentURI + '0x'

const issuanceAmount = 1000n;

function assertTransferEvent(
  _contract: ERC1400,
  _logs: readonly Log[],
  _fromPartition: string,
  _operator: Signer,
  _from: Signer,
  _to: Signer,
  _amount: bigint,
  _data: string | null,
  _operatorData = ZERO_BYTE
) {
  let i = 0;
  let event;
  if (_logs.length === 3) {
    event = _contract.interface.decodeEventLog("Checked", _logs[0].data, _logs[0].topics);
    expect(event.sender).to.equal(_operator);
    i = 1;
  }

  event = _contract.interface.decodeEventLog("Transfer", _logs[i].data, _logs[i].topics);
  expect(event.from).to.equal(_from);
  expect(event.to).to.equal(_to);
  expect(event.value).to.equal(_amount);

  event = _contract.interface.decodeEventLog("TransferByPartition", _logs[i + 1].data, _logs[i + 1].topics);
  expect(event.fromPartition).to.equal(_fromPartition);
  expect(event.operator).to.equal(_operator);
  expect(event.from).to.equal(_from);
  expect(event.to).to.equal(_to);
  expect(event.value).to.equal(_amount);
  expect(event.data).to.equal(_data);
  expect(event.operatorData).to.equal(_operatorData);
}

function assertBurnEvent(
  _contract: ERC1400,
  _logs: readonly Log[],
  _fromPartition: string,
  _operator: Signer,
  _from: Signer,
  _amount: bigint,
  _data: string | null,
  _operatorData = ZERO_BYTE
) {
  let i = 0;
  let event;
  if (_logs.length === 4) {
    event = _contract.interface.decodeEventLog("Checked", _logs[0].data, _logs[0].topics);
    expect(event.sender).to.equal(_operator);
    i = 1;
  }

  event = _contract.interface.decodeEventLog("Redeemed", _logs[i].data, _logs[i].topics);
  expect(event.operator).to.equal(_operator);
  expect(event.from).to.equal(_from);
  expect(event.value).to.equal(_amount);
  expect(event.data).to.equal(_data);

  event = _contract.interface.decodeEventLog("Transfer", _logs[i + 1].data, _logs[i + 1].topics);
  expect(event.from).to.equal(_from);
  expect(event.to).to.equal(ethers.ZeroAddress);
  expect(event.value).to.equal(_amount);

  event = _contract.interface.decodeEventLog("RedeemedByPartition", _logs[i + 2].data, _logs[i + 2].topics);
  expect(event.partition).to.equal(_fromPartition);
  expect(event.operator).to.equal(_operator);
  expect(event.from).to.equal(_from);
  expect(event.value).to.equal(_amount);
  expect(event.operatorData).to.equal(_operatorData);
}

async function assertBalances(_contract: ERC1400, _tokenHolder: Signer, _partitions: string[], _amounts: bigint[]) {
  let totalBalance = 0n;
  for (let i = 0; i < _partitions.length; i++) {
    totalBalance += _amounts[i];
    await assertBalanceOfByPartition(_contract, _tokenHolder, _partitions[i], _amounts[i]);
  }
  await assertBalance(_contract, _tokenHolder, totalBalance);
}

async function assertBalanceOf(_contract: ERC1400, _tokenHolder: Signer, _partition: string, _amount: bigint) {
  await assertBalance(_contract, _tokenHolder, _amount);
  await assertBalanceOfByPartition(_contract, _tokenHolder, _partition, _amount);
}

async function assertBalanceOfByPartition(
  _contract: ERC1400,
  _tokenHolder: Signer,
  _partition: string,
  _amount: bigint
) {
  const balanceByPartition = await _contract.balanceOfByPartition(_partition, _tokenHolder);
  expect(balanceByPartition).to.equal(_amount);
}

async function assertBalance(_contract: ERC1400, _tokenHolder: Signer, _amount: bigint) {
  const balance = await _contract.balanceOf(_tokenHolder);
  expect(balance).to.equal(_amount);
}

async function assertTotalSupply(_contract: ERC1400, _amount: bigint) {
  const totalSupply = await _contract.totalSupply();
  expect(totalSupply).to.equal(_amount);
}

async function authorizeOperatorForPartitions(
  _contract: ERC1400,
  _operator: Signer,
  _tokenHolder: Signer,
  _partitions: string[]
) {
  for (const partition of _partitions) {
    await _contract.connect(_tokenHolder).authorizeOperatorByPartition(partition, _operator);
  }
}

async function issueOnMultiplePartitions(
  _contract: ERC1400,
  _owner: Signer,
  _recipient: Signer,
  _partitions: string[],
  _amounts: bigint[]
) {
  for (let i = 0; i < _partitions.length; i++) {
    await _contract.connect(_owner).issueByPartition(_partitions[i], _recipient, _amounts[i], ZERO_BYTES32);
  }
}

describe("ERC1400", function () {
  async function deployFixture() {
    const [
      owner,
      operator,
      controller,
      controller_alternative1,
      controller_alternative2,
      tokenHolder,
      recipient,
      unknown,
    ] = await ethers.getSigners();

    const registry = await ethers.getContractAt("IERC1820Registry", "0x1820a4B7618BdE71Dce8cdc73aAB6C95905faD24");
    const token = await ethers.deployContract("ERC1400", ["ERC1400Token", "DAU", 1, [controller], partitions], owner);

    const minterMock = await ethers.deployContract("MinterMock");

    return {
      owner,
      operator,
      controller,
      controller_alternative1,
      controller_alternative2,
      tokenHolder,
      recipient,
      unknown,
      registry,
      token,
      minterMock,
    };
  }

  describe("contract creation", function () {
    it("fails deploying the contract if granularity is lower than 1", async function () {
      const { controller } = await loadFixture(deployFixture);
      await expect(
        ethers.deployContract("ERC1400", ["ERC1400Token", "DAU", 0, [controller], partitions])
      ).to.be.revertedWithoutReason();
    });
  });

  // CANIMPLEMENTINTERFACE

  describe("canImplementInterfaceForAddress", function () {
    describe("when interface hash is correct", function () {
      it("returns ERC1820_ACCEPT_MAGIC", async function () {
        const { token } = await loadFixture(deployFixture);

        const ERC1400_hash = ethers.solidityPackedKeccak256(["string"], [ERC1400_INTERFACE_NAME]);
        const ERC1820_hash = ethers.solidityPackedKeccak256(["string"], [ERC1820_ACCEPT_MAGIC]);

        const canImplement1400 = await token.canImplementInterfaceForAddress(ERC1400_hash, ethers.ZeroAddress);
        expect(canImplement1400).to.equal(ERC1820_hash);

        const ERC20_hash = ethers.solidityPackedKeccak256(["string"], [ERC20_INTERFACE_NAME]);
        const canImplement20 = await token.canImplementInterfaceForAddress(ERC20_hash, ethers.ZeroAddress);
        expect(canImplement20).to.equal(ERC1820_hash);
      });
    });

    describe("when interface hash is not correct", function () {
      it("returns ZERO_BYTES32", async function () {
        const { token } = await loadFixture(deployFixture);

        const canImplement = await token.canImplementInterfaceForAddress(
          ethers.solidityPackedKeccak256(["string"], ["FakeToken"]),
          ethers.ZeroAddress
        );
        expect(canImplement).to.equal(ZERO_BYTES32);
      });
    });
  });

  // MINTER
  describe("minter role", function () {
    describe("addMinter/removeMinter", function () {
      describe("add/renounce a minter", function () {
        it("should revert when caller is not a minter", async function () {
          const { token, unknown } = await loadFixture(deployFixture);
          expect(await token.isMinter(unknown)).to.be.false;
          await expect(token.connect(unknown).addMinter(unknown)).to.be.revertedWithoutReason();
          expect(await token.isMinter(unknown)).to.be.false;
        });

        describe("when caller is a minter", function () {
          it("adds a minter as owner", async function () {
            const { token, owner, unknown } = await loadFixture(deployFixture);
            expect(await token.isMinter(unknown)).to.be.false;
            await token.connect(owner).addMinter(unknown);
            expect(await token.isMinter(unknown)).to.be.true;
          });

          it("adds a minter as minter", async function () {
            const { token, owner, unknown, tokenHolder } = await loadFixture(deployFixture);
            expect(await token.isMinter(unknown)).to.be.false;
            await token.connect(owner).addMinter(unknown);
            expect(await token.isMinter(unknown)).to.be.true;

            expect(await token.isMinter(tokenHolder)).to.be.false;
            await token.connect(unknown).addMinter(tokenHolder);
            expect(await token.isMinter(tokenHolder)).to.be.true;
          });

          it("renounces minter", async function () {
            const { token, owner, unknown } = await loadFixture(deployFixture);
            expect(await token.isMinter(unknown)).to.be.false;
            await token.connect(owner).addMinter(unknown);
            expect(await token.isMinter(unknown)).to.be.true;

            await token.connect(unknown).renounceMinter();
            expect(await token.isMinter(unknown)).to.be.false;

            await expect(token.connect(unknown).renounceMinter()).to.be.revertedWith(
              "Roles: account does not have role"
            );
          });
        });
      });

      describe("remove a minter", function () {
        describe("when caller is a minter", function () {
          it("removes a minter as owner", async function () {
            const { token, owner, unknown } = await loadFixture(deployFixture);
            expect(await token.isMinter(unknown)).to.be.false;
            await token.connect(owner).addMinter(unknown);
            expect(await token.isMinter(unknown)).to.be.true;

            await token.connect(owner).removeMinter(unknown);
            expect(await token.isMinter(unknown)).to.be.false;
          });
        });

        describe("when caller is not a minter", function () {
          it("reverts", async function () {
            const { token, owner, unknown, tokenHolder } = await loadFixture(deployFixture);
            expect(await token.isMinter(unknown)).to.be.false;
            await token.connect(owner).addMinter(unknown);
            expect(await token.isMinter(unknown)).to.be.true;

            await expect(token.connect(tokenHolder).removeMinter(unknown)).to.be.revertedWithoutReason();
            expect(await token.isMinter(unknown)).to.be.true;
          });
        });
      });
    });

    describe("onlyMinter [mock for coverage]", function () {
      describe("can not call function if not minter", function () {
        it("reverts", async function () {
          const { minterMock, owner, unknown } = await loadFixture(deployFixture);
          expect(await minterMock.isMinter(unknown)).to.be.false;
          await expect(minterMock.connect(unknown).addMinter(unknown)).to.be.revertedWithoutReason();
          expect(await minterMock.isMinter(unknown)).to.be.false;

          await minterMock.connect(owner).addMinter(unknown);
          expect(await minterMock.isMinter(unknown)).to.be.true;
        });
      });
    });
  });

  // TRANSFER

  describe("transfer", function () {
    describe("when the amount is a multiple of the granularity", function () {
      describe("when the recipient is not the zero address", function () {
        describe("when the sender has enough balance", function () {
          it("transfers the requested amount", async function () {
            const { token, recipient, tokenHolder } = await loadFixture(deployFixture);
            await token.issueByPartition(partition1, tokenHolder, issuanceAmount, ZERO_BYTES32);

            const amount = issuanceAmount;
            await expect(token.connect(tokenHolder).transfer(recipient, amount)).to.changeTokenBalances(
              token,
              [tokenHolder, recipient],
              [-amount, amount]
            );
          });

          it("emits a Transfer event", async function () {
            const { token, recipient, tokenHolder } = await loadFixture(deployFixture);
            await token.issueByPartition(partition1, tokenHolder, issuanceAmount, ZERO_BYTES32);

            const amount = issuanceAmount;
            const tx = await token.connect(tokenHolder).transfer(recipient, amount);
            await expect(tx).to.emit(token, "Transfer").withArgs(tokenHolder, recipient, amount);
            await expect(tx)
              .to.emit(token, "TransferByPartition")
              .withArgs(partition1, tokenHolder, tokenHolder, recipient, amount, "0x", "0x");
          });
        });

        describe("when the sender does not have enough balance", function () {
          it("reverts", async function () {
            const { token, recipient, tokenHolder } = await loadFixture(deployFixture);
            await token.issueByPartition(partition1, tokenHolder, issuanceAmount, ZERO_BYTES32);
            await expect(token.connect(tokenHolder).transfer(recipient, issuanceAmount + 1n)).to.be.revertedWith("52");
          });
        });
      });

      describe("when the recipient is the zero address", function () {
        it("reverts", async function () {
          const { token, tokenHolder } = await loadFixture(deployFixture);
          await token.issueByPartition(partition1, tokenHolder, issuanceAmount, ZERO_BYTES32);
          await expect(token.connect(tokenHolder).transfer(ethers.ZeroAddress, issuanceAmount)).to.be.revertedWith(
            "57"
          );
        });
      });
    });

    describe("when the amount is not a multiple of the granularity", function () {
      it("reverts", async function () {
        const { owner, tokenHolder, recipient } = await loadFixture(deployFixture);
        const token = await ethers.deployContract("ERC1400", ["ERC1400Token", "DAU", 2, [], partitions], owner);
        await token.issueByPartition(partition1, tokenHolder, issuanceAmount, ZERO_BYTES32);
        await expect(token.connect(tokenHolder).transfer(recipient, 3)).to.be.revertedWith("50");
      });
    });
  });

  // TRANSFERFROM

  describe("transferFrom", function () {
    describe("when token has a whitelist", function () {
      describe("when the operator is approved", function () {
        describe("when the amount is a multiple of the granularity", function () {
          describe("when the recipient is not the zero address", function () {
            describe("when the sender has enough balance", function () {
              it("transfers the requested amount", async function () {
                const { token, recipient, tokenHolder, operator } = await loadFixture(deployFixture);
                await token.issueByPartition(partition1, tokenHolder, issuanceAmount, ZERO_BYTES32);

                const amount = 500;
                const approvedAmount = 10000;
                await token.connect(tokenHolder).approve(operator, approvedAmount);

                await expect(
                  token.connect(operator).transferFrom(tokenHolder, recipient, amount)
                ).to.changeTokenBalances(token, [tokenHolder, recipient, operator], [-amount, amount, 0]);

                expect(await token.allowance(tokenHolder, operator)).to.equal(approvedAmount - amount);
              });

              it("emits a sent + a transfer event", async function () {
                const { token, recipient, tokenHolder, operator } = await loadFixture(deployFixture);
                await token.issueByPartition(partition1, tokenHolder, issuanceAmount, ZERO_BYTES32);

                const amount = 500;
                const approvedAmount = 10000;
                await token.connect(tokenHolder).approve(operator, approvedAmount);

                const tx = await token.connect(operator).transferFrom(tokenHolder, recipient, amount);

                await expect(tx).to.emit(token, "Transfer").withArgs(tokenHolder, recipient, amount);
                await expect(tx)
                  .to.emit(token, "TransferByPartition")
                  .withArgs(partition1, operator, tokenHolder, recipient, amount, "0x", "0x");
              });
            });

            describe("when the sender does not have enough balance", function () {
              it("reverts", async function () {
                const { token, recipient, tokenHolder, operator } = await loadFixture(deployFixture);
                await token.issueByPartition(partition1, tokenHolder, issuanceAmount, ZERO_BYTES32);

                const approvedAmount = 10000;
                await token.connect(tokenHolder).approve(operator, approvedAmount);
                await expect(
                  token.connect(operator).transferFrom(tokenHolder, recipient, approvedAmount + 1)
                ).to.be.revertedWith("53");
              });
            });
          });

          describe("when the recipient is the zero address", function () {
            it("reverts", async function () {
              const { token, tokenHolder, operator } = await loadFixture(deployFixture);
              await token.issueByPartition(partition1, tokenHolder, issuanceAmount, ZERO_BYTES32);
              await token.connect(tokenHolder).approve(operator, issuanceAmount);

              await expect(
                token.connect(operator).transferFrom(tokenHolder, ethers.ZeroAddress, issuanceAmount)
              ).to.be.revertedWith("57");
            });
          });
        });

        describe("when the amount is not a multiple of the granularity", function () {
          it("reverts", async function () {
            const { owner, tokenHolder, recipient, operator } = await loadFixture(deployFixture);
            const token = await ethers.deployContract("ERC1400", ["ERC1400Token", "DAU", 2, [], partitions], owner);
            await token.issueByPartition(partition1, tokenHolder, issuanceAmount, ZERO_BYTES32);
            await token.connect(tokenHolder).approve(operator, issuanceAmount);

            await expect(token.connect(operator).transferFrom(tokenHolder, recipient, 3)).to.be.revertedWith("50");
          });
        });
      });

      describe("when the operator is not approved", function () {
        describe("when the operator is not approved but authorized", function () {
          it("transfers the requested amount", async function () {
            const { token, recipient, tokenHolder, operator } = await loadFixture(deployFixture);
            await token.issueByPartition(partition1, tokenHolder, issuanceAmount, ZERO_BYTES32);

            await token.connect(tokenHolder).authorizeOperator(operator);
            expect(await token.allowance(tokenHolder, operator)).to.equal(0);

            await expect(
              token.connect(operator).transferFrom(tokenHolder, recipient, issuanceAmount)
            ).to.changeTokenBalances(token, [tokenHolder, recipient, operator], [-issuanceAmount, issuanceAmount, 0]);
            expect(await token.allowance(tokenHolder, operator)).to.equal(0);
          });
        });

        describe("when the operator is not approved and not authorized", function () {
          it("reverts", async function () {
            const { token, recipient, tokenHolder, operator } = await loadFixture(deployFixture);
            await token.issueByPartition(partition1, tokenHolder, issuanceAmount, ZERO_BYTES32);

            await expect(
              token.connect(operator).transferFrom(tokenHolder, recipient, issuanceAmount)
            ).to.be.revertedWith("53");
          });
        });
      });
    });
  });

  // APPROVE

  describe("approve", function () {
    describe("when sender approves an operator", function () {
      it("approves the operator", async function () {
        const { token, tokenHolder, operator } = await loadFixture(deployFixture);
        await token.issueByPartition(partition1, tokenHolder, issuanceAmount, ZERO_BYTES32);

        expect(await token.allowance(tokenHolder, operator)).to.equal(0);
        await expect(token.connect(tokenHolder).approve(operator, issuanceAmount))
          .to.emit(token, "Approval")
          .withArgs(tokenHolder, operator, issuanceAmount);
        expect(await token.allowance(tokenHolder, operator)).to.equal(issuanceAmount);
      });
    });

    describe("when the operator to approve is the zero address", function () {
      it("reverts", async function () {
        const { token, tokenHolder } = await loadFixture(deployFixture);
        await token.issueByPartition(partition1, tokenHolder, issuanceAmount, ZERO_BYTES32);
        await expect(token.connect(tokenHolder).approve(ethers.ZeroAddress, issuanceAmount)).to.be.revertedWith("56");
      });
    });
  });

  // SET/GET DOCUMENT

  describe("set/getDocument", function () {
    describe("setDocument", function () {
      describe("when sender is a controller", function () {
        it("attaches the document to the token", async function () {
          const { token, controller } = await loadFixture(deployFixture);
          await expect(token.connect(controller).setDocument(documentName, documentURI, documentHash))
            .to.emit(token, "DocumentUpdated")
            .withArgs(documentName, documentURI, documentHash);

          const doc = await token.getDocument(documentName);
          expect(doc[0]).to.equal(documentURI);
          expect(doc[1]).to.equal(documentHash);
        });
      });

      describe("when sender is not a controller", function () {
        it("reverts", async function () {
          const { token, unknown } = await loadFixture(deployFixture);
          await expect(
            token.connect(unknown).setDocument(documentName, documentURI, documentHash)
          ).to.be.revertedWithoutReason();
        });
      });
    });

    describe("getDocument", function () {
      describe("when document exists", function () {
        it("returns the document", async function () {
          const { token, controller } = await loadFixture(deployFixture);
          await token.connect(controller).setDocument(documentName, documentURI, documentHash);
          const doc = await token.getDocument(documentName);
          expect(doc[0]).to.equal(documentURI);
          expect(doc[1]).to.equal(documentHash);
        });
      });

      describe("when document does not exist", function () {
        it("reverts", async function () {
          const { token } = await loadFixture(deployFixture);
          await expect(token.getDocument(documentName)).to.be.revertedWithoutReason();
        });
      });
    });
  });

  // PARTITIONSOF

  describe("partitionsOf", function () {
    describe("when tokenHolder owes no tokens", function () {
      it("returns empty list", async function () {
        const { token, tokenHolder } = await loadFixture(deployFixture);
        expect(await token.partitionsOf(tokenHolder)).to.be.empty;
      });
    });

    describe("when tokenHolder owes tokens of 1 partition", function () {
      it("returns partition", async function () {
        const { token, tokenHolder } = await loadFixture(deployFixture);
        await token.issueByPartition(partition1, tokenHolder, issuanceAmount, ZERO_BYTES32);

        const partitionsOf = await token.partitionsOf(tokenHolder);
        expect(partitionsOf.length).to.equal(1);
        expect(partitionsOf[0]).to.equal(partition1);
      });
    });

    describe("when tokenHolder owes tokens of 3 partitions", function () {
      it("returns list of 3 partitions", async function () {
        const { token, owner, tokenHolder } = await loadFixture(deployFixture);
        await issueOnMultiplePartitions(token, owner, tokenHolder, partitions, [
          issuanceAmount,
          issuanceAmount,
          issuanceAmount,
        ]);

        const partitionsOf = await token.partitionsOf(tokenHolder);
        expect(partitionsOf.length).to.equal(3);
        expect(partitionsOf[0]).to.equal(partition1);
        expect(partitionsOf[1]).to.equal(partition2);
        expect(partitionsOf[2]).to.equal(partition3);
      });
    });
  });

  // TRANSFERWITHDATA

  describe("transferWithData", function () {
    describe("when defaultPartitions have been defined", function () {
      describe("when the amount is a multiple of the granularity", function () {
        describe("when the recipient is not the zero address", function () {
          describe("when the sender has enough balance for those default partitions", function () {
            describe("when the sender has defined custom default partitions", function () {
              it("transfers the requested amount", async function () {
                const { token, owner, tokenHolder, recipient } = await loadFixture(deployFixture);
                await issueOnMultiplePartitions(token, owner, tokenHolder, partitions, [
                  issuanceAmount,
                  issuanceAmount,
                  issuanceAmount,
                ]);
                await token.connect(owner).setDefaultPartitions(reversedPartitions);

                await assertBalances(token, tokenHolder, partitions, [issuanceAmount, issuanceAmount, issuanceAmount]);

                await token
                  .connect(tokenHolder)
                  .transferWithData(recipient, (issuanceAmount * 25n) / 10n, ZERO_BYTES32); // 2.5 * issuanceAmount

                await assertBalances(token, tokenHolder, partitions, [0n, (issuanceAmount * 5n) / 10n, 0n]);
                await assertBalances(token, recipient, partitions, [
                  issuanceAmount,
                  (issuanceAmount * 5n) / 10n, // 0.5 * issuanceAmount
                  issuanceAmount,
                ]);
              });

              it("emits a sent event", async function () {
                const { token, owner, tokenHolder, recipient } = await loadFixture(deployFixture);
                await issueOnMultiplePartitions(token, owner, tokenHolder, partitions, [
                  issuanceAmount,
                  issuanceAmount,
                  issuanceAmount,
                ]);
                await token.connect(owner).setDefaultPartitions(reversedPartitions);
                const tx = await token
                  .connect(tokenHolder)
                  .transferWithData(recipient, (issuanceAmount * 25n) / 10n, ZERO_BYTES32); // 2.5 * issuanceAmount

                const receipt = await ethers.provider.getTransactionReceipt(tx.hash);
                const logs = receipt?.logs;
                expect(logs?.length).to.equal(2 * partitions.length);

                if (logs?.length === 2 * partitions.length) {
                  assertTransferEvent(
                    token,
                    [logs[0], logs[1]],
                    partition3,
                    tokenHolder,
                    tokenHolder,
                    recipient,
                    issuanceAmount,
                    ZERO_BYTES32
                  );
                  assertTransferEvent(
                    token,
                    [logs[2], logs[3]],
                    partition1,
                    tokenHolder,
                    tokenHolder,
                    recipient,
                    issuanceAmount,
                    ZERO_BYTES32
                  );
                  assertTransferEvent(
                    token,
                    [logs[4], logs[5]],
                    partition2,
                    tokenHolder,
                    tokenHolder,
                    recipient,
                    (issuanceAmount * 5n) / 10n,
                    ZERO_BYTES32
                  );
                }
              });
            });

            describe("when the sender has not defined custom default partitions", function () {
              it("transfers the requested amount", async function () {
                const { token, owner, tokenHolder, recipient } = await loadFixture(deployFixture);
                await issueOnMultiplePartitions(token, owner, tokenHolder, partitions, [
                  issuanceAmount,
                  issuanceAmount,
                  issuanceAmount,
                ]);

                await assertBalances(token, tokenHolder, partitions, [issuanceAmount, issuanceAmount, issuanceAmount]);

                await token
                  .connect(tokenHolder)
                  .transferWithData(recipient, (issuanceAmount * 25n) / 10n, ZERO_BYTES32); // 2.5 * issuanceAmount

                await assertBalances(token, tokenHolder, partitions, [0n, 0n, (issuanceAmount * 5n) / 10n]);
                await assertBalances(token, recipient, partitions, [
                  issuanceAmount,
                  issuanceAmount,
                  (issuanceAmount * 5n) / 10n, // 0.5 * issuanceAmount
                ]);
              });
            });
          });

          describe("when the sender does not have enough balance for those default partitions", function () {
            it("reverts", async function () {
              const { token, owner, tokenHolder, recipient } = await loadFixture(deployFixture);
              await issueOnMultiplePartitions(token, owner, tokenHolder, partitions, [
                issuanceAmount,
                issuanceAmount,
                issuanceAmount,
              ]);
              await token.connect(owner).setDefaultPartitions(reversedPartitions);
              await expect(
                token
                  .connect(tokenHolder)
                  .transferWithData(recipient, issuanceAmount * BigInt(partitions.length) + 1n, ZERO_BYTES32)
              ).to.be.revertedWith("52");
            });
          });
        });

        describe("when the recipient is the zero address", function () {
          it("reverts", async function () {
            const { token, owner, tokenHolder } = await loadFixture(deployFixture);
            await issueOnMultiplePartitions(token, owner, tokenHolder, partitions, [
              issuanceAmount,
              issuanceAmount,
              issuanceAmount,
            ]);
            await token.connect(owner).setDefaultPartitions(reversedPartitions);

            await assertBalances(token, tokenHolder, partitions, [issuanceAmount, issuanceAmount, issuanceAmount]);

            await expect(
              token
                .connect(tokenHolder)
                .transferWithData(ethers.ZeroAddress, (issuanceAmount * 25n) / 10n, ZERO_BYTES32)
            ).to.be.revertedWith("57");
          });
        });
      });

      describe("when the amount is not a multiple of the granularity", function () {
        it("reverts", async function () {
          const { owner, tokenHolder, recipient, controller } = await loadFixture(deployFixture);
          const token = await ethers.deployContract(
            "ERC1400",
            ["ERC1400Token", "DAU", 2, [controller], partitions],
            owner
          );
          await issueOnMultiplePartitions(token, owner, tokenHolder, partitions, [
            issuanceAmount,
            issuanceAmount,
            issuanceAmount,
          ]);
          await token.connect(owner).setDefaultPartitions(reversedPartitions);

          await assertBalances(token, tokenHolder, partitions, [issuanceAmount, issuanceAmount, issuanceAmount]);
          await expect(token.connect(tokenHolder).transferWithData(recipient, 3, ZERO_BYTES32)).to.be.revertedWith(
            "50"
          );
        });
      });
    });

    describe("when defaultPartitions have not been defined", function () {
      it("reverts", async function () {
        const { owner, tokenHolder, recipient, controller } = await loadFixture(deployFixture);
        const token = await ethers.deployContract("ERC1400", ["ERC1400Token", "DAU", 1, [controller], []], owner);
        await issueOnMultiplePartitions(token, owner, tokenHolder, partitions, [
          issuanceAmount,
          issuanceAmount,
          issuanceAmount,
        ]);
        await expect(
          token.connect(tokenHolder).transferWithData(recipient, (issuanceAmount * 25n) / 10n, ZERO_BYTES32)
        ).to.be.revertedWith("55");
      });
    });
  });

  // TRANSFERFROMWITHDATA

  describe("transferFromWithData", function () {
    describe("when the operator is approved", function () {
      describe("when the amount is a multiple of the granularity", function () {
        describe("when the recipient is not the zero address", function () {
          describe("when defaultPartitions have been defined", function () {
            describe("when the sender has enough balance for those default partitions", function () {
              it("transfers the requested amount", async function () {
                const { token, owner, operator, tokenHolder, recipient } = await loadFixture(deployFixture);
                await issueOnMultiplePartitions(token, owner, tokenHolder, partitions, [
                  issuanceAmount,
                  issuanceAmount,
                  issuanceAmount,
                ]);
                await token.connect(tokenHolder).authorizeOperator(operator);
                await token.connect(owner).setDefaultPartitions(reversedPartitions);

                await assertBalances(token, tokenHolder, partitions, [issuanceAmount, issuanceAmount, issuanceAmount]);
                await token
                  .connect(operator)
                  .transferFromWithData(tokenHolder, recipient, (issuanceAmount * 25n) / 10n, ZERO_BYTES32); // 2.5 * issuanceAmount

                await assertBalances(token, tokenHolder, partitions, [0n, (issuanceAmount * 5n) / 10n, 0n]);
                await assertBalances(token, recipient, partitions, [
                  issuanceAmount,
                  (issuanceAmount * 5n) / 10n, // 0.5 * issuanceAmount
                  issuanceAmount,
                ]);
              });

              it("emits a sent event", async function () {
                const { token, owner, operator, tokenHolder, recipient } = await loadFixture(deployFixture);
                await issueOnMultiplePartitions(token, owner, tokenHolder, partitions, [
                  issuanceAmount,
                  issuanceAmount,
                  issuanceAmount,
                ]);
                await token.connect(tokenHolder).authorizeOperator(operator);
                await token.connect(owner).setDefaultPartitions(reversedPartitions);

                const tx = await token
                  .connect(operator)
                  .transferFromWithData(tokenHolder, recipient, (issuanceAmount * 25n) / 10n, ZERO_BYTES32); // 2.5 * issuanceAmount

                const receipt = await ethers.provider.getTransactionReceipt(tx.hash);
                const logs = receipt?.logs;
                expect(logs?.length).to.equal(2 * partitions.length);

                if (logs?.length === 2 * partitions.length) {
                  assertTransferEvent(
                    token,
                    [logs[0], logs[1]],
                    partition3,
                    operator,
                    tokenHolder,
                    recipient,
                    issuanceAmount,
                    ZERO_BYTES32
                  );
                  assertTransferEvent(
                    token,
                    [logs[2], logs[3]],
                    partition1,
                    operator,
                    tokenHolder,
                    recipient,
                    issuanceAmount,
                    ZERO_BYTES32
                  );
                  assertTransferEvent(
                    token,
                    [logs[4], logs[5]],
                    partition2,
                    operator,
                    tokenHolder,
                    recipient,
                    (issuanceAmount * 5n) / 10n,
                    ZERO_BYTES32
                  );
                }
              });
            });

            describe("when the sender does not have enough balance for those default partitions", function () {
              it("reverts", async function () {
                const { token, owner, operator, tokenHolder, recipient } = await loadFixture(deployFixture);
                await issueOnMultiplePartitions(token, owner, tokenHolder, partitions, [
                  issuanceAmount,
                  issuanceAmount,
                  issuanceAmount,
                ]);
                await token.connect(tokenHolder).authorizeOperator(operator);
                await token.connect(owner).setDefaultPartitions(reversedPartitions);

                await expect(
                  token
                    .connect(operator)
                    .transferFromWithData(tokenHolder, recipient, (issuanceAmount * 35n) / 10n, ZERO_BYTES32)
                ).to.be.revertedWith("52");
              });

              it("reverts (mock contract - for 100% test coverage)", async function () {
                const { owner, controller, tokenHolder, recipient } = await loadFixture(deployFixture);
                const token = await ethers.deployContract(
                  "FakeERC1400Mock",
                  ["ERC1400Token", "DAU", 1, [controller], partitions, ethers.ZeroAddress, ethers.ZeroAddress],
                  owner
                );
                await token.connect(owner).issueByPartition(partition1, tokenHolder, issuanceAmount, ZERO_BYTES32);
                await expect(
                  token
                    .connect(controller)
                    .transferFromWithData(tokenHolder, recipient, issuanceAmount + 1n, ZERO_BYTES32)
                ).to.be.revertedWith("52");
              });
            });
          });

          describe("when defaultPartitions have not been defined", function () {
            it("reverts", async function () {
              const { token, owner, operator, tokenHolder, recipient } = await loadFixture(deployFixture);
              await issueOnMultiplePartitions(token, owner, tokenHolder, partitions, [
                issuanceAmount,
                issuanceAmount,
                issuanceAmount,
              ]);
              await token.connect(tokenHolder).authorizeOperator(operator);
              await token.connect(owner).setDefaultPartitions([]);

              await expect(
                token
                  .connect(operator)
                  .transferFromWithData(tokenHolder, recipient, (issuanceAmount * 25n) / 10n, ZERO_BYTES32)
              ).to.be.revertedWith("55");
            });
          });
        });

        describe("when the recipient is the zero address", function () {
          it("reverts", async function () {
            const { token, owner, operator, tokenHolder } = await loadFixture(deployFixture);
            await issueOnMultiplePartitions(token, owner, tokenHolder, partitions, [
              issuanceAmount,
              issuanceAmount,
              issuanceAmount,
            ]);
            await token.connect(tokenHolder).authorizeOperator(operator);
            await token.connect(owner).setDefaultPartitions(reversedPartitions);

            await assertBalances(token, tokenHolder, partitions, [issuanceAmount, issuanceAmount, issuanceAmount]);

            await expect(
              token
                .connect(operator)
                .transferFromWithData(tokenHolder, ethers.ZeroAddress, (issuanceAmount * 25n) / 10n, ZERO_BYTES32)
            ).to.be.revertedWith("57");
          });
        });
      });

      describe("when the amount is not a multiple of the granularity", function () {
        it("reverts", async function () {
          const { owner, operator, tokenHolder, recipient, controller } = await loadFixture(deployFixture);

          const token = await ethers.deployContract("ERC1400", ["ERC1400Token", "DAU", 2, [controller], partitions]);
          await issueOnMultiplePartitions(token, owner, tokenHolder, partitions, [
            issuanceAmount,
            issuanceAmount,
            issuanceAmount,
          ]);
          await token.connect(tokenHolder).authorizeOperator(operator);
          await token.connect(owner).setDefaultPartitions(reversedPartitions);

          await assertBalances(token, tokenHolder, partitions, [issuanceAmount, issuanceAmount, issuanceAmount]);
          await expect(
            token.connect(operator).transferFromWithData(tokenHolder, recipient, 3, ZERO_BYTES32)
          ).to.be.revertedWith("50");
        });
      });
    });

    describe("when the operator is not approved", function () {
      it("reverts", async function () {
        const { token, owner, operator, tokenHolder, recipient } = await loadFixture(deployFixture);
        await issueOnMultiplePartitions(token, owner, tokenHolder, partitions, [
          issuanceAmount,
          issuanceAmount,
          issuanceAmount,
        ]);
        await token.connect(owner).setDefaultPartitions(reversedPartitions);
        await expect(
          token
            .connect(operator)
            .transferFromWithData(tokenHolder, recipient, (issuanceAmount * 25n) / 10n, ZERO_BYTES32)
        ).to.be.revertedWith("53");
      });
    });
  });

  // TRANSFERBYPARTITION

  describe("transferByPartition", function () {
    describe("when the sender has enough balance for this partition", function () {
      describe("when the transfer amount is not equal to 0", function () {
        it("transfers the requested amount", async function () {
          const transferAmount = 300n;

          const { token, owner, tokenHolder, recipient } = await loadFixture(deployFixture);
          await token.connect(owner).issueByPartition(partition1, tokenHolder, issuanceAmount, ZERO_BYTES32);

          await assertBalanceOf(token, tokenHolder, partition1, issuanceAmount);
          await assertBalanceOf(token, recipient, partition1, 0n);

          await token.connect(tokenHolder).transferByPartition(partition1, recipient, transferAmount, ZERO_BYTES32);
          await token.connect(tokenHolder).transferByPartition(partition1, recipient, 0, ZERO_BYTES32);

          await assertBalanceOf(token, tokenHolder, partition1, issuanceAmount - transferAmount);
          await assertBalanceOf(token, recipient, partition1, transferAmount);
        });

        it("emits a TransferByPartition event", async function () {
          const transferAmount = 300n;

          const { token, owner, tokenHolder, recipient } = await loadFixture(deployFixture);
          await token.connect(owner).issueByPartition(partition1, tokenHolder, issuanceAmount, ZERO_BYTES32);

          const tx = await token
            .connect(tokenHolder)
            .transferByPartition(partition1, recipient, transferAmount, ZERO_BYTES32);
          const receipt = await ethers.provider.getTransactionReceipt(tx.hash);
          const logs = receipt?.logs;
          expect(logs?.length).to.equal(2);

          if (logs && logs?.length > 0) {
            assertTransferEvent(
              token,
              logs,
              partition1,
              tokenHolder,
              tokenHolder,
              recipient,
              transferAmount,
              ZERO_BYTES32
            );
          }
        });
      });

      describe("when the transfer amount is equal to 0", function () {
        it("reverts", async function () {
          const { token, owner, tokenHolder, recipient } = await loadFixture(deployFixture);
          await token.connect(owner).issueByPartition(partition1, tokenHolder, issuanceAmount, ZERO_BYTES32);
          await expect(
            token.connect(tokenHolder).transferByPartition(partition2, recipient, 0, ZERO_BYTES32)
          ).to.be.revertedWith("50");
        });
      });
    });

    describe("when the sender does not have enough balance for this partition", function () {
      it("reverts", async function () {
        const { token, owner, tokenHolder, recipient } = await loadFixture(deployFixture);
        await token.connect(owner).issueByPartition(partition1, tokenHolder, issuanceAmount, ZERO_BYTES32);
        await expect(
          token.connect(tokenHolder).transferByPartition(partition1, recipient, issuanceAmount + 1n, ZERO_BYTES32)
        ).to.be.revertedWith("52");
      });
    });
  });

  // OPERATORTRANSFERBYPARTITION

  describe("operatorTransferByPartition", function () {
    describe("when the sender is approved for this partition", function () {
      describe("when approved amount is sufficient", function () {
        it("transfers the requested amount", async function () {
          const transferAmount = 300n;

          const { token, owner, tokenHolder, recipient, operator } = await loadFixture(deployFixture);
          await token.connect(owner).issueByPartition(partition1, tokenHolder, issuanceAmount, ZERO_BYTES32);

          await assertBalanceOf(token, tokenHolder, partition1, issuanceAmount);
          await assertBalanceOf(token, recipient, partition1, 0n);
          expect(await token.allowanceByPartition(partition1, tokenHolder, operator)).to.equal(0n);

          const approvedAmount = 400n;
          await token.connect(tokenHolder).approveByPartition(partition1, operator, approvedAmount);
          expect(await token.allowanceByPartition(partition1, tokenHolder, operator)).to.equal(approvedAmount);
          await token
            .connect(operator)
            .operatorTransferByPartition(partition1, tokenHolder, recipient, transferAmount, ZERO_BYTE, ZERO_BYTES32);

          await assertBalanceOf(token, tokenHolder, partition1, issuanceAmount - transferAmount);
          await assertBalanceOf(token, recipient, partition1, transferAmount);
          expect(await token.allowanceByPartition(partition1, tokenHolder, operator)).to.equal(
            approvedAmount - transferAmount
          );
        });
      });

      describe("when approved amount is not sufficient", function () {
        it("reverts", async function () {
          const { token, owner, tokenHolder, recipient, operator } = await loadFixture(deployFixture);
          await token.connect(owner).issueByPartition(partition1, tokenHolder, issuanceAmount, ZERO_BYTES32);

          await assertBalanceOf(token, tokenHolder, partition1, issuanceAmount);
          await assertBalanceOf(token, recipient, partition1, 0n);
          expect(await token.allowanceByPartition(partition1, tokenHolder, operator)).to.equal(0n);

          const approvedAmount = 200n;
          await token.connect(tokenHolder).approveByPartition(partition1, operator, approvedAmount);
          expect(await token.allowanceByPartition(partition1, tokenHolder, operator)).to.equal(approvedAmount);
          await expect(
            token
              .connect(operator)
              .operatorTransferByPartition(
                partition1,
                tokenHolder,
                recipient,
                approvedAmount + 1n,
                ZERO_BYTE,
                ZERO_BYTES32
              )
          ).to.be.revertedWith("53");
        });
      });
    });

    describe("when the sender is an operator for this partition", function () {
      describe("when the sender has enough balance for this partition", function () {
        describe("when partition does not change", function () {
          it("transfers the requested amount", async function () {
            const { token, owner, tokenHolder, recipient, operator } = await loadFixture(deployFixture);
            await token.connect(owner).issueByPartition(partition1, tokenHolder, issuanceAmount, ZERO_BYTES32);

            await assertBalanceOf(token, tokenHolder, partition1, issuanceAmount);
            await assertBalanceOf(token, recipient, partition1, 0n);

            await token.connect(tokenHolder).authorizeOperatorByPartition(partition1, operator);

            const transferAmount = 300n;
            await token
              .connect(operator)
              .operatorTransferByPartition(partition1, tokenHolder, recipient, transferAmount, ZERO_BYTE, ZERO_BYTES32);

            await assertBalanceOf(token, tokenHolder, partition1, issuanceAmount - transferAmount);
            await assertBalanceOf(token, recipient, partition1, transferAmount);
          });

          it("transfers the requested amount with attached data (without changePartition flag)", async function () {
            const { token, owner, tokenHolder, recipient, operator } = await loadFixture(deployFixture);
            await token.connect(owner).issueByPartition(partition1, tokenHolder, issuanceAmount, ZERO_BYTES32);

            await assertBalanceOf(token, tokenHolder, partition1, issuanceAmount);
            await assertBalanceOf(token, recipient, partition1, 0n);

            await token.connect(tokenHolder).authorizeOperatorByPartition(partition1, operator);

            const transferAmount = 300n;
            await token
              .connect(operator)
              .operatorTransferByPartition(
                partition1,
                tokenHolder,
                recipient,
                transferAmount,
                doNotChangePartition,
                ZERO_BYTES32
              );

            await assertBalanceOf(token, tokenHolder, partition1, issuanceAmount - transferAmount);
            await assertBalanceOf(token, recipient, partition1, transferAmount);
          });

          it("emits a TransferByPartition event", async function () {
            const { token, owner, tokenHolder, recipient, operator } = await loadFixture(deployFixture);
            await token.connect(owner).issueByPartition(partition1, tokenHolder, issuanceAmount, ZERO_BYTES32);
            await token.connect(tokenHolder).authorizeOperatorByPartition(partition1, operator);

            const transferAmount = 300n;
            const tx = await token
              .connect(operator)
              .operatorTransferByPartition(partition1, tokenHolder, recipient, transferAmount, ZERO_BYTE, ZERO_BYTES32);
            const receipt = await ethers.provider.getTransactionReceipt(tx.hash);
            const logs = receipt?.logs;

            expect(logs?.length).to.equal(2);
            if (logs && logs?.length > 0) {
              assertTransferEvent(
                token,
                logs,
                partition1,
                operator,
                tokenHolder,
                recipient,
                transferAmount,
                ZERO_BYTE,
                ZERO_BYTES32
              );
            }
          });
        });

        describe("when partition changes", function () {
          it("transfers the requested amount", async function () {
            const { token, owner, tokenHolder, recipient, operator } = await loadFixture(deployFixture);
            await token.connect(owner).issueByPartition(partition1, tokenHolder, issuanceAmount, ZERO_BYTES32);

            await assertBalanceOf(token, tokenHolder, partition1, issuanceAmount);
            await assertBalanceOf(token, recipient, partition2, 0n);

            await token.connect(tokenHolder).authorizeOperatorByPartition(partition1, operator);

            const transferAmount = 300n;
            await token
              .connect(operator)
              .operatorTransferByPartition(
                partition1,
                tokenHolder,
                recipient,
                transferAmount,
                changeToPartition2,
                ZERO_BYTES32
              );

            await assertBalanceOf(token, tokenHolder, partition1, issuanceAmount - transferAmount);
            await assertBalanceOf(token, recipient, partition2, transferAmount);
          });

          it("converts the requested amount", async function () {
            const { token, owner, tokenHolder, operator } = await loadFixture(deployFixture);
            await token.connect(owner).issueByPartition(partition1, tokenHolder, issuanceAmount, ZERO_BYTES32);

            await assertBalance(token, tokenHolder, issuanceAmount);
            await assertBalanceOfByPartition(token, tokenHolder, partition1, issuanceAmount);
            await assertBalanceOfByPartition(token, tokenHolder, partition2, 0n);

            await token.connect(tokenHolder).authorizeOperatorByPartition(partition1, operator);

            const transferAmount = 300n;
            await token
              .connect(operator)
              .operatorTransferByPartition(
                partition1,
                tokenHolder,
                tokenHolder,
                transferAmount,
                changeToPartition2,
                ZERO_BYTES32
              );

            await assertBalance(token, tokenHolder, issuanceAmount);
            await assertBalanceOfByPartition(token, tokenHolder, partition1, issuanceAmount - transferAmount);
            await assertBalanceOfByPartition(token, tokenHolder, partition2, transferAmount);
          });

          it("emits a changedPartition event", async function () {
            const { token, owner, tokenHolder, recipient, operator } = await loadFixture(deployFixture);
            await token.connect(owner).issueByPartition(partition1, tokenHolder, issuanceAmount, ZERO_BYTES32);

            await token.connect(tokenHolder).authorizeOperatorByPartition(partition1, operator);

            const transferAmount = 300n;
            const tx = await token
              .connect(operator)
              .operatorTransferByPartition(
                partition1,
                tokenHolder,
                recipient,
                transferAmount,
                changeToPartition2,
                ZERO_BYTES32
              );
            const receipt = await ethers.provider.getTransactionReceipt(tx.hash);
            const logs = receipt?.logs;

            expect(logs?.length).to.equal(3);
            if (logs && logs?.length > 0) {
              assertTransferEvent(
                token,
                [logs[0], logs[1]],
                partition1,
                operator,
                tokenHolder,
                recipient,
                transferAmount,
                changeToPartition2,
                ZERO_BYTES32
              );

              const event = token.interface.decodeEventLog("ChangedPartition", logs[2].data, logs[2].topics);
              expect(event.fromPartition).to.equal(partition1);
              expect(event.toPartition).to.equal(partition2);
              expect(event.value).to.equal(transferAmount);
            }
          });
        });
      });

      describe("when the sender does not have enough balance for this partition", function () {
        it("reverts", async function () {
          const { token, owner, tokenHolder, recipient, operator } = await loadFixture(deployFixture);
          await token.connect(owner).issueByPartition(partition1, tokenHolder, issuanceAmount, ZERO_BYTES32);
          await token.connect(tokenHolder).authorizeOperatorByPartition(partition1, operator);

          await expect(
            token
              .connect(operator)
              .operatorTransferByPartition(
                partition1,
                tokenHolder,
                recipient,
                issuanceAmount + 1n,
                ZERO_BYTE,
                ZERO_BYTES32
              )
          ).to.revertedWith("52");
        });
      });
    });

    describe("when the sender is a global operator", function () {
      it("redeems the requested amount", async function () {
        const { token, owner, tokenHolder, recipient, operator } = await loadFixture(deployFixture);
        await token.connect(owner).issueByPartition(partition1, tokenHolder, issuanceAmount, ZERO_BYTES32);

        await assertBalanceOf(token, tokenHolder, partition1, issuanceAmount);
        await assertBalanceOf(token, recipient, partition1, 0n);

        await token.connect(tokenHolder).authorizeOperator(operator, { from: tokenHolder });

        const transferAmount = 300n;
        await token
          .connect(operator)
          .operatorTransferByPartition(partition1, tokenHolder, recipient, transferAmount, ZERO_BYTE, ZERO_BYTES32);

        await assertBalanceOf(token, tokenHolder, partition1, issuanceAmount - transferAmount);
        await assertBalanceOf(token, recipient, partition1, transferAmount);
      });
    });

    describe("when the sender is neither an operator, nor approved", function () {
      it("reverts", async function () {
        const { token, owner, tokenHolder, recipient, operator } = await loadFixture(deployFixture);
        await token.connect(owner).issueByPartition(partition1, tokenHolder, issuanceAmount, ZERO_BYTES32);

        await expect(
          token
            .connect(operator)
            .operatorTransferByPartition(partition1, tokenHolder, recipient, 300n, ZERO_BYTE, ZERO_BYTES32)
        ).to.be.revertedWith("53");
      });
    });
  });

  // AUTHORIZEOPERATOR

  describe("authorizeOperator", function () {
    describe("when sender authorizes an operator", function () {
      it("authorizes the operator", async function () {
        const { token, tokenHolder, operator } = await loadFixture(deployFixture);

        expect(await token.isOperator(operator, tokenHolder)).to.be.false;
        const tx = await token.connect(tokenHolder).authorizeOperator(operator);

        expect(await token.isOperator(operator, tokenHolder)).to.be.true;
        await expect(tx).to.emit(token, "AuthorizedOperator").withArgs(operator, tokenHolder);
      });
    });

    describe("when sender authorizes himself", function () {
      it("reverts", async function () {
        const { token, tokenHolder } = await loadFixture(deployFixture);
        await expect(token.connect(tokenHolder).authorizeOperator(tokenHolder)).to.be.revertedWithoutReason();
      });
    });
  });

  // REVOKEOPERATOR

  describe("revokeOperator", function () {
    describe("when sender revokes an operator", function () {
      it("revokes the operator (when operator is not the controller)", async function () {
        const { token, tokenHolder, operator } = await loadFixture(deployFixture);

        expect(await token.isOperator(operator, tokenHolder)).to.be.false;
        await token.connect(tokenHolder).authorizeOperator(operator);
        expect(await token.isOperator(operator, tokenHolder)).to.be.true;

        const tx = await token.connect(tokenHolder).revokeOperator(operator);
        expect(await token.isOperator(operator, tokenHolder)).to.be.false;
        await expect(tx).to.emit(token, "RevokedOperator").withArgs(operator, tokenHolder);
      });
    });

    describe("when sender revokes himself", function () {
      it("reverts", async function () {
        const { token, tokenHolder } = await loadFixture(deployFixture);
        await expect(token.connect(tokenHolder).revokeOperator(tokenHolder)).to.be.revertedWithoutReason();
      });
    });
  });

  // AUTHORIZE OPERATOR BY PARTITION

  describe("authorizeOperatorByPartition", function () {
    it("authorizes the operator", async function () {
      const { token, tokenHolder, operator } = await loadFixture(deployFixture);

      expect(await token.isOperatorForPartition(partition1, operator, tokenHolder)).to.be.false;
      const tx = await token.connect(tokenHolder).authorizeOperatorByPartition(partition1, operator);
      expect(await token.isOperatorForPartition(partition1, operator, tokenHolder)).to.be.true;
      await expect(tx).to.emit(token, "AuthorizedOperatorByPartition").withArgs(partition1, operator, tokenHolder);
    });
  });

  // REVOKEOPERATORBYPARTITION

  describe("revokeOperatorByPartition", function () {
    describe("when operator is not controller", function () {
      it("revokes the operator", async function () {
        const { token, tokenHolder, operator } = await loadFixture(deployFixture);

        await token.connect(tokenHolder).authorizeOperatorByPartition(partition1, operator);
        expect(await token.isOperatorForPartition(partition1, operator, tokenHolder)).to.be.true;

        const tx = await token.connect(tokenHolder).revokeOperatorByPartition(partition1, operator);
        expect(await token.isOperatorForPartition(partition1, operator, tokenHolder)).to.be.false;
        await expect(tx).to.emit(token, "RevokedOperatorByPartition").withArgs(partition1, operator, tokenHolder);
      });
    });
  });

  // ISOPERATOR

  describe("isOperator", function () {
    it("when operator is tokenHolder", async function () {
      const { token, tokenHolder } = await loadFixture(deployFixture);
      expect(await token.isOperator(tokenHolder, tokenHolder)).to.be.true;
    });

    it("when operator is authorized by tokenHolder", async function () {
      const { token, tokenHolder, operator } = await loadFixture(deployFixture);
      await token.connect(tokenHolder).authorizeOperator(operator);
      expect(await token.isOperator(operator, tokenHolder)).to.be.true;
    });

    it("when is a revoked operator", async function () {
      const { token, tokenHolder, operator } = await loadFixture(deployFixture);
      await token.connect(tokenHolder).authorizeOperator(operator);
      await token.connect(tokenHolder).revokeOperator(operator);
      expect(await token.isOperator(operator, tokenHolder)).to.be.false;
    });

    it("when is a controller and token is controllable", async function () {
      const { token, tokenHolder, controller } = await loadFixture(deployFixture);
      expect(await token.isOperator(controller, tokenHolder)).to.be.true;
    });

    it("when is a controller and token is not controllable", async function () {
      const { token, owner, tokenHolder, controller } = await loadFixture(deployFixture);
      await token.connect(owner).renounceControl();
      expect(await token.isOperator(controller, tokenHolder)).to.be.false;
    });
  });

  // ISOPERATORFORPARTITION

  describe("isOperatorForPartition", function () {
    it("when operator is tokenHolder", async function () {
      const { token, tokenHolder } = await loadFixture(deployFixture);
      expect(await token.isOperatorForPartition(partition1, tokenHolder, tokenHolder)).to.be.true;
    });

    it("when operator is authorized by tokenHolder", async function () {
      const { token, tokenHolder, operator } = await loadFixture(deployFixture);

      await token.connect(tokenHolder).authorizeOperatorByPartition(partition1, operator);
      expect(await token.isOperatorForPartition(partition1, operator, tokenHolder)).to.be.true;
    });

    it("when is a revoked operator", async function () {
      const { token, tokenHolder, operator } = await loadFixture(deployFixture);

      await token.connect(tokenHolder).authorizeOperatorByPartition(partition1, operator);
      await token.connect(tokenHolder).revokeOperatorByPartition(partition1, operator);
      expect(await token.isOperatorForPartition(partition1, operator, tokenHolder)).to.be.false;
    });

    it("when is a controller and token is controllable", async function () {
      const { token, tokenHolder, controller } = await loadFixture(deployFixture);
      expect(await token.isOperatorForPartition(partition1, controller, tokenHolder)).to.be.true;
    });

    it("when is a controller and token is not controllable", async function () {
      const { token, owner, tokenHolder, controller } = await loadFixture(deployFixture);
      await token.connect(owner).renounceControl();
      expect(await token.isOperatorForPartition(partition1, controller, tokenHolder)).to.be.false;
    });
  });

  // ISSUE

  describe("issue", function () {
    describe("when sender is the issuer", function () {
      describe("when token is issuable", function () {
        describe("when default partitions have been defined", function () {
          describe("when the amount is a multiple of the granularity", function () {
            describe("when the recipient is not the zero address", function () {
              it("issues the requested amount", async function () {
                const { token, owner, tokenHolder } = await loadFixture(deployFixture);

                await token.connect(owner).issue(tokenHolder, issuanceAmount, ZERO_BYTES32);
                await assertTotalSupply(token, issuanceAmount);
                await assertBalanceOf(token, tokenHolder, partition1, issuanceAmount);
              });

              it("issues twice the requested amount", async function () {
                const { token, owner, tokenHolder } = await loadFixture(deployFixture);

                await token.connect(owner).issue(tokenHolder, issuanceAmount, ZERO_BYTES32);
                await token.connect(owner).issue(tokenHolder, issuanceAmount, ZERO_BYTES32);

                await assertTotalSupply(token, 2n * issuanceAmount);
                await assertBalanceOf(token, tokenHolder, partition1, 2n * issuanceAmount);
              });

              it("emits a issuedByPartition event", async function () {
                const { token, owner, tokenHolder } = await loadFixture(deployFixture);
                const tx = await token.connect(owner).issue(tokenHolder, issuanceAmount, ZERO_BYTES32);

                await expect(tx).to.emit(token, "Issued").withArgs(owner, tokenHolder, issuanceAmount, ZERO_BYTES32);

                await expect(tx).to.emit(token, "Transfer").withArgs(ethers.ZeroAddress, tokenHolder, issuanceAmount);

                await expect(tx)
                  .to.emit(token, "IssuedByPartition")
                  .withArgs(partition1, owner, tokenHolder, issuanceAmount, ZERO_BYTES32, ZERO_BYTE);
              });
            });

            describe("when the recipient is not the zero address", function () {
              it("issues the requested amount", async function () {
                const { token, owner } = await loadFixture(deployFixture);
                await expect(
                  token.connect(owner).issue(ethers.ZeroAddress, issuanceAmount, ZERO_BYTES32)
                ).to.be.revertedWith("57");
              });
            });
          });

          describe("when the amount is not a multiple of the granularity", function () {
            it("issues the requested amount", async function () {
              const { owner, tokenHolder, controller } = await loadFixture(deployFixture);
              const token = await ethers.deployContract("ERC1400", [
                "ERC1400Token",
                "DAU",
                2,
                [controller],
                partitions,
              ]);
              await expect(token.connect(owner).issue(tokenHolder, 1, ZERO_BYTES32)).to.be.revertedWith("50");
            });
          });
        });

        describe("when default partitions have not been defined", function () {
          it("reverts", async function () {
            const { owner, tokenHolder, controller } = await loadFixture(deployFixture);
            const token = await ethers.deployContract("ERC1400", ["ERC1400Token", "DAU", 1, [controller], []]);
            await expect(token.connect(owner).issue(tokenHolder, issuanceAmount, ZERO_BYTES32)).to.be.revertedWith(
              "55"
            );
          });
        });
      });

      describe("when token is not issuable", function () {
        it("reverts", async function () {
          const { token, owner, tokenHolder } = await loadFixture(deployFixture);

          expect(await token.isIssuable()).to.be.true;
          await token.connect(owner).renounceIssuance();
          expect(await token.isIssuable()).to.be.false;
          await expect(token.connect(owner).issue(tokenHolder, issuanceAmount, ZERO_BYTES32)).to.be.revertedWith("55");
        });
      });
    });

    describe("when sender is not the issuer", function () {
      it("reverts", async function () {
        const { token, unknown, tokenHolder } = await loadFixture(deployFixture);
        await expect(
          token.connect(unknown).issue(tokenHolder, issuanceAmount, ZERO_BYTES32)
        ).to.be.revertedWithoutReason();
      });
    });
  });

  // ISSUEBYPARTITION

  describe("issueByPartition", function () {
    describe("when sender is the issuer", function () {
      describe("when token is issuable", function () {
        it("issues the requested amount", async function () {
          const { token, owner, tokenHolder } = await loadFixture(deployFixture);
          await token.connect(owner).issueByPartition(partition1, tokenHolder, issuanceAmount, ZERO_BYTES32);

          await assertTotalSupply(token, issuanceAmount);
          await assertBalanceOf(token, tokenHolder, partition1, issuanceAmount);
        });

        it("issues twice the requested amount", async function () {
          const { token, owner, tokenHolder } = await loadFixture(deployFixture);
          await token.connect(owner).issueByPartition(partition1, tokenHolder, issuanceAmount, ZERO_BYTES32);
          await token.connect(owner).issueByPartition(partition1, tokenHolder, issuanceAmount, ZERO_BYTES32);

          await assertTotalSupply(token, 2n * issuanceAmount);
          await assertBalanceOf(token, tokenHolder, partition1, 2n * issuanceAmount);
        });

        it("emits a issuedByPartition event", async function () {
          const { token, owner, tokenHolder } = await loadFixture(deployFixture);
          const tx = await token.connect(owner).issueByPartition(partition1, tokenHolder, issuanceAmount, ZERO_BYTES32);

          await expect(tx).to.emit(token, "Issued").withArgs(owner, tokenHolder, issuanceAmount, ZERO_BYTES32);
          await expect(tx).to.emit(token, "Transfer").withArgs(ethers.ZeroAddress, tokenHolder, issuanceAmount);
          await expect(tx)
            .to.emit(token, "IssuedByPartition")
            .withArgs(partition1, owner, tokenHolder, issuanceAmount, ZERO_BYTES32, ZERO_BYTE);
        });
      });

      describe("when token is not issuable", function () {
        it("reverts", async function () {
          const { token, owner, tokenHolder } = await loadFixture(deployFixture);

          expect(await token.isIssuable()).to.be.true;
          await token.connect(owner).renounceIssuance();
          expect(await token.isIssuable()).to.be.false;
          await expect(
            token.connect(owner).issueByPartition(partition1, tokenHolder, issuanceAmount, ZERO_BYTES32)
          ).to.be.revertedWith("55");
        });
      });
    });

    describe("when sender is not the issuer", function () {
      it("reverts", async function () {
        const { token, unknown, tokenHolder } = await loadFixture(deployFixture);
        await expect(
          token.connect(unknown).issueByPartition(partition1, tokenHolder, issuanceAmount, ZERO_BYTES32)
        ).to.be.revertedWithoutReason();
      });
    });
  });

  // REDEEM

  describe("redeem", function () {
    describe("when defaultPartitions have been defined", function () {
      describe("when the amount is a multiple of the granularity", function () {
        describe("when the sender has enough balance for those default partitions", function () {
          it("redeeems the requested amount", async function () {
            const { token, owner, tokenHolder } = await loadFixture(deployFixture);
            await issueOnMultiplePartitions(token, owner, tokenHolder, partitions, [
              issuanceAmount,
              issuanceAmount,
              issuanceAmount,
            ]);

            await token.connect(owner).setDefaultPartitions(reversedPartitions);
            await assertBalances(token, tokenHolder, partitions, [issuanceAmount, issuanceAmount, issuanceAmount]);

            await token.connect(tokenHolder).redeem((25n * issuanceAmount) / 10n, ZERO_BYTES32);

            await assertBalances(token, tokenHolder, partitions, [0n, issuanceAmount / 2n, 0n]);
          });

          it("emits a redeemedByPartition events", async function () {
            const { token, owner, tokenHolder } = await loadFixture(deployFixture);
            await issueOnMultiplePartitions(token, owner, tokenHolder, partitions, [
              issuanceAmount,
              issuanceAmount,
              issuanceAmount,
            ]);

            await token.connect(owner).setDefaultPartitions(reversedPartitions);
            const tx = await token.connect(tokenHolder).redeem((25n * issuanceAmount) / 10n, ZERO_BYTES32);

            const receipt = await ethers.provider.getTransactionReceipt(tx.hash);
            const logs = receipt?.logs;
            expect(logs?.length).to.equal(3 * partitions.length);

            if (logs?.length === 3 * partitions.length) {
              assertBurnEvent(
                token,
                [logs[0], logs[1], logs[2]],
                partition3,
                tokenHolder,
                tokenHolder,
                issuanceAmount,
                ZERO_BYTES32
              );
              assertBurnEvent(
                token,
                [logs[3], logs[4], logs[5]],
                partition1,
                tokenHolder,
                tokenHolder,
                issuanceAmount,
                ZERO_BYTES32
              );
              assertBurnEvent(
                token,
                [logs[6], logs[7], logs[8]],
                partition2,
                tokenHolder,
                tokenHolder,
                issuanceAmount / 2n,
                ZERO_BYTES32
              );
            }
          });
        });

        describe("when the sender does not have enough balance for those default partitions", function () {
          it("reverts", async function () {
            const { token, owner, tokenHolder } = await loadFixture(deployFixture);
            await issueOnMultiplePartitions(token, owner, tokenHolder, partitions, [
              issuanceAmount,
              issuanceAmount,
              issuanceAmount,
            ]);
            await token.connect(owner).setDefaultPartitions(reversedPartitions);

            await expect(token.connect(tokenHolder).redeem(3n * issuanceAmount + 1n, ZERO_BYTES32)).to.be.revertedWith(
              "52"
            );
          });
        });
      });

      describe("when the amount is not a multiple of the granularity", function () {
        it("reverts", async function () {
          const { owner, tokenHolder, controller } = await loadFixture(deployFixture);

          const token = await ethers.deployContract("ERC1400", ["ERC1400Token", "DAU", 2, [controller], partitions]);
          await issueOnMultiplePartitions(token, owner, tokenHolder, partitions, [
            issuanceAmount,
            issuanceAmount,
            issuanceAmount,
          ]);
          await token.connect(owner).setDefaultPartitions(reversedPartitions);

          await assertBalances(token, tokenHolder, partitions, [issuanceAmount, issuanceAmount, issuanceAmount]);
          await expect(token.connect(tokenHolder).redeem(3, ZERO_BYTES32)).to.be.revertedWith("50");
        });
      });
    });

    describe("when defaultPartitions have not been defined", function () {
      it("reverts", async function () {
        const { token, owner, tokenHolder } = await loadFixture(deployFixture);
        await issueOnMultiplePartitions(token, owner, tokenHolder, partitions, [
          issuanceAmount,
          issuanceAmount,
          issuanceAmount,
        ]);
        await token.connect(owner).setDefaultPartitions([]);
        await expect(token.connect(tokenHolder).redeem(1, ZERO_BYTES32)).to.be.revertedWith("55");
      });
    });
  });

  // REDEEMFROM

  describe("redeemFrom", function () {
    describe("when the operator is approved", function () {
      describe("when defaultPartitions have been defined", function () {
        describe("when the sender has enough balance for those default partitions", function () {
          describe("when the amount is a multiple of the granularity", function () {
            describe("when the redeemer is not the zero address", function () {
              it("redeems the requested amount", async function () {
                const { token, owner, tokenHolder, operator } = await loadFixture(deployFixture);
                await issueOnMultiplePartitions(token, owner, tokenHolder, partitions, [
                  issuanceAmount,
                  issuanceAmount,
                  issuanceAmount,
                ]);
                await token.connect(tokenHolder).authorizeOperator(operator);
                await token.connect(owner).setDefaultPartitions(reversedPartitions);

                await assertBalances(token, tokenHolder, partitions, [issuanceAmount, issuanceAmount, issuanceAmount]);

                await token.connect(operator).redeemFrom(tokenHolder, (25n * issuanceAmount) / 10n, ZERO_BYTES32);

                await assertBalances(token, tokenHolder, partitions, [0n, issuanceAmount / 2n, 0n]);
              });

              it("emits redeemedByPartition events", async function () {
                const { token, owner, tokenHolder, operator } = await loadFixture(deployFixture);
                await issueOnMultiplePartitions(token, owner, tokenHolder, partitions, [
                  issuanceAmount,
                  issuanceAmount,
                  issuanceAmount,
                ]);
                await token.connect(tokenHolder).authorizeOperator(operator);
                await token.connect(owner).setDefaultPartitions(reversedPartitions);

                const tx = await token
                  .connect(operator)
                  .redeemFrom(tokenHolder, (25n * issuanceAmount) / 10n, ZERO_BYTES32);

                const receipt = await ethers.provider.getTransactionReceipt(tx.hash);
                const logs = receipt?.logs;
                expect(logs?.length).to.equal(3 * partitions.length);

                if (logs?.length === 3 * partitions.length) {
                  assertBurnEvent(
                    token,
                    [logs[0], logs[1], logs[2]],
                    partition3,
                    operator,
                    tokenHolder,
                    issuanceAmount,
                    ZERO_BYTES32
                  );
                  assertBurnEvent(
                    token,
                    [logs[3], logs[4], logs[5]],
                    partition1,
                    operator,
                    tokenHolder,
                    issuanceAmount,
                    ZERO_BYTES32
                  );
                  assertBurnEvent(
                    token,
                    [logs[6], logs[7], logs[8]],
                    partition2,
                    operator,
                    tokenHolder,
                    issuanceAmount / 2n,
                    ZERO_BYTES32
                  );
                }
              });
            });

            describe("when the redeemer is the zero address", function () {
              it("reverts", async function () {
                const { token, owner, tokenHolder, operator, controller } = await loadFixture(deployFixture);
                await issueOnMultiplePartitions(token, owner, tokenHolder, partitions, [
                  issuanceAmount,
                  issuanceAmount,
                  issuanceAmount,
                ]);
                await token.connect(tokenHolder).authorizeOperator(operator);
                await token.connect(owner).setDefaultPartitions(reversedPartitions);

                await assertBalances(token, tokenHolder, partitions, [issuanceAmount, issuanceAmount, issuanceAmount]);

                await expect(
                  token.connect(controller).redeemFrom(ethers.ZeroAddress, (25n * issuanceAmount) / 10n, ZERO_BYTES32)
                ).to.be.revertedWith("50");
              });

              it("reverts (mock contract - for 100% test coverage)", async function () {
                const { owner, tokenHolder, controller } = await loadFixture(deployFixture);
                const token = await ethers.deployContract(
                  "FakeERC1400Mock",
                  ["ERC1400Token", "DAU", 1, [controller], partitions, ethers.ZeroAddress, ethers.ZeroAddress],
                  owner
                );

                await issueOnMultiplePartitions(token, owner, tokenHolder, partitions, [
                  issuanceAmount,
                  issuanceAmount,
                  issuanceAmount,
                ]);
                await token.connect(owner).setDefaultPartitions(reversedPartitions);

                await expect(
                  token.connect(controller).redeemFrom(ethers.ZeroAddress, (25n * issuanceAmount) / 10n, ZERO_BYTES32)
                ).to.be.revertedWith("56");
              });
            });
          });

          describe("when the amount is not a multiple of the granularity", function () {
            it("reverts", async function () {
              const { owner, tokenHolder, controller, operator } = await loadFixture(deployFixture);
              const token = await ethers.deployContract("ERC1400", [
                "ERC1400Token",
                "DAU",
                2,
                [controller],
                partitions,
              ]);
              await issueOnMultiplePartitions(token, owner, tokenHolder, partitions, [
                issuanceAmount,
                issuanceAmount,
                issuanceAmount,
              ]);
              await token.connect(tokenHolder).authorizeOperator(operator);
              await token.connect(owner).setDefaultPartitions(reversedPartitions);
              await assertBalances(token, tokenHolder, partitions, [issuanceAmount, issuanceAmount, issuanceAmount]);
              await expect(token.connect(operator).redeemFrom(tokenHolder, 3, ZERO_BYTES32)).to.be.revertedWith("50");
            });
          });
        });

        describe("when the sender does not have enough balance for those default partitions", function () {
          it("reverts", async function () {
            const { token, owner, tokenHolder, operator } = await loadFixture(deployFixture);
            await issueOnMultiplePartitions(token, owner, tokenHolder, partitions, [
              issuanceAmount,
              issuanceAmount,
              issuanceAmount,
            ]);
            await token.connect(tokenHolder).authorizeOperator(operator);
            await token.connect(owner).setDefaultPartitions(reversedPartitions);
            await expect(
              token.connect(operator).redeemFrom(tokenHolder, 3n * issuanceAmount + 1n, ZERO_BYTES32)
            ).to.be.revertedWith("52");
          });

          it("reverts (mock contract - for 100% test coverage)", async function () {
            const { owner, tokenHolder, controller } = await loadFixture(deployFixture);
            const token = await ethers.deployContract(
              "FakeERC1400Mock",
              ["ERC1400Token", "DAU", 1, [controller], partitions, ethers.ZeroAddress, ethers.ZeroAddress],
              owner
            );

            await issueOnMultiplePartitions(token, owner, tokenHolder, partitions, [
              issuanceAmount,
              issuanceAmount,
              issuanceAmount,
            ]);
            await token.connect(owner).setDefaultPartitions(reversedPartitions);

            await expect(
              token.connect(controller).redeemFrom(tokenHolder, 3n * issuanceAmount + 1n, ZERO_BYTES32)
            ).to.be.revertedWith("52");
          });
        });
      });

      describe("when defaultPartitions have not been defined", function () {
        it("reverts", async function () {
          const { token, owner, tokenHolder, operator } = await loadFixture(deployFixture);
          await issueOnMultiplePartitions(token, owner, tokenHolder, partitions, [
            issuanceAmount,
            issuanceAmount,
            issuanceAmount,
          ]);
          await token.connect(tokenHolder).authorizeOperator(operator);
          await token.connect(owner).setDefaultPartitions([]);

          await expect(
            token.connect(operator).redeemFrom(tokenHolder, (25n * issuanceAmount) / 10n, ZERO_BYTES32)
          ).to.be.revertedWith("55");
        });
      });
    });

    describe("when the operator is not approved", function () {
      it("reverts", async function () {
        const { token, owner, tokenHolder, operator } = await loadFixture(deployFixture);
        await issueOnMultiplePartitions(token, owner, tokenHolder, partitions, [
          issuanceAmount,
          issuanceAmount,
          issuanceAmount,
        ]);
        await token.connect(owner).setDefaultPartitions(reversedPartitions);
        await expect(
          token.connect(operator).redeemFrom(tokenHolder, (25n * issuanceAmount) / 10n, ZERO_BYTES32)
        ).to.be.revertedWith("53");
      });
    });
  });

  // REDEEMBYPARTITION

  describe("redeemByPartition", function () {
    describe("when the redeemer has enough balance for this partition", function () {
      it("redeems the requested amount", async function () {
        const { token, owner, tokenHolder } = await loadFixture(deployFixture);
        await token.connect(owner).issueByPartition(partition1, tokenHolder, issuanceAmount, ZERO_BYTES32);

        const redeemAmount = 300n;
        await token.connect(tokenHolder).redeemByPartition(partition1, redeemAmount, ZERO_BYTES32);

        await assertTotalSupply(token, issuanceAmount - redeemAmount);
        await assertBalanceOf(token, tokenHolder, partition1, issuanceAmount - redeemAmount);
      });

      it("emits a redeemedByPartition event", async function () {
        const { token, owner, tokenHolder } = await loadFixture(deployFixture);
        await token.connect(owner).issueByPartition(partition1, tokenHolder, issuanceAmount, ZERO_BYTES32);

        const redeemAmount = 300n;
        const tx = await token.connect(tokenHolder).redeemByPartition(partition1, redeemAmount, ZERO_BYTES32);

        const receipt = await ethers.provider.getTransactionReceipt(tx.hash);
        const logs = receipt?.logs;
        expect(logs?.length).to.equal(3);

        if (logs?.length === 3) {
          assertBurnEvent(token, logs, partition1, tokenHolder, tokenHolder, redeemAmount, ZERO_BYTES32);
        }
      });
    });

    describe("when the redeemer does not have enough balance for this partition", function () {
      it("reverts", async function () {
        const { token, owner, tokenHolder } = await loadFixture(deployFixture);
        await token.connect(owner).issueByPartition(partition1, tokenHolder, issuanceAmount, ZERO_BYTES32);

        await expect(
          token.connect(tokenHolder).redeemByPartition(partition1, issuanceAmount + 1n, ZERO_BYTES32)
        ).to.be.revertedWith("52");
        await expect(token.connect(tokenHolder).redeemByPartition(partition2, 1, ZERO_BYTES32)).to.be.revertedWith(
          "52"
        );
      });
    });

    describe("special case (_removeTokenFromPartition shall revert)", function () {
      it("reverts", async function () {
        const { token, owner, tokenHolder } = await loadFixture(deployFixture);
        await token.connect(owner).issueByPartition(partition1, owner, issuanceAmount, ZERO_BYTES32);
        await expect(token.connect(tokenHolder).redeemByPartition(partition1, 0, ZERO_BYTES32)).to.be.revertedWith(
          "50"
        );
      });
    });
  });

  // OPERATOREDEEMBYPARTITION

  describe("operatorRedeemByPartition", function () {
    describe("when the sender is an operator for this partition", function () {
      describe("when the redeemer has enough balance for this partition", function () {
        it("redeems the requested amount", async function () {
          const { token, owner, tokenHolder, operator } = await loadFixture(deployFixture);
          await token.connect(owner).issueByPartition(partition1, tokenHolder, issuanceAmount, ZERO_BYTES32);
          await token.connect(tokenHolder).authorizeOperatorByPartition(partition1, operator);

          const redeemAmount = 300n;
          await token.connect(operator).operatorRedeemByPartition(partition1, tokenHolder, redeemAmount, ZERO_BYTES32);

          await assertTotalSupply(token, issuanceAmount - redeemAmount);
          await assertBalanceOf(token, tokenHolder, partition1, issuanceAmount - redeemAmount);
        });

        it("emits a redeemedByPartition event", async function () {
          const { token, owner, tokenHolder, operator } = await loadFixture(deployFixture);
          await token.connect(owner).issueByPartition(partition1, tokenHolder, issuanceAmount, ZERO_BYTES32);
          await token.connect(tokenHolder).authorizeOperatorByPartition(partition1, operator);

          const redeemAmount = 300n;
          const tx = await token
            .connect(operator)
            .operatorRedeemByPartition(partition1, tokenHolder, redeemAmount, ZERO_BYTES32);

          const receipt = await ethers.provider.getTransactionReceipt(tx.hash);
          const logs = receipt?.logs;
          expect(logs?.length).to.equal(3);

          if (logs?.length === 3) {
            assertBurnEvent(token, logs, partition1, operator, tokenHolder, redeemAmount, ZERO_BYTE, ZERO_BYTES32);
          }
        });
      });

      describe("when the redeemer does not have enough balance for this partition", function () {
        it("reverts", async function () {
          it("redeems the requested amount", async function () {
            const { token, owner, tokenHolder, operator } = await loadFixture(deployFixture);
            await token.connect(owner).issueByPartition(partition1, tokenHolder, issuanceAmount, ZERO_BYTES32);
            await token.connect(tokenHolder).authorizeOperatorByPartition(partition1, operator);

            await expect(
              token
                .connect(operator)
                .operatorRedeemByPartition(partition1, tokenHolder, issuanceAmount + 1n, ZERO_BYTES32)
            ).to.be.revertedWith("52");
          });
        });
      });
    });

    describe("when the sender is a global operator", function () {
      it("redeems the requested amount", async function () {
        const { token, owner, tokenHolder, operator } = await loadFixture(deployFixture);
        await token.connect(owner).issueByPartition(partition1, tokenHolder, issuanceAmount, ZERO_BYTES32);

        await token.connect(tokenHolder).authorizeOperator(operator);

        const redeemAmount = 300n;
        await token.connect(operator).operatorRedeemByPartition(partition1, tokenHolder, redeemAmount, ZERO_BYTES32);

        await assertTotalSupply(token, issuanceAmount - redeemAmount);
        await assertBalanceOf(token, tokenHolder, partition1, issuanceAmount - redeemAmount);
      });
    });

    describe("when the sender is not an operator", function () {
      it("reverts", async function () {
        const { token, owner, tokenHolder, operator } = await loadFixture(deployFixture);
        await token.connect(owner).issueByPartition(partition1, tokenHolder, issuanceAmount, ZERO_BYTES32);

        await expect(
          token.connect(operator).operatorRedeemByPartition(partition1, tokenHolder, 1, ZERO_BYTES32)
        ).to.be.revertedWith("58");
      });
    });
  });

  // BASIC FUNCTIONNALITIES

  describe("parameters", function () {
    describe("name", function () {
      it("returns the name of the token", async function () {
        const { token } = await loadFixture(deployFixture);
        const name = await token.name();

        expect(name).equal("ERC1400Token");
      });
    });

    describe("symbol", function () {
      it("returns the symbol of the token", async function () {
        const { token } = await loadFixture(deployFixture);
        const symbol = await token.symbol();

        expect(symbol).equal("DAU");
      });
    });

    describe("decimals", function () {
      it("returns the decimals the token", async function () {
        const { token } = await loadFixture(deployFixture);
        const decimals = await token.decimals();

        expect(decimals).equal(18);
      });
    });

    describe("granularity", function () {
      it("returns the granularity of tokens", async function () {
        const { token } = await loadFixture(deployFixture);
        const granularity = await token.granularity();

        expect(granularity).equal(1);
      });
    });

    describe("totalPartitions", function () {
      it("returns the list of partitions", async function () {
        const { token, owner, tokenHolder } = await loadFixture(deployFixture);

        let totalPartitions = await token.totalPartitions();
        expect(totalPartitions.length).equal(0);

        await token.connect(owner).issueByPartition(partition1, tokenHolder, issuanceAmount, ZERO_BYTES32);
        totalPartitions = await token.totalPartitions();
        expect(totalPartitions.length).equal(1);
        expect(totalPartitions[0]).equal(partition1);

        await token.connect(owner).issueByPartition(partition2, tokenHolder, issuanceAmount, ZERO_BYTES32);
        totalPartitions = await token.totalPartitions();
        expect(totalPartitions.length).equal(2);
        expect(totalPartitions[0]).equal(partition1);
        expect(totalPartitions[1]).equal(partition2);

        await token.connect(owner).issueByPartition(partition3, tokenHolder, issuanceAmount, ZERO_BYTES32);
        totalPartitions = await token.totalPartitions();
        expect(totalPartitions.length).equal(3);
        expect(totalPartitions[0]).equal(partition1);
        expect(totalPartitions[1]).equal(partition2);
        expect(totalPartitions[2]).equal(partition3);
      });
    });

    describe("totalSupplyByPartition", function () {
      it("returns the totalSupply of a given partition", async function () {
        const { token, owner, tokenHolder } = await loadFixture(deployFixture);

        let totalSupplyPartition1 = await token.totalSupplyByPartition(partition1);
        let totalSupplyPartition2 = await token.totalSupplyByPartition(partition2);
        expect(totalSupplyPartition1).equal(0);
        expect(totalSupplyPartition2).equal(0);

        await token.connect(owner).issueByPartition(partition1, tokenHolder, issuanceAmount, ZERO_BYTES32);
        totalSupplyPartition1 = await token.totalSupplyByPartition(partition1);
        totalSupplyPartition2 = await token.totalSupplyByPartition(partition2);
        expect(totalSupplyPartition1).equal(issuanceAmount);
        expect(totalSupplyPartition2).equal(0);

        await token.connect(owner).issueByPartition(partition2, tokenHolder, issuanceAmount, ZERO_BYTES32);
        totalSupplyPartition1 = await token.totalSupplyByPartition(partition1);
        totalSupplyPartition2 = await token.totalSupplyByPartition(partition2);
        expect(totalSupplyPartition1).equal(issuanceAmount);
        expect(totalSupplyPartition2).equal(issuanceAmount);

        await token.connect(owner).issueByPartition(partition1, tokenHolder, issuanceAmount, ZERO_BYTES32);
        totalSupplyPartition1 = await token.totalSupplyByPartition(partition1);
        totalSupplyPartition2 = await token.totalSupplyByPartition(partition2);
        expect(totalSupplyPartition1).equal(2n * issuanceAmount);
        expect(totalSupplyPartition2).equal(issuanceAmount);
      });
    });

    describe("total supply", function () {
      it("returns the total amount of tokens", async function () {
        const { token, owner, tokenHolder } = await loadFixture(deployFixture);

        await token.connect(owner).issue(tokenHolder, issuanceAmount, ZERO_BYTES32);
        const totalSupply = await token.totalSupply();

        expect(totalSupply).equal(issuanceAmount);
      });
    });

    describe("balanceOf", function () {
      describe("when the requested account has no tokens", function () {
        it("returns zero", async function () {
          const { token, unknown } = await loadFixture(deployFixture);

          const balance = await token.balanceOf(unknown);

          expect(balance).equal(0);
        });
      });

      describe("when the requested account has some tokens", function () {
        it("returns the total amount of tokens", async function () {
          const { token, owner, tokenHolder } = await loadFixture(deployFixture);

          await token.connect(owner).issue(tokenHolder, issuanceAmount, ZERO_BYTES32);
          const balance = await token.balanceOf(tokenHolder);

          expect(balance).equal(issuanceAmount);
        });
      });
    });

    describe("controllers", function () {
      it("returns the list of controllers", async function () {
        const { token, controller } = await loadFixture(deployFixture);

        const controllers = await token.controllers();

        expect(controllers.length).equal(1);
        expect(controllers[0]).equal(controller);
      });
    });

    describe("implementer1400", function () {
      it("returns the contract address", async function () {
        const { token, registry } = await loadFixture(deployFixture);

        const interface1400Implementer = await registry.getInterfaceImplementer(
          token.target,
          ethers.solidityPackedKeccak256(["string"], [ERC1400_INTERFACE_NAME])
        );
        expect(interface1400Implementer).equal(token.target);
      });
    });

    describe("implementer20", function () {
      it("returns the zero address", async function () {
        const { token, registry } = await loadFixture(deployFixture);

        const interface20Implementer = await registry.getInterfaceImplementer(
          token.target,
          ethers.solidityPackedKeccak256(["string"], [ERC1400_INTERFACE_NAME])
        );
        expect(interface20Implementer).equal(token.target);
      });
    });
  });
});
