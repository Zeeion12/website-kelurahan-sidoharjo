export const PADUKUHAN_SIDOHARJO = [
    "Prigi",
    "Bintaos",
    "Klepu",
    "Jati",
    "Bengle I",
    "Bengle II",
    "Puleireng",
    "Pule Ngelo",
    "Pule Gundes I",
    "Pule Gundes II",
    "Pule Kulon",
] as const;

export type Padukuhan = (typeof PADUKUHAN_SIDOHARJO)[number];
