async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    // 部署逻辑合约
    const Token = await ethers.getContractFactory("Notebook");
    const token = await Token.deploy();
    await token.waitForDeployment();
    console.log("Token logic contract deployed at:", await token.getAddress());

    // 部署代理合约
    const Proxy = await ethers.getContractFactory("Proxy");
    const proxy = await Proxy.deploy();
    await proxy.waitForDeployment();
    console.log("Proxy contract deployed at:", await proxy.getAddress());

    // 通过 `Proxy` 绑定 `Notebook`
    Token.attach(await proxy.getAddress()); // 让 Proxy 代理 Token
    await proxy.setTarget(await token.getAddress()); // 让代理合约指向逻辑合约
    console.log("Proxy now points to Token contract!");

    console.log("Deployment complete.");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });