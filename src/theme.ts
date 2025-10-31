// src/theme.ts
import { createTheme } from '@mui/material/styles';

// League of Legends inspired dark theme
// References:
// - Deep blue/black background: #0A1428
// - Dark paper panels:        #0F1A2B
// - Gold accent:              #C8AA6E
// - Teal accent (modern LoL): #0AC8B9
// - Parchment text:           #F0E6D2

const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#C8AA6E',
            contrastText: '#0A1428',
        },
        secondary: {
            main: '#0AC8B9',
            contrastText: '#0A1428',
        },
        background: {
            default: '#0A1428',
            paper: '#0F1A2B',
        },
        text: {
            primary: '#F0E6D2',
            secondary: '#C8AA6E',
        },
        divider: '#1F2A3C',
        success: { main: '#2E7D32' },
        warning: { main: '#ED6C02' },
        error:   { main: '#D32F2F' },
        info:    { main: '#2196F3' },
    },
    shape: { borderRadius: 8 },
});

export default theme;
