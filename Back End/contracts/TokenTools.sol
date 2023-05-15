// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/interfaces/IERC20.sol";


contract TokenTools {

    // the contract addresses of a few ERC20 coins used for testing
    address internal constant dai = 0x6B175474E89094C44Da98b954EedeAC495271d0F;
    address internal constant weth9 = 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2;
    address internal constant wbtc = 0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599;

    function getSenderBalance() external view returns(uint256, uint256, uint256) {
        return(
            IERC20(dai).balanceOf(msg.sender), 
            IERC20(weth9).balanceOf(msg.sender), 
            IERC20(wbtc).balanceOf(msg.sender)
        );
    }

    function getAddressBalance(address tokenOwner) external view returns(uint256, uint256, uint256) {
        return(
            IERC20(dai).balanceOf(tokenOwner), 
            IERC20(weth9).balanceOf(tokenOwner), 
            IERC20(wbtc).balanceOf(tokenOwner)
        );
    }
}
