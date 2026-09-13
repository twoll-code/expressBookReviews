const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

// Check to see if username is valid.
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

// Check to see if user is authenticated.
const authenticatedUser = (username,password)=>{ //returns boolean
  let filteredUsers = users.filter((user) => {
    return ( user.username === username && user.password === password)
  });

  // If we found this user exists, return true. Else return false.
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

  // If the user is authenticated, generate an access Token, and store it in the session, along with the username.
  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({data: username}, 'access', {expiresIn: 60 * 60});
    req.session.authorization = {accessToken, username};
    return res.status(200).json({message: "Login successful!"});
  } else {
    return res.status(404).json({message: "Invalid Login, please check username and password."});
  };
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const userReview = req.body.review;
  const isbn = req.params.isbn;

  // Check to see if there is a valid review. If it is add/update the review.
  if (userReview){
    books[isbn]["reviews"][req.session.authorization["username"]] = userReview;
    res.status(200).json({message: "Review added/updated successfully", "reviews":books[isbn]["reviews"]});
  } else {
    res.status(404).json({message: "Review was unable to be added/updated."});
  }
});


// Delete a book review
regd_users.delete('/auth/review/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  if (books[isbn]["reviews"][req.session.authorization["username"]]) {
    delete books[isbn]["reviews"][req.session.authorization["username"]];
    res.status(200).json({message: "Your review has been deleted."});
  } else {
    res.status(404).json({message: "You have no reviews on this book to delete."});
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
