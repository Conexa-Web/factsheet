import { Constants } from './constants.model';

export class ResponseMessage<T> {
    status: number;
    message: string;
    data: T;
    validate?: any;
    length?: number;
    name?: string;

    constructor(status?: number, message?: string, data?: T, validate?: any, length?: number, name?: string) {
        this.status = status || Constants.STATUS.Success;
        this.message = message || Constants.STATUS_MESSAGES.Success;
        this.data = data || null;
        this.validate = validate || null;
        this.length = length || 0;
        this.name = name || null;
    }

    static create(status: number, message: string): ResponseMessage<string> {
        let response = new ResponseMessage<string>();
        response.status = status;
        response.message = message;
        response.data = null;
        return response;
    }
}