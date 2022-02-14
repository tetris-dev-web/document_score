const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("DocumentScore", function () {
  let documentScore;

  beforeEach(async () => {
    const DocumentScore = await ethers.getContractFactory("DocumentScore");
    documentScore = await DocumentScore.deploy();
	});

  it("Should be able to add documents", async function () {
    let alice = "Alice";
    let aliceDocuments = [["al", 20], ["bo", 50]];

    expect(await documentScore.addDocuments(alice, aliceDocuments))
    .to.emit(documentScore, "DocumentAdded")
    .withArgs(alice, 2);
  });

  it("Should be able to get total documents", async function () {
    let alice = "Alice";
    let bob = "Bob";
    let aliceDocuments = [["A", 20], ["B", 50]];
    let bobDocuments = [["C", 30], ["D", 40]];

    await documentScore.addDocuments(alice, aliceDocuments);
    await documentScore.addDocuments(bob, bobDocuments);
    await documentScore.addDocuments(alice, aliceDocuments);

    let totalDocuments = await documentScore.getUserDocuments();

    expect(totalDocuments[0].userName).to.equal(alice);
    expect(totalDocuments[0].documents.length).to.equal(4);
    expect(totalDocuments[1].userName).to.equal(bob);
    expect(totalDocuments[1].documents.length).to.equal(2);
  });
});
