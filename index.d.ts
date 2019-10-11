declare module 'lovoojs' {

    export class LovooClient {
        getHeaders(): any;
        getSelf(): Promise<User>;
        getPictures(userId: string): Promise<any>;
        getDetails(userId: string): Promise<any>;
        sendMessage(userId: string, message: string): Promise<any>;
        getAllConversations(): Promise<Conversation[]>;
        getConversation(conversationId: string): Promise<Message[]>
        getSelfInformations(): Promise<User>;
        login(email: string, password: string): Promise<User>;
    }

    export interface User {
        id?: string;
        name?: string;
        freetext?: string;
        country?: string;
        city?: string;
        age?: number;
        gender?: number;
        email?: string;
        credits?: string;
        birthday?: string;
        genderLooking?: number;
    }

    export interface Conversation {
        id: string;
        countNewMessages: number;
        user: string;
        userId: string;
    }

    export interface MessageSender {
        id?: string;
        name?: string;
    }

    export interface Message {
        date: Date;
        message: string;
        sender: MessageSender;
    }

}