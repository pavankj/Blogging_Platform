import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Header from './Header';
import MainFeaturedPost from './MainFeaturedPost';
import Footer from './Footer';
import Posts from './Posts';

const sections = [
  { title: 'Academic Resources', url: '#' },
  { title: 'Career Services', url: '#' },
  { title: 'Campus', url: '#' },
  { title: 'Culture', url: '#' },
  { title: 'Local Community Resources', url: '#' },
  { title: 'Social', url: '#' },
  { title: 'Sports', url: '#' },
  { title: 'Health and Wellness', url: '#' },
  { title: 'Technology', url: '#' },
  { title: 'Travel', url: '#' },
  { title: 'Alumni', url: '#' },
];

const mainFeaturedPost = {
  title: 'Welcome to the Illinois Institute of Technology Blogging Platform',
  description: "Explore a wide range of blogs on various topics and share your own insights!",
  image: 'https://source.unsplash.com/random?wallpapers',
  imageText: 'main image description',
  linkText: 'Start Writing Your Own Blog Post',
};

const defaultTheme = createTheme();

export default function Blog() {
  const isAdmin = () => {
    // Implement logic to determine if the user is a moderator
    return localStorage.getItem('isAdmin') === 'true';
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100vw', margin: '0', padding: '0', overflowX: 'hidden' }}>
        <Header title="Illinois Institute of Technology Blogging Platform" sections={sections} isAdmin={isAdmin()} />
        <Container maxWidth={false} disableGutters sx={{ flexGrow: 1, width: '100%', padding: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <MainFeaturedPost post={mainFeaturedPost} />
          <Posts />
        </Container>
        <Footer title="Illinois Institute of Technology Blogging Platform" description="Create and Read Amazing Blogs here!" />
      </div>
    </ThemeProvider>
  );
}
