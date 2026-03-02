import { Head, Link, useForm } from '@inertiajs/react';
import {
    Box,
    Card,
    Container,
    TextField,
    Button,
    Typography,
    Alert,
    CircularProgress,
} from '@mui/material';
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

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
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
            <Head title="Register" />

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
                        Join PublishHub
                    </Typography>
                    <Typography
                        variant="body2"
                        sx={{ textAlign: 'center', mb: 3, color: '#64748b' }}
                    >
                        Create your account to start publishing
                    </Typography>

                    <form onSubmit={submit}>
                        <TextField
                            id="name"
                            name="name"
                            label="Full Name"
                            placeholder="John Doe"
                            fullWidth
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            error={!!errors.name}
                            helperText={errors.name}
                            autoComplete="name"
                            autoFocus
                            sx={{ mb: 2 }}
                            required
                        />

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
                            sx={{ mb: 2 }}
                            required
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
                            autoComplete="new-password"
                            sx={{ mb: 2 }}
                            required
                        />

                        <TextField
                            id="password_confirmation"
                            type="password"
                            name="password_confirmation"
                            label="Confirm Password"
                            placeholder="••••••••"
                            fullWidth
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            error={!!errors.password_confirmation}
                            helperText={errors.password_confirmation}
                            autoComplete="new-password"
                            sx={{ mb: 3 }}
                            required
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
                            }}
                        >
                            {processing ? (
                                <CircularProgress size={24} sx={{ color: 'white' }} />
                            ) : (
                                'Create Account'
                            )}
                        </Button>

                        <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                                Already have an account?
                            </Typography>
                            <Link
                                href={route('login')}
                                style={{
                                    color: '#667eea',
                                    textDecoration: 'none',
                                    fontWeight: 700,
                                    fontSize: '15px',
                                }}
                            >
                                Sign in here
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
                        By registering, you agree to PublishHub's Terms of Service
                    </Typography>
                </Card>
            </Container>
        </Box>
    );
}
