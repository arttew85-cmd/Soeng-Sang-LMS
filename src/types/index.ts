// User types
export interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: 'admin' | 'instructor' | 'student';
  createdAt: Date;
  updatedAt: Date;
}

// Course types
export interface Course {
  id: string;
  title: string;
  description: string;
  instructorId: string;
  thumbnail?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Lesson types
export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  content: string;
  videoUrl?: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

// Assignment types
export interface Assignment {
  id: string;
  courseId: string;
  title: string;
  description: string;
  dueDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Submission types
export interface Submission {
  id: string;
  assignmentId: string;
  studentId: string;
  content: string;
  submittedAt: Date;
  grade?: number;
  feedback?: string;
}
