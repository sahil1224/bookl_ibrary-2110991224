// src/App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [books, setBooks] = useState([]);
  const [newBook, setNewBook] = useState({ title: '', author: '', genre: '', price: '' });
  const [updatedBook, setUpdatedBook] = useState({ title: '', author: '', genre: '', price: '' });
  const [selectedBookId, setSelectedBookId] = useState(null);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await axios.get('http://localhost:5000/books');
      setBooks(response.data);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  const handleAddBook = async () => {
    if (!newBook.title || !newBook.author || !newBook.genre || !newBook.price) {
      setFormError('All fields are required.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/books', newBook);
      setBooks([...books, response.data]);
      setNewBook({ title: '', author: '', genre: '', price: '' });
      setFormError('');
    } catch (error) {
      console.error('Error adding book:', error);
      setFormError('Error adding book. Please try again.');
    }
  };

  const handleUpdateBook = async (id) => {
    if (!updatedBook.title || !updatedBook.author || !updatedBook.genre || !updatedBook.price) {
      setFormError('All fields are required.');
      return;
    }

    try {
      const response = await axios.put(`http://localhost:5000/books/${id}`, updatedBook);
      setBooks(books.map((book) => (book._id === id ? response.data : book)));
      setUpdatedBook({ title: '', author: '', genre: '', price: '' });
      setSelectedBookId(null);
      setFormError('');
    } catch (error) {
      console.error('Error updating book:', error);
      setFormError('Error updating book. Please try again.');
    }
  };

  const handleDeleteBook = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/books/${id}`);
      setBooks(books.filter((book) => book._id !== id));
    } catch (error) {
      console.error('Error deleting book:', error);
      setFormError('Error deleting book. Please try again.');
    }
  };

  const handleSelectBookForUpdate = (book) => {
    // Fill the update form with the existing values of the selected book
    setUpdatedBook({ title: book.title, author: book.author, genre: book.genre, price: book.price });
    setSelectedBookId(book._id);
    setFormError('');
  };

  return (
    <div className="container mt-5">
      <h1>Book Library</h1>
      {formError && <div className="alert alert-danger mt-3">{formError}</div>}
      <div className="mb-3">
        <input
          type="text"
          placeholder="Title"
          className="mr-2"
          value={newBook.title}
          onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Author"
          className="mr-2"
          value={newBook.author}
          onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Genre"
          className="mr-2"
          value={newBook.genre}
          onChange={(e) => setNewBook({ ...newBook, genre: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Price"
          className="mr-2"
          value={newBook.price}
          onChange={(e) => setNewBook({ ...newBook, price: e.target.value })}
          required
        />
        <button className="btn btn-primary" onClick={handleAddBook}>
          Add Book
        </button>
      </div>
      <ul className="list-group">
        {books.map((book) => (
          <li key={book._id} className="list-group-item">
            {selectedBookId === book._id ? (
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h5>{book.title}</h5>
                  <p>{`${book.author}, ${book.genre}, $${book.price}`}</p>
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Title"
                    className="mr-2"
                    value={updatedBook.title}
                    onChange={(e) => setUpdatedBook({ ...updatedBook, title: e.target.value })}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Author"
                    className="mr-2"
                    value={updatedBook.author}
                    onChange={(e) => setUpdatedBook({ ...updatedBook, author: e.target.value })}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Genre"
                    className="mr-2"
                    value={updatedBook.genre}
                    onChange={(e) => setUpdatedBook({ ...updatedBook, genre: e.target.value })}
                    required
                  />
                  <input
                    type="number"
                    placeholder="Price"
                    className="mr-2"
                    value={updatedBook.price}
                    onChange={(e) => setUpdatedBook({ ...updatedBook, price: e.target.value })}
                    required
                  />
                  <button className="btn btn-warning mr-2" onClick={() => handleUpdateBook(book._id)}>
                    Update
                  </button>
                  <button className="btn btn-danger" onClick={() => setSelectedBookId(null)}>
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h5>{book.title}</h5>
                  <p>{`${book.author}, ${book.genre}, $${book.price}`}</p>
                </div>
                <div>
                  <button
                    className="btn btn-warning mr-2"
                    onClick={() => handleSelectBookForUpdate(book)}
                  >
                    Update
                  </button>
                  <button className="btn btn-danger" onClick={() => handleDeleteBook(book._id)}>
                    Delete
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
