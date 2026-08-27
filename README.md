# LINE OA Flex Broadcast Manager (`kma-line-flex`)

ระบบ Web Application สำหรับสร้าง ทดสอบ และส่งข้อความผ่าน **LINE Official Account Messaging API** โดยใช้สถาปัตยกรรม **Structured Message Builder + Template System + AI Content Assistant**

## 🚀 Key Features

1. **7 Message Formats Supported:**
   - **TYPE 01 — Text Message:** ข้อความธรรมดาความยาวสูงสุด 5,000 ตัวอักษร
   - **TYPE 02 — Single Image:** ภาพโปรโมชั่นเดี่ยวความละเอียดสูง (HTTPS)
   - **TYPE 03 — Imagemap Studio:** ภาพเดียวรองรับหลายพื้นที่คลิก พร้อม **Visual Canvas Editor** (ลากกรอบบนภาพเพื่อกำหนด Click Area อัตโนมัติ ปรับสเกลตามมาตรฐาน LINE 1040px)
   - **TYPE 04 — Flex Single Card:** การ์ดเดี่ยวพร้อมรูปหลัก, Badge โปรโมชั่น, ราคาลด, และปุ่ม CTA
   - **TYPE 05 — Flex Carousel:** แคตตาล็อกสินค้าแบบเลื่อนสไลด์ (1-12 การ์ด) รองรับการเพิ่ม ทำสำเนา ลบ และจัดลำดับ
   - **TYPE 06 — Campaign Hero + Product Carousel:** ชุดข้อความแบนเนอร์ใหญ่ตามด้วยรายการสินค้า
   - **TYPE 07 — Mixed Message Builder:** จัดบล็อกข้อความอิสระได้สูงสุด 5 บล็อก

2. **Core Architectural Principle:**
   - ห้ามไม่ให้ AI สร้าง Flex JSON โดยตรง แต่ใช้ AI เป็น **Content Assistant** ในการแปลงข้อความเป็น Structured Data
   - การสร้าง JSON ทั้งหมดประมวลผลผ่าน **Modular TypeScript Renderers** (`renderText`, `renderImage`, `renderImagemap`, `renderFlexCard`, `renderFlexCarousel`, `renderHeroCarousel`, `renderMixedMessage`)

3. **Interactive Mobile Live Preview:**
   - จำลองหน้าจอห้องแชต LINE Mobile เสมือนจริง พร้อมการเลื่อน Swipe Carousel และคลิกดูรายละเอียดโซนบน Imagemap
   - ดู Payload Raw LINE JSON ได้แบบเรียลไทม์

4. **Safety & Validation Layer:**
   - **Environment Mode Switch:** สลับระหว่าง `DEVELOPMENT` (ห้ามยิง Broadcast จริง อนุญาตเฉพาะ Send Test) และ `PRODUCTION`
   - **Send Test:** ยิงทดสอบเข้าห้องแชตจริงผ่าน LINE User ID
   - **Confirmation Modal:** สรุปรายละเอียดแคมเปญก่อนส่งจริง

5. **Template System vs Campaign Separation:**
   - มาพร้อม 6 Official Built-in Templates
   - สามารถบันทึกแคมเปญที่สร้างไว้เป็น Custom Template สำหรับใช้งานซ้ำในทีม

6. **UTM Tracking Builder & Media Library:**
   - ระบบแนบ UTM Parameter ต่อท้ายลิงก์ทุกปุ่มอัตโนมัติ
   - คลังรูปภาพสำหรับคัดลอก URL ภาพไปใช้งาน

---

## 🛠️ Tech Stack

- **Framework:** Next.js (App Router, TypeScript)
- **Styling:** Tailwind CSS, Lucide Icons
- **AI Integration:** Google Gemini API (with smart fallback content parser)
- **Messaging API:** LINE Official Account Messaging API v2

---

## 🏁 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```

เปิดเว็บเบราว์เซอร์ไปที่ [http://localhost:3000](http://localhost:3000)

### 3. Build for Production
```bash
npm run build
npm start
```
