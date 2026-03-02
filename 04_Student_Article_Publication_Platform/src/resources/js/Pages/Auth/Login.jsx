import { Head, Link, useForm } from '@inertiajs/react';
import {
    Box,
    Card,
    Container,
    TextField,
    Button,
    Typography,
    FormControlLabel,
    Checkbox,
    Alert,
    CircularProgress,
} from '@mui/material';
import { useState } from 'react';
import EditIcon from '@mui/icons-material/Edit';

const Logo = () => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center', mb: 3 }}>
        <Box
            sx={{
                width: 50,
                height: 50,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transform: 'perspective(1000px) rotateY(-10deg)',
            }}
        >
            <EditIcon sx={{ color: 'white', fontSize: 28 }} />
        </Box>
        <Typography
            variant="h5"
            sx={{
                fontWeight: 800,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
            }}
        >
            PublishHub
        </Typography>
    </Box>
);

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            }}
        >
            <Head title="Log in" />

            <Container maxWidth="sm">
                <Card
                    sx={{
                        borderRadius: '16px',
                        boxShadow: '0 20px 60px rgba(102, 126, 234, 0.3)',
                        p: 4,
                    }}
                >
                    <Logo />

                    <Typography variant="h6" sx={{ textAlign: 'center', mb: 1, fontWeight: 700, color: '#1e293b' }}>
                        Welcome Back
                    </Typography>
                    <Typography
                        variant="body2"
                        sx={{ textAlign: 'center', mb: 3, color: '#64748b' }}
                    >
                        Sign in to your PublishHub account
                    </Typography>

                    {status && (
                        <Alert severity="success" sx={{ mb: 3 }}>
                            {status}
                        </Alert>
                    )}

                    <form onSubmit={submit}>
                        <TextField
                            id="email"
                            type="email"
                            name="email"
                            label="Email Address"
                            placeholder="your@email.com"
                            fullWidth
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            error={!!errors.email}
                            helperText={errors.email}
                            autoComplete="username"
                            autoFocus
                            sx={{ mb: 2 }}
                        />

                        <TextField
                            id="password"
                            type="password"
                            name="password"
                            label="Password"
                            placeholder="••••••••"
                            fullWidth
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            error={!!errors.password}
                            helperText={errors.password}
                            autoComplete="current-password"
                            sx={{ mb: 2 }}
                        />

                        <FormControlLabel
                            control={
                                <Checkbox
                                    name="remember"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                    sx={{
                                        '&.Mui-checked': {
                                            color: '#667eea',
                                        },
                                    }}
                                />
                            }
                            label={<Typography variant="body2">Remember me</Typography>}
                            sx={{ mb: 3 }}
                        />

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            size="large"
                            disabled={processing}
                            sx={{
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                fontWeight: 700,
                                textTransform: 'none',
                                fontSize: '16px',
                                py: 1.5,
                                mb: 2,
                                position: 'relative',
                            }}
                        >
                            {processing ? (
                                <CircularProgress size={24} sx={{ color: 'white' }} />
                            ) : (
                                'Sign In'
                            )}
                        </Button>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            {canResetPassword && (
                                <Link
                                    href={route('password.request')}
                                    style={{
                                        color: '#667eea',
                                        textDecoration: 'none',
                                        fontWeight: 600,
                                        fontSize: '14px',
                                    }}
                                >
                                    Forgot Password?
                                </Link>
                            )}
                        </Box>

                        <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                                Don't have an account?
                            </Typography>
                            <Link
                                href={route('register')}
                                style={{
                                    color: '#667eea',
                                    textDecoration: 'none',
                                    fontWeight: 700,
                                    fontSize: '15px',
                                }}
                            >
                                Create one now
                            </Link>
                        </Box>
                    </form>

                    <Typography
                        variant="caption"
                        sx={{
                            display: 'block',
                            textAlign: 'center',
                            mt: 3,
                            color: '#94a3b8',
                        }}
                    >
                        Demo Accounts: writer@example.com | editor@example.com | student@example.com (password: password)
                    </Typography>
                </Card>
            </Container>
        </Box>
    );
}
