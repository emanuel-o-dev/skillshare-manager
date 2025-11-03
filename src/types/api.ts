export interface User {
  id: number;
  name: string;
  email: string;
  role: "USER" | "ADMIN" | "INSTRUCTOR";
}

export interface Course {
  id: number;
  code: string;
  name: string;
  description: string;
  hoursTotal: number;
  level: string;
  type: string;
  prerequisites: string[];
  createdAt: string;
  updatedAt: string;
  createdById: number;
  createdBy: {
    name: string;
    email: string;
  };
  Enrollment?: {
    user: {
      id: number;
      name: string;
      email: string;
    };
  }[];
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
  code: string;
  name: string;
  description: string;
  hoursTotal: number;
  level: string;
  type: string;
  prerequisites: string[];
}

export interface AuthResponse {
  access_token: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
}
