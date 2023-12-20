import { customLog } from "../customLog";

export enum roles {
    SYSTEM = "system",
    USER = "user",
    ASSISTANT = "assistant",
}

export class Message {
    private role: roles;
    private content: string;
    constructor(role: roles, content: string) {
        this.role = role;
        this.content = content;
    }

    get_role() {return this.role;}
    set_role(value: roles) {
        if (!Object.values(roles).includes(value)) {
            customLog(`role must be one of ${Object.values(roles)}`, "ERROR");
        } else {
            this.role = value;
        }
    }
    get_content() {return this.content;}
    set_content(value: string) {this.content = value;}
    toJSON() {
        return {
            role: this.role,
            content: this.content
        };
    }
}

export class Messages {
    private messages: Message[] = [];
    constructor(messages: { role: string, content: string }[] | undefined) {
        if(!messages) {
            this.messages = [];
        }else{
            this.messages = messages.map(item => new Message(item.role as roles, item.content));
        }
    }
    get_messages() {return this.messages;}
    set_messages(value: Message[]) {
        this.messages = value;
    }
    add_message(role: string, content: string) {
        this.messages.push(new Message(role as roles,content));
    }
    get_length() {return this.messages.length;}
    toJSON() {
        return this.messages.map((message) => message.toJSON());
    }
}
