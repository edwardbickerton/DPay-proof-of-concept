/* Network dropdown menu */
const dropdownContent = document.querySelector(".dropdown-content");
const networkIcon = document.querySelector("#network-icon");
const svgIcon = document.querySelector("#network-icon + svg");

dropdownContent.addEventListener("click", function (event) {
    if (event.target.tagName === "A") {
        const network = event.target.getAttribute('data-network');
        const iconUrl = event.target.querySelector(".dropdown-icon").getAttribute("src");
        networkIcon.setAttribute("src", iconUrl);
    }
});

/* inCoin dropdown menu */
const inCoinDropdownContent = document.querySelector(".inCoin-dropdown-content");
const inCoinIcon = document.querySelector("#inCoin-icon");
const inCoinSvgIcon = document.querySelector("#inCoin-icon + svg");

inCoinDropdownContent.addEventListener("click", function (event) {
    if (event.target.tagName === "A") {
        const inCoin = event.target.getAttribute('data-network');
        const inCoinUrl = event.target.querySelector(".inCoin-dropdown-icon").getAttribute("src");
        inCoinIcon.setAttribute("src", inCoinUrl);
    }
});

/* outCoin dropdown menu */
const outCoinDropdownContent = document.querySelector(".outCoin-dropdown-content");
const outCoinIcon = document.querySelector("#outCoin-icon");
const outCoinSvgIcon = document.querySelector("#outCoin-icon + svg");

outCoinDropdownContent.addEventListener("click", function (event) {
    if (event.target.tagName === "A") {
        const outCoin = event.target.getAttribute('data-network');
        const outCoinUrl = event.target.querySelector(".outCoin-dropdown-icon").getAttribute("src");
        outCoinIcon.setAttribute("src", outCoinUrl);
    }
});

/* Network dropdown and arrow rotation */
const dropdownButton = document.querySelector('.change-network');
const dropdownMenu = document.querySelector('.dropdown-content');

dropdownButton.addEventListener('click', function () {
    dropdownMenu.classList.toggle('show');
    svgIcon.classList.toggle('rotate');
});

document.addEventListener('click', function (event) {
    if (!event.target.closest('.dropdown-content') && !event.target.closest('.change-network')) {
        dropdownMenu.classList.remove('show');
        svgIcon.classList.remove('rotate');
    }
});

/* inCoin dropdown and arrow rotation */
const inCoinDropdownButton = document.querySelector('.change-inCoin');
const inCoinDropdownMenu = document.querySelector('.inCoin-dropdown-content');

inCoinDropdownButton.addEventListener('click', function () {
    inCoinDropdownMenu.classList.toggle('show');
    inCoinSvgIcon.classList.toggle('rotate');
});

document.addEventListener('click', function (event) {
    if (!event.target.closest('.inCoin-dropdown-content') && !event.target.closest('.change-inCoin')) {
        inCoinDropdownMenu.classList.remove('show');
        svgIcon.classList.remove('rotate');
    }
});

/* outCoin dropdown rotation */
const outCoinDropdownButton = document.querySelector('.change-outCoin');
const outCoinDropdownMenu = document.querySelector('.outCoin-dropdown-content');

outCoinDropdownButton.addEventListener('click', function () {
    outCoinDropdownMenu.classList.toggle('show');
    outCoinSvgIcon.classList.toggle('rotate');
});

document.addEventListener('click', function (event) {
    if (!event.target.closest('.outCoin-dropdown-content') && !event.target.closest('.change-outCoin')) {
        outCoinDropdownMenu.classList.remove('show');
        svgIcon.classList.remove('rotate');
    }
})

/* Change the blockchain network */
const dropdownLinks = document.querySelectorAll('.dropdown-content a');

dropdownLinks.forEach(link => {
    link.addEventListener("click", async (event) => {
        event.preventDefault();

        const network = event.target.getAttribute("data-network");

        try {
            await ethereum.request({
                method: "wallet_switchEthereumChain",
                params: [{chainId: getChainId(network)}],
            });
        } catch (error) {
            console.error(error);
        }
    });
});

function getChainId(network) {
    switch (network) {
        case "Ethereum":
            return "0x1";
        case "BNB Chain":
            return "0x38";
        case "Polygon":
            return "0x89";
        case "Optimism":
            return "0xa869";
        default:
            return null;
    }
}


/* Connect metamask account */
async function connect() {
    if (typeof window.ethereum !== "undefined") {
        await ethereum.request({method: "eth_requestAccounts"})
    } else {
        alert("You haven't get metamask installed, please install it on the web site!")
    }
}

/* Calculated the coin quantity equal to the input GBP amount */
let selectedCoin = "";
let selectedSymbol = "";
let price;

// Add event listener to dropdown button
const dropdownBtn = document.querySelector(".inCoin-dropdown-content");
dropdownBtn.addEventListener("click", function (event) {
    // Get the selected coin from the clicked dropdown item
    if (event.target.tagName === "A") {
        selectedCoin = event.target.getAttribute("data-coin");
        selectedSymbol = event.target.getAttribute("data-symbol");
        const apiUrl = `https://api.coingecko.com/api/v3/simple/price?ids=${selectedCoin}&vs_currencies=GBP`;

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                price = data[selectedCoin].gbp;
                console.log(price); // This will print the price in GBP to the console

                const gbpInput = document.querySelector("#transfer-gbp-value");
                const quantityLabel = document.querySelector("#quantity-label #transfer-quantity");
                const gbpValue = gbpInput.value;
                const quantity = (gbpValue * 1.1) / price;
                quantityLabel.textContent = `${quantity.toFixed(6)} ${selectedSymbol}`;
            })
            .catch(error => console.error(error));
    }
});

// import { ethers } from "ethers";
// import { useState } from "react";
const [isConnected, setIsConnect] = useState(false);
const [signer, setSigner] = useState();
const outCoinAddressMap = new Map();
outCoinAddressMap.set("USDT", "0xdAC17F958D2ee523a2206206994597C13D831ec7");
outCoinAddressMap.set("USDC", "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48");
outCoinAddressMap.set("BNB", "0xb8c77482e45f1f44de1745f52c74426c631bdd52");
outCoinAddressMap.set("WBTC", "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599");
outCoinAddressMap.set("MATIC", "0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0");
outCoinAddressMap.set("SHIB", "0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce");

const inCoinAddressMap = new Map();
outCoinAddressMap.set("USDT", "0xdAC17F958D2ee523a2206206994597C13D831ec7");
outCoinAddressMap.set("USDC", "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48");
outCoinAddressMap.set("GBPT", "0x86b4dbe5d203e634a12364c0e428fa242a3fba98");

let dataSymbolForCoinAddress = ""
dropdownBtn.addEventListener("click", function (event) {

    if (event && event.target.tagName === "A") {
        dataSymbolForCoinAddress = event.target.getAttribute("data-symbol");
    }

});

// Add event listener to out coin dropdown button
const outCoinDropdownBtn = document.querySelector(".outCoin-dropdown-content");

let outCoinSymbolForAddress = "";
outCoinDropdownBtn.addEventListener("click", function (event) {
    if (event && event.target.tagName === "A") {
        outCoinSymbolForAddress = event.target.getAttribute("data-symbol");
    }
});

/* Execute the contract */
async function execute() {
    // the following are needed:
    // "outCoin": the contract address of the coin the recipient wants.
    // "outAmount": the amount of outCoin which the recipient is expecting.
    // "inCoin": the contract address of the coin the sender wants to spend.
    // "maxInAmount": the maximum amount of inCoin the user is willing to spend.
    // "recipient": the address of the recipient who will recieve outAmount of outCoin.

    const contractAddress = ""; // the address of contract
    const abi = [
        {
            inputs: [
                {
                    internalType: "string",
                    name: "_name",
                    type: "string",
                },
                {
                    internalType: "uint256",
                    name: "_favoriteNumber",
                    type: "uint256",
                },
            ],
            name: "addPerson",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
        },
        {
            inputs: [
                {
                    internalType: "string",
                    name: "",
                    type: "string",
                },
            ],
            name: "nameToFavoriteNumber",
            outputs: [
                {
                    internalType: "uint256",
                    name: "",
                    type: "uint256",
                },
            ],
            stateMutability: "view",
            type: "function",
        },
        {
            inputs: [
                {
                    internalType: "uint256",
                    name: "",
                    type: "uint256",
                },
            ],
            name: "people",
            outputs: [
                {
                    internalType: "uint256",
                    name: "favoriteNumber",
                    type: "uint256",
                },
                {
                    internalType: "string",
                    name: "name",
                    type: "string",
                },
            ],
            stateMutability: "view",
            type: "function",
        },
        {
            inputs: [],
            name: "retrieve",
            outputs: [
                {
                    internalType: "uint256",
                    name: "",
                    type: "uint256",
                },
            ],
            stateMutability: "view",
            type: "function",
        },
        {
            inputs: [
                {
                    internalType: "uint256",
                    name: "_favoriteNumber",
                    type: "uint256",
                },
            ],
            name: "store",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
        },
    ];
    const contract = new ethers.Contract(contractAddress, abi, signer);

    if (dataSymbolForCoinAddress === "ETH") {
        if (typeof window.ethereum !== "undefined") {
            try {
                // address outCoin,
                // uint256 outAmount,
                // address recipient
                await contract.swapEthSendToken(
                    outCoinAddressMap.get(outCoinSymbolForAddress),
                    Number(Document.getElementById("transfer-gbp-value").value),
                    Document.getElementById("recipient"));
            } catch (error) {
                console.log(error);
            }
        } else {
            alert("Please install MetaMask")
        }
    } else {
        if (typeof window.ethereum !== "undefined") {
            try {
                //address outCoin,
                //uint256 outAmount,
                //address inCoin,
                //uint256 maxInAmount,
                //address recipient
                await contract.swapTokenSendToken("", Number(Document.getElementById("transfer-gbp-value").value), Document.getElementById("recipient"));
            } catch (error) {
                console.log(error);
            }
        } else {
            alert("Please install MetaMask")
        }
    }

}