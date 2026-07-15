export interface Musician {
    id: string;
    userId: string;
    stageName: string | null;
    bio: string | null;
    baseCity: string;
    baseCountry: string;
    hasPassport: boolean;
    websiteUrl: string | null;
    videoReelUrl: string | null;
    hourlyRateUsd: number | null;
    isAvailable: boolean;
    createdAt: Date;
}