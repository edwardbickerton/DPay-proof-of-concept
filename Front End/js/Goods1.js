var button12 = document.getElementById("apple12");
var button24 = document.getElementById("apple24");
var appleImage = document.getElementById("appleImage");
var appleText = document.getElementById("appleText");
var sizeText = document.getElementById("sizeText")
var buyText = document.getElementById("p_buy")

button12.addEventListener("click", function() {
    appleImage.src = "../Front End/images/apple_12.jpg";
    appleText.textContent = " 12 Count";
    sizeText.textContent = "12 Organic Honeycrisp Apples"
    buyText.textContent = "You have selected 12-Count option, the price is ￡ 10"
  });
  
button24.addEventListener("click", function() {
    appleImage.src = "../Front End/images/apple_24.jpg";
    appleText.textContent = " 24 Count";
    sizeText.textContent = "24 Organic Honeycrisp Apples"
    buyText.textContent = "You have selected 24-Count option, the price is ￡ 18"
  });

function changeLink(value) {
  var link = document.getElementById('myLink');
  buyLink.href = "../Front End/Dpay.html?var1=value1&var2=" + value;
}
