require('@nomiclabs/hardhat-ethers');
require('dotenv').config();

module.exports = {
    solidity: "0.8.0",
    networks: {
        hardhat: {
            chainId: 1337
        }
    }
};
