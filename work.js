// Book data (updated with "currentlyReading" property)
const books = [
  {
    title: "Inspired",
    author: "Marty Cagan",
    rating: 5,
    learnings: "Key insights and practical advice for product managers.",
    coverUrl: "https://books.google.com/books/content?id=kLAoswEACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api",
    currentlyReading: true
  },
  {
    title: "The Lean Startup",
    author: "Eric Ries",
    rating: 4,
    learnings: "Principles and methodologies for building successful products.",
    coverUrl: "https://books.google.com/books/content?id=fAoutGwJX_IC&printsec=frontcover&img=1&zoom=1&source=gbs_api",
    currentlyReading: false
  }
  // Add more book objects here
];

// Function to generate star ratings (remains the same)

// Function to generate book items (updated)
function generateBookItems() {
  const currentlyReadingGrid = document.getElementById("currentlyReading");
  const previouslyReadGrid = document.getElementById("previouslyRead");

  books.forEach(book => {
    const bookItem = document.createElement("div");
    bookItem.className = "book-item";

    const bookCover = document.createElement("img");
    bookCover.src = book.coverUrl;
    bookCover.alt = "Book Cover";

    const overlay = document.createElement("div");
    overlay.className = "overlay";

    const bookLearnings = document.createElement("p");
    bookLearnings.textContent = book.learnings;

    overlay.appendChild(bookLearnings);

    const bookTitle = document.createElement("h3");
    bookTitle.textContent = book.title;

    const bookAuthor = document.createElement("p");
    bookAuthor.textContent = `by ${book.author}`;

    const bookRating = document.createElement("div");
    bookRating.className = "book-rating";
    bookRating.textContent = generateStarRating(book.rating);

    bookItem.appendChild(bookCover);
    bookItem.appendChild(overlay);
    bookItem.appendChild(bookTitle);
    bookItem.appendChild(bookAuthor);
    bookItem.appendChild(bookRating);

    if (book.currentlyReading) {
      currentlyReadingGrid.appendChild(bookItem);
    } else {
      previouslyReadGrid.appendChild(bookItem);
    }
  });
}

// Generate book items when the page loads (remains the same)