// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Raffle {
    address public admin;
    address[] public participants;
    uint public ticketPrice;
    uint public raffleEnd;
    uint public prizePool;
    
    event TicketPurchased(address indexed buyer);
    event WinnerSelected(address indexed winner, uint prizeAmount);

    constructor() {
        admin = msg.sender;
    }
    
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    modifier raffleOngoing() {
        require(block.timestamp < raffleEnd, "Raffle has ended");
        _;
    }
    
    function setTicketPrice(uint _price) external onlyAdmin {
        ticketPrice = _price;
    }
    
    function buyTicket() external payable raffleOngoing {
        require(msg.value == ticketPrice, "Incorrect ticket price");
        participants.push(msg.sender);
        prizePool += msg.value;
        emit TicketPurchased(msg.sender);
    }
    
    function startRaffle(uint duration) external onlyAdmin {
        require(raffleEnd == 0 || block.timestamp >= raffleEnd, "Raffle is already ongoing");
        raffleEnd = block.timestamp + duration;
    }
    
    function endRaffle() external onlyAdmin {
        require(block.timestamp >= raffleEnd, "Raffle has not ended yet");
        require(participants.length > 0, "No participants in the raffle");

        // Basic random number generator
        uint winnerIndex = uint(keccak256(abi.encodePacked(block.difficulty, block.timestamp, participants))) % participants.length;
        address winner = participants[winnerIndex];
        payable(winner).transfer(prizePool);
        emit WinnerSelected(winner, prizePool);
        
        // Reset the raffle state
        prizePool = 0;
        delete participants;
    }
    
    function getParticipants() external view returns (address[] memory) {
        return participants;
    }
    
    function getPrizePool() external view returns (uint) {
        return prizePool;
    }
}
