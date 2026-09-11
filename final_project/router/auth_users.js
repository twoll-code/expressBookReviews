const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
  let filteredUsers = users.filter((user) => {
    return user.username === username;
  });

  if (filteredUsers.length > 0) {
    return false;
  } else {
    return true;
  }
};

const authenticatedUser = (username,password)=>{ //returns boolean
  let filteredUsers = users.filter((user) => {
    return ( user.username === username && user.password === password)
  });

  if (filteredUsers.length > 0) {
    return true;
  } else {
    return false;
  };
};

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({data: username}, 'access', {expiresIn: 60 * 60});
    req.session.authorization = {accessToken, username};
    return res.status(200).json({message: "User successfully logged in."});
  } else {
    return res.status(404).json({message: "Invalid Login, please check username and password."});
  };
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const userReview = req.body.review;
  const isbn = req.params.isbn;

  if (req.session.authorization["username"] in books[isbn]["reviews"]) {
    books[isbn]["reviews"][req.session.authorization["username"]] = userReview;
    res.status(200).json({message: "Your review has been updated."});
  } else {
    books[isbn]["reviews"][req.session.authorization["username"]] = userReview;
    res.status(200).json({message: "Your review has been created."});
  }
});

// Delete a book review
regd_users.delete('/auth/review/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  if (books[isbn]["reviews"][req.session.authorization["username"]]) {
    delete books[isbn]["reviews"][req.session.authorization["username"]];
    res.status(200).json({message: "You review has been deleted."});
  } else {
    res.status(404).json({message: "You have no reviews on this book to delete."});
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
