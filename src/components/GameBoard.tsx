import { Alert, Box, Paper, Stack, Typography, Button } from '@mui/material';
import { useGameStore } from '../store/useGameStore';
import ClueRow from './ClueRow';

export default function GameBoard() {
    const { guesses, answer, reset, maxGuesses } = useGameStore();
    const last = guesses[guesses.length - 1];
    const won = last?.clues?.some(c => c.field === 'name' && c.status === 'correct');
    const lost = !won && guesses.length >= maxGuesses;

    return (
        <Paper sx={{ p: 2 }}>
            <Stack spacing={2}>
                <Typography variant="h6">Devine le champion</Typography>
                {won && <Alert severity="success">Bravo ! Réponse : {answer.name}</Alert>}
                {lost && <Alert severity="error">Perdu… La réponse était {answer.name}</Alert>}
                <Stack spacing={1}>
                    {guesses.map((g, i) => (
                        <ClueRow key={i} name={g.raw} clues={g.clues} />
                    ))}
                </Stack>
                {(won || lost) && <Box><Button onClick={reset} variant="outlined">Rejouer</Button></Box>}
            </Stack>
        </Paper>
    );
}
