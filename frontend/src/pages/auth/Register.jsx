import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, UserPlus, CheckCircle, Upload } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { CATEGORIES, TOPICS_BY_CATEGORY } from "../../constants/constants";
import api from "../../api/api";

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [role, setRole] = useState("student");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [studentID, setStudentID] = useState("");
  const [password, setPassword] = useState("");
  const [year, setYear] = useState("");
  const [semester, setSemester] = useState("");
  const [weakCategories, setWeakCategories] = useState([]);
  const [weakTopics, setWeakTopics] = useState([]);

  // Verification document states
  const [documentType, setDocumentType] = useState("");
  const [studentIdPhoto, setStudentIdPhoto] = useState(null);
  const [supportingDocument, setSupportingDocument] = useState(null);

  const [error, setError] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);

  const validateStudentID = (id) => {
    const regex = /^it\d{8}$/i;
    return regex.test(id.trim());
  };

  const validatePassword = (value) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
    return regex.test(value);
  };

  const validateEmail = (value) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(value.trim());
  };

  const toggleCategory = (cat) => {
    setWeakCategories((prevCats) => {
      const willRemove = prevCats.includes(cat);
      const nextCats = willRemove
        ? prevCats.filter((c) => c !== cat)
        : [...prevCats, cat];

      if (willRemove) {
        const catTopics = TOPICS_BY_CATEGORY[cat] || [];
        setWeakTopics((prevTopics) =>
          prevTopics.filter((topic) => !catTopics.includes(topic))
        );
      }
      return nextCats;
    });
  };

  const toggleTopic = (topic) => {
    setWeakTopics((prevTopics) =>
      prevTopics.includes(topic)
        ? prevTopics.filter((t) => t !== topic)
        : [...prevTopics, topic]
    );
  };

  const isStudentValid =
    year !== "" &&
    semester !== "" &&
    weakCategories.length > 0 &&
    validateStudentID(studentID) &&
    documentType !== "" &&
    studentIdPhoto !== null &&
    supportingDocument !== null;

  const isFormValid =
    name.trim() !== "" &&
    validateEmail(email) &&
    validatePassword(password) &&
    (role !== "student" || isStudentValid);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (name.trim() === "") {
      setError("Name is required");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (!validatePassword(password)) {
      setError(
        "Password must be at least 6 characters and include uppercase, lowercase, and a number"
      );
      return;
    }

    if (role === "student") {
      if (!validateStudentID(studentID)) {
        setError(
          "Student ID must start with IT and contain 8 digits (example: IT21450064)"
        );
        return;
      }
      if (year === "") {
        setError("Please select academic year");
        return;
      }
      if (semester === "") {
        setError("Please select semester");
        return;
      }
      if (weakCategories.length === 0) {
        setError("Please select at least one weak area");
        return;
      }
      if (!documentType) {
        setError("Please select a document type");
        return;
      }
      if (!studentIdPhoto) {
        setError("Student ID photo is required");
        return;
      }
      if (!supportingDocument) {
        setError("Supporting document is required");
        return;
      }

      const idExt = studentIdPhoto.name.split(".").pop().toLowerCase();
      if (!["jpg", "jpeg", "png"].includes(idExt)) {
        setError("Student ID photo must be a jpg, jpeg, or png image");
        return;
      }

      const docExt = supportingDocument.name.split(".").pop().toLowerCase();
      if (!["jpg", "jpeg", "png", "pdf"].includes(docExt)) {
        setError("Supporting document must be jpg, jpeg, png, or pdf");
        return;
      }

      if (studentIdPhoto.size > 5 * 1024 * 1024) {
        setError("File size must be less than 5MB");
        return;
      }
      if (supportingDocument.size > 5 * 1024 * 1024) {
        setError("File size must be less than 5MB");
        return;
      }

      // Student registration — FormData to support file uploads
      try {
        const formData = new FormData();
        formData.append("name", name.trim());
        formData.append("email", email.trim().toLowerCase());
        formData.append("password", password);
        formData.append("role", role);
        formData.append("studentID", studentID.trim().toUpperCase());
        formData.append("year", year);
        formData.append("semester", semester);
        weakCategories.forEach((cat) => formData.append("weakCategories", cat));
        weakTopics.forEach((topic) => formData.append("weakTopics", topic));
        formData.append("documentType", documentType);
        formData.append("studentIdPhoto", studentIdPhoto);
        formData.append("supportingDocument", supportingDocument);

        const { data } = await api.post("/auth/register", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        if (data.user.role === "student" && data.user.verificationStatus === "pending") {
          setPendingVerification(true);
        } else {
          localStorage.setItem("isNewUser", "true");
          navigate("/student/dashboard");
        }
      } catch (err) {
        setError(err.response?.data?.message || "Registration failed");
      }
      return;
    }

    // Tutor registration — existing JSON flow unchanged
    const payload = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
      role,
    };
    const result = await register(payload);
    if (result.success) {
      localStorage.setItem("isNewUser", "true");
      navigate(result.redirectTo);
    } else {
      setError(result.message || "Registration failed");
    }
  };

  // ── Pending verification screen ───────────────────────────────────────────
  if (pendingVerification) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-20 bg-gradient-to-br from-blue-100 via-sky-50 to-blue-200">
        <div className="max-w-md w-full">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Registration Successful!
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              Your account is pending verification
            </p>
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 text-left space-y-3 mb-8">
              <div className="flex gap-2 text-sm text-blue-700">
                <span className="mt-0.5">•</span>
                <span>
                  Our admin team will review your documents within{" "}
                  <strong>24–48 hours</strong>.
                </span>
              </div>
              <div className="flex gap-2 text-sm text-blue-700">
                <span className="mt-0.5">•</span>
                <span>You will receive an email once your account is verified.</span>
              </div>
              <div className="flex gap-2 text-sm text-blue-700">
                <span className="mt-0.5">•</span>
                <span>
                  You can login with limited access while waiting for
                  verification.
                </span>
              </div>
            </div>
            <button
              onClick={() => navigate("/login")}
              className="w-full py-3 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer"
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Registration form ─────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20 bg-gradient-to-br from-blue-100 via-sky-50 to-blue-200">
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
            {/* Role selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Role
              </label>
              <select
                value={role}
                onChange={(e) => {
                  const newRole = e.target.value;
                  setRole(newRole);
                  setError("");
                  if (newRole !== "student") {
                    setStudentID("");
                    setYear("");
                    setSemester("");
                    setWeakCategories([]);
                    setWeakTopics([]);
                    setDocumentType("");
                    setStudentIdPhoto(null);
                    setSupportingDocument(null);
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
                onChange={(e) => {
                  setName(e.target.value);
                  if (error) setError("");
                }}
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
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError("");
                }}
                placeholder="Student@mail.com"
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
              />
            </div>

            {/* Student-only fields */}
            {role === "student" && (
              <>
                {/* Student ID */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Student ID
                  </label>
                  <input
                    type="text"
                    value={studentID}
                    onChange={(e) => {
                      setStudentID(e.target.value.toUpperCase());
                      if (error) setError("");
                    }}
                    placeholder="IT21450064"
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Must start with IT and contain 8 digits
                  </p>
                </div>

                {/* Academic Year */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Academic Year
                  </label>
                  <select
                    value={year}
                    onChange={(e) => {
                      setYear(e.target.value);
                      if (error) setError("");
                    }}
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
                    onChange={(e) => {
                      setSemester(e.target.value);
                      if (error) setError("");
                    }}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all bg-white"
                    required
                  >
                    <option value="">Select Semester</option>
                    <option value="1">Semester 1</option>
                    <option value="2">Semester 2</option>
                  </select>
                </div>

                {/* Weak Areas */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Weak Areas (Select at least 1)
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {CATEGORIES.map((cat) => (
                      <label
                        key={cat}
                        className="flex items-center gap-2 text-sm text-gray-700 bg-white rounded-lg border border-gray-200 px-3 py-2"
                      >
                        <input
                          type="checkbox"
                          checked={weakCategories.includes(cat)}
                          onChange={() => {
                            toggleCategory(cat);
                            if (error) setError("");
                          }}
                        />
                        <span>{cat}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Weak Topics (optional) */}
            {role === "student" && weakCategories.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Weak Topics (Optional)
                </label>
                <div className="space-y-3">
                  {weakCategories.map((cat) => (
                    <div
                      key={cat}
                      className="bg-white rounded-lg border border-gray-200 p-3"
                    >
                      <p className="text-sm font-semibold text-gray-700 mb-2">
                        {cat}
                      </p>
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
                              onChange={() => {
                                toggleTopic(topic);
                                if (error) setError("");
                              }}
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

            {/* Verification documents — student only */}
            {role === "student" && (
              <>
                <div className="border-t border-gray-200 pt-4">
                  <p className="text-sm font-semibold text-gray-800 mb-1">
                    Verification Documents
                  </p>
                  <p className="text-xs text-gray-500 mb-4">
                    Required to verify your student status. Documents must be
                    issued within the last 6 months.
                  </p>

                  {/* Document Type */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Supporting Document Type
                    </label>
                    <select
                      value={documentType}
                      onChange={(e) => {
                        setDocumentType(e.target.value);
                        if (error) setError("");
                      }}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all bg-white"
                    >
                      <option value="">Select document type</option>
                      <option value="exam_timetable">Exam Timetable</option>
                      <option value="enrollment_letter">
                        Student Enrollment Letter
                      </option>
                      <option value="course_registration">
                        Course Registration Document
                      </option>
                    </select>
                  </div>

                  {/* Student ID Photo */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Student ID Photo
                    </label>
                    <label className="flex items-center gap-3 w-full px-4 py-3 rounded-lg border border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 cursor-pointer transition-all">
                      <Upload className="h-5 w-5 text-gray-400 shrink-0" />
                      <span className="text-sm text-gray-500 truncate">
                        {studentIdPhoto ? studentIdPhoto.name : "Click to upload (jpg, jpeg, png)"}
                      </span>
                      <input
                        type="file"
                        accept=".jpg,.jpeg,.png"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            setStudentIdPhoto(file);
                            if (error) setError("");
                          }
                        }}
                      />
                    </label>
                    {studentIdPhoto && (
                      <p className="text-xs text-green-600 mt-1 font-medium">
                        ✓ {studentIdPhoto.name}
                      </p>
                    )}
                    <p className="text-xs text-gray-400 mt-1">Max size: 5MB</p>
                  </div>

                  {/* Supporting Document */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Supporting Document
                    </label>
                    <label className="flex items-center gap-3 w-full px-4 py-3 rounded-lg border border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 cursor-pointer transition-all">
                      <Upload className="h-5 w-5 text-gray-400 shrink-0" />
                      <span className="text-sm text-gray-500 truncate">
                        {supportingDocument
                          ? supportingDocument.name
                          : "Click to upload (jpg, jpeg, png, pdf)"}
                      </span>
                      <input
                        type="file"
                        accept=".jpg,.jpeg,.png,.pdf"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            setSupportingDocument(file);
                            if (error) setError("");
                          }
                        }}
                      />
                    </label>
                    {supportingDocument && (
                      <p className="text-xs text-green-600 mt-1 font-medium">
                        ✓ {supportingDocument.name}
                      </p>
                    )}
                    <p className="text-xs text-gray-400 mt-1">
                      Max size: 5MB · Must be issued within the last 6 months
                    </p>
                  </div>
                </div>
              </>
            )}

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError("");
                }}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
              />
              <p className="text-xs text-gray-500 mt-1">
                Minimum 6 characters with uppercase, lowercase, and a number
              </p>
            </div>

            <button
              type="submit"
              disabled={!isFormValid}
              className="w-full py-3 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-lg font-semibold transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none"
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
