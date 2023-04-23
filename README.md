# DPay-proof of concept

## Contracts

### DPay.sol

The function `swapSend` is has 5 parameters:

1. `outCoin` the contract address of the coin the recipient wants.
2. `outAmount` the amount<sup>1</sup> of `outCoin` which the recipient is expecting.
3. `inCoin` the contract address of the coin the sender wants to spend.
4. `maxInAmount` the maximum amount<sup>1</sup> of `inCoin` the user is willing to spend. (This could be omitted<sup>2</sup>)
5. `recipient` the address of the recipient who will recieve `outAmount` of `outCoin`.

1 - Be careful with specifying amounts, for example in `WETH9.sol` you'll see the word [wad](https://ethereum.stackexchange.com/questions/27101/what-does-wadstand-for) everywhere. So if `inCoin` is the contract address of WETH and you want `maxInAmount` to be 1 WETH you must put 1,000,000,000,000,000,000.

2 - `maxInAmount` could be replaced with say

```
1.1x(outAmount x price_of_outCoin_denomenated_in_inCoin)
```

i.e. 10% over market price. (Note: the surplus gets refunded)

### TokenTools.sol

This contract is pretty simple and just makes testing DPay easier.

### WETH9.sol

Simply a copy of the contract found on [etherscan.io](https://etherscan.io/address/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2#code) at the WETH9 contract address.

This is useful because;

1. DPay does not yet support native ETH (only ERC20 tokens), so having the contract to hand lets you "wrap" the test ether ganache gives you to obtain WETH for testing,
2. before you can send an ERC20 token the user must first call the function `approve` from the token contract.

## Testing

### Setup

Taken from [uniswap guide](https://docs.uniswap.org/contracts/v3/guides/local-environment): "When building and testing integrations with on chain protocols, developers often hit a problem: the liquidity on the live chain is critical to thoroughly testing their code but testing against a live network like Mainnet can be extremely expensive."

1. To fork the Ethereum mainnet first make an account on [alchemy.com](https://www.alchemy.com) to get an API key.
2. Start a new workspace on [Ganache](https://trufflesuite.com/docs/ganache/) - on the server settings enable `chain forking` paste in `https://eth-mainnet.g.alchemy.com/v2/{YOUR API KEY}` under custom url and choose a relatively recent block height (e.g. 17,000,000).
3. I use the [Remix VSCode plugin](https://marketplace.visualstudio.com/items?itemName=RemixProject.ethereum-remix) to compile, deploy and interact with the smart contracts.

### Contracts

1. To interact with the WETH9 contract compile it but don't deploy it! Enter the contract address (0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2) of the actual live WETH9 contract on mainnet next to the button `At Address`.
2. Compile and deploy TokenTools and DPay (you might need to change the compiler version).

### Test `swapSend`

1. You first need to get some WETH by interacting with the WETH9 contract (use `DEPOSIT`)
2. Check that your account has WETH using TokenTools `getSenderBalance` which returns a list of `(dai_balance, weth_balance, wbtc_balance)`.
3. Intereact withe the WETH9 contract using `APPROVE`, `guy` should be the contract address of DPay.
4. Now you can spend the WETH using DPay's `swapSend`.
