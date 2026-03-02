import React, { useState } from 'react';
import { Container, Typography, Button, TextField, Box } from '@mui/material';
import { Inertia } from '@inertiajs/inertia';

export default function Dashboard({ articles, comments }) {
    const [commentText, setCommentText] = useState('');
    const [selectedArticle, setSelectedArticle] = useState(null);

    const postComment = () => {
        Inertia.post(route('student.articles.comment', selectedArticle), { content: commentText });
    };

    return (
        <Container>
            <Typography variant="h4">Student Dashboard</Typography>

            <Box sx={{ mb:3 }}>
                <Typography variant="h5">Published Articles</Typography>
                <ul>
                {articles.map(a => (
                    <li key={a.id}>
                        {a.title} by {a.writer.name}
                        <Button size="small" onClick={() => setSelectedArticle(a)}>Comment</Button>
                    </li>
                ))}
                </ul>
            </Box>

            {selectedArticle && (
                <Box>
                    <Typography>Commenting on: {selectedArticle.title}</Typography>
                    <TextField
                        label="Comment"
                        fullWidth
                        multiline
                        rows={3}
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                    />
                    <Button variant="contained" sx={{ mt:1 }} onClick={postComment}>Post Comment</Button>
                </Box>
            )}

            <Box sx={{ mt:4 }}>
                <Typography variant="h5">My Comments</Typography>
                <ul>
                {comments.map(c => (
                    <li key={c.id}>{c.article.title}: {c.content}</li>
                ))}
                </ul>
            </Box>
        </Container>
    );
}
