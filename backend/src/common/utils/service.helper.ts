import { HttpException, InternalServerErrorException } from "@nestjs/common";

export class ServiceHelper{
    static handleServiceError(error: Error, fallback: string){
        if (error instanceof HttpException) {
            throw error;
        }
        throw new InternalServerErrorException(fallback);
    }
}