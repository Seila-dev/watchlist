export interface User {
    id: string | number;
    email: string;
    username: string;
    lastname?: string;
    content?: string[]; 
}