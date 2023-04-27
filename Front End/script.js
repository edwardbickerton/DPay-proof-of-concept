// Listen for a click, then change the network icon to the corresponding image
const dropdownContent = document.querySelector(".dropdown-content");
const outCoinDropdownContent = document.querySelector(".outCoin-dropdown-content");
const networkIcon = document.querySelector("#network-icon");
const outCoinIcon = document.querySelector("#outCoin-icon");
const svgIcon = document.querySelector("#network-icon + svg");
const outCoinSvgIcon = document.querySelector("#outCoin-icon + svg");
          
dropdownContent.addEventListener("click", function(event) {
    if (event.target.tagName === "A") {
        const network = event.target.getAttribute('data-network');
        const iconUrl = event.target.querySelector(".dropdown-icon").getAttribute("src");
        networkIcon.setAttribute("src", iconUrl);
        svgIcon.classList.remove("rotate");
    }
});

outCoinDropdownContent.addEventListener("click", function(event) {
    if (event.target.tagName === "A") {
        const outCoin = event.target.getAttribute('data-network');
        const outCoinUrl = event.target.querySelector(".outCoin-dropdown-icon").getAttribute("src");
        outCoinIcon.setAttribute("src", outCoinUrl);
        outCoinSvgIcon.classList.remove("rotate");
    }
});

// Listen for a click to show the dropdown menu and rotate the SVG icon
const dropdownButton = document.querySelector('.change-network');
const dropdownMenu = document.querySelector('.dropdown-content');
const outCoinDropdownButton = document.querySelector('.change-outCoin');
const outCoinDropdownMenu = document.querySelector('.outCoin-dropdown-content');

dropdownButton.addEventListener('click', function() {
  dropdownMenu.classList.toggle('show');
  svgIcon.classList.toggle('rotate');
});

outCoinDropdownButton.addEventListener('click', function() {
    outCoinDropdownMenu.classList.toggle('show');
    outCoinSvgIcon.classList.toggle('rotate');
});
