document.addEventListener('DOMContentLoaded', function() {
    loadReadingList();
});

async function loadReadingList() {
    try {
        // Try relative path without leading slash
        const response = await fetch('./data/books.json');  // Changed from '/data/books.json'
        if (!response.ok) {
            console.error('Response not ok:', response.status, response.statusText);
            throw new Error('Failed to load books data');
        }

        const data = await response.json();
        console.log('Books data loaded:', data);

        const currentlyReading = data.books.filter(book => book.status === 'reading')
            .sort((a, b) => new Date(b.lastStarted) - new Date(a.lastStarted));

        const completedBooks = data.books.filter(book => book.status === 'completed')
            .sort((a, b) => new Date(b.lastCompleted) - new Date(a.lastCompleted));

        await populateBookList('currentlyReading', currentlyReading, data.config);
        await populateBookList('inspiredBy', completedBooks, data.config);

    } catch (error) {
        console.error('Error loading reading list:', error);
        showError('Failed to load reading list. Check console for details.');
    }
}

async function populateBookList(elementId, books, config) { // Added config parameter
    const container = document.getElementById(elementId);
    if (!container) {
        console.error(`Container #${elementId} not found`);
        return;
    }

    console.log(`Populating ${elementId} with ${books.length} books`);
    container.innerHTML = ''; // Clear existing content

    for (const book of books) {
        try {
            const bookElement = document.createElement('div');
            bookElement.className = 'book-item';

            const imageUrl = getBookImageUrl(book, config); // Pass config to getBookImageUrl
            console.log(`Loading image for "${book.title}" from: ${imageUrl}`);

            bookElement.innerHTML = `
                <div class="book-container">
                    <div class="category-label ${book.category.toLowerCase()}">
                        ${book.category}
                    </div>
                    <div class="book-image">
                        <img
                            src="${imageUrl}"
                            alt="${book.title}"
                            loading="lazy"
                            onerror="this.onerror=null; this.src='https://placehold.co/120x180/e9ecef/495057?text=Book';"
                        >
                        <div class="book-rating">${'★'.repeat(Math.round(book.rating))}</div>
                    </div>
                    <div class="book-info">
                        <h3>${book.title}</h3>
                        <p class="author">by ${book.author}</p>
                        <p class="blurb">${book.blurb}</p>
                    </div>
                </div>
            `;

            container.appendChild(bookElement);
        } catch (error) {
            console.error(`Error creating book element for "${book.title}":`, error);
        }
    }
}

function getBookImageUrl(book, config) {
    if (!config) {
        console.error('Config missing for book:', book.title);
        return 'https://placehold.co/120x180/e9ecef/495057?text=Book';
    }

    try {
        const imageUrl = `${config.imageBaseUrl}?id=${book.googleBooksId}&${config.imageParams}`;
        console.log(`Generated image URL for "${book.title}":`, imageUrl);
        return imageUrl;
    } catch (error) {
        console.error('Error constructing image URL:', error);
        return `${config.imageFallbackUrl || 'https://placehold.co/120x180/e9ecef/495057?text='}${encodeURIComponent(book.title)}`;
    }
}

function showError(message) {
    console.error('Error:', message);
    const container = document.querySelector('.reading-section');
    if (container) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        container.insertBefore(errorDiv, container.firstChild);
    }
}