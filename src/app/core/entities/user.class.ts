export class User {
    id: number;
    email: string;

    constructor() {
    }

    getId(): number {
        return this.id;
    }

    setId(id: number) {
        this.id = id;
        return this;
    }

    getEmail(): string {
        return this.email;
    }

    setEmail(email: string) {
        this.email = email;
        return this;
    }
}
