import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, UserPlus } from "lucide-react";
import { useAuth } from "../../context/AuthContext";


const CATEGORIES = [
  "Programming",
  "Mathematics",
  "Networking",
  "DSA",
  "DBMS",
  "OOP",
  "Web Development",
  "Cyber Basics",
];
const TOPICS_BY_CATEGORY = {
  Programming: ["C", "Java", "Python", "JavaScript", "Debugging"],
  Mathematics: ["Calculus", "Probability", "Statistics", "Discrete Math"],
  Networking: ["OSI Model", "TCP/IP", "Subnetting", "Routing Basics"],
  DSA: ["Arrays", "Linked Lists", "Stacks & Queues", "Trees", "Sorting"],
  DBMS: ["SQL", "Normalization", "Joins", "Transactions", "ER Modeling"],
  OOP: ["Classes & Objects", "Inheritance", "Polymorphism", "Encapsulation"],
  "Web Development": ["HTML/CSS", "React Basics", "Node/Express", "REST APIs"],
  "Cyber Basics": ["CIA Triad", "Phishing", "Password Security", "Basic Cryptography"],
};


const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

const [role, setRole] = useState("student");
const [name, setName] = useState("");
const [email, setEmail] = useState("");
const [studentID, setStudentID] = useState("");
const [password, setPassword] = useState("");

// ✅ add these
const [year, setYear] = useState("");
const [semester, setSemester] = useState("");
const [weakCategories, setWeakCategories] = useState([]);

// topics
const [weakTopics, setWeakTopics] = useState([]);

const [error, setError] = useState("");

const toggleCategory = (cat) => {
  setWeakCategories((prevCats) => {
    const willRemove = prevCats.includes(cat);
    const nextCats = willRemove
      ? prevCats.filter((c) => c !== cat)
      : [...prevCats, cat];

    // if removing a category, also remove its topics from weakTopics
    if (willRemove) {
      const catTopics = TOPICS_BY_CATEGORY[cat] || [];
      setWeakTopics((prevTopics) => prevTopics.filter((t) => !catTopics.includes(t)));
    }

    return nextCats;
  });
};
const toggleTopic = (topic) => {
  setWeakTopics((prev) =>
    prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
  );
};
  

  const isStudentValid =
    year !== "" && semester !== "" && weakCategories.length > 0;

  const isFormValid =
    name.trim() !== "" &&
    email.trim() !== "" &&
    password.trim() !== "" &&
    (role !== "student" ? true : studentID.trim() !== "" && isStudentValid);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const payload = {
      name,
      email,
      password,
      role,
      ...(role === "student"
        ? {
            studentID,
            year: Number(year),
            semester: Number(semester),
            weakCategories,
            weakTopics, 
          }
        : {}),
    };

    const result = await register(payload);

    if (result.success) navigate(result.redirectTo);
    else setError(result.message);
  };
  

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20">
      <div className="max-w-md w-full">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-100 to-accent-100 rounded-full mb-4">
              <UserPlus className="h-8 w-8 text-primary-600" />
            </div>
            <h1 className="text-3xl font-bold gradient-text mb-2">Register</h1>
            <p className="text-gray-600">Join the EduSphere community</p>
          </div>

          {error && (
            <div
              className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded"
              role="alert"
            >
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Role */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Role
              </label>
              <select
                value={role}
                onChange={(e) => {
                  setRole(e.target.value);
                  // reset student onboarding fields when switching roles
                  if (e.target.value !== "student") {
                    setYear("");
                    setSemester("");
                    setWeakCategories([]);
                  }
                }}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all bg-white"
              >
                <option value="student">Student</option>
                <option value="tutor">Tutor</option>
              </select>
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {role === "student" ? "Student Name" : "Tutor Name"}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {role === "student" ? "Student Email" : "Tutor Email"}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@university.edu"
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
              />
            </div>

            {/* Student-only onboarding */}
            {role === "student" && (
              <>
                {/* Student ID (UI only) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Student ID
                  </label>
                  <input
                    type="text"
                    value={studentID}
                    onChange={(e) => setStudentID(e.target.value)}
                    placeholder="STU123456"
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                  />
                </div>

                {/* Year */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Academic Year
                  </label>
                  <select
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all bg-white"
                    required
                  >
                    <option value="">Select Year</option>
                    <option value="1">1st Year</option>
                    <option value="2">2nd Year</option>
                    <option value="3">3rd Year</option>
                    <option value="4">4th Year</option>
                  </select>
                </div>

                {/* Semester */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Semester
                  </label>
                  <select
                    value={semester}
                    onChange={(e) => setSemester(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all bg-white"
                    required
                  >
                    <option value="">Select Semester</option>
                    <option value="1">Semester 1</option>
                    <option value="2">Semester 2</option>
                  </select>
                </div>

                {/* Weak Categories */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Weak Areas (Select at least 1)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {CATEGORIES.map((cat) => (
                      <label
                        key={cat}
                        className="flex items-center gap-2 text-sm text-gray-700 bg-white rounded-lg border border-gray-200 px-3 py-2"
                      >
                        <input
                          type="checkbox"
                          checked={weakCategories.includes(cat)}
                          onChange={() => toggleCategory(cat)}
                        />
                        <span>{cat}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </>
            )}
            {/* Weak Topics (based on selected categories) */}
{weakCategories.length > 0 && (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      Weak Topics (Optional)
    </label>

    <div className="space-y-3">
      {weakCategories.map((cat) => (
        <div key={cat} className="bg-white rounded-lg border border-gray-200 p-3">
          <p className="text-sm font-semibold text-gray-700 mb-2">{cat}</p>

          <div className="flex flex-wrap gap-2">
            {(TOPICS_BY_CATEGORY[cat] || []).map((topic) => (
              <label
                key={topic}
                className={`cursor-pointer select-none px-3 py-1 rounded-full text-sm border ${
                  weakTopics.includes(topic)
                    ? "bg-primary-600 text-white border-primary-600"
                    : "bg-gray-50 text-gray-700 border-gray-200"
                }`}
              >
                <input
                  type="checkbox"
                  className="hidden"
                  checked={weakTopics.includes(topic)}
                  onChange={() => toggleTopic(topic)}
                />
                {topic}
              </label>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
)}

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={!isFormValid}
              className={`w-full py-3 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-lg font-semibold transition-all duration-300 ${
                isFormValid
                  ? "hover:shadow-lg hover:scale-105 cursor-pointer"
                  : "opacity-50 cursor-not-allowed"
              }`}
            >
              Create Account
            </button>
          </form>

          <p className="text-center mt-6 text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-primary-600 font-semibold hover:underline"
            >
              Login
            </Link>
          </p>

          <Link
            to="/"
            className="flex items-center justify-center gap-2 mt-6 text-gray-600 hover:text-primary-600 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;