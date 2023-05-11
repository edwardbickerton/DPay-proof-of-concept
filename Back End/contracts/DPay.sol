// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "https://github.com/Uniswap/v3-periphery/blob/main/contracts/libraries/TransferHelper.sol";
import "https://github.com/Uniswap/universal-router/blob/main/contracts/interfaces/IUniversalRouter.sol";
import "https://github.com/Uniswap/permit2/blob/main/src/interfaces/IAllowanceTransfer.sol";
import {SafeTransferLib} from "https://github.com/transmissions11/solmate/blob/main/src/utils/SafeTransferLib.sol";
import {Constants} from "https://github.com/Uniswap/universal-router/blob/main/contracts/libraries/Constants.sol";

contract DPay {

    // see https://github.com/Uniswap/universal-router/tree/main/deploy-addresses for address
    IUniversalRouter public constant universalRouter = IUniversalRouter(0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD);

    // setting WETH contract address
    address internal constant weth9 = 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2;

    // set the pool fee to 0.3%
    uint24 internal constant poolFee = 3000;

    function swapSend(
        address outCoin,
        uint256 outAmount,
        address inCoin, 
        uint160 maxInAmount,
        bytes calldata _signature,
        uint48 _expiration,
        uint48 _nonce,
        address recipient
    ) external {

        // defining inputs for universalRouter.execute()
        bytes memory commands = new bytes(2);
        commands[0] = 0x0a; // PERMIT2_PERMIT
        commands[1] = 0x01; // V3_SWAP_EXACT_OUT
        bytes[] memory inputs = new bytes[](2);

        // using Permit2 to permit universalRouter to spend users tokens
        IAllowanceTransfer.PermitDetails memory permitDetails = 
            IAllowanceTransfer.PermitDetails({
                token: inCoin,
                amount: maxInAmount,
                expiration: _expiration,
                nonce: _nonce
            });

        IAllowanceTransfer.PermitSingle memory permitSingle = 
            IAllowanceTransfer.PermitSingle({
                details: permitDetails,
                spender: address(universalRouter),
                sigDeadline: _expiration
            });

        // inputs for PERMIT2_PERMIT
        inputs[0] = abi.encode(permitSingle, _signature);

        // inputs for V3_SWAP_EXACT_OUT
        // swapping inCoin for outCoin and sending it to recipient
        inputs[1] = abi.encode(
            recipient,
            outAmount,
            maxInAmount,
            abi.encodePacked(outCoin, poolFee, inCoin),
            true // value for payerIsUser
        );

        // executing the swap
        universalRouter.execute(commands, inputs, block.timestamp);
    }

    function swapEthSend(
        address outCoin,
        uint256 outAmount,
        address recipient
    ) external payable {

        // sending all ETH from transaction to universalRouter
        SafeTransferLib.safeTransferETH(address(universalRouter), msg.value);

        // defining inputs for universalRouter.execute()
        bytes memory commands = new bytes(3);
        commands[0] = 0x0b; // WRAP_ETH
        commands[1] = 0x01; // V3_SWAP_EXACT_OUT
        commands[2] = 0x0c; // UNWRAP_ETH
        bytes[] memory inputs = new bytes[](3);

        // inputs for WRAP_ETH
        // wrapping all eth on univeralRouter, sending WETH to univeralRouter
        inputs[0] = abi.encode(
            address(universalRouter),
            Constants.CONTRACT_BALANCE
        );

        // inputs for V3_SWAP_EXACT_OUT
        // swapping WETH for outCoin and sending it to recipient
        inputs[1] = abi.encode(
            recipient,
            outAmount,
            IERC20(weth9).balanceOf(address(universalRouter)),
            abi.encodePacked(outCoin, poolFee, weth9),
            false // value for payerIsUser
        );

        // inputs for UNWRAP_ETH
        // un-wrapping all remaining WETH and sending it to msg.sender
        inputs[2] = abi.encode(
            msg.sender,
            1
        );

        // executing the swap
        universalRouter.execute(commands, inputs, block.timestamp);
    }

    function swapSendEth(
        uint256 outAmount,
        address inCoin,
        uint160 maxInAmount,
        bytes calldata _signature,
        uint48 _expiration,
        uint48 _nonce,
        address recipient
    ) external {

        // defining inputs for universalRouter.execute()
        bytes memory commands = new bytes(3);
        commands[0] = 0x0a; // PERMIT2_PERMIT
        commands[1] = 0x01; // V3_SWAP_EXACT_OUT
        commands[2] = 0x0c; // UNWRAP_ETH
        bytes[] memory inputs = new bytes[](3);

        // using Permit2 to permit universalRouter to spend users tokens
        IAllowanceTransfer.PermitDetails memory permitDetails = 
            IAllowanceTransfer.PermitDetails({
                token: inCoin,
                amount: maxInAmount,
                expiration: _expiration,
                nonce: _nonce
            });

        IAllowanceTransfer.PermitSingle memory permitSingle = 
            IAllowanceTransfer.PermitSingle({
                details: permitDetails,
                spender: address(universalRouter),
                sigDeadline: _expiration
            });

        // inputs for PERMIT2_PERMIT
        inputs[0] = abi.encode(permitSingle, _signature);

        // inputs for V3_SWAP_EXACT_OUT
        // swapping inCoin for WETH and sending it to univeralRouter
        inputs[1] = abi.encode(
            address(universalRouter),
            outAmount,
            maxInAmount,
            abi.encodePacked(weth9, poolFee, inCoin),
            true // value for payerIsUser
        );

        // inputs for UNWRAP_ETH
        // un-wrapping all WETH and sending it to recipient
        inputs[2] = abi.encode(
            recipient,
            1
        );

        // executing the swap
        universalRouter.execute(commands, inputs, block.timestamp);
    }
}
