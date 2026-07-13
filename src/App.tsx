import React, { useState, useEffect } from 'react';
import { School, X, LogOut, LayoutDashboard, BookOpen, GraduationCap, FileText } from 'lucide-react';
import { ViewType, UserRole, StudentGrade, AssignmentState, ExamState, ExamQuestion, Lesson, Worksheet, TeachingFile, ExamSettings } from './types';
import { INITIAL_STUDENTS, INITIAL_LESSONS, EXAM_QUESTIONS } from './data';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import LoginView from './components/LoginView';
import DashboardView from './components/DashboardView';
import CourseView from './components/CourseView';
import ExamView from './components/ExamView';
import GradesView from './components/GradesView';

// Firebase Imports
import { auth, db, storage, handleFirestoreError, OperationType } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  collection, 
  query, 
  where, 
  getDocs 
} from 'firebase/firestore';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';

const schoolLogoUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuDjqn3HC4TuXM8YGx5YF0iMBGjEymfzRKfh6dU4v5V5232SWFGDQ4bKLNhDcHjvpcwbuhhxGYx7LwSf6x3WfKV3B5FuRhpDbn-7BTA52h4rydheCGRXMngAwlqw1z65_WHfmQyHof5O2MXg3je8a3i41p-ctPGJbx_WUX02tE-DTGsQ_dx-TPeGoqgmgCZMWifVQDA1KTzbr0bOqL6SxgAZ-OU_98DQPx-SwyRYgB8Y6OORS4f7d26YezFKD-hmGaF55A5fgxF4rbs";

export default function App() {
  // Session States
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userEmail, setUserEmail] = useState<string>('student@soengsang.edu');
  const [role, setRole] = useState<UserRole>('student');
  const [currentView, setView] = useState<ViewType>('dashboard');

  // User Profile States
  const [userFullName, setUserFullName] = useState<string>('นักเรียน');
  const [studentId, setStudentId] = useState<string>('');
  const [classroom, setClassroom] = useState<string>('M.1/1');
  const [attendanceNo, setAttendanceNo] = useState<number>(0);

  // Database / Grade States
  const [students, setStudents] = useState<StudentGrade[]>([]);

  // Curriculum State
  const [lessons, setLessons] = useState<Lesson[]>([]);

  // Dynamic Exam Questions
  const [examQuestions, setExamQuestions] = useState<ExamQuestion[]>([]);

  // Worksheets
  const [worksheets, setWorksheets] = useState<Worksheet[]>([
    { id: '1', title: 'ใบงานที่ 1: ตรรกศาสตร์และประตูลอจิก (Logic Gates)', dueDate: 'วันศุกร์ที่ 27 ต.ค. เวลา 23:59 น.', points: 20 },
    { id: '2', title: 'ใบงานที่ 2: การพัฒนาขั้นตอนวิธีด้วยโปรแกรม Python', dueDate: 'วันอาทิตย์ที่ 5 พ.ย. เวลา 23:59 น.', points: 30 }
  ]);

  // Teaching Material Files
  const [teachingFiles, setTeachingFiles] = useState<TeachingFile[]>([
    { id: 'f1', name: 'คู่มือการเขียนภาษา Python เบื้องต้น.pdf', size: '2.45 MB', uploadedAt: '12 ต.ค. 2026' },
    { id: 'f2', name: 'สไลด์ประกอบการสอน_ลอจิกเกต.pptx', size: '5.12 MB', uploadedAt: '15 ต.ค. 2026' }
  ]);

  // Site Settings
  const [siteTitle, setSiteTitle] = useState<string>('ระบบจัดการเรียนรู้ (LMS) - โรงเรียนเสิงสาง');
  const [announcement, setAnnouncement] = useState<string>('ยินดีต้อนรับนักเรียนทุกคนเข้าสู่บทเรียนวิทยาการคอมพิวเตอร์และขั้นตอนวิธี! อย่าลืมเข้าทำแบบสอบถามฝึกหัดก่อนสัปดาห์สอบกลางภาคหลัก');

  // Media & Branding States
  const [schoolLogo, setSchoolLogo] = useState<string>(schoolLogoUrl);
  const [profilePics, setProfilePics] = useState<Record<string, string>>({});

  // Classrooms State
  const [classrooms, setClassrooms] = useState<string[]>(['M.1/1', 'M.1/2', 'M.1/3']);

  // Global Registered Users for fallback login checks
  const [registeredUsers, setRegisteredUsers] = useState<any[]>([]);

  // Homework Submission State
  const [assignment, setAssignment] = useState<AssignmentState>({
    fileName: null,
    fileSize: null,
    comment: '',
    status: 'Not Submitted'
  });

  // Practice Exam State
  const [exam, setExam] = useState<ExamState>({
    questions: EXAM_QUESTIONS,
    answers: {},
    currentQuestionIndex: 0,
    isFinished: false,
    timeLeft: 2700, // 45 minutes
    flaggedQuestions: {}
  });

  // Exam Settings State
  const [examSettings, setExamSettings] = useState<ExamSettings>({
    timeLimit: 45,
    scoreVisibility: true,
    answerKeyVisibility: true,
    isOpen: true,
    targetClassrooms: ['ทั้งหมด']
  });

  // Search filter
  const [searchQuery, setSearchQuery] = useState('');

  // Active Admin Sub-Tab
  const [activeAdminTab, setActiveAdminTab] = useState<'grades' | 'lessons' | 'exams' | 'files' | 'users' | 'settings'>('grades');

  // Mobile menu open
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Authorization Security Guard
  useEffect(() => {
    if (isLoggedIn && role === 'student' && currentView === 'grades') {
      alert("ขออภัย คุณไม่มีสิทธิ์เข้าใช้งานส่วนนี้");
      setView('dashboard');
    }
  }, [currentView, role, isLoggedIn]);

  // 1. Listen for user authentication state and load user profile from Firestore
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserEmail(user.email || '');
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const userSnap = await getDoc(userDocRef);
          
          if (userSnap.exists()) {
            const data = userSnap.data();
            setRole(data.role || 'student');
            setUserFullName(data.name || 'นักเรียน');
            setStudentId(data.studentId || '001');
            setClassroom(data.classroom || 'M.1/1');
            setAttendanceNo(data.attendanceNo || 0);
          } else {
            // Document doesn't exist yet (could be newly registered user or super admin)
            const isAdminEmail = user.email === 'saharat2@soengsang.ac.th';
            const userRole = isAdminEmail ? 'admin' : 'student';
            const initialProfile = {
              uid: user.uid,
              email: user.email || '',
              name: isAdminEmail ? 'อาจารย์สหรัฐ (Super Admin)' : 'นักเรียนใหม่',
              role: userRole,
              studentId: isAdminEmail ? 'ADMIN' : 'NEW',
              classroom: isAdminEmail ? 'ALL' : 'M.1/1',
              attendanceNo: 0,
              profilePicUrl: null,
              assg1: null,
              assg2: null,
              midterm: null,
              status: 'Incomplete'
            };
            await setDoc(userDocRef, initialProfile);
            setRole(initialProfile.role as UserRole);
            setUserFullName(initialProfile.name);
            setStudentId(initialProfile.studentId);
            setClassroom(initialProfile.classroom);
            setAttendanceNo(0);
          }
          setIsLoggedIn(true);
        } catch (err) {
          console.error("Error setting up user session from Firestore:", err);
          setIsLoggedIn(true); // fall back to session
        }
      } else {
        setIsLoggedIn(false);
        setRole('student');
        setUserEmail('');
        setUserFullName('นักเรียน');
        setStudentId('');
        setClassroom('M.1/1');
        setAttendanceNo(0);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  // 2. Load global site settings real-time from Firestore
  useEffect(() => {
    const unsubscribeGlobal = onSnapshot(doc(db, 'settings', 'global'), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setSiteTitle(data.siteTitle || 'ระบบจัดการเรียนรู้ (LMS) - โรงเรียนเสิงสาง');
        setAnnouncement(data.announcement || '');
        setSchoolLogo(data.schoolLogo || schoolLogoUrl);
      } else {
        // Seed initial site settings
        setDoc(doc(db, 'settings', 'global'), {
          siteTitle: 'ระบบจัดการเรียนรู้ (LMS) - โรงเรียนเสิงสาง',
          announcement: 'ยินดีต้อนรับนักเรียนทุกคนเข้าสู่บทเรียนวิทยาการคอมพิวเตอร์และขั้นตอนวิธี! อย่าลืมเข้าทำแบบสอบถามฝึกหัดก่อนสัปดาห์สอบกลางภาคหลัก',
          schoolLogo: schoolLogoUrl
        }).catch(err => console.error("Error seeding global settings:", err));
      }
    });

    return () => unsubscribeGlobal();
  }, []);

  // 3. Load classroom listings real-time
  useEffect(() => {
    const unsubscribeClassrooms = onSnapshot(doc(db, 'settings', 'classrooms'), (docSnap) => {
      if (docSnap.exists()) {
        setClassrooms(docSnap.data().list || ['M.1/1', 'M.1/2', 'M.1/3']);
      } else {
        setDoc(doc(db, 'settings', 'classrooms'), {
          list: ['M.1/1', 'M.1/2', 'M.1/3']
        }).catch(err => console.error("Error seeding classrooms:", err));
      }
    });

    return () => unsubscribeClassrooms();
  }, []);

  // 4. Load exam settings real-time
  useEffect(() => {
    const unsubscribeExamSettings = onSnapshot(doc(db, 'settings', 'exam'), (docSnap) => {
      if (docSnap.exists()) {
        setExamSettings(docSnap.data() as ExamSettings);
      } else {
        setDoc(doc(db, 'settings', 'exam'), {
          timeLimit: 45,
          scoreVisibility: true,
          answerKeyVisibility: true,
          isOpen: true,
          targetClassrooms: ['ทั้งหมด']
        }).catch(err => console.error("Error seeding exam settings:", err));
      }
    });

    return () => unsubscribeExamSettings();
  }, []);

  // 5. Load lessons real-time from Firestore
  useEffect(() => {
    const unsubscribeLessons = onSnapshot(collection(db, 'lessons'), (querySnap) => {
      if (!querySnap.empty) {
        const list: Lesson[] = [];
        querySnap.forEach((d) => {
          list.push(d.data() as Lesson);
        });
        list.sort((a, b) => parseFloat(a.id) - parseFloat(b.id));
        setLessons(list);
      } else {
        // Seed initial curriculum lessons
        INITIAL_LESSONS.forEach((lesson) => {
          setDoc(doc(db, 'lessons', lesson.id), lesson).catch(err => console.error("Error seeding lesson:", err));
        });
      }
    });

    return () => unsubscribeLessons();
  }, []);

  // 6. Load exam questions real-time from Firestore
  useEffect(() => {
    const unsubscribeQuestions = onSnapshot(collection(db, 'examQuestions'), (querySnap) => {
      if (!querySnap.empty) {
        const list: ExamQuestion[] = [];
        querySnap.forEach((d) => {
          list.push(d.data() as ExamQuestion);
        });
        list.sort((a, b) => (a.number || a.id) - (b.number || b.id));
        setExamQuestions(list);
      } else {
        // Seed initial exam questions
        EXAM_QUESTIONS.forEach((q) => {
          setDoc(doc(db, 'examQuestions', String(q.id)), q).catch(err => console.error("Error seeding exam question:", err));
        });
      }
    });

    return () => unsubscribeQuestions();
  }, []);

  // 7. Load student directories and submissions based on active role
  useEffect(() => {
    if (!isLoggedIn || !auth.currentUser) return;

    if (role === 'teacher' || role === 'admin') {
      // Teacher views ALL students in real-time
      const unsubscribeUsers = onSnapshot(collection(db, 'users'), (querySnap) => {
        const list: StudentGrade[] = [];
        const registered: any[] = [];
        
        querySnap.forEach((d) => {
          const data = d.data();
          registered.push(data);
          
          if (data.role === 'student') {
            list.push({
              id: data.studentId || d.id,
              name: data.name || '',
              initials: data.name ? data.name.split(' ').map((n: string) => n[0]).join('').toUpperCase() : 'ST',
              assg1: data.assg1 !== undefined ? data.assg1 : null,
              assg2: data.assg2 !== undefined ? data.assg2 : null,
              midterm: data.midterm !== undefined ? data.midterm : null,
              status: data.status || 'Incomplete',
              classroom: data.classroom,
              attendanceNo: data.attendanceNo !== undefined ? Number(data.attendanceNo) : undefined
            } as StudentGrade);
          }
        });
        // Sort ascending by attendance number (เลขที่ 1, 2, 3...)
        list.sort((a, b) => (a.attendanceNo || 0) - (b.attendanceNo || 0));
        setStudents(list);
        setRegisteredUsers(registered);
      });

      return () => unsubscribeUsers();
    } else {
      // Student view: Listen to own document profile
      const unsubscribeSelf = onSnapshot(doc(db, 'users', auth.currentUser.uid), (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setUserFullName(data.name || '');
          setStudentId(data.studentId || '');
          setClassroom(data.classroom || '');
          setAttendanceNo(data.attendanceNo || 0);

          const selfRecord: StudentGrade = {
            id: data.studentId || docSnap.id,
            name: data.name || '',
            initials: data.name ? data.name.split(' ').map((n: string) => n[0]).join('').toUpperCase() : 'ST',
            assg1: data.assg1 !== undefined ? data.assg1 : null,
            assg2: data.assg2 !== undefined ? data.assg2 : null,
            midterm: data.midterm !== undefined ? data.midterm : null,
            status: data.status || 'Incomplete',
            classroom: data.classroom,
            attendanceNo: Number(data.attendanceNo || 0)
          };
          setStudents([selfRecord]);
          
          if (data.profilePicUrl) {
            setProfilePics(prev => ({ ...prev, [data.email]: data.profilePicUrl }));
          }
        }
      });

      // Listen to student's assignment submission state
      const unsubscribeSubmission = onSnapshot(doc(db, 'submissions', `${auth.currentUser.uid}_assignment1`), (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setAssignment({
            fileName: data.fileName,
            fileSize: data.fileSize,
            comment: data.comment || '',
            status: data.status || 'Not Submitted',
            submittedAt: data.submittedAt
          });
        } else {
          setAssignment({
            fileName: null,
            fileSize: null,
            comment: '',
            status: 'Not Submitted'
          });
        }
      });

      return () => {
        unsubscribeSelf();
        unsubscribeSubmission();
      };
    }
  }, [isLoggedIn, role]);

  const currentProfilePic = profilePics[userEmail] || (role === 'teacher' ? 'https://lh3.googleusercontent.com/aida-public/AB6AXuDdnwwWvzNJmRUQ2Hcp7FyQEtgtsWPAE5F3t6B4j0gAxDhneRqfzvp7HU6A7zd0SdTlJ8qJzI__ODiwFOOp397TqlO5QGVmj9lS84I4bUgrwxQb03wx5sjQ37HSaIdTrOZTRQkvsIB3MbML_zqEEn6WnR0qjgEGvBVd3Z64u6NMchnyDciufl5Q0Y3FUuM9unxobqyQZF2bHTBtyokWEQJ0XHkycQx25lLQYRHc0zjndOnh3-esYyGPXcff2_6AlkQSMQQOHTBFBn8' : 'https://lh3.googleusercontent.com/aida-public/AB6AXuDY90rLbUIpGsV3qcw3FcZgCR1Eku5XZ67mVfYzGuEMRjnH8gcK4m1xWqo9zgqsUr5zaXiAqmpDo92YEhT5Re7aOuYJdcolrwdVquy75eoz3dI-KAKVs_KlkqkdLdwzUHieLb88KKzOXEEieccgsnhI9lcGnEVJgAufiTDbR7eJ0rfp61fDDzPxYdvpL88z5rz-3V3BXRBmJYlSPzxqIkzILpHKgcGfeOVKH9ta7I37q9bjQ1bQ4a5aDEsOWahlY0M7VOF3MJ1lwig');

  // Firestore update handlers passed as props instead of raw local state setters
  const handleUpdateStudents = async (updatedStudents: StudentGrade[]) => {
    // Compare and update modified grades in Firestore
    for (const s of updatedStudents) {
      const original = students.find((x) => x.id === s.id);
      if (
        !original ||
        original.assg1 !== s.assg1 ||
        original.assg2 !== s.assg2 ||
        original.midterm !== s.midterm ||
        original.status !== s.status ||
        original.classroom !== s.classroom ||
        original.attendanceNo !== s.attendanceNo
      ) {
        try {
          const q = query(collection(db, 'users'), where('studentId', '==', s.id));
          const snap = await getDocs(q);
          if (!snap.empty) {
            const userDocRef = doc(db, 'users', snap.docs[0].id);
            await updateDoc(userDocRef, {
              assg1: s.assg1,
              assg2: s.assg2,
              midterm: s.midterm,
              status: s.status,
              classroom: s.classroom,
              attendanceNo: s.attendanceNo !== undefined ? Number(s.attendanceNo) : 0
            });
          }
        } catch (err) {
          console.error("Error saving student grade in Firestore:", err);
        }
      }
    }
  };

  const handleUpdateLessons = async (updatedLessons: Lesson[]) => {
    try {
      // Find deleted lessons
      const currentIds = updatedLessons.map((l) => l.id);
      const deleted = lessons.filter((l) => !currentIds.includes(l.id));
      for (const d of deleted) {
        await deleteDoc(doc(db, 'lessons', d.id));
      }
      // Save additions & updates
      for (const l of updatedLessons) {
        await setDoc(doc(db, 'lessons', l.id), l);
      }
    } catch (err) {
      console.error("Error saving curriculum lessons:", err);
    }
  };

  const handleUpdateExamQuestions = async (updatedQuestions: ExamQuestion[]) => {
    try {
      // Find deleted questions
      const currentIds = updatedQuestions.map((q) => String(q.id));
      const deleted = examQuestions.filter((q) => !currentIds.includes(String(q.id)));
      for (const d of deleted) {
        await deleteDoc(doc(db, 'examQuestions', String(d.id)));
      }
      // Save additions & updates
      for (const q of updatedQuestions) {
        await setDoc(doc(db, 'examQuestions', String(q.id)), q);
      }
    } catch (err) {
      console.error("Error saving exam questions:", err);
    }
  };

  const handleUpdateSiteTitle = async (newTitle: string) => {
    try {
      await updateDoc(doc(db, 'settings', 'global'), { siteTitle: newTitle });
    } catch (err) {
      console.error("Error saving site title:", err);
    }
  };

  const handleUpdateAnnouncement = async (newAnnouncement: string) => {
    try {
      await updateDoc(doc(db, 'settings', 'global'), { announcement: newAnnouncement });
    } catch (err) {
      console.error("Error saving announcement:", err);
    }
  };

  const handleUpdateSchoolLogo = async (newLogo: string) => {
    try {
      if (newLogo.startsWith('data:image')) {
        const storageRef = ref(storage, 'branding/school_logo.png');
        await uploadString(storageRef, newLogo, 'data_url');
        const downloadUrl = await getDownloadURL(storageRef);
        await updateDoc(doc(db, 'settings', 'global'), { schoolLogo: downloadUrl });
      } else {
        await updateDoc(doc(db, 'settings', 'global'), { schoolLogo: newLogo });
      }
    } catch (err) {
      console.error("Error saving school logo:", err);
    }
  };

  const handleUpdateProfilePic = async (newPic: string) => {
    if (!auth.currentUser) return;
    try {
      if (newPic.startsWith('data:image')) {
        const storageRef = ref(storage, `profile_pics/${auth.currentUser.uid}_profile.png`);
        await uploadString(storageRef, newPic, 'data_url');
        const downloadUrl = await getDownloadURL(storageRef);
        await updateDoc(doc(db, 'users', auth.currentUser.uid), { profilePicUrl: downloadUrl });
        setProfilePics((prev) => ({ ...prev, [userEmail]: downloadUrl }));
      } else {
        await updateDoc(doc(db, 'users', auth.currentUser.uid), { profilePicUrl: newPic });
        setProfilePics((prev) => ({ ...prev, [userEmail]: newPic }));
      }
    } catch (err) {
      console.error("Error uploading profile pic:", err);
    }
  };

  const handleUpdateExamSettings = async (settings: ExamSettings) => {
    try {
      await setDoc(doc(db, 'settings', 'exam'), settings);
    } catch (err) {
      console.error("Error saving exam settings:", err);
    }
  };

  const handleUpdateClassrooms = async (list: string[]) => {
    try {
      await setDoc(doc(db, 'settings', 'classrooms'), { list });
    } catch (err) {
      console.error("Error saving classrooms list:", err);
    }
  };

  const handleUpdateAssignment = async (updater: Partial<AssignmentState>) => {
    const nextState = { ...assignment, ...updater };
    setAssignment(nextState);

    if (auth.currentUser) {
      try {
        await setDoc(doc(db, 'submissions', `${auth.currentUser.uid}_assignment1`), {
          studentId: auth.currentUser.uid,
          studentName: userFullName,
          classroom: classroom,
          attendanceNo: attendanceNo,
          fileName: nextState.fileName,
          fileSize: nextState.fileSize,
          comment: nextState.comment || '',
          status: nextState.status,
          submittedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
        });

        // Sync local grades list as well (e.g. if student clicks "Cancel Submission", clear assg1)
        if (nextState.status === 'Draft' || nextState.status === 'Not Submitted') {
          await updateDoc(doc(db, 'users', auth.currentUser.uid), {
            assg1: null,
            status: 'Incomplete'
          });
        }
      } catch (err) {
        console.error("Error saving assignment submission:", err);
      }
    }
  };

  const handleSubmitAssignment = async () => {
    if (auth.currentUser) {
      try {
        const submissionRef = doc(db, 'submissions', `${auth.currentUser.uid}_assignment1`);
        await setDoc(submissionRef, {
          studentId: auth.currentUser.uid,
          studentName: userFullName,
          classroom: classroom,
          attendanceNo: attendanceNo,
          fileName: assignment.fileName,
          fileSize: assignment.fileSize,
          comment: assignment.comment || '',
          status: 'Pending',
          submittedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
        });
      } catch (err) {
        console.error("Error submitting assignment:", err);
      }
    }
  };

  const handleLogin = (userRole: UserRole, email: string, name?: string, id?: string, cls?: string) => {
    setUserEmail(email);
    setRole(userRole);
    setIsLoggedIn(true);
    if (userRole === 'student') {
      setUserFullName(name || 'นักเรียน');
      setStudentId(id || '001');
      setClassroom(cls || 'M.1/1');
    } else {
      setUserFullName(name || 'อาจารย์สหรัฐ (Super Admin)');
      setStudentId(id || 'ADMIN');
      setClassroom(cls || 'ALL');
    }
    setView(userRole === 'teacher' || userRole === 'admin' ? 'grades' : 'dashboard');
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsLoggedIn(false);
      setView('dashboard');
      setMobileMenuOpen(false);
    } catch (err) {
      console.error("Error signing out:", err);
    }
  };

  const handleUpdateExam = (updater: Partial<ExamState> | ((prev: ExamState) => ExamState)) => {
    if (typeof updater === 'function') {
      setExam(updater);
    } else {
      setExam((prev) => ({ ...prev, ...updater }));
    }
  };

  const handleFinishExam = async (score: number) => {
    if (auth.currentUser) {
      try {
        const scaledScore = Math.round((score / (examQuestions.length || 1)) * 50); // scaled to 50
        const userRef = doc(db, 'users', auth.currentUser.uid);
        const userSnap = await getDoc(userRef);
        const userData = userSnap.data();

        const nextStatus = (userData?.assg1 !== null && userData?.assg1 !== undefined) ? 'Passed' : 'Incomplete';
        await updateDoc(userRef, {
          midterm: scaledScore,
          status: nextStatus
        });
      } catch (err) {
        console.error("Error recording exam score:", err);
      }
    }
  };

  const handleResetExam = () => {
    setExam({
      questions: examQuestions,
      answers: {},
      currentQuestionIndex: 0,
      isFinished: false,
      timeLeft: examSettings.timeLimit * 60,
      flaggedQuestions: {}
    });
  };

  const examMidtermScoreScaled = students.find((s) => s.id === studentId)?.midterm;
  const examScore = examMidtermScoreScaled 
    ? Math.round((examMidtermScoreScaled / 50) * examQuestions.length) 
    : null;

  return (
    <div className="min-h-screen bg-[#0a0c10] flex text-[#f0f6fc]">
      
      {/* Desktop Persistent Sidebar */}
      <Sidebar 
        currentView={currentView}
        setView={(v) => { setView(v); setMobileMenuOpen(false); }}
        role={role}
        setRole={setRole}
        onLogout={handleLogout}
        schoolLogo={schoolLogo}
        activeAdminTab={activeAdminTab}
        setActiveAdminTab={setActiveAdminTab}
      />

      {/* Mobile Slide-in Navigation Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div 
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
          ></div>

          {/* Drawer Menu */}
          <div className="relative bg-[#0d1117] border-r border-[#30363d] w-[280px] max-w-[80vw] h-full flex flex-col p-6 text-[#8b949e] shadow-2xl animate-in slide-in-from-left duration-200">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#161b22] border border-[#30363d] flex items-center justify-center shrink-0">
                  <img 
                    src={schoolLogo || schoolLogoUrl} 
                    alt="Logo" 
                    className={`w-6 h-6 object-contain rounded-full ${
                      (!schoolLogo || schoolLogo.includes('lh3.googleusercontent.com')) ? 'invert brightness-0' : ''
                    }`} 
                    referrerPolicy="no-referrer" 
                  />
                </div>
                <div>
                  <h1 className="font-display font-light text-[#f0f6fc] text-xs" style={{ fontFamily: 'Georgia, serif' }}>Soeng Sang</h1>
                  <p className="font-mono text-[9px] text-[#d4af37] font-semibold tracking-wider uppercase">Computer</p>
                </div>
              </div>
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 hover:bg-[#161b22] rounded-full text-[#8b949e] hover:text-[#f0f6fc]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation options */}
            <nav className="flex-grow flex flex-col gap-1">
              <button 
                onClick={() => { setView('dashboard'); setMobileMenuOpen(false); }}
                className={`flex items-center gap-3.5 px-4 py-2.5 rounded-xl font-sans text-xs font-semibold text-left ${
                  currentView === 'dashboard' ? 'bg-[#d4af37]/10 text-[#d4af37] border border-[#d4af37]/20' : 'text-[#8b949e] hover:text-[#f0f6fc]'
                }`}
              >
                <LayoutDashboard className="w-4.5 h-4.5" />
                <span>Dashboard</span>
              </button>

              <button 
                onClick={() => { setView('course'); setMobileMenuOpen(false); }}
                className={`flex items-center gap-3.5 px-4 py-2.5 rounded-xl font-sans text-xs font-semibold text-left ${
                  currentView === 'course' ? 'bg-[#d4af37]/10 text-[#d4af37] border border-[#d4af37]/20' : 'text-[#8b949e] hover:text-[#f0f6fc]'
                }`}
              >
                <BookOpen className="w-4.5 h-4.5" />
                <span>Courses</span>
              </button>

              {role === 'student' && (
                <button 
                  onClick={() => { setView('exam'); setMobileMenuOpen(false); }}
                  className={`flex items-center gap-3.5 px-4 py-2.5 rounded-xl font-sans text-xs font-semibold text-left ${
                    currentView === 'exam' ? 'bg-[#d4af37]/10 text-[#d4af37] border border-[#d4af37]/20' : 'text-[#8b949e] hover:text-[#f0f6fc]'
                  }`}
                >
                  <GraduationCap className="w-4.5 h-4.5" />
                  <span>Exam Practice</span>
                </button>
              )}

              {(role === 'teacher' || role === 'admin') && (
                <button 
                  onClick={() => { setView('grades'); setMobileMenuOpen(false); }}
                  className={`flex items-center gap-3.5 px-4 py-2.5 rounded-xl font-sans text-xs font-semibold text-left ${
                    currentView === 'grades' ? 'bg-[#d4af37]/10 text-[#d4af37] border border-[#d4af37]/20' : 'text-[#8b949e] hover:text-[#f0f6fc]'
                  }`}
                >
                  <FileText className="w-4.5 h-4.5" />
                  <span>Grades Matrix</span>
                </button>
              )}
            </nav>

            {/* Footer signout */}
            <button 
              onClick={handleLogout}
              className="mt-auto flex items-center gap-3.5 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/5 font-sans text-xs font-semibold text-left"
            >
              <LogOut className="w-4.5 h-4.5" />
              <span>Log out</span>
            </button>
          </div>
        </div>
      )}

      {/* Main View Container */}
      <div className="flex-grow flex flex-col min-h-screen lg:pl-[280px]">
        {/* Top bar with active header context */}
        <Topbar 
          currentView={currentView}
          role={role}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
          userFullName={userFullName}
          classroom={classroom}
          siteTitle={siteTitle}
          profilePic={currentProfilePic}
        />

        {/* Routed Screen Content */}
        <main className="flex-grow flex flex-col">
          {(!isLoggedIn) ? (
            <LoginView 
              onLogin={handleLogin} 
              onRegisterStudent={handleLogin} 
              registeredUsers={registeredUsers}
              setRegisteredUsers={setRegisteredUsers}
              schoolLogo={schoolLogo}
              classrooms={classrooms}
            />
          ) : (
            <>
              {currentView === 'dashboard' && (
                <DashboardView 
                  role={role} 
                  setView={setView} 
                  examScore={examScore}
                  assignmentStatus={assignment.status}
                  userFullName={userFullName}
                  classroom={classroom}
                  studentId={studentId}
                  siteTitle={siteTitle}
                  announcement={announcement}
                  profilePic={currentProfilePic}
                  onUpdateProfilePic={handleUpdateProfilePic}
                />
              )}

              {currentView === 'course' && (
                <CourseView 
                  lessons={lessons}
                  worksheets={worksheets}
                  teachingFiles={teachingFiles}
                  assignmentState={assignment}
                  onUpdateAssignment={handleUpdateAssignment}
                  onSubmitAssignment={handleSubmitAssignment}
                  classroom={classroom}
                />
              )}

              {currentView === 'exam' && role === 'student' && (
                <ExamView 
                  questions={examQuestions}
                  examState={exam}
                  onUpdateExam={handleUpdateExam}
                  onFinishExam={handleFinishExam}
                  onResetExam={handleResetExam}
                  examSettings={examSettings}
                  classroom={classroom}
                />
              )}

              {currentView === 'grades' && (role === 'teacher' || role === 'admin') && (
                <GradesView 
                  activeAdminTab={activeAdminTab}
                  setActiveAdminTab={setActiveAdminTab}
                  students={students}
                  onUpdateStudents={handleUpdateStudents}
                  lessons={lessons}
                  onUpdateLessons={handleUpdateLessons}
                  examQuestions={examQuestions}
                  onUpdateExamQuestions={handleUpdateExamQuestions}
                  worksheets={worksheets}
                  onUpdateWorksheets={setWorksheets}
                  teachingFiles={teachingFiles}
                  onUpdateTeachingFiles={setTeachingFiles}
                  siteTitle={siteTitle}
                  onUpdateSiteTitle={handleUpdateSiteTitle}
                  announcement={announcement}
                  onUpdateAnnouncement={handleUpdateAnnouncement}
                  registeredUsers={registeredUsers}
                  onUpdateRegisteredUsers={setRegisteredUsers}
                  searchQuery={searchQuery}
                  schoolLogo={schoolLogo}
                  onUpdateSchoolLogo={handleUpdateSchoolLogo}
                  profilePic={currentProfilePic}
                  onUpdateProfilePic={handleUpdateProfilePic}
                  examSettings={examSettings}
                  onUpdateExamSettings={handleUpdateExamSettings}
                  classrooms={classrooms}
                  onUpdateClassrooms={handleUpdateClassrooms}
                />
              )}
            </>
          )}
        </main>
      </div>

    </div>
  );
}
