const fr = {
  title: 'Devine le champion',
  mode_training: 'Quotidien',
  mode_daily: 'Entraînement',

  daily_label: 'Daily (UTC) — {{date}}',
  daily_done_today: " • déjà complété aujourd'hui",

  status_in_progress: 'Partie en cours',
  status_answer: 'Réponse : {{name}} en {{tries}} {{triesLabel}}',
  status_avg: ' • Moyenne ({{mode}}): {{avg}} {{triesLabel}} (sur {{wins}} {{winsLabel}})',

  share_need_try: 'Fais au moins un essai pour pouvoir partager',
  share_copy_daily: 'Copier le résultat du Daily',
  copy_result: 'Copier le résultat',
  clipboard_error: 'Impossible de copier dans le presse-papiers',

  reset_daily_done: 'Daily déjà complété (UTC) — réinitialisation désactivée',
  reset_daily_hint: 'Réinitialise les essais, la réponse du jour reste la même',
  reset_training_hint: 'Nouvelle partie avec une nouvelle réponse aléatoire',
  play_again: 'Rejouer',

  input_placeholder: 'Entre un champion',
  alert_unknown: 'Champion inconnu',
  alert_duplicate: 'Champion déjà proposé',

  year_more_recent: 'La bonne année est plus récente',
  year_older: 'La bonne année est plus ancienne',

  // Table columns
  col_name: 'Nom',
  col_gender: 'Genre',
  col_roles: 'Rôles',
  col_species: 'Espèces',
  col_resource: 'Ressource',
  col_range: 'Portée',
  col_regions: 'Régions',
  col_year: 'Année',

  // Nouns for pluralization
  try_one: 'essai',
  try_other: 'essais',
  win_one: 'victoire',
  win_other: 'victoires',
  attempt_one: 'coup',
  attempt_other: 'coups',

  // Share header
  share_header:
    "J'ai trouvé le champion #LoLdleLike en mode Daily en {{attempts}} {{attemptsLabel}} ⚔️",
} as const;

export default fr;
