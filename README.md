#  使用Hardhat开发、测试、部署 Notebook-Contract
This is the implementation and deployment of a decentralized notepad for adding, deleting, modifying and checking.

# Hardhat开发环境配置

### 1. IDE安装Solidity插件

### 2. 安装Hardhat

```
npm install -g hardhat
```

### 3. 打开你Solidity 项目目录，运行：

```
npx hardhat

// 选择ts配置
```

### 4. 配置编译器

编辑 `hardhat.config.js` 或 `hardhat.config.ts`

```typescript
import {HardhatUserConfig} from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
    solidity: "0.8.28",
};

export default config;
```

### 5. 编译Solidity

```typescript
npx hardhat compile
```

### 6. 添加网络配置（用于测试网/主网部署）

- #### **安装 dotenv**（用于管理 API 密钥和私钥）：

```
npm install dotenv
```

- #### **创建 `.env` 文件**（存储私钥和 API URL）：

```typescript
import {Etherscan} from "@nomicfoundation/hardhat-verify/etherscan";

PRIVATE_KEY = 私钥
HOLESKY_URL = https://ethereum-holesky.publicnode.com
ETHERSCAN_API_KEY = Etherscan API Key
BSCSCAN_API_KEY = Bscscan API Key
BSC_TESTNET_URL = https://bsc-testnet-rpc.publicnode.com
```

- #### 添加 Etherscan 验证

```typescript
import "@nomicfoundation/hardhat-verify";

const config: HardhatUserConfig = {
  solidity: "0.8.28",
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
};
```

- #### **安装 hardhat-verify 插件**：

```typescript
npm install @nomicfoundation/hardhat-verify
```

- #### 安装 OpenZeppelin ：

```
npm install @openzeppelin/contracts-upgradeable
```

- ### 完整配置config配置文件：

```typescript
import {HardhatUserConfig} from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@openzeppelin/hardhat-upgrades";
import {configDotenv} from "dotenv";

configDotenv()

const config: HardhatUserConfig = {
    solidity: "0.8.28",
    etherscan: {
        apiKey: {
            holesky: process.env.ETHERSCAN_API_KEY ? process.env.ETHERSCAN_API_KEY : "",
            bscTestnet: process.env.BSCSCAN_API_KEY ? process.env.BSCSCAN_API_KEY : "",
        },
    },
    sourcify: {
        enabled: true
    },
    networks: {
        holesky: {
            url: process.env.HOLESKY_URL ? process.env.HOLESKY_URL : "",
            accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
        },
        bscTestnet: {
            url: process.env.BSC_TESTNET_URL,
            accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
            chainId: 97,
        },
    },
};

export default config;
```

### 7. 部署合约

- ####  创建一个部署脚本 `scripts/deploy.js`，内容如下：

```typescript
async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    // 部署逻辑合约
    const Token = await ethers.getContractFactory("SureSharesToken");
    const token = await Token.deploy();
    await token.waitForDeployment();
    console.log("Token logic contract deployed at:", await token.getAddress());

    // 部署代理合约
    const Proxy = await ethers.getContractFactory("Proxy");
    const proxy = await Proxy.deploy();
    await proxy.waitForDeployment();
    console.log("Proxy contract deployed at:", await proxy.getAddress());

    // 通过 `Proxy` 绑定 `SureSharesToken`
    const proxyContract = Token.attach(await proxy.getAddress()); // 让 Proxy 代理 Token
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
```

- #### **运行部署脚本：** 在项目根目录下运行：

```
npx hardhat run scripts/deploy.js --network <network-name>
```

- #### 部署成功，代码开源验证：

```
npx hardhat verify <deployed-contract-address> "参数(若有)" --network <network-name> 
```

- #### 本地调用合约函数验证：

调用脚本：

```solidity
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
```

**执行命令：**

```js
 npx hardhat run scripts/call.js --network <network name>
```

### 8.升级逻辑合约

修改完逻辑合约代码之后，编辑脚本，部署新的逻辑合约代码并将代理合约制定到这个地址

```javascript
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
```
**执行命令：**

```js
 npx hardhat run scripts/upgrade.js --network <network name>
```

