import React, { useState, useEffect } from 'react';
import { Container, Typography, TextField, Button, FormControl, InputLabel, Select, MenuItem, Grid, Box, Card, CardContent, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CheckIcon from '@mui/icons-material/Check';

function CreateForm() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        author: '',
        topic: '',
        comments: [],
    });
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);

    useEffect(() => {
        const userName = localStorage.getItem('userName');
        if (userName) {
            setFormData(prevFormData => ({
                ...prevFormData,
                author: userName,
            }));
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            if (!formData.title || !formData.content || !formData.topic) {
                alert('Please fill in all fields, including selecting a topic.');
                return;
            }

            const res = await fetch('http://localhost:8000/api/blog/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            console.log(data);
            setShowSuccessAlert(true);
            setFormData({
                title: '',
                content: '',
                author: '',
                topic: '',
                comments: [],
            });

            setTimeout(() => {
                navigate('/'); // Adjust the path if your homepage has a different path
            }, 1000);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 4 }}>
            {showSuccessAlert ? (
                <Alert icon={<CheckIcon fontSize="inherit" />} severity="success" sx={{ mb: 2 }}>
                    Your post is live! Share your thoughts with the world.
                </Alert>
            ) : (
                <Card raised sx={{ p: 4, bgcolor: '#FFA500', boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)' }}>
                    <CardContent>
                        <Typography variant="h5" component="h2" gutterBottom sx={{ textAlign: 'center', color: 'white', mb: 4 }}>
                            Spark a conversation with a fresh blog post.
                        </Typography>
                        <form onSubmit={handleSubmit} noValidate>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <TextField
                                        label="Title"
                                        variant="outlined"
                                        name="title"
                                        fullWidth
                                        required
                                        value={formData.title}
                                        onChange={handleChange}
                                        sx={{ bgcolor: 'white' }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        label="Content"
                                        variant="outlined"
                                        name="content"
                                        fullWidth
                                        required
                                        multiline
                                        rows={6}
                                        value={formData.content}
                                        onChange={handleChange}
                                        sx={{ bgcolor: 'white' }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <FormControl fullWidth>
                                        <InputLabel>Topic</InputLabel>
                                        <Select
                                            value={formData.topic}
                                            label="Topic"
                                            onChange={handleChange}
                                            name="topic"
                                            required
                                            sx={{ bgcolor: 'white' }}
                                        >
                                            {['Academic Resources', 'Career Services', 'Campus', 'Culture', 'Local Community Resources', 'Social', 'Sports', 'Health and Wellness', 'Technology', 'Travel', 'Alumni'].map((topic) => (
                                                <MenuItem key={topic} value={topic}>{topic}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>
                            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                                <Button variant="contained" color="primary" type="submit" sx={{ mr: 2 }}>
                                    Submit
                                </Button>
                                <Button variant="outlined" color="secondary" onClick={() => navigate('/')}>
                                    Cancel
                                </Button>
                            </Box>
                        </form>
                    </CardContent>
                </Card>
            )}
        </Container>
    );
}

export default CreateForm;
