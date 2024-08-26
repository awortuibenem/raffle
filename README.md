# Raffle Smart Contract

This contract allows you to run a decentralized raffle where users can buy tickets for a chance to win a prize. 

## Overview

This Raffle contract provides functionality for setting ticket prices, buying tickets, and managing raffle entries. At the end of the raffle, a random winner is selected, and the prize pool is transferred to them.

## Features

- **Set Ticket Price:** The admin can set the ticket price using the `setTicketPrice` function.
- **Buy Tickets:** Users can purchase tickets as long as the raffle is ongoing.
- **Start Raffle:** Admin can start a new raffle by specifying the duration.
- **End Raffle:** Admin can end the raffle and select a random winner.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/awortuibenem/raffle.git
   cd raffle
   npm install (to install dependencies)

