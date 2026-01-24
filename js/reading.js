let currentType = 'all';
let booksData = null;
let configData = null;

document.addEventListener('DOMContentLoaded', function() {
    loadReadingList();
    initializeTypeToggle();
});

function initializeTypeToggle() {
    const toggleContainer = document.querySelector('.type-toggle');
    if (!toggleContainer) return;

    toggleContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('type-pill')) {
            const type = e.target.dataset.type;
            if (type && type !== currentType) {
                setActiveType(type);
            }
        }
    });
}

function setActiveType(type) {
    currentType = type;
    document.querySelectorAll('.type-pill').forEach(pill => {
        pill.classList.toggle('active', pill.dataset.type === type);
    });
    renderBooks();
}

async function loadReadingList() {
    try {
        const response = await fetch('./data/books.json');
        if (!response.ok) {
            console.error('Response not ok:', response.status, response.statusText);
            throw new Error('Failed to load books data');
        }

        const data = await response.json();
        booksData = data.books;
        configData = data.config;

        renderBooks();

    } catch (error) {
        console.error('Error loading reading list:', error);
        showError('Failed to load reading list. Check console for details.');
    }
}

function filterBooksByType(books) {
    if (currentType === 'all') return books;
    return books.filter(book => book.types && book.types.includes(currentType));
}

function sortBooks(books) {
    return books.sort((a, b) => {
        // Reading books first, then by date
        if (a.status === 'reading' && b.status !== 'reading') return -1;
        if (a.status !== 'reading' && b.status === 'reading') return 1;

        // Within same status, sort by most recent date
        const dateA = a.status === 'reading' ? new Date(a.lastStarted) : new Date(a.lastCompleted);
        const dateB = b.status === 'reading' ? new Date(b.lastStarted) : new Date(b.lastCompleted);
        return dateB - dateA;
    });
}

function renderBooks() {
    if (!booksData || !configData) return;

    const container = document.getElementById('bookGrid');
    const emptyState = document.getElementById('emptyState');

    if (!container) {
        console.error('Container #bookGrid not found');
        return;
    }

    const filteredBooks = filterBooksByType(booksData);
    const sortedBooks = sortBooks(filteredBooks);

    // Handle empty state
    if (sortedBooks.length === 0) {
        container.style.display = 'none';
        if (emptyState) emptyState.style.display = 'block';
        return;
    }

    container.style.display = 'grid';
    if (emptyState) emptyState.style.display = 'none';

    container.innerHTML = '';

    for (const book of sortedBooks) {
        try {
            const bookElement = document.createElement('div');
            bookElement.className = 'book-item';

            const imageUrl = getBookImageUrl(book, configData);
            const statusLabel = book.status === 'reading' ? 'Reading' : 'Read';

            bookElement.innerHTML = `
                <div class="blurb-tooltip">${book.blurb}</div>
                <div class="book-container">
                    <div class="status-label ${book.status}">
                        ${statusLabel}
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
        return `${config.imageBaseUrl}?id=${book.googleBooksId}&${config.imageParams}`;
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
