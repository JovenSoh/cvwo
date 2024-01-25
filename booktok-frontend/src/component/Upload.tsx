import React, { useState } from 'react';
import axios from 'axios';
import './Upload.css'; 


interface UploadProps {
  username: string;
}

const Upload: React.FC<UploadProps> = ({ username }) => {
  const [content, setContent] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [toast, setToast] = useState({ message: '', type: '' });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setFile(files[0]);
    }
  };

  const showToast = (message: string, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: '', type: '' }), 3000); // hide after 3 seconds
  };

  const handleUpload = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!file) {
      alert("Please select a file.");
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('content', content);
    formData.append('username', username);

    try {
      const response = await axios.post(process.env.REACT_APP_SERVER_IP + '/posts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      // Handle success
      console.log(response.data);
      setContent('');
      setFile(null);
      showToast('Upload successful!');
    } catch (error) {
      console.error('Error uploading post:', error);
      showToast('Error uploading post.', 'error');
    }
  };

  return (
    <div className="upload-container">
      <form onSubmit={handleUpload} className="upload-form">
        <h1 className='upload-form-title'> 
          Upload your Book 
        </h1>
        <textarea
          className="text-input"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What are your thoughts on the book?"
        />
        <input
          type="file"
          onChange={handleFileChange}
          className="file-input"
        />
        <button type="submit" className="submit-button">Post</button>
      </form>
      {toast.message && (
        <div className={`toast-message ${toast.type === 'error' ? 'error' : ''}`}>
          {toast.message}
        </div>
      )}
    </div>
  );
};

export default Upload;
