import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';

function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://portfolio-pavankj.vercel.app/">
        Pavan Kodihalli Jagadeesh
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

function Footer(props) {
  const { description, title } = props;

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'primary.main', // Change background color to primary color
        color: 'white', // Change text color to white
        py: 6,
        mt: 'auto', // Push footer to the bottom of the page
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="h6" align="center" gutterBottom>
          {title}
        </Typography>
        <Typography
          variant="subtitle1"
          align="center"
          component="p"
        >
          {description}
        </Typography>
        <Typography
          variant="body2"
          align="justify"
          color="text.secondary"
          sx={{ mt: 2 }} // Add margin top for spacing
        >
          The blogging platform is a space for individuals to share their thoughts, experiences, and expertise on various topics. It fosters creativity, community engagement, and knowledge sharing. By creating and reading blog posts, users can gain insights, learn new perspectives, and connect with like-minded individuals across the globe.
        </Typography>
        <Box mt={4}> {/* Add margin top for spacing */}
          <Copyright />
        </Box>
      </Container>
    </Box>
  );
}

Footer.propTypes = {
  description: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

export default Footer;
