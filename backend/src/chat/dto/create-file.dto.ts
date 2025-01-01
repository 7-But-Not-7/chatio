import { FileType } from "src/common/enums/db.enum";


export class CreateFileDto {
    name: string;
    url: string;
    type: FileType;
    size: number;
    messageId: string;
}