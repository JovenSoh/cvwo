import React, { useState } from 'react';
import { Comment as CommentType } from './BookScroller'; 
import './Comment.css';

interface CommentProps {
  comment: CommentType;
  onReply: (username: string) => void;
  depth?: number;
}

const Comment: React.FC<CommentProps> = ({ comment, onReply, depth = 0 }) => {
  const [likes, setLikes] = useState<number>(comment.Likes);
  const [liked, setLiked] = useState<boolean>(comment.LikedByUser);
  const toggleLike = () => {
    setLiked(!liked);
    setLikes(liked ? likes - 1 : likes + 1);
  };
  return (
    <div className="comment" style={{ marginTop: depth > 0 ? '4px' : '16px' }}>
      <img src={comment.ProfileImageUrl} alt={comment.Username} className="user-image" />
      <div className="comment-body">
        <div className="comment-text">
          <strong>{comment.Username}</strong>: {comment.Content}
        </div>
        <div className="comment-actions">
          <span className="like-counter">{likes} likes</span>
          <button onClick={toggleLike} className="like-button">
            {liked ? 'Unlike' : 'Like'}
          </button>
          <button onClick={() => onReply(comment.Username)} className="reply-button">
            Reply
          </button>
        </div>
        {comment.replies && comment.replies.map((reply, index) => (
          <Comment key={index} comment={reply} onReply={onReply} depth={(depth || 0) + 1} />
        ))}
      </div>
    </div>
  );
};

export default Comment;