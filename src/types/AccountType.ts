export interface RegisterPayload {
  email:string,
  password:string,
  password2:string,
  api_key:number,
  first_name:string,
  last_name:string,
}

export interface LoginPayload {
    username:string,
    password:string,
    api_key:number,
}

export interface AuthResponse {
    access_token: string;
    refresh_token: string;
}

export interface UsersType {
    status: string,
    data: {
        email: string,
        first_name: string,
        last_name: string,
        phone_number: string;
    }
}

export interface UpdateProfileType {
    first_name: string,
    last_name: string,
    phone_number: string,
}