// Book data (updated with "currentlyReading" property)
const books = [
  {
    title: "Inspired",
    author: "Marty Cagan",
    rating: 5,
    learnings: "Key insights and practical advice for product managers.",
    coverUrl: "data:image/jpeg;base64,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",
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

// Function to generate star ratings
function generateStarRating(rating) {
  let stars = "";
  for (let i = 0; i < rating; i++) {
    stars += "★";
  }
  return stars;
}

// Function to generate book items
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

// Generate book items when the page loads
window.addEventListener("load", generateBookItems);