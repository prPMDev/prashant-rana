document.addEventListener('DOMContentLoaded', function() {
    fetch('books.json')
        .then(response => response.json())
        .then(data => {
            populateBookList('currentlyReading', data.currentlyReading);
            populateBookList('previouslyRead', data.previouslyRead);
        });
});

function populateBookList(elementId, books) {
    const container = document.getElementById(elementId);
    books.forEach(book => {
        const bookElement = document.createElement('div');
        bookElement.className = 'book-item';
        bookElement.innerHTML = `
            <img src="${book.image}" alt="${book.title}" loading="lazy">
            <h3>${book.title}</h3>
            <p>${book.author}</p>
            <div class="book-rating">${'★'.repeat(Math.round(book.rating))}</div>
        `;
        container.appendChild(bookElement);
    });
}