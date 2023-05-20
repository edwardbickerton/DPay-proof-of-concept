import { ethers } from "ethers";
import { useState } from "react";

/* Network dropdown menu */
const dropdownContent = document.querySelector(".dropdown-content");
const networkIcon = document.querySelector("#network-icon");
const svgIcon = document.querySelector("#network-icon + svg");

dropdownContent.addEventListener("click", function(event) {
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

inCoinDropdownContent.addEventListener("click", function(event) {
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

outCoinDropdownContent.addEventListener("click", function(event) {
    if (event.target.tagName === "A") {
        const outCoin = event.target.getAttribute('data-network');
        const outCoinUrl = event.target.querySelector(".outCoin-dropdown-icon").getAttribute("src");
        outCoinIcon.setAttribute("src", outCoinUrl);
    }
});

/* Network dropdown and arrow rotation */
const dropdownButton = document.querySelector('.change-network');
const dropdownMenu = document.querySelector('.dropdown-content');

dropdownButton.addEventListener('click', function() {
  dropdownMenu.classList.toggle('show');
  svgIcon.classList.toggle('rotate');
});

document.addEventListener('click', function(event) {
  if (!event.target.closest('.dropdown-content') && !event.target.closest('.change-network')) {
    dropdownMenu.classList.remove('show');
    svgIcon.classList.remove('rotate');
  }
});

/* inCoin dropdown and arrow rotation */
const inCoinDropdownButton = document.querySelector('.change-inCoin');
const inCoinDropdownMenu = document.querySelector('.inCoin-dropdown-content');

inCoinDropdownButton.addEventListener('click', function() {
    inCoinDropdownMenu.classList.toggle('show');
    inCoinSvgIcon.classList.toggle('rotate');
});

document.addEventListener('click', function(event) {
  if (!event.target.closest('.inCoin-dropdown-content') && !event.target.closest('.change-inCoin')) {
    inCoinDropdownMenu.classList.remove('show');
    svgIcon.classList.remove('rotate');
  }
});

/* outCoin dropdown rotation */
const outCoinDropdownButton = document.querySelector('.change-outCoin');
const outCoinDropdownMenu = document.querySelector('.outCoin-dropdown-content');

outCoinDropdownButton.addEventListener('click', function() {
    outCoinDropdownMenu.classList.toggle('show');
    outCoinSvgIcon.classList.toggle('rotate');
});

document.addEventListener('click', function(event) {
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
        params: [{ chainId: getChainId(network) }],
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


// Connect metamask account
async function connect() {
    if (typeof window.ethereum !== "undefined") {
    await ethereum.request({method: "eth_requestAccounts"})
    }else{
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
inDropdownBtn.addEventListener("click", function(event) {
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
outDropdownBtn.addEventListener("click", function(event) {
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
outCoinInput.addEventListener("input", function() {
  const outCoinQuantity = parseFloat(outCoinInput.value);
  const inCoinQuantity = calculateInCoinQuantity(outCoinQuantity);
  const quantityLabel = document.querySelector("#inCoin-quantity-label #inCoin-transfer-quantity");
  if (!isNaN(inCoinQuantity)) {
    quantityLabel.textContent = `${inCoinQuantity.toFixed(6)} ${selectedInSymbol}`;
  } else {
    quantityLabel.textContent = "";
  }
});

//
const [isConnected, setIsConnect] = useState(false);
const [signer, setSigner] = useState();

/* Execute the contract */
async function execute() {
    // the following are needed:
    // "outCoin": the contract address of the coin the recipient wants.
    // "outAmount": the amount of outCoin which the recipient is expecting.
    // "inCoin": the contract address of the coin the sender wants to spend.
    // "maxInAmount": the maximum amount of inCoin the user is willing to spend.
    // "recipient": the address of the recipient who will recieve outAmount of outCoin.
    if (typeof window.ethereum !== "undefined") {
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
        try {
            // address outCoin,
            // uint256 outAmount,
            // address recipient
            await contract.swapEthSendToken("", 0.0, "");
        } catch (error) {
            console.log(error);
        }
    } else {
        alert("Please install MetaMask")
    }
}