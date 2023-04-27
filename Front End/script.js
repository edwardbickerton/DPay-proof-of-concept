// Listen for a click, then change the network icon to the corresponding image
const dropdownContent = document.querySelector(".dropdown-content");
const inCoinDropdownContent = document.querySelector(".inCoin-dropdown-content");
const networkIcon = document.querySelector("#network-icon");
const inCoinIcon = document.querySelector("#inCoin-icon");
const svgIcon = document.querySelector("#network-icon + svg");
const inCoinSvgIcon = document.querySelector("#inCoin-icon + svg");
          
dropdownContent.addEventListener("click", function(event) {
    if (event.target.tagName === "A") {
        const network = event.target.getAttribute('data-network');
        const iconUrl = event.target.querySelector(".dropdown-icon").getAttribute("src");
        networkIcon.setAttribute("src", iconUrl);
        svgIcon.classList.remove("rotate");
    }
});

inCoinDropdownContent.addEventListener("click", function(event) {
    if (event.target.tagName === "A") {
        const inCoin = event.target.getAttribute('data-network');
        const inCoinUrl = event.target.querySelector(".inCoin-dropdown-icon").getAttribute("src");
        inCoinIcon.setAttribute("src", inCoinUrl);
        inCoinSvgIcon.classList.remove("rotate");
    }
});

// Listen for a click to show the dropdown menu and rotate the SVG icon
const dropdownButton = document.querySelector('.change-network');
const dropdownMenu = document.querySelector('.dropdown-content');
const inCoinDropdownButton = document.querySelector('.change-inCoin');
const inCoinDropdownMenu = document.querySelector('.inCoin-dropdown-content');

dropdownButton.addEventListener('click', function() {
  dropdownMenu.classList.toggle('show');
  svgIcon.classList.toggle('rotate');
});

inCoinDropdownButton.addEventListener('click', function() {
    inCoinDropdownMenu.classList.toggle('show');
    inCoinSvgIcon.classList.toggle('rotate');
});
