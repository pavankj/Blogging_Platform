import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Grid, Card, CardContent, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function SignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    userName: '',
    email: '',
    password: '',
    disabled: false,
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
      // setLoading(true)
      const res = await fetch('http://localhost:8000/api/auth/signup', {
        method:'POST',
        headers:{
          'Content-Type':'application/json'
        },
        body: JSON.stringify(formData),
      })
      const data = await res.json()

      navigate('/signin')
      

    } catch (error) {

      console.log(error)

      alert('That email is already taken. Please choose another one to continue.')
    }
  }

  return (
    <Container component="main" maxWidth="sm" sx={{ mt: 8 }}>
      <Card elevation={3} sx={{ borderRadius: 16 }}>
        <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4 }}>
          <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
            Sign Up
          </Typography>
          <form onSubmit={handleSubmit} noValidate style={{ width: '100%' }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  autoComplete="name"
                  name="userName"
                  required
                  fullWidth
                  id="userName"
                  label="Full Name"
                  autoFocus
                  value={formData.userName}
                  onChange={handleChange}
                  sx={{ borderRadius: 8 }}
                />
              </Grid>
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
                  sx={{ borderRadius: 8 }}
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
                  sx={{ borderRadius: 8 }}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, borderRadius: 8, backgroundColor: '#4caf50', color: '#fff' }}
            >
              Sign Up
            </Button>
          </form>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link href="/signin" variant="body2" sx={{ color: '#4caf50' }}>
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
}

export default SignUp;
