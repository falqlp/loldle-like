import {
  Box,
  Paper,
  Stack,
  Typography,
  Button,
  ToggleButtonGroup,
  ToggleButton,
  Tooltip,
} from '@mui/material';
import { useGameStore } from '../store/useGameStore';
import GuessTable from './GuessTable';

function getUTCDateString(d = new Date()): string {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export default function GameBoard() {
  const { guesses, answer, reset, average, stats, mode, setMode, dailyCompletedDateUTC } =
    useGameStore();
  const last = guesses[guesses.length - 1];
  const won = last?.clues?.some(c => c.field === 'name' && c.status === 'correct');

  const victoriesCount = stats[mode].length;
  const avgForMode = average[mode];
  const todayUTC = getUTCDateString();
  const dailyDoneToday = mode === 'daily' && dailyCompletedDateUTC === todayUTC;

  return (
    <Paper sx={{ p: 2 }}>
      <Stack spacing={2}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h6">Devine le champion</Typography>
          <ToggleButtonGroup
            size="small"
            color="primary"
            value={mode}
            exclusive
            onChange={(_, v) => v && setMode(v)}
          >
            <ToggleButton value="training">Training</ToggleButton>
            <ToggleButton value="daily">Daily</ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {mode === 'daily' && (
          <Typography variant="body2" color="text.secondary">
            Daily (UTC) — {todayUTC}
            {dailyDoneToday ? " • déjà complété aujourd'hui" : ''}
          </Typography>
        )}

        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          sx={{ bgcolor: 'action.hover', borderRadius: 1, px: 2, py: 1 }}
        >
          <Typography variant="body2" color="text.secondary">
            {won ? (
              <>
                Réponse : {answer.name} en {guesses.length} essais
              </>
            ) : (
              <>Partie en cours</>
            )}
            {` • Moyenne (${mode}): ${avgForMode.toFixed(2)} essais (sur ${victoriesCount} victoire${victoriesCount > 1 ? 's' : ''})`}
          </Typography>
          {mode === 'daily' && (
            <Tooltip
              title={
                guesses.length === 0
                  ? 'Fais au moins un essai pour pouvoir partager'
                  : 'Copier le résultat du Daily'
              }
            >
              <span>
                <Button
                  size="small"
                  onClick={async () => {
                    try {
                      const text = useGameStore.getState().buildDailyShareText();
                      await navigator.clipboard.writeText(text);
                    } catch (e) {
                      alert('Impossible de copier dans le presse-papiers' + e);
                    }
                  }}
                  disabled={guesses.length === 0}
                >
                  Copier le résultat
                </Button>
              </span>
            </Tooltip>
          )}
        </Box>
        <GuessTable guesses={guesses} />
        <Box>
          <Tooltip
            title={
              mode === 'daily'
                ? dailyDoneToday
                  ? 'Daily déjà complété (UTC) — réinitialisation désactivée'
                  : 'Réinitialise les essais, la réponse du jour reste la même'
                : 'Nouvelle partie avec une nouvelle réponse aléatoire'
            }
          >
            <span>
              <Button
                onClick={reset}
                variant="outlined"
                disabled={mode === 'daily' && dailyDoneToday}
              >
                Rejouer
              </Button>
            </span>
          </Tooltip>
        </Box>
      </Stack>
    </Paper>
  );
}
