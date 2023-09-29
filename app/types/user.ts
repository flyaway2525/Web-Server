type User = {
    id: number;
    username: string;
    email: string | null;
    password: string;
    profile: string | null;
    details: string | null;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date | null;
};