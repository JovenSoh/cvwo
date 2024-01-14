// App.tsx

import React, { useState, useEffect} from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Login from './component/Login';
import BookScroller from './component/BookScroller';
import NavBar from './component/NavBar';
import { Book } from './component/BookScroller';
import Upload from './component/Upload';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('anonymous');
  const [books, setBooks] = useState<Book[]>([]); // add a state to hold the books

  useEffect(() => {
    if (isLoggedIn) {
      axios.get('http://localhost:8080/posts')
        .then(response => {
          console.log(response.data)
          setBooks(response.data);
        })
        .catch(error => {
          console.error('Error fetching books:', error);
        });
    }
  }, [isLoggedIn]);


  const handleLogin = (username: string) => {
    console.log(`Logged in as ${username}`);
    setUsername(username);
    setIsLoggedIn(true);
  };

  return (
    <Router>
      <div className="App">
        <NavBar />
        <Routes>
          <Route path="/" element={!isLoggedIn ? <Login onLogin={handleLogin} /> : <BookScroller books={books} setBooks={setBooks} username={username} />} />
          <Route path="/profile" element={!isLoggedIn ? <Login onLogin={handleLogin} /> : <div>Profile Page</div>} />
          <Route path="/upload" element={!isLoggedIn ? <Login onLogin={handleLogin} /> : <Upload username={username} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
