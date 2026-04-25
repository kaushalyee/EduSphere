# EduSphere Student Dashboard: UI & Styling Report

This report provides a detailed analysis of the UI structure, styling conventions, and design tokens used across the Student Dashboard files in the EduSphere project.

---

## 1. Overall Layout Structure (`StudentDashboard.jsx`)

The dashboard follows a standard **persistent sidebar** with a **top header** and a **dynamic content area**.

*   **Structure**: Built using Flexbox. The root container is a horizontal flex layout that holds the sidebar and a vertical flex column for the header and content.
*   **Main Container Classes**: 
    ```tailwind
    "min-h-screen bg-gray-50 flex"
    ```
*   **Arrangement**:
    *   `StudentSidebar`: Fixed to the left (implicitly through flex-row).
    *   `Main Content Area`: A nested flex column container spans the rest of the width.
        ```tailwind
        "main-content flex-1 min-w-0 flex flex-col"
        ```
    *   The `main` tag inside the content area handles vertical scrolling for the modules:
        ```tailwind
        "flex-1 p-6 overflow-auto"
        ```

---

## 2. Sidebar Styling (`StudentSidebar.jsx`)

The sidebar is a clean, white-themed component with clear active states and a subtle border.

*   **Background Color**: `bg-white`
*   **Width**: Controlled by content and padding (no fixed width class on the container itself).
*   **Logo/Branding Section**:
    *   Container: `h-16 flex items-center px-[18px] border-b border-gray-100 hover:bg-gray-50 transition-colors`
    *   Icon: `text-blue-600` (GraduationCap)
    *   Text: `text-gray-800 font-bold text-lg`
*   **Navigation Items**:
    *   **Base Item**: `sidebar-item w-full flex items-center px-[22px] py-3 transition-all duration-200 border-l-4`
    *   **Active State**: `bg-blue-50 text-blue-600 font-semibold border-blue-600`
    *   **Non-active State**: `text-gray-600 hover:bg-gray-100 hover:text-gray-800 border-transparent`
*   **Icon Styling**:
    *   `flex-shrink-0` with conditional color: `text-blue-600` (active) vs `text-gray-400` (inactive).
*   **Logout Button**:
    *   `w-full flex items-center px-[22px] py-3 text-red-500 hover:bg-red-50 hover:text-red-600 transition-all rounded-xl`
*   **Sticky Behavior**:
    *   The container uses `h-screen flex flex-col` to stay fixed to the viewport height.

---

## 3. Header Styling (`StudentHeader.jsx`)

The header provides context for the current module and user actions.

*   **Background Color**: `bg-white`
*   **Height**: `h-16` (Matches the logo section of the sidebar for alignment).
*   **Title & Subtitle**:
    *   Title: `text-lg font-bold text-gray-800`
    *   Subtitle: `text-sm text-gray-500` ("Welcome back")
*   **Border**: `border-b border-gray-200`
*   **Right Side Elements**:
    *   **GP Badge (Conditional)**: `bg-[#1e293b] rounded-full px-4 py-1 border border-gray-700 shadow-lg text-white font-black`
    *   **Avatar Toggle**: `w-8 h-8 rounded-xl bg-[#2F66E0] flex items-center justify-center text-white text-sm font-bold`
    *   **Dropdown Menu**: `bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden`

---

## 4. Content Area Styling (`StudentContent.jsx`)

The content area serves as the viewport for individual dashboard modules.

*   **Background Color**: `bg-gray-50` (Inherited from the dashboard root).
*   **Padding**: `p-6` (Uniform padding around all modules).
*   **Module Loading**: Implemented via a `switch` statement in `StudentContent.jsx`, mapping `activeTab` strings to functional components (e.g., `DashboardOverview`, `PeerLearning`).

---

## 5. Dashboard Overview Cards (`DashboardOverview.jsx`)

Statistics and actions are presented in a grid of modular cards.

*   **Card Containers**: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4`
*   **Stat Card Styling**:
    *   `p-6 rounded-xl border-2`
    *   **Themed Variants**:
        *   Green: `bg-green-50 border-green-200`
        *   Blue: `bg-blue-50 border-blue-200`
        *   Orange: `bg-orange-50 border-orange-200`
        *   Purple: `bg-purple-50 border-purple-200`
*   **Quick Action Cards**:
    *   `p-6 border border-gray-200 rounded-xl hover:shadow-lg transition-all group`
*   **Typography in Cards**:
    *   Stat Value: `text-2xl font-bold text-gray-800`
    *   Stat Label: `text-gray-600 text-sm`
    *   Card Headings: `text-xl font-bold text-gray-800`

---

## 6. Color Palette Used

The dashboard uses a wide array of Tailwind colors to differentiate modules and indicate status.

| Category | Tailwind Classes Used |
| :--- | :--- |
| **Primary/Action** | `blue-600`, `indigo-600`, `blue-500`, `indigo-700` |
| **Success** | `green-600`, `green-500`, `green-200`, `green-50` |
| **Warning/Alert** | `orange-600`, `amber-100`, `orange-50`, `orange-200` |
| **Error** | `red-600`, `red-500`, `red-200`, `red-50` |
| **Backgrounds** | `gray-50` (main), `white` (surfaces), `gray-100` (hovers) |
| **Text** | `gray-800` (primary), `gray-600` (secondary), `gray-500` (muted) |
| **Borders** | `gray-200`, `gray-100`, `slate-100` |
| **Special** | `[#1e293b]` (GP Badge), `[#2F66E0]` (Avatar), `[#22c55e]` (Success Green) |

---

## 7. Typography

The dashboard maintains a hierarchy using consistent font sizes and weights.

*   **Font Sizes**:
    *   `text-3xl`: Large page titles (e.g., Welcome message).
    *   `text-2xl`: Major numbers/stats and primary alert headings.
    *   `text-xl`: Section headers and module titles.
    *   `text-lg`: Sidebar logo and secondary headings.
    *   `text-sm`: Navigation labels, card descriptions, and secondary metadata.
    *   `text-xs`: Micro-copy (e.g., "Must be issued within 6 months").
*   **Font Weights**:
    *   `font-bold`: Used for identity (logo), section titles, and active navigation indicators.
    *   `font-semibold`: Used for buttons, alert sub-titles, and emphasized text.
    *   `font-medium`: Used for navigation items and form labels.
    *   `font-black`: Used for the GP badge to give it a "gamed" feel.
*   **Common Text Colors**: 
    *   Headings: `text-gray-800`
    *   Body: `text-gray-600`
    *   Muted/Captions: `text-gray-500`
    *   Accent: `text-blue-600`
