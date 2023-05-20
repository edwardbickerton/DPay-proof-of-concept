var button12 = document.getElementById("apple12");
var button24 = document.getElementById("apple24");
var appleImage = document.getElementById("appleImage");
var appleText = document.getElementById("appleText");

button12.addEventListener("click", function() {
    appleImage.src = "../Test/images/apple_12.jpg";
    appleText.textContent = " 12 Count";
  });
  
button24.addEventListener("click", function() {
    appleImage.src = "../Test/images/apple_24.jpg";
    appleText.textContent = " 24 Count";
  });
  
  
  
  
  
  