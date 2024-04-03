import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import Post from './Post'; // Make sure the path is correct
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

function Posts() {
  const [posts, setPosts] = useState([]);
  const location = useLocation();
  const navigate = useNavigate()
  const topic = location.state?.topic;
  const [subscribed, setSubscribed] = useState(false)

useEffect(() => {
  // Define async function for fetching posts
  const fetchPosts = async () => {
    const response = await fetch('http://localhost:8000/api/blog/get');
    const data = await response.json();
    console.log(data);
    if (topic) {
      const filteredPosts = data.filter(post => post.topic === topic);
      setPosts(filteredPosts);
    } else {
      setPosts(data); // No topic selected, use all posts
    }
  };

  // Define async function for checking subscription status
  const checkSubscription = async () => {
    const userName = localStorage.getItem('userName');
    if (!userName || !topic) return;

    const res = await fetch('http://localhost:8000/api/user/issubscribed', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ topic, userName }),
        });
    const data = await res.json();
    console.log("here", data);

    if (res.ok && data.isSubscribed) {
      setSubscribed(true);
    } else {
      setSubscribed(false);
    }
  };

  // Call both async operations
  fetchPosts();
  checkSubscription();
}, [topic]); // This useEffect depends on `topic`

  // Continue with the rest of your component...
  
  console.log(posts)

  const updatePosts = (postId, updatedPost) => {
    const updatedPosts = posts.map((post, index) => 
      index === postId ? updatedPost : post
    );
    setPosts(updatedPosts);
    localStorage.setItem('blogPosts', JSON.stringify(updatedPosts));
  };

  //delete Post via the server
  const handleDeletePost = async (pID, postId) => {
    const res = await fetch(`http://localhost:8000/api/blog/delete/${pID}`, {
      method: 'DELETE',
    });
    const data = await res.json();
    console.log(data)
    const updatedPosts = posts.filter((_, index) => index !== postId);
    setPosts(updatedPosts);
    // localStorage.setItem('blogPosts', JSON.stringify(updatedPosts));
    
  }

  const isModerator = () => {
    // Implement logic to determine if the user is a moderator
    return localStorage.getItem('isModerator') === 'true';

  };

  const handleShowAllPosts = () => {
    navigate('/', { replace: true, state: {} }); // Navigate without a topic to reset the filter
  };


  
  const handleSubscribe = async () => {
    const userName = localStorage.getItem('userName');
    try {
        const res = await fetch('http://localhost:8000/api/user/subscribe', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ topic, userName }),
        });
        const data = await res.json();

        // Log the response data to see what's returned from the server
        console.log(data);

        // Check the response status code directly from the response object
        if (res.status === 200) {
            setSubscribed(true);
        } else {
            // Handle non-200 responses (e.g., displaying an error message)
            console.error("Failed to subscribe:", data.message || "Unknown error");
        }
    } catch (error) {
        // Handle errors from the fetch operation itself
        console.error("Subscription request failed:", error);
    }
};

  //send a post request to the server to unsubscribe to a topic

  const handleUnsubscribe = async () => {
    const userName = localStorage.getItem('userName');

    try {
        const res = await fetch('http://localhost:8000/api/user/unsubscribe', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ topic, userName }),
        });
        const data = await res.json();

        // Log the response data for debugging
        console.log(data);

        // Check for a success flag in the response body or consider using HTTP status
        if (res.status === 200) {
            setSubscribed(false);
        } else {
            // Handle case where unsubscribe operation didn't succeed
            console.error("Failed to unsubscribe:", data.message || "Unknown error");
        }
    } catch (error) {
        // Handle network errors or issues with the fetch call
        console.error("Unsubscribe request failed:", error);
    }
};

  
  const headingText = topic ? `Blog Posts in ${topic}` : "All Blog Posts";

  return (
    <Container maxWidth={false} sx={{ width: '70vw', paddingX: 0 }}> 
      <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mt: 4, mb: 2 }}>
        <Typography variant="h4">{headingText}</Typography>
        {topic && (
          <>
          <Button variant="outlined" onClick={handleShowAllPosts}>Explore All Posts</Button>
          {
            !subscribed ? (
              <Button variant="contained" color="primary" onClick={handleSubscribe}>Get notified!</Button>
            ) : (
              <Button variant="contained" color="secondary" onClick={handleUnsubscribe}>Opt Out</Button>
            )
          }

          </>
          
          
        
        )}

      </Box>
      {posts.length > 0 ? (
        posts.map((post, index) => (
            <Post key={index} post={post} postId={index} updatePosts={updatePosts}  onDelete={handleDeletePost}
            isModerator={isModerator()} />
        ))
      ) : (
        <Typography variant="body1">There aren't any posts to display yet.</Typography>
      )}
    </Container>
  );
}

export default Posts;
