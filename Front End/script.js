// Listen for a click to change the current icon shown on the dropdown menu
// Network dropdown menu
const dropdownContent = document.querySelector(".dropdown-content");
const networkIcon = document.querySelector("#network-icon");
const svgIcon = document.querySelector("#network-icon + svg");

dropdownContent.addEventListener("click", function(event) {
    if (event.target.tagName === "A") {
        const network = event.target.getAttribute('data-network');
        const iconUrl = event.target.querySelector(".dropdown-icon").getAttribute("src");
        networkIcon.setAttribute("src", iconUrl);
        svgIcon.classList.remove("rotate");
    }
});

// inCoin dropdown menu
const inCoinDropdownContent = document.querySelector(".inCoin-dropdown-content");
const inCoinIcon = document.querySelector("#inCoin-icon");
const inCoinSvgIcon = document.querySelector("#inCoin-icon + svg");

inCoinDropdownContent.addEventListener("click", function(event) {
    if (event.target.tagName === "A") {
        const inCoin = event.target.getAttribute('data-network');
        const inCoinUrl = event.target.querySelector(".inCoin-dropdown-icon").getAttribute("src");
        inCoinIcon.setAttribute("src", inCoinUrl);
        inCoinSvgIcon.classList.remove("rotate");
    }
});

// outCoin dropdown menu
const outCoinDropdownContent = document.querySelector(".outCoin-dropdown-content");
const outCoinIcon = document.querySelector("#outCoin-icon");
const outCoinSvgIcon = document.querySelector("#outCoin-icon + svg");

outCoinDropdownContent.addEventListener("click", function(event) {
    if (event.target.tagName === "A") {
        const outCoin = event.target.getAttribute('data-network');
        const outCoinUrl = event.target.querySelector(".outCoin-dropdown-icon").getAttribute("src");
        outCoinIcon.setAttribute("src", outCoinUrl);
        outCoinSvgIcon.classList.remove("rotate");
    }
});

// Listen for a click to show the dropdown menu and rotate the SVG icon
// Network dropdown rotation
const dropdownButton = document.querySelector('.change-network');
const dropdownMenu = document.querySelector('.dropdown-content');

dropdownButton.addEventListener('click', function() {
  dropdownMenu.classList.toggle('show');
  svgIcon.classList.toggle('rotate');
});

// inCoin dropdown rotation
const inCoinDropdownButton = document.querySelector('.change-inCoin');
const inCoinDropdownMenu = document.querySelector('.inCoin-dropdown-content');

inCoinDropdownButton.addEventListener('click', function() {
    inCoinDropdownMenu.classList.toggle('show');
    inCoinSvgIcon.classList.toggle('rotate');
});

// outCoin dropdown rotation
const outCoinDropdownButton = document.querySelector('.change-outCoin');
const outCoinDropdownMenu = document.querySelector('.outCoin-dropdown-content');

outCoinDropdownButton.addEventListener('click', function() {
    outCoinDropdownMenu.classList.toggle('show');
    outCoinSvgIcon.classList.toggle('rotate');
});
