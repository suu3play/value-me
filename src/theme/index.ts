import { createTheme } from '@mui/material/styles';

export const appTheme = createTheme({
    palette: {
        primary: {
            main: '#1976d2', // より高いコントラスト比のため青を暗く
            contrastText: '#ffffff',
        },
        secondary: {
            main: '#388e3c', // より高いコントラスト比のため緑を暗く
            contrastText: '#ffffff',
        },
        error: {
            main: '#d32f2f',
            contrastText: '#ffffff',
        },
        warning: {
            main: '#f57c00',
            contrastText: '#ffffff',
        },
        info: {
            main: '#1976d2',
            contrastText: '#ffffff',
        },
        success: {
            main: '#388e3c',
            contrastText: '#ffffff',
        },
    },
    typography: {
        fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Noto Sans JP"',
            '"Segoe UI"',
            'Roboto',
            'sans-serif',
        ].join(','),
        h4: {
            '@media (max-width:600px)': {
                fontSize: '1.75rem',
            },
        },
        subtitle1: {
            '@media (max-width:600px)': {
                fontSize: '0.9rem',
            },
        },
    },
    shape: {
        borderRadius: 12,
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    minHeight: 44,
                    fontWeight: 600, // より読みやすいフォント太さ
                    '&:focus-visible': {
                        outline: '3px solid',
                        outlineColor: '#1976d2',
                        outlineOffset: '2px',
                    },
                    '@media (max-width:600px)': {
                        minHeight: 48,
                        fontSize: '1rem',
                        padding: '12px 16px',
                    },
                },
            },
        },
        MuiToggleButton: {
            styleOverrides: {
                root: {
                    '&:focus-visible': {
                        outline: '3px solid',
                        outlineColor: '#1976d2',
                        outlineOffset: '2px',
                    },
                    '&.Mui-selected': {
                        backgroundColor: '#1976d2',
                        color: '#ffffff',
                        '&:hover': {
                            backgroundColor: '#1565c0',
                        },
                    },
                },
            },
        },
        MuiFab: {
            styleOverrides: {
                root: {
                    '&:focus-visible': {
                        outline: '3px solid',
                        outlineColor: '#1976d2',
                        outlineOffset: '2px',
                    },
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiInputBase-root': {
                        '&:focus-within': {
                            '& .MuiOutlinedInput-notchedOutline': {
                                borderWidth: '2px',
                                borderColor: '#1976d2',
                            },
                        },
                    },
                    '@media (max-width:600px)': {
                        '& .MuiInputBase-root': {
                            minHeight: 48,
                        },
                    },
                },
            },
        },
        MuiFormControl: {
            styleOverrides: {
                root: {
                    '& .MuiInputBase-root': {
                        '&:focus-within': {
                            '& .MuiOutlinedInput-notchedOutline': {
                                borderWidth: '2px',
                                borderColor: '#1976d2',
                            },
                        },
                    },
                    '@media (max-width:600px)': {
                        '& .MuiInputBase-root': {
                            minHeight: 48,
                        },
                    },
                },
            },
        },
        MuiAlert: {
            styleOverrides: {
                root: {
                    fontSize: '0.95rem',
                    '& .MuiAlert-message': {
                        color: 'inherit',
                    },
                },
                standardWarning: {
                    backgroundColor: '#fff3e0',
                    color: '#e65100',
                    border: '1px solid #ffb74d',
                },
                standardInfo: {
                    backgroundColor: '#e3f2fd',
                    color: '#0d47a1',
                    border: '1px solid #64b5f6',
                },
                standardError: {
                    backgroundColor: '#ffebee',
                    color: '#c62828',
                    border: '1px solid #ef5350',
                },
                standardSuccess: {
                    backgroundColor: '#e8f5e8',
                    color: '#2e7d32',
                    border: '1px solid #81c784',
                },
            },
        },
    },
    // カスタムブレークポイント追加
    breakpoints: {
        values: {
            xs: 0,
            sm: 600,
            md: 960,
            lg: 1280,
            xl: 1920,
        },
    },
});