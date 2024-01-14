import React, { useState, useEffect } from 'react';
import { Book, Comment as CommentType } from './BookScroller'; 
import './ForumComponent.css';
import Comment from './Comment';
import axios from 'axios';

interface ForumProps {
  book: Book;
  setBooks: Function;
  username: string;
}

const ForumComponent: React.FC<ForumProps> = ({ book, setBooks, username }) => {
  const initialComments = book.Comments || [];
  const [comments, setComments] = useState<CommentType[]>(initialComments);
  const [newComment, setNewComment] = useState<string>('');
  const [replyTo, setReplyTo] = useState<string | null>(null);

  useEffect(() => {
    // update local comments state when book prop changes
    setComments(book.Comments || []);
  }, [book.Comments]);

  const handleCommentSubmit = async () => {
    if (newComment.trim() === '') return;

    const newCommentData = {
      PostID: book.ID, 
      Username: username,
      ProfileImageUrl: "/images/profile.jpg",
      Content: newComment,
      Likes: 0,
      LikedByUser: false,
    };

    try {
      const response = await fetch('http://localhost:8080/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCommentData),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      // refresh the fetch to show new comment
      axios.get('http://localhost:8080/posts')
        .then(response => {
          console.log(response.data)
          setBooks(response.data);
        })
        .catch(error => {
          console.error('Error fetching books:', error);
        });

    } catch (error) {
      console.error('Error submitting comment:', error);
    }

    setNewComment('');
    setReplyTo(null);
  };


  const handleReply = (username: string) => {
    setReplyTo(username);
    setNewComment(`@${username}: `);
  };

  return (
    <div className="forum">
      <div className="post-details">
        <img src={book.ProfileImageUrl} alt={book.Username} className="user-image" />
        <div className="post-info">
          <div className="username">{book.Username}</div>
          <div className="caption">{book.Content}</div>
        </div>
      </div>
      <div className="comments">
        {comments.map((comment, index) => (
          <Comment key={index} comment={comment} onReply={handleReply} />
        ))}
      </div>
      <div className="comment-form">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder={replyTo ? `Replying to ${replyTo}` : 'Add a comment...'}
          className="comment-input"
        />
        <button onClick={handleCommentSubmit} className="send-button">Send</button>
      </div>
    </div>
  );
};

export default ForumComponent;