# Lincoln College Online Complaints Management System (LCOCMS)
### Project Requirements Document — Final Year Project

---

## 1. Project Overview

**Project Name:** Lincoln College Online Complaints Management System (LCOCMS)

**Problem Statement:**
Students at Lincoln College currently have no structured, transparent, or safe channel to raise complaints about academics, lecturers, hostel conditions, tuition/fees, or ICT issues. Manual, verbal, or informal complaint methods lead to slow response times, lost complaints, no accountability, and discourage students from speaking up for fear of consequences.

**Proposed Solution:**
A web-based complaints management system where students can submit categorized complaints without registering an account, choosing on a per-complaint basis whether to include their name and email or submit anonymously, track the status of their complaint using a unique reference code, and where category-specific college admins can view, manage, and resolve complaints relevant to their department — with a Super Admin overseeing the entire system.

**Core Design Principles:**
- **Choice** — students decide per complaint whether their identity is visible to the admin or hidden behind a placeholder
- **Simplicity** — no login/registration needed to submit; low friction
- **Transparency** — students can always check status via their reference code
- **Accountability** — complaints are routed to the right department, with tracking

---

## 2. User Roles

| Role | Description | Access |
|---|---|---|
| **Student** | Submits complaints, no registration required — can include name/email or submit anonymously per complaint | Complaint form, tracking page (via reference code) |
| **Academic Admin** | Handles academic/lecturer-related complaints | Academic category only |
| **Hostel Admin** | Handles hostel/facility complaints | Hostel category only |
| **Finance Admin** | Handles tuition/fees complaints | Finance category only |
| **ICT Admin** | Handles ICT/portal complaints | ICT category only |
| **Super Admin** | Full oversight (Director/VC office) | All categories, analytics, reassignment |

---

## 3. Complaint Categories

- Academic / Lecturer Complaints
- Tuition & Fees
- Hostel / Facilities
- ICT / Portal Issues
- General / Other

---

## 4. Core Features

### Student-facing
1. **Landing Page** — brief intro to the system, "Drop a Complaint" and "Track a Complaint" as the two primary actions
2. **Submit Complaint Flow**
   - Select category
   - Write complaint (subject + description)
   - Optional: attach evidence (image/document)
   - **Identity choice:** Student can either:
     - (a) Enter their **name and email** — visible to the relevant admin on their dashboard, and used to email the student their reference code and status updates, or
     - (b) Tick **"Submit Anonymously"** — no real name/email shown to the admin; the dashboard displays a generated placeholder like "Anonymous234" instead; email can still be provided solely for notifications, but is never revealed to the admin
   - Submit → system generates a unique reference code (e.g., `LC-2026-0483`)
   - Confirmation screen showing the code clearly, with a "copy code" action
   - If an email was provided, the reference code and confirmation are also emailed automatically — regardless of the anonymity choice
3. **Track Complaint Page**
   - Input reference code
   - View status: **Pending → Under Review → Resolved**
   - View admin's response/resolution note once available

### Admin-facing
4. **Admin Login** (role-based: Academic / Hostel / Finance / ICT / Super Admin)
5. **Admin Dashboard**
   - List/table of complaints in their category
   - Filter by status (Pending, Under Review, Resolved)
   - Search by reference code
   - Complaint detail view → respond, change status, add internal notes
6. **Super Admin Dashboard**
   - All complaints across all categories
   - Analytics: total complaints, resolution rate, average resolution time, complaints by category, unresolved complaints aging
   - Reassign miscategorized complaints
   - Manage admin accounts (activate/deactivate)

---

## 4a. Privacy Rule — Identity Visibility Follows the Student's Own Choice

This is the most important business rule in the system, so it's worth stating precisely with an example:

> Esther is a student. Mrs. Jacob is Academic/Student Affairs Admin.
> - If Esther submits her complaint **with** her name and email (did **not** tick "Submit Anonymously"), Mrs. Jacob sees Esther's real name and email on her dashboard when reviewing that complaint.
> - If Esther **ticks "Submit Anonymously,"** Mrs. Jacob instead sees a generated placeholder like **"Anonymous234"** in place of Esther's name — her real identity is never shown, regardless of what's stored in the database.
> - In both cases, Esther can still receive her reference code and status updates by email (if she provided one), and can track her complaint the same way.

**In short:** the student decides, per complaint, whether the admin sees their identity or not. This is not a system-wide "always hide from admin" rule — it's a per-submission toggle controlled entirely by the student.

**What this means for design/build:**
- The complaint form includes a clear toggle/checkbox: "Submit Anonymously" (unchecked by default, or however your friend prefers)
- If unchecked → name and email fields appear, and are shown as-is on admin dashboards
- If checked → name/email fields are skipped (or hidden), and the admin dashboard renders a generated label like "Anonymous234" instead of a name for that complaint
- Email notifications to the student (reference code, status updates) work identically either way, as long as an email was provided — the anonymity toggle only affects what the *admin* sees, not what the student receives
- Each anonymous complaint should get a distinct placeholder (Anonymous1, Anonymous2, Anonymous234, etc.) rather than all showing simply "Anonymous," so admins can still tell separate anonymous complaints apart without knowing who they're from

---

## 5. Key User Flows

**Flow 1 — Student submits a complaint**
Landing Page → Drop a Complaint → Select Category → Fill Complaint Form → Submit → Confirmation Screen (Reference Code)

**Flow 2 — Student tracks a complaint**
Landing Page → Track a Complaint → Enter Reference Code → View Status & Response

**Flow 3 — Admin resolves a complaint**
Admin Login → Dashboard (filtered by category) → Open Complaint → Read Details → Respond → Update Status → Resolved

**Flow 4 — Super Admin oversight**
Super Admin Login → Dashboard (all categories) → View Analytics → Reassign / Monitor → Manage Admins

---

## 6. Screens Checklist (for Figma)

**Public / Student side**
- [ ] Landing Page
- [ ] Select Complaint Category
- [ ] Submit Complaint Form
- [ ] Complaint Submitted / Confirmation (reference code)
- [ ] Track Complaint (enter code)
- [ ] Complaint Status View (Pending / Under Review / Resolved)

**Admin side**
- [ ] Admin Login
- [ ] Category Admin Dashboard (table/list view)
- [ ] Complaint Detail View (respond + status update)
- [ ] Super Admin Dashboard (all categories + analytics)
- [ ] Analytics/Reports View
- [ ] Manage Admins (Super Admin only)

**States to design for**
- Empty state (no complaints yet)
- Loading state
- Success/confirmation state
- Error state (invalid reference code)

---

## 7. Visual Direction — Modern, Trustworthy, Calm

Since this deals with sensitive complaints, the tone should feel **safe, official, and calm** — not playful. Think "trustworthy institution" rather than "startup app." Avoid harsh reds/aggressive colors that feel alarming; status colors should be the only accent pops.

### Suggested Color Palette

| Role | Color | Hex | Use |
|---|---|---|---|
| Primary | Deep Indigo | `#2B3A67` | Headers, primary buttons, nav |
| Primary Light | Soft Indigo | `#4A5C99` | Hover states, secondary buttons |
| Accent | Warm Amber | `#F2A93B` | CTAs like "Drop a Complaint," highlights |
| Background | Off-White | `#F7F8FA` | App background |
| Surface | White | `#FFFFFF` | Cards, forms |
| Text Primary | Charcoal | `#1E2233` | Body text |
| Text Secondary | Slate Gray | `#6B7280` | Captions, helper text |
| Success (Resolved) | Muted Green | `#2E9E6B` | Resolved status |
| Warning (Under Review) | Amber | `#E9A227` | Under Review status |
| Neutral (Pending) | Gray-Blue | `#8A93A6` | Pending status |
| Error | Muted Red | `#D0564A` | Error states, validation only |

This gives you a calm indigo/amber institutional palette with clear, distinct status colors for the three complaint states — important since status visibility is core to the product.

### Typography

- **Headings:** `Space Grotesk` or `Sora` — modern, slightly geometric, feels current without being trendy/playful
- **Body/UI text:** `Inter` or `Manrope` — extremely readable, standard for clean modern interfaces
- **Pairing suggestion:** Space Grotesk for headings + Inter for body text

### General UI Style Notes
- Rounded corners (8–12px) for a soft, approachable but professional feel
- Generous whitespace — this is not a data-dense dashboard app for students, keep the submission flow light and uncluttered
- Admin dashboards can be slightly denser (tables, filters) but keep consistent color/type system
- Use icons sparingly and consistently (category icons for Academic/Hostel/Finance/ICT help scannability)
- Reference code should be displayed prominently, large, and easy to copy — this is the single most important piece of UI in the whole system

---

## 8. Figma Make Prompt (Ready to Use)

> Design a modern, trustworthy web application called "Lincoln College Online Complaints Management System." It has two sides: a public student-facing flow (no login) where students submit complaints by selecting a category (Academic, Tuition & Fees, Hostel, ICT, General), filling a short form with name and email fields, and a toggle/checkbox to "Submit Anonymously" instead. After submitting, they receive a unique tracking reference code on a confirmation screen. Students can later track their complaint status (Pending, Under Review, Resolved) using that code. The second side is an admin dashboard (role-based login) where category admins view and respond to complaints in a table/list layout — complaints submitted with identity show the student's real name, while complaints submitted anonymously show a generated placeholder like "Anonymous234" instead — and a Super Admin sees all complaints across categories plus analytics (total complaints, resolution rate, complaints by category).
>
> Visual style: calm, official, modern institutional feel — not playful. Use a deep indigo (#2B3A67) as the primary color, warm amber (#F2A93B) as the accent/CTA color, off-white (#F7F8FA) background, and distinct status colors for Pending (gray-blue #8A93A6), Under Review (amber #E9A227), and Resolved (green #2E9E6B). Use Space Grotesk for headings and Inter for body text. Rounded corners, generous whitespace on the student-facing screens, clean data tables on the admin dashboard.
>
> Generate: Landing page, category selection screen, complaint submission form, confirmation screen with reference code, track complaint screen, complaint status view, admin login, category admin dashboard, complaint detail/response view, and Super Admin dashboard with analytics.

---

## 9. Notes for Your Report / Defense

- Cite the anonymity design decision against literature emphasizing that complaint systems should provide students a safe space to speak without fear of consequences — this is a well-supported design justification in complaint-management research.
- Reference code system is comparable to how tracking-without-login works in courier/package tracking and ombudsman complaint systems — a defensible, precedented UX pattern for anonymous systems needing follow-up.
- Be ready to explain the trade-off: anonymity means admins can't follow up directly with the student beyond what's in the complaint text, and can't verify complaint legitimacy the way an identified system could. This is worth a paragraph in your "Limitations" section.