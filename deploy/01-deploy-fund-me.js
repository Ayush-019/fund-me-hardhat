// function deployFunc() {}
// module.exports.default = deployFunc;

// const {getNamedAccounts, deployments} = hre;

const { network } = require("hardhat");
const { verify } = require("../utils/verify");
const {
    networkConfig,
    developmentChains,
} = require("../helper-hardhat-config");

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();
    const chainId = network.config.chainId;

    let ethUsdPriceFeedAddress;
    if (developmentChains.includes(network.name)) {
        const ethUsdAggregator = await deployments.get("MockV3Aggregator");
        ethUsdPriceFeedAddress = ethUsdAggregator.address;
    } else {
        ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"];
    }
    //If the contract(price feed) doest not exist on some blockchain we deploy it for testin
    // locally for local testing [we use mock].

    //When going for localhost or hardhat network we use mock as normal deployment
    // doesnt store the transactions in the blockchain
    //Using hardhat-deploy whenver we run hardhat run node we get all the contracts deployed
    const args = [ethUsdPriceFeedAddress];
    const fundMe = await deploy("FundMe", {
        from: deployer,
        args: [ethUsdPriceFeedAddress], //put price feed address here
        // args:args,        or can do like this
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    });
    if (
        !developmentChains.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY
    ) {
        await verify(fundMe.address, args);
    }
    log("----------------------------------------------------");
};

module.exports.tags = ["all", "fundme"];
