import React, { useState } from 'react';
import { 
  Users, 
  TrendingUp, 
  AlertCircle, 
  Search, 
  Download, 
  Edit3, 
  Check, 
  X, 
  FileSpreadsheet, 
  FileDown,
  BookOpen,
  FileQuestion,
  Plus,
  Trash2,
  Save,
  FileUp,
  Settings,
  FileText,
  School
} from 'lucide-react';
import { StudentGrade, Lesson, ExamQuestion, Worksheet, TeachingFile, ExamSettings } from '../types';

interface GradesViewProps {
  activeAdminTab: 'grades' | 'lessons' | 'exams' | 'files' | 'users' | 'settings';
  setActiveAdminTab: (tab: 'grades' | 'lessons' | 'exams' | 'files' | 'users' | 'settings') => void;
  students: StudentGrade[];
  onUpdateStudents: (updatedStudents: StudentGrade[]) => void;
  lessons: Lesson[];
  onUpdateLessons: (updatedLessons: Lesson[]) => void;
  examQuestions: ExamQuestion[];
  onUpdateExamQuestions: (updatedQuestions: ExamQuestion[]) => void;
  worksheets: Worksheet[];
  onUpdateWorksheets: (updatedWorksheets: Worksheet[]) => void;
  teachingFiles: TeachingFile[];
  onUpdateTeachingFiles: (updatedTeachingFiles: TeachingFile[]) => void;
  siteTitle: string;
  onUpdateSiteTitle: (newTitle: string) => void;
  announcement: string;
  onUpdateAnnouncement: (newAnnouncement: string) => void;
  registeredUsers: any[];
  onUpdateRegisteredUsers: React.Dispatch<React.SetStateAction<any[]>>;
  searchQuery: string;
  schoolLogo?: string;
  onUpdateSchoolLogo?: (logo: string) => void;
  profilePic?: string;
  onUpdateProfilePic?: (pic: string) => void;
  examSettings?: ExamSettings;
  onUpdateExamSettings?: (settings: ExamSettings) => void;
  classrooms?: string[];
  onUpdateClassrooms?: (classrooms: string[]) => void;
}

export default function GradesView({ 
  activeAdminTab,
  setActiveAdminTab,
  students, 
  onUpdateStudents, 
  lessons, 
  onUpdateLessons,
  examQuestions,
  onUpdateExamQuestions,
  worksheets,
  onUpdateWorksheets,
  teachingFiles,
  onUpdateTeachingFiles,
  siteTitle,
  onUpdateSiteTitle,
  announcement,
  onUpdateAnnouncement,
  registeredUsers,
  onUpdateRegisteredUsers,
  searchQuery,
  schoolLogo = "https://lh3.googleusercontent.com/aida-public/AB6AXuDjqn3HC4TuXM8YGx5YF0iMBGjEymfzRKfh6dU4v5V5232SWFGDQ4bKLNhDcHjvpcwbuhhxGYx7LwSf6x3WfKV3B5FuRhpDbn-7BTA52h4rydheCGRXMngAwlqw1z65_WHfmQyHof5O2MXg3je8a3i41p-ctPGJbx_WUX02tE-DTGsQ_dx-TPeGoqgmgCZMWifVQDA1KTzbr0bOqL6SxgAZ-OU_98DQPx-SwyRYgB8Y6OORS4f7d26YezFKD-hmGaF55A5fgxF4rbs",
  onUpdateSchoolLogo = () => {},
  profilePic = "https://lh3.googleusercontent.com/aida-public/AB6AXuDdnwwWvzNJmRUQ2Hcp7FyQEtgtsWPAE5F3t6B4j0gAxDhneRqfzvp7HU6A7zd0SdTlJ8qJzI__ODiwFOOp397TqlO5QGVmj9lS84I4bUgrwxQb03wx5sjQ37HSaIdTrOZTRQkvsIB3MbML_zqEEn6WnR0qjgEGvBVd3Z64u6NMchnyDciufl5Q0Y3FUuM9unxobqyQZF2bHTBtyokWEQJ0XHkycQx25lLQYRHc0zjndOnh3-esYyGPXcff2_6AlkQSMQQOHTBFBn8",
  onUpdateProfilePic = () => {},
  examSettings = {
    timeLimit: 45,
    scoreVisibility: true,
    answerKeyVisibility: true,
    isOpen: true,
    targetClassrooms: ['ทั้งหมด']
  },
  onUpdateExamSettings = () => {},
  classrooms = ['M.1/1', 'M.1/2', 'M.1/3'],
  onUpdateClassrooms = () => {}
}: GradesViewProps) {
  // Navigation for Admin Dashboard Panels - Now controlled externally
  const listClassrooms = classrooms && classrooms.length > 0 ? classrooms : ['M.1/1', 'M.1/2', 'M.1/3'];
  const [selectedClassroom, setSelectedClassroom] = useState(listClassrooms[0] || 'M.1/1');

  // Dynamic selectedClassroom safety helper
  const actualSelectedClassroom = listClassrooms.includes(selectedClassroom) 
    ? selectedClassroom 
    : (listClassrooms[0] || 'M.1/1');

  // Score Export Modal States
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportScoreType, setExportScoreType] = useState<'assignment' | 'exam'>('assignment');
  const [exportTopic, setExportTopic] = useState<'all' | 'assg1' | 'assg2'>('all');
  const [exportClassroom, setExportClassroom] = useState<string>('ทั้งหมด');

  // Classroom Management States
  const [newClassroomName, setNewClassroomName] = useState('');
  const [editingClassroomIndex, setEditingClassroomIndex] = useState<number | null>(null);
  const [editingClassroomName, setEditingClassroomName] = useState('');

  // Modal States for Student Grades
  const [editingStudent, setEditingStudent] = useState<StudentGrade | null>(null);
  const [assg1Val, setAssg1Val] = useState<string>('');
  const [assg2Val, setAssg2Val] = useState<string>('');
  const [midtermVal, setMidtermVal] = useState<string>('');

  // Forms / Add States for Lessons
  const [showAddLessonModal, setShowAddLessonModal] = useState(false);
  const [lessonTitle, setLessonTitle] = useState('');
  const [lessonType, setLessonType] = useState<'Video' | 'Reading' | 'Assignment'>('Video');
  const [lessonDuration, setLessonDuration] = useState('30m');
  const [lessonTargetClassrooms, setLessonTargetClassrooms] = useState<string[]>(['ทั้งหมด']);

  // Forms / Add States for Exam Questions
  const [showAddExamModal, setShowAddExamModal] = useState(false);
  const [examText, setExamText] = useState('');
  const [optA, setOptA] = useState('');
  const [optB, setOptB] = useState('');
  const [optC, setOptC] = useState('');
  const [optD, setOptD] = useState('');
  const [correctAns, setCorrectAns] = useState('A');

  const [isExamDragging, setIsExamDragging] = useState(false);
  const [examSortBy, setExamSortBy] = useState<'number' | 'category' | 'difficulty'>('number');

  // Classroom Management Methods
  const handleAddClassroomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newClassroomName.trim();
    if (!trimmed) return;
    if (listClassrooms.includes(trimmed)) {
      alert("ขออภัย! ห้องเรียนนี้มีอยู่แล้วในฐานข้อมูลระบบ");
      return;
    }
    const updated = [...listClassrooms, trimmed];
    onUpdateClassrooms(updated);
    setNewClassroomName('');
    alert(`เพิ่มห้องเรียนใหม่ "${trimmed}" และเชื่อมต่อฟอร์มสมัครสมาชิกสำเร็จ!`);
  };

  const handleStartEditClassroom = (index: number, name: string) => {
    setEditingClassroomIndex(index);
    setEditingClassroomName(name);
  };

  const handleSaveEditClassroom = (index: number) => {
    const trimmed = editingClassroomName.trim();
    if (!trimmed) return;
    const oldName = listClassrooms[index];
    if (listClassrooms.includes(trimmed) && trimmed !== oldName) {
      alert("ขออภัย! ห้องเรียนนี้มีอยู่แล้วในฐานข้อมูลระบบ");
      return;
    }
    const updated = [...listClassrooms];
    updated[index] = trimmed;
    onUpdateClassrooms(updated);
    setEditingClassroomIndex(null);

    // Also update student classroom references in the grades list & users list
    const updatedStudents = students.map(s => {
      if (s.classroom === oldName) {
        return { ...s, classroom: trimmed };
      }
      return s;
    });
    onUpdateStudents(updatedStudents);

    const updatedUsers = registeredUsers.map(u => {
      if (u.classroom === oldName) {
        return { ...u, classroom: trimmed };
      }
      return u;
    });
    onUpdateRegisteredUsers(updatedUsers);
    localStorage.setItem('lms_user_credentials', JSON.stringify(updatedUsers));

    alert(`แก้ไขชื่อห้องเรียนจาก "${oldName}" เป็น "${trimmed}" และโอนย้ายข้อมูลนักเรียนสำเร็จ!`);
  };

  const handleDeleteClassroom = (name: string) => {
    const confirmDelete = confirm(`คุณต้องการลบห้องเรียน "${name}" ใช่หรือไม่?\n\nคำเตือน: นักเรียนที่ลงทะเบียนในห้องเรียนนี้จะไม่สามารถเข้าเรียนบทเรียนที่ระบุได้ชั่วคราว`);
    if (!confirmDelete) return;

    const updated = listClassrooms.filter(c => c !== name);
    onUpdateClassrooms(updated);
    alert(`ลบห้องเรียน "${name}" สำเร็จ!`);
  };

  const handleDownloadSampleCSV = () => {
    const csvContent = "ข้อที่,โจทย์,ตัวเลือกA,ตัวเลือกB,ตัวเลือกC,ตัวเลือกD,เฉลย,หมวดหมู่,ความยาก\n" +
      "1,คอมพิวเตอร์ทำงานด้วยระบบเลขฐานใด?,เลขฐานสิบ,เลขฐานแปด,เลขฐานสอง,เลขฐานสิบหก,C,ฮาร์ดแวร์,ง่าย\n" +
      "2,อุปกรณ์ใดเป็นหน่วยประมวลผลกลางของระบบคอมพิวเตอร์?,RAM,CPU,Hard Disk,GPU,B,ฮาร์ดแวร์,ง่าย\n" +
      "3,ข้อใดจัดเป็นขั้นตอนวิธีในการแก้ปัญหาที่มีโครงสร้างชัดเจน?,ลูปเงื่อนไข,ตัวแปรแบบเรียล,ฟังก์ชันย้อนกลับ,อัลกอริทึม,D,อัลกอริทึม,ปานกลาง";
    
    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "lms_sample_exam_importer.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImportCSV = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        if (!text) {
          alert("ไม่สามารถอ่านไฟล์ได้ หรือไฟล์ไม่มีข้อมูล");
          return;
        }

        const lines = text.split(/\r?\n/).map(line => line.trim()).filter(line => line.length > 0);
        if (lines.length < 2) {
          alert("ไฟล์ไม่มีข้อมูลคำถามสอบกรุณาตรวจสอบว่ามีแถวหัวตาราง (Header) และแถวคำถามอย่างน้อย 1 แถว");
          return;
        }

        // Parse headers
        const headers = lines[0].split(',').map(h => h.trim().replace(/^["']|["']$/g, ''));
        
        // Find indices
        const textIdx = headers.findIndex(h => h.toLowerCase() === 'text' || h.toLowerCase() === 'question' || h.includes('โจทย์') || h.includes('คำถาม'));
        const optAIdx = headers.findIndex(h => h.toLowerCase() === 'a' || h.toLowerCase() === 'optiona' || h.includes('ตัวเลือกa') || h.includes('ก'));
        const optBIdx = headers.findIndex(h => h.toLowerCase() === 'b' || h.toLowerCase() === 'optionb' || h.includes('ตัวเลือกb') || h.includes('ข'));
        const optCIdx = headers.findIndex(h => h.toLowerCase() === 'c' || h.toLowerCase() === 'optionc' || h.includes('ตัวเลือกc') || h.includes('ค'));
        const optDIdx = headers.findIndex(h => h.toLowerCase() === 'd' || h.toLowerCase() === 'optiond' || h.includes('ตัวเลือกd') || h.includes('ง'));
        const correctIdx = headers.findIndex(h => h.toLowerCase() === 'correct' || h.toLowerCase() === 'correctanswer' || h.includes('เฉลย') || h.includes('คำตอบ'));
        const categoryIdx = headers.findIndex(h => h.toLowerCase() === 'category' || h.toLowerCase() === 'level' || h.includes('หมวดหมู่') || h.includes('ระดับชั้น'));
        const difficultyIdx = headers.findIndex(h => h.toLowerCase() === 'difficulty' || h.includes('ความยาก'));
        const numberIdx = headers.findIndex(h => h.toLowerCase() === 'number' || h.toLowerCase() === 'id' || h.includes('ลำดับ') || h.includes('ข้อที่'));

        if (textIdx === -1 || optAIdx === -1 || optBIdx === -1 || optCIdx === -1 || optDIdx === -1 || correctIdx === -1) {
          alert("รูปแบบหัวตาราง (Headers) ไม่ถูกต้อง! กรุณาตรวจสอบว่าไฟล์ CSV มีหัวข้อดังนี้: 'โจทย์', 'ตัวเลือกA', 'ตัวเลือกB', 'ตัวเลือกC', 'ตัวเลือกD', 'เฉลย'\n(หรือหัวข้อภาษาอังกฤษ: 'text', 'A', 'B', 'C', 'D', 'correct')");
          return;
        }

        const newQuestions: ExamQuestion[] = [];
        const errors: string[] = [];

        for (let i = 1; i < lines.length; i++) {
          const line = lines[i];
          const cols: string[] = [];
          let currentField = '';
          let inQuotes = false;
          
          for (let c = 0; c < line.length; c++) {
            const char = line[c];
            if (char === '"' || char === "'") {
              inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
              cols.push(currentField.trim());
              currentField = '';
            } else {
              currentField += char;
            }
          }
          cols.push(currentField.trim());

          if (cols.length < 6) {
            errors.push(`แถวที่ ${i + 1}: มีข้อมูลไม่ครบถ้วน (ต้องการอย่างน้อย โจทย์ ตัวเลือก 4 ข้อ และ เฉลย)`);
            continue;
          }

          const qText = cols[textIdx]?.replace(/^["']|["']$/g, '').trim();
          const qOptA = cols[optAIdx]?.replace(/^["']|["']$/g, '').trim();
          const qOptB = cols[optBIdx]?.replace(/^["']|["']$/g, '').trim();
          const qOptC = cols[optCIdx]?.replace(/^["']|["']$/g, '').trim();
          const qOptD = cols[optDIdx]?.replace(/^["']|["']$/g, '').trim();
          let qCorrect = cols[correctIdx]?.replace(/^["']|["']$/g, '').trim().toUpperCase();
          const qCategory = categoryIdx !== -1 && cols[categoryIdx] ? cols[categoryIdx].replace(/^["']|["']$/g, '').trim() : 'ทั่วไป';
          const qDifficulty = difficultyIdx !== -1 && cols[difficultyIdx] ? cols[difficultyIdx].replace(/^["']|["']$/g, '').trim() : 'ปานกลาง';
          const qNumberVal = numberIdx !== -1 && cols[numberIdx] ? parseInt(cols[numberIdx].replace(/^["']|["']$/g, '').trim(), 10) : i;
          const qNumber = isNaN(qNumberVal) ? i : qNumberVal;

          if (qCorrect === 'ก' || qCorrect === '1') qCorrect = 'A';
          else if (qCorrect === 'ข' || qCorrect === '2') qCorrect = 'B';
          else if (qCorrect === 'ค' || qCorrect === '3') qCorrect = 'C';
          else if (qCorrect === 'ง' || qCorrect === '4') qCorrect = 'D';

          if (!qText) {
            errors.push(`แถวที่ ${i + 1}: ไม่พบคำถามของโจทย์ข้อสอบ`);
            continue;
          }
          if (!qOptA || !qOptB || !qOptC || !qOptD) {
            errors.push(`แถวที่ ${i + 1}: ตัวเลือกคำตอบ (A, B, C, D) ป้อนไม่ครบถ้วน`);
            continue;
          }
          if (!['A', 'B', 'C', 'D'].includes(qCorrect)) {
            errors.push(`แถวที่ ${i + 1}: เฉลยไม่ถูกต้อง (ต้องระบุเป็น A, B, C หรือ D เท่านั้น ได้รับค่า: ${qCorrect})`);
            continue;
          }

          newQuestions.push({
            id: Date.now() + i,
            text: qText,
            options: [
              { key: 'A', text: qOptA },
              { key: 'B', text: qOptB },
              { key: 'C', text: qOptC },
              { key: 'D', text: qOptD }
            ],
            correctAnswer: qCorrect as 'A' | 'B' | 'C' | 'D',
            category: qCategory,
            difficulty: qDifficulty,
            number: qNumber
          });
        }

        if (errors.length > 0) {
          alert(`พบข้อผิดพลาดในการตรวจสอบข้อมูลไฟล์ CSV:\n\n${errors.slice(0, 5).join('\n')}${errors.length > 5 ? `\n...และยังมีข้อผิดพลาดอีก ${errors.length - 5} รายการ` : ''}`);
          return;
        }

        if (newQuestions.length === 0) {
          alert("ไม่พบคำถามที่ถูกต้องสำหรับการนำเข้า");
          return;
        }

        // Apply Auto-Sorting
        let sortedQuestions = [...newQuestions];
        if (examSortBy === 'category') {
          sortedQuestions.sort((a, b) => (a.category || '').localeCompare(b.category || ''));
        } else if (examSortBy === 'difficulty') {
          sortedQuestions.sort((a, b) => (a.difficulty || '').localeCompare(b.difficulty || ''));
        } else {
          sortedQuestions.sort((a, b) => (a.number || 0) - (b.number || 0));
        }

        const action = confirm(`อ่านข้อมูลข้อสอบเสร็จสิ้น!\n\nตรวจพบคำถามถูกต้องทั้งหมด ${newQuestions.length} ข้อ\nจัดเรียงแบบอัตโนมัติ (Auto-sorting): ${examSortBy === 'category' ? 'เรียงตามหมวดหมู่เนื้อหา' : examSortBy === 'difficulty' ? 'เรียงตามระดับความยาก' : 'เรียงตามลำดับข้อสอบ'}\n\nคุณต้องการลบคำถามเดิมทั้งหมดและแทนที่ใช่หรือไม่? (คลิก 'ยกเลิก' หากต้องการต่อท้ายข้อสอบเดิม)`);
        
        if (action) {
          onUpdateExamQuestions(sortedQuestions);
        } else {
          onUpdateExamQuestions([...examQuestions, ...sortedQuestions]);
        }

        alert("นำเข้าและจัดเรียงชุดข้อสอบใหม่เรียบร้อยแล้ว!");
      } catch (err) {
        alert("เกิดข้อผิดพลาดในการอ่านไฟล์ กรุณาตรวจสอบว่าเป็นไฟล์ CSV ที่มีรูปแบบถูกต้อง");
      }
    };
    reader.readAsText(file);
  };

  // File Upload states
  const [newFileName, setNewFileName] = useState('');
  const [newFileSize, setNewFileSize] = useState('1.5 MB');

  // 1. Filter students strictly by selected classroom first, and automatically sort by Attendance Number (เลขที่) in ascending order
  const classroomStudents = students
    .filter(s => (s.classroom || 'M.1/1') === actualSelectedClassroom)
    .sort((a, b) => {
      // Prioritize explicit attendance numbers (เลขที่)
      if (a.attendanceNo !== undefined && b.attendanceNo !== undefined) {
        return a.attendanceNo - b.attendanceNo;
      }
      if (a.attendanceNo !== undefined) return -1;
      if (b.attendanceNo !== undefined) return 1;

      // Fallback: sort by Student ID numerically
      const numA = parseInt(a.id, 10);
      const numB = parseInt(b.id, 10);
      if (!isNaN(numA) && !isNaN(numB)) {
        return numA - numB;
      }
      return a.id.localeCompare(b.id);
    });

  // 2. Perform search query filtering on top of classroom filter
  const filteredStudents = classroomStudents.filter((s) => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.id.includes(searchQuery)
  );

  // 3. Compute real classroom-specific analytics
  const totalStudentsInClass = classroomStudents.length;
  
  const gradedStudentsCount = classroomStudents.filter(
    s => s.assg1 !== null && s.assg2 !== null && s.midterm !== null
  ).length;

  const totalScores = classroomStudents.reduce((acc, curr) => {
    const s1 = curr.assg1 || 0;
    const s2 = curr.assg2 || 0;
    const sm = curr.midterm || 0;
    return acc + (s1 + s2 + sm);
  }, 0);

  const classAvgPercent = totalStudentsInClass > 0 
    ? Math.round((totalScores / (totalStudentsInClass * 100)) * 100) 
    : 0;

  const pendingGradedCount = classroomStudents.filter(
    s => s.assg1 === null || s.assg2 === null || s.midterm === null
  ).length;

  // Grade Edit functions
  const handleEditClick = (student: StudentGrade) => {
    setEditingStudent(student);
    setAssg1Val(student.assg1 !== null ? student.assg1.toString() : '');
    setAssg2Val(student.assg2 !== null ? student.assg2.toString() : '');
    setMidtermVal(student.midterm !== null ? student.midterm.toString() : '');
  };

  const handleSaveGrades = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;

    const s1 = assg1Val === '' ? null : Math.min(20, Math.max(0, parseInt(assg1Val) || 0));
    const s2 = assg2Val === '' ? null : Math.min(30, Math.max(0, parseInt(assg2Val) || 0));
    const sm = midtermVal === '' ? null : Math.min(50, Math.max(0, parseInt(midtermVal) || 0));

    // Compute status in Thai logic
    let status: 'Passed' | 'Incomplete' | 'Average' = 'Passed';
    if (s1 === null || s2 === null || sm === null) {
      status = 'Incomplete';
    } else {
      const total = s1 + s2 + sm;
      if (total < 50) status = 'Incomplete';
      else if (total < 75) status = 'Average';
    }

    const updated = students.map((s) => {
      if (s.id === editingStudent.id) {
        return {
          ...s,
          assg1: s1,
          assg2: s2,
          midterm: sm,
          status
        };
      }
      return s;
    });

    onUpdateStudents(updated);
    setEditingStudent(null);
  };

  const exportToCSV = (filteredList: any[], headers: string[], keys: string[], fileName: string) => {
    let csvContent = headers.join(',') + '\n';
    filteredList.forEach(row => {
      const line = keys.map(key => {
        let val = row[key];
        if (val === null || val === undefined) val = 'ยังไม่ระบุ';
        if (typeof val === 'string' && val.includes(',')) {
          return `"${val}"`;
        }
        return val;
      }).join(',');
      csvContent += line + '\n';
    });

    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToPDF = (targetClassroom: string, targetStudents: any[]) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert("กรุณาอนุญาตให้บราวเซอร์แสดงหน้าต่างป๊อปอัปเพื่อออกรายงาน PDF");
      return;
    }

    const isExam = exportScoreType === 'exam';
    const titleText = isExam
      ? `รายงานคะแนนสอบกลางภาควิชาคอมพิวเตอร์ ห้อง ${targetClassroom}`
      : `รายงานคะแนนเก็บและคะแนนใบงานสะสม ห้อง ${targetClassroom}`;

    const headers = isExam
      ? ['เลขที่', 'เลขประจำตัว', 'ชื่อ-นามสกุล', 'ห้องเรียน', 'คะแนนสอบ (เต็ม 50)', 'สถานะประเมิน']
      : ['เลขที่', 'เลขประจำตัว', 'ชื่อ-นามสกุล', 'ห้องเรียน', 'ใบงานที่ 1 (20)', 'ใบงานที่ 2 (30)', 'คะแนนรวมใบงาน (50)', 'สถานะประเมิน'];

    let tableRowsHTML = '';
    targetStudents.forEach((s, idx) => {
      const s1 = s.assg1 !== null ? s.assg1 : '-';
      const s2 = s.assg2 !== null ? s.assg2 : '-';
      const sm = s.midterm !== null ? s.midterm : '-';
      const total = (s.assg1 || 0) + (s.assg2 || 0);
      const statusText = s.status === 'Passed' ? 'ผ่านเกณฑ์ดี' : s.status === 'Average' ? 'ปานกลาง' : 'ยังไม่สมบูรณ์';

      const attNoText = s.attendanceNo !== undefined ? s.attendanceNo : idx + 1;

      if (isExam) {
        tableRowsHTML += `
          <tr>
            <td style="text-align: center; padding: 10px; border: 1px solid #ddd;">${attNoText}</td>
            <td style="text-align: center; padding: 10px; border: 1px solid #ddd;">${s.id}</td>
            <td style="padding: 10px; border: 1px solid #ddd;">${s.name}</td>
            <td style="text-align: center; padding: 10px; border: 1px solid #ddd;">ม.${s.classroom || '1/1'}</td>
            <td style="text-align: center; padding: 10px; border: 1px solid #ddd; font-weight: bold; color: #1f2937;">${sm}</td>
            <td style="text-align: center; padding: 10px; border: 1px solid #ddd;">${statusText}</td>
          </tr>
        `;
      } else {
        tableRowsHTML += `
          <tr>
            <td style="text-align: center; padding: 10px; border: 1px solid #ddd;">${attNoText}</td>
            <td style="text-align: center; padding: 10px; border: 1px solid #ddd;">${s.id}</td>
            <td style="padding: 10px; border: 1px solid #ddd;">${s.name}</td>
            <td style="text-align: center; padding: 10px; border: 1px solid #ddd;">ม.${s.classroom || '1/1'}</td>
            <td style="text-align: center; padding: 10px; border: 1px solid #ddd;">${s1}</td>
            <td style="text-align: center; padding: 10px; border: 1px solid #ddd;">${s2}</td>
            <td style="text-align: center; padding: 10px; border: 1px solid #ddd; font-weight: bold; color: #b45309;">${total}</td>
            <td style="text-align: center; padding: 10px; border: 1px solid #ddd;">${statusText}</td>
          </tr>
        `;
      }
    });

    const htmlContent = `
      <html>
        <head>
          <title>${titleText}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Sarabun:wght@400;600;700&display=swap');
            body { font-family: 'Sarabun', sans-serif, 'Helvetica Neue'; padding: 30px; color: #333; }
            h2 { text-align: center; margin-bottom: 5px; font-weight: bold; }
            h3 { text-align: center; margin-top: 0; color: #555; font-size: 14px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 12px; }
            th { background-color: #f3f4f6; color: #374151; font-weight: bold; padding: 12px 10px; border: 1px solid #ddd; text-align: center; }
            .footer { margin-top: 50px; text-align: right; font-size: 12px; color: #666; }
            .signature { margin-top: 40px; margin-right: 20px; display: inline-block; text-align: center; width: 250px; }
            .line { border-bottom: 1px dotted #333; margin-top: 40px; margin-bottom: 5px; }
          </style>
        </head>
        <body>
          <h2>${titleText}</h2>
          <h3>โรงเรียนเสิงสาง อำเภอเสิงสาง จังหวัดนครราชสีมา</h3>
          <p style="font-size: 11px; text-align: right; color: #666;">วันที่ออกรายงาน: ${new Date().toLocaleDateString('th-TH', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          <table>
            <thead>
              <tr>
                ${headers.map(h => `<th>${h}</th>`).join('')}
              </tr>
            </thead>
            <tbody>
              ${tableRowsHTML}
            </tbody>
          </table>
          <div style="text-align: right; margin-top: 40px;">
            <div class="signature">
              <p>ลงชื่อ............................................................ผู้ลงนาม</p>
              <p style="margin-top: 8px;">(คุณครูผู้สอนประจำวิชาวิทยาการคำนวณ)</p>
            </div>
          </div>
          <script>
            window.onload = function() {
              window.print();
              window.onafterprint = function() {
                window.close();
              };
            }
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  const handleExportCSVSubmit = () => {
    let targetStudents = students;
    if (exportClassroom !== 'ทั้งหมด') {
      targetStudents = students.filter(s => (s.classroom || 'M.1/1') === exportClassroom);
    }

    targetStudents = [...targetStudents].sort((a, b) => {
      // Prioritize explicit attendance numbers
      if (a.attendanceNo !== undefined && b.attendanceNo !== undefined) {
        return a.attendanceNo - b.attendanceNo;
      }
      if (a.attendanceNo !== undefined) return -1;
      if (b.attendanceNo !== undefined) return 1;

      // Fallback
      const numA = parseInt(a.id, 10);
      const numB = parseInt(b.id, 10);
      if (!isNaN(numA) && !isNaN(numB)) {
        return numA - numB;
      }
      return a.id.localeCompare(b.id);
    });

    let headers: string[] = [];
    let keys: string[] = [];
    
    const preparedList = targetStudents.map((s, index) => {
      const s1 = s.assg1 !== null ? s.assg1 : 'ยังไม่ระบุ';
      const s2 = s.assg2 !== null ? s.assg2 : 'ยังไม่ระบุ';
      const sm = s.midterm !== null ? s.midterm : 'ยังไม่ระบุ';
      const total = (s.assg1 || 0) + (s.assg2 || 0);
      const statusText = s.status === 'Passed' ? 'ผ่านเกณฑ์ดี' : s.status === 'Average' ? 'ปานกลาง' : 'ยังไม่สมบูรณ์';

      return {
        idx: s.attendanceNo !== undefined ? s.attendanceNo : index + 1,
        id: s.id,
        name: s.name,
        classroom: `ม.${s.classroom || '1/1'}`,
        assg1: s1,
        assg2: s2,
        midterm: sm,
        totalAssg: total,
        status: statusText
      };
    });

    let filename = '';
    if (exportScoreType === 'exam') {
      headers = ['เลขที่', 'เลขประจำตัว', 'ชื่อ-นามสกุล', 'ห้องเรียน', 'คะแนนสอบกลางภาค (50)', 'สถานะประเมิน'];
      keys = ['idx', 'id', 'name', 'classroom', 'midterm', 'status'];
      filename = `รายงานคะแนนสอบกลางภาค_ห้อง_${exportClassroom}.csv`;
    } else {
      if (exportTopic === 'assg1') {
        headers = ['เลขที่', 'เลขประจำตัว', 'ชื่อ-นามสกุล', 'ห้องเรียน', 'คะแนนใบงานที่ 1 (20)', 'สถานะประเมิน'];
        keys = ['idx', 'id', 'name', 'classroom', 'assg1', 'status'];
        filename = `รายงานคะแนนใบงาน1_ห้อง_${exportClassroom}.csv`;
      } else if (exportTopic === 'assg2') {
        headers = ['เลขที่', 'เลขประจำตัว', 'ชื่อ-นามสกุล', 'ห้องเรียน', 'คะแนนใบงานที่ 2 (30)', 'สถานะประเมิน'];
        keys = ['idx', 'id', 'name', 'classroom', 'assg2', 'status'];
        filename = `รายงานคะแนนใบงาน2_ห้อง_${exportClassroom}.csv`;
      } else {
        headers = ['เลขที่', 'เลขประจำตัว', 'ชื่อ-นามสกุล', 'ห้องเรียน', 'ใบงานที่ 1 (20)', 'ใบงานที่ 2 (30)', 'คะแนนรวมใบงาน (50)', 'สถานะประเมิน'];
        keys = ['idx', 'id', 'name', 'classroom', 'assg1', 'assg2', 'totalAssg', 'status'];
        filename = `รายงานคะแนนเก็บทั้งหมด_ห้อง_${exportClassroom}.csv`;
      }
    }

    exportToCSV(preparedList, headers, keys, filename);
    setShowExportModal(false);
  };

  const handleExportPDFSubmit = () => {
    let targetClassroomLabel = exportClassroom;
    let targetStudents = students;
    if (exportClassroom !== 'ทั้งหมด') {
      targetStudents = students.filter(s => (s.classroom || 'M.1/1') === exportClassroom);
    }

    targetStudents = [...targetStudents].sort((a, b) => {
      // Prioritize explicit attendance numbers
      if (a.attendanceNo !== undefined && b.attendanceNo !== undefined) {
        return a.attendanceNo - b.attendanceNo;
      }
      if (a.attendanceNo !== undefined) return -1;
      if (b.attendanceNo !== undefined) return 1;

      // Fallback
      const numA = parseInt(a.id, 10);
      const numB = parseInt(b.id, 10);
      if (!isNaN(numA) && !isNaN(numB)) {
        return numA - numB;
      }
      return a.id.localeCompare(b.id);
    });

    exportToPDF(targetClassroomLabel, targetStudents);
    setShowExportModal(false);
  };

  const handleExport = (type: 'excel' | 'pdf') => {
    if (type === 'excel') {
      handleExportCSVSubmit();
    } else {
      handleExportPDFSubmit();
    }
  };

  // Lesson CRUD Actions
  const handleAddLesson = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lessonTitle.trim()) {
      alert('กรุณากรอกชื่อหัวข้อบทเรียน');
      return;
    }
    const newId = `${(lessons.length + 1).toFixed(1)}`;
    const newLesson: Lesson = {
      id: newId,
      title: lessonTitle.trim(),
      type: lessonType,
      duration: lessonDuration,
      status: 'locked',
      targetClassrooms: lessonTargetClassrooms
    };
    onUpdateLessons([...lessons, newLesson]);
    setLessonTitle('');
    setLessonTargetClassrooms(['ทั้งหมด']);
    setShowAddLessonModal(false);
    alert('เพิ่มหัวข้อบทเรียนใหม่เรียบร้อยแล้ว!');
  };

  const handleDeleteLesson = (id: string) => {
    if (confirm('คุณแน่ใจหรือไม่ที่จะลบบทเรียนหัวข้อนี้ออกจากระบบ?')) {
      onUpdateLessons(lessons.filter(l => l.id !== id));
    }
  };

  const handleUnlockLesson = (id: string) => {
    const updated = lessons.map(l => {
      if (l.id === id) {
        return { ...l, status: l.status === 'locked' ? 'active' : 'completed' } as Lesson;
      }
      return l;
    });
    onUpdateLessons(updated);
  };

  // Exam CRUD Actions
  const handleAddExamQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!examText.trim() || !optA.trim() || !optB.trim() || !optC.trim() || !optD.trim()) {
      alert('กรุณากรอกโจทย์และตัวเลือกให้ครบถ้วนทุกข้อ');
      return;
    }
    const newQuestion: ExamQuestion = {
      id: Date.now(),
      text: examText.trim(),
      options: [
        { key: 'A', text: optA.trim() },
        { key: 'B', text: optB.trim() },
        { key: 'C', text: optC.trim() },
        { key: 'D', text: optD.trim() }
      ],
      correctAnswer: correctAns
    };
    onUpdateExamQuestions([...examQuestions, newQuestion]);
    setExamText('');
    setOptA('');
    setOptB('');
    setOptC('');
    setOptD('');
    setShowAddExamModal(false);
    alert('เพิ่มข้อสอบใหม่เรียบร้อยแล้ว!');
  };

  const handleDeleteExamQuestion = (id: number) => {
    if (confirm('คุณต้องการลบข้อสอบข้อนี้ใช่หรือไม่?')) {
      onUpdateExamQuestions(examQuestions.filter(q => q.id !== id));
    }
  };

  // Teaching Materials upload
  const handleUploadFile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFileName.trim()) {
      alert('กรุณากรอกชื่อไฟล์หรือเลือกไฟล์เอกสารสื่อการสอน');
      return;
    }
    const newFile: TeachingFile = {
      id: `f-${Date.now()}`,
      name: newFileName.trim(),
      size: newFileSize,
      uploadedAt: new Date().toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' })
    };
    onUpdateTeachingFiles([...teachingFiles, newFile]);
    setNewFileName('');
    alert('อัปโหลดไฟล์สื่อการเรียนการสอนขึ้นสู่คลังเซิร์ฟเวอร์เสร็จสมบูรณ์!');
  };

  const handleDeleteFile = (id: string) => {
    if (confirm('ยืนยันลบไฟล์เอกสารนี้ออกจากคลังข้อมูลครูผู้สอน?')) {
      onUpdateTeachingFiles(teachingFiles.filter(f => f.id !== id));
    }
  };

  // Student Account deletion
  const handleDeleteStudentAccount = (email: string) => {
    if (confirm(`คุณแน่ใจที่จะลบบัญชีนักเรียนนี้ (${email}) และลบสิทธิ์การเข้าสู่ระบบหรือไม่? นักเรียนจะสามารถลงทะเบียนใหม่ได้`)) {
      onUpdateRegisteredUsers(registeredUsers.filter(u => u.email !== email));
      alert('ลบบัญชีนักเรียนออกจากประวัติเข้าใช้งานสำเร็จ');
    }
  };

  return (
    <div className="flex-grow p-4 md:p-6 lg:p-8 max-w-[1280px] w-full mx-auto select-none animate-in fade-in duration-200">
      
      {/* Dynamic Site Header Title */}
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="font-sans font-extrabold text-xl lg:text-2xl text-[#f0f6fc] tracking-tight flex items-center gap-2">
            <Settings className="w-6 h-6 text-[#d4af37]" />
            {siteTitle} — แผงควบคุมผู้ดูแลระบบและครูผู้สอน
          </h2>
          <p className="font-sans text-xs text-[#8b949e] mt-1">
            บริหารจัดการหลักสูตร ตารางประเมินผลการเรียน คลังเฉลยข้อสอบ สื่อเอกสาร และสิทธิ์เข้าใช้งานของนักเรียนโรงเรียนเสิงสาง
          </p>
        </div>
      </div>

      {/* Admin Dashboard Sub-Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-[#30363d] pb-4 mb-6">
        <button 
          onClick={() => setActiveAdminTab('grades')}
          className={`flex items-center gap-2 py-2 px-4 rounded-xl font-sans text-xs font-bold transition-all cursor-pointer ${
            activeAdminTab === 'grades' 
              ? 'bg-[#d4af37] text-[#0a0c10] shadow' 
              : 'text-[#8b949e] hover:text-[#f0f6fc] hover:bg-[#161b22]'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>📊 ผลคะแนนนักเรียน</span>
        </button>
        <button 
          onClick={() => setActiveAdminTab('users')}
          className={`flex items-center gap-2 py-2 px-4 rounded-xl font-sans text-xs font-bold transition-all cursor-pointer ${
            activeAdminTab === 'users' 
              ? 'bg-[#d4af37] text-[#0a0c10] shadow' 
              : 'text-[#8b949e] hover:text-[#f0f6fc] hover:bg-[#161b22]'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>👥 จัดการผู้ใช้ ({registeredUsers.length})</span>
        </button>
        <button 
          onClick={() => setActiveAdminTab('lessons')}
          className={`flex items-center gap-2 py-2 px-4 rounded-xl font-sans text-xs font-bold transition-all cursor-pointer ${
            activeAdminTab === 'lessons' 
              ? 'bg-[#d4af37] text-[#0a0c10] shadow' 
              : 'text-[#8b949e] hover:text-[#f0f6fc] hover:bg-[#161b22]'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>📖 จัดการบทเรียน ({lessons.length})</span>
        </button>
        <button 
          onClick={() => setActiveAdminTab('exams')}
          className={`flex items-center gap-2 py-2 px-4 rounded-xl font-sans text-xs font-bold transition-all cursor-pointer ${
            activeAdminTab === 'exams' 
              ? 'bg-[#d4af37] text-[#0a0c10] shadow' 
              : 'text-[#8b949e] hover:text-[#f0f6fc] hover:bg-[#161b22]'
          }`}
        >
          <FileQuestion className="w-4 h-4" />
          <span>📝 จัดการข้อสอบ ({examQuestions.length})</span>
        </button>
        <button 
          onClick={() => setActiveAdminTab('files')}
          className={`flex items-center gap-2 py-2 px-4 rounded-xl font-sans text-xs font-bold transition-all cursor-pointer ${
            activeAdminTab === 'files' 
              ? 'bg-[#d4af37] text-[#0a0c10] shadow' 
              : 'text-[#8b949e] hover:text-[#f0f6fc] hover:bg-[#161b22]'
          }`}
        >
          <FileUp className="w-4 h-4" />
          <span>📁 จัดการสื่อการเรียน ({teachingFiles.length})</span>
        </button>
        <button 
          onClick={() => setActiveAdminTab('settings')}
          className={`flex items-center gap-2 py-2 px-4 rounded-xl font-sans text-xs font-bold transition-all cursor-pointer ${
            activeAdminTab === 'settings' 
              ? 'bg-[#d4af37] text-[#0a0c10] shadow' 
              : 'text-[#8b949e] hover:text-[#f0f6fc] hover:bg-[#161b22]'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>⚙️ ตั้งค่าระบบแบรนดิ้ง</span>
        </button>
      </div>

      {/* ----------------- TAB 1: GRADES MATRIX ----------------- */}
      {activeAdminTab === 'grades' && (
        <>
          {/* Top Header Controls */}
          <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div className="flex items-center gap-3 bg-[#161b22] border border-[#30363d] py-2 px-4 rounded-xl shadow-sm">
              <span className="font-sans text-xs text-[#8b949e] font-semibold">ห้องเรียนที่ระบุ:</span>
              <select 
                value={actualSelectedClassroom}
                onChange={(e) => setSelectedClassroom(e.target.value)}
                className="bg-transparent font-sans text-xs font-bold text-[#f0f6fc] focus:outline-none cursor-pointer"
              >
                {listClassrooms.map((cls) => (
                  <option key={cls} value={cls} className="bg-[#161b22] text-[#f0f6fc]">
                    ชั้นมัธยมศึกษาปีที่ {cls}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-2.5 w-full md:w-auto">
              <button 
                onClick={() => {
                  setExportClassroom(actualSelectedClassroom);
                  setShowExportModal(true);
                }}
                className="flex-1 md:flex-initial flex items-center justify-center gap-2 py-2.5 px-5 bg-[#d4af37] text-[#0a0c10] hover:bg-[#aa8e2d] rounded-xl font-sans text-xs font-extrabold transition-all shadow-md cursor-pointer border-0"
              >
                <Download className="w-4 h-4" />
                <span>📥 ดาวน์โหลดคะแนนแยกประเภท</span>
              </button>
            </div>
          </section>

          {/* Classroom stats summary */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 flex items-center justify-between shadow-sm">
              <div>
                <span className="font-sans text-[10px] text-[#8b949e] uppercase tracking-wider font-bold">จำนวนนักเรียนในห้อง</span>
                <div className="font-sans text-3xl font-semibold text-[#f0f6fc] mt-1">{totalStudentsInClass} คน</div>
              </div>
              <div className="w-10 h-10 rounded-full bg-[#0d1117] text-[#d4af37] flex items-center justify-center border border-[#30363d]">
                <Users className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 flex items-center justify-between shadow-sm">
              <div>
                <span className="font-sans text-[10px] text-[#8b949e] uppercase tracking-wider font-bold">เกรดเฉลี่ยประเมินผลห้อง</span>
                <div className="font-sans text-3xl font-semibold text-[#f0f6fc] mt-1">{classAvgPercent}%</div>
              </div>
              <div className="w-10 h-10 rounded-full bg-[#0d1117] text-[#d4af37] flex items-center justify-center border border-[#30363d]">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 flex items-center justify-between shadow-sm">
              <div>
                <span className="font-sans text-[10px] text-[#8b949e] uppercase tracking-wider font-bold">งานค้างตรวจ/ค้างลงบันทึก</span>
                <div className="font-sans text-3xl font-semibold text-yellow-500 mt-1">{pendingGradedCount} งาน</div>
              </div>
              <div className="w-10 h-10 rounded-full bg-[#0d1117] text-yellow-500 flex items-center justify-center border border-[#30363d]">
                <AlertCircle className="w-5 h-5" />
              </div>
            </div>
          </section>

          {/* Grade Table Card */}
          <div className="bg-[#161b22] border border-[#30363d] rounded-2xl overflow-hidden shadow-sm">
            <div className="p-4 bg-[#0d1117]/30 border-b border-[#30363d] flex justify-between items-center">
              <span className="font-sans text-xs font-bold text-[#f0f6fc]">บัญชีรายชื่อแสดงคะแนน (กรองด้วยช่องค้นหารูดบาร์ด้านบน)</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-xs font-sans text-[#8b949e] min-w-[800px]">
                <thead className="bg-[#0d1117] border-b border-[#30363d] font-sans text-[10px] uppercase font-bold text-[#8b949e] tracking-wider">
                  <tr>
                    <th className="px-4 py-3.5 text-center w-16">เลขที่</th>
                    <th className="px-6 py-3.5 text-center w-28">รหัสประจำตัว</th>
                    <th className="px-6 py-3.5">ชื่อ-นามสกุลนักเรียน</th>
                    <th className="px-6 py-3.5 text-center">ใบงานที่ 1 (20)</th>
                    <th className="px-6 py-3.5 text-center">ใบงานที่ 2 (30)</th>
                    <th className="px-6 py-3.5 text-center">สอบกลางภาค (50)</th>
                    <th className="px-6 py-3.5 text-center">คะแนนรวม (100)</th>
                    <th className="px-6 py-3.5 text-center">สถานะประเมิน</th>
                    <th className="px-6 py-3.5 text-center w-24">จัดการคะแนน</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#30363d]">
                  {filteredStudents.length > 0 ? (
                    filteredStudents.map((s, index) => {
                      const s1 = s.assg1 !== null ? s.assg1 : '-';
                      const s2 = s.assg2 !== null ? s.assg2 : '-';
                      const sm = s.midterm !== null ? s.midterm : '-';
                      
                      const total = (s.assg1 || 0) + (s.assg2 || 0) + (s.midterm || 0);
                      const showTotal = (s.assg1 !== null || s.assg2 !== null || s.midterm !== null) ? total : '-';

                      return (
                        <tr key={s.id} className="hover:bg-[#0d1117]/20 transition-colors">
                          <td className="px-4 py-4 text-center font-mono text-sm font-bold text-[#d4af37]">
                            {s.attendanceNo !== undefined ? s.attendanceNo : index + 1}
                          </td>
                          <td className="px-6 py-4 font-mono text-center font-bold text-[#8b949e]">{s.id}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-[#0d1117] text-[#d4af37] border border-[#30363d] flex items-center justify-center font-bold text-[10px] uppercase shrink-0">
                                {s.initials}
                              </div>
                              <span className="font-semibold text-[#f0f6fc] text-sm">{s.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center font-mono text-sm font-semibold text-[#f0f6fc]">{s1}</td>
                          <td className="px-6 py-4 text-center font-mono text-sm font-semibold text-[#f0f6fc]">{s2}</td>
                          <td className="px-6 py-4 text-center font-mono text-sm font-semibold text-[#f0f6fc]">{sm}</td>
                          <td className="px-6 py-4 text-center font-mono text-sm font-extrabold text-[#d4af37]">{showTotal}</td>
                          <td className="px-6 py-4 text-center">
                            <span className={`inline-block px-3 py-0.5 rounded-full font-sans text-[10px] font-semibold tracking-wider ${
                              s.status === 'Passed'
                                ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                                : s.status === 'Average'
                                ? 'bg-yellow-500/10 text-[#d4af37] border border-[#d4af37]/20'
                                : 'bg-red-500/10 text-red-400 border border-red-500/20'
                            }`}>
                              {s.status === 'Passed' ? 'ผ่านเกณฑ์ดี' : s.status === 'Average' ? 'ปานกลาง' : 'ยังไม่สมบูรณ์'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <button 
                              onClick={() => handleEditClick(s)}
                              className="p-1.5 hover:bg-[#0d1117] rounded-lg text-[#8b949e] hover:text-[#d4af37] transition-colors cursor-pointer"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={8} className="px-6 py-12 text-center font-sans text-sm text-[#8b949e]">
                        ไม่พบรายชื่อนักเรียนที่ตรงกับคำค้นหา "{searchQuery}" ในห้อง {selectedClassroom}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* ----------------- TAB 2: MANAGE LESSONS ----------------- */}
      {activeAdminTab === 'lessons' && (
        <div className="flex flex-col gap-6 select-text">
          <div className="flex justify-between items-center bg-[#161b22] border border-[#30363d] p-5 rounded-2xl">
            <div>
              <h3 className="font-sans font-bold text-base text-[#f0f6fc]">หัวข้อวิดีโอและสารบัญบทเรียน ({lessons.length} บทเรียน)</h3>
              <p className="font-sans text-xs text-[#8b949e] mt-1">เพิ่มลบบทเรียนเพื่อแสดงผลในหน้าจอเข้าเรียนของนักเรียนโดยทันที</p>
            </div>
            <button 
              onClick={() => setShowAddLessonModal(true)}
              className="flex items-center gap-1.5 py-2 px-4 bg-[#d4af37] hover:bg-[#aa8e2d] text-[#0a0c10] rounded-xl font-sans text-xs font-bold transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>เพิ่มบทเรียนใหม่</span>
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {lessons.map((lesson) => (
              <div key={lesson.id} className="bg-[#161b22] border border-[#30363d] rounded-2xl p-5 flex justify-between items-center hover:border-yellow-500/20 transition-all">
                <div className="flex items-center gap-4">
                  <span className="font-mono text-xs font-bold text-[#d4af37] bg-[#0d1117] border border-[#30363d] px-2.5 py-1 rounded-lg shrink-0">
                    ID {lesson.id}
                  </span>
                  <div>
                    <h4 className="font-sans font-bold text-sm text-[#f0f6fc]">{lesson.title}</h4>
                    <div className="flex gap-4 font-sans text-[11px] text-[#8b949e] mt-1">
                      <span>ชนิด: <span className="text-[#f0f6fc] font-semibold">{lesson.type}</span></span>
                      <span>•</span>
                      <span>ความยาว: <span className="text-[#f0f6fc] font-semibold">{lesson.duration}</span></span>
                      <span>•</span>
                      <span>สถานะ: <span className={`font-semibold ${
                        lesson.status === 'completed' ? 'text-green-400' : lesson.status === 'active' ? 'text-yellow-400' : 'text-[#8b949e]'
                      }`}>{lesson.status === 'completed' ? 'ผ่านแล้ว' : lesson.status === 'active' ? 'กำลังเรียน' : 'ล็อคอยู่'}</span></span>
                      <span>•</span>
                      <span>เป้าหมายนักเรียน: <span className="text-[#d4af37] font-semibold">{lesson.targetClassrooms && lesson.targetClassrooms.length > 0 ? lesson.targetClassrooms.join(', ') : 'ทั้งหมด'}</span></span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handleUnlockLesson(lesson.id)}
                    className="py-1 px-3 bg-[#0d1117] hover:bg-[#161b22] text-[#8b949e] hover:text-[#f0f6fc] border border-[#30363d] rounded-lg font-sans text-[10px] font-bold cursor-pointer"
                    title="สลับล็อค/ปลดล็อคสถานะบทเรียน"
                  >
                    สลับสถานะบทเรียน
                  </button>
                  <button 
                    onClick={() => handleDeleteLesson(lesson.id)}
                    className="p-1.5 bg-[#0d1117] hover:bg-red-500/10 text-red-400 border border-[#30363d] hover:border-red-500/30 rounded-lg cursor-pointer transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ----------------- TAB 3: MANAGE EXAM QUESTIONS ----------------- */}
      {activeAdminTab === 'exams' && (
        <div className="flex flex-col gap-6 select-text">
          <div className="flex justify-between items-center bg-[#161b22] border border-[#30363d] p-5 rounded-2xl">
            <div>
              <h3 className="font-sans font-bold text-base text-[#f0f6fc]">ระบบจัดทำและคลังข้อสอบ ({examQuestions.length} ข้อ)</h3>
              <p className="font-sans text-xs text-[#8b949e] mt-1">ข้อสอบที่เพิ่มจะไปอัปเดตแบบทดสอบเสมือนจริงหน้าเพจนักเรียน</p>
            </div>
            <button 
              onClick={() => setShowAddExamModal(true)}
              className="flex items-center gap-1.5 py-2 px-4 bg-[#d4af37] hover:bg-[#aa8e2d] text-[#0a0c10] rounded-xl font-sans text-xs font-bold transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>เพิ่มโจทย์ข้อสอบใหม่</span>
            </button>
          </div>

          {/* Exam Control & Configurations Panel */}
          <div className="bg-[#161b22] border border-[#30363d] p-6 rounded-2xl flex flex-col gap-5">
            <div className="border-b border-[#30363d] pb-3">
              <h4 className="font-sans font-bold text-sm text-[#f0f6fc] flex items-center gap-2">
                <Settings className="w-5 h-5 text-[#d4af37]" />
                <span>การตั้งค่าและควบคุมชุดข้อสอบกลางภาค (Advanced Exam Control & Configurations)</span>
              </h4>
              <p className="font-sans text-xs text-[#8b949e] mt-1">
                กำหนดพารามิเตอร์จำกัดเวลา, การมองเห็นเฉลยและคะแนน, รวมถึงความพร้อมเปิดสอบของนักเรียน ม.1/1 - ม.1/3 ทันที
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {/* Exam Status Toggle */}
              <div className="flex flex-col gap-2">
                <label className="font-sans text-xs font-semibold text-[#8b949e]">สถานะระบบสอบกลางภาค (Exam Status)</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => onUpdateExamSettings({ ...examSettings, isOpen: true })}
                    className={`flex-1 py-2 rounded-xl font-sans text-xs font-bold transition-all border cursor-pointer ${
                      examSettings.isOpen
                        ? 'bg-green-500/10 border-green-500 text-green-400'
                        : 'bg-[#0d1117] border-[#30363d] text-[#8b949e] hover:text-[#f0f6fc]'
                    }`}
                  >
                    เปิดสอบ (Open)
                  </button>
                  <button
                    type="button"
                    onClick={() => onUpdateExamSettings({ ...examSettings, isOpen: false })}
                    className={`flex-1 py-2 rounded-xl font-sans text-xs font-bold transition-all border cursor-pointer ${
                      !examSettings.isOpen
                        ? 'bg-red-500/10 border-red-500 text-red-400'
                        : 'bg-[#0d1117] border-[#30363d] text-[#8b949e] hover:text-[#f0f6fc]'
                    }`}
                  >
                    ปิดสอบ (Closed)
                  </button>
                </div>
              </div>

              {/* Time Limit */}
              <div className="flex flex-col gap-2">
                <label className="font-sans text-xs font-semibold text-[#8b949e]">เวลาในการทำสอบ (นาที) (Time Limit)</label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    max="180"
                    value={examSettings.timeLimit}
                    onChange={(e) => {
                      const val = Math.max(1, parseInt(e.target.value, 10) || 45);
                      onUpdateExamSettings({ ...examSettings, timeLimit: val });
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0d1117] border border-[#30363d] text-xs font-mono text-[#f0f6fc] outline-none focus:border-[#d4af37]"
                  />
                  <span className="absolute right-3.5 top-2.5 text-[10px] font-sans text-[#8b949e]">นาที</span>
                </div>
              </div>

              {/* Score Visibility */}
              <div className="flex flex-col gap-2">
                <label className="font-sans text-xs font-semibold text-[#8b949e]">แสดงคะแนนสอบทันที (Score Visibility)</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => onUpdateExamSettings({ ...examSettings, scoreVisibility: true })}
                    className={`flex-1 py-2 rounded-xl font-sans text-xs font-bold transition-all border cursor-pointer ${
                      examSettings.scoreVisibility
                        ? 'bg-[#d4af37]/10 border-[#d4af37] text-[#d4af37]'
                        : 'bg-[#0d1117] border-[#30363d] text-[#8b949e] hover:text-[#f0f6fc]'
                    }`}
                  >
                    เปิด (Enable)
                  </button>
                  <button
                    type="button"
                    onClick={() => onUpdateExamSettings({ ...examSettings, scoreVisibility: false })}
                    className={`flex-1 py-2 rounded-xl font-sans text-xs font-bold transition-all border cursor-pointer ${
                      !examSettings.scoreVisibility
                        ? 'bg-red-500/10 border-red-500 text-red-400'
                        : 'bg-[#0d1117] border-[#30363d] text-[#8b949e] hover:text-[#f0f6fc]'
                    }`}
                  >
                    ปิด (Disable)
                  </button>
                </div>
              </div>

              {/* Answer Key Visibility */}
              <div className="flex flex-col gap-2">
                <label className="font-sans text-xs font-semibold text-[#8b949e]">แสดงเฉลยข้อถูก-ผิด (Answer Key)</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => onUpdateExamSettings({ ...examSettings, answerKeyVisibility: true })}
                    className={`flex-1 py-2 rounded-xl font-sans text-xs font-bold transition-all border cursor-pointer ${
                      examSettings.answerKeyVisibility
                        ? 'bg-[#d4af37]/10 border-[#d4af37] text-[#d4af37]'
                        : 'bg-[#0d1117] border-[#30363d] text-[#8b949e] hover:text-[#f0f6fc]'
                    }`}
                  >
                    เปิด (Enable)
                  </button>
                  <button
                    type="button"
                    onClick={() => onUpdateExamSettings({ ...examSettings, answerKeyVisibility: false })}
                    className={`flex-1 py-2 rounded-xl font-sans text-xs font-bold transition-all border cursor-pointer ${
                      !examSettings.answerKeyVisibility
                        ? 'bg-red-500/10 border-red-500 text-red-400'
                        : 'bg-[#0d1117] border-[#30363d] text-[#8b949e] hover:text-[#f0f6fc]'
                    }`}
                  >
                    ปิด (Disable)
                  </button>
                </div>
              </div>
            </div>

            {/* Exam Audience Targeting */}
            <div className="bg-[#0d1117] border border-[#30363d] p-4 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h5 className="font-sans font-bold text-xs text-[#f0f6fc]">สิทธิ์ห้องเรียนสำหรับเข้าสอบ (Target Classrooms)</h5>
                <p className="font-sans text-[11px] text-[#8b949e] mt-0.5">นักเรียนห้องที่เลือกเท่านั้นที่จะสามารถเห็นและเริ่มทำข้อสอบป้อนเข้ามาได้</p>
              </div>
              <div className="flex flex-wrap gap-4">
                {['ทั้งหมด', ...listClassrooms].map((cls) => {
                  const isChecked = examSettings.targetClassrooms.includes(cls);
                  return (
                    <label key={cls} className="flex items-center gap-2 text-xs font-sans text-[#f0f6fc] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => {
                          let nextTarget = [...examSettings.targetClassrooms];
                          if (cls === 'ทั้งหมด') {
                            if (e.target.checked) {
                              nextTarget = ['ทั้งหมด'];
                            } else {
                              nextTarget = [];
                            }
                          } else {
                            nextTarget = nextTarget.filter(x => x !== 'ทั้งหมด');
                            if (e.target.checked) {
                              nextTarget.push(cls);
                            } else {
                              nextTarget = nextTarget.filter(x => x !== cls);
                            }
                            if (nextTarget.length === 0) {
                              nextTarget = ['ทั้งหมด'];
                            }
                          }
                          onUpdateExamSettings({ ...examSettings, targetClassrooms: nextTarget });
                        }}
                        className="rounded border-[#30363d] bg-[#0d1117] text-[#d4af37] focus:ring-0 focus:ring-offset-0 cursor-pointer accent-[#d4af37]"
                      />
                      <span>{cls === 'ทั้งหมด' ? 'ทั้งหมด (ทุกห้องเรียน)' : `ห้อง ม.${cls.replace('M.', '')}`}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Excel/CSV Exam Importer with Auto-Sorting */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 bg-[#161b22] border border-[#30363d] p-6 rounded-2xl">
            <div className="lg:col-span-2 flex flex-col gap-4">
              <h4 className="font-sans font-bold text-sm text-[#f0f6fc] flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-[#d4af37]" />
                <span>เครื่องมือนำเข้าข้อสอบผ่านไฟล์ Excel / CSV (Excel Exam Importer)</span>
              </h4>
              <p className="font-sans text-xs text-[#8b949e] leading-relaxed">
                อัปโหลดไฟล์ตารางเพื่อเพิ่มโจทย์ข้อสอบจำนวนมากในครั้งเดียว ระบบจะทำการตรวจสอบความถูกต้องของรูปแบบคอลัมน์ และจัดเรียงคำถามโดยอัตโนมัติ (Auto-sorting) ตามเกณฑ์ที่คุณเลือกด้านล่าง
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div className="flex flex-col gap-1.5">
                  <label className="font-sans text-xs font-semibold text-[#8b949e]">เลือกเกณฑ์จัดเรียงอัตโนมัติ (Auto-Sorting Criterion)</label>
                  <select 
                    value={examSortBy} 
                    onChange={(e) => setExamSortBy(e.target.value as any)}
                    className="px-3.5 py-2.5 rounded-xl bg-[#0d1117] border border-[#30363d] text-xs font-sans text-[#f0f6fc] outline-none cursor-pointer"
                  >
                    <option value="number">จัดเรียงตามลำดับข้อสอบ (Question Number)</option>
                    <option value="category">จัดเรียงตามระดับชั้น / หมวดหมู่เนื้อหา (Content Category)</option>
                    <option value="difficulty">จัดเรียงตามระดับความยากง่าย (Difficulty Level)</option>
                  </select>
                </div>

                <div className="flex flex-col justify-end">
                  <button 
                    type="button"
                    onClick={handleDownloadSampleCSV}
                    className="flex items-center justify-center gap-2 py-2.5 px-4 bg-[#0d1117] hover:bg-[#1e232b] text-[#d4af37] border border-[#30363d] hover:border-[#d4af37]/30 rounded-xl font-sans text-xs font-bold transition-all cursor-pointer"
                  >
                    <FileDown className="w-4 h-4" />
                    <span>ดาวน์โหลดเทมเพลตไฟล์ตัวอย่าง (.csv)</span>
                  </button>
                </div>
              </div>

              {/* Drag and drop zone */}
              <div 
                onDragOver={(e) => { e.preventDefault(); setIsExamDragging(true); }}
                onDragLeave={() => setIsExamDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsExamDragging(false);
                  const file = e.dataTransfer.files?.[0];
                  if (file) {
                    if (file.name.endsWith('.csv')) {
                      handleImportCSV(file);
                    } else {
                      alert("ขออภัย! ระบบรองรับเฉพาะไฟล์นามสกุล .csv เท่านั้นสำหรับการประมวลผลข้อความผ่านเว็บเบราว์เซอร์อย่างปลอดภัย");
                    }
                  }
                }}
                className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center transition-all cursor-pointer ${
                  isExamDragging 
                    ? 'border-[#d4af37] bg-[#d4af37]/5' 
                    : 'border-[#30363d] hover:border-[#d4af37]/50 bg-[#0d1117]/30'
                }`}
              >
                <input 
                  type="file" 
                  accept=".csv"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImportCSV(file);
                  }}
                  id="csv-file-input"
                  className="hidden"
                />
                <label htmlFor="csv-file-input" className="cursor-pointer flex flex-col items-center gap-2 w-full h-full">
                  <FileUp className="w-10 h-10 text-[#8b949e]" />
                  <span className="font-sans text-xs font-bold text-[#f0f6fc]">คลิกเพื่อเลือกไฟล์ หรือ ลากไฟล์ CSV มาวางที่นี่</span>
                  <span className="font-sans text-[10px] text-[#8b949e]">รองรับการเข้ารหัส UTF-8 และข้อความภาษาไทยอย่างสมบูรณ์</span>
                </label>
              </div>
            </div>

            {/* Validation Checklist Sidebar */}
            <div className="bg-[#0d1117] border border-[#30363d] p-5 rounded-xl flex flex-col gap-3">
              <h5 className="font-sans font-bold text-xs text-[#d4af37]">กฎระเบียบและข้อกำหนดข้อมูล</h5>
              <ul className="list-disc pl-4 text-[10px] text-[#8b949e] flex flex-col gap-1.5 leading-relaxed">
                <li>รองรับเฉพาะไฟล์ข้อมูลนามสกุล .csv เท่านั้น</li>
                <li>ชื่อคอลัมน์แรกต้องเป็น "ข้อที่" หรือลำดับคำถาม</li>
                <li>ต้องมีคอลัมน์ เฉลย เป็นภาษาอังกฤษ (A-D) หรือภาษาไทย (ก-ง)</li>
                <li>รองรับการเข้ารหัสอักขระภาษาไทย (UTF-8)</li>
              </ul>
            </div>
          </div>
        </div>
      )}
      {/* ----------------- TAB 5: REGISTERED USERS (USER MANAGEMENT) ----------------- */}
      {activeAdminTab === 'users' && (
        <div className="flex flex-col gap-6 select-text animate-in fade-in duration-200">
          <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 flex flex-col gap-4">
            <h3 className="font-sans font-bold text-base text-[#f0f6fc] border-b border-[#30363d] pb-3 flex items-center gap-2">
              <Users className="w-5 h-5 text-[#d4af37]" />
              <span>👥 จัดการสิทธิ์รายชื่อผู้ใช้ที่ลงทะเบียน ({registeredUsers.length} คน)</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {registeredUsers.length > 0 ? (
                registeredUsers.map((user, idx) => (
                  <div key={idx} className="bg-[#0d1117] border border-[#30363d] p-4 rounded-xl flex justify-between items-center hover:border-yellow-500/10 transition-all">
                    <div>
                      <h4 className="font-sans font-bold text-xs text-[#f0f6fc]">{user.name}</h4>
                      <div className="flex gap-3 text-[10px] text-[#8b949e] mt-1 font-sans">
                        <span>รหัส: <span className="text-[#f0f6fc] font-mono">{user.studentId}</span></span>
                        <span>•</span>
                        <span>ห้อง: <span className="text-[#f0f6fc] font-mono">{user.classroom}</span></span>
                      </div>
                      <span className="font-mono text-[9px] text-[#8b949e] block mt-0.5 select-all">{user.email}</span>
                    </div>

                    <button 
                      onClick={() => handleDeleteStudentAccount(user.email)}
                      className="py-1 px-2.5 bg-red-600/10 hover:bg-red-600/20 text-red-400 hover:text-red-500 border border-[#30363d] hover:border-red-500/20 rounded-lg font-sans text-[10px] font-bold cursor-pointer transition-all"
                    >
                      ลบบัญชี
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-[#8b949e] font-sans text-xs col-span-full">
                  ยังไม่มีนักเรียนสมัครสมาชิกเข้ามาใช้งานเพิ่มเติมในปัจจุบัน (ใช้นักเรียนจำลองพื้นฐานอยู่)
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ----------------- TAB 6: SITE SETTINGS ----------------- */}
      {activeAdminTab === 'settings' && (
        <div className="flex flex-col lg:flex-row gap-8 select-text animate-in fade-in duration-200">
          
          {/* Site Configuration form */}
          <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 flex flex-col gap-4 flex-1 h-fit">
            <h3 className="font-sans font-bold text-base text-[#f0f6fc] border-b border-[#30363d] pb-3">ปรับปรุงข้อมูลเว็บไซต์และประกาศ</h3>
            
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="font-sans text-xs font-semibold text-[#8b949e]">ชื่อระบบหรือชื่อโรงเรียน (Web Title)</label>
                <input 
                  type="text" 
                  value={siteTitle} 
                  onChange={(e) => onUpdateSiteTitle(e.target.value)}
                  className="px-3.5 py-2 rounded-xl bg-[#0d1117] border border-[#30363d] text-xs font-sans text-[#f0f6fc] outline-none focus:border-[#d4af37]"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-sans text-xs font-semibold text-[#8b949e]">ข้อความประกาศทั่วไปของรายวิชา (Site Announcement)</label>
                <textarea 
                  rows={4}
                  value={announcement} 
                  onChange={(e) => onUpdateAnnouncement(e.target.value)}
                  className="px-3.5 py-2 rounded-xl bg-[#0d1117] border border-[#30363d] text-xs font-sans text-[#f0f6fc] outline-none focus:border-[#d4af37] resize-none leading-relaxed"
                />
              </div>

              {/* Media & Branding Upload System */}
              <div className="border-t border-[#30363d] pt-5 mt-2 flex flex-col gap-4">
                <h4 className="font-sans font-bold text-xs text-[#d4af37] tracking-wider uppercase">อัปโหลดสื่อและโลโก้องค์กร (Branding & Logo)</h4>
                
                {/* 1. School Logo */}
                <div className="flex flex-col sm:flex-row items-center gap-4 bg-[#0d1117] p-4 rounded-xl border border-[#30363d]">
                  <div className="w-16 h-16 rounded-xl bg-[#161b22] border border-[#30363d] flex items-center justify-center p-2 shrink-0">
                    <img 
                      src={schoolLogo} 
                      alt="School Logo Current" 
                      className={`w-full h-full object-contain rounded-lg ${
                        (!schoolLogo || schoolLogo.includes('lh3.googleusercontent.com')) ? 'invert brightness-0' : ''
                      }`}
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="flex-grow text-center sm:text-left">
                    <h5 className="font-sans font-bold text-xs text-[#f0f6fc]">ตราประจำโรงเรียน (School Crest/Logo)</h5>
                    <p className="font-sans text-[10px] text-[#8b949e] mt-1 leading-relaxed">รองรับไฟล์ .png, .jpg, .jpeg ขนาดสูงสุด 2MB โดยโลโก้นี้จะแสดงบนแผงควบคุมหลัก, หน้าลงทะเบียน และรายงานสรุปทั้งหมด</p>
                    <div className="mt-2">
                      <label className="inline-block py-1.5 px-3 bg-[#d4af37] hover:bg-[#aa8e2d] text-[#0a0c10] rounded-lg font-sans text-[10px] font-bold cursor-pointer transition-colors select-none">
                        เลือกไฟล์โลโก้ใหม่
                        <input 
                          type="file" 
                          accept="image/png, image/jpeg, image/jpg" 
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              if (file.size > 2 * 1024 * 1024) {
                                alert("ขออภัย! ขนาดของไฟล์รูปตราโรงเรียนต้องไม่เกิน 2MB เพื่อประสิทธิภาพของระบบ");
                                return;
                              }
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                if (onUpdateSchoolLogo) {
                                  onUpdateSchoolLogo(reader.result as string);
                                  alert("อัปโหลดและอัปเดตโลโก้แบรนด์ของโรงเรียนเสร็จสิ้น!");
                                }
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                          className="hidden" 
                        />
                      </label>
                    </div>
                  </div>
                </div>

                {/* 2. Admin Profile Pic */}
                <div className="flex flex-col sm:flex-row items-center gap-4 bg-[#0d1117] p-4 rounded-xl border border-[#30363d]">
                  <div className="w-16 h-16 rounded-full overflow-hidden border border-[#d4af37] p-0.5 bg-[#161b22] shrink-0">
                    <img 
                      src={profilePic} 
                      alt="Admin Profile Current" 
                      className="w-full h-full object-cover rounded-full"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="flex-grow text-center sm:text-left">
                    <h5 className="font-sans font-bold text-xs text-[#f0f6fc]">รูปภาพโปรไฟล์แอดมิน (Admin Profile Picture)</h5>
                    <p className="font-sans text-[10px] text-[#8b949e] mt-1 leading-relaxed">รองรับไฟล์ .png, .jpg, .jpeg สูงสุด 2MB สำหรับแสดงอัตลักษณ์บัญชีผู้ใช้ของคุณในการประเมินผลคะแนน</p>
                    <div className="mt-2">
                      <label className="inline-block py-1.5 px-3 bg-[#d4af37] hover:bg-[#aa8e2d] text-[#0a0c10] rounded-lg font-sans text-[10px] font-bold cursor-pointer transition-colors select-none">
                        เลือกไฟล์รูปใหม่
                        <input 
                          type="file" 
                          accept="image/png, image/jpeg, image/jpg" 
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              if (file.size > 2 * 1024 * 1024) {
                                alert("ขออภัย! ขนาดรูปภาพต้องไม่เกิน 2MB");
                                return;
                              }
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                if (onUpdateProfilePic) {
                                  onUpdateProfilePic(reader.result as string);
                                  alert("เปลี่ยนรูปโปรไฟล์ของคุณเสร็จสิ้น!");
                                }
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                          className="hidden" 
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-[#0d1117] p-3.5 rounded-xl border border-[#30363d] flex gap-3 text-[#d4af37] text-xs font-sans">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <p className="leading-snug">การบันทึกการตั้งค่าข้อมูลระบบเว็บไซต์และแถบประกาศด้านบนจะส่งผลทันทีกับหน้าจอเข้าสู่ระบบ หน้า Dashboard และแผงข้างของกลุ่มเป้าหมายนักเรียนทุกคน</p>
              </div>
            </div>
          </div>

          {/* Classroom Management Card */}
          <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 flex flex-col gap-4 flex-1 h-fit">
            <h3 className="font-sans font-bold text-base text-[#f0f6fc] border-b border-[#30363d] pb-3 flex items-center gap-2">
              <School className="w-5 h-5 text-[#d4af37]" />
              <span>🏢 จัดการห้องเรียนหลักสูตร (Classroom Manager)</span>
            </h3>

            <p className="font-sans text-xs text-[#8b949e] leading-relaxed">
              ผู้ควบคุมระบบ/คุณครูผู้สอนสามารถเพิ่ม แก้ไขชื่อ หรือลบห้องเรียนปลายทางได้อย่างอิสระ ห้องเรียนที่ป้อนเข้ามาใหม่จะทำการซิงค์ (Sync) อัตโนมัติไปยังเมนูตัวเลือกลงทะเบียนนักเรียนโดยตรง
            </p>

            {/* List classrooms with action buttons */}
            <div className="flex flex-col gap-2 mt-2">
              {listClassrooms.map((cls, idx) => (
                <div key={idx} className="flex justify-between items-center bg-[#0d1117] border border-[#30363d] py-2.5 px-4 rounded-xl">
                  {editingClassroomIndex === idx ? (
                    <div className="flex items-center gap-2 w-full">
                      <input 
                        type="text"
                        value={editingClassroomName}
                        onChange={(e) => setEditingClassroomName(e.target.value)}
                        className="px-2 py-1 rounded bg-[#161b22] border border-[#d4af37] text-xs font-sans text-[#f0f6fc] outline-none flex-grow"
                      />
                      <button 
                        type="button"
                        onClick={() => handleSaveEditClassroom(idx)}
                        className="py-1 px-3 bg-green-600 hover:bg-green-700 text-white rounded font-sans text-[10px] font-bold border-0 cursor-pointer"
                      >
                        บันทึก
                      </button>
                      <button 
                        type="button"
                        onClick={() => setEditingClassroomIndex(null)}
                        className="py-1 px-3 bg-[#161b22] hover:bg-[#30363d] text-[#8b949e] rounded font-sans text-[10px] font-bold border border-[#30363d] cursor-pointer"
                      >
                        ยกเลิก
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-[#d4af37]"></div>
                        <span className="font-sans font-bold text-xs text-[#f0f6fc]">ชั้นมัธยมศึกษาปีที่ {cls}</span>
                        <span className="font-mono text-[9px] text-[#8b949e] bg-[#161b22] border border-[#30363d] px-1.5 py-0.5 rounded">
                          นักเรียน: {students.filter(s => s.classroom === cls).length} คน
                        </span>
                      </div>
                      <div className="flex gap-1.5">
                        <button 
                          type="button"
                          onClick={() => handleStartEditClassroom(idx, cls)}
                          className="p-1 hover:bg-[#161b22] rounded text-[#8b949e] hover:text-[#d4af37] cursor-pointer border-0 bg-transparent"
                          title="แก้ไขชื่อห้องเรียน"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          type="button"
                          onClick={() => handleDeleteClassroom(cls)}
                          className="p-1 hover:bg-[#161b22] rounded text-red-400 hover:text-red-500 cursor-pointer border-0 bg-transparent"
                          title="ลบห้องเรียน"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>

            {/* Form to add classroom */}
            <form onSubmit={handleAddClassroomSubmit} className="flex gap-2 border-t border-[#30363d] pt-4 mt-2">
              <input 
                type="text"
                placeholder="เช่น ม.4/1 หรือ ม.1/4..."
                value={newClassroomName}
                onChange={(e) => setNewClassroomName(e.target.value)}
                className="flex-grow px-3.5 py-2.5 rounded-xl bg-[#0d1117] border border-[#30363d] text-xs font-sans text-[#f0f6fc] focus:border-[#d4af37] outline-none"
              />
              <button 
                type="submit"
                className="py-2.5 px-4 bg-[#d4af37] hover:bg-[#aa8e2d] text-[#0a0c10] font-sans text-xs font-bold rounded-xl transition-all border-0 cursor-pointer shrink-0"
              >
                เพิ่มห้องเรียน
              </button>
            </form>
          </div>

        </div>
      )}

      {/* ----------------- MODAL: EDIT STUDENT GRADES ----------------- */}
      {editingStudent && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <form 
            onSubmit={handleSaveGrades}
            className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 md:p-8 max-w-md w-full shadow-2xl flex flex-col gap-5 select-none text-[#f0f6fc]"
          >
            <div className="flex justify-between items-center border-b border-[#30363d] pb-3">
              <div>
                <h4 className="font-sans font-bold text-base text-[#f0f6fc]">ประเมินผลการเรียนนักเรียน</h4>
                <p className="font-sans text-xs text-[#8b949e] mt-0.5">เลขประจำตัว: {editingStudent.id} • {editingStudent.name}</p>
              </div>
              <button 
                type="button" 
                onClick={() => setEditingStudent(null)}
                className="p-1 text-[#8b949e] hover:text-[#f0f6fc] rounded-full hover:bg-[#0d1117] cursor-pointer border-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col gap-4 py-2">
              <div className="grid grid-cols-2 items-center gap-4">
                <label htmlFor="assg1" className="font-sans text-xs font-semibold text-[#8b949e]">ใบงานที่ 1 (คะแนนเต็ม 20)</label>
                <input 
                  id="assg1"
                  type="number"
                  min="0"
                  max="20"
                  value={assg1Val}
                  onChange={(e) => setAssg1Val(e.target.value)}
                  className="px-3 py-1.5 rounded-lg bg-[#0d1117] border border-[#30363d] font-mono text-sm text-right text-[#f0f6fc] focus:border-[#d4af37] outline-none"
                  placeholder="ยังไม่ได้บันทึก"
                />
              </div>

              <div className="grid grid-cols-2 items-center gap-4">
                <label htmlFor="assg2" className="font-sans text-xs font-semibold text-[#8b949e]">ใบงานที่ 2 (คะแนนเต็ม 30)</label>
                <input 
                  id="assg2"
                  type="number"
                  min="0"
                  max="30"
                  value={assg2Val}
                  onChange={(e) => setAssg2Val(e.target.value)}
                  className="px-3 py-1.5 rounded-lg bg-[#0d1117] border border-[#30363d] font-mono text-sm text-right text-[#f0f6fc] focus:border-[#d4af37] outline-none"
                  placeholder="ยังไม่ได้บันทึก"
                />
              </div>

              <div className="grid grid-cols-2 items-center gap-4">
                <label htmlFor="midterm" className="font-sans text-xs font-semibold text-[#8b949e]">สอบกลางภาค (คะแนนเต็ม 50)</label>
                <input 
                  id="midterm"
                  type="number"
                  min="0"
                  max="50"
                  value={midtermVal}
                  onChange={(e) => setMidtermVal(e.target.value)}
                  className="px-3 py-1.5 rounded-lg bg-[#0d1117] border border-[#30363d] font-mono text-sm text-right text-[#f0f6fc] focus:border-[#d4af37] outline-none"
                  placeholder="ยังไม่ได้บันทึก"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-2 pt-2 border-t border-[#30363d]">
              <button
                type="button"
                onClick={() => setEditingStudent(null)}
                className="py-2.5 border border-[#30363d] hover:border-[#d4af37] text-[#8b949e] hover:text-[#f0f6fc] rounded-xl font-sans text-xs font-semibold transition-colors cursor-pointer bg-transparent"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                className="py-2.5 bg-[#d4af37] hover:bg-[#aa8e2d] text-[#0a0c10] rounded-xl font-sans text-xs font-semibold transition-colors shadow-sm cursor-pointer border-0"
              >
                บันทึกผลการเรียน
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ----------------- MODAL: ADD LESSON ----------------- */}
      {showAddLessonModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <form 
            onSubmit={handleAddLesson}
            className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 md:p-8 max-w-md w-full shadow-2xl flex flex-col gap-5 select-none text-[#f0f6fc]"
          >
            <div className="flex justify-between items-center border-b border-[#30363d] pb-3">
              <h4 className="font-sans font-bold text-base text-[#f0f6fc]">เพิ่มหัวข้อวิดีโอ/สารบัญบทเรียนใหม่</h4>
              <button 
                type="button" 
                onClick={() => setShowAddLessonModal(false)}
                className="p-1 text-[#8b949e] hover:text-[#f0f6fc] rounded-full hover:bg-[#0d1117] cursor-pointer border-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col gap-4 py-2">
              <div className="flex flex-col gap-1.5">
                <label className="font-sans text-xs font-semibold text-[#8b949e]">ชื่อหัวข้อบทเรียนภาษาไทย</label>
                <input 
                  type="text"
                  value={lessonTitle}
                  onChange={(e) => setLessonTitle(e.target.value)}
                  placeholder="เช่น บทเรียนที่ 1.4 ปัญญาประดิษฐ์และอนาคตวิทยาการ"
                  className="px-3 py-2 rounded-lg bg-[#0d1117] border border-[#30363d] text-xs font-sans text-[#f0f6fc] focus:border-[#d4af37] outline-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-sans text-xs font-semibold text-[#8b949e]">ชนิดบทเรียน</label>
                <select 
                  value={lessonType}
                  onChange={(e) => setLessonType(e.target.value as any)}
                  className="px-3 py-2 rounded-lg bg-[#0d1117] border border-[#30363d] text-xs font-sans text-[#f0f6fc] outline-none"
                >
                  <option value="Video">Video (วิดีโอนำเสนอคอมพิวเตอร์)</option>
                  <option value="Reading">Reading (อ่านประเมินเอกสารสไลด์)</option>
                  <option value="Assignment">Assignment (ส่งการบ้าน/ใบงาน)</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-sans text-xs font-semibold text-[#8b949e]">ความยาวบทเรียน</label>
                <input 
                  type="text"
                  value={lessonDuration}
                  onChange={(e) => setLessonDuration(e.target.value)}
                  placeholder="เช่น 35m หรือ 1h"
                  className="px-3 py-2 rounded-lg bg-[#0d1117] border border-[#30363d] text-xs font-sans text-[#f0f6fc] focus:border-[#d4af37] outline-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-sans text-xs font-semibold text-[#8b949e]">ห้องเรียนเป้าหมาย (Target Classrooms)</label>
                <div className="flex flex-wrap gap-4 p-3 bg-[#0d1117] border border-[#30363d] rounded-xl">
                  {['ทั้งหมด', ...listClassrooms].map((cls) => {
                    const isChecked = lessonTargetClassrooms.includes(cls);
                    return (
                      <label key={cls} className="flex items-center gap-2 text-xs font-sans text-[#f0f6fc] cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            if (cls === 'ทั้งหมด') {
                              if (e.target.checked) {
                                setLessonTargetClassrooms(['ทั้งหมด']);
                              } else {
                                setLessonTargetClassrooms([]);
                              }
                            } else {
                              let next = [...lessonTargetClassrooms].filter(x => x !== 'ทั้งหมด');
                              if (e.target.checked) {
                                next.push(cls);
                              } else {
                                next = next.filter(x => x !== cls);
                              }
                              if (next.length === 0) {
                                next = ['ทั้งหมด'];
                              }
                              setLessonTargetClassrooms(next);
                            }
                          }}
                          className="rounded border-[#30363d] bg-[#0d1117] text-[#d4af37] focus:ring-0 focus:ring-offset-0 cursor-pointer accent-[#d4af37]"
                        />
                        <span>{cls === 'ทั้งหมด' ? 'ทั้งหมด (ทุกห้องเรียน)' : `ห้อง ม.${cls.replace('M.', '')}`}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-2 pt-2 border-t border-[#30363d]">
              <button
                type="button"
                onClick={() => setShowAddLessonModal(false)}
                className="py-2.5 border border-[#30363d] hover:border-[#d4af37] text-[#8b949e] hover:text-[#f0f6fc] rounded-xl font-sans text-xs font-semibold transition-colors cursor-pointer bg-transparent"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                className="py-2.5 bg-[#d4af37] hover:bg-[#aa8e2d] text-[#0a0c10] rounded-xl font-sans text-xs font-semibold transition-colors shadow-sm cursor-pointer border-0"
              >
                บันทึกบทเรียน
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ----------------- MODAL: ADD EXAM QUESTION ----------------- */}
      {showAddExamModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <form 
            onSubmit={handleAddExamQuestion}
            className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 md:p-8 max-w-lg w-full shadow-2xl flex flex-col gap-5 select-none text-[#f0f6fc]"
          >
            <div className="flex justify-between items-center border-b border-[#30363d] pb-3">
              <h4 className="font-sans font-bold text-base text-[#f0f6fc]">เพิ่มโจทย์ข้อสอบวิทยาการคำนวณ</h4>
              <button 
                type="button" 
                onClick={() => setShowAddExamModal(false)}
                className="p-1 text-[#8b949e] hover:text-[#f0f6fc] rounded-full hover:bg-[#0d1117] cursor-pointer border-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col gap-3.5 py-1">
              <div className="flex flex-col gap-1">
                <label className="font-sans text-xs font-semibold text-[#8b949e]">โจทย์คำถามภาษาไทย</label>
                <textarea 
                  rows={2}
                  value={examText}
                  onChange={(e) => setExamText(e.target.value)}
                  placeholder="เช่น ข้อใดเป็นภาษาประเภทสคริปต์คอมพิวเตอร์?"
                  className="px-3 py-2 rounded-lg bg-[#0d1117] border border-[#30363d] text-xs font-sans text-[#f0f6fc] focus:border-[#d4af37] outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="font-sans text-[10px] font-semibold text-[#8b949e]">ตัวเลือก A</label>
                  <input type="text" value={optA} onChange={(e) => setOptA(e.target.value)} className="px-3 py-1.5 rounded-lg bg-[#0d1117] border border-[#30363d] text-xs font-sans text-[#f0f6fc] outline-none" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-sans text-[10px] font-semibold text-[#8b949e]">ตัวเลือก B</label>
                  <input type="text" value={optB} onChange={(e) => setOptB(e.target.value)} className="px-3 py-1.5 rounded-lg bg-[#0d1117] border border-[#30363d] text-xs font-sans text-[#f0f6fc] outline-none" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-sans text-[10px] font-semibold text-[#8b949e]">ตัวเลือก C</label>
                  <input type="text" value={optC} onChange={(e) => setOptC(e.target.value)} className="px-3 py-1.5 rounded-lg bg-[#0d1117] border border-[#30363d] text-xs font-sans text-[#f0f6fc] outline-none" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-sans text-[10px] font-semibold text-[#8b949e]">ตัวเลือก D</label>
                  <input type="text" value={optD} onChange={(e) => setOptD(e.target.value)} className="px-3 py-1.5 rounded-lg bg-[#0d1117] border border-[#30363d] text-xs font-sans text-[#f0f6fc] outline-none" />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-sans text-xs font-semibold text-[#8b949e]">คำตอบที่ถูกต้องเฉลย (Correct Key)</label>
                <select 
                  value={correctAns}
                  onChange={(e) => setCorrectAns(e.target.value)}
                  className="px-3 py-1.5 rounded-lg bg-[#0d1117] border border-[#30363d] text-xs font-sans text-[#f0f6fc]"
                >
                  <option value="A">ช้อยส์ A</option>
                  <option value="B">ช้อยส์ B</option>
                  <option value="C">ช้อยส์ C</option>
                  <option value="D">ช้อยส์ D</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-1 pt-2 border-t border-[#30363d]">
              <button
                type="button"
                onClick={() => setShowAddExamModal(false)}
                className="py-2.5 border border-[#30363d] hover:border-[#d4af37] text-[#8b949e] hover:text-[#f0f6fc] rounded-xl font-sans text-xs font-semibold transition-colors cursor-pointer bg-transparent"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                className="py-2.5 bg-[#d4af37] hover:bg-[#aa8e2d] text-[#0a0c10] rounded-xl font-sans text-xs font-semibold transition-colors shadow-sm cursor-pointer border-0"
              >
                บันทึกข้อสอบ
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ----------------- MODAL: SCORE EXPORT ----------------- */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 md:p-8 max-w-md w-full shadow-2xl flex flex-col gap-5 select-none text-[#f0f6fc]">
            <div className="flex justify-between items-center border-b border-[#30363d] pb-3">
              <h4 className="font-sans font-bold text-base text-[#f0f6fc] flex items-center gap-2">
                <FileDown className="w-5 h-5 text-[#d4af37]" />
                <span>ดาวน์โหลดและส่งออกคะแนนสอบ</span>
              </h4>
              <button 
                type="button" 
                onClick={() => setShowExportModal(false)}
                className="p-1 text-[#8b949e] hover:text-[#f0f6fc] rounded-full hover:bg-[#0d1117] cursor-pointer border-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col gap-4 py-2">
              {/* 1. Classroom Selector */}
              <div className="flex flex-col gap-1.5">
                <label className="font-sans text-xs font-semibold text-[#8b949e]">ห้องเรียนที่ต้องการส่งออก (Classroom)</label>
                <select 
                  value={exportClassroom}
                  onChange={(e) => setExportClassroom(e.target.value)}
                  className="px-3 py-2 rounded-lg bg-[#0d1117] border border-[#30363d] text-xs font-sans text-[#f0f6fc] outline-none"
                >
                  <option value="ทั้งหมด">ทั้งหมด (ทุกห้องเรียน)</option>
                  {listClassrooms.map((cls) => (
                    <option key={cls} value={cls}>
                      ชั้นมัธยมศึกษาปีที่ {cls}
                    </option>
                  ))}
                </select>
              </div>

              {/* 2. Score Type Selector */}
              <div className="flex flex-col gap-1.5">
                <label className="font-sans text-xs font-semibold text-[#8b949e]">ประเภทคะแนนสารสนเทศ (Score Type)</label>
                <select 
                  value={exportScoreType}
                  onChange={(e) => setExportScoreType(e.target.value as any)}
                  className="px-3 py-2 rounded-lg bg-[#0d1117] border border-[#30363d] text-xs font-sans text-[#f0f6fc] outline-none"
                >
                  <option value="assignment">คะแนนเก็บและใบงานสะสม (Assignment/Collectible Scores)</option>
                  <option value="exam">คะแนนสอบประเมินกลางภาค (Midterm Exam Scores)</option>
                </select>
              </div>

              {/* 3. Subject Topic Filter (visible if assignment selected) */}
              {exportScoreType === 'assignment' && (
                <div className="flex flex-col gap-1.5 animate-in slide-in-from-top-1 duration-150">
                  <label className="font-sans text-xs font-semibold text-[#8b949e]">หัวข้อเนื้อหาใบงาน (Subject/Topic Filter)</label>
                  <select 
                    value={exportTopic}
                    onChange={(e) => setExportTopic(e.target.value as any)}
                    className="px-3 py-2 rounded-lg bg-[#0d1117] border border-[#30363d] text-xs font-sans text-[#f0f6fc] outline-none"
                  >
                    <option value="all">ทั้งหมด (ใบงานที่ 1 และ 2)</option>
                    <option value="assg1">เฉพาะใบงานที่ 1 (เต็ม 20 คะแนน)</option>
                    <option value="assg2">เฉพาะใบงานที่ 2 (เต็ม 30 คะแนน)</option>
                  </select>
                </div>
              )}
            </div>

            {/* Explanatory text */}
            <div className="bg-[#0d1117] p-3 rounded-xl border border-[#30363d] text-[10px] text-[#8b949e] leading-relaxed">
              * ข้อมูลที่ส่งออกจะทำการจัดเรียงตาม <span className="text-[#d4af37] font-semibold">"เลขที่ (Attendance Number)"</span> ของนักเรียนแต่ละห้องเรียนให้อัตโนมัติ โดยรองรับทั้งรูปแบบสเปรดชีต Excel (CSV UTF-8) และรูปแบบรายงานเอกสารทางการพิมพ์ (PDF)
            </div>

            {/* Action buttons */}
            <div className="grid grid-cols-2 gap-3 mt-1 pt-2 border-t border-[#30363d]">
              <button
                type="button"
                onClick={handleExportCSVSubmit}
                className="flex items-center justify-center gap-1.5 py-2.5 bg-green-600/10 hover:bg-green-600/20 text-green-400 hover:text-green-300 border border-green-500/20 rounded-xl font-sans text-xs font-semibold transition-colors cursor-pointer"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>ส่งออก Excel (.csv)</span>
              </button>
              <button
                type="button"
                onClick={handleExportPDFSubmit}
                className="flex items-center justify-center gap-1.5 py-2.5 bg-red-600/10 hover:bg-red-600/20 text-red-400 hover:text-red-300 border border-red-500/20 rounded-xl font-sans text-xs font-semibold transition-colors cursor-pointer"
              >
                <FileText className="w-4 h-4" />
                <span>ดาวน์โหลดรายงาน PDF</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => setShowExportModal(false)}
              className="w-full py-2 border border-[#30363d] hover:border-[#d4af37] text-[#8b949e] hover:text-[#f0f6fc] rounded-xl font-sans text-xs font-semibold transition-colors cursor-pointer bg-transparent mt-1"
            >
              ยกเลิก
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
