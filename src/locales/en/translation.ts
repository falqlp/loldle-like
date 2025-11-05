const en = {
  title: 'Guess the champion',
  mode_training: 'Training',
  mode_daily: 'Daily',

  daily_label: 'Daily (UTC) — {{date}}',
  daily_done_today: ' • already completed today',

  status_in_progress: 'Game in progress',
  status_answer: 'Answer: {{name}} in {{tries}} {{triesLabel}}',
  status_avg: ' • Average ({{mode}}): {{avg}} {{triesLabel}} (over {{wins}} {{winsLabel}})',

  share_need_try: 'Make at least one guess to share',
  share_copy_daily: 'Copy the Daily result',
  copy_result: 'Copy result',
  clipboard_error: 'Unable to copy to clipboard',

  reset_daily_done: 'Daily already completed (UTC) — reset disabled',
  reset_daily_hint: "Reset guesses, today's answer stays the same",
  reset_training_hint: 'New game with a new random answer',
  play_again: 'Play again',

  input_placeholder: 'Type a champion',
  alert_unknown: 'Unknown champion',
  alert_duplicate: 'Champion already guessed',

  year_more_recent: 'The correct year is more recent',
  year_older: 'The correct year is earlier',

  // Table columns
  col_name: 'Name',
  col_gender: 'Gender',
  col_roles: 'Roles',
  col_species: 'Species',
  col_resource: 'Resource',
  col_range: 'Range',
  col_regions: 'Regions',
  col_year: 'Year',

  // Nouns for pluralization
  try_one: 'try',
  try_other: 'tries',
  win_one: 'win',
  win_other: 'wins',
  attempt_one: 'attempt',
  attempt_other: 'attempts',

  // Share header
  share_header:
    'I found the champion #LoLdleLike in Daily mode in {{attempts}} {{attemptsLabel}} ⚔️',

  //Game mode
  daily: 'Daily',
  training: 'Training',
} as const;

export default en;
