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

/* Network dropdown rotation */
const dropdownButton = document.querySelector('.change-network');
const dropdownMenu = document.querySelector('.dropdown-content');

dropdownButton.addEventListener('click', function() {
  dropdownMenu.classList.toggle('show');
  svgIcon.classList.toggle('rotate');
});

/* inCoin dropdown rotation */
const inCoinDropdownButton = document.querySelector('.change-inCoin');
const inCoinDropdownMenu = document.querySelector('.inCoin-dropdown-content');

inCoinDropdownButton.addEventListener('click', function() {
    inCoinDropdownMenu.classList.toggle('show');
    inCoinSvgIcon.classList.toggle('rotate');
});

/* outCoin dropdown rotation */
const outCoinDropdownButton = document.querySelector('.change-outCoin');
const outCoinDropdownMenu = document.querySelector('.outCoin-dropdown-content');

outCoinDropdownButton.addEventListener('click', function() {
    outCoinDropdownMenu.classList.toggle('show');
    outCoinSvgIcon.classList.toggle('rotate');
});

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
      return "0xa869";
    default:
      return null;
  }
}

/* Connect metamask account */
async function connect() {
    if (typeof window.ethereum !== "undefined") {
    await ethereum.request({method: "eth_requestAccounts"})
}
}

/* Calculated the coin quantity equal to the input GBP amount */
let selectedCoin = "";
let selectedSymbol = "";
let price;

// Add event listener to dropdown button
const dropdownBtn = document.querySelector(".inCoin-dropdown-content");
dropdownBtn.addEventListener("click", function(event) {
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




/* Execute the contract */
async function execute () {
    // the following are needed:
    // "outCoin": the contract address of the coin the recipient wants.
    // "outAmount": the amount of outCoin which the recipient is expecting.
    // "inCoin": the contract address of the coin the sender wants to spend.
    // "maxInAmount": the maximum amount of inCoin the user is willing to spend.
    // "recipient": the address of the recipient who will recieve outAmount of outCoin.

}