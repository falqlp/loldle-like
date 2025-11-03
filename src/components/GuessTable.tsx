import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Tooltip,
} from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import type { Champion } from '../data/champions';

// Keep a local Clue type aligned with the store's shape
export type Clue = {
  field: keyof Champion;
  value: string | number;
  status: 'correct' | 'close' | 'wrong';
  direction?: 'older' | 'newer' | null;
};
export type Guess = { raw: string; clues: Clue[] };

const columns: { key: keyof Champion | 'nameChip'; label: string }[] = [
  { key: 'nameChip', label: 'Nom' },
  { key: 'gender', label: 'Genre' },
  { key: 'roles', label: 'Rôles' },
  { key: 'species', label: 'Espèces' },
  { key: 'resource', label: 'Ressource' },
  { key: 'rangeType', label: 'Portée' },
  { key: 'regions', label: 'Régions' },
  { key: 'releaseYear', label: 'Année' },
];

const champUrlName: Record<string, string> = {
  "Kai'Sa": 'Kaisa',
  "Bel'Veth": 'Belveth',
  "Cho'Gath": 'Chogath',
  "Kha'Zix": 'Khazix',
  "Vel'Koz": 'Velkoz',
  LeBlanc: 'Leblanc',
  'Nunu & Willump': 'Nunu',
};

function colorFromStatus(s: Clue['status']) {
  return s === 'correct' ? 'success' : s === 'close' ? 'warning' : 'error';
}

function findClue(clues: Clue[], field: keyof Champion) {
  return clues.find(c => c.field === field);
}

// Common style to make chips taller and allow multiline labels
const chipSx = {
  fontWeight: 600,
  height: 'auto',
  width: '100%',
  minHeight: 50,
  alignItems: 'center',

  py: 0.5,
  '& .MuiChip-label': {
    whiteSpace: 'normal',
    display: 'block',
    lineHeight: 1.2,
    py: 0.25,
  },
} as const;

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
  return (
    <Box sx={{ width: '100%', overflowX: 'auto' }}>
      <TableContainer>
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              {columns.map(col => (
                <TableCell key={String(col.key)} sx={{ fontWeight: 700 }}>
                  {col.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {guesses.map((g, idx) => {
              const nameStatus = findClue(g.clues, 'name')?.status ?? 'wrong';
              const yearClue = findClue(g.clues, 'releaseYear');
              return (
                <TableRow key={idx} hover>
                  {/* Name chip over image */}
                  <TableCell sx={{ verticalAlign: 'center', padding: 0 }}>
                    <Box sx={{ position: 'relative', width: 100, height: 100 }}>
                      <img
                        src={getImgUrl(g.raw)}
                        alt={g.raw}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          display: 'block',
                        }}
                      />
                      <Chip
                        label={g.raw}
                        color={colorFromStatus(nameStatus)}
                        variant="filled"
                        sx={{
                          position: 'absolute',
                          zIndex: 1,
                          bottom: 4,
                          left: '50%',
                          transform: 'translateX(-50%)',
                          width: 'calc(100% - 8px)',
                          maxWidth: 'calc(100% - 8px)',
                          height: 'auto',
                          minHeight: 'unset',
                          fontWeight: 600,
                          px: 1,
                          '& .MuiChip-label': {
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            lineHeight: 1.2,
                          },
                        }}
                      />
                    </Box>
                  </TableCell>

                  {/* Gender */}
                  <TableCell sx={{ verticalAlign: 'center' }}>
                    {(() => {
                      const c = findClue(g.clues, 'gender');
                      return c ? (
                        <Chip
                          label={String(c.value)}
                          color={colorFromStatus(c.status)}
                          variant="filled"
                          sx={chipSx}
                        />
                      ) : null;
                    })()}
                  </TableCell>

                  {/* Roles */}
                  <TableCell sx={{ verticalAlign: 'center' }}>
                    {(() => {
                      const c = findClue(g.clues, 'roles');
                      return c ? (
                        <Chip
                          label={multilineLabel(String(c.value))}
                          color={colorFromStatus(c.status)}
                          variant="filled"
                          sx={chipSx}
                        />
                      ) : null;
                    })()}
                  </TableCell>

                  {/* Species */}
                  <TableCell sx={{ verticalAlign: 'center' }}>
                    {(() => {
                      const c = findClue(g.clues, 'species');
                      return c ? (
                        <Chip
                          label={multilineLabel(String(c.value))}
                          color={colorFromStatus(c.status)}
                          variant="filled"
                          sx={chipSx}
                        />
                      ) : null;
                    })()}
                  </TableCell>

                  {/* Resource */}
                  <TableCell sx={{ verticalAlign: 'center' }}>
                    {(() => {
                      const c = findClue(g.clues, 'resource');
                      return c ? (
                        <Chip
                          label={String(c.value)}
                          color={colorFromStatus(c.status)}
                          variant="filled"
                          sx={chipSx}
                        />
                      ) : null;
                    })()}
                  </TableCell>

                  {/* RangeType */}
                  <TableCell sx={{ verticalAlign: 'center' }}>
                    {(() => {
                      const c = findClue(g.clues, 'rangeType');
                      return c ? (
                        <Chip
                          label={String(c.value)}
                          color={colorFromStatus(c.status)}
                          variant="filled"
                          sx={chipSx}
                        />
                      ) : null;
                    })()}
                  </TableCell>

                  {/* Regions */}
                  <TableCell sx={{ verticalAlign: 'center' }}>
                    {(() => {
                      const c = findClue(g.clues, 'regions');
                      return c ? (
                        <Chip
                          label={multilineLabel(String(c.value))}
                          color={colorFromStatus(c.status)}
                          variant="filled"
                          sx={chipSx}
                        />
                      ) : null;
                    })()}
                  </TableCell>

                  {/* Release Year with arrow/tooltip when needed */}
                  <TableCell sx={{ verticalAlign: 'center' }}>
                    {yearClue
                      ? (() => {
                          const isExact = yearClue.status === 'correct';
                          const showArrow = !isExact && yearClue.direction;
                          const icon = showArrow ? (
                            yearClue.direction === 'newer' ? (
                              <ArrowUpwardIcon />
                            ) : (
                              <ArrowDownwardIcon />
                            )
                          ) : undefined;
                          const chip = (
                            <Chip
                              label={String(yearClue.value)}
                              color={colorFromStatus(yearClue.status)}
                              variant="filled"
                              icon={icon}
                              sx={chipSx}
                            />
                          );
                          const tooltip = showArrow
                            ? yearClue.direction === 'newer'
                              ? 'La bonne année est plus récente'
                              : 'La bonne année est plus ancienne'
                            : undefined;
                          return tooltip ? <Tooltip title={tooltip}>{chip}</Tooltip> : chip;
                        })()
                      : null}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
