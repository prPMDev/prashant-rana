document.addEventListener('DOMContentLoaded', () => {
    const workItems = document.querySelectorAll('.work-item');
    const popup = document.getElementById('popup');
    const popupScroll = document.querySelector('.popup-scroll');
    const closeBtn = document.querySelector('.close');

    workItems.forEach(item => {
        item.addEventListener('click', () => {
            const company = item.getAttribute('data-company');
            loadWorkDetails(company);
            popup.style.display = 'block';
        });
    });

    closeBtn.addEventListener('click', () => {
        popup.style.display = 'none';
        popupScroll.innerHTML = ''; // Clear previous content
    });

    function loadWorkDetails(company) {
        const details = getWorkDetails(company);
        popupScroll.innerHTML = details.map(detail => `
            <div class="popup-item">
                <img src="${detail.image}" alt="${detail.title}">
                <h2>${detail.title}</h2>
                <p>${detail.description}</p>
            </div>
        `).join('');
    }

    function getWorkDetails(company) {
        const workDetails = {
            'Avalara': [
                { image: 'images/avalara-project-1.jpg', title: 'Project 1', description: 'Description of project 1.' },
                { image: 'images/avalara-project-2.jpg', title: 'Project 2', description: 'Description of project 2.' }
            ],
            'Oracle': [
                { image: 'images/oracle-project-1.jpg', title: 'Project 1', description: 'Description of project 1.' },
                { image: 'images/oracle-project-2.jpg', title: 'Project 2', description: 'Description of project 2.' }
            ],
            // Add other companies similarly
        };
        return workDetails[company] || [];
    }
});
