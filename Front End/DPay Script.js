import {ethers} from "ethers";
// import {useState} from "react";

// const [isConnected, setIsConnect] = useState(false);

/**
 * signer: To sign the transaction when interact with the contract
 */
// const [signer, setSigner] = useState();

/* get the parameter */
let params = new URLSearchParams(window.location.search);
let goods_type = params.get('var1');
let goods_price = params.get('var2');

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
            return "0xA";
        case "Arbitrum One":
            return "0xA4B1"
        case "Celo Mainnet":
            return "0xA4EC";
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

// Defining variables for quantity calculations
let selectedInCoin = "";
let selectedInSymbol = "";
let inCoinPrice;

let selectedOutCoin = "";
let selectedOutSymbol = "";
let outCoinPrice;

// Function to calculate the inCoin quantity based on the specified outCoin quantity
function calculateInCoinQuantity(outCoinQuantity) {
    return (outCoinQuantity * outCoinPrice * 1.1) / inCoinPrice;
}

// Add event listener to inCoin dropdown button
const inDropdownBtn = document.querySelector(".inCoin-dropdown-content");
inDropdownBtn.addEventListener("click", function (event) {
    // Get the selected coin from the clicked dropdown item
    if (event.target.tagName === "A") {
        selectedInCoin = event.target.getAttribute("data-inCoin");
        selectedInSymbol = event.target.getAttribute("data-inSymbol");
        let apiUrl = `https://api.coingecko.com/api/v3/simple/price?ids=${selectedInCoin}&vs_currencies=GBP`;
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                inCoinPrice = data[selectedInCoin].gbp;
                console.log(inCoinPrice); // This will print the price in GBP to the console

                // Calculate the inCoin quantity if the outCoin price is available
                if (outCoinPrice) {
                    const outCoinQuantity = parseFloat(document.querySelector("#outCoin-transfer-quantity").value);
                    const inCoinQuantity = calculateInCoinQuantity(outCoinQuantity);
                    const quantityLabel = document.querySelector("#inCoin-quantity-label #inCoin-transfer-quantity");
                    if (!isNaN(inCoinQuantity)) {
                        quantityLabel.textContent = `${inCoinQuantity.toFixed(6)} ${selectedInSymbol}`;
                    } else {
                        quantityLabel.textContent = "";
                    }
                }
            })
            .catch(error => console.error(error));
    }
});

// Add event listener to outCoin dropdown button
const outDropdownBtn = document.querySelector(".outCoin-dropdown-content");
outDropdownBtn.addEventListener("click", function (event) {
    // Get the selected coin from the clicked dropdown item
    if (event.target.tagName === "A") {
        selectedOutCoin = event.target.getAttribute("data-outCoin");
        selectedOutSymbol = event.target.getAttribute("data-outSymbol");
        let apiUrl = `https://api.coingecko.com/api/v3/simple/price?ids=${selectedOutCoin}&vs_currencies=GBP`;
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                outCoinPrice = data[selectedOutCoin].gbp;
                console.log(outCoinPrice); // This will print the price in GBP to the console

                // Calculate the inCoin quantity if the inCoin price is available
                if (inCoinPrice) {
                    const outCoinQuantity = parseFloat(document.querySelector("#outCoin-transfer-quantity").value);
                    const inCoinQuantity = calculateInCoinQuantity(outCoinQuantity);
                    const quantityLabel = document.querySelector("#inCoin-quantity-label #inCoin-transfer-quantity");
                    if (!isNaN(inCoinQuantity)) {
                        quantityLabel.textContent = `${inCoinQuantity.toFixed(6)} ${selectedInSymbol}`;
                    } else {
                        quantityLabel.textContent = "";
                    }
                }
            })
            .catch(error => console.error(error));
    }
});

// Function to handle input change in the outCoin quantity and dynamically update quantity
const outCoinInput = document.querySelector("#outCoin-transfer-quantity");
outCoinInput.addEventListener("input", function () {
    const outCoinQuantity = parseFloat(outCoinInput.value);
    const inCoinQuantity = calculateInCoinQuantity(outCoinQuantity);
    const quantityLabel = document.querySelector("#inCoin-quantity-label #inCoin-transfer-quantity");
    if (!isNaN(inCoinQuantity)) {
        quantityLabel.textContent = `${inCoinQuantity.toFixed(6)} ${selectedInSymbol}`;
    } else {
        quantityLabel.textContent = "";
    }
});

/**
 * The out coin address on ETH chain
 * @type {Map<String, String>}
 */
const outCoinAddressMap = new Map();
outCoinAddressMap.set("USDT", "0xdAC17F958D2ee523a2206206994597C13D831ec7");
outCoinAddressMap.set("USDC", "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48");
outCoinAddressMap.set("BNB", "0xb8c77482e45f1f44de1745f52c74426c631bdd52");
outCoinAddressMap.set("WBTC", "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599");
outCoinAddressMap.set("MATIC", "0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0");
outCoinAddressMap.set("SHIB", "0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce");

/**
 * The in coin address on ETH chain
 * @type {Map<String, String>}
 */
const inCoinAddressMap = new Map();
outCoinAddressMap.set("USDT", "0xdAC17F958D2ee523a2206206994597C13D831ec7");
outCoinAddressMap.set("USDC", "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48");
outCoinAddressMap.set("GBPT", "0x86b4dbe5d203e634a12364c0e428fa242a3fba98");

/**
 * To store the user selected coin type from the web page
 * @type {string}
 */
let dataSymbolForCoinAddress = "";

/**
 * If the users choose to use a coin that doesn't listed on the inCoinDropdown menu,
 * then get the value (a coin address on ETH chain) from the input label and
 * store it here.
 * @type {string}
 */
let inCoinInputAddress = "";

inCoinDropdownContent.addEventListener("click", function (event) {

    if (event && event.target.tagName === "A") {
        dataSymbolForCoinAddress = event.target.getAttribute("data-inSymbol");
        if (dataSymbolForCoinAddress === "ERC-20") {
            // user choose to use coin that doesn't list on the dropdown menu
            // get the input address of that coin
            inCoinInputAddress = document.getElementById("inCoinErc20-token-address").value;
        }
    }

});

// Add event listener to out coin dropdown button
/**
 * The out coin drop down button to add listener to get the users' selection on which
 * coin the recipient want
 * @type {Element}
 */
const outCoinDropdownBtn = document.querySelector(".outCoin-dropdown-content");

/**
 * To store the user selected coin type from the web page
 * @type {string}
 */
let outCoinSymbolForAddress = "";

/**
 * If the users choose to use a coin that doesn't listed on the outCoinDropdown menu,
 * then get the value (a coin address on ETH chain) from the input label and
 * store it here.
 * @type {string}
 */
let outCoinInputAddress = "";

outCoinDropdownBtn.addEventListener("click", function (event) {
    if (event && event.target.tagName === "A") {
        outCoinSymbolForAddress = event.target.getAttribute("data-outSymbol");
        if (dataSymbolForCoinAddress === "ERC-20") {
            // user choose to use coin that doesn't list on the dropdown menu
            // get the input address of that coin
            outCoinInputAddress = document.getElementById("outCoinErc20-token-address").value;
        }
    }
});

/* Execute the contract */
/**
 * The main function to interact with the contract.
 * @returns {Promise<void>}
 */
async function execute() {
    alert("Executing...");
    // the following are needed:
    // "outCoin": the contract address of the coin the recipient wants.
    // "outAmount": the amount of outCoin which the recipient is expecting.
    // "inCoin": the contract address of the coin the sender wants to spend.
    // "maxInAmount": the maximum amount of inCoin the user is willing to spend.
    // "recipient": the address of the recipient who will receive outAmount of outCoin.

    const signer = getWallet();
    const contractAddress = ""; // the address of contract
    const abi = [
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "outCoin",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "outAmount",
                    "type": "uint256"
                },
                {
                    "internalType": "address",
                    "name": "recipient",
                    "type": "address"
                }
            ],
            "name": "swapEthSendToken",
            "outputs": [],
            "stateMutability": "payable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "outCoin",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "outAmount",
                    "type": "uint256"
                },
                {
                    "internalType": "address",
                    "name": "inCoin",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "maxInAmount",
                    "type": "uint256"
                },
                {
                    "internalType": "address",
                    "name": "recipient",
                    "type": "address"
                }
            ],
            "name": "swapTokenSendToken",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        }
    ];
    const contract = new ethers.Contract(contractAddress, abi, await signer);

    if (dataSymbolForCoinAddress === "ETH") {
        if (typeof window.ethereum !== "undefined") {
            try {
                // address outCoin,
                // uint256 outAmount,
                // address recipient
                await contract.swapEthSendToken(
                    outCoinInputAddress === "" ? outCoinAddressMap.get(outCoinSymbolForAddress) : outCoinInputAddress,
                    Number(Document.getElementById("transfer-gbp-value").value),
                    Document.getElementById("recipient"));
            } catch (error) {
                alert("Transaction failed! Please check if you input the right coin address.");
                console.log(error);
            }
        } else {
            alert("Please install MetaMask")
        }
    } else {
        if (typeof window.ethereum !== "undefined") {
            let outAmount = Number(Document.getElementById("transfer-gbp-value").value);
            try {
                //address outCoin,
                //uint256 outAmount,
                //address inCoin,
                //uint256 maxInAmount,
                //address recipient
                await contract.swapTokenSendToken(
                    // outCoin
                    outCoinInputAddress === "" ? outCoinAddressMap.get(outCoinSymbolForAddress) : outCoinInputAddress,
                    outAmount, // outAmount
                    // inCoin
                    inCoinInputAddress === "" ? inCoinAddressMap.get(dataSymbolForCoinAddress) : inCoinInputAddress,
                    calculateInCoinQuantity(outAmount), // maxInAmount
                    Document.getElementById("recipient")); // recipient
            } catch (error) {
                alert("Transaction failed! Please check if you input the right coin address.");
                console.log(error);
            }
        } else {
            alert("Please install MetaMask")
        }
    }

}

async function getWallet(){
    let connectedProvider = new ethers.providers.Web3Provider(
        window.ethereum
    );
    let signer = connectedProvider.getSigner();
    return signer;
}

/**
 * When user click pay button, the listener inside onPay will send the transaction into blockchain
 * @type {Element}
 */
const onPay = document.querySelector(".confirm-payment");

onPay.addEventListener("click", function (event) {
    execute();
})