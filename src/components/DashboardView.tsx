import React from 'react';
import { 
  TrendingUp, 
  Award, 
  CheckCircle, 
  ArrowRight, 
  Code, 
  FileText, 
  FileQuestion, 
  BookOpen,
  Calendar
} from 'lucide-react';
import { ViewType, UserRole } from '../types';

interface DashboardViewProps {
  role: UserRole;
  setView: (view: ViewType) => void;
  examScore?: number | null;
  assignmentStatus: 'Pending' | 'Draft' | 'Not Submitted';
  userFullName?: string;
  classroom?: string;
  studentId?: string;
  siteTitle?: string;
  announcement?: string;
  profilePic?: string;
  onUpdateProfilePic?: (newPic: string) => void;
}

export default function DashboardView({ 
  role, 
  setView, 
  examScore, 
  assignmentStatus,
  userFullName = "อเล็กซ์ ทัวริง",
  classroom = "M.1/1",
  studentId = "001",
  siteTitle = "ระบบจัดการเรียนรู้ (LMS) - โรงเรียนเสิงสาง",
  announcement = "ยินดีต้อนรับนักเรียนทุกคนเข้าสู่บทเรียนวิทยาการคอมพิวเตอร์และขั้นตอนวิธี! อย่าลืมเข้าทำแบบสอบถามฝึกหัดก่อนสัปดาห์สอบกลางภาคหลัก",
  profilePic,
  onUpdateProfilePic
}: DashboardViewProps) {
  
  // Compute dynamic stats based on actual active student state
  const averageGrade = examScore !== undefined && examScore !== null 
    ? Math.round((92 + examScore) / 2) 
    : 88;

  const tasksCompleted = assignmentStatus === 'Pending' ? 4 : 3;

  return (
    <div className="flex-grow p-4 md:p-6 lg:p-8 max-w-[1280px] w-full mx-auto select-none animate-in fade-in duration-200">
      
      {/* Site settings Announcement banner */}
      <div className="mb-6 bg-[#161b22] border-l-4 border-[#d4af37] border-y border-r border-[#30363d] p-4 rounded-r-xl shadow-sm">
        <h3 className="font-sans text-xs font-bold text-[#d4af37] mb-1 tracking-wider uppercase">📢 ประกาศจากครูผู้สอน</h3>
        <p className="font-sans text-xs md:text-sm text-[#f0f6fc] leading-relaxed select-text">
          {announcement}
        </p>
      </div>

      {/* Welcome Header */}
      <section className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4.5">
          {/* Hoverable Interactive Avatar */}
          <div className="relative group shrink-0 select-none">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden border-2 border-[#d4af37] p-0.5 bg-[#161b22] relative shadow-lg">
              <img 
                src={profilePic || (role === 'teacher' 
                  ? 'https://lh3.googleusercontent.com/aida-public/AB6AXuDdnwwWvzNJmRUQ2Hcp7FyQEtgtsWPAE5F3t6B4j0gAxDhneRqfzvp7HU6A7zd0SdTlJ8qJzI__ODiwFOOp397TqlO5QGVmj9lS84I4bUgrwxQb03wx5sjQ37HSaIdTrOZTRQkvsIB3MbML_zqEEn6WnR0qjgEGvBVd3Z64u6NMchnyDciufl5Q0Y3FUuM9unxobqyQZF2bHTBtyokWEQJ0XHkycQx25lLQYRHc0zjndOnh3-esYyGPXcff2_6AlkQSMQQOHTBFBn8'
                  : 'https://lh3.googleusercontent.com/aida-public/AB6AXuDY90rLbUIpGsV3qcw3FcZgCR1Eku5XZ67mVfYzGuEMRjnH8gcK4m1xWqo9zgqsUr5zaXiAqmpDo92YEhT5Re7aOuYJdcolrwdVquy75eoz3dI-KAKVs_KlkqkdLdwzUHieLb88KKzOXEEieccgsnhI9lcGnEVJgAufiTDbR7eJ0rfp61fDDzPxYdvpL88z5rz-3V3BXRBmJYlSPzxqIkzILpHKgcGfeOVKH9ta7I37q9bjQ1bQ4a5aDEsOWahlY0M7VOF3MJ1lwig'
                )} 
                alt="Profile Avatar" 
                className="w-full h-full object-cover rounded-full bg-[#0d1117]"
                referrerPolicy="no-referrer"
              />
            </div>
            {onUpdateProfilePic && (
              <label className="absolute inset-0 rounded-full bg-black/70 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-[#d4af37] text-[10px] font-sans font-bold cursor-pointer transition-opacity text-center px-1">
                <span>เปลี่ยนรูป</span>
                <span className="text-[8px] text-white/70 font-normal">คลิก</span>
                <input 
                  type="file" 
                  accept="image/png, image/jpeg, image/jpg" 
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      if (file.size > 2 * 1024 * 1024) {
                        alert("ขนาดไฟล์ภาพต้องไม่เกิน 2MB เพื่ออัปโหลดขึ้นระบบ");
                        return;
                      }
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        onUpdateProfilePic(reader.result as string);
                        alert("เปลี่ยนรูปโปรไฟล์ของคุณเสร็จสิ้น!");
                      };
                      reader.readAsDataURL(file);
                    }
                  }} 
                  className="hidden" 
                />
              </label>
            )}
          </div>

          <div>
            <h2 className="font-sans font-semibold text-2xl lg:text-3xl text-[#f0f6fc] mb-1.5 tracking-tight">
              ยินดีต้อนรับกลับมา, {userFullName}! 👋
            </h2>
            <p className="font-sans text-xs md:text-sm text-[#8b949e]">
              {role === 'teacher' 
                ? 'นี่คือภาพรวมความคืบหน้าของชั้นเรียนและรายการงานวิชาคอมพิวเตอร์ที่รอการประเมินคะแนน' 
                : `คุณเข้าสู่ระบบในฐานะ นักเรียน เรียบร้อยแล้ว`}
            </p>
          </div>
        </div>

        {/* Student ID & Classroom badge details */}
        {role === 'student' && (
          <div className="bg-[#161b22] border border-[#30363d] rounded-xl px-4 py-3 flex gap-4 text-xs font-sans text-[#8b949e] shadow-sm">
            <div className="flex flex-col">
              <span className="text-[10px] text-[#8b949e] uppercase font-bold tracking-wider">เลขประจำตัว</span>
              <span className="text-[#f0f6fc] font-mono font-bold mt-0.5">{studentId}</span>
            </div>
            <div className="w-px bg-[#30363d]"></div>
            <div className="flex flex-col">
              <span className="text-[10px] text-[#8b949e] uppercase font-bold tracking-wider">ระดับชั้นเรียน</span>
              <span className="text-[#d4af37] font-bold mt-0.5">ชั้นมัธยมศึกษาปีที่ {classroom.replace('M.', '')} ({classroom})</span>
            </div>
          </div>
        )}
      </section>

      {/* 3 Main Choice Menus for Students */}
      {role === 'student' && (
        <section className="mb-8">
          <h3 className="font-sans text-xs font-bold text-[#8b949e] uppercase tracking-wider mb-3">เมนูทางเลือกเข้าเรียนระบบหลัก</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            <button
              onClick={() => setView('course')}
              className="bg-gradient-to-br from-[#161b22] to-[#0d1117] border border-[#30363d] hover:border-[#d4af37] hover:shadow-lg p-5 rounded-2xl flex items-center gap-4 text-left transition-all group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-xl bg-[#0d1117] border border-[#30363d] text-[#d4af37] group-hover:bg-[#d4af37]/10 flex items-center justify-center shrink-0 transition-colors">
                <BookOpen className="w-6 h-6" />
              </div>
              <div className="min-w-0">
                <h4 className="font-sans font-bold text-sm text-[#f0f6fc] group-hover:text-[#d4af37] transition-colors">1) "เข้าเรียน"</h4>
                <p className="font-sans text-[11px] text-[#8b949e] mt-0.5 truncate">เลือกดูเนื้อหาและสไลด์สอนตามห้องที่สังกัด</p>
              </div>
            </button>

            <button
              onClick={() => {
                setView('course');
                setTimeout(() => {
                  const el = document.getElementById('assignment-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className="bg-gradient-to-br from-[#161b22] to-[#0d1117] border border-[#30363d] hover:border-[#d4af37] hover:shadow-lg p-5 rounded-2xl flex items-center gap-4 text-left transition-all group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-xl bg-[#0d1117] border border-[#30363d] text-[#d4af37] group-hover:bg-[#d4af37]/10 flex items-center justify-center shrink-0 transition-colors">
                <FileText className="w-6 h-6" />
              </div>
              <div className="min-w-0">
                <h4 className="font-sans font-bold text-sm text-[#f0f6fc] group-hover:text-[#d4af37] transition-colors">2) "ส่งงาน"</h4>
                <p className="font-sans text-[11px] text-[#8b949e] mt-0.5 truncate">อัปโหลดใบงาน PDF/รูปภาพ คืนครูผู้สอน</p>
              </div>
            </button>

            <button
              onClick={() => setView('exam')}
              className="bg-gradient-to-br from-[#161b22] to-[#0d1117] border border-[#30363d] hover:border-[#d4af37] hover:shadow-lg p-5 rounded-2xl flex items-center gap-4 text-left transition-all group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-xl bg-[#0d1117] border border-[#30363d] text-[#d4af37] group-hover:bg-[#d4af37]/10 flex items-center justify-center shrink-0 transition-colors">
                <FileQuestion className="w-6 h-6" />
              </div>
              <div className="min-w-0">
                <h4 className="font-sans font-bold text-sm text-[#f0f6fc] group-hover:text-[#d4af37] transition-colors">3) "ทำข้อสอบ"</h4>
                <p className="font-sans text-[11px] text-[#8b949e] mt-0.5 truncate">ทำแบบทดสอบและวัดผลออนไลน์กลางภาค</p>
              </div>
            </button>

          </div>
        </section>
      )}

      {/* Bento Grid Stats */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        
        {/* Stat 1: Average Grade */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 flex flex-col gap-3 shadow-sm hover:border-[#d4af37] hover:shadow-md transition-all duration-200 group relative overflow-hidden">
          <div className="flex items-center justify-between text-[#8b949e] group-hover:text-[#d4af37] transition-colors">
            <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-[#8b949e]">ผลการเรียนประเมินรวม</span>
            <TrendingUp className="w-5 h-5 text-[#d4af37]" />
          </div>
          <div className="font-mono text-3xl md:text-4xl text-[#f0f6fc] font-bold">{averageGrade}%</div>
          <span className="font-sans text-[11px] text-[#8b949e] mt-auto">เทียบเท่ากับเกรดเฉลี่ยสูงสุด 10% แรกของรุ่น</span>
          <div className="absolute -right-12 -top-12 w-32 h-32 border border-[#d4af37]/5 rounded-full pointer-events-none"></div>
        </div>

        {/* Stat 2: Syllabus Progress */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 flex flex-col gap-3 shadow-sm hover:border-[#d4af37] hover:shadow-md transition-all duration-200 group relative overflow-hidden">
          <div className="flex items-center justify-between text-[#8b949e] group-hover:text-[#d4af37] transition-colors">
            <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-[#8b949e]">ความก้าวหน้าบทเรียน</span>
            <Award className="w-5 h-5 text-[#d4af37]" />
          </div>
          <div className="font-mono text-3xl md:text-4xl text-[#f0f6fc] font-bold">14/20 <span className="text-xs opacity-50 font-sans font-normal">หัวข้อ</span></div>
          <div className="w-full bg-[#0d1117] border border-[#30363d]/50 rounded-full h-1.5 mt-2 overflow-hidden">
            <div className="bg-[#d4af37] h-full rounded-full transition-all duration-500" style={{ width: '70%' }}></div>
          </div>
          <div className="absolute -right-12 -top-12 w-32 h-32 border border-[#d4af37]/5 rounded-full pointer-events-none"></div>
        </div>

        {/* Stat 3: Tasks Completed */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 flex flex-col gap-3 shadow-sm hover:border-[#d4af37] hover:shadow-md transition-all duration-200 group relative overflow-hidden">
          <div className="flex items-center justify-between text-[#8b949e] group-hover:text-[#d4af37] transition-colors">
            <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-[#8b949e]">จำนวนงานที่ส่งแล้ว</span>
            <CheckCircle className="w-5 h-5 text-[#d4af37]" />
          </div>
          <div className="font-mono text-3xl md:text-4xl text-[#f0f6fc] font-bold">{tasksCompleted} / 5 <span className="text-xs opacity-50 font-sans font-normal">งาน</span></div>
          <span className="font-sans text-[11px] text-[#8b949e] mt-auto">
            {assignmentStatus === 'Pending' ? 'ส่งการบ้านแล้ว รอครูผู้สอนให้คะแนน' : 'ยังเหลืออีก 1 งานที่ค้างส่งในบทเรียนนี้'}
          </span>
          <div className="absolute -right-12 -top-12 w-32 h-32 border border-[#d4af37]/5 rounded-full pointer-events-none"></div>
        </div>

      </section>

      {/* Main Grid: Recent Lessons and Upcoming Assignments */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Recent Lessons (Span 2) */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="flex justify-between items-end mb-2">
            <h3 className="font-sans text-sm font-semibold text-[#f0f6fc] uppercase tracking-wider">บทเรียนคอมพิวเตอร์ล่าสุด</h3>
            <button 
              onClick={() => setView('course')} 
              className="font-sans text-xs font-semibold text-[#d4af37] hover:text-[#aa8e2d] hover:underline flex items-center gap-1.5 group transition-all cursor-pointer"
            >
              <span>ดูสารบัญหลักสูตรทั้งหมด</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* Lesson Card 1: Active */}
          <div className="bg-[#161b22] border border-[#30363d] border-t-2 border-t-[#d4af37] rounded-2xl p-6 hover:shadow-md transition-all duration-200">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
              <div>
                <span className="inline-block px-2.5 py-1 bg-[#0d1117] border border-[#30363d] text-[#d4af37] font-mono text-[9px] font-bold rounded-lg mb-2 uppercase tracking-wider">บทเรียนหลัก</span>
                <h4 className="font-sans font-semibold text-lg text-[#f0f6fc] leading-tight">
                  ขั้นตอนวิธีและการแก้ปัญหาเบื้องต้น (Python Programming)
                </h4>
                <p className="font-sans text-xs md:text-sm text-[#8b949e] mt-1.5 max-w-xl leading-relaxed">
                  เรียนรู้โครงสร้างโปรแกรม การรับค่า-แสดงผล และการเขียนผังงานเพื่อประมวลผลอัลกอริทึมอย่างเป็นขั้นตอน
                </p>
              </div>
              <button 
                onClick={() => setView('course')}
                className="w-full sm:w-auto bg-[#d4af37] hover:bg-[#aa8e2d] text-[#0a0c10] font-sans text-xs font-bold px-5 py-3 rounded-xl transition-all shadow-sm shrink-0 text-center cursor-pointer"
              >
                เรียนต่อ
              </button>
            </div>
            
            <div className="flex items-center gap-4 mt-2">
              <div className="flex-grow bg-[#0d1117] border border-[#30363d]/30 rounded-full h-1.5 overflow-hidden">
                <div className="bg-[#d4af37] h-full rounded-full" style={{ width: '65%' }}></div>
              </div>
              <span className="font-mono text-xs font-bold text-[#8b949e] min-w-[32px] text-right">65%</span>
            </div>
          </div>

          {/* Lesson Card 2: Completed */}
          <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 hover:shadow-md transition-all duration-200">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
              <div>
                <span className="inline-block px-2.5 py-1 bg-[#0d1117] border border-[#30363d] text-[#8b949e] font-mono text-[9px] font-bold rounded-lg mb-2 uppercase tracking-wider">บทที่เรียนจบแล้ว</span>
                <h4 className="font-sans font-semibold text-lg text-[#f0f6fc] leading-tight">
                  เทคโนโลยีสารสนเทศและกระบวนการทำงานคอมพิวเตอร์
                </h4>
                <p className="font-sans text-xs md:text-sm text-[#8b949e] mt-1.5 max-w-xl leading-relaxed">
                  องค์ประกอบของระบบคอมพิวเตอร์ หน่วยรับข้อมูล หน่วยประมวลผลกลาง และหน่วยแสดงผลข้อมูล
                </p>
              </div>
              <button 
                onClick={() => { setView('course'); alert("โหมดทบทวนข้อมูล: บทเรียนคอมพิวเตอร์และกระบวนการทำงานได้รับการบันทึกว่าเรียนเสร็จสิ้น 100%"); }}
                className="w-full sm:w-auto bg-[#0d1117] border border-[#30363d] hover:border-[#d4af37] text-[#f0f6fc] hover:bg-[#161b22] font-sans text-xs font-bold px-5 py-3 rounded-xl transition-all shrink-0 text-center cursor-pointer"
              >
                ทบทวน
              </button>
            </div>
            
            <div className="flex items-center gap-4 mt-2">
              <div className="flex-grow bg-[#0d1117] border border-[#30363d]/30 rounded-full h-1.5 overflow-hidden">
                <div className="bg-[#484f58] h-full rounded-full" style={{ width: '100%' }}></div>
              </div>
              <span className="font-mono text-xs font-bold text-[#8b949e] min-w-[32px] text-right">100%</span>
            </div>
          </div>

        </div>

        {/* Right Column: Upcoming Assignments & Practice Exams */}
        <div className="flex flex-col gap-4">
          <div className="mb-2">
            <h3 className="font-sans text-sm font-semibold text-[#f0f6fc] uppercase tracking-wider">ตารางงานและแบบทดสอบ</h3>
          </div>

          <div className="bg-[#161b22] border border-[#30363d] rounded-2xl overflow-hidden shadow-sm">
            {/* Headers */}
            <div className="bg-[#0d1117] px-4 py-2.5 border-b border-[#30363d] flex justify-between font-mono text-[9px] uppercase font-bold text-[#8b949e] tracking-widest">
              <span>รายการกิจกรรม / ชิ้นงาน</span>
              <span>กำหนดส่ง</span>
            </div>

            {/* List */}
            <ul className="flex flex-col divide-y divide-[#30363d]">
              
              {/* Task 1 */}
              <li 
                onClick={() => setView('course')}
                className="p-4 hover:bg-[#0d1117]/50 transition-all flex justify-between items-center cursor-pointer group"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-[#0d1117] border border-[#30363d] text-red-400 rounded-xl mt-0.5 animate-pulse">
                    <Code className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-sans text-xs font-bold text-[#f0f6fc] group-hover:text-[#d4af37] transition-colors">
                      ใบงานแล็บส่งโค้ดคอมพิวเตอร์ Python
                    </div>
                    <div className="font-sans text-[10px] text-[#8b949e] mt-0.5">วิชาคอมพิวเตอร์ 1</div>
                  </div>
                </div>
                <div className="text-right flex flex-col items-end shrink-0">
                  <span className="font-mono text-xs font-bold text-red-400">พรุ่งนี้</span>
                  <span className="font-sans text-[9px] text-[#d4af37] opacity-0 group-hover:opacity-100 transition-opacity">ส่งชิ้นงาน</span>
                </div>
              </li>

              {/* Task 2 */}
              <li 
                onClick={() => { setView('course'); alert("โปรดดูรายละเอียดในหน่วยเรียนรู้ย่อย 1.2 เพื่อดาวน์โหลดแบบร่างใบงานเขียนอธิบายคำตอบ"); }}
                className="p-4 hover:bg-[#0d1117]/50 transition-all flex justify-between items-center cursor-pointer group"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-[#0d1117] border border-[#30363d] text-[#8b949e] rounded-xl mt-0.5">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-sans text-xs font-bold text-[#f0f6fc] group-hover:text-[#d4af37] transition-colors">
                      ใบงานสรุปหลักการทำงานผังงาน
                    </div>
                    <div className="font-sans text-[10px] text-[#8b949e] mt-0.5">บทที่ 1</div>
                  </div>
                </div>
                <div className="text-right flex flex-col items-end shrink-0">
                  <span className="font-sans text-xs font-medium text-[#8b949e]">24 ต.ค.</span>
                  <span className="font-sans text-[9px] text-[#d4af37] opacity-0 group-hover:opacity-100 transition-opacity">ส่งชิ้นงาน</span>
                </div>
              </li>

              {/* Task 3 */}
              <li 
                onClick={() => setView('exam')}
                className="p-4 hover:bg-[#0d1117]/50 transition-all flex justify-between items-center cursor-pointer group"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-[#0d1117] border border-[#30363d] text-[#d4af37] rounded-xl mt-0.5">
                    <FileQuestion className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-sans text-xs font-bold text-[#f0f6fc] group-hover:text-[#d4af37] transition-colors">
                      แบบทดสอบจำลองสอบกลางภาค
                    </div>
                    <div className="font-sans text-[10px] text-[#8b949e] mt-0.5">ประเมินทักษะบทที่ 1-2</div>
                  </div>
                </div>
                <div className="text-right flex flex-col items-end shrink-0">
                  <span className="font-sans text-xs font-medium text-[#8b949e]">28 ต.ค.</span>
                  <span className="font-sans text-[9px] text-[#d4af37] font-bold opacity-0 group-hover:opacity-100 transition-opacity">เริ่มทำทดสอบ</span>
                </div>
              </li>

            </ul>
          </div>
        </div>

      </div>

    </div>
  );
}
