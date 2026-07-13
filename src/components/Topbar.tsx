import React, { useState } from 'react';
import { Search, Bell, HelpCircle, Menu } from 'lucide-react';
import { ViewType, UserRole } from '../types';

interface TopbarProps {
  currentView: ViewType;
  role: UserRole;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  userFullName?: string;
  classroom?: string;
  siteTitle?: string;
  profilePic?: string;
}

const studentAvatar = "https://lh3.googleusercontent.com/aida-public/AB6AXuDY90rLbUIpGsV3qcw3FcZgCR1Eku5XZ67mVfYzGuEMRjnH8gcK4m1xWqo9zgqsUr5zaXiAqmpDo92YEhT5Re7aOuYJdcolrwdVquy75eoz3dI-KAKVs_KlkqkdLdwzUHieLb88KKzOXEEieccgsnhI9lcGnEVJgAufiTDbR7eJ0rfp61fDDzPxYdvpL88z5rz-3V3BXRBmJYlSPzxqIkzILpHKgcGfeOVKH9ta7I37q9bjQ1bQ4a5aDEsOWahlY0M7VOF3MJ1lwig";
const teacherAvatar = "https://lh3.googleusercontent.com/aida-public/AB6AXuDdnwwWvzNJmRUQ2Hcp7FyQEtgtsWPAE5F3t6B4j0gAxDhneRqfzvp7HU6A7zd0SdTlJ8qJzI__ODiwFOOp397TqlO5QGVmj9lS84I4bUgrwxQb03wx5sjQ37HSaIdTrOZTRQkvsIB3MbML_zqEEn6WnR0qjgEGvBVd3Z64u6NMchnyDciufl5Q0Y3FUuM9unxobqyQZF2bHTBtyokWEQJ0XHkycQx25lLQYRHc0zjndOnh3-esYyGPXcff2_6AlkQSMQQOHTBFBn8";

export default function Topbar({ 
  currentView, 
  role, 
  searchQuery, 
  setSearchQuery, 
  mobileMenuOpen, 
  setMobileMenuOpen,
  userFullName = "อเล็กซ์ ทัวริง",
  classroom = "M.1/1",
  siteTitle = "ระบบจัดการเรียนรู้ (LMS) - โรงเรียนเสิงสาง",
  profilePic
}: TopbarProps) {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [showNotificationBadge, setShowNotificationBadge] = useState(true);

  const getTitle = () => {
    switch (currentView) {
      case 'dashboard':
        return role === 'teacher' ? 'แผงควบคุมหลักสูตรคุณครู' : 'แผงการเรียนของฉัน';
      case 'course':
        return 'เนื้อหาและกิจกรรมการเรียน';
      case 'exam':
        return 'ระบบจำลองข้อสอบคอมพิวเตอร์';
      case 'grades':
        return 'ระบบประเมินผลคะแนน';
      default:
        return siteTitle;
    }
  };

  const getPlaceholder = () => {
    if (currentView === 'grades') return 'ค้นหารายชื่อนักเรียน...';
    return 'ค้นหาบทเรียน หัวข้อ แบบฝึกหัด...';
  };

  const handleNotificationsClick = () => {
    setNotificationsOpen(!notificationsOpen);
    setShowNotificationBadge(false);
  };

  const sampleNotifications = [
    { id: 1, text: "แบบฝึกหัด 'Logic Gates' ได้รับการตรวจและลงคะแนนแล้ว", time: "10 นาทีที่แล้ว", read: false },
    { id: 2, text: "อัปโหลดบทเรียนใหม่ '1.2 ฮาร์ดแวร์และซอฟต์แวร์'", time: "2 ชั่วโมงที่แล้ว", read: true },
    { id: 3, text: "คะแนนสอบกลางภาคจำลองพร้อมให้ตรวจทานแล้ว", time: "1 วันที่แล้ว", read: true },
  ];

  // Helper to translate classroom display to Thai
  const translateClassroom = (cls: string) => {
    if (cls === 'M.1/1') return 'มัธยมศึกษาปีที่ 1/1';
    if (cls === 'M.1/2') return 'มัธยมศึกษาปีที่ 1/2';
    if (cls === 'M.1/3') return 'มัธยมศึกษาปีที่ 1/3';
    return cls;
  };

  return (
    <header className="bg-[#0d1117] border-b border-[#30363d] flex justify-between items-center w-full px-4 lg:px-8 py-3.5 z-30 sticky top-0 shadow-md">
      <div className="flex items-center gap-3">
        {/* Mobile menu trigger */}
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-1.5 hover:bg-[#161b22] rounded-full text-[#8b949e] transition-colors cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h2 className="font-sans text-sm lg:text-base font-semibold text-[#f0f6fc] tracking-wider select-none">
          {getTitle()}
        </h2>
      </div>

      <div className="flex items-center gap-4 ml-auto">
        {/* Search Bar */}
        {currentView !== 'exam' && (
          <div className="relative hidden md:flex items-center">
            <Search className="w-4 h-4 absolute left-3.5 text-[#8b949e] pointer-events-none" />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[#161b22] border border-[#30363d] hover:border-[#484f58] focus:border-[#d4af37] rounded-full py-1.5 pl-10 pr-4 text-xs font-sans text-[#f0f6fc] outline-none w-64 transition-all focus:ring-1 focus:ring-[#d4af37]/30 placeholder:text-[#484f58]" 
              placeholder={getPlaceholder()}
            />
          </div>
        )}

        {/* Notifications and Badges */}
        <div className="relative">
          <button 
            onClick={handleNotificationsClick}
            className="p-2 hover:bg-[#161b22] rounded-full text-[#8b949e] hover:text-[#f0f6fc] transition-colors relative scale-98 duration-150 ease-in-out cursor-pointer"
          >
            <Bell className="w-5 h-5" />
            {showNotificationBadge && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[#d4af37] rounded-full ring-2 ring-[#0d1117] animate-pulse"></span>
            )}
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2.5 w-80 bg-[#0d1117] border border-[#30363d] rounded-xl shadow-2xl z-50 overflow-hidden divide-y divide-[#30363d] animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="p-3 bg-[#161b22] font-sans font-semibold text-xs text-[#d4af37] flex justify-between items-center">
                <span className="uppercase tracking-wider">การแจ้งเตือน</span>
                <button 
                  onClick={() => setShowNotificationBadge(true)}
                  className="text-[10px] text-[#d4af37] hover:underline uppercase tracking-wider cursor-pointer"
                >
                  ทำเครื่องหมายว่ายังไม่ได้อ่านทั้งหมด
                </button>
              </div>
              <div className="max-h-64 overflow-y-auto bg-[#0d1117]">
                {sampleNotifications.map((notif) => (
                  <div key={notif.id} className="p-3 hover:bg-[#161b22]/50 transition-colors flex flex-col gap-1 border-b border-[#30363d]/50 text-left">
                    <p className="font-sans text-xs text-[#f0f6fc] leading-snug">{notif.text}</p>
                    <span className="font-sans text-[10px] text-[#8b949e]">{notif.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Help button */}
        <button 
          onClick={() => alert("ยินดีต้อนรับสู่ระบบสารสนเทศวิชาคอมพิวเตอร์ โรงเรียนเสิงสาง!\n\n- ใช้แถบด้านข้างเพื่อสลับเรียนหลักสูตร ส่งงานการบ้าน ทำข้อสอบกลางภาคจำลอง และตรวจคะแนนผลการเรียน\n- หากเข้าใช้งานด้วยบัญชีคุณครู จะสามารถบริหารเกรดและผลคะแนนรวมของนักเรียนทุกห้องเรียนได้ในแท็บ ระบบจัดการคะแนน")}
          className="p-2 hover:bg-[#161b22] rounded-full text-[#8b949e] hover:text-[#f0f6fc] transition-colors hidden sm:block cursor-pointer"
        >
          <HelpCircle className="w-5 h-5" />
        </button>

        <div className="h-6 w-px bg-[#30363d] hidden sm:block"></div>

        {/* Profile Avatar & Metadata */}
        <div className="flex items-center gap-2.5 select-none">
          <div className="hidden lg:flex flex-col text-right">
            <span className="font-sans text-xs font-semibold text-[#f0f6fc] leading-tight">
              {userFullName}
            </span>
            <span className="font-sans text-[10px] text-[#8b949e] tracking-wider uppercase">
              {role === 'teacher' ? 'อาจารย์ผู้สอน' : `นักเรียนชั้น ${translateClassroom(classroom)}`}
            </span>
          </div>
          <div className="w-10 h-10 rounded-full overflow-hidden border border-[#d4af37] p-0.5 cursor-pointer hover:border-[#aa8e2d] transition-all">
            <img 
              alt="User profile avatar" 
              className="w-full h-full object-cover rounded-full bg-[#161b22]" 
              src={profilePic || (role === 'teacher' ? teacherAvatar : studentAvatar)}
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
