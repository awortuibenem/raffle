const { ethers } = require("hardhat");
require('dotenv').config();

async function main() {
    const [admin] = await ethers.getSigners();
    const Raffle = await ethers.getContractFactory("Raffle");
    const raffle = Raffle.attach(process.env.RAFFLE_ADDRESS);

    let tx = await raffle.startRaffle(3600);
    await tx.wait();
    console.log("Raffle started!");

    // End raffle
    tx = await raffle.endRaffle();
    await tx.wait();
    console.log("Raffle ended!");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
