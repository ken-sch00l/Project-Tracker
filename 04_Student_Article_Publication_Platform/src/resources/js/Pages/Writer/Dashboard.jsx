import React, { useState } from 'react';
import { Inertia } from '@inertiajs/inertia';
import {
    Box,
    Container,
    TextField,
    Button,
    Select,
    MenuItem,
    Typography,
    Card,
    CardContent,
    CardActions,
    Grid,
    Chip,
    AppBar,
    Toolbar,
    Paper,
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Divider,
    Fade,
    Alert,
    Menu,
    Avatar,
    IconButton,
} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import JoditEditor from 'jodit-react';
import EditIcon from '@mui/icons-material/Edit';
import SendIcon from '@mui/icons-material/Send';
import AddIcon from '@mui/icons-material/Add';
import CreateIcon from '@mui/icons-material/Create';
import DoneIcon from '@mui/icons-material/Done';

const STATUS_COLORS = {
    draft: { bg: '#f0f4ff', text: '#4f46e5', border: '#e0e7ff' },
    submitted: { bg: '#f0fdf4', text: '#16a34a', border: '#dcfce7' },
    needs_revision: { bg: '#fff7ed', text: '#ea580c', border: '#fed7aa' },
    published: { bg: '#f8fafc', text: '#64748b', border: '#e2e8f0' },
};

const DRAWER_WIDTH = 280;
const THEME = {
    primary: '#4f46e5',
    success: '#16a34a',
    warning: '#ea580c',
    surface: 'rgba(255, 255, 255, 0.95)',
};

export default function Dashboard({ articles, categories: serverCategories, auth }) {
    const [activeNav, setActiveNav] = useState('create');
    const [form, setForm] = useState({ title: '', content: '', category_id: '' });
    const [profileAnchor, setProfileAnchor] = useState(null);
    // Use server-provided categories; don't fall back to a mismatched local list.
    const [categories] = useState(serverCategories && serverCategories.length > 0 ? serverCategories : []);

    const handleSubmit = (e) => {
        e.preventDefault();
        Inertia.post(route('writer.articles.store'), form);
    };

    const handleSubmitArticle = (articleId) => {
        Inertia.post(route('writer.articles.submit', articleId));
    };

    const draftArticles = articles.filter(a => a.status.name === 'draft');
    const submittedArticles = articles.filter(a => a.status.name === 'submitted');
    const revisedArticles = articles.filter(a => a.status.name === 'needs_revision');

    const renderMainContent = () => {
        switch (activeNav) {
            case 'create':
                return (
                    <Fade in={activeNav === 'create'}>
                        <Paper
                            sx={{
                                p: 4,
                                borderRadius: '16px',
                                background: THEME.surface,
                                boxShadow: '0 10px 40px rgba(31, 41, 55, 0.1)',
                                border: '1px solid rgba(255, 255, 255, 0.8)',
                                backdropFilter: 'blur(10px)',
                            }}
                        >
                            <Typography variant="h5" sx={{ mb: 1, fontWeight: 800, color: '#111827', letterSpacing: '-0.5px' }}>
                                Create New Article
                            </Typography>
                            <Typography variant="body2" sx={{ mb: 4, color: '#6b7280' }}>
                                Share your thoughts with the world
                            </Typography>
                            <Box component="form" onSubmit={handleSubmit}>
                                <TextField
                                    label="Article Title"
                                    fullWidth
                                    placeholder="Enter a compelling title..."
                                    value={form.title}
                                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                                    sx={{
                                        mb: 3,
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: '10px',
                                            backgroundColor: '#f9fafb',
                                            '&:hover fieldset': { borderColor: THEME.primary },
                                            '&.Mui-focused fieldset': { borderColor: THEME.primary },
                                        },
                                    }}
                                    required
                                    variant="outlined"
                                />

                                <Select
                                    fullWidth
                                    value={form.category_id}
                                    onChange={(e) => setForm({ ...form, category_id: e.target.value ? Number(e.target.value) : '' })}
                                    displayEmpty
                                    sx={{
                                        mb: 4,
                                        borderRadius: '10px',
                                        backgroundColor: '#f9fafb',
                                        '& .MuiOutlinedInput-root': {
                                            '&:hover fieldset': { borderColor: THEME.primary },
                                            '&.Mui-focused fieldset': { borderColor: THEME.primary },
                                        },
                                    }}
                                >
                                    <MenuItem value="" disabled>Select a category</MenuItem>
                                    {categories.map((cat) => (
                                        <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
                                    ))}
                                </Select>

                                <Typography sx={{ mb: 2, fontWeight: 700, color: '#111827', fontSize: '0.95rem' }}>
                                    Article Content
                                </Typography>
                                <Paper
                                    sx={{
                                        mb: 4,
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '12px',
                                        overflow: 'hidden',
                                        backgroundColor: '#fafbfc',
                                    }}
                                >
                                    <JoditEditor
                                        value={form.content}
                                        onBlur={(newContent) => setForm({ ...form, content: newContent })}
                                    />
                                </Paper>

                                <Box sx={{ display: 'flex', gap: 3 }}>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        size="large"
                                        sx={{
                                            background: `linear-gradient(135deg, ${THEME.primary} 0%, #614ce1 100%)`,
                                            fontWeight: 700,
                                            textTransform: 'none',
                                            borderRadius: '10px',
                                            py: 1.5,
                                            fontSize: '1rem',
                                            boxShadow: `0 4px 15px rgba(79, 70, 229, 0.3)`,
                                            '&:hover': {
                                                boxShadow: `0 6px 25px rgba(79, 70, 229, 0.4)`,
                                            },
                                        }}
                                    >
                                        Save as Draft
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="contained"
                                        size="large"
                                        onClick={(e) => {
                                            Inertia.post(route('writer.articles.store'), { ...form, submit: true });
                                        }}
                                        sx={{
                                            background: THEME.success,
                                            fontWeight: 700,
                                            textTransform: 'none',
                                            borderRadius: '10px',
                                            py: 1.5,
                                            fontSize: '1rem',
                                            boxShadow: `0 4px 15px rgba(22, 163, 74, 0.3)`,
                                            '&:hover': {
                                                boxShadow: `0 6px 25px rgba(22, 163, 74, 0.4)`,
                                            },
                                        }}
                                    >
                                        Save & Submit for Review
                                    </Button>
                                </Box>
                            </Box>
                        </Paper>
                    </Fade>
                );

            case 'drafts':
                return (
                    <Fade in={activeNav === 'drafts'}>
                        <Box>
                            <Box sx={{ mb: 4 }}>
                                <Typography variant="h5" sx={{ mb: 1, fontWeight: 800, color: '#111827', letterSpacing: '-0.5px' }}>
                                    My Drafts
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#6b7280' }}>
                                    You have {draftArticles.length} draft{draftArticles.length !== 1 ? 's' : ''}
                                </Typography>
                            </Box>
                            {draftArticles.length === 0 ? (
                                <Card sx={{ borderRadius: '12px' }}>
                                    <CardContent sx={{ textAlign: 'center', py: 6 }}>
                                        <Typography color="textSecondary">
                                            📝 No drafts yet. Start creating!
                                        </Typography>
                                    </CardContent>
                                </Card>
                            ) : (
                                <Grid container spacing={3}>
                                    {draftArticles.map((article) => (
                                        <Grid key={article.id} item xs={12}>
                                            <Card
                                                sx={{
                                                    borderRadius: '12px',
                                                    border: '1px solid #e2e8f0',
                                                    transition: 'all 0.3s ease',
                                                    '&:hover': {
                                                        transform: 'translateX(4px)',
                                                        boxShadow: '0 8px 20px rgba(102, 126, 234, 0.1)',
                                                    },
                                                }}
                                            >
                                                <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                                    <Box>
                                                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                                                            {article.title}
                                                        </Typography>
                                                        <Chip label={article.category.name} size="small" sx={{ mb: 2 }} />
                                                        <Typography variant="caption" color="textSecondary" sx={{ display: 'block' }}>
                                                            Last edited: {new Date(article.updated_at).toLocaleDateString()}
                                                        </Typography>
                                                    </Box>
                                                    <Chip
                                                        label="Draft"
                                                        sx={{
                                                            background: STATUS_COLORS.draft.bg,
                                                            color: STATUS_COLORS.draft.text,
                                                            fontWeight: 600,
                                                        }}
                                                    />
                                                </CardContent>
                                                <CardActions>
                                                    <Button size="small" startIcon={<EditIcon />} sx={{ color: '#667eea' }}>
                                                        Edit
                                                    </Button>
                                                    <Button
                                                        size="small"
                                                        startIcon={<SendIcon />}
                                                        onClick={() => handleSubmitArticle(article.id)}
                                                        sx={{ color: '#667eea', fontWeight: 600 }}
                                                    >
                                                        Submit
                                                    </Button>
                                                </CardActions>
                                            </Card>
                                        </Grid>
                                    ))}
                                </Grid>
                            )}
                        </Box>
                    </Fade>
                );

            case 'submitted':
                return (
                    <Fade in={activeNav === 'submitted'}>
                        <Box>
                            <Box sx={{ mb: 4 }}>
                                <Typography variant="h5" sx={{ mb: 1, fontWeight: 800, color: '#111827', letterSpacing: '-0.5px' }}>
                                    Submitted Articles
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#6b7280' }}>
                                    {submittedArticles.length} under review, {revisedArticles.length} awaiting revision
                                </Typography>
                            </Box>
                            {submittedArticles.length === 0 && revisedArticles.length === 0 ? (
                                <Card sx={{ borderRadius: '12px' }}>
                                    <CardContent sx={{ textAlign: 'center', py: 6 }}>
                                        <Typography color="textSecondary">
                                            📤 No submitted articles yet.
                                        </Typography>
                                    </CardContent>
                                </Card>
                            ) : (
                                <Grid container spacing={3}>
                                    {[...submittedArticles, ...revisedArticles].map((article) => (
                                        <Grid key={article.id} item xs={12}>
                                            <Card
                                                sx={{
                                                    borderRadius: '12px',
                                                    border: '1px solid #e2e8f0',
                                                    transition: 'all 0.3s ease',
                                                    '&:hover': {
                                                        transform: 'translateX(4px)',
                                                        boxShadow: '0 8px 20px rgba(102, 126, 234, 0.1)',
                                                    },
                                                }}
                                            >
                                                <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                                    <Box>
                                                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                                                            {article.title}
                                                        </Typography>
                                                        <Chip label={article.category.name} size="small" sx={{ mb: 2 }} />
                                                        <Typography variant="caption" color="textSecondary" sx={{ display: 'block' }}>
                                                            Status: {article.status.label}
                                                        </Typography>
                                                    </Box>
                                                    <Chip
                                                        label={article.status.label}
                                                        sx={{
                                                            background: STATUS_COLORS[article.status.name]?.bg || '#f0f0f0',
                                                            color: STATUS_COLORS[article.status.name]?.text || '#666',
                                                            fontWeight: 600,
                                                        }}
                                                    />
                                                </CardContent>
                                                {article.status.name === 'needs_revision' && (
                                                    <CardActions>
                                                        <Button size="small" startIcon={<EditIcon />} sx={{ color: '#e65100', fontWeight: 600 }}>
                                                            Revise
                                                        </Button>
                                                    </CardActions>
                                                )}
                                            </Card>
                                        </Grid>
                                    ))}
                                </Grid>
                            )}
                        </Box>
                    </Fade>
                );

            default:
                return null;
        }
    };

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)' }}>
            {/* Header */}
            <AppBar
                position="fixed"
                sx={{
                    background: `linear-gradient(135deg, ${THEME.primary} 0%, #614ce1 100%)`,
                    boxShadow: '0 8px 32px rgba(79, 70, 229, 0.15)',
                    zIndex: 1201,
                    backdropFilter: 'blur(10px)',
                }}
            >
                <Toolbar>
                    <Typography variant="h6" sx={{ fontWeight: 800, flexGrow: 1, fontSize: '1.1rem', letterSpacing: '-0.3px' }}>
                        ✍️ Writer Dashboard
                    </Typography>
                    <IconButton
                        onClick={(e) => setProfileAnchor(e.currentTarget)}
                        sx={{ color: 'white', ml: 2 }}
                    >
                        <Avatar sx={{ background: 'rgba(255,255,255,0.2)', width: 32, height: 32 }}>
                            {auth?.user?.name?.charAt(0) || 'U'}
                        </Avatar>
                    </IconButton>
                    <Menu
                        anchorEl={profileAnchor}
                        open={Boolean(profileAnchor)}
                        onClose={() => setProfileAnchor(null)}
                    >
                        <MenuItem disabled>
                            <Typography variant="caption" sx={{ fontWeight: 600 }}>{auth?.user?.name}</Typography>
                        </MenuItem>
                        <Divider />
                        <MenuItem onClick={() => setProfileAnchor(null)}>
                            <AccountCircleIcon sx={{ mr: 1, fontSize: 18 }} />
                            Profile
                        </MenuItem>
                        <MenuItem onClick={() => {
                            setProfileAnchor(null);
                            window.location.href = '/sample/logout';
                        }}>
                            <LogoutIcon sx={{ mr: 1, fontSize: 18, color: '#e65100' }} />
                            Log Out
                        </MenuItem>
                        <Divider />
                        <MenuItem
                            onClick={() => {
                                setProfileAnchor(null);
                                window.location.href = '/sample/switch/editor';
                            }}
                            sx={{ fontSize: '0.85rem', color: '#667eea' }}
                        >
                            <SwapHorizIcon sx={{ mr: 1, fontSize: 16 }} />
                            Demo: Switch to Editor
                        </MenuItem>
                        <MenuItem
                            onClick={() => {
                                setProfileAnchor(null);
                                window.location.href = '/sample/switch/student';
                            }}
                            sx={{ fontSize: '0.85rem', color: '#667eea' }}
                        >
                            <SwapHorizIcon sx={{ mr: 1, fontSize: 16 }} />
                            Demo: Switch to Student
                        </MenuItem>
                    </Menu>
                </Toolbar>
            </AppBar>

            {/* Sidebar */}
            <Drawer
                variant="permanent"
                sx={{
                    width: DRAWER_WIDTH,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: DRAWER_WIDTH,
                        boxSizing: 'border-box',
                        background: 'white',
                        borderRight: '1px solid #e2e8f0',
                        mt: '64px',
                    },
                }}
            >
                <Box sx={{ p: 2 }}>
                    <List>
                        <ListItem
                            button
                            onClick={() => setActiveNav('create')}
                            sx={{
                                borderRadius: '8px',
                                mb: 1,
                                background: activeNav === 'create' ? '#f3e5f5' : 'transparent',
                                '&:hover': { background: '#f5f5f5' },
                            }}
                        >
                            <ListItemIcon sx={{ color: activeNav === 'create' ? '#667eea' : '#64748b' }}>
                                <AddIcon />
                            </ListItemIcon>
                            <ListItemText primary="Create Article" />
                        </ListItem>

                        <ListItem
                            button
                            onClick={() => setActiveNav('drafts')}
                            sx={{
                                borderRadius: '8px',
                                mb: 1,
                                background: activeNav === 'drafts' ? '#f3e5f5' : 'transparent',
                                '&:hover': { background: '#f5f5f5' },
                            }}
                        >
                            <ListItemIcon sx={{ color: activeNav === 'drafts' ? '#667eea' : '#64748b' }}>
                                <CreateIcon />
                            </ListItemIcon>
                            <ListItemText
                                primary="My Drafts"
                                secondary={draftArticles.length}
                            />
                        </ListItem>

                        <ListItem
                            button
                            onClick={() => setActiveNav('submitted')}
                            sx={{
                                borderRadius: '8px',
                                background: activeNav === 'submitted' ? '#f3e5f5' : 'transparent',
                                '&:hover': { background: '#f5f5f5' },
                            }}
                        >
                            <ListItemIcon sx={{ color: activeNav === 'submitted' ? '#667eea' : '#64748b' }}>
                                <DoneIcon />
                            </ListItemIcon>
                            <ListItemText
                                primary="Submitted Articles"
                                secondary={submittedArticles.length + revisedArticles.length}
                            />
                        </ListItem>
                    </List>
                </Box>
            </Drawer>

            {/* Main Content */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    mt: '64px',
                    p: 3,
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <Container maxWidth="lg" sx={{ flexGrow: 1 }}>
                    {renderMainContent()}
                </Container>

                {/* Footer */}
                <Box
                    sx={{
                        mt: 4,
                        py: 2,
                        borderTop: '1px solid #e2e8f0',
                        background: 'white',
                        textAlign: 'center',
                        color: '#64748b',
                    }}
                >
                    <Typography variant="body2">
                        📊 Total Articles: {articles.length} | Drafts: {draftArticles.length} | Submitted: {submittedArticles.length + revisedArticles.length}
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
}
