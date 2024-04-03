import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Grid, Card, CardContent, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { signIn } from './auth';

function SignIn() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value,
    }));
  };


  const handleSubmit = async(e) => {
    e.preventDefault()
    try {
      const res = await fetch('http://localhost:8000/api/auth/signin', {
        method:'POST',
        headers:{
          'Content-Type':'application/json'
        },
        body: JSON.stringify(formData),
      })
      const data = await res.json()
      console.log(data)
     
      if (data) {
        signIn()
        navigate('/')
        localStorage.setItem('userName', data.userName);
        localStorage.setItem('isModerator', data.email.includes('@moderator.com') ? 'true' : 'false');
        localStorage.setItem('isAdmin', data.email.includes('@admin.com') ? 'true' : 'false');
      }
    } catch (error) {
      alert('Whoops! Looks like something went wrong. Have you forgotten your password, or is your username entered correctly?')
      console.log(error)
    }
  }

  return (
    <Container component="main" maxWidth="xs" sx={{ mt: 8 }}>
      <Card elevation={3} sx={{ backgroundColor: '#f0f0f0', borderRadius: 16 }}>
        <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4 }}>
          <Typography component="h1" variant="h5" sx={{ mb: 3, color: '#333' }}>
            Sign In
          </Typography>
          <form onSubmit={handleSubmit} noValidate>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  sx={{ backgroundColor: '#fff', borderRadius: 8 }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={handleChange}
                  sx={{ backgroundColor: '#fff', borderRadius: 8 }}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, borderRadius: 8, backgroundColor: '#4caf50', color: '#fff' }}
            >
              Sign In
            </Button>
          </form>
          <Link href="/signup" variant="body2" sx={{ color: '#4caf50' }}>
            No account yet? Sign Up Here.
          </Link>
        </CardContent>
      </Card>
    </Container>
  );
}

export default SignIn;
