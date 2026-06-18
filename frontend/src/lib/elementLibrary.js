// Zentrale Definition aller platzierbaren Objekttypen.
// Jede Karte hier entspricht einem Eintrag im Auswahl-Popup (siehe ElementPicker.jsx).
// Bewusst als reine Daten gehalten, damit das Popup generisch bleibt und
// neue Posen/Equipment einfach ergänzt werden können, ohne UI-Code anzufassen.

export const PLAYER_GROUPS = [
  {
    group: 'Spieler',
    team: 'a',
    items: [
      { id: 'spieler_laufen',  label: 'Laufen',   pose: 'laufen',   iconPath: '/assets/players/spieler_laufen_a.svg' },
      { id: 'spieler_passen',  label: 'Passen',   pose: 'passen',   iconPath: '/assets/players/spieler_passen_a.svg' },
      { id: 'spieler_stehen',  label: 'Stehen',   pose: 'stehen',   iconPath: '/assets/players/spieler_stehen_a.svg' },
      { id: 'spieler_springen',label: 'Springen', pose: 'springen', iconPath: '/assets/players/spieler_springen_a.svg' },
      { id: 'spieler_torhueter', label: 'Torhüter', pose: 'stehen', role: 'torhueter', iconPath: '/assets/players/torhueter_stehen_a.svg' },
    ],
  },
  {
    group: 'Gegner',
    team: 'b',
    items: [
      { id: 'gegner_laufen',  label: 'Laufen',   pose: 'laufen',   iconPath: '/assets/players/spieler_laufen_b.svg' },
      { id: 'gegner_passen',  label: 'Passen',   pose: 'passen',   iconPath: '/assets/players/spieler_passen_b.svg' },
      { id: 'gegner_stehen',  label: 'Stehen',   pose: 'stehen',   iconPath: '/assets/players/spieler_stehen_b.svg' },
      { id: 'gegner_springen',label: 'Springen', pose: 'springen', iconPath: '/assets/players/spieler_springen_b.svg' },
      { id: 'gegner_torhueter', label: 'Torhüter', pose: 'stehen', role: 'torhueter', iconPath: '/assets/players/torhueter_stehen_b.svg' },
    ],
  },
  {
    group: 'Trainer',
    team: 'neutral',
    items: [
      { id: 'trainer_stehen', label: 'Trainer', pose: 'stehen', role: 'trainer', iconPath: '/assets/players/trainer_stehen.svg' },
    ],
  },
];

export const EQUIPMENT_GROUPS = [
  {
    group: 'Tore',
    items: [
      { id: 'tor',      label: 'Tor',      iconPath: '/assets/equipment/tor.svg' },
      { id: 'minitor',  label: 'Minitor',  iconPath: '/assets/equipment/minitor.svg' },
      { id: 'hallentor',label: 'Hallentor',iconPath: '/assets/equipment/hallentor.svg' },
    ],
  },
  {
    group: 'Markierungen',
    items: [
      { id: 'huetchen', label: 'Hütchen', iconPath: '/assets/equipment/huetchen.svg' },
      { id: 'pylon',    label: 'Pylon',   iconPath: '/assets/equipment/pylon.svg' },
      { id: 'fahne',    label: 'Fahne',   iconPath: '/assets/equipment/fahne.svg' },
      { id: 'leiter',   label: 'Leiter',  iconPath: '/assets/equipment/leiter.svg' },
      { id: 'stange',   label: 'Stange',  iconPath: '/assets/equipment/stange.svg' },
      { id: 'ring',     label: 'Ring',    iconPath: '/assets/equipment/ring.svg' },
    ],
  },
  {
    group: 'Ball',
    items: [
      { id: 'ball', label: 'Ball', iconPath: '/assets/equipment/ball.svg' },
    ],
  },
];

export const FIELD_TEMPLATES = [
  { id: 'vollfeld_hoch',  label: 'Vollfeld – Hochformat', width: 680, height: 1050 },
  { id: 'vollfeld_quer',  label: 'Vollfeld – Querformat', width: 1050, height: 680 },
  { id: 'halbfeld_oben',  label: 'Halbfeld – Oben',       width: 680, height: 525 },
  { id: 'halbfeld_unten', label: 'Halbfeld – Unten',      width: 680, height: 525 },
  { id: 'strafraum',      label: 'Strafraum',             width: 440, height: 400 },
];

// Werkzeuge für die linke Toolbar.
export const TOOLS = [
  { id: 'select',         label: 'Auswählen',      kind: 'direct' },
  { id: 'arrow_straight', label: 'Pfeil (gerade)', kind: 'direct' },
  { id: 'arrow_curved',   label: 'Pfeil (gebogen)',kind: 'direct' },
  { id: 'text',           label: 'Text',           kind: 'direct' },
  { id: 'rect',           label: 'Rechteck',       kind: 'direct' },
  { id: 'ellipse',        label: 'Ellipse',        kind: 'direct' },
  { id: 'player',         label: 'Spieler',        kind: 'picker', groupSet: 'players' },
  { id: 'equipment',      label: 'Material',       kind: 'picker', groupSet: 'equipment' },
];
