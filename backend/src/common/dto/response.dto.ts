export class ResponseDto {
    status: string;
    message: string;
    data?: {[key: string]: any};
    constructor(message: string, data?: {[key: string]: any}) {
        this.status = "SUCCESS";
        this.message = message;
        this.data = data;
    }
}