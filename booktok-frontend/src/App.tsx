// App.tsx

import React, { useState, useEffect} from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Login from './component/Login';
import BookScroller from './component/BookScroller';
import NavBar from './component/NavBar';
import { Book } from './component/BookScroller';
import Profile from './component/Profile';
import Upload from './component/Upload';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('anonymous');
  const [books, setBooks] = useState<Book[]>([]); // add a state to hold the books

  useEffect(() => {
    if (isLoggedIn) {
      console.log(process.env.REACT_APP_SERVER_IP + '/posts')
      axios.get(process.env.REACT_APP_SERVER_IP + '/posts')
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
          <Route path="/profile" element={!isLoggedIn ? <Login onLogin={handleLogin} /> : <Profile username={username} setUsername={setUsername} />} />
          <Route path="/upload" element={!isLoggedIn ? <Login onLogin={handleLogin} /> : <Upload username={username} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
