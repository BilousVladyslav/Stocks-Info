export class User {
    email?: string;
    username?: string;
    first_name?: string;
    last_name?: string;
    is_superuser?: boolean;
    is_staff?: boolean;
}

export class ChangePassword{
    old_password?: string;
    new_password?: string;
    password_second?: string;
}

export class ChangeEmail{
    new_email?: string;
}