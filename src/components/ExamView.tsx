import React, { useState, useEffect } from 'react';
import { 
  Timer, 
  Flag, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  ChevronLeft, 
  ChevronRight, 
  Award,
  RotateCcw,
  BookOpen
} from 'lucide-react';
import { ExamQuestion, ExamState, ExamSettings } from '../types';

interface ExamViewProps {
  questions: ExamQuestion[];
  examState: ExamState;
  onUpdateExam: (updater: Partial<ExamState> | ((prev: ExamState) => ExamState)) => void;
  onFinishExam: (score: number) => void;
  onResetExam: () => void;
  examSettings?: ExamSettings;
  classroom?: string;
}

export default function ExamView({ 
  questions, 
  examState, 
  onUpdateExam, 
  onFinishExam, 
  onResetExam,
  examSettings = {
    timeLimit: 45,
    scoreVisibility: true,
    answerKeyVisibility: true,
    isOpen: true,
    targetClassrooms: ['ทั้งหมด']
  },
  classroom = 'M.1/1'
}: ExamViewProps) {
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);

  // Countdown timer effect
  useEffect(() => {
    if (examState.isFinished) return;

    const timerInterval = setInterval(() => {
      onUpdateExam((prev) => {
        if (prev.timeLeft <= 1) {
          clearInterval(timerInterval);
          // Auto submit when time hits 0
          setTimeout(() => handleFinalSubmit(prev.answers), 100);
          return { ...prev, timeLeft: 0, isFinished: true };
        }
        return { ...prev, timeLeft: prev.timeLeft - 1 };
      });
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [examState.isFinished]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSelectAnswer = (questionId: number, answerKey: string) => {
    onUpdateExam((prev) => ({
      ...prev,
      answers: {
        ...prev.answers,
        [questionId]: answerKey
      }
    }));
  };

  const handleToggleFlag = (questionId: number) => {
    onUpdateExam((prev) => ({
      ...prev,
      flaggedQuestions: {
        ...prev.flaggedQuestions,
        [questionId]: !prev.flaggedQuestions[questionId]
      }
    }));
  };

  const handleNext = () => {
    if (examState.currentQuestionIndex < questions.length - 1) {
      onUpdateExam({ currentQuestionIndex: examState.currentQuestionIndex + 1 });
    }
  };

  const handlePrev = () => {
    if (examState.currentQuestionIndex > 0) {
      onUpdateExam({ currentQuestionIndex: examState.currentQuestionIndex - 1 });
    }
  };

  const calculateScore = (answers: { [key: number]: string }) => {
    let correctCount = 0;
    questions.forEach((q) => {
      if (answers[q.id] === q.correctAnswer) {
        correctCount++;
      }
    });
    return correctCount;
  };

  const handleFinalSubmit = (answersToGrade = examState.answers) => {
    const finalScore = calculateScore(answersToGrade);
    onUpdateExam({ isFinished: true });
    onFinishExam(finalScore);
    setShowConfirmSubmit(false);
  };

  const currentQuestion = questions[examState.currentQuestionIndex];
  const selectedAnswer = examState.answers[currentQuestion.id] || '';
  const isFlagged = examState.flaggedQuestions[currentQuestion.id] || false;

  const totalAnswered = Object.keys(examState.answers).length;
  const totalFlagged = Object.values(examState.flaggedQuestions).filter(Boolean).length;

  // Access Control Guards
  if (!examSettings.isOpen) {
    return (
      <div className="flex-grow p-4 md:p-6 lg:p-8 max-w-[800px] w-full mx-auto select-none animate-in fade-in duration-200">
        <div className="bg-[#161b22] border border-red-500/20 rounded-2xl p-8 text-center flex flex-col items-center gap-5 relative overflow-hidden">
          <div className="w-16 h-16 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center border border-red-500/20">
            <XCircle className="w-8 h-8 text-red-500" />
          </div>
          <div>
            <h2 className="font-sans font-bold text-xl text-[#f0f6fc]">ระบบทำข้อสอบปิดชั่วคราว (Exam Closed)</h2>
            <p className="font-sans text-xs text-[#8b949e] mt-1.5 leading-relaxed max-w-md mx-auto">
              ขออภัย! การสอบกลางภาคจำลองชุดนี้ได้รับการตั้งค่า <span className="text-red-400 font-semibold">"ปิดสถานะชั่วคราว"</span> โดยคุณครูผู้สอนเพื่อเตรียมปรับปรุงเนื้อหาหรือสิ้นสุดกำหนดทำสอบ กรุณาติดต่อครูผู้สอนประจำวิชาเพื่อขอสิทธิ์การเปิดเข้าสอบ
            </p>
          </div>
          <div className="bg-[#0d1117] border border-[#30363d] px-5 py-3 rounded-xl font-sans text-xs text-[#8b949e] font-medium">
            สถานะปัจจุบัน: <span className="text-red-400 font-semibold">ปิดการเข้าสอบชั่วคราว (Closed)</span>
          </div>
        </div>
      </div>
    );
  }

  const isTargeted = examSettings.targetClassrooms.includes('ทั้งหมด') || examSettings.targetClassrooms.includes(classroom);
  if (!isTargeted) {
    return (
      <div className="flex-grow p-4 md:p-6 lg:p-8 max-w-[800px] w-full mx-auto select-none animate-in fade-in duration-200">
        <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-8 text-center flex flex-col items-center gap-5 relative overflow-hidden">
          <div className="w-16 h-16 rounded-full bg-yellow-500/10 text-yellow-500 flex items-center justify-center border border-yellow-500/20">
            <AlertCircle className="w-8 h-8 text-[#d4af37]" />
          </div>
          <div>
            <h2 className="font-sans font-bold text-xl text-[#f0f6fc]">คุณไม่มีสิทธิ์เข้าทำแบบทดสอบ (Target Classroom Locked)</h2>
            <p className="font-sans text-xs text-[#8b949e] mt-1.5 leading-relaxed max-w-md mx-auto">
              ระบบตรวจพบว่า บัญชีของคุณจัดอยู่ในห้องเรียน <span className="text-[#d4af37] font-semibold">ม.{classroom.replace('M.', '')}</span> ซึ่งแบบทดสอบวิชาคอมพิวเตอร์ชุดนี้ถูกจัดสรรเป้าหมายเฉพาะให้บางห้องเรียนเข้าทำสอบเท่านั้น
            </p>
          </div>
          <div className="bg-[#0d1117] border border-[#30363d] px-5 py-3.5 rounded-xl font-sans text-xs text-[#8b949e] font-medium flex flex-col gap-1">
            <span>ห้องเรียนของคุณ: <span className="text-[#f0f6fc] font-bold">ม.{classroom.replace('M.', '')}</span></span>
            <span>สิทธิ์ห้องเรียนสำหรับชุดสอบนี้: <span className="text-[#d4af37] font-semibold">{examSettings.targetClassrooms.join(', ')}</span></span>
          </div>
        </div>
      </div>
    );
  }

  if (examState.isFinished) {
    const finalScore = calculateScore(examState.answers);
    const scorePercent = Math.round((finalScore / questions.length) * 100);
    const isPassed = scorePercent >= 60;

    return (
      <div className="flex-grow p-4 md:p-6 lg:p-8 max-w-[1000px] w-full mx-auto select-none animate-in fade-in duration-200">
        
        {/* Results Banner */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-8 shadow-2xl text-center flex flex-col items-center gap-5 relative overflow-hidden mb-8">
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#d4af37]/5 rounded-bl-full pointer-events-none -z-10 blur-xl"></div>
          
          <div className={`w-16 h-16 rounded-full flex items-center justify-center shadow bg-[#0d1117] ${
            isPassed ? 'text-green-400 border border-green-500/20' : 'text-red-400 border border-red-500/20'
          }`}>
            <Award className="w-8 h-8 text-[#d4af37]" />
          </div>

          <div>
            <h2 className="font-sans font-bold text-2xl text-[#f0f6fc]">ส่งข้อสอบวัดผลวิทยาการคำนวณสำเร็จ!</h2>
            <p className="font-sans text-xs text-[#8b949e] mt-1">ข้อสอบกลางภาคจำลอง: หลักวิทยาการคอมพิวเตอร์พื้นฐาน (CS 101)</p>
          </div>

          {examSettings.scoreVisibility ? (
            <div className="flex flex-col items-center gap-1 bg-[#0d1117] border border-[#30363d] rounded-2xl py-4 px-10">
              <span className="font-sans text-[10px] font-semibold text-[#8b949e] uppercase tracking-wider">คะแนนสอบของคุณ</span>
              <span className="font-mono text-4xl font-extrabold text-[#f0f6fc]">{finalScore} / {questions.length} ข้อ</span>
              <span className={`font-sans text-xs font-bold tracking-wider ${isPassed ? 'text-green-400' : 'text-red-400'}`}>
                ได้ {scorePercent}% — {isPassed ? 'ผ่านเกณฑ์ประเมิน (Passed)' : 'ไม่ผ่านเกณฑ์ประเมิน (Failed)'}
              </span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-1.5 bg-[#0d1117] border border-[#30363d] rounded-2xl py-5 px-8 max-w-md">
              <span className="font-sans text-[10px] font-semibold text-[#8b949e] uppercase tracking-wider">คะแนนสอบของคุณ</span>
              <span className="font-sans text-sm font-bold text-[#f0f6fc] text-center">
                บันทึกคำตอบเรียบร้อยแล้ว
              </span>
              <span className="font-sans text-[11px] text-[#8b949e] text-center mt-1">
                คุณครูผู้สอนกำหนด <span className="text-red-400 font-semibold">"ปิดการแสดงคะแนนสอบทันที"</span> คุณสามารถสอบถามผลคะแนนสอบประเมินได้จากครูผู้สอนโดยตรงภายหลังการประเมินนี้
              </span>
            </div>
          )}

          <p className="font-sans text-xs md:text-sm text-[#8b949e] max-w-md leading-relaxed">
            {examSettings.scoreVisibility 
              ? (isPassed 
                ? 'ยินดีด้วยอย่างยิ่ง! คุณผ่านการทำแบบทดสอบเสมือนจริงและมีทักษะความเข้าใจเกี่ยวกับ โครงสร้างคอมพิวเตอร์ ประตูลอจิก และขั้นตอนวิธีโปรแกรมมิ่งในเกณฑ์ดีเยี่ยม' 
                : 'คะแนนของคุณยังไม่ถึงเกณฑ์ที่กำหนด โปรดทบทวนเฉลยข้อผิดพลาดและเนื้อหาบทเรียนย้อนหลังเพื่อเตรียมความพร้อมรับการทำสอบจริงกับทางโรงเรียน')
              : 'คำตอบของคุณได้รับการจัดส่งและเก็บไว้ในระบบสารสนเทศของโรงเรียนเรียบร้อยแล้ว เพื่อประโยชน์การเรียนรู้ โปรดทบทวนเนื้อหาอย่างต่อเนื่อง'}
          </p>

          <button 
            onClick={onResetExam}
            className="flex items-center gap-2 py-2.5 px-6 bg-[#d4af37] hover:bg-[#aa8e2d] text-[#0a0c10] rounded-xl font-sans text-xs font-bold transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>เริ่มฝึกทำข้อสอบใหม่อีกครั้ง</span>
          </button>
        </div>

        {/* Question Review List */}
        {examSettings.answerKeyVisibility ? (
          <div className="flex flex-col gap-6">
            <h3 className="font-sans font-bold text-base text-[#f0f6fc] border-b border-[#30363d] pb-3 tracking-wider">เฉลยและรายงานคะแนนรายข้อโดยละเอียด</h3>
            {questions.map((q, idx) => {
              const studentAns = examState.answers[q.id];
              const isCorrect = studentAns === q.correctAnswer;

              return (
                <div key={q.id} className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 shadow-sm flex flex-col gap-4 animate-in fade-in duration-200">
                  <div className="flex justify-between items-start gap-4">
                    <span className="font-sans text-xs font-bold text-[#8b949e] uppercase tracking-wider shrink-0 mt-0.5">
                      โจทย์ข้อที่ {idx + 1}
                    </span>
                    {isCorrect ? (
                      <span className="flex items-center gap-1 px-2.5 py-0.5 bg-[#0d1117] text-green-400 border border-green-500/20 rounded-full font-sans text-[10px] font-semibold tracking-wider">
                        <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
                        ตอบถูกต้อง
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 px-2.5 py-0.5 bg-[#0d1117] text-red-400 border border-red-500/20 rounded-full font-sans text-[10px] font-semibold tracking-wider">
                        <XCircle className="w-3.5 h-3.5 text-red-400" />
                        {studentAns ? 'ตอบไม่ถูกต้อง' : 'ข้ามการทำข้อนี้'}
                      </span>
                    )}
                  </div>

                  <p className="font-sans font-bold text-[#f0f6fc] text-sm md:text-base leading-snug">{q.text}</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-1">
                    {q.options.map((opt) => {
                      const isSelected = studentAns === opt.key;
                      const isCorrectOption = q.correctAnswer === opt.key;

                      let optBg = 'bg-[#0d1117] border-[#30363d]';
                      let optText = 'text-[#8b949e]';

                      if (isCorrectOption) {
                        optBg = 'bg-[#0d1117] border-green-500/40';
                        optText = 'text-green-400 font-bold';
                      } else if (isSelected && !isCorrect) {
                        optBg = 'bg-[#0d1117] border-red-500/40';
                        optText = 'text-red-400';
                      }

                      return (
                        <div key={opt.key} className={`border p-3.5 rounded-xl flex items-start gap-3 text-xs font-sans ${optBg}`}>
                          <span className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 font-bold text-[10px] ${
                            isCorrectOption 
                              ? 'bg-green-500 text-white' 
                              : isSelected 
                              ? 'bg-red-500 text-white' 
                              : 'bg-[#161b22] border border-[#30363d] text-[#8b949e]'
                          }`}>
                            {opt.key}
                          </span>
                          <span className={optText}>{opt.text}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 text-center select-none text-[#8b949e] font-sans text-xs">
            คุณครูผู้สอนกำหนด <span className="text-red-400 font-semibold">"ปิดการแสดงเฉลยข้อสอบรายข้อ"</span> สำหรับสิทธิ์นักเรียนในห้องเรียนนี้
          </div>
        )}

      </div>
    );
  }

  return (
    <div className="flex-grow p-4 md:p-6 lg:p-8 max-w-[1280px] w-full mx-auto select-none animate-in fade-in duration-200 flex flex-col xl:flex-row gap-8">
      
      {/* Left Column: Current Question */}
      <div className="flex-grow flex flex-col gap-6 min-w-0 xl:max-w-[70%]">
        
        {/* Exam Headers / Countdown Widget */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4 border-t-2 border-t-[#d4af37]">
          <div>
            <h3 className="font-sans font-bold text-[#f0f6fc] text-base leading-tight">ห้องสอบประเมินผลกลางภาคจำลอง: CS 101</h3>
            <p className="font-sans text-xs text-[#8b949e] mt-1">ข้อสอบทั้งหมด 20 ข้อ • เกณฑ์ผ่านประเมินขั้นต่ำ: 60% (12 ข้อ)</p>
          </div>

          <div className="flex items-center gap-3 bg-[#0d1117] border border-[#30363d] rounded-xl py-2 px-5 text-[#d4af37]">
            <Timer className="w-5 h-5 animate-pulse" />
            <span className="font-mono text-base font-bold tracking-widest">{formatTime(examState.timeLeft)}</span>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 md:p-8 shadow-sm flex flex-col min-h-[400px]">
          <div className="flex justify-between items-center border-b border-[#30363d] pb-4 mb-6">
            <div className="flex flex-col gap-1">
              <span className="font-sans text-[11px] font-bold text-[#d4af37] uppercase tracking-wider">
                ข้อที่ {examState.currentQuestionIndex + 1} จากทั้งหมด {questions.length} ข้อ
              </span>
              <span className="font-sans text-[10px] text-[#8b949e]">บันทึกคำตอบอัตโนมัติเมื่อเลือกช้อยส์</span>
            </div>

            <button 
              onClick={() => handleToggleFlag(currentQuestion.id)}
              className={`flex items-center gap-1.5 py-1.5 px-3.5 rounded-lg font-sans text-xs font-semibold transition-all cursor-pointer ${
                isFlagged 
                  ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' 
                  : 'text-[#8b949e] hover:text-[#f0f6fc] hover:bg-[#0d1117]/50'
              }`}
            >
              <Flag className={`w-3.5 h-3.5 ${isFlagged ? 'fill-yellow-500' : ''}`} />
              <span>{isFlagged ? 'ปักธงทบทวนแล้ว' : 'ปักธงข้อนี้ไว้ทบทวน'}</span>
            </button>
          </div>

          {/* Question Text */}
          <h4 className="font-sans font-semibold text-[#f0f6fc] text-base md:text-lg leading-relaxed mb-8 select-text">
            {currentQuestion.text}
          </h4>

          {/* Question Options */}
          <div className="flex flex-col gap-3.5 mb-8">
            {currentQuestion.options.map((opt) => {
              const isSelected = selectedAnswer === opt.key;
              return (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => handleSelectAnswer(currentQuestion.id, opt.key)}
                  className={`flex items-start gap-4 p-4 rounded-xl border text-left transition-all font-sans text-sm select-none cursor-pointer ${
                    isSelected 
                      ? 'bg-[#d4af37]/5 border-[#d4af37] shadow-sm font-semibold text-[#f0f6fc]' 
                      : 'border-[#30363d] bg-[#0d1117] hover:bg-[#161b22]/50 text-[#8b949e] hover:text-[#f0f6fc]'
                  }`}
                >
                  <span className={`w-5.5 h-5.5 rounded-full flex items-center justify-center shrink-0 font-mono text-[11px] font-bold transition-colors ${
                    isSelected ? 'bg-[#d4af37] text-[#0a0c10]' : 'bg-[#161b22] border border-[#30363d] text-[#8b949e]'
                  }`}>
                    {opt.key}
                  </span>
                  <span className="leading-tight mt-0.5">{opt.text}</span>
                </button>
              );
            })}
          </div>

          {/* Question Footer Navigation */}
          <div className="flex justify-between items-center mt-auto pt-6 border-t border-[#30363d]">
            <button 
              onClick={handlePrev}
              disabled={examState.currentQuestionIndex === 0}
              className="flex items-center gap-1.5 py-2 px-4 border border-[#30363d] rounded-xl font-sans text-xs font-bold text-[#8b949e] hover:text-[#f0f6fc] hover:bg-[#0d1117] disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>ย้อนกลับ</span>
            </button>

            <button 
              onClick={handleNext}
              disabled={examState.currentQuestionIndex === questions.length - 1}
              className="flex items-center gap-1.5 py-2 px-4 border border-[#30363d] rounded-xl font-sans text-xs font-bold text-[#8b949e] hover:text-[#f0f6fc] hover:bg-[#0d1117] disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer"
            >
              <span>ถัดไป</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>

      {/* Right Column: Question Navigator */}
      <div className="w-full xl:w-[280px] shrink-0 flex flex-col gap-6">
        
        {/* Navigation Grid Card */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-5 shadow-sm">
          <h3 className="font-sans text-[10px] text-[#8b949e] uppercase tracking-wider font-bold mb-4">แผงนำทางข้อสอบ</h3>

          <div className="grid grid-cols-5 gap-2.5 mb-6">
            {questions.map((q, idx) => {
              const isCurrent = examState.currentQuestionIndex === idx;
              const hasAnswer = !!examState.answers[q.id];
              const isFlag = !!examState.flaggedQuestions[q.id];

              let cellStyle = 'bg-[#0d1117] text-[#484f58] border-[#30363d]';
              if (hasAnswer) {
                cellStyle = 'bg-[#0d1117] text-[#d4af37] border-[#d4af37]/40 font-semibold';
              }
              if (isFlag) {
                cellStyle = 'bg-[#0d1117] text-yellow-500 border-yellow-500/40 font-semibold';
              }
              if (isCurrent) {
                cellStyle = 'bg-[#d4af37] text-[#0a0c10] border-[#d4af37] font-bold';
              }

              return (
                <button
                  key={q.id}
                  onClick={() => onUpdateExam({ currentQuestionIndex: idx })}
                  className={`aspect-square rounded-lg border font-sans text-xs flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95 ${cellStyle}`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          {/* Legends */}
          <div className="flex flex-col gap-2.5 border-t border-[#30363d] pt-4 mb-6">
            <div className="flex items-center gap-2.5 font-sans text-xs text-[#8b949e]">
              <span className="w-3.5 h-3.5 rounded bg-[#0d1117] border border-[#d4af37]/40"></span>
              <span>เลือกคำตอบแล้ว</span>
            </div>
            <div className="flex items-center gap-2.5 font-sans text-xs text-[#8b949e]">
              <span className="w-3.5 h-3.5 rounded bg-[#0d1117] border border-[#30363d]"></span>
              <span>ยังไม่ได้ทำ</span>
            </div>
            <div className="flex items-center gap-2.5 font-sans text-xs text-[#8b949e]">
              <span className="w-3.5 h-3.5 rounded bg-[#0d1117] border border-yellow-500/40"></span>
              <span>ปักธงเพื่อทบทวน</span>
            </div>
          </div>

          {/* Submit Exam Button */}
          <button
            onClick={() => setShowConfirmSubmit(true)}
            className="w-full bg-[#d4af37] hover:bg-[#aa8e2d] text-[#0a0c10] py-3 rounded-xl font-sans text-xs font-bold transition-colors shadow-sm cursor-pointer border-0"
          >
            ส่งข้อสอบและสรุปผล
          </button>
        </div>

      </div>

      {/* Confirmation Submit Modal */}
      {showConfirmSubmit && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 md:p-8 max-w-md w-full shadow-2xl flex flex-col gap-5 select-none animate-in scale-in duration-200">
            <div className="text-center flex flex-col items-center gap-3 text-[#f0f6fc]">
              <div className="w-12 h-12 rounded-full bg-[#0d1117] border border-[#30363d] text-[#d4af37] flex items-center justify-center">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h4 className="font-sans font-bold text-lg">ยืนยันการส่งข้อสอบทันทีใช่หรือไม่?</h4>
              <p className="font-sans text-xs text-[#8b949e] max-w-xs leading-relaxed">
                คุณตอบข้อสอบเสร็จแล้ว {totalAnswered} ข้อ จากทั้งหมด {questions.length} ข้อ ระบบจะบันทึกคะแนนของคุณทันทีและไม่สามารถย้อนกลับมาแก้ไขคำตอบได้อีกหลังการส่ง
              </p>
            </div>

            <div className="bg-[#0d1117] border border-[#30363d] rounded-xl p-3 flex justify-between font-sans text-[10px] font-bold text-[#8b949e] px-5">
              <div className="flex flex-col items-center gap-0.5">
                <span>ตอบข้อสอบแล้ว</span>
                <span className="text-[#f0f6fc] text-sm font-bold">{totalAnswered} / {questions.length} ข้อ</span>
              </div>
              <div className="w-px bg-[#30363d]"></div>
              <div className="flex flex-col items-center gap-0.5">
                <span>ปักธงทบทวน</span>
                <span className="text-[#f0f6fc] text-sm font-bold">{totalFlagged} ข้อ</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-2">
              <button
                onClick={() => setShowConfirmSubmit(false)}
                className="py-2.5 border border-[#30363d] hover:border-[#d4af37] text-[#8b949e] hover:text-[#f0f6fc] rounded-xl font-sans text-xs font-bold transition-colors cursor-pointer"
              >
                ย้อนกลับไปทำต่อ
              </button>
              <button
                onClick={() => handleFinalSubmit()}
                className="py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-sans text-xs font-bold transition-colors shadow-sm cursor-pointer border-0"
              >
                ยืนยันส่งข้อสอบ
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
