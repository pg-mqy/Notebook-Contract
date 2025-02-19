require("dotenv").config();
const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();

    // get contract address
    const contractAddress = process.env.CONTRACTS_ADDRESS;

    const contract = await ethers.getContractAt("Notebook", contractAddress, deployer);

    // get note
    let note = await contract.getAllNotes()
    console.log("Note id 0->", note);
    console.log("Tx Hash->", tx.hash);
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
