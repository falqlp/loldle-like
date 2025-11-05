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
import { useTranslation } from 'react-i18next';

function getUTCDateString(d = new Date()): string {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export default function GameBoard() {
  const { t } = useTranslation();
  const { guesses, answer, reset, average, stats, mode, setMode, dailyCompletedDateUTC } =
    useGameStore();
  const last = guesses[guesses.length - 1];
  const won = last?.clues?.some(c => c.field === 'name' && c.status === 'correct');

  const victoriesCount = stats[mode].length;
  const avgForMode = average[mode];
  const todayUTC = getUTCDateString();
  const dailyDoneToday = mode === 'daily' && dailyCompletedDateUTC === todayUTC;

  const triesLabel = t(guesses.length === 1 ? 'try_one' : 'try_other');
  const avgTryLabel = t(avgForMode > 1 ? 'try_other' : 'try_one');
  const winsLabel = t(victoriesCount === 1 ? 'win_one' : 'win_other');

  return (
    <Paper sx={{ p: 2 }}>
      <Stack spacing={2}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h6">{t('title')}</Typography>
          <ToggleButtonGroup
            size="small"
            color="primary"
            value={mode}
            exclusive
            onChange={(_, v) => v && setMode(v)}
          >
            <ToggleButton value="training">{t('mode_training')}</ToggleButton>
            <ToggleButton value="daily">{t('mode_daily')}</ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {mode === 'daily' && (
          <Typography variant="body2" color="text.secondary">
            {t('daily_label', { date: todayUTC })}
            {dailyDoneToday ? t('daily_done_today') : ''}
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
              <>{t('status_answer', { name: answer.name, tries: guesses.length, triesLabel })}</>
            ) : (
              <>{t('status_in_progress')}</>
            )}
            {t('status_avg', {
              mode: mode === 'daily' ? t('mode_daily') : t('mode_training'),
              avg: avgForMode.toFixed(2),
              triesLabel: avgTryLabel,
              wins: victoriesCount,
              winsLabel,
            })}
          </Typography>
          {mode === 'daily' && (
            <Tooltip title={guesses.length === 0 ? t('share_need_try') : t('share_copy_daily')}>
              <span>
                <Button
                  size="small"
                  onClick={async () => {
                    try {
                      const text = useGameStore.getState().buildDailyShareText();
                      await navigator.clipboard.writeText(text);
                    } catch (e) {
                      alert(t('clipboard_error') + String(e));
                    }
                  }}
                  disabled={guesses.length === 0}
                >
                  {t('copy_result')}
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
                  ? t('reset_daily_done')
                  : t('reset_daily_hint')
                : t('reset_training_hint')
            }
          >
            <span>
              <Button
                onClick={reset}
                variant="outlined"
                disabled={mode === 'daily' && dailyDoneToday}
              >
                {t('play_again')}
              </Button>
            </span>
          </Tooltip>
        </Box>
      </Stack>
    </Paper>
  );
}
