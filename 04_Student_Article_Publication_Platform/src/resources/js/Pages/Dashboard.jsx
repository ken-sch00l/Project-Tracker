import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import {
    AppBar,
    Toolbar,
    Typography,
    Box,
    Container,
    Tabs,
    Tab,
    Card,
    CardContent,
    Button,
    Avatar,
    Menu,
    MenuItem,
    Divider,
    Paper,
} from '@mui/material';
import JoditEditor from 'jodit-react';

export default function Dashboard({ role, stats, articles = [], auth }) {

    const [activeTab, setActiveTab] = useState(0);
    const [anchorEl, setAnchorEl] = useState(null);
    const [form, setForm] = useState({ title: '', content: '' });

    const handleLogout = () => router.post('/logout');

    const renderStats = () => {
        if (!stats) return null;

        return (
            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                    gap: 3,
                    mb: 5
                }}
            >
                {Object.entries(stats).map(([key, value]) => (
                    <Card
                        key={key}
                        sx={{
                            border: '1px solid #E5E7EB',
                            borderRadius: 3,
                            textAlign: 'center',
                            py: 2
                        }}
                    >
                        <CardContent>
                            <Typography
                                variant="caption"
                                sx={{
                                    textTransform: 'uppercase',
                                    color: '#6B7280',
                                    letterSpacing: 1
                                }}
                            >
                                {key.replace('_', ' ')}
                            </Typography>

                            <Typography variant="h4" sx={{ fontWeight: 700 }}>
                                {value}
                            </Typography>
                        </CardContent>
                    </Card>
                ))}
            </Box>
        );
    };

    const renderWriterContent = () => (
        <>
            <Tabs
                value={activeTab}
                onChange={(e, v) => setActiveTab(v)}
                sx={{ mb: 4 }}
            >
                <Tab label="Create" />
                <Tab label="My Articles" />
            </Tabs>

            {/* CREATE TAB */}
            {activeTab === 0 && (
                <Paper
                    sx={{
                        p: 4,
                        border: '1px solid #E5E7EB',
                        borderRadius: 3
                    }}
                >
                    <Typography variant="h6" sx={{ mb: 3 }}>
                        Create New Article
                    </Typography>

                    <input
                        placeholder="Article Title"
                        style={{
                            width: '100%',
                            padding: '12px',
                            marginBottom: '20px',
                            borderRadius: '8px',
                            border: '1px solid #E5E7EB'
                        }}
                        value={form.title}
                        onChange={(e) =>
                            setForm({ ...form, title: e.target.value })
                        }
                    />

                    <JoditEditor
                        value={form.content}
                        onBlur={(newContent) =>
                            setForm({ ...form, content: newContent })
                        }
                    />

                    <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                        <Button
                            variant="contained"
                            sx={{
                                backgroundColor: '#0F172A',
                                textTransform: 'none'
                            }}
                        >
                            Save Draft
                        </Button>

                        <Button
                            variant="outlined"
                            sx={{
                                borderColor: '#C6A75E',
                                color: '#C6A75E',
                                textTransform: 'none'
                            }}
                        >
                            Submit for Review
                        </Button>
                    </Box>
                </Paper>
            )}

            {/* MY ARTICLES TAB */}
            {activeTab === 1 && (
                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns:
                            'repeat(auto-fill, minmax(320px, 1fr))',
                        gap: 4
                    }}
                >
                    {articles.map((article) => (
                        <Card
                            key={article.id}
                            sx={{
                                height: 280,
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                border: '1px solid #E5E7EB',
                                borderRadius: 3,
                                backgroundColor: 'white',
                                transition: 'all 0.25s ease',
                                cursor: 'pointer',
                                '&:hover': {
                                    transform: 'translateY(-6px)',
                                    boxShadow:
                                        '0 12px 24px rgba(0,0,0,0.08)',
                                    borderColor: '#C6A75E'
                                }
                            }}
                        >
                            <CardContent sx={{ flexGrow: 1 }}>
                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontWeight: 600,
                                        mb: 1,
                                        display: '-webkit-box',
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: 'vertical',
                                        overflow: 'hidden'
                                    }}
                                >
                                    {article.title}
                                </Typography>

                                <Typography
                                    variant="caption"
                                    sx={{
                                        color: '#6B7280',
                                        display: 'block',
                                        mb: 2
                                    }}
                                >
                                    {article.category?.name}
                                </Typography>

                                <Box
                                    sx={{
                                        display: 'inline-block',
                                        px: 1.5,
                                        py: 0.5,
                                        borderRadius: 2,
                                        fontSize: '0.75rem',
                                        fontWeight: 600,
                                        textTransform: 'capitalize',
                                        backgroundColor: '#F3F4F6',
                                        color: '#374151'
                                    }}
                                >
                                    {article.status?.name?.replace(
                                        '_',
                                        ' '
                                    )}
                                </Box>

                                <Typography
                                    variant="caption"
                                    sx={{
                                        display: 'block',
                                        mt: 2,
                                        color: '#9CA3AF'
                                    }}
                                >
                                    Updated{' '}
                                    {new Date(
                                        article.updated_at
                                    ).toLocaleDateString()}
                                </Typography>
                            </CardContent>

                            <Box
                                sx={{
                                    px: 2,
                                    pb: 2,
                                    display: 'flex',
                                    justifyContent: 'space-between'
                                }}
                            >
                                <Button
                                    size="small"
                                    sx={{
                                        textTransform: 'none',
                                        color: '#0F172A'
                                    }}
                                >
                                    View
                                </Button>

                                {article.status?.name === 'draft' && (
                                    <Button
                                        size="small"
                                        sx={{
                                            textTransform: 'none',
                                            fontWeight: 600,
                                            color: '#C6A75E'
                                        }}
                                    >
                                        Submit
                                    </Button>
                                )}
                            </Box>
                        </Card>
                    ))}
                </Box>
            )}
        </>
    );

    return (
        <>
            <Head title="Dashboard" />

            <Box sx={{ minHeight: '100vh', backgroundColor: '#F8F6F1' }}>
                <AppBar
                    position="static"
                    sx={{
                        backgroundColor: 'white',
                        color: '#0F172A',
                        boxShadow: 'none',
                        borderBottom: '1px solid #E5E7EB'
                    }}
                >
                    <Toolbar>
                        <Typography
                            variant="h6"
                            sx={{ flexGrow: 1, fontWeight: 600 }}
                        >
                            PublishHub
                        </Typography>

                        <Avatar
                            onClick={(e) =>
                                setAnchorEl(e.currentTarget)
                            }
                            sx={{
                                cursor: 'pointer',
                                bgcolor: '#0F172A'
                            }}
                        >
                            {auth?.user?.name?.charAt(0)}
                        </Avatar>

                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={() => setAnchorEl(null)}
                        >
                            <MenuItem disabled>
                                {auth?.user?.name}
                            </MenuItem>

                            <Divider />

                            <MenuItem
                                onClick={() => {
                                    setAnchorEl(null);
                                    router.visit('/profile');
                                }}
                            >
                                Profile
                            </MenuItem>

                            <MenuItem
                                onClick={() => {
                                    setAnchorEl(null);
                                    handleLogout();
                                }}
                                sx={{ color: '#B91C1C' }}
                            >
                                Logout
                            </MenuItem>
                        </Menu>
                    </Toolbar>
                </AppBar>

                <Container sx={{ py: 6 }} maxWidth="lg">
                    <Typography
                        variant="h4"
                        sx={{ mb: 4, fontWeight: 700 }}
                    >
                        {role?.charAt(0).toUpperCase() +
                            role?.slice(1)}{' '}
                        Dashboard
                    </Typography>

                    {renderStats()}

                    {role === 'writer' && renderWriterContent()}
                </Container>
            </Box>
        </>
    );
}