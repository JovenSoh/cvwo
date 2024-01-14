import React, { useState } from 'react';
import ForumComponent from './ForumComponent';
import './BookScroller.css';

export type Comment = {
  ProfileImageUrl: string;
  Username: string;
  Content: string;
  Likes: number; 
  LikedByUser: boolean;
  replies?: Comment[]; // for nested comments, idk if i would still implement this
};

export type Book = {
  ID: number;
  ImageUrl: string;
  ProfileImageUrl: string;
  Username: string;
  Content: string;
  Comments: Comment[];
};

type BookScrollerProps = {
  username: string;
  setBooks: Function;
  books: Book[];
};

const BookScroller: React.FC<BookScrollerProps> = ({ books, setBooks, username }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const onWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.deltaY > 0) {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % books.length);
    } else {
      setCurrentIndex((prevIndex) => (prevIndex === 0 ? books.length - 1 : prevIndex - 1));
    }
  };
  return (
    <div className="book-scroller-container" onWheel={onWheel}>
      {books.length > 0 && (
        <>
          <div className="book-image-container">
            <img src={"http://" + books[currentIndex].ImageUrl} alt=" Book" className="book-image" />
          </div>
          <ForumComponent key={currentIndex} book={books[currentIndex]} setBooks={setBooks} username={username} />
        </>
      )}
    </div>
  );
};

export default BookScroller;
