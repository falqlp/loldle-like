import { Alert, Box, Paper, Stack, Typography, Button } from '@mui/material';
import { useGameStore } from '../store/useGameStore';
import GuessTable from './GuessTable';

export default function GameBoard() {
  const { guesses, answer, reset, average, stats } = useGameStore();
  const last = guesses[guesses.length - 1];
  const won = last?.clues?.some(c => c.field === 'name' && c.status === 'correct');
  const attemptsThisGame = won ? guesses.length : null;

  return (
    <Paper sx={{ p: 2 }}>
      <Stack spacing={2}>
        <Typography variant="h6">Devine le champion</Typography>
        {won && (
          <Alert severity="success">
            Bravo ! Réponse : {answer.name}
            {attemptsThisGame != null && ` en ${attemptsThisGame} essais`}
            {` • Moyenne: ${average.toFixed(2)} essais (sur ${stats.length} victoire${stats.length > 1 ? 's' : ''})`}
          </Alert>
        )}
        {!won && (
          <Typography variant="body2" color="text.secondary">
            Moyenne actuelle: {average.toFixed(2)} essais (sur {stats.length} victoire{stats.length > 1 ? 's' : ''})
          </Typography>
        )}
        <GuessTable guesses={guesses} />
        <Box>
          <Button onClick={reset} variant="outlined">
            Rejouer
          </Button>
        </Box>
      </Stack>
    </Paper>
  );
}
