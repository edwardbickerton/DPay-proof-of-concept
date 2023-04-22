// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/IERC20.sol";

contract GetBalance {

    address internal constant DAI = 0x6B175474E89094C44Da98b954EedeAC495271d0F;
    address internal constant WETH9 = 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2;
    address internal constant WBTC = 0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599;

    function getBalance() external view returns(uint256, uint256, uint256) {
        return(
            IERC20(DAI).balanceOf(msg.sender), 
            IERC20(WETH9).balanceOf(msg.sender), 
            IERC20(WBTC).balanceOf(msg.sender)
        );
    }
}
