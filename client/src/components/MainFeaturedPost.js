import React from 'react';
import PropTypes from 'prop-types';
import { Paper, Typography, Link, Box } from '@mui/material';
import { styled } from '@mui/material/styles';


const BackgroundImageBox = styled(Box)(({ theme, backgroundimage }) => ({
  position: 'relative',
  backgroundColor: theme.palette.grey[800],
  color: theme.palette.common.white,
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
  backgroundImage: `url(${backgroundimage})`,
  width: '100%',
  height: '100%',
  '&:before': {
    content: '""',
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(0,0,0,.3)',
  },
  display: 'flex', 
  flexDirection: 'column',
  justifyContent: 'center', 
  alignItems: 'center', 
}));

function MainFeaturedPost({ post }) {
  return (
    <Paper elevation={0} square style={{ width: '100%', height:'80vh', overflow: 'hidden' }}>
      <BackgroundImageBox backgroundimage={post.image}>
        <Box sx={{ position: 'relative', p: { xs: 3, md: 6 }, pr: { md: 0 } }}>
          <Typography component="h1" variant="h3" color="inherit" gutterBottom>
            {post.title}
          </Typography>
          <Typography variant="h5" color="inherit" paragraph>
            {post.description}
          </Typography>
          <Link variant="subtitle1" href="/createpost" underline="hover" sx={{ color: 'common.white' }}>
            {post.linkText}
          </Link>
        </Box>
      </BackgroundImageBox>
    </Paper>
  );
}


MainFeaturedPost.propTypes = {
  post: PropTypes.shape({
    description: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    imageText: PropTypes.string.isRequired,
    linkText: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  }).isRequired,
};

export default MainFeaturedPost;

