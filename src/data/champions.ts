export type Gender = 'Male' | 'Female' | 'Other';

export type Role = 'Top' | 'Jungle' | 'Mid' | 'Bot' | 'Support';

export type Resource =
    | 'Mana'
    | 'Energy'
    | 'Fury'
    | 'Rage'
    | 'Heat'
    | 'Grit'
    | 'Shield'
    | 'Manaless'
    | 'Ferocity'
    | 'Flow'
    | 'Health'
    | 'Courage'
    | 'Other';

export type RangeType = 'Melee' | 'Ranged' | 'Melee Ranged';

export type Region =
    | 'Demacia'
    | 'Noxus'
    | 'Ionia'
    | 'Piltover'
    | 'Zaun'
    | 'Targon'
    | 'Shurima'
    | 'Freljord'
    | 'Bilgewater'
    | 'Shadow Isles'
    | 'Ixtal'
    | 'Bandle City'
    | 'The Void'
    | 'Camavor'
    | 'Runeterra';

export type Species =
    | 'Human'
    | 'Vastaya'
    | 'Yordle'
    | 'Celestial'
    | 'Dragon'
    | 'Spirit'
    | 'Undead'
    | 'Golem'
    | 'Brackern'
    | 'Minotaur'
    | 'Troll'
    | 'Ascended'
    | 'Darkin'
    | 'Voidborn'
    | 'Watcher'
    | 'God'
    | 'Demon'
    | 'Yeti'
    | 'Iceborn'
    | 'Magicborn'
    | 'Other';

export type Champion = {
    name: string;
    gender: Gender;
    roles: Role[];
    species: Species[];
    resource: Resource;
    rangeType: RangeType;
    regions: Region[];
    releaseYear: number;
};
