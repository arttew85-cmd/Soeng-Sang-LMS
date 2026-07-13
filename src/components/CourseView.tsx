import React, { useState, useRef } from 'react';
import { 
  Play, 
  Pause, 
  Volume2, 
  Maximize, 
  Clock, 
  Eye, 
  Check, 
  Lock, 
  AlertCircle, 
  UploadCloud, 
  Send,
  FileCheck,
  Trash2,
  BookOpen,
  PlayCircle,
  Download
} from 'lucide-react';
import { Lesson, AssignmentState, Worksheet, TeachingFile } from '../types';

interface CourseViewProps {
  lessons: Lesson[];
  assignmentState: AssignmentState;
  onUpdateAssignment: (updater: Partial<AssignmentState>) => void;
  onSubmitAssignment: () => void;
  worksheets?: Worksheet[];
  teachingFiles?: TeachingFile[];
  classroom?: string;
}

const videoThumbnailUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuDeDX8jwfPHuERT_-8RZ6pK4GllFqNc7ojNDFuUOAj9hBsKckbvDj23XHwma_yvL_QMKFCSNlOLVJgAS8XEE-fkQniLWb6sWhejnmZvS9LyutCIDj69ZdiJo2Y4wztFBpJxIM8vKX01r6wPB8Fll7yUjN6DWVTJmQv_ntrDDpIEzRboDofnRxWPNthhEoGW1hr7edVRma1Fk_KUKfMulKK0t0t6fN66oL9APhnJamQsROQbGPx1NJm3A2LRvJxUEq-RvXiIwcP6RLE";

export default function CourseView({ 
  lessons, 
  assignmentState, 
  onUpdateAssignment, 
  onSubmitAssignment,
  worksheets = [],
  teachingFiles = [],
  classroom = 'M.1/1'
}: CourseViewProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoProgress, setVideoProgress] = useState(33); // 33% progress initially
  const [comments, setComments] = useState(assignmentState.comment);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleVideoPlayToggle = () => {
    setIsPlaying(!isPlaying);
  };

  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const progressPercent = Math.round((clickX / rect.width) * 100);
    setVideoProgress(progressPercent);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      onUpdateAssignment({
        fileName: file.name,
        fileSize: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
        status: 'Draft'
      });
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      onUpdateAssignment({
        fileName: file.name,
        fileSize: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
        status: 'Draft'
      });
    }
  };

  const handleRemoveFile = () => {
    onUpdateAssignment({
      fileName: null,
      fileSize: null,
      status: 'Not Submitted'
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSaveDraft = () => {
    onUpdateAssignment({
      comment: comments,
      status: assignmentState.fileName ? 'Draft' : 'Not Submitted'
    });
    alert("บันทึกร่างใบงานชิ้นงานและข้อมูลของคุณไว้บนเครื่องชั่วคราวแล้ว!");
  };

  const handleCancelSubmit = () => {
    if (window.confirm("คุณแน่ใจหรือไม่ว่าต้องการยกเลิกการส่งใบงานชิ้นนี้? เพื่อทำการอัปโหลดไฟล์ใหม่หรือปรับปรุงข้อความเพิ่มเติม")) {
      onUpdateAssignment({
        status: 'Draft'
      });
      alert("ยกเลิกการส่งใบงานเรียบร้อยแล้ว สถานะกลับสู่ฉบับร่าง (Draft) คุณสามารถดำเนินการแก้ไข ลบไฟล์ และเลือกไฟล์อัปโหลดส่งใหม่อีกครั้ง");
    }
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignmentState.fileName) {
      alert("กรุณาเลือกหรืออัปโหลดไฟล์ชิ้นงานของคุณก่อนคลิกส่งใบงาน!");
      return;
    }
    onUpdateAssignment({ comment: comments });
    onSubmitAssignment();
    alert("ใบงานวิชาคอมพิวเตอร์ของคุณได้รับการบันทึกและส่งมอบให้ครูผู้สอนตรวจเรียบร้อย!");
  };

  return (
    <div className="flex-grow p-4 md:p-6 lg:p-8 max-w-[1280px] w-full mx-auto select-none animate-in fade-in duration-200 flex flex-col xl:flex-row gap-8">
      
      {/* Left Column: Video, Desc, Assignment Submission */}
      <div className="flex-grow flex flex-col gap-8 min-w-0 xl:max-w-[70%]">
        
        {/* Video Player Container */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-2xl overflow-hidden shadow-md flex flex-col group/player">
          
          <div className="relative w-full aspect-video bg-[#0a0c10] flex items-center justify-center cursor-pointer select-none">
            {/* Thumbnail Placeholder */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[#0a0c10] to-[#d4af37]/15 opacity-80 z-0"></div>
            <img 
              alt="Video Thumbnail" 
              className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-30 z-0" 
              src={videoThumbnailUrl}
              referrerPolicy="no-referrer"
            />

            {/* Play/Pause Button Overlay */}
            <button 
              onClick={handleVideoPlayToggle}
              className="absolute z-10 w-16 h-16 bg-white/10 hover:bg-[#d4af37]/20 backdrop-blur-md rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-all duration-300 border border-[#d4af37]/30 text-[#d4af37] shadow-lg cursor-pointer"
            >
              {isPlaying ? (
                <Pause className="w-8 h-8 fill-[#d4af37] text-[#d4af37]" />
              ) : (
                <Play className="w-8 h-8 fill-[#d4af37] text-[#d4af37] translate-x-0.5" />
              )}
            </button>

            {/* Video Controls Bar (Interactive on hover) */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex flex-col gap-2 opacity-0 group-hover/player:opacity-100 transition-opacity duration-300 z-10">
              
              {/* Progress Bar */}
              <div 
                onClick={handleProgressBarClick}
                className="w-full h-1 bg-white/20 hover:h-1.5 rounded-full cursor-pointer relative transition-all"
              >
                <div 
                  className="absolute left-0 top-0 h-full bg-[#d4af37] rounded-full flex items-center justify-end" 
                  style={{ width: `${videoProgress}%` }}
                >
                  <div className="w-3 h-3 bg-[#f0f6fc] rounded-full shadow absolute -right-1.5 ring-2 ring-[#d4af37]/40"></div>
                </div>
              </div>

              {/* Time Metrics & Vol & FS */}
              <div className="flex justify-between items-center text-[#f0f6fc] font-mono text-[11px] px-1">
                <div className="flex items-center gap-3">
                  <button onClick={handleVideoPlayToggle} className="hover:text-[#d4af37] cursor-pointer bg-transparent border-0">
                    {isPlaying ? <Pause className="w-3.5 h-3.5 fill-[#f0f6fc]" /> : <Play className="w-3.5 h-3.5 fill-[#f0f6fc]" />}
                  </button>
                  <span>{Math.floor((45 * videoProgress) / 100)}:00 / 45:00</span>
                </div>
                <div className="flex items-center gap-3">
                  <Volume2 className="w-4 h-4 hover:text-[#d4af37] cursor-pointer" />
                  <Maximize className="w-4 h-4 hover:text-[#d4af37] cursor-pointer" />
                </div>
              </div>

            </div>

          </div>

          {/* Video Metadata */}
          <div className="p-6 border-t border-[#30363d]">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-0.5 bg-[#0d1117] border border-[#30363d] text-[#d4af37] rounded font-mono text-[9px] font-bold uppercase tracking-wider">บทเรียนหลัก</span>
              <span className="w-1 h-1 bg-[#30363d] rounded-full"></span>
              <span className="font-sans text-[10px] text-[#8b949e] font-bold tracking-wider">หน่วยเรียนรู้ที่ 1.1</span>
            </div>
            <h2 className="font-sans font-semibold text-xl md:text-2xl text-[#f0f6fc] mb-3">
              วิทยาการคอมพิวเตอร์และเทคโนโลยีขั้นพื้นฐาน
            </h2>
            <div className="flex items-center gap-5 border-b border-[#30363d] pb-4 mb-4">
              <div className="flex items-center gap-1.5 text-[#8b949e] font-sans text-xs">
                <Clock className="w-4 h-4 text-[#8b949e]" />
                <span>ความยาววิดีโอ 45 นาที</span>
              </div>
              <div className="flex items-center gap-1.5 text-[#8b949e] font-sans text-xs">
                <Eye className="w-4 h-4 text-[#8b949e]" />
                <span>ยอดรับชม 1.2k ครั้ง</span>
              </div>
            </div>

            {/* Lecture Content Description */}
            <div className="font-sans text-[#8b949e] text-xs md:text-sm leading-relaxed space-y-4">
              <p>
                ยินดีต้อนรับเข้าสู่หลักสูตรพื้นฐานวิทยาการคำนวณและเทคโนโลยีสารสนเทศ ในคาบเรียนนี้เราจะมาเจาะลึกโครงสร้างพื้นฐานในการทำงานของระบบคอมพิวเตอร์และสถาปัตยกรรมหน่วยประมวลผล รวมถึงการคิดเชิงคำนวณเป็นขั้นตอนวิธี (Algorithmic Thinking) ซึ่งเป็นทักษะสำคัญในการเขียนโปรแกรมคอมพิวเตอร์
              </p>
              <p className="font-semibold text-[#f0f6fc]">สิ่งที่นักเรียนจะได้รับและทำได้หลังจากจบคาบเรียนนี้:</p>
              <ul className="list-disc pl-5 space-y-2 mt-2 font-medium text-[#8b949e]">
                <li>จำแนกและอธิบายความแตกต่างหน้าที่ระหว่างฮาร์ดแวร์และซอฟต์แวร์ได้อย่างชัดเจน</li>
                <li>บอกเล่าประวัติและขั้นตอนสำคัญในการเปลี่ยนแปลงของเทคโนโลยีสารสนเทศ</li>
                <li>อธิบายความหมายของขั้นตอนวิธีหรืออัลกอริทึม (Algorithm) ในคำจำกัดความที่เข้าใจง่าย</li>
              </ul>
            </div>

            {/* Dynamic Teaching Materials Download section */}
            {teachingFiles.length > 0 && (
              <div className="mt-8 pt-6 border-t border-[#30363d]">
                <h3 className="font-sans font-bold text-xs text-[#d4af37] tracking-wider uppercase mb-3 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4" />
                  <span>เอกสารดาวน์โหลดและสื่อการเรียนการสอนคู่ขนาน</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {teachingFiles.map((file) => (
                    <div 
                      key={file.id} 
                      onClick={() => alert(`จำลองการดาวน์โหลดไฟล์: ${file.name}\nขนาด: ${file.size}\nดาวน์โหลดสำเร็จ!`)}
                      className="bg-[#0d1117] hover:bg-[#161b22] border border-[#30363d] hover:border-[#d4af37]/30 p-3.5 rounded-xl flex items-center justify-between cursor-pointer group transition-all"
                    >
                      <div className="min-w-0 flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-[#161b22] border border-[#30363d] flex items-center justify-center shrink-0">
                          <Download className="w-4 h-4 text-[#8b949e] group-hover:text-[#d4af37] transition-colors" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-sans font-semibold text-xs text-[#f0f6fc] truncate group-hover:text-[#d4af37] transition-colors">{file.name}</h4>
                          <span className="font-mono text-[9px] text-[#8b949e] block mt-0.5">{file.size}</span>
                        </div>
                      </div>
                      <span className="font-sans text-[10px] font-bold text-[#8b949e] group-hover:text-[#d4af37] transition-colors shrink-0">Download</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>

        {/* Assignment Submission Area */}
        <div id="assignment-section" className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 shadow-sm border-t-2 border-t-[#d4af37] relative overflow-hidden">
          
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#d4af37]/5 rounded-bl-full pointer-events-none -z-10 blur-xl"></div>
          
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="font-sans font-semibold text-lg text-[#f0f6fc]">ส่งงานใบงานที่ 1: ตรรกศาสตร์และประตูลอจิก (Logic Gates)</h3>
              <p className="font-sans text-[11px] text-[#8b949e] mt-1">กำหนดส่งชิ้นงาน: วันศุกร์ที่ 27 ต.ค. เวลา 23:59 น.</p>
            </div>
            <span className={`px-3 py-1 rounded-full font-sans text-[10px] font-bold uppercase tracking-wider ${
              assignmentState.status === 'Pending' 
                ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                : assignmentState.status === 'Draft'
                ? 'bg-[#0d1117] text-blue-400 border border-[#30363d]'
                : 'bg-red-500/10 text-red-400 border border-red-500/20'
            }`}>
              {assignmentState.status === 'Pending' ? 'ส่งแล้ว' : assignmentState.status === 'Draft' ? 'ฉบับร่าง' : 'ยังไม่ได้ส่ง'}
            </span>
          </div>

          <div className="mb-6 font-sans text-[#8b949e] text-xs md:text-sm leading-relaxed">
            <p>โปรดกรอกคำตอบและแนบภาพใบงานสรุปเกี่ยวกับตัวประมวลผลตรรกศาสตร์ (AND, OR, NOT) ในรูปแบบเอกสาร PDF หรืองานนำเสนอเพื่อรับการประเมินคะแนนเต็ม 20 คะแนน</p>
          </div>

          <form onSubmit={handleFinalSubmit} className="flex flex-col gap-6">
            {/* Drag & Drop or Submitted File Container */}
            {assignmentState.status === 'Pending' ? (
              <div className="border border-green-500/20 bg-green-500/5 rounded-2xl p-8 flex flex-col items-center justify-center text-center relative">
                <div className="w-12 h-12 rounded-full bg-green-500/10 text-green-400 flex items-center justify-center mb-3">
                  <FileCheck className="w-6 h-6 text-green-400" />
                </div>
                <h4 className="font-sans font-bold text-green-400 text-sm mb-1">ส่งใบงานวิชาคอมพิวเตอร์สำเร็จแล้ว! (Submitted)</h4>
                <p className="font-sans text-xs text-[#8b949e] max-w-sm mt-1 leading-relaxed">
                  ไฟล์ชิ้นงาน <span className="text-[#f0f6fc] font-semibold">{assignmentState.fileName}</span> ({assignmentState.fileSize}) ได้บันทึกเข้าระบบประเมินเรียบร้อยแล้ว
                </p>
                <button
                  type="button"
                  onClick={handleCancelSubmit}
                  className="mt-5 flex items-center gap-1.5 py-2 px-4 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 hover:border-red-500/50 rounded-xl font-sans text-xs font-bold transition-all cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>ยกเลิกการส่งชิ้นงานนี้ (Cancel Submission)</span>
                </button>
              </div>
            ) : (
              <div 
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-[#30363d] hover:border-[#d4af37] hover:bg-[#0d1117]/30 transition-all rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer group relative"
              >
                <input 
                  ref={fileInputRef}
                  type="file" 
                  accept=".pdf,.docx,.zip"
                  className="hidden"
                  onChange={handleFileChange}
                />
                
                {!assignmentState.fileName ? (
                  <>
                    <div className="w-12 h-12 rounded-full bg-[#0d1117] border border-[#30363d] text-[#8b949e] flex items-center justify-center mb-3 group-hover:text-[#d4af37] group-hover:border-[#d4af37] transition-colors duration-150">
                      <UploadCloud className="w-6 h-6" />
                    </div>
                    <h4 className="font-sans font-semibold text-[#f0f6fc] text-sm mb-1">คลิกเลือกไฟล์ชิ้นงานที่นี่ หรือลากและวางในกรอบนี้</h4>
                    <p className="font-sans text-xs text-[#8b949e]">รองรับเอกสาร PDF, DOCX, หรือ ZIP (ขนาดไม่เกิน 10MB)</p>
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 rounded-full bg-[#0d1117] border border-[#d4af37] text-[#d4af37] flex items-center justify-center mb-1">
                      <FileCheck className="w-6 h-6 text-[#d4af37]" />
                    </div>
                    <h4 className="font-sans font-semibold text-[#f0f6fc] text-sm max-w-sm truncate">{assignmentState.fileName}</h4>
                    <p className="font-mono text-[10px] text-[#8b949e] font-semibold">{assignmentState.fileSize}</p>
                    <button 
                      type="button"
                      onClick={(e) => { e.stopPropagation(); handleRemoveFile(); }}
                      className="mt-3 flex items-center gap-1.5 py-1 px-3 bg-[#0d1117] hover:bg-[#161b22] text-red-400 border border-[#30363d] hover:border-red-400/50 rounded-lg font-sans text-[10px] font-bold tracking-wider transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>ลบไฟล์ที่เลือก</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Comments Textbox */}
            <div className="flex flex-col gap-1.5">
              <label className="font-sans text-xs font-semibold text-[#f0f6fc]" htmlFor="comments">
                ข้อความเพิ่มเติมถึงคุณครู (ถ้ามี)
              </label>
              <textarea 
                id="comments"
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="พิมพ์ข้อความที่ต้องการอธิบายหรือติดต่อครูผู้สอนตรงนี้..."
                rows={3}
                disabled={assignmentState.status === 'Pending'}
                className="w-full rounded-xl border border-[#30363d] bg-[#0d1117] px-4 py-2.5 font-sans text-xs text-[#f0f6fc] outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]/20 transition-all resize-none placeholder:text-[#484f58] disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            {/* Action Buttons */}
            {assignmentState.status !== 'Pending' && (
              <div className="flex justify-end gap-3 pt-2">
                <button 
                  type="button"
                  onClick={handleSaveDraft}
                  className="px-5 py-2.5 rounded-xl border border-[#30363d] hover:border-[#d4af37] text-[#8b949e] hover:text-[#f0f6fc] hover:bg-[#0d1117] font-sans text-xs font-bold transition-colors cursor-pointer"
                >
                  บันทึกแบบร่าง
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#d4af37] hover:bg-[#aa8e2d] text-[#0a0c10] font-sans text-xs font-bold transition-colors shadow-sm flex items-center gap-2 group cursor-pointer"
                >
                  <span>ส่งชิ้นงานทันที</span>
                  <Send className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            )}
          </form>

        </div>

      </div>

      {/* Right Column: Course Progress & Curriculum Navigation */}
      <div className="w-full xl:w-[280px] shrink-0 flex flex-col gap-6">
        
        {/* Course Progress Card */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-5 shadow-sm">
          <h3 className="font-sans text-[10px] text-[#8b949e] uppercase tracking-wider font-bold mb-3">เป้าหมายความคืบหน้า</h3>
          <div className="flex justify-between items-end mb-2">
            <span className="font-sans text-2xl font-bold text-[#f0f6fc]">12%</span>
            <span className="font-sans text-[11px] text-[#8b949e] font-semibold">2 จาก 16 บทเรียน</span>
          </div>
          <div className="w-full h-1.5 bg-[#0d1117] border border-[#30363d]/30 rounded-full overflow-hidden">
            <div className="h-full bg-[#d4af37] rounded-full" style={{ width: '12%' }}></div>
          </div>
        </div>

        {/* Module Syllabus List */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-2xl shadow-sm flex flex-col overflow-hidden">
          
          <div className="p-4 bg-[#0d1117] border-b border-[#30363d]">
            <h3 className="font-sans font-bold text-[#f0f6fc] text-sm">หน่วยการเรียนรู้ที่ 1: พื้นฐานคอมฯ</h3>
            <p className="font-sans text-[11px] text-[#8b949e] mt-1">4 บทเรียนหลัก • 2 ชิ้นงานปฏิบัติ</p>
          </div>

          <div className="p-2 flex flex-col gap-1 max-h-[500px] overflow-y-auto">
            {lessons
              .filter(lesson => {
                if (!lesson.targetClassrooms || lesson.targetClassrooms.length === 0) return true;
                return lesson.targetClassrooms.includes('ทั้งหมด') || lesson.targetClassrooms.includes(classroom);
              })
              .map((lesson) => {
              const isCompleted = lesson.status === 'completed';
              const isActive = lesson.status === 'active';
              const isLocked = lesson.status === 'locked';

              // Thai lesson name mapper for visuals
              const getThaiTitle = (id: string, defTitle: string) => {
                if (id === '1.0') return 'แนะนำเทคโนโลยีและระบบจัดการเรียน';
                if (id === '1.1') return 'ความรู้เบื้องต้นวิทยาการคอมพิวเตอร์';
                if (id === '1.2') return 'เปรียบเทียบฮาร์ดแวร์และซอฟต์แวร์';
                if (id === '1.3') return 'ประวัติความเป็นมาและวิวัฒนาการ';
                return defTitle;
              };

              return (
                <div 
                  key={lesson.id}
                  onClick={() => {
                    if (isLocked) {
                      alert("บทเรียนส่วนนี้ถูกล็อกอยู่! โปรดทำงานชิ้นก่อนหน้าและฝึกฝนทำโจทย์ข้อสอบกลางภาคเพื่อรับเกณฑ์การปลดล็อกเรียนรู้หัวข้อถัดไป");
                    } else if (isActive) {
                      // Active, do nothing
                    } else {
                      alert(`กำลังเปิดโหลดบทเรียนที่ ${lesson.id}: ${getThaiTitle(lesson.id, lesson.title)}`);
                    }
                  }}
                  className={`flex items-start gap-3 p-3 rounded-xl transition-colors cursor-pointer relative ${
                    isActive 
                      ? 'bg-[#d4af37]/5 border border-[#d4af37]/20' 
                      : 'hover:bg-[#0d1117]/50'
                  }`}
                >
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-8 bg-[#d4af37] rounded-r"></div>
                  )}

                  <div className="mt-0.5 shrink-0">
                    {isCompleted ? (
                      <div className="w-5 h-5 rounded-full bg-[#0d1117] text-green-400 flex items-center justify-center border border-green-400/30">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    ) : isActive ? (
                      <div className="w-5 h-5 rounded-full bg-[#d4af37] text-[#0a0c10] flex items-center justify-center">
                        <Play className="w-2.5 h-2.5 fill-[#0a0c10] translate-x-[0.5px]" />
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-full text-[#484f58] flex items-center justify-center border border-[#30363d]">
                        <Lock className="w-2.5 h-2.5" />
                      </div>
                    )}
                  </div>

                  <div>
                    <h4 className={`font-sans text-xs font-bold leading-snug ${
                      isActive ? 'text-[#f0f6fc]' : isCompleted ? 'text-[#8b949e] line-through' : 'text-[#484f58]'
                    }`}>
                      บทที่ {lesson.id}: {getThaiTitle(lesson.id, lesson.title)}
                    </h4>
                    <div className="flex items-center gap-1.5 text-[#8b949e] mt-1 font-sans text-[9px] font-bold uppercase tracking-wider">
                      {lesson.type === 'Video' ? <PlayCircle className="w-3 h-3" /> : <BookOpen className="w-3 h-3" />}
                      <span>{lesson.type === 'Video' ? 'วิดีโอประกอบ' : 'เนื้อหาเอกสาร'} • {lesson.duration}</span>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Simulated assignment item */}
            <div className="my-2 border-t border-[#30363d] mx-2"></div>
            
            <div 
              className={`flex items-start gap-3 p-3 rounded-xl transition-colors cursor-pointer bg-[#0d1117]/30 border border-[#30363d]/30 ${
                assignmentState.status === 'Pending' 
                  ? 'bg-[#d4af37]/5 border-[#d4af37]/10' 
                  : ''
              }`}
            >
              <div className="mt-0.5 shrink-0">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                  assignmentState.status === 'Pending' 
                    ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                    : 'bg-[#0d1117] text-red-400 border border-red-400/30'
                }`}>
                  <AlertCircle className="w-3 h-3" />
                </div>
              </div>
              <div>
                <h4 className="font-sans text-xs font-bold text-[#f0f6fc] leading-snug">ใบงานที่ 1: ตรรกศาสตร์ (Logic Gates)</h4>
                <div className="flex items-center gap-1.5 text-red-400 mt-1 font-mono text-[9px] font-bold uppercase tracking-wider">
                  <Clock className="w-3 h-3" />
                  <span>กำหนดส่ง 27 ต.ค.</span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
