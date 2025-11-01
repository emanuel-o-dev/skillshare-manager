export interface User {
  id: number;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
}

export interface Course {
  id: number;
  title: string;
  description: string;
  instructor: string;
  duration: number;
  createdAt: string;
  updatedAt: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  name: string;
  email: string;
  password: string;
}

export interface CreateCourseDto {
  title: string;
  description: string;
  instructor: string;
  duration: number;
}

export interface AuthResponse {
  access_token: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
}
