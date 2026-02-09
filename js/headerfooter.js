// headerfooter.js
document.addEventListener('DOMContentLoaded', function() {
    // Load header
    fetch('header.html')
        .then(response => {
            if (!response.ok) throw new Error('Failed to load header');
            return response.text();
        })
        .then(data => {
            const headerPlaceholder = document.getElementById('header-placeholder');
            if (headerPlaceholder) {
                headerPlaceholder.innerHTML = data;
            } else {
                console.error('Header placeholder not found');
            }
        })
        .catch(error => {
            console.error('Error loading header:', error);
            // Fallback header if loading fails
            document.getElementById('header-placeholder').innerHTML = `
                <header>
                    <div class="header-content">
                        <div class="logo">
                            <a href="index.html">prashant rana</a>
                        </div>
                        <nav class="navigation">
                            <a href="work.html">Work</a>
                            <a href="community.html">Community</a>
                            <a href="reading-list.html">Reading List</a>
                            <a href="https://www.linkedin.com/in/prashant-rana/" target="_blank">Get in Touch</a>
                        </nav>
                    </div>
                </header>
            `;
        });

    // Load footer
    fetch('footer.html')
        .then(response => {
            if (!response.ok) throw new Error('Failed to load footer');
            return response.text();
        })
        .then(data => {
            const footerPlaceholder = document.getElementById('footer-placeholder');
            if (footerPlaceholder) {
                footerPlaceholder.innerHTML = data;
                const yearSpan = document.getElementById('footer-year');
                if (yearSpan) yearSpan.textContent = new Date().getFullYear();
            } else {
                console.error('Footer placeholder not found');
            }
        })
        .catch(error => {
            console.error('Error loading footer:', error);
            // Fallback footer if loading fails
            document.getElementById('footer-placeholder').innerHTML = `
                <footer>
                    © ${new Date().getFullYear()} Prashant Rana. All rights reserved.
                </footer>
            `;
        });
});