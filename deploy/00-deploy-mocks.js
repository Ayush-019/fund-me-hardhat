const { network } = require("hardhat");
const {
    developmentChains,
    DECIMALS,
    INITIAL_ANSWER,
} = require("../helper-hardhat-config");
module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();
    const chainId = network.config.chainId;

    if (developmentChains.includes(network.name)) {
        log("Development chain detected! Deploying mock price feed");
        await deploy("MockV3Aggregator", {
            from: deployer,
            contract: "MockV3Aggregator",
            log: true,
            args: [DECIMALS, INITIAL_ANSWER],
        });
        log("Mocks Deployed [MockV3Aggregator]");
        log("__________________________________________________");
    }
};

module.exports.tags = ["all", "mocks"];
