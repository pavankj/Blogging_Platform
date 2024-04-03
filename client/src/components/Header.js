import { useState } from 'react';
import PropTypes from 'prop-types';
import { AppBar, Toolbar, Button, IconButton, Typography, Link, Box, TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';

function Header(props) {
  const { sections, title, isAdmin } = props;
  const navigate = useNavigate();
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const isAuthenticated = () => {
    return Boolean(localStorage.getItem('isAuthenticated'));
  };

  const signOut = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userName');
  };

  const handleLogout = () => {
    signOut();
    navigate('/signin');
  };

  const handleSearchIconClick = () => {
    setShowSearch(!showSearch); // Toggle search input visibility
  };

  const handleSearch = (e) => {
    e.preventDefault();
    navigate('/search', { state: { query: searchQuery } }); // Navigate to a search page or handle the search as needed
  };

  return (
    <AppBar position="fixed" color="default" elevation={1} sx={{ bgcolor: 'primary.light' }}>
      <Toolbar sx={{ justifyContent: 'space-between', color: 'text.primary' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Button size="small" variant="text" onClick={() => navigate('/createpost')} sx={{ mr: 2, color: 'inherit' }}>
            Compose a new entry
          </Button>
          <Button size="small" variant="text" onClick={() => navigate('/chatbot')} sx={{ mr: 2, color: 'inherit' }}>
            Interact with the AI
          </Button>
          {isAdmin && (
            <Button size="small" variant="text" onClick={() => navigate('/admin')} sx={{ color: 'inherit' }}>
              Administrative features
            </Button>
          )}
        </Box>
        <Typography variant="h6" sx={{ flexGrow: 1, textAlign: 'center', fontWeight: 'bold', color: 'inherit' }}>
          {title}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {showSearch && (
            <TextField
              variant="outlined"
              size="small"
              placeholder="Search..."
              onChange={(e) => setSearchQuery(e.target.value)}
              value={searchQuery}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch(e)}
              sx={{ mr: 2 }}
            />
          )}
          <IconButton onClick={handleSearchIconClick} sx={{ mr: 2, color: 'inherit' }}>
            <SearchIcon />
          </IconButton>
          {isAuthenticated() ? (
            <Button variant="text" size="small" onClick={handleLogout} sx={{ color: 'inherit' }}>
              Sign out
            </Button>
          ) : (
            <Button variant="text" size="small" onClick={() => navigate('/signup')} sx={{ color: 'inherit' }}>
              Sign up
            </Button>
          )}
        </Box>
      </Toolbar>
      <Toolbar component="nav" variant="dense" sx={{ justifyContent: 'center', bgcolor: 'primary.light' }}>
        {sections.map((section) => (
          <Link
            color="inherit"
            noWrap
            key={section.title}
            variant="body2"
            onClick={(e) => {
              e.preventDefault();
              navigate('/', { state: { topic: section.title } }); // Navigate to '/posts' with topic state
            }}
            sx={{ p: 1, flexShrink: 0, textDecoration: 'underline', cursor: 'pointer', color: 'inherit' }}
          >
            {section.title}
          </Link>
        ))}
      </Toolbar>
    </AppBar>
  );
}

Header.propTypes = {
  sections: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
    }),
  ).isRequired,
  title: PropTypes.string.isRequired,
};

export default Header;
