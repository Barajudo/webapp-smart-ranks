export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

export interface User {
  _id?: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  isActive?: boolean;
}

export interface CreateUserDto extends Omit<User, '_id' | 'isActive'> {}
export interface UpdateUserDto extends Partial<CreateUserDto> {}
