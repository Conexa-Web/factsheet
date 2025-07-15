export class LocalStorageHelper {

    private static PREFIX = 'S1T3L_1616703361992_';
    private static KEY_COGNITO = 'C0GN1T0';

    static set(key: string, value: string): void {
        localStorage.setItem(`${this.PREFIX}${key}`, value);
    }

    static get(key: string): string {
        return localStorage.getItem(`${this.PREFIX}${key}`);
    }

    static setUserId(userId: string): void {
        this.set(`${this.KEY_COGNITO}`, userId);
    }

    static getUserId(): string {
        return this.get(`${this.KEY_COGNITO}`);
    }

    static remove(key: string): void {
        return localStorage.removeItem(`${this.PREFIX}${key}`);
    }
}