
// Modal

// Basildon
let modalBasildonWhatsApp = document.getElementById('modal-basildon-Whatsapp');
let basildonElements = document.getElementsByClassName('basildon-toggle-modal');
for (var i = 0; i < basildonElements.length; i++) {
  basildonElements[i].addEventListener('click', toggleClass);
}
function toggleClass() { modalBasildonWhatsApp.classList.toggle('is-active'); }

// Noak Bridge
let modalNoakbridgeWhatsApp = document.getElementById('modal-noakbridge-Whatsapp');
let noakbridgeElements = document.getElementsByClassName('noakbridge-toggle-modal');
for (var i = 0; i < noakbridgeElements.length; i++) {
  noakbridgeElements[i].addEventListener('click', toggleClass);
}
function toggleClass() { modalNoakbridgeWhatsApp.classList.toggle('is-active'); }



