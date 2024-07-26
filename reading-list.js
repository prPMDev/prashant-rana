// Book data
const books = [
  {
    title: "Inspired",
    author: "Marty Cagan",
    rating: 5,
    learnings: "Key insights and practical advice for product managers.",
    coverUrl: "https://books.google.com/books/content?id=kLAoswEACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api"
  },
  {
    title: "The Lean Startup",
    author: "Eric Ries",
    rating: 4,
    learnings: "Principles and methodologies for building successful products.",
    coverUrl: "https://books.google.com/books/content?id=fAoutGwJX_IC&printsec=frontcover&img=1&zoom=1&source=gbs_api"
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
  const bookGrid = document.getElementById("bookGrid");

  books.forEach(book => {
    const bookItem = document.createElement("div");
    bookItem.className = "book-item";

    const bookCover = document.createElement("img");
    bookCover.src = book.coverUrl;
    bookCover.alt = "Book Cover";

    const bookTitle = document.createElement("h3");
    bookTitle.textContent = book.title;

    const bookAuthor = document.createElement("p");
    bookAuthor.textContent = `by ${book.author}`;

    const bookRating = document.createElement("div");
    bookRating.className = "book-rating";
    bookRating.textContent = generateStarRating(book.rating);

    const bookLearnings = document.createElement("p");
    bookLearnings.textContent = book.learnings;

    bookItem.appendChild(bookCover);
    bookItem.appendChild(bookTitle);
    bookItem.appendChild(bookAuthor);
    bookItem.appendChild(bookRating);
    bookItem.appendChild(bookLearnings);

    bookGrid.appendChild(bookItem);
  });
}

// Generate book items when the page loads
window.addEventListener("load", generateBookItems);