export type ViewType = 'login' | 'dashboard' | 'course' | 'exam' | 'grades';
export type UserRole = 'student' | 'teacher' | 'admin';

export interface StudentGrade {
  id: string;
  name: string;
  initials: string;
  assg1: number | null;
  assg2: number | null; // null represents pending/incomplete or not yet graded
  midterm: number | null;
  status: 'Passed' | 'Incomplete' | 'Average';
  classroom?: string;
  attendanceNo?: number;
}

export interface AssignmentState {
  fileName: string | null;
  fileSize: string | null;
  comment: string;
  status: 'Pending' | 'Draft' | 'Not Submitted';
  submittedAt?: string;
}

export interface Lesson {
  id: string;
  title: string;
  type: 'Video' | 'Reading' | 'Assignment';
  duration: string;
  status: 'completed' | 'active' | 'locked';
  targetClassrooms?: string[]; // Classroom targeting, e.g. ["M.1/1"] or empty for all
}

export interface ExamSettings {
  timeLimit: number; // in minutes
  scoreVisibility: boolean;
  answerKeyVisibility: boolean;
  isOpen: boolean;
  targetClassrooms: string[]; // targeting specific classrooms
}

export interface Worksheet {
  id: string;
  title: string;
  dueDate: string;
  points: number;
}

export interface TeachingFile {
  id: string;
  name: string;
  size: string;
  uploadedAt: string;
}

export interface ExamState {
  questions: ExamQuestion[];
  answers: { [questionId: number]: string };
  currentQuestionIndex: number;
  isFinished: boolean;
  timeLeft: number; // in seconds
  flaggedQuestions: { [questionId: number]: boolean };
}

export interface ExamQuestion {
  id: number;
  text: string;
  options: {
    key: string;
    text: string;
  }[];
  correctAnswer: string;
  category?: string;
  difficulty?: string;
  number?: number;
}

