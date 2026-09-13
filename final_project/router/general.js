const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

// Asynchronous function to get all books.
async function getBooks(req, res) {
  res.send(JSON.stringify({books}, null, 5));
};

// Asynchronous function to get a book from its ISBN.
async function getBookISBN(req, res) {
  res.send(JSON.stringify(books[req.params.isbn]), null, 5);
};

// Asynchronous function to get a book from its Author.
async function getBookAuthor(req, res) {
  const author = req.params.author;

  // A filter that goes over the books array, and finds all books by author, which is provided by user.
  const foundBooks = Object.values(books).filter((book) => book.author === author);

  // If we found a book, send it as a response. If not return a error status code, along with a message.
  if (foundBooks.length > 0) {
    res.status(200).json(foundBooks);
  } else {
    res.status(404).json({message: "No books with that Author found."});
  }
};

// Asynchronous function to get a book from its Title.
async function getBookTitle(req,res) {
  const title = req.params.title;

  // A filter that goes over the books array, and finds all books by title, which is provided by user.
  const foundBooks = Object.values(books).filter((book) => book.title === title);

  // If we found a book, send it as a response. If not return a error status code, along with a message.
  if (foundBooks.length > 0) {
    res.status(200).json(foundBooks);
  } else {
    res.status(404).json({message: "No books with that Title found."});
  }
}

// Register a user.
public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  
  //If username and password are valid we add the user to the 'users' collection. If not return a error status code, along with a message.
  if (username && password) {
    if (isValid(username)) {
      users.push({username: username, password: password});
      res.status(200).json({message: "Account Registered, You can now login."});
    } else {
      res.status(400).json({message: "Username already taken, please choose another."});
    }
  } else {
    res.status(404).json({message: "Username or Password not provided."});
  }
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  try {
    await getBooks (req, res);
  } catch (error) {
    res.status(404).json({message: "Error retrieving book list details."});
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',async function (req, res) {
  try {
    await getBookISBN(req, res);
  } catch (error) {
    res.status(404).json({message: "Error retrieving book details from ISBN."});
  }
 });
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  //Write your code here
  try {
    await getBookAuthor(req, res);
  } catch (error) {
    res.status(404).json({message: "Error retrieving book details from Author."});
  }
});

// Get all books based on title
public_users.get('/title/:title',async function (req, res) {
  //Write your code here
  try {
    await getBookTitle(req, res);
  } catch (error) {
    res.status(404).json({message: "Error retrieving book details from Title."});
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  if (books[req.params.isbn]["review"]) {
    res.send(JSON.stringify(books[req.params.isbn]["review"]), null, 5);
  } else {
    res.status(404).json({message: "No reviews for this book found."});
  }
});

// Axios Async code for calling the REST API getting all Books. ( Other links is for assignment. Won't work locally. )
async function axGetAllBooks() {
    try {
        // Making a GET request Asynchronously with Axios.
        let response = await axios.get('https://trentwhollid-5000.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/');
        return response.data;
    } catch (error) {
        console.error("Error retrieving book details from server", error);
    }
};

// Axios Async code for calling the REST API getting all Books by ISB. ( Other links is for assignment. Won't work locally. )
async function axGetBooksISBN(isbn) {
    try {
      // Making a GET request Asynchronously with Axios.
        let response = await axios.get('https://trentwhollid-5000.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/isbn/'+ isbn);
        return response.data;
    } catch (error) {
        console.error("Error retrieving book details from server", error);
    }
};

// Axios Async code for calling the REST API getting all Books by Author Name. ( Other links is for assignment. Won't work locally. )
async function axGetBooksAuthor(author) {
    try {
      // Making a GET request Asynchronously with Axios.
        let response = await axios.get('https://trentwhollid-5000.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/author/'+ author);
        return response.data;
    } catch (error) {
        console.error("Error retrieving book details from server", error);
    }
}

// Axios Async code for calling the REST API getting all Books by Title. ( Other links is for assignment. Won't work locally. )
async function axGetBooksTitle(title) {
    try {
      // Making a GET request Asynchronously with Axios.
        let response = await axios.get('https://trentwhollid-5000.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/title/'+ title);
        return response.data;
    } catch (error) {
        console.error("Error retrieving book details from server.", error);
    }
};

axGetAllBooks();
axGetBooksISBN(1);
axGetBooksAuthor("Samuel Beckett");
axGetBooksTitle("The Book Of Job");

module.exports.general = public_users;