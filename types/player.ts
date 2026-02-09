export interface Player {
    id: number;
    name: string;
    position: string;
    number: number;
    overall: number;
    shooting: number;
    passing: number;
    dribbling: number;
    defending: number;
    physical: number;
    pace: number;
    season?: string;
    seasonType?: "general" | "worldBest";
    image?: string;
}
