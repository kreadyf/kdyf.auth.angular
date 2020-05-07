export interface User {
    username: string;
    tenant: string;
    displayName: string;
    roles: string[];
}


export interface AuthenticateByLogin {
    username: string;
    password: string;
    tenant: string;
}

export interface AuthenticateBySamlToken {
    samlToken: string;
}

export interface AuthenticateByRefreshToken {
    refreshToken: string;
}

export interface AuthenticateResponse {
    authToken: string;
    refreshToken: string;
}