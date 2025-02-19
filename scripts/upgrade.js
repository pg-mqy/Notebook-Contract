const { ethers } = require("hardhat");

async function main() {

    const PROXY_ADDRESS = process.env.CONTRACTS_ADDRESS;

    console.log("Upgrading Notebook logic contract...");

    // 获取新的 Notebook 逻辑合约
    const NotebookV2 = await ethers.getContractFactory("Notebook");
    const newNotebook = await NotebookV2.deploy();
    await newNotebook.waitForDeployment();

    console.log("New logic contract deployed at:", await newNotebook.getAddress());

    // 连接到代理合约
    const proxy = await ethers.getContractAt("Proxy", PROXY_ADDRESS);

    // 代理合约指向新的逻辑合约
    await proxy.setTarget(await newNotebook.getAddress());

    console.log("Proxy successfully upgraded to new logic contract!");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("Upgrade failed:", error);
        process.exit(1);
    });
