const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Raffle", function () {
    this.timeout(10000); 

    let Raffle, raffle, admin, user1, user2;

    beforeEach(async function () {
        [admin, user1, user2] = await ethers.getSigners();
        Raffle = await ethers.getContractFactory("Raffle");
        raffle = await Raffle.deploy();
        await raffle.deployed();
    });

    it("should deploy the contract and set the admin correctly", async function () {
        expect(await raffle.admin()).to.equal(admin.address);
    });

    it("should allow users to buy tickets and track participants", async function () {
        // Set ticket price
        await raffle.setTicketPrice(ethers.utils.parseEther("0.1"));
        
        // Start a raffle
        await raffle.startRaffle(3600); 
        await raffle.connect(user1).buyTicket({ value: ethers.utils.parseEther("0.1") });
        await raffle.connect(user2).buyTicket({ value: ethers.utils.parseEther("0.1") });

        const participants = await raffle.getParticipants();
        expect(participants.length).to.equal(2);
        expect(participants).to.include(user1.address);
        expect(participants).to.include(user2.address);

        const prizePool = await raffle.getPrizePool();
        expect(prizePool.toString()).to.equal(ethers.utils.parseEther("0.2").toString());
    });

    it("should announce a winner and transfer the prize correctly", async function () {
        await raffle.setTicketPrice(ethers.utils.parseEther("0.1"));
        await raffle.startRaffle(3600); 

        await raffle.connect(user1).buyTicket({ value: ethers.utils.parseEther("0.1") });
        await raffle.connect(user2).buyTicket({ value: ethers.utils.parseEther("0.1") });

        await ethers.provider.send("evm_increaseTime", [3600]);
        await ethers.provider.send("evm_mine");

        const tx = await raffle.endRaffle();
        const receipt = await tx.wait();
        
        const winnerEvent = receipt.events.find(e => e.event === "WinnerSelected");
        expect(winnerEvent).to.not.be.undefined;
        const winner = winnerEvent.args.winner;
        const prizeAmount = winnerEvent.args.prizeAmount;

        expect([user1.address, user2.address]).to.include(winner);

        const prizePool = await raffle.getPrizePool();
        expect(prizePool.toString()).to.equal("0");

        const winnerBalance = await ethers.provider.getBalance(winner);
        const prizeAmountInEth = ethers.utils.formatEther(prizeAmount);
        expect(winnerBalance.gte(ethers.utils.parseEther(prizeAmountInEth))).to.be.true;
    });

    it("should not allow users to buy tickets after the raffle ends", async function () {
        await raffle.setTicketPrice(ethers.utils.parseEther("0.1"));
        
        await raffle.startRaffle(3600); 
        await raffle.connect(user1).buyTicket({ value: ethers.utils.parseEther("0.1") });

        await ethers.provider.send("evm_increaseTime", [3600]);
        await ethers.provider.send("evm_mine");

        await raffle.endRaffle();

        try {
            await raffle.connect(user2).buyTicket({ value: ethers.utils.parseEther("0.1") });
            expect.fail("Expected transaction to revert with 'Raffle has ended'");
        } catch (error) {
            expect(error.message).to.include("Raffle has ended");
        }
    });
});
