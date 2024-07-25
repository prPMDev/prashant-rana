document.addEventListener('DOMContentLoaded', function() {
  const workItems = document.querySelectorAll('.work-item');
  const popup = document.getElementById('workPopup');
  const popupTitle = popup.querySelector('.popup-title');
  const popupBody = popup.querySelector('.popup-body');
  const closeBtn = popup.querySelector('.close');

  workItems.forEach(item => {
    item.addEventListener('click', function() {
      const company = this.classList[1];
      popupTitle.textContent = company.charAt(0).toUpperCase() + company.slice(1);

      // Load the corresponding popup content based on the company
      fetch(`popup-content/${company}.html`)
        .then(response => response.text())
        .then(data => {
          popupBody.innerHTML = data;
          popup.style.display = 'block';
        });
    });
  });

  closeBtn.addEventListener('click', function() {
    popup.style.display = 'none';
  });

  window.addEventListener('click', function(event) {
    if (event.target == popup) {
      popup.style.display = 'none';
    }
  });
});