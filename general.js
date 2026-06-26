const express = require('express');
const axios = require('axios');
let books = require('./booksdb.js');
let isValid = require('./auth_users.js').isValid;
let users = require('./auth_users.js').users;
const public_users = express.Router();

const BASE_URL = 'http://localhost:5000';

// ─────────────────────────────────────────────
// TASK 7 — Register new user
// ─────────────────────────────────────────────
public_users.post('/register', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  const userExists = users.some(u => u.username === username);
  if (userExists) {
    return res.status(409).json({ message: "User already exists" });
  }

  users.push({ username, password });
  return res.status(200).json({ message: "User registered successfully" });
});

// ─────────────────────────────────────────────
// TASK 2 — Get all books (sync)
// ─────────────────────────────────────────────
public_users.get('/', function (req, res) {
  return res.status(200).json(books);
});

// ─────────────────────────────────────────────
// TASK 3 — Get book by ISBN (sync)
// ─────────────────────────────────────────────
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }
  return res.status(200).json(book);
});

// ─────────────────────────────────────────────
// TASK 4 — Get books by author (sync)
// ─────────────────────────────────────────────
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  const result = Object.values(books).filter(b => b.author === author);
  return res.status(200).json(result);
});

// ─────────────────────────────────────────────
// TASK 5 — Get books by title (sync)
// ─────────────────────────────────────────────
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  const result = Object.values(books).filter(b => b.title === title);
  return res.status(200).json(result);
});

// ─────────────────────────────────────────────
// TASK 6 — Get book reviews
// ─────────────────────────────────────────────
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }
  return res.status(200).json(book.reviews);
});

// ─────────────────────────────────────────────
// TASK 11 — Async/Await with Axios
// ─────────────────────────────────────────────

// 11a — Get all books using async/await
public_users.get('/async/books', async (req, res) => {
  try {
    const response = await axios.get(`${BASE_URL}/`);
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// 11b — Get book by ISBN using async/await
public_users.get('/async/isbn/:isbn', async (req, res) => {
  try {
    const isbn = req.params.isbn;
    const response = await axios.get(`${BASE_URL}/isbn/${isbn}`);
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// 11c — Get books by author using async/await
public_users.get('/async/author/:author', async (req, res) => {
  try {
    const author = req.params.author;
    const response = await axios.get(`${BASE_URL}/author/${encodeURIComponent(author)}`);
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// 11d — Get books by title using async/await
public_users.get('/async/title/:title', async (req, res) => {
  try {
    const title = req.params.title;
    const response = await axios.get(`${BASE_URL}/title/${encodeURIComponent(title)}`);
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

module.exports.general = public_users;
