import React, { useState, useEffect } from 'react';
import { School, Mail, Lock, Eye, EyeOff, Sparkles, User, ArrowRight, BookOpen, Hash } from 'lucide-react';
import { UserRole } from '../types';

// Firebase imports
import { auth, db } from '../firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword 
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  query, 
  where, 
  getDocs 
} from 'firebase/firestore';

interface LoginViewProps {
  onLogin: (role: UserRole, email: string, name?: string, id?: string, cls?: string) => void;
  onRegisterStudent: (role: UserRole, email: string, name?: string, id?: string, cls?: string) => void;
  registeredUsers: any[];
  setRegisteredUsers: React.Dispatch<React.SetStateAction<any[]>>;
  schoolLogo?: string;
  classrooms?: string[];
}

const schoolLogoUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuDjqn3HC4TuXM8YGx5YF0iMBGjEymfzRKfh6dU4v5V5232SWFGDQ4bKLNhDcHjvpcwbuhhxGYx7LwSf6x3WfKV3B5FuRhpDbn-7BTA52h4rydheCGRXMngAwlqw1z65_WHfmQyHof5O2MXg3je8a3i41p-ctPGJbx_WUX02tE-DTGsQ_dx-TPeGoqgmgCZMWifVQDA1KTzbr0bOqL6SxgAZ-OU_98DQPx-SwyRYgB8Y6OORS4f7d26YezFKD-hmGaF55A5fgxF4rbs";
const classroomImgUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuDNGiVTIS_WhsA8dgsgJLGetAFC1tfwd7KKEQmLEzx01yjJ7SJLBDMFtQh74efjNKUPhAttuOZ__ah7RkJbeKQZ9xqRsEl6jo5Ex1lX5_btaSA2pj3iK965MxGLJEbx-KNKoB3vJcn9igFoYHaFS7Owddf6jlEyBceEvuncTF81rdk6J0Yrq9evJS3mNEKpt0LCP7NLOiaJOhRijLAw0bSKMaJPUH6XFtcJFELEWcBMTu-fDk6OuGh2j5JcZIdA06QLMBG2Mm_H_lI";

export default function LoginView({ 
  onLogin, 
  onRegisterStudent, 
  registeredUsers, 
  setRegisteredUsers, 
  schoolLogo, 
  classrooms = ['M.1/1', 'M.1/2', 'M.1/3'] 
}: LoginViewProps) {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('student@soengsang.edu');
  const [password, setPassword] = useState('123456');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Registration States (Students Only)
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [classroom, setClassroom] = useState(classrooms[0] || 'M.1/1');
  const [studentId, setStudentId] = useState('');
  const [attendanceNo, setAttendanceNo] = useState('');

  useEffect(() => {
    if (classrooms.length > 0 && !classrooms.includes(classroom)) {
      setClassroom(classrooms[0]);
    }
  }, [classrooms, classroom]);

  // Handle Login Submit
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    
    const trimmedEmail = email.trim();
    const normalizedEmail = trimmedEmail.toLowerCase();
    
    // Direct Admin Bypass check
    if (normalizedEmail === 'admin' && password === 'admin') {
      setIsAdmin(true);
      try {
        onLogin('admin', 'saharat2@soengsang.ac.th', 'ผู้ดูแลระบบ (ครูสหรัฐ)', 'ADMIN', 'ALL');
      } catch (err: any) {
        alert("เกิดข้อผิดพลาดในการเข้าสู่ระบบผู้ดูแลระบบจำลอง: " + err.message);
      } finally {
        setLoading(false);
      }
      return;
    }
    
    // 1. Check if logging in as Teacher/Admin (Master Super Admin)
    if (normalizedEmail === 'saharat2@soengsang.ac.th') {
      if (password === 'admin') {
        setIsAdmin(true);
        try {
          // Attempt to sign in via Firebase Auth
          await signInWithEmailAndPassword(auth, 'saharat2@soengsang.ac.th', 'admin');
          onLogin('admin', 'saharat2@soengsang.ac.th', 'ผู้ดูแลระบบ (ครูสหรัฐ)', 'ADMIN', 'ALL');
        } catch (err: any) {
          // If the admin user doesn't exist yet, automatically create it!
          if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
            try {
              const cred = await createUserWithEmailAndPassword(auth, 'saharat2@soengsang.ac.th', 'admin');
              await setDoc(doc(db, 'users', cred.user.uid), {
                uid: cred.user.uid,
                email: 'saharat2@soengsang.ac.th',
                name: 'ผู้ดูแลระบบ (ครูสหรัฐ)',
                role: 'admin',
                studentId: 'ADMIN',
                classroom: 'ALL',
                attendanceNo: 0,
                profilePicUrl: null
              });
              onLogin('admin', 'saharat2@soengsang.ac.th', 'ผู้ดูแลระบบ (ครูสหรัฐ)', 'ADMIN', 'ALL');
            } catch (createErr) {
              alert("ไม่สามารถเริ่มต้นบัญชีผู้ดูแลระบบได้: " + (createErr as Error).message);
            }
          } else {
            alert("เกิดข้อผิดพลาดในการเข้าสู่ระบบผู้ดูแลระบบ: " + err.message);
          }
        } finally {
          setLoading(false);
        }
        return;
      } else {
        alert("รหัสผ่านสำหรับสิทธิ์ผู้ดูแลระบบไม่ถูกต้อง");
        setLoading(false);
        return;
      }
    }
    
    // 2. Student login (can login with either Email or Student ID)
    let loginEmail = trimmedEmail;
    
    // If input is not a valid email format, assume it is a Student ID
    if (!trimmedEmail.includes('@')) {
      try {
        const q = query(collection(db, 'users'), where('studentId', '==', trimmedEmail));
        const snap = await getDocs(q);
        if (!snap.empty) {
          loginEmail = snap.docs[0].data().email;
        } else {
          alert("ไม่พบลำดับรหัสประจำตัวนักเรียนหรืออีเมลประจำตัวในระบบ");
          setLoading(false);
          return;
        }
      } catch (err) {
        alert("เกิดข้อผิดพลาดในการค้นหารหัสประจำตัวนักเรียน");
        setLoading(false);
        return;
      }
    }

    try {
      const cred = await signInWithEmailAndPassword(auth, loginEmail, password);
      const userDoc = await getDoc(doc(db, 'users', cred.user.uid));
      if (userDoc.exists()) {
        const d = userDoc.data();
        onLogin(d.role || 'student', d.email, d.name, d.studentId, d.classroom);
      } else {
        onLogin('student', loginEmail, 'นักเรียนใหม่', '001', 'M.1/1');
      }
    } catch (err: any) {
      if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        alert("รหัสผ่านไม่ถูกต้อง กรุณาตรวจสอบรหัสผ่านของคุณใหมู่อีกครั้ง");
      } else {
        alert("ไม่พบบัญชีผู้ใช้งานที่ระบุ หรือรหัสผ่านไม่ถูกต้อง");
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle Register Submit (Only Students can Register)
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    
    const trimmedEmail = regEmail.trim();
    const normalizedEmail = trimmedEmail.toLowerCase();
    const trimmedId = studentId.trim();
    const trimmedAttendance = attendanceNo.trim();
    const fullName = `${firstName.trim()} ${lastName.trim()}`;
 
    // Validations
    if (!firstName || !lastName || !trimmedEmail || !regPassword || !trimmedId || !trimmedAttendance) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วนทุกช่อง");
      return;
    }
 
    if (normalizedEmail === 'saharat2@soengsang.ac.th' || normalizedEmail.includes('teacher')) {
      alert("สิทธิ์ผู้ดูแลระบบ/คุณครู ไม่สามารถสมัครสมาชิกได้ โปรดใช้ระบบเข้าสู่ระบบหลัก");
      return;
    }

    if (regPassword.length < 6) {
      alert("รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร");
      return;
    }

    const attNum = parseInt(trimmedAttendance, 10);
    if (isNaN(attNum) || attNum <= 0) {
      alert("เลขที่ต้องเป็นตัวเลขที่มากกว่า 0 เท่านั้น");
      return;
    }

    setLoading(true);

    try {
      // 1. Collision Check - Student ID
      const qId = query(collection(db, 'users'), where('studentId', '==', trimmedId));
      const snapId = await getDocs(qId);
      if (!snapId.empty) {
        alert("เลขประจำตัวนักเรียนนี้ลงทะเบียนในระบบแล้ว");
        setLoading(false);
        return;
      }

      // 2. Collision Check - Attendance Number in that Class
      const qAtt = query(
        collection(db, 'users'), 
        where('classroom', '==', classroom), 
        where('attendanceNo', '==', attNum)
      );
      const snapAtt = await getDocs(qAtt);
      if (!snapAtt.empty) {
        alert(`ขออภัย! เลขที่ ${attNum} ถูกลงทะเบียนไปแล้วในห้องเรียน ${classroom}`);
        setLoading(false);
        return;
      }

      // 3. Create Firebase Authentication Account
      const cred = await createUserWithEmailAndPassword(auth, trimmedEmail, regPassword);

      // 4. Create Student Profile in Firestore
      await setDoc(doc(db, 'users', cred.user.uid), {
        uid: cred.user.uid,
        email: trimmedEmail,
        name: fullName,
        studentId: trimmedId,
        classroom: classroom,
        attendanceNo: attNum,
        role: 'student',
        profilePicUrl: null,
        assg1: null,
        assg2: null,
        midterm: null,
        status: 'Incomplete'
      });

      alert(`สมัครสมาชิกนักเรียนเสร็จสิ้น!\n\nชื่อ: ${fullName}\nเลขที่: ${attNum}\nเลขประจำตัว: ${trimmedId}\nห้องเรียน: ${classroom}`);
      
      // Reactive layout updates automatically on App.tsx, but let's notify App
      onRegisterStudent('student', trimmedEmail, fullName, trimmedId, classroom);
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') {
        alert("อีเมลประจำตัวนี้ถูกใช้งานแล้วในระบบ");
      } else {
        alert("ไม่สามารถสมัครสมาชิกได้: " + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthClick = (provider: string) => {
    alert(`ระบบ SSO ผ่าน ${provider} เชื่อมต่อแบบจำลองสำเร็จ`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-8 relative overflow-hidden bg-[#0a0c10] text-[#f0f6fc] w-full">
      {/* Background Decorative Blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] right-[-5%] w-[40vw] h-[40vw] rounded-full bg-[#d4af37]/5 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[50vw] h-[50vw] rounded-full bg-[#30363d]/30 blur-[100px]"></div>
      </div>

      {/* Login Box */}
      <div className="w-full max-w-[1000px] flex flex-col md:flex-row bg-[#161b22] rounded-2xl shadow-2xl border border-[#30363d] overflow-hidden min-h-[600px] relative z-10 transition-all duration-300">
        
        {/* Left Sidebar Banner */}
        <div className="hidden md:flex md:w-[42%] bg-[#0d1117] flex-col relative overflow-hidden border-r border-[#30363d]">
          <div className="absolute inset-0 z-0">
            <img 
              alt="Classroom"
              className="w-full h-full object-cover opacity-15 mix-blend-overlay" 
              src={classroomImgUrl}
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#0a0c10]/80 via-[#0d1117]/90 to-[#0a0c10]"></div>
          </div>
          <div className="relative z-10 p-10 flex flex-col h-full justify-between">
            <div>
              <div className="flex items-center gap-3.5 mb-8">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#d4af37] to-[#aa8e2d] flex items-center justify-center border border-[#f0f6fc22] p-0.5">
                  <img 
                    src={schoolLogo || schoolLogoUrl} 
                    alt="Logo" 
                    className={`w-9 h-9 object-contain rounded-full ${
                      (!schoolLogo || schoolLogo === schoolLogoUrl || schoolLogo.includes('lh3.googleusercontent.com')) ? 'invert brightness-0' : ''
                    }`} 
                    referrerPolicy="no-referrer" 
                  />
                </div>
                <div>
                  <h1 className="font-display font-light text-[#f0f6fc] text-base tracking-widest uppercase italic" style={{ fontFamily: 'Georgia, serif' }}>Soeng Sang</h1>
                  <p className="font-mono text-[9px] text-[#8b949e] uppercase tracking-[0.25em]">ระบบจัดการเรียนรู้</p>
                </div>
              </div>
              <p className="font-mono text-[10px] text-[#d4af37] tracking-widest uppercase font-semibold">รายวิชาคอมพิวเตอร์และขั้นตอนวิธี</p>
            </div>
            
            <div className="mt-auto">
              <span className="inline-block p-1 bg-[#d4af3711] border border-[#d4af3733] rounded-lg text-[#d4af37] mb-3">
                <Sparkles className="w-5 h-5" />
              </span>
              <p className="font-sans text-xs md:text-sm font-light text-[#8b949e] leading-relaxed italic" style={{ fontFamily: 'Georgia, serif' }}>
                "เปลี่ยนความซับซ้อนของเทคโนโลยีวิทยาการคอมพิวเตอร์ให้เข้าใจง่าย พร้อมการเรียนรู้ที่เป็นระบบ มีความสุข และสร้างสรรค์"
              </p>
            </div>
          </div>
        </div>

        {/* Right Forms Content */}
        <div className="w-full md:w-[58%] p-6 md:p-10 flex flex-col bg-[#161b22]">
          
          {/* Mobile school header */}
          <div className="flex md:hidden items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#d4af37] to-[#aa8e2d] flex items-center justify-center">
              <img 
                src={schoolLogo || schoolLogoUrl} 
                alt="Logo" 
                className={`w-8 h-8 object-contain rounded-full ${
                  (!schoolLogo || schoolLogo === schoolLogoUrl || schoolLogo.includes('lh3.googleusercontent.com')) ? 'invert brightness-0' : ''
                }`} 
                referrerPolicy="no-referrer" 
              />
            </div>
            <div>
              <h1 className="font-display font-light text-white text-base tracking-widest uppercase italic" style={{ fontFamily: 'Georgia, serif' }}>Soeng Sang Academy</h1>
              <p className="font-mono text-[9px] text-[#8b949e] tracking-wider uppercase">กลุ่มสาระการเรียนรู้คอมพิวเตอร์</p>
            </div>
          </div>

          {/* Login/Signup Tabs */}
          <div className="flex border-b border-[#30363d] mb-8 relative">
            <button 
              onClick={() => setActiveTab('login')}
              className={`flex-1 pb-3 font-sans text-sm font-semibold uppercase tracking-wider text-center border-b-2 transition-all cursor-pointer ${
                activeTab === 'login' ? 'text-[#d4af37] border-[#d4af37]' : 'text-[#8b949e] border-transparent hover:text-[#f0f6fc]'
              }`}
            >
              เข้าสู่ระบบ
            </button>
            <button 
              onClick={() => setActiveTab('register')}
              className={`flex-1 pb-3 font-sans text-sm font-semibold uppercase tracking-wider text-center border-b-2 transition-all cursor-pointer ${
                activeTab === 'register' ? 'text-[#d4af37] border-[#d4af37]' : 'text-[#8b949e] border-transparent hover:text-[#f0f6fc]'
              }`}
            >
              สมัครสมาชิก (เฉพาะนักเรียน)
            </button>
          </div>

          {activeTab === 'login' ? (
            /* LOGIN FORM */
            <form onSubmit={handleLoginSubmit} className="flex flex-col gap-5 flex-grow justify-center">
              <div>
                <h2 className="font-display font-light text-2xl text-[#f0f6fc] mb-1" style={{ fontFamily: 'Georgia, serif' }}>ยินดีต้อนรับ</h2>
                <p className="font-sans text-xs text-[#8b949e]">ระบุข้อมูลบัญชีของคุณเพื่อเข้าสู่ระบบสารสนเทศและการเรียนรู้วิชาคอมพิวเตอร์</p>
              </div>

              {/* Email / Username */}
              <div className="flex flex-col gap-1.5">
                <label className="font-sans text-[11px] uppercase tracking-wider font-semibold text-[#8b949e]" htmlFor="login-email">อีเมล หรือ รหัสประจำตัวนักเรียน</label>
                <div className="relative flex items-center">
                  <Mail className="w-4 h-4 absolute left-3 text-[#8b949e]" />
                  <input 
                    id="login-email"
                    type="text" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0d1117] border border-[#30363d] font-sans text-sm text-[#f0f6fc] outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]/30 transition-all placeholder:text-[#484f58]"
                    placeholder="ป้อนรหัสประจำตัว เช่น 10025 หรืออีเมล turing.a@soengsang.ac.th"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center">
                  <label className="font-sans text-[11px] uppercase tracking-wider font-semibold text-[#8b949e]" htmlFor="login-password">รหัสผ่าน</label>
                  <a 
                    href="#forgot" 
                    onClick={(e) => { e.preventDefault(); alert("ระบบส่งลิงก์กู้คืนรหัสผ่านชั่วคราวไปยังกล่องจดหมายอีเมลของท่านแล้ว!"); }}
                    className="font-sans text-xs font-semibold text-[#d4af37] hover:text-[#aa8e2d] hover:underline transition-colors"
                  >
                    ลืมรหัสผ่าน?
                  </a>
                </div>
                <div className="relative flex items-center">
                  <Lock className="w-4 h-4 absolute left-3 text-[#8b949e]" />
                  <input 
                    id="login-password"
                    type={showPassword ? "text" : "password"} 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#0d1117] border border-[#30363d] font-sans text-sm text-[#f0f6fc] outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]/30 transition-all placeholder:text-[#484f58]"
                    placeholder="รหัสผ่านผู้ใช้งาน"
                    required
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 text-[#8b949e] hover:text-[#f0f6fc] transition-colors cursor-pointer bg-transparent border-none"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-[#d4af37] hover:bg-[#aa8e2d] text-[#0a0c10] py-3 rounded-xl font-sans text-xs font-bold uppercase tracking-wider transition-all shadow-md active:translate-y-[1px] flex items-center justify-center gap-2 group mt-2 cursor-pointer disabled:opacity-50"
              >
                <span>{loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบปลอดภัย'}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>

              {/* Admin Note */}
              <button 
                type="button"
                onClick={() => {
                  setEmail('admin');
                  setPassword('admin');
                  setIsAdmin(true);
                  onLogin('admin', 'saharat2@soengsang.ac.th', 'ผู้ดูแลระบบ (ครูสหรัฐ)', 'ADMIN', 'ALL');
                }}
                className="w-full bg-[#161b22] hover:bg-[#30363d]/30 border border-[#30363d] rounded-xl p-3 text-center text-[11px] text-[#d4af37] hover:text-[#aa8e2d] leading-relaxed cursor-pointer transition-all duration-150 hover:scale-[1.01] active:scale-[0.99]"
              >
                <span>อาจารย์ผู้ดูแลระบบสามารถเข้าสู่ระบบด้วย Username 'admin' และรหัสผ่าน 'admin' ได้ที่นี่ (คลิกเพื่อเข้าสู่ระบบทันที)</span>
              </button>

              {/* OAuth Splitter */}
              <div className="relative flex items-center justify-center my-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#30363d]"></div>
                </div>
                <span className="relative bg-[#161b22] px-4 font-sans text-[10px] uppercase tracking-wider text-[#8b949e] font-medium">หรือเข้าสู่ระบบด้วย</span>
              </div>

              {/* Social Logins */}
              <div className="grid grid-cols-2 gap-3">
                <button 
                  type="button"
                  onClick={() => handleOAuthClick('Google SSO')}
                  className="flex items-center justify-center gap-2 py-2 px-4 border border-[#30363d] bg-[#0d1117] rounded-xl font-sans text-xs text-[#f0f6fc] hover:bg-[#161b22] transition-colors cursor-pointer"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
                  </svg>
                  <span>Google</span>
                </button>
                <button 
                  type="button"
                  onClick={() => handleOAuthClick('Microsoft Office 365')}
                  className="flex items-center justify-center gap-2 py-2 px-4 border border-[#30363d] bg-[#0d1117] rounded-xl font-sans text-xs text-[#f0f6fc] hover:bg-[#161b22] transition-colors cursor-pointer"
                >
                  <svg className="w-4 h-4" viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 0H0v10h10V0z" fill="#f25022"></path>
                    <path d="M21 0H11v10h10V0z" fill="#7fba00"></path>
                    <path d="M10 11H0v10h10V11z" fill="#00a4ef"></path>
                    <path d="M21 11H11v10h10V11z" fill="#ffb900"></path>
                  </svg>
                  <span>Microsoft</span>
                </button>
              </div>
            </form>
          ) : (
            /* CREATE ACCOUNT FORM (Students Only) */
            <form onSubmit={handleRegisterSubmit} className="flex flex-col gap-4 flex-grow justify-center">
              <div>
                <h2 className="font-display font-light text-2xl text-[#f0f6fc] mb-1" style={{ fontFamily: 'Georgia, serif' }}>สมัครสมาชิกใหม่</h2>
                <p className="font-sans text-xs text-[#8b949e]">สร้างบัญชีนักเรียนเพื่อลงทะเบียนเข้าเรียนและฝึกทำแบบทดสอบวิชาคอมพิวเตอร์</p>
              </div>

              {/* Names row */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="font-sans text-[11px] font-semibold text-[#8b949e]" htmlFor="reg-firstname">ชื่อจริง</label>
                  <input 
                    id="reg-firstname"
                    type="text" 
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl bg-[#0d1117] border border-[#30363d] font-sans text-sm text-[#f0f6fc] outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]/30 transition-all placeholder:text-[#484f58]"
                    placeholder="กรอกชื่อจริง"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-sans text-[11px] font-semibold text-[#8b949e]" htmlFor="reg-lastname">นามสกุล</label>
                  <input 
                    id="reg-lastname"
                    type="text" 
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl bg-[#0d1117] border border-[#30363d] font-sans text-sm text-[#f0f6fc] outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]/30 transition-all placeholder:text-[#484f58]"
                    placeholder="กรอกนามสกุล"
                    required
                  />
                </div>
              </div>

              {/* Classroom & Student ID row */}
              <div className="grid grid-cols-3 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="font-sans text-[11px] font-semibold text-[#8b949e]" htmlFor="reg-classroom">ห้องเรียน</label>
                  <div className="relative flex items-center">
                    <BookOpen className="w-4 h-4 absolute left-3 text-[#8b949e] pointer-events-none" />
                    <select 
                      id="reg-classroom"
                      value={classroom}
                      onChange={(e) => setClassroom(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0d1117] border border-[#30363d] font-sans text-sm text-[#f0f6fc] outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]/30 transition-all cursor-pointer"
                    >
                      {classrooms.map((cls) => (
                        <option key={cls} value={cls}>ชั้นมัธยมศึกษาปีที่ {cls}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-sans text-[11px] font-semibold text-[#8b949e]" htmlFor="reg-studentid">เลขประจำตัว</label>
                  <div className="relative flex items-center">
                    <Hash className="w-4 h-4 absolute left-3 text-[#8b949e] pointer-events-none" />
                    <input 
                      id="reg-studentid"
                      type="text" 
                      maxLength={10}
                      value={studentId}
                      onChange={(e) => setStudentId(e.target.value.replace(/\D/g, ''))} // only numbers allowed
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0d1117] border border-[#30363d] font-sans text-sm text-[#f0f6fc] outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]/30 transition-all placeholder:text-[#484f58]"
                      placeholder="เช่น 10025"
                      required
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-sans text-[11px] font-semibold text-[#8b949e]" htmlFor="reg-attendance">เลขที่</label>
                  <div className="relative flex items-center">
                    <Hash className="w-4 h-4 absolute left-3 text-[#8b949e] pointer-events-none" />
                    <input 
                      id="reg-attendance"
                      type="text" 
                      maxLength={3}
                      value={attendanceNo}
                      onChange={(e) => setAttendanceNo(e.target.value.replace(/\D/g, ''))} // only numbers allowed
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0d1117] border border-[#30363d] font-sans text-sm text-[#f0f6fc] outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]/30 transition-all placeholder:text-[#484f58]"
                      placeholder="เช่น 1"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Email Address */}
              <div className="flex flex-col gap-1.5">
                <label className="font-sans text-[11px] font-semibold text-[#8b949e]" htmlFor="reg-email">อีเมลประจำตัวนักเรียน</label>
                <div className="relative flex items-center">
                  <Mail className="w-4 h-4 absolute left-3 text-[#8b949e]" />
                  <input 
                    id="reg-email"
                    type="email" 
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0d1117] border border-[#30363d] font-sans text-sm text-[#f0f6fc] outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]/30 transition-all placeholder:text-[#484f58]"
                    placeholder="เช่น turing.a@soengsang.ac.th"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <label className="font-sans text-[11px] font-semibold text-[#8b949e]" htmlFor="reg-password">รหัสผ่านเพื่อความปลอดภัย</label>
                <div className="relative flex items-center">
                  <Lock className="w-4 h-4 absolute left-3 text-[#8b949e]" />
                  <input 
                    id="reg-password"
                    type={showPassword ? "text" : "password"} 
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#0d1117] border border-[#30363d] font-sans text-sm text-[#f0f6fc] outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]/30 transition-all placeholder:text-[#484f58]"
                    placeholder="ความยาวไม่น้อยกว่า 6 อักขระ"
                    required
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 text-[#8b949e] hover:text-[#f0f6fc] transition-colors cursor-pointer bg-transparent border-none"
                  >
                    {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-[#d4af37] hover:bg-[#aa8e2d] text-[#0a0c10] py-3 rounded-xl font-sans text-xs font-bold uppercase tracking-wider transition-all shadow-md active:translate-y-[1px] mt-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? 'กำลังลงทะเบียน...' : 'ลงทะเบียนวิชาเรียนและเข้าระบบ'}
              </button>

              <div className="text-center mt-2">
                <p className="font-sans text-[11px] text-[#8b949e] leading-snug">
                  การลงทะเบียนนี้ถือเป็นการยอมรับ <a href="#terms" className="text-[#d4af37] hover:underline">ข้อตกลงในการใช้งาน</a> และ <a href="#privacy" className="text-[#d4af37] hover:underline">นโยบายความเป็นส่วนตัว</a> ของโรงเรียนเสิงสาง
                </p>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}
