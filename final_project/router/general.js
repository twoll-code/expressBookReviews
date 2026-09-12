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
  const bookKeys = Object.keys(books);
  let foundBooks = [];

  // Iterate through the books collection, and add it to the 'foundBooks' collection.
  bookKeys.forEach(element => {
    if (books[element]["author"] === author) {
      foundBooks.push(books[element]);
    } else {
      return;
    }
  });

  // If we found a book, send it as a response. If not return a error status code, along with a message.
  if (foundBooks.length > 0) {
    res.status(200).send(JSON.stringify(foundBooks));
  } else {
    res.status(404).json({message: "No books with that Author found."});
  }
};

// Asynchronous function to get a book from its Title.
async function getBookTitle(req,res) {
  const title = req.params.title;
  const bookKeys = Object.keys(books);
  let foundBooks = [];

  // Iterate through the books collection, and add it to the 'foundBooks' collection.
  bookKeys.forEach(element => {
    if (books[element]["title"] === title) {
      foundBooks.push(books[element]);
    } else {
      return;
    }
  });

  // If we found a book, send it as a response. If not return a error status code, along with a message.
  if (foundBooks.length > 0) {
    res.status(200).send(JSON.stringify(foundBooks));
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
    res.status(500).json({message: "Error retrieving books."});
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',async function (req, res) {
  try {
    await getBookISBN(req, res);
  } catch (error) {
    res.status(500).json({message: "Error retrieving book details."});
  }
 });
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  //Write your code here
  try {
    await getBookAuthor(req, res);
  } catch (error) {
    res.status(500).json({message: "Error retrieving book details."});
  }

});

// Get all books based on title
public_users.get('/title/:title',async function (req, res) {
  //Write your code here
  try {
    await getBookTitle(req, res);
  } catch (error) {
    res.status(500).json({message: "Error retrieving book details."});
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


async function axGetAllBooks() {
    try {
        let response = await axios.get('https://trentwhollid-5000.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/');
        const books = response.data;
        console.log(books)
        return books
    } catch (error) {
        console.error("Error getting data", error);
    }
}
async function axGetBooksISBN(isbn) {
    try {
        let response = await axios.get('https://trentwhollid-5000.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/isbn/'+ isbn);
        const books = response.data;
        console.log(books)
        return books
    } catch (error) {
        console.error("Error getting data", error);
    }
}
async function axGetBooksAuthor(author) {
    try {
        let response = await axios.get('https://trentwhollid-5000.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/author/'+ author);
        const books = response.data;
        console.log(books)
        return books
    } catch (error) {
        console.error("Error getting data", error);
    }
}
async function axGetBooksTitle(title) {
    try {
        let response = await axios.get('https://trentwhollid-5000.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/title/'+ title);
        const books = response.data;
        console.log(books)
        return books
    } catch (error) {
        console.error("Error getting data", error);
    }
}

axGetAllBooks();
axGetBooksISBN(1);
axGetBooksAuthor("Samuel Beckett")
axGetBooksTitle("The Book Of Job")




module.exports.general = public_users;
