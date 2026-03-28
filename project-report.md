# EduSphere Project Report

## 1. Complete File Tree

```text
EduSphere/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── constants/
│   │   └── topics.js
│   ├── controllers/
│   │   ├── adminController.js
│   │   ├── authController.js
│   │   ├── marketplaceController.js
│   │   ├── quizResultController.js
│   │   ├── sessionController.js
│   │   └── userController.js
│   ├── middlewares/
│   │   ├── authMiddleware.js
│   │   └── uploadMiddleware.js
│   ├── models/
│   │   ├── AssignmentRequirement.js
│   │   ├── AssignmentSubmission.js
│   │   ├── ChatConversation.js
│   │   ├── ChatMessage.js
│   │   ├── GameAttempt.js
│   │   ├── index.js
│   │   ├── KuppiReco.js
│   │   ├── ListingImage.js
│   │   ├── ListingReport.js
│   │   ├── MarketplaceListing.js
│   │   ├── PredictionResult.js
│   │   ├── QuizAttempt.js
│   │   ├── QuizResult.js
│   │   ├── RewardTransaction.js
│   │   ├── Score.js
│   │   ├── Session.js
│   │   ├── User.js
│   │   └── Wallet.js
│   ├── routes/
│   │   ├── adminRoutes.js
│   │   ├── authRoutes.js
│   │   ├── marketplaceRoutes.js
│   │   ├── quizResultRoutes.js
│   │   ├── sessionRoutes.js
│   │   └── userRoutes.js
│   ├── scripts/
│   │   └── createAdmin.js
│   ├── uploads/
│   ├── app.js
│   ├── server.js
│   ├── package.json
│   └── package-lock.json
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── api.js
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── CTA.jsx
│   │   │   ├── Features.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Hero.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── RedirectIfAuth.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── admin/
│   │   │   │   └── AdminDashboard.jsx
│   │   │   ├── auth/
│   │   │   │   ├── Login.jsx
│   │   │   │   └── Register.jsx
│   │   │   ├── public/
│   │   │   │   └── Home.jsx
│   │   │   └── student/
│   │   │       ├── components/
│   │   │       ├── marketplace/
│   │   │       │   ├── components/
│   │   │       │   └── StudentMarketplace.jsx
│   │   │       ├── modules/
│   │   │       │   ├── DashboardOverview.jsx
│   │   │       │   ├── Market.jsx
│   │   │       │   ├── PeerLearning.jsx
│   │   │       │   ├── Progress.jsx
│   │   │       │   └── Rewards.jsx
│   │   │       └── StudentDashboard.jsx
│   │   │   └── tutor/
│   │   │       └── TutorDashboard.jsx
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
└── README.md
```

---

## 2. Database Models

### User
- `name` (String, Required)
- `email` (String, Required, Unique)
- `password` (String, Required)
- `role` (String: student, tutor, admin, Required)
- `studentID` (String, default null)
- `year` (Number)
- `semester` (Number)
- `weakCategories` ([String])
- `weakTopics` ([String])

### MarketplaceListing
- `sellerId` (ObjectId, ref: User)
- `title` (String)
- `description` (String)
- `price` (Number)
- `category` (String: Boarding Places, Devices, Student Services, Books & Notes, Clothing, Furniture)
- `condition` (String: New, Like New, Good, Fair, Poor)
- `images` ([String])
- `phoneNumber` (String)
- `whatsappNumber` (String)
- `location` (String)
- `status` (String: active, sold, hidden, removed)

### ListingReport
- `listingId` (ObjectId, ref: MarketplaceListing)
- `reporterId` (ObjectId, ref: User)
- `reason` (String)
- `additionalDetails` (String)
- `status` (String: pending, reviewed, resolved, dismissed)
- `adminActionTaken` (String)

### Session
- `tutorId` (ObjectId, ref: User)
- `category` (String: Programming, Mathematics, Networking, DSA, DBMS, OOP, Web Development, Cyber Basics)
- `topic` (String)
- `date` (Date)
- `time` (String)
- `duration` (Number)
- `mode` (String: online, offline)
- `location` (String)
- `meetingLink` (String)
- `quizLink` (String)
- `capacity` (Number)
- `registeredCount` (Number)
- `description` (String)

### QuizResult
- `sessionId` (ObjectId, ref: Session)
- `studentId` (ObjectId, ref: User)
- `studentEmail` (String)
- `marksObtained` (Number)
- `totalMarks` (Number)
- `percentage` (Number)

### Wallet
- `userId` (ObjectId, ref: User)
- `balance` (Number)
- `currency` (String: coins)

### Other Models
- `AssignmentRequirement`
- `AssignmentSubmission`
- `ChatConversation`
- `ChatMessage`
- `GameAttempt`
- `KuppiReco`
- `PredictionResult`
- `QuizAttempt`
- `RewardTransaction`
- `Score`

---

## 3. All API Endpoints

| Method | Full Path | Auth Required | Role Required | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| POST | `/api/auth/register` | No | - | User registration |
| POST | `/api/auth/login` | No | - | User login |
| GET | `/api/admin/users` | Yes | admin | Get all users |
| POST | `/api/sessions` | Yes | tutor | Create a session |
| GET | `/api/sessions/my-sessions` | Yes | tutor | Get tutor's sessions |
| POST | `/api/quiz-results/import/:sessionId` | Yes | tutor | Import quiz results from Excel |
| GET | `/api/quiz-results/session/:sessionId` | Yes | tutor, admin | Get results for a session |
| GET | `/api/quiz-results/student/:studentId` | Yes | - | Get results for a student |
| GET | `/api/quiz-results/me` | Yes | student | Get my results |
| PUT | `/api/users/onboarding` | Yes | - | Complete onboarding |
| GET | `/api/marketplace` | No | - | Get all listings |
| GET | `/api/marketplace/:id` | No | - | Get listing by ID |
| POST | `/api/marketplace` | Yes | student | Create a listing |
| PUT | `/api/marketplace/:id` | Yes | student | Update a listing |
| DELETE | `/api/marketplace/:id` | Yes | student | Delete a listing |
| POST | `/api/marketplace/:id/images` | Yes | student | Upload images |
| DELETE | `/api/marketplace/:id/images/:imageId` | Yes | student | Delete image |

---

## 4. Frontend Pages & Components

### Public Pages
- **Home**: Landing page with hero, features, and CTA.

### Auth Pages
- **Login**: Login form.
- **Register**: Registration form.

### Student Pages
- **StudentDashboard**: Main dashboard for students with sidebar and content area.
- **StudentMarketplace**: Full marketplace feature with search, categories, and posting capabilities.
- **DashboardOverview**: Placeholder for student overview.
- **PeerLearning**: Placeholder for peer learning features.
- **Progress**: Placeholder for progress tracking.
- **Rewards**: Placeholder for rewards & gamification.

### Tutor/Admin Pages
- **TutorDashboard**: Empty placeholder for tutor functionalities.
- **AdminDashboard**: Empty placeholder for admin functionalities.

### App Routes (in `App.jsx`)
- `/` -> Home
- `/login` -> Login (Redirect if auth)
- `/register` -> Register (Redirect if auth)
- `/student/dashboard` -> StudentDashboard (Protected)
- `/tutor/dashboard` -> TutorDashboard (Protected)
- `/admin/dashboard` -> AdminDashboard (Protected)

---

## 5. Current Feature Status

| Feature | Status | Details |
| :--- | :--- | :--- |
| Authentication | **Fully Built** | Login, Registration, JWT handling, Protected Routes. |
| Student Marketplace | **Fully Built** | Backend CRUD, Image uploads, Frontend search, filter, post, details. |
| Student Dashboard Structure | **Fully Built** | Sidebar navigation, dynamic content loading. |
| Tutor Session Management | **Partially Built** | Backend API exists; Frontend is currently empty. |
| Quiz Result Import | **Partially Built** | Backend Excel import exists; Frontend is missing. |
| Admin Basic | **Partially Built** | Backend `getAllUsers` exists; Frontend is empty. |
| Progress Tracking | **Missing** | Placeholder only. |
| Rewards & Games | **Missing** | Backend models exist; Frontend is placeholder. |
| Peer Learning (Kuppi) | **Missing** | Placeholder only. |

---

## 6. Admin Dashboard Analysis

### Existing Admin-Related Code
- **Backend API**: `GET /api/admin/users` for listing all users.
- **Models**: `ListingReport` for handling marketplace reports; `User` model with roles.
- **Middleware**: `authorize("admin")` for endpoint protection.
- **Scripts**: `createAdmin.js` for seeding initial admin users.

### What Needs to be Built
- **User Management UI**: Interface to view, disable, or delete users; manage tutor applications.
- **Marketplace Moderation**: Interface to review reported listings (linked to `ListingReport` model) and delete inappropriate content.
- **Content Overview**: Global view of sessions, quiz results, and platform activity.
- **Financial Audit**: Review `RewardTransaction` and `Wallet` balances platform-wide.

### Database Collections Admin Needs Access To
1. `Users`: For platform governance.
2. `MarketplaceListing`: For content moderation.
3. `ListingReport`: For processing user complaints.
4. `Session`: For monitoring tutor activity.
5. `QuizResult`: For overseeing platform educational metrics.
6. `RewardTransaction` & `Wallet`: For platform economy monitoring.
7. `GameAttempt` & `Score`: For platform engagement monitoring.
