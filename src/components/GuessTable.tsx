import { Box, Tooltip } from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import type { Champion } from '../data/champions';
import { useTranslation } from 'react-i18next';

// Keep a local Clue type aligned with the store's shape
export type Clue = {
  field: keyof Champion;
  value: string | number;
  status: 'correct' | 'close' | 'wrong';
  direction?: 'older' | 'newer' | null;
};
export type Guess = { raw: string; clues: Clue[] };

const champUrlName: Record<string, string> = {
  "Kai'Sa": 'Kaisa',
  "Bel'Veth": 'Belveth',
  "Cho'Gath": 'Chogath',
  "Kha'Zix": 'Khazix',
  "Vel'Koz": 'Velkoz',
  LeBlanc: 'Leblanc',
  'Nunu & Willump': 'Nunu',
};
function findClue(clues: Clue[], field: keyof Champion) {
  return clues.find(c => c.field === field);
}

function multilineLabel(value: string) {
  const parts = value.split(/\s*,\s*/).filter(Boolean);
  if (parts.length <= 1) return value;
  return (
    <Box component="span">
      {parts.map((p, i) => (
        <Box key={i} component="span" sx={{ display: 'block' }}>
          {p}
        </Box>
      ))}
    </Box>
  );
}

function getImgUrl(champName: string) {
  console.log(champName);
  const name = champUrlName[champName] || champName;
  return `https://ddragon.leagueoflegends.com/cdn/15.21.1/img/champion/${name.replace('. ', '').replace("'", '').replace(' ', '')}.png`;
}

export default function GuessTable({ guesses }: { guesses: Guess[] }) {
  const { t } = useTranslation();
  const columns: { key: keyof Champion | 'nameChip'; label: string }[] = [
    { key: 'nameChip', label: t('col_name') },
    { key: 'gender', label: t('col_gender') },
    { key: 'roles', label: t('col_roles') },
    { key: 'species', label: t('col_species') },
    { key: 'resource', label: t('col_resource') },
    { key: 'rangeType', label: t('col_range') },
    { key: 'regions', label: t('col_regions') },
    { key: 'releaseYear', label: t('col_year') },
  ];

  const colCount = columns.length;

  function statusColors(status: Clue['status']) {
    // Map to semantic colors; adjust if needed
    return status === 'correct'
      ? { bg: 'success.main', fg: 'success.contrastText' }
      : status === 'close'
        ? { bg: 'warning.main', fg: 'warning.contrastText' }
        : { bg: 'error.main', fg: 'error.contrastText' };
  }

  const headerSx = {
    fontWeight: 700,
    fontSize: { xs: 12, sm: 14 },
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center' as const,
    border: '1px solid',
    borderColor: 'divider',
    bgcolor: 'background.paper',
    color: 'text.primary',
  };

  const cellBaseSx = {
    position: 'relative' as const,
    width: '100%',
    aspectRatio: '1 / 1', // square
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center' as const,
    p: 0.5,
    border: '1px solid',
    borderColor: 'divider',
    overflow: 'hidden',
  };

  function Cell({ children, status }: { children: React.ReactNode; status: Clue['status'] }) {
    const { bg, fg } = statusColors(status);
    return <Box sx={{ ...cellBaseSx, bgcolor: bg, color: fg }}>{children}</Box>;
  }

  function NameCell({ label, status }: { label: string; status: Clue['status'] }) {
    const { bg, fg } = statusColors(status);
    return (
      <Box sx={{ ...cellBaseSx, p: 0 }}>
        <img
          src={getImgUrl(label)}
          alt={label}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
        <Box
          sx={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: bg,
            color: fg,
            fontWeight: 700,
            fontSize: { xs: 12, sm: 14 },
            px: 0.5,
            py: 0.25,
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            overflow: 'hidden',
          }}
          title={label}
        >
          {label}
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', overflowX: 'auto' }}>
      {/* Grid wrapper: 8 equal columns; cells are square via aspect-ratio */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: `repeat(${colCount}, 1fr)`,
          gap: 0,
          minWidth: 360,
        }}
      >
        {/* Header row */}
        {columns.map(col => (
          <Box key={String(col.key)} sx={{ ...headerSx, aspectRatio: '1 / 1' }}>
            {col.label}
          </Box>
        ))}

        {/* Data rows */}
        {guesses.map((g, idx) => {
          const nameStatus = findClue(g.clues, 'name')?.status ?? 'wrong';
          const yearClue = findClue(g.clues, 'releaseYear');

          const gender = findClue(g.clues, 'gender');
          const roles = findClue(g.clues, 'roles');
          const species = findClue(g.clues, 'species');
          const resource = findClue(g.clues, 'resource');
          const rangeType = findClue(g.clues, 'rangeType');
          const regions = findClue(g.clues, 'regions');

          return (
            <Box key={`row-${idx}`} sx={{ display: 'contents' }}>
              <NameCell label={g.raw} status={nameStatus} />

              {gender ? (
                <Cell status={gender.status}>{String(gender.value)}</Cell>
              ) : (
                <Box sx={cellBaseSx} />
              )}

              {roles ? (
                <Cell status={roles.status}>{multilineLabel(String(roles.value))}</Cell>
              ) : (
                <Box sx={cellBaseSx} />
              )}

              {species ? (
                <Cell status={species.status}>
                  {multilineLabel(
                    String(species.value)
                      .split(/\s*,\s*/)
                      .filter(Boolean)
                      .map(s => t('species.' + s))
                      .join(', '),
                  )}
                </Cell>
              ) : (
                <Box sx={cellBaseSx} />
              )}

              {resource ? (
                <Cell status={resource.status}>{t('resources.' + String(resource.value))}</Cell>
              ) : (
                <Box sx={cellBaseSx} />
              )}

              {rangeType ? (
                <Cell status={rangeType.status}>{String(rangeType.value)}</Cell>
              ) : (
                <Box sx={cellBaseSx} />
              )}

              {regions ? (
                <Cell status={regions.status}>{multilineLabel(String(regions.value))}</Cell>
              ) : (
                <Box sx={cellBaseSx} />
              )}

              {/* Release year with optional arrow + tooltip */}
              {yearClue ? (
                (() => {
                  const isExact = yearClue.status === 'correct';
                  const showArrow = !isExact && yearClue.direction;
                  const icon = showArrow ? (
                    yearClue.direction === 'newer' ? (
                      <ArrowUpwardIcon />
                    ) : (
                      <ArrowDownwardIcon />
                    )
                  ) : null;
                  const content = (
                    <Cell status={yearClue.status}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        {icon}
                        <span>{String(yearClue.value)}</span>
                      </Box>
                    </Cell>
                  );
                  const tooltip = showArrow
                    ? yearClue.direction === 'newer'
                      ? t('year_more_recent')
                      : t('year_older')
                    : undefined;
                  return tooltip ? (
                    <Tooltip title={tooltip}>{content}</Tooltip>
                  ) : (
                    <Box>{content}</Box>
                  );
                })()
              ) : (
                <Box sx={cellBaseSx} />
              )}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
