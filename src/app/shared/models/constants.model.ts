enum STATUS {
    Success = 1,
    Error = -1,
    Warning = -2,
    Forbidden = -3,
    Unauthorized = -4,
    UnprocessableModel = -5,
}

enum STATUS_MESSAGES {
    Success = 'La operación se ejecutó correctamente',
    Error = 'Ocurrió un error',
    Warning = '',
    Forbidden = 'Forbidden',
    Unauthorized = 'Unauthorized',
    UnprocessableModel = 'Unprocessable',
}

export class Constants {
    static API_NAME = 'api';
    static API_NAME_LOCALHOST = 'localhost';
    static APP_NAME = 'Web-Conexa';
    static STATUS = STATUS;
    static STATUS_MESSAGES = STATUS_MESSAGES;
}