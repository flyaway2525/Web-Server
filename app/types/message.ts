type Message = {
    id: number;
    channel_id: number;
    user_id: number;
    content: string;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date | null;
};