// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol";
import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";
import "@openzeppelin/contracts/interfaces/IERC20.sol";
import "./IWETH.sol";


contract DPay {

    ISwapRouter private constant swapRouter = ISwapRouter(
        0xE592427A0AEce92De3Edee1F18E0157C05861564
    );
    uint24 private constant poolFee = 3000; // 0.3%
    address private constant weth9 = 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2;

    // the actual ammount of inCoin which got spent
    uint256 private inAmount = type(uint256).max;

    modifier swapSend(
        address _outCoin, 
        uint256 _outAmount, 
        address _inCoin, 
        uint256 _maxInAmount,
        address _recipient
    ) {

        // approving inCoin for swapRouter
        TransferHelper.safeApprove(
            _inCoin,
            address(swapRouter),
             _maxInAmount
        );

        // parameters for swapRouter
        ISwapRouter.ExactOutputSingleParams memory params =
            ISwapRouter.ExactOutputSingleParams({
                tokenIn: _inCoin,
                tokenOut: _outCoin,
                fee: poolFee,
                recipient: _recipient,
                deadline: block.timestamp,
                amountOut: _outAmount,
                amountInMaximum: _maxInAmount,
                sqrtPriceLimitX96: 0
            });

        inAmount = swapRouter.exactOutputSingle(params);

        // revoking permission given to swapRouter
        TransferHelper.safeApprove(_inCoin, address(swapRouter), 0);

        _;
    }

    modifier tokenToToken(address _inCoin, uint256 _maxInAmount) {

        // sending inCoin to DPay
        TransferHelper.safeTransferFrom(
            _inCoin,
            msg.sender,
            address(this),
            _maxInAmount
        );

        _;

        // refunding excess inCoin
        if (inAmount < _maxInAmount) {
            TransferHelper.safeTransfer(
                _inCoin, 
                msg.sender, 
                _maxInAmount - inAmount
            );
        }

        // resetting inAmount
        inAmount = type(uint256).max;
    }

    modifier ethToToken(uint256 _maxInAmount) {

        // wrapping users ETH
        IWETH(weth9).deposit{value: _maxInAmount}();

        _;

        // refunding excess WETH as ETH
        if (inAmount < _maxInAmount) {

            // un-wrapping WETH
            IWETH(weth9).withdraw(
                IERC20(weth9).balanceOf(address(this))
            );

            // sending ETH to user
            TransferHelper.safeTransferETH(
                msg.sender,
                _maxInAmount - inAmount
            );
        }

        // resetting inAmount
        inAmount = type(uint256).max;
    }

    modifier tokenToEth(address _inCoin, uint256 _maxInAmount, address _recipient) {

        // sending inCoin to DPay
        TransferHelper.safeTransferFrom(
            _inCoin,
            msg.sender,
            address(this),
            _maxInAmount
        );

        _;

        // un-wrapping WETH
        IWETH(weth9).withdraw(
            IERC20(weth9).balanceOf(address(this))
        );

        // sending ETH to recipient
        TransferHelper.safeTransferETH(
            _recipient,
            _maxInAmount - inAmount
        );
    }

    function swapTokenSendToken(        
        address outCoin, 
        uint256 outAmount, 
        address inCoin, 
        uint256 maxInAmount,
        address recipient
    ) swapSend(
        outCoin, 
        outAmount, 
        inCoin, 
        maxInAmount, 
        recipient
    ) tokenToToken(inCoin, maxInAmount) external {}

    function swapEthSendToken(        
        address outCoin, 
        uint256 outAmount, 
        address recipient
    ) ethToToken(
        msg.value
    ) swapSend(
        outCoin,
        outAmount,
        address(weth9),
        msg.value,
        recipient
    ) external payable {}

    function swapTokenSendEth(        
        uint256 outAmount,
        address inCoin,
        uint256 maxInAmount,
        address recipient
    ) swapSend(
        address(weth9),
        outAmount,
        inCoin,
        maxInAmount,
        address(this)
    ) tokenToEth(inCoin, maxInAmount, recipient) external payable {}
}