import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Typography, IconButton, Paper, Avatar, Stack, Switch, Grid } from '@mui/material';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import CommentIcon from '@mui/icons-material/Comment';
import FaceIcon from '@mui/icons-material/Face';
import DeleteIcon from '@mui/icons-material/Delete';
import { deepOrange, deepPurple } from '@mui/material/colors';
import moment from 'moment';

function Post({ post, postId, updatePosts, onDelete, isModerator }) {
  const [newComment, setNewComment] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [autoCommentEnabled, setAutoCommentEnabled] = useState(false);
  const [generatedComment, setGeneratedComment] = useState('');

  const handleNewCommentChange = (event) => setNewComment(event.target.value);

  const handleAutoCommentToggle = (checked) => {
    setAutoCommentEnabled(checked);
    if (!checked) {
      setNewComment(''); // Clear the input field when auto-generate is disabled
    }
  };

  const fetchGeneratedComment = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/blog/generatecomment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ _id: post._id }),
      });
  
      const data = await response.json();
      setGeneratedComment(data.trimmedComment);
      setNewComment(data.trimmedComment); // Automatically set the new comment to the generated one
    } catch (error) {
      console.error('Error fetching generated comment:', error);
    }
  };

  useEffect(() => {
    if (autoCommentEnabled) {
      fetchGeneratedComment();
    }
  }, [autoCommentEnabled]);

  const submitComment = async () => {
    const commentToSubmit = newComment.trim() || generatedComment.trim();
    if (commentToSubmit) {
      const userName = localStorage.getItem('userName') || 'Anonymous';
      const userComment = { text: newComment, userName: userName , _id: post._id};
      const res = await fetch('http://localhost:8000/api/blog/comment/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userComment),
      });
      const data = await res.json();
      updatePosts(postId, data);
      setNewComment('');
      setGeneratedComment(''); 
      setAutoCommentEnabled(false);
    }
  }

  return (
    <Paper elevation={3} sx={{ my: 2, p: 2, borderRadius: 3, backgroundColor: '#fff9c4' }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Box display="flex" alignItems="center">
            <Avatar sx={{ bgcolor: deepOrange[500] }}>
              {post.author.charAt(0).toUpperCase()}
            </Avatar>
            <Box ml={1}>
              <Typography fontWeight="bold" variant="subtitle1" noWrap>
                {post.author}
              </Typography>
              <Typography variant="caption" color="text.secondary" noWrap>
                {moment(post.createdAt).fromNow()}
              </Typography>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            {post.title}
          </Typography>
          <Typography variant="body1" paragraph>
            {post.content}
          </Typography>
          <Box sx={{ width: '100%', height: '1px', backgroundColor: 'primary.main', my: 2 }} />
        </Grid>
        <Grid item xs={12}>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Button
              startIcon={<CommentIcon />}
              onClick={() => setShowComments(!showComments)}
              variant="contained"
              color="primary"
              sx={{ borderRadius: 2 }}
            >
              {showComments ? 'Collapse Comments' : 'View Comments'}
            </Button>
            <Box display="flex" alignItems="center">
              <Box
                display="flex"
                alignItems="center"
                sx={{
                  padding: '4px',
                  borderRadius: '8px',
                  border: '1px solid #e0e0e0',
                  backgroundColor: '#e6ee9c',
                  height: '40px',
                  color: '#333',
                  marginRight: '8px'
                }}
              >
                <Typography
                  sx={{
                    fontWeight: 'bold',
                    fontSize: '0.875rem'
                  }}
                >
                  OpenAI comment:
                </Typography>
                <Switch
                  checked={autoCommentEnabled}
                  onChange={(e) => handleAutoCommentToggle(e.target.checked)}
                  sx={{ color: 'white' }}
                />
              </Box>
              <Button
                onClick={submitComment}
                variant="contained"
                color="primary"
                sx={{ py: '10px', fontSize: '0.875rem', borderRadius: 2 }}
              >
                Post Comment
              </Button>
            </Box>
          </Box>
        </Grid>
        {showComments && (
          <Grid item xs={12}>
            <TextField
              fullWidth
              variant="outlined"
              label="Add a comment"
              value={newComment}
              onChange={handleNewCommentChange}
              margin="normal"
              sx={{ my: 2 }}
            />
            {post.comments.length ? (
              post.comments.map((comment, index) => (
                <Stack
                  key={index}
                  direction="row"
                  spacing={2}
                  alignItems="center"
                  mt={1}
                  sx={{ borderBottom: '1px solid', borderColor: 'primary.main', pb: 1 }}
                >
                  <Avatar sx={{ bgcolor: deepPurple[500] }}>
                    {comment.userName.charAt(0).toUpperCase()}
                  </Avatar>
                  <Typography variant="body2" fontWeight="bold">
                    {comment.userName}:
                  </Typography>
                  <Typography variant="body2">{comment.text}</Typography>
                </Stack>
              ))
            ) : (
              <Typography mt={1}>Be the first to comment!</Typography>
            )}
          </Grid>
        )}
      </Grid>
    </Paper>
  );
}

export default Post;
