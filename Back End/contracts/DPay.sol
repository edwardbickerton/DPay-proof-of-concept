// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol";
import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";
import "@openzeppelin/contracts/interfaces/IERC20.sol";
import "./IWETH.sol";


contract DPay {

    ISwapRouter private constant swapRouter = ISwapRouter(0xE592427A0AEce92De3Edee1F18E0157C05861564);
    address private constant weth9 = 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2;
    
    function swapTokenSendToken(
        address outCoin, 
        uint256 outAmount, 
        address inCoin, 
        uint256 maxInAmount,
        address recipient
    ) external returns(uint256 inAmount) {

        // sending inCoin to DPay
        TransferHelper.safeTransferFrom(inCoin, msg.sender, address(this), maxInAmount);
    
        // approving inCoin for swapRouter
        TransferHelper.safeApprove(inCoin, address(swapRouter), maxInAmount);

        // parameters for swapRouter
        ISwapRouter.ExactOutputSingleParams memory params =
            ISwapRouter.ExactOutputSingleParams({
                tokenIn: inCoin,
                tokenOut: outCoin,
                fee: 3000, // 0.3%
                recipient: recipient,
                deadline: type(uint256).max,
                amountOut: outAmount,
                amountInMaximum: maxInAmount,
                sqrtPriceLimitX96: 0
            });
        
        // ammount of inCoin which got spent
        inAmount = swapRouter.exactOutputSingle(params);

        // revoking permission given to swapRouter
        TransferHelper.safeApprove(inCoin, address(swapRouter), 0);

        // refunding excess inCoin
        if (inAmount < maxInAmount) {
            TransferHelper.safeTransfer(inCoin, msg.sender, maxInAmount - inAmount);
        }

    }

    function swapEthSendToken(
        address outCoin,
        uint256 outAmount,
        address recipient
    ) external payable {

        // wrapping users ETH
        IWETH(weth9).deposit{value: msg.value}();

        // approving weth9 for swapRouter
        TransferHelper.safeApprove(weth9, address(swapRouter), msg.value);

        // parameters for swapRouter
        ISwapRouter.ExactOutputSingleParams memory params =
            ISwapRouter.ExactOutputSingleParams({
                tokenIn: weth9,
                tokenOut: outCoin,
                fee: 3000, // 0.3%
                recipient: recipient,
                deadline: type(uint256).max,
                amountOut: outAmount,
                amountInMaximum: msg.value,
                sqrtPriceLimitX96: 0
            });

        // ammount of inCoin which got spent
        uint256 inAmount = swapRouter.exactOutputSingle(params);

        // revoking permission given to swapRouter
        TransferHelper.safeApprove(weth9, address(swapRouter), 0);

        // refunding excess WETH
        if (inAmount < msg.value) {
            TransferHelper.safeTransfer(weth9, msg.sender, IERC20(weth9).balanceOf(address(this)));
        }
    }
}