import { StudentGrade, ExamQuestion, Lesson } from './types';

export const INITIAL_STUDENTS: StudentGrade[] = [
  { id: '001', name: 'อนัญญา โกวิท', initials: 'AK', assg1: 18, assg2: 27, midterm: 45, status: 'Passed', classroom: 'M.1/1' },
  { id: '002', name: 'บุญมี ภักดี', initials: 'BP', assg1: 15, assg2: null, midterm: null, status: 'Incomplete', classroom: 'M.1/1' },
  { id: '003', name: 'ชัยวัฒน์ สุขสวัสดิ์', initials: 'CS', assg1: 20, assg2: 29, midterm: 48, status: 'Passed', classroom: 'M.1/1' },
  { id: '004', name: 'ดาริน วงศ์', initials: 'DW', assg1: 12, assg2: 22, midterm: 35, status: 'Average', classroom: 'M.1/2' },
  { id: '005', name: 'เอกชัย แซ่ลี้', initials: 'ES', assg1: 17, assg2: 24, midterm: 40, status: 'Passed', classroom: 'M.1/2' },
  { id: '006', name: 'ฟ้ารดา รักดี', initials: 'FR', assg1: 19, assg2: 28, midterm: 46, status: 'Passed', classroom: 'M.1/3' },
  { id: '007', name: 'กันตพล จันทะ', initials: 'GJ', assg1: 14, assg2: 18, midterm: 30, status: 'Average', classroom: 'M.1/3' },
  { id: '008', name: 'หทัยรัตน์ ศิริ', initials: 'HS', assg1: 16, assg2: null, midterm: 33, status: 'Incomplete', classroom: 'M.1/3' },
];

export const INITIAL_LESSONS: Lesson[] = [
  { id: '1.0', title: 'Welcome to CS', type: 'Reading', duration: '10m', status: 'completed' },
  { id: '1.1', title: 'Intro to Computer Science', type: 'Video', duration: '45m', status: 'active' },
  { id: '1.2', title: 'Hardware vs Software', type: 'Video', duration: '32m', status: 'locked' },
  { id: '1.3', title: 'History of Computing', type: 'Video', duration: '28m', status: 'locked' },
];

export const EXAM_QUESTIONS: ExamQuestion[] = [
  {
    id: 1,
    text: 'โครงสร้างข้อมูลแบบใดทำงานตามหลักการ "เข้าหลังสุด แต่ออกก่อนสุด" (LIFO - Last In, First Out)?',
    options: [
      { key: 'A', text: 'คิว (Queue)' },
      { key: 'B', text: 'สแต็ก (Stack)' },
      { key: 'C', text: 'ลิงก์ลิสต์ (Linked List)' },
      { key: 'D', text: 'ต้นไม้ไบนารี (Binary Tree)' }
    ],
    correctAnswer: 'B'
  },
  {
    id: 2,
    text: 'คำว่า CPU ย่อมาจากคำว่าอะไร?',
    options: [
      { key: 'A', text: 'Computer Processing Unit' },
      { key: 'B', text: 'Central Programming Utility' },
      { key: 'C', text: 'Central Processing Unit (หน่วยประมวลผลกลาง)' },
      { key: 'D', text: 'Control Processing Utility' }
    ],
    correctAnswer: 'C'
  },
  {
    id: 3,
    text: 'ข้อใดคือวัตถุประสงค์หลักของที่อยู่อินเทอร์เน็ต (IP Address)?',
    options: [
      { key: 'A', text: 'เพื่อเข้ารหัสลับข้อมูลที่ส่งผ่านอินเทอร์เน็ต' },
      { key: 'B', text: 'เพื่อระบุระบุตัวตนและที่ตั้งของอุปกรณ์ในระบบเครือข่ายให้ไม่ซ้ำกัน' },
      { key: 'C', text: 'เพื่อประเมินความเร็วในการรับส่งเครือข่าย' },
      { key: 'D', text: 'เพื่อบันทึกหน่วยความจำแคชภายในเครื่อง' }
    ],
    correctAnswer: 'B'
  },
  {
    id: 4,
    text: 'ข้อใดต่อไปนี้จัดเป็นหน่วยความจำประเภทลบเลือนได้ (Volatile Memory)?',
    options: [
      { key: 'A', text: 'ROM (Read-Only Memory)' },
      { key: 'B', text: 'Hard Disk Drive (HDD)' },
      { key: 'C', text: 'Flash Memory (แฟลชไดรฟ์)' },
      { key: 'D', text: 'RAM (Random Access Memory)' }
    ],
    correctAnswer: 'D'
  },
  {
    id: 5,
    text: 'หน้าที่หลักสูงสุดของระบบปฏิบัติการ (Operating System) คืออะไร?',
    options: [
      { key: 'A', text: 'แปลภาษาซอร์สโค้ดระดับสูงให้กลายเป็นภาษาเครื่อง' },
      { key: 'B', text: 'บริหารจัดการทรัพยากรฮาร์ดแวร์และโปรแกรมซอฟต์แวร์ต่างๆ ของระบบ' },
      { key: 'C', text: 'แสดงผลหน้าเว็บไซต์ประกอบภาพเคลื่อนไหวอย่างรวดเร็ว' },
      { key: 'D', text: 'ตรวจจับและกำจัดมัลแวร์และไวรัสคอมพิวเตอร์ทั้งหมด' }
    ],
    correctAnswer: 'B'
  },
  {
    id: 6,
    text: 'ความซับซ้อนเชิงเวลาเฉลี่ย (Time Complexity) ของการค้นหาแบบทวิภาค (Binary Search) บนชุดข้อมูลที่เรียงลำดับแล้วคือเท่าใด?',
    options: [
      { key: 'A', text: 'O(1)' },
      { key: 'B', text: 'O(n)' },
      { key: 'C', text: 'O(log n)' },
      { key: 'D', text: 'O(n log n)' }
    ],
    correctAnswer: 'C'
  },
  {
    id: 7,
    text: 'ประตูลอจิก (Logic Gate) ชนิดใดที่ให้สัญญาณผลลัพธ์เป็นสูง (1) เฉพาะกรณีที่สัญญาณนำเข้า (Inputs) ทุกตัวเป็นสูง (1) เท่านั้น?',
    options: [
      { key: 'A', text: 'ประตู OR (OR Gate)' },
      { key: 'B', text: 'ประตู AND (AND Gate)' },
      { key: 'C', text: 'ประตู XOR (XOR Gate)' },
      { key: 'D', text: 'ประตู NAND (NAND Gate)' }
    ],
    correctAnswer: 'B'
  },
  {
    id: 8,
    text: 'คำว่า SQL ย่อมาจากอะไรในแง่ของระบบการจัดการฐานข้อมูล?',
    options: [
      { key: 'A', text: 'Structured Query Language (ภาษาคิวรีโครงสร้าง)' },
      { key: 'B', text: 'Simple Query Link' },
      { key: 'C', text: 'Sequential Query Language' },
      { key: 'D', text: 'Standard Queue List' }
    ],
    correctAnswer: 'A'
  },
  {
    id: 9,
    text: 'เลขฐานสิบ 10 มีค่าเขียนแทนในรูปแบบของเลขฐานสองตรงกับข้อใด?',
    options: [
      { key: 'A', text: '1001' },
      { key: 'B', text: '1010' },
      { key: 'C', text: '1100' },
      { key: 'D', text: '1111' }
    ],
    correctAnswer: 'B'
  },
  {
    id: 10,
    text: 'โปรโตคอลหลักชนิดใดที่ใช้ในระบบอินเทอร์เน็ตเพื่อส่งหน้าเพจเว็บอย่างปลอดภัยผ่านการเข้ารหัสลับข้อมูล?',
    options: [
      { key: 'A', text: 'FTP (File Transfer Protocol)' },
      { key: 'B', text: 'HTTP (Hypertext Transfer Protocol)' },
      { key: 'C', text: 'HTTPS (Hypertext Transfer Protocol Secure)' },
      { key: 'D', text: 'SMTP (Simple Mail Transfer Protocol)' }
    ],
    correctAnswer: 'C'
  },
  {
    id: 11,
    text: 'คอมไพเลอร์ (Compiler) มีหน้าที่หลักตามข้อใด?',
    options: [
      { key: 'A', text: 'ประมวลผลอ่านคำสั่งโปรแกรมทีละบรรทัดอย่างต่อเนื่อง' },
      { key: 'B', text: 'แปลงโค้ดภาษาคอมพิวเตอร์ระดับสูงทั้งหมดให้กลายเป็นภาษาเครื่องที่ฮาร์ดแวร์เข้าใจ' },
      { key: 'C', text: 'แก้ไขข้อผิดพลาดหรือจุดบั๊กของตรรกศาสตร์โปรแกรมอัตโนมัติ' },
      { key: 'D', text: 'จัดสรรพื้นที่เก็บตารางในระบบฐานข้อมูลคลาวด์' }
    ],
    correctAnswer: 'B'
  },
  {
    id: 12,
    text: 'ขั้นตอนวิธีจัดเรียงข้อมูล (Sorting Algorithm) ใดที่มีประสิทธิภาพความเร็วเฉลี่ยระดับ O(n log n)?',
    options: [
      { key: 'A', text: 'การจัดเรียงแบบฟองสบู่ (Bubble Sort)' },
      { key: 'B', text: 'การจัดเรียงแบบผสม (Merge Sort)' },
      { key: 'C', text: 'การจัดเรียงแบบเลือก (Selection Sort)' },
      { key: 'D', text: 'การจัดเรียงแบบแทรก (Insertion Sort)' }
    ],
    correctAnswer: 'B'
  },
  {
    id: 13,
    text: 'ตัวย่อภาษาพัฒนาเว็บ HTML ย่อมาจากอะไร?',
    options: [
      { key: 'A', text: 'HyperText Markup Language (ภาษาประมวลผลข้อความไฮเปอร์เทกซ์)' },
      { key: 'B', text: 'Hyperlink Transfer Markup Link' },
      { key: 'C', text: 'Home Tool Markup Language' },
      { key: 'D', text: 'HyperText Modern Language' }
    ],
    correctAnswer: 'A'
  },
  {
    id: 14,
    text: 'ระบบ Domain Name System (DNS) มีจุดประสงค์หลักเพื่อสิ่งใด?',
    options: [
      { key: 'A', text: 'ทำหน้าที่สำรองไฟล์เอกสารของเซิร์ฟเวอร์หลัก' },
      { key: 'B', text: 'แปลชื่อโดเมนเว็บไซต์ที่เข้าใจง่ายให้กลายเป็นหมายเลขไอพีแอดเดรสของเครื่องเซิร์ฟเวอร์' },
      { key: 'C', text: 'บริการแปลงภาพวิดีโออเนกประสงค์ลงสู่อุปกรณ์ของผู้เรียน' },
      { key: 'D', text: 'เข้ารหัสสิทธิช่องสัญญาณอุโมงค์ VPN' }
    ],
    correctAnswer: 'B'
  },
  {
    id: 15,
    text: 'ในการเขียนโปรแกรมคอมพิวเตอร์ การทำงานแบบเรียกตนเอง (Recursion) คืออะไร?',
    options: [
      { key: 'A', text: 'โครงสร้างวงจรลูปที่วนไม่สิ้นสุดอันเนื่องมาจากความเข้าใจไวยากรณ์ผิดพลาด' },
      { key: 'B', text: 'กระบวนการหรือฟังก์ชันการทำงานที่เรียกใช้ตัวมันเองซ้ำๆ เพื่อแก้ปัญหาย่อย' },
      { key: 'C', text: 'ขั้นตอนการเชื่อมต่อประสานหลายตารางข้อมูล' },
      { key: 'D', text: 'วิธีการบีบอัดข้อมูลอินเทอร์เน็ตฝั่งขาออก' }
    ],
    correctAnswer: 'B'
  },
  {
    id: 16,
    text: 'ตัวย่อเชื่อมต่อระบบ API ย่อมาจากคำว่าอะไร?',
    options: [
      { key: 'A', text: 'Application Programming Interface (ส่วนต่อประสานโปรแกรมประยุกต์)' },
      { key: 'B', text: 'Application Protocol Integration' },
      { key: 'C', text: 'Automated Processing Interface' },
      { key: 'D', text: 'Access Point Internet' }
    ],
    correctAnswer: 'A'
  },
  {
    id: 17,
    text: 'ประตูลอจิก (Logic Gate) ประเภทใดให้ผลลัพธ์ผกผันกับการทำงานแบบ AND (NOT-AND)?',
    options: [
      { key: 'A', text: 'ประตู NOR (NOR Gate)' },
      { key: 'B', text: 'ประตู NAND (NAND Gate)' },
      { key: 'C', text: 'ประตู XOR (XOR Gate)' },
      { key: 'D', text: 'ประตู XNOR (XNOR Gate)' }
    ],
    correctAnswer: 'B'
  },
  {
    id: 18,
    text: 'หมายเลขพอร์ตเครือข่ายมาตรฐานของโปรโตคอลความปลอดภัยระดับ HTTPS คือพอร์ตหมายเลขใด?',
    options: [
      { key: 'A', text: '80' },
      { key: 'B', text: '443' },
      { key: 'C', text: '8080' },
      { key: 'D', text: '21' }
    ],
    correctAnswer: 'B'
  },
  {
    id: 19,
    text: 'ในกระบวนทัศน์การเขียนโปรแกรมเชิงวัตถุ (OOP) การสืบทอดคุณสมบัติ (Inheritance) คืออะไร?',
    options: [
      { key: 'A', text: 'การรวบรวมฟังก์ชันการเขียนโค้ดทั้งหมดเอาไว้ในระดับคลาสเดียว' },
      { key: 'B', text: 'ความสามารถของคลาสลูกในการสืบทอดคุณลักษณะและฟังก์ชันพฤติกรรมจากคลาสแม่' },
      { key: 'C', text: 'การเขียนฟังก์ชันทับซ้อนภายใต้ชื่อคำสั่งแบบเดียวกัน' },
      { key: 'D', text: 'เทคนิคการปกปิดโครงสร้างการคำนวณภายในคลาส' }
    ],
    correctAnswer: 'B'
  },
  {
    id: 20,
    text: 'ภาษาคอมพิวเตอร์ในข้อใดจัดเป็นภาษาโปรแกรมระดับต่ำ (Low-level programming language)?',
    options: [
      { key: 'A', text: 'ภาษาแอสเซมบลี (Assembly Language)' },
      { key: 'B', text: 'ภาษาไพทอน (Python)' },
      { key: 'C', text: 'ภาษาจาวา (Java)' },
      { key: 'D', text: 'ภาษาจาวาสคริปต์ (JavaScript)' }
    ],
    correctAnswer: 'A'
  }
];
