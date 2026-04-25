import React, { useState, useEffect } from 'react';
import api from '../../../api/api';
import {
  CheckCircle,
  XCircle,
  RefreshCw,
  FileText,
  Image,
  Loader2,
  ShieldCheck,
} from 'lucide-react';

const BASE_URL = 'http://localhost:5000';

const REJECTION_REASONS = [
  'Student ID image is unclear',
  'Supporting document is older than 6 months',
  'Invalid document type submitted',
  'Details do not match registration data',
  'Other',
];

const STATUS_BADGE = {
  pending: { label: 'Pending', classes: 'bg-yellow-100 text-yellow-800' },
  approved: { label: 'Approved', classes: 'bg-emerald-100 text-emerald-800' },
  rejected: { label: 'Rejected', classes: 'bg-rose-100 text-rose-800' },
  resubmission_required: { label: 'Resubmission Required', classes: 'bg-orange-100 text-orange-800' },
};

const DOC_TYPE_LABELS = {
  exam_timetable: 'Exam Timetable',
  enrollment_letter: 'Enrollment Letter',
  course_registration: 'Course Registration',
};

export default function StudentVerification() {
  const [tab, setTab] = useState('pending');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [rejectModal, setRejectModal] = useState({ open: false, studentId: null, studentName: '' });
  const [selectedReason, setSelectedReason] = useState('');
  const [customReason, setCustomReason] = useState('');
  const [rejectLoading, setRejectLoading] = useState(false);

  const [resubmitModal, setResubmitModal] = useState({ open: false, studentId: null, studentName: '' });
  const [resubmitNote, setResubmitNote] = useState('');
  const [resubmitLoading, setResubmitLoading] = useState(false);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const endpoint = tab === 'pending' ? '/admin/verifications/pending' : '/admin/verifications/all';
      const res = await api.get(endpoint);
      if (res.data.success) setStudents(res.data.data);
    } catch (err) {
      console.error('Failed to fetch verifications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [tab]);

  const handleApprove = async (id) => {
    await api.put(`/admin/verifications/${id}/approve`);
    fetchStudents();
  };

  const handleReject = async () => {
    const reason = selectedReason === 'Other' ? customReason.trim() : selectedReason;
    if (!reason) return;
    try {
      setRejectLoading(true);
      await api.put(`/admin/verifications/${rejectModal.studentId}/reject`, { rejectionReason: reason });
      setRejectModal({ open: false, studentId: null, studentName: '' });
      setSelectedReason('');
      setCustomReason('');
      fetchStudents();
    } catch (err) {
      console.error('Reject failed:', err);
    } finally {
      setRejectLoading(false);
    }
  };

  const handleResubmit = async () => {
    if (!resubmitNote.trim()) return;
    try {
      setResubmitLoading(true);
      await api.put(`/admin/verifications/${resubmitModal.studentId}/resubmit`, { resubmissionNote: resubmitNote });
      setResubmitModal({ open: false, studentId: null, studentName: '' });
      setResubmitNote('');
      fetchStudents();
    } catch (err) {
      console.error('Resubmit request failed:', err);
    } finally {
      setResubmitLoading(false);
    }
  };

  const openDocument = (filePath) => {
    if (filePath) window.open(`${BASE_URL}/${filePath}`, '_blank');
  };

  const rejectReasonValid =
    selectedReason && (selectedReason !== 'Other' || customReason.trim().length > 0);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Tabs */}
      <div className="flex gap-2 bg-white p-1.5 rounded-2xl border border-gray-100 shadow-sm w-fit">
        {['pending', 'all'].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 ${
              tab === t
                ? 'bg-primary-600 text-white shadow-md'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {t === 'pending' ? 'Pending' : 'All Students'}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
        </div>
      ) : students.length === 0 ? (
        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm py-20 flex flex-col items-center text-center">
          <ShieldCheck className="w-12 h-12 text-gray-200 mb-4" />
          <h4 className="text-lg font-black text-gray-900">No pending verifications</h4>
          <p className="text-gray-500 text-sm mt-1">All student accounts have been reviewed.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {students.map((student) => (
            <StudentCard
              key={student._id}
              student={student}
              onApprove={handleApprove}
              onOpenReject={(id, name) => {
                setRejectModal({ open: true, studentId: id, studentName: name });
                setSelectedReason('');
                setCustomReason('');
              }}
              onOpenResubmit={(id, name) => {
                setResubmitModal({ open: true, studentId: id, studentName: name });
                setResubmitNote('');
              }}
              openDocument={openDocument}
            />
          ))}
        </div>
      )}

      {/* ── Rejection Modal ───────────────────────────────────── */}
      {rejectModal.open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[2rem] p-8 w-full max-w-md shadow-2xl">
            <h3 className="text-xl font-black text-gray-900 mb-1">Reject Student Verification</h3>
            <p className="text-sm text-gray-500 mb-6">{rejectModal.studentName}</p>

            <label className="block text-sm font-bold text-gray-700 mb-2">Select a reason</label>
            <select
              value={selectedReason}
              onChange={(e) => setSelectedReason(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 mb-4"
            >
              <option value="">— choose a reason —</option>
              {REJECTION_REASONS.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>

            {selectedReason === 'Other' && (
              <textarea
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                placeholder="Describe the reason..."
                rows={3}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none mb-4"
              />
            )}

            <div className="flex gap-3 mt-2">
              <button
                onClick={() => setRejectModal({ open: false, studentId: null, studentName: '' })}
                className="flex-1 px-4 py-3 rounded-xl font-bold text-gray-600 border border-gray-200 hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={rejectLoading || !rejectReasonValid}
                className="flex-1 px-4 py-3 rounded-xl font-bold text-white bg-rose-500 hover:bg-rose-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {rejectLoading ? 'Rejecting...' : 'Confirm Reject'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Resubmission Modal ────────────────────────────────── */}
      {resubmitModal.open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[2rem] p-8 w-full max-w-md shadow-2xl">
            <h3 className="text-xl font-black text-gray-900 mb-1">Request Document Resubmission</h3>
            <p className="text-sm text-gray-500 mb-6">{resubmitModal.studentName}</p>

            <label className="block text-sm font-bold text-gray-700 mb-2">Admin note for student</label>
            <textarea
              value={resubmitNote}
              onChange={(e) => setResubmitNote(e.target.value)}
              placeholder="Explain what needs to be corrected..."
              rows={4}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none mb-4"
            />

            <div className="flex gap-3 mt-2">
              <button
                onClick={() => setResubmitModal({ open: false, studentId: null, studentName: '' })}
                className="flex-1 px-4 py-3 rounded-xl font-bold text-gray-600 border border-gray-200 hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleResubmit}
                disabled={resubmitLoading || !resubmitNote.trim()}
                className="flex-1 px-4 py-3 rounded-xl font-bold text-white bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {resubmitLoading ? 'Sending...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StudentCard({ student, onApprove, onOpenReject, onOpenResubmit, openDocument }) {
  const [approving, setApproving] = useState(false);

  const badge = STATUS_BADGE[student.verificationStatus] || STATUS_BADGE.pending;
  const actionable =
    student.verificationStatus === 'pending' ||
    student.verificationStatus === 'resubmission_required';

  const handleApprove = async () => {
    setApproving(true);
    await onApprove(student._id);
    setApproving(false);
  };

  return (
    <div className="bg-white rounded-[1.5rem] border border-gray-100 shadow-sm p-6">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
        {/* Info */}
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <h4 className="text-lg font-black text-gray-900">{student.name}</h4>
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${badge.classes}`}>
              {badge.label}
            </span>
            {student.documentType && (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700">
                {DOC_TYPE_LABELS[student.documentType] || student.documentType}
              </span>
            )}
          </div>

          <p className="text-gray-500 text-sm mb-3">{student.email}</p>

          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            <span>
              <span className="font-bold text-gray-700">Student ID:</span>{' '}
              {student.studentID || '—'}
            </span>
            <span>
              <span className="font-bold text-gray-700">Year:</span> {student.year ?? '—'}
            </span>
            <span>
              <span className="font-bold text-gray-700">Semester:</span>{' '}
              {student.semester ?? '—'}
            </span>
            <span>
              <span className="font-bold text-gray-700">Registered:</span>{' '}
              {new Date(student.createdAt).toLocaleDateString()}
            </span>
          </div>

          {/* Document buttons */}
          <div className="flex flex-wrap gap-2 mt-4">
            {student.studentIdPhoto ? (
              <button
                onClick={() => openDocument(student.studentIdPhoto)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold bg-blue-50 text-blue-700 hover:bg-blue-100 transition-all"
              >
                <Image className="w-4 h-4" />
                View Student ID
              </button>
            ) : (
              <span className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold bg-gray-50 text-gray-400">
                <Image className="w-4 h-4" />
                No Student ID
              </span>
            )}

            {student.supportingDocument ? (
              <button
                onClick={() => openDocument(student.supportingDocument)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-all"
              >
                <FileText className="w-4 h-4" />
                View Supporting Doc
              </button>
            ) : (
              <span className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold bg-gray-50 text-gray-400">
                <FileText className="w-4 h-4" />
                No Supporting Doc
              </span>
            )}
          </div>
        </div>

        {/* Action buttons */}
        {actionable && (
          <div className="flex flex-col gap-2 min-w-[190px]">
            <button
              onClick={handleApprove}
              disabled={approving}
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-white bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 transition-all"
            >
              <CheckCircle className="w-4 h-4" />
              {approving ? 'Approving...' : 'Approve'}
            </button>
            <button
              onClick={() => onOpenReject(student._id, student.name)}
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-white bg-rose-500 hover:bg-rose-600 transition-all"
            >
              <XCircle className="w-4 h-4" />
              Reject
            </button>
            <button
              onClick={() => onOpenResubmit(student._id, student.name)}
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-white bg-orange-500 hover:bg-orange-600 transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              Request Resubmission
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
