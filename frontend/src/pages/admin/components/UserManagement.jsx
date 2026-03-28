import React, { useState, useEffect } from "react";
import { 
  Users, 
  Search, 
  Trash2, 
  GraduationCap, 
  Briefcase,
  AlertTriangle,
  Loader2,
  Filter,
  Clock
} from "lucide-react";
import api from "../../../api/api";

export default function UserManagement() {
  const [activeTab, setActiveTab] = useState("student");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteUser, setDeleteUser] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get("/admin/users");
      if (response.data.success) {
        setUsers(response.data.data);
      } else {
        setError(response.data.message || "Failed to load users");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async () => {
    if (!deleteUser) return;
    try {
      setIsDeleting(true);
      const response = await api.delete(`/admin/users/${deleteUser._id}`);
      if (response.data.success) {
        setUsers(users.filter((u) => u._id !== deleteUser._id));
        setDeleteUser(null);
      } else {
        alert(response.data.message || "Failed to delete user");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Deletion failed. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesTab = user.role === activeTab;
    const matchesSearch = 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const getInitials = (name) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  const avatarColors = [
    "bg-blue-100 text-blue-600",
    "bg-purple-100 text-purple-600",
    "bg-emerald-100 text-emerald-600",
    "bg-rose-100 text-rose-600",
    "bg-amber-100 text-amber-600"
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header & Tabs */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">User Management</h2>
          <p className="text-gray-500 font-medium mt-1">Manage all students and tutors registered on the EduSphere platform.</p>
          
          <div className="flex items-center gap-2 mt-6 bg-gray-100 p-1.5 rounded-2xl w-fit">
            <button 
              onClick={() => setActiveTab("student")}
              className={`px-6 py-2.5 rounded-xl font-bold transition-all ${activeTab === "student" ? "bg-white text-primary-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
            >
              Students
            </button>
            <button 
              onClick={() => setActiveTab("tutor")}
              className={`px-6 py-2.5 rounded-xl font-bold transition-all ${activeTab === "tutor" ? "bg-white text-primary-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
            >
              Tutors
            </button>
          </div>
        </div>

        <div className="relative group min-w-[320px]">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
          <input 
            type="text" 
            placeholder={`Search ${activeTab}s by name or email...`}
            className="w-full pl-14 pr-6 py-4 bg-white border border-gray-200 rounded-2xl shadow-sm focus:outline-none focus:ring-4 focus:ring-primary-50 focus:border-primary-400 transition-all font-medium"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Content Table */}
      <div className="bg-white rounded-[2.5rem] border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-40 flex flex-col items-center justify-center">
            <Loader2 className="w-12 h-12 text-primary-600 animate-spin mb-4" />
            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Loading User Data...</p>
          </div>
        ) : error ? (
           <div className="py-20 flex flex-col items-center justify-center text-rose-600">
             <AlertTriangle className="w-12 h-12 mb-4 opacity-20" />
             <p className="font-bold">{error}</p>
           </div>
        ) : filteredUsers.length === 0 ? (
          <div className="py-40 flex flex-col items-center justify-center text-gray-400">
            <Users className="w-16 h-16 mb-4 opacity-10" />
            <p className="font-bold text-xl">No {activeTab}s found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
             <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-100">
                    <th className="px-8 py-6 text-sm font-black text-gray-400 uppercase tracking-widest">{activeTab === 'student' ? 'Student' : 'Tutor'}</th>
                    {activeTab === 'student' && (
                      <>
                        <th className="px-6 py-6 text-sm font-black text-gray-400 uppercase tracking-widest">Student ID</th>
                        <th className="px-6 py-6 text-sm font-black text-gray-400 uppercase tracking-widest">Year & Sem</th>
                      </>
                    )}
                    <th className="px-6 py-6 text-sm font-black text-gray-400 uppercase tracking-widest">Joined Date</th>
                    <th className="px-8 py-6 text-sm font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredUsers.map((user, idx) => (
                    <tr key={user._id} className="hover:bg-gray-50/30 transition-colors group">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                           <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm shadow-sm ${avatarColors[idx % avatarColors.length]}`}>
                             {getInitials(user.name)}
                           </div>
                           <div>
                             <h4 className="font-black text-gray-900 leading-none mb-1">{user.name}</h4>
                             <p className="text-xs font-medium text-gray-500 leading-none">{user.email}</p>
                           </div>
                        </div>
                      </td>

                      {activeTab === 'student' && (
                        <>
                          <td className="px-6 py-6">
                             <span className="inline-flex items-center px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-bold border border-slate-200">
                               {user.studentID || "N/A"}
                             </span>
                          </td>
                          <td className="px-6 py-6 font-bold text-gray-600 text-sm">
                            Year {user.year || "?"} • Sem {user.semester || "?"}
                          </td>
                        </>
                      )}

                      <td className="px-6 py-6">
                        <div className="flex items-center gap-2 text-sm font-bold text-gray-500">
                           <Clock className="w-4 h-4 opacity-50" />
                           {new Date(user.createdAt).toLocaleDateString(undefined, {
                             year: 'numeric',
                             month: 'short',
                             day: 'numeric'
                           })}
                        </div>
                      </td>

                      <td className="px-8 py-6 text-right text-transparent group-hover:text-gray-400 transition-all">
                        <button 
                          onClick={() => setDeleteUser(user)}
                          className="p-3 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-2xl transition-all"
                        >
                          <Trash2 className="w-6 h-6" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
             </table>
          </div>
        )}
      </div>

       {/* Delete Confirmation Modal */}
       {deleteUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 sm:p-0">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => !isDeleting && setDeleteUser(null)}></div>
          <div className="relative bg-white w-full max-w-md rounded-[3rem] shadow-2xl p-8 animate-in zoom-in duration-300 text-center">
             <div className="w-20 h-20 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertTriangle className="w-10 h-10" />
             </div>
             
             <h3 className="text-2xl font-black text-gray-900 mb-2">Delete User?</h3>
             <p className="text-gray-500 font-medium mb-4">
               Are you sure you want to delete <span className="text-gray-900 font-bold">{deleteUser.name}</span>?
             </p>
             <div className="bg-rose-50 p-4 rounded-2xl border border-rose-100 mb-8 text-rose-700 text-left text-sm font-medium">
               <p className="flex gap-2">
                 <span className="block mt-1">•</span>
                 Permanently removes the account and login access.
               </p>
               <p className="flex gap-2 mt-1">
                 <span className="block mt-1">•</span>
                 Deletes all associated marketplace listings and files.
               </p>
               <p className="flex gap-2 mt-1">
                 <span className="block mt-1">•</span>
                 This action is irreversible.
               </p>
             </div>

             <div className="flex flex-col gap-3">
                <button 
                  disabled={isDeleting}
                  onClick={handleDelete}
                  className="w-full py-4 bg-rose-600 hover:bg-rose-700 text-white rounded-[1.5rem] font-black shadow-lg shadow-rose-200 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {isDeleting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Trash2 className="w-5 h-5" />
                  )}
                  Confirm Delete Account
                </button>
                <button 
                  disabled={isDeleting}
                  onClick={() => setDeleteUser(null)}
                  className="w-full py-4 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-[1.5rem] font-bold transition-all disabled:opacity-50"
                >
                  Cancel
                </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
