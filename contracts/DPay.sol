// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "https://github.com/Uniswap/v3-periphery/blob/main/contracts/libraries/TransferHelper.sol";
import "https://github.com/Uniswap/v3-periphery/blob/main/contracts/interfaces/ISwapRouter.sol";

contract DPay {

    // see https://docs.uniswap.org/contracts/v3/reference/periphery/SwapRouter
    ISwapRouter public constant swapRouter = ISwapRouter(0xE592427A0AEce92De3Edee1F18E0157C05861564);

    // set the pool fee to 0.3%
    uint24 public constant poolFee = 3000;

    // see https://docs.uniswap.org/contracts/v3/guides/swaps/single-swaps
    function swapSend(
        address outCoin, 
        uint256 outAmount, 
        address inCoin, 
        uint256 maxInAmount,
        address recipient
    ) external returns(uint256 inAmount) {

        TransferHelper.safeTransferFrom(inCoin, msg.sender, address(this), maxInAmount);
        TransferHelper.safeApprove(inCoin, address(swapRouter), maxInAmount);

        // see https://docs.uniswap.org/contracts/v3/reference/periphery/interfaces/ISwapRouter
        ISwapRouter.ExactOutputSingleParams memory params =
            ISwapRouter.ExactOutputSingleParams({
                tokenIn: inCoin,
                tokenOut: outCoin,
                fee: poolFee,
                recipient: recipient,
                deadline: block.timestamp,
                amountOut: outAmount,
                amountInMaximum: maxInAmount,
                sqrtPriceLimitX96: 0
            });
        
        // the actual ammount of inCoin which got spent
        inAmount = swapRouter.exactOutputSingle(params);

        if (inAmount < maxInAmount) {
            TransferHelper.safeApprove(inCoin, address(swapRouter), 0);
            TransferHelper.safeTransfer(inCoin, msg.sender, maxInAmount - inAmount);
        }

    }

}
