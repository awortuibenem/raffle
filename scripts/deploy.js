const hre = require("hardhat");

async function main() {
    const [deployer] = await hre.ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    const Raffle = await hre.ethers.getContractFactory("Raffle");
    const raffle = await Raffle.deploy();

    console.log("Raffle deployed to:", raffle.address);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
