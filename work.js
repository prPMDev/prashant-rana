document.addEventListener("DOMContentLoaded", function() {
    const workItems = document.querySelectorAll('.work-item');
    const popup = document.getElementById('popup');
    const closeBtn = document.querySelector('.close');
    const popupSidebar = document.querySelector('.popup-sidebar');
    const popupScroll = document.querySelector('.popup-scroll');

    // Load the JSON data for the selected company
    workItems.forEach(item => {
        item.addEventListener('click', () => {
            const company = item.getAttribute('data-company');
            fetch(`work-artifacts/${company}/work-samples.json`)
                .then(response => response.json())
                .then(data => {
                    // Clear previous content
                    popupSidebar.innerHTML = '';
                    popupScroll.innerHTML = '';

                    // Populate sidebar and scroll content
                    data.forEach((sample, index) => {
                        // Sidebar item
                        const sidebarItem = document.createElement('div');
                        sidebarItem.textContent = sample.title;
                        sidebarItem.classList.add('sidebar-item');
                        sidebarItem.addEventListener('click', () => {
                            document.querySelectorAll('.popup-item').forEach(item => item.classList.remove('active'));
                            document.getElementById(`popup-item-${index}`).classList.add('active');
                            document.querySelectorAll('.sidebar-item').forEach(item => item.classList.remove('active'));
                            sidebarItem.classList.add('active');
                        });
                        popupSidebar.appendChild(sidebarItem);

                        // Scroll content item
                        const popupItem = document.createElement('div');
                        popupItem.classList.add('popup-item');
                        popupItem.id = `popup-item-${index}`;

                        let mediaContent;
                        if (sample.media.type === 'image') {
                            mediaContent = `<img src="work-artifacts/${company}/${sample.media.src}" alt="${sample.title}">`;
                        } else if (sample.media.type === 'video') {
                            mediaContent = `<iframe width="100%" height="315" src="${sample.media.src}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
                        }

                        popupItem.innerHTML = `
                            <div class="top-half">
                                ${mediaContent}
                                <div>
                                    <h2>${sample.title}</h2>
                                    <p>${sample.description}</p>
                                </div>
                            </div>
                            <div class="bottom-half">
                                <h3>Additional Info</h3>
                                <p>${sample.additionalInfo}</p>
                            </div>
                        `;
                        popupScroll.appendChild(popupItem);
                    });

                    // Show the popup
                    popup.style.display = 'block';
                    document.querySelector('.sidebar-item').classList.add('active');
                    document.querySelector('.popup-item').classList.add('active');
                });
        });
    });

     // Close the popup
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            console.log('Close button clicked'); // Debugging
            popup.style.display = 'none';
        });
    }

    document.addEventListener("DOMContentLoaded", function() {
    const closeBtn = document.querySelector('.close');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            console.log('Close button clicked');
            popup.style.display = 'none';
        });
    }
});

    // Close the popup when clicking outside of it
    window.addEventListener('click', (event) => {
        if (event.target === popup) {
            popup.style.display = 'none';
        }
    });
});
