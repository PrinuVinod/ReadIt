import React, { useState, useEffect } from 'react';
import { db } from './firebase'; // Import your Firebase configuration
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';

const Dashboard = () => {
    const [myBooks, setMyBooks] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    // Load books from Firestore when the component mounts
    useEffect(() => {
        const fetchBooks = async () => {
            const querySnapshot = await getDocs(collection(db, 'books'));
            const books = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            setMyBooks(books);
        };

        fetchBooks();
    }, []);

    // Function to handle adding a new book
    const addBook = async (book) => {
        const docRef = await addDoc(collection(db, 'books'), book);
        setMyBooks((prevBooks) => [...prevBooks, { id: docRef.id, ...book }]);
    };

    // Function to handle removing a book
    const removeBook = async (id) => {
        await deleteDoc(doc(db, 'books', id));
        setMyBooks((prevBooks) => prevBooks.filter((book) => book.id !== id));
    };

    // Function to handle searching books using Google Books API
    const searchBooks = async () => {
        try {
            const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${searchTerm}`);
            const data = await response.json();
            setSearchResults(data.items || []);
        } catch (error) {
            console.error('Error fetching data from Google Books API:', error);
        }
    };

    return (
        <div>
            <h1>My Book Tracker</h1>
            <input
                type="text"
                placeholder="Search for books..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button onClick={searchBooks}>Search</button>

            <h2>My Books</h2>
            <ul>
                {myBooks.map((book) => (
                    <li key={book.id}>
                        {book.title}
                        <button onClick={() => removeBook(book.id)}>Remove</button>
                    </li>
                ))}
            </ul>

            <h2>Search Results</h2>
            <ul>
                {searchResults.map((item) => (
                    <li key={item.id}>
                        {item.volumeInfo.title}
                        <button onClick={() => addBook({ title: item.volumeInfo.title })}>Add to My Books</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Dashboard;
 