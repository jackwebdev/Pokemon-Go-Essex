
// Modal

// Basildon
let modalBasildonWhatsApp = document.getElementById('modal-basildon-Whatsapp');
let basildonElements = document.getElementsByClassName('basildon-toggle-modal');
for (var i = 0; i < basildonElements.length; i++) {
  basildonElements[i].addEventListener('click', basildonToggleClass);
}
function basildonToggleClass() { modalBasildonWhatsApp.classList.toggle('is-active'); }

// Noak Bridge
let modalNoakbridgeWhatsApp = document.getElementById('modal-noakbridge-Whatsapp');
let noakbridgeElements = document.getElementsByClassName('noakbridge-toggle-modal');
for (var i = 0; i < noakbridgeElements.length; i++) {
  noakbridgeElements[i].addEventListener('click', noakbridgeToggleClass);
}
function noakbridgeToggleClass() { modalNoakbridgeWhatsApp.classList.toggle('is-active'); }

// Close Modal
function closeModal() { 
  modalBasildonWhatsApp.classList.remove('is-active'); 
  modalNoakbridgeWhatsApp.classList.remove('is-active');
}

// Escape Key
document.onkeydown = function(evt) {
  evt = evt || window.event;
  var isEscape = false;
  if ("key" in evt) {
      isEscape = (evt.key == "Escape" || evt.key == "Esc");
  } else {
      isEscape = (evt.keyCode == 27);
  }
  if (isEscape) {
    closeModal();
  }
};

// Disable Right Click
document.getElementsByTagName("body")[0].oncontextmenu = function(e){ e.preventDefault();}

// Image Click 
function bestLocations() {
  console.log('click');
  return window.location.href = '/best-locations';
  // return window.location.href = '/best-locations.html';
  
}