export class User {
    id: string;
    avatar: string;
    username: string;
    email: string;
    firstname: string;
    lastname: string;
    role: string;
    temporary: boolean;
    wins: number;
    losses: number;
    xp: number;
    level: number;
    jwtToken?: string;
}