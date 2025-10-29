import { AppBar, Toolbar, Typography } from '@mui/material';

export default function Header() {
    return (
        <AppBar position="sticky">
            <Toolbar>
                <Typography variant="h6" component="div">Loldle-like</Typography>
            </Toolbar>
        </AppBar>
    );
}
