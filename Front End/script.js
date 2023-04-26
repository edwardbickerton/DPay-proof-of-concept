// Listen for a click, then change the network icon to the corresponding image
const dropdownContent = document.querySelector(".dropdown-content");
const coinDropdownContent = document.querySelector(".coin-dropdown-content");
const networkIcon = document.querySelector("#network-icon");
const coinIcon = document.querySelector("#coin-icon");
const svgIcon = document.querySelector("#network-icon + svg");
const coinSvgIcon = document.querySelector("#coin-icon + svg");
          
dropdownContent.addEventListener("click", function(event) {
    if (event.target.tagName === "A") {
        const network = event.target.getAttribute('data-network');
        const iconUrl = event.target.querySelector(".dropdown-icon").getAttribute("src");
        networkIcon.setAttribute("src", iconUrl);
        svgIcon.classList.remove("rotate");
    }
});

coinDropdownContent.addEventListener("click", function(event) {
    if (event.target.tagName === "A") {
        const coin = event.target.getAttribute('data-network');
        const coinUrl = event.target.querySelector(".coin-dropdown-icon").getAttribute("src");
        coinIcon.setAttribute("src", coinUrl);
        coinSvgIcon.classList.remove("rotate");
    }
});

// Listen for a click to show the dropdown menu and rotate the SVG icon
const dropdownButton = document.querySelector('.change-network');
const dropdownMenu = document.querySelector('.dropdown-content');
const coinDropdownButton = document.querySelector('.change-coin');
const coinDropdownMenu = document.querySelector('.coin-dropdown-content');

dropdownButton.addEventListener('click', function() {
  dropdownMenu.classList.toggle('show');
  svgIcon.classList.toggle('rotate');
});

coinDropdownButton.addEventListener('click', function() {
    coinDropdownMenu.classList.toggle('show');
    coinSvgIcon.classList.toggle('rotate');
});
