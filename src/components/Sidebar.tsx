import React from 'react';
import { 
  School, 
  LayoutDashboard, 
  BookOpen, 
  FileText, 
  GraduationCap, 
  User, 
  Users,
  Settings, 
  LogOut 
} from 'lucide-react';
import { ViewType, UserRole } from '../types';

interface SidebarProps {
  currentView: ViewType;
  setView: (view: ViewType) => void;
  role: UserRole;
  setRole: (role: UserRole) => void;
  onLogout: () => void;
  schoolLogo?: string;
  activeAdminTab?: 'grades' | 'lessons' | 'exams' | 'files' | 'users' | 'settings';
  setActiveAdminTab?: (tab: 'grades' | 'lessons' | 'exams' | 'files' | 'users' | 'settings') => void;
}

const schoolLogoUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuDjqn3HC4TuXM8YGx5YF0iMBGjEymfzRKfh6dU4v5V5232SWFGDQ4bKLNhDcHjvpcwbuhhxGYx7LwSf6x3WfKV3B5FuRhpDbn-7BTA52h4rydheCGRXMngAwlqw1z65_WHfmQyHof5O2MXg3je8a3i41p-ctPGJbx_WUX02tE-DTGsQ_dx-TPeGoqgmgCZMWifVQDA1KTzbr0bOqL6SxgAZ-OU_98DQPx-SwyRYgB8Y6OORS4f7d26YezFKD-hmGaF55A5fgxF4rbs";

export default function Sidebar({ 
  currentView, 
  setView, 
  role, 
  setRole, 
  onLogout, 
  schoolLogo,
  activeAdminTab,
  setActiveAdminTab
}: SidebarProps) {
  
  // Custom navigation items per role
  const menuItems = role === 'admin' ? [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'academic', label: 'Academic Setup', icon: BookOpen },
    { id: 'reports', label: 'System Reports', icon: FileText },
    { id: 'settings', label: 'System Settings', icon: Settings },
  ] : role === 'teacher' ? [
    { id: 'dashboard', label: 'แผงควบคุม', icon: LayoutDashboard },
    { id: 'course', label: 'หลักสูตรและบทเรียน', icon: BookOpen },
    { id: 'grades', label: 'ระบบจัดการคะแนน', icon: FileText },
  ] : [
    { id: 'dashboard', label: 'แผงควบคุม', icon: LayoutDashboard },
    { id: 'course', label: 'หลักสูตรและบทเรียน', icon: BookOpen },
    { id: 'exam', label: 'ฝึกทำข้อสอบจำลอง', icon: GraduationCap },
  ];

  const handleItemClick = (itemId: string) => {
    if (role === 'admin') {
      setView('grades');
      if (setActiveAdminTab) {
        if (itemId === 'dashboard') setActiveAdminTab('grades');
        else if (itemId === 'users') setActiveAdminTab('users');
        else if (itemId === 'academic') setActiveAdminTab('lessons');
        else if (itemId === 'reports') setActiveAdminTab('exams');
        else if (itemId === 'settings') setActiveAdminTab('settings');
      }
    } else {
      setView(itemId as ViewType);
    }
  };

  return (
    <aside className="hidden lg:flex flex-col h-screen fixed left-0 top-0 py-6 z-40 bg-[#0d1117] w-[280px] border-r border-[#30363d] text-[#8b949e]">
      {/* School Branding */}
      <div className="px-6 mb-8 flex items-center gap-3.5">
        <div className="w-11 h-11 rounded-full bg-[#161b22] flex items-center justify-center shrink-0 border border-[#d4af37] p-0.5">
          <img 
            alt="School Logo" 
            className={`w-9 h-9 object-contain rounded-full ${
              (!schoolLogo || schoolLogo === schoolLogoUrl || schoolLogo.includes('lh3.googleusercontent.com')) ? 'invert brightness-0' : ''
            }`}
            src={schoolLogo || schoolLogoUrl}
            referrerPolicy="no-referrer"
          />
        </div>
        <div>
          <h1 className="font-display font-light text-[#f0f6fc] text-base leading-tight uppercase tracking-widest italic" style={{ fontFamily: 'Georgia, serif' }}>Soeng Sang</h1>
          <p className="font-sans text-[10px] text-[#d4af37] font-extrabold tracking-widest uppercase mt-0.5">ADMIN</p>
        </div>
      </div>

      {/* Role Indicator/Switcher - 3 buttons (Student, Teacher, Admin) with Admin highlighted in Gold */}
      <div className="px-4 mb-6">
        <div className="bg-[#161b22] rounded-xl p-2.5 border border-[#30363d] flex flex-col gap-1.5">
          <span className="font-sans text-[9px] text-[#8b949e] uppercase tracking-widest px-1 font-bold">การจำลองบทบาทสิทธิ์</span>
          <div className="flex bg-[#0d1117] rounded-lg p-1 relative border border-[#30363d] gap-1">
            <button
              onClick={() => { setRole('student'); setView('dashboard'); }}
              className={`flex-1 py-1.5 px-1 rounded-md font-sans text-[10px] font-bold text-center transition-all cursor-pointer ${
                role === 'student' 
                  ? 'bg-[#d4af37]/15 text-[#d4af37] border border-[#d4af37]/30 shadow-sm font-extrabold' 
                  : 'text-[#8b949e] hover:text-[#f0f6fc]'
              }`}
            >
              Student
            </button>
            <button
              onClick={() => { setRole('teacher'); setView('grades'); if (setActiveAdminTab) setActiveAdminTab('grades'); }}
              className={`flex-1 py-1.5 px-1 rounded-md font-sans text-[10px] font-bold text-center transition-all cursor-pointer ${
                role === 'teacher' 
                  ? 'bg-[#d4af37]/15 text-[#d4af37] border border-[#d4af37]/30 shadow-sm font-extrabold' 
                  : 'text-[#8b949e] hover:text-[#f0f6fc]'
              }`}
            >
              Teacher
            </button>
            <button
              onClick={() => { setRole('admin'); setView('grades'); if (setActiveAdminTab) setActiveAdminTab('grades'); }}
              className={`flex-1 py-1.5 px-1 rounded-md font-sans text-[10px] text-center transition-all cursor-pointer ${
                role === 'admin' 
                  ? 'bg-[#d4af37] text-[#0a0c10] font-extrabold shadow-md' 
                  : 'text-[#8b949e] hover:text-[#f0f6fc]'
              }`}
            >
              Admin
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 flex flex-col gap-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          
          let isActive = false;
          if (role === 'admin') {
            if (item.id === 'dashboard') isActive = activeAdminTab === 'grades';
            else if (item.id === 'users') isActive = activeAdminTab === 'users';
            else if (item.id === 'academic') isActive = activeAdminTab === 'lessons';
            else if (item.id === 'reports') isActive = activeAdminTab === 'exams' || activeAdminTab === 'files';
            else if (item.id === 'settings') isActive = activeAdminTab === 'settings';
          } else {
            isActive = currentView === item.id;
          }

          return (
            <button
              key={item.id}
              onClick={() => handleItemClick(item.id)}
              className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-150 font-sans text-xs font-medium text-left cursor-pointer ${
                isActive 
                  ? 'bg-[#d4af3711] text-[#d4af37] border-l-2 border-[#d4af37] translate-x-1' 
                  : 'text-[#8b949e] hover:text-[#f0f6fc] hover:bg-[#161b22]'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-[#d4af37]' : 'text-[#8b949e]'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer Version Info */}
      <div className="px-6 mb-4 text-[9px] text-[#484f58] uppercase tracking-wider font-semibold font-mono">
        โรงเรียนเสิงสาง • สาระคอมพิวเตอร์
      </div>

      {/* Footer Links */}
      <div className="px-3 flex flex-col gap-1 pt-4 border-t border-[#30363d]">
        <button 
          onClick={() => alert("ระบบตั้งค่าแบบแอดมินสามารถกำหนดได้ผ่านแผงหลัก")}
          className="flex items-center gap-4 px-4 py-3 rounded-xl text-[#8b949e] hover:text-[#f0f6fc] hover:bg-[#161b22] font-sans text-xs text-left cursor-pointer"
        >
          <Settings className="w-4 h-4 text-[#8b949e]" />
          <span>ตั้งค่าระบบ</span>
        </button>
        <button 
          onClick={onLogout}
          className="flex items-center gap-4 px-4 py-3 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/5 font-sans text-xs text-left cursor-pointer"
        >
          <LogOut className="w-4 h-4 text-red-400" />
          <span>ออกจากระบบ</span>
        </button>
      </div>
    </aside>
  );
}
