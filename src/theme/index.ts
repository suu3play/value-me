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
                    fontWeight: 600,
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                        '@media (hover: hover)': {
                            transform: 'translateY(-1px)',
                            boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
                        },
                    },
                    '&:active': {
                        transform: 'translateY(0px)',
                        transition: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
                    },
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
                contained: {
                    '&:hover': {
                        '@media (hover: hover)': {
                            transform: 'translateY(-1px)',
                            boxShadow: '0 6px 16px rgba(25, 118, 210, 0.4)',
                        },
                    },
                },
                outlined: {
                    '&:hover': {
                        '@media (hover: hover)': {
                            transform: 'translateY(-1px)',
                            boxShadow: '0 4px 12px rgba(25, 118, 210, 0.15)',
                            borderColor: '#1565c0',
                        },
                    },
                },
                text: {
                    '&:hover': {
                        '@media (hover: hover)': {
                            transform: 'translateY(-1px)',
                            backgroundColor: 'rgba(25, 118, 210, 0.08)',
                        },
                    },
                },
            },
        },
        MuiToggleButton: {
            styleOverrides: {
                root: {
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                        '@media (hover: hover)': {
                            transform: 'translateY(-1px)',
                            boxShadow: '0 4px 12px rgba(25, 118, 210, 0.2)',
                        },
                    },
                    '&:active': {
                        transform: 'translateY(0px)',
                        transition: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
                    },
                    '&:focus-visible': {
                        outline: '3px solid',
                        outlineColor: '#1976d2',
                        outlineOffset: '2px',
                    },
                    '&.Mui-selected': {
                        backgroundColor: '#1976d2',
                        color: '#ffffff',
                        '&:hover': {
                            '@media (hover: hover)': {
                                backgroundColor: '#1565c0',
                                transform: 'translateY(-1px)',
                                boxShadow: '0 6px 16px rgba(21, 101, 192, 0.4)',
                            },
                        },
                    },
                },
            },
        },
        MuiFab: {
            styleOverrides: {
                root: {
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                        '@media (hover: hover)': {
                            transform: 'translateY(-2px) scale(1.05)',
                            boxShadow: '0 8px 20px rgba(25, 118, 210, 0.4)',
                        },
                    },
                    '&:active': {
                        transform: 'translateY(0px) scale(1.02)',
                        transition: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
                    },
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
        MuiCheckbox: {
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
        MuiIconButton: {
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
        MuiRadio: {
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
        MuiSwitch: {
            styleOverrides: {
                root: {
                    '& .MuiSwitch-switchBase': {
                        '&:focus-visible': {
                            outline: '3px solid',
                            outlineColor: '#1976d2',
                            outlineOffset: '2px',
                        },
                    },
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