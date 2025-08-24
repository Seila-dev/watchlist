export interface User {
    id: string | number;
    email: string;
    username: string;
    name: string;
    content?: string[];
    emailVerify: boolean; 
}