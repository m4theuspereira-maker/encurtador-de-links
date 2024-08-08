export class InternalServerErrorExpection implements Error {
    name: string;
    message: string;

    constructor(error: any) {
        this.name = error.name;
        this.message = error.message || INTERNAL_SERVER_ERROR_MESSAGE;
    }
}
export const INTERNAL_SERVER_ERROR_MESSAGE = 'Internal Server Error, see the logs to get more informations';
