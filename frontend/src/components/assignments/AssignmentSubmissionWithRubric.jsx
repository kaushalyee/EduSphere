import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/api';
import { 
  FileText, 
  Upload, 
  Download, 
  CheckCircle, 
  AlertCircle, 
  Clock,
  Target,
  TrendingUp,
  Eye,
  Edit3,
  Save,
  X,
  Plus,
  FileCheck,
  AlertTriangle,
  Info,
  File,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';

const AssignmentSubmissionWithRubric = ({ assignment = {}, onSubmissionComplete }) => {
  const navigate = useNavigate();
  
  const [rubricFile, setRubricFile] = useState(null);
  const [draftFile, setDraftFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [analysisStatus, setAnalysisStatus] = useState('idle');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [formValidated, setFormValidated] = useState(false);
  const [preSubmissionData, setPreSubmissionData] = useState({
    subjectName: assignment.subject || '',
    assignmentTitle: assignment.title || '',
    assignmentDetails: assignment.description || '',
    courseCode: '',
    submissionType: 'document'
  });

  const handleBackToProgress = () => {
    navigate('/student/dashboard', { state: { activeTab: 'Progress' } });
  };

  const showToastMessage = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  const handlePreSubmissionChange = (field, value) => {
    setPreSubmissionData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validatePreSubmission = () => {
    const { subjectName, assignmentTitle, assignmentDetails } = preSubmissionData;
    
    if (!subjectName.trim()) {
      setError('Please enter subject name');
      return false;
    }
    
    if (!assignmentTitle.trim()) {
      setError('Please enter assignment title');
      return false;
    }
    
    if (assignmentDetails.length < 20) {
      setError('Please provide more details about the assignment (minimum 20 characters)');
      return false;
    }
    
    setError(null);
    setFormValidated(true);
    showToastMessage('Form validated! You can now upload your files.');
    return true;
  };

  const handleRubricUpload = (event) => {
    console.log('Rubric upload triggered');
    const file = event.target.files[0];
    console.log('File selected:', file);
    
    if (!file) {
      console.log('No file selected');
      return;
    }
    
    console.log('File details:', {
      name: file.name,
      size: file.size,
      type: file.type
    });
    
    // Check if file is an image
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg'];
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
    
    if (imageExtensions.includes(fileExtension)) {
      alert(`Images are not allowed for assignment submission.\n\nYou selected: ${file.name}\n\nPlease upload a document file instead:\n· PDF files (.pdf)\n· Word documents (.doc, .docx)\n· Text files (.txt)`);
      event.target.value = '';
      return;
    }
    
    console.log('Setting rubric file:', file.name);
    setRubricFile(file);
    setError(null);
    setAnalysisResult(null);
  };

  const handleDraftUpload = (event) => {
    console.log('Draft upload triggered');
    const file = event.target.files[0];
    console.log('File selected:', file);
    
    if (!file) {
      console.log('No file selected');
      return;
    }
    
    console.log('File details:', {
      name: file.name,
      size: file.size,
      type: file.type
    });
    
    // Check if file is an image
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg'];
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
    
    if (imageExtensions.includes(fileExtension)) {
      alert(`Images are not allowed for assignment submission.\n\nYou selected: ${file.name}\n\nPlease upload a document file instead:\n· PDF files (.pdf)\n· Word documents (.doc, .docx)\n· Text files (.txt)`);
      event.target.value = '';
      return;
    }
    
    console.log('Setting draft file:', file.name);
    setDraftFile(file);
    setError(null);
    setAnalysisResult(null);
  };

  // Main form submission handler
  const handleSubmit = async (e) => {
    // Prevent default form submission behavior
    e.preventDefault();
    
    // Validate that both files are uploaded
    if (!rubricFile || !draftFile) {
      alert('Please upload both rubric and draft files');
      return;
    }

    // Start upload process
    setUploading(true);
    setAnalysisStatus('uploading');
    setUploadProgress(0);

    try {
      // Create FormData for multipart file upload
      const formData = new FormData();
      // Append rubric file to form data
      formData.append('rubricFile', rubricFile);
      // Append draft file to form data
      formData.append('draftFile', draftFile);
      // Append assignment ID from props (use default if not provided)
      formData.append('requirementId', assignment._id || 'default-assignment-id');
      // Append student ID from local storage (use demo ID if not available)
      const studentId = localStorage.getItem('userId') || 'demo-student-id';
      formData.append('studentId', studentId);

      // Log form data for debugging
      console.log('Submitting with data:', {
        requirementId: assignment._id || 'default-assignment-id',
        studentId: studentId,
        rubricFileName: rubricFile.name,
        rubricFileSize: rubricFile.size,
        draftFileName: draftFile.name,
        draftFileSize: draftFile.size
      });

      // Make API call to submit assignment with progress tracking
      const response = await api.post('/assignments/submit-with-rubric', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',  // Set content type for file upload
        },
        // Progress tracking callback for upload progress
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            // Calculate percentage of upload completed
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            // Update progress state
            setUploadProgress(percentCompleted);
            console.log(`Upload progress: ${percentCompleted}%`);
          }
        },
      });

      console.log('Server response:', response.data);

      // Show success toast message
      showToastMessage('Assignment Submitted Successfully!');

      // Update status to analyzing phase
      setAnalysisStatus('analyzing');
      
      // Start polling for analysis completion
      const pollInterval = setInterval(async () => {
        try {
          console.log('Polling for analysis status...');
          // Request analysis status from server
          const analysisResponse = await api.get(`/assignments/${response.data.submission._id}/analysis`);
          
          console.log('Analysis status:', analysisResponse.data.submission.status);
          
          // Check if analysis is complete
          if (analysisResponse.data.submission.status === 'graded') {
            // Stop polling when analysis is done
            clearInterval(pollInterval);
            // Update status to completed
            setAnalysisStatus('completed');
            // Store analysis results in state
            setAnalysisResult(analysisResponse.data.analysis);
            // Stop upload progress indicator
            setUploading(false);
            // Call completion callback if provided
            onSubmissionComplete && onSubmissionComplete(analysisResponse.data);
          } else if (analysisResponse.data.submission.status === 'submitted' && 
                     analysisResponse.data.submission.tutorFeedback) {
            // Handle analysis failure
            clearInterval(pollInterval);
            setAnalysisStatus('error');
            setUploading(false);
            alert('Analysis failed: ' + analysisResponse.data.submission.tutorFeedback);
          } else if (analysisResponse.data.submission.status === 'submitted') {
            // Handle case where analysis is taking too long
            console.log('Analysis still in progress, continuing to poll...');
          }
        } catch (error) {
          // Log polling errors
          console.error('Polling error:', error);
        }
      }, 3000);  // Poll every 3 seconds

    } catch (error) {
      // Handle submission errors with detailed logging
      console.error('Submission error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        headers: error.response?.headers
      });
      
      // Update status to error
      setAnalysisStatus('error');
      // Stop upload progress indicator
      setUploading(false);
      
      // Show detailed error message to user
      const errorMessage = error.response?.data?.message || error.message || 'Unknown error occurred';
      const errorDetails = error.response?.data?.details || '';
      
      alert(`Submission failed: ${errorMessage}${errorDetails ? '\nDetails: ' + errorDetails : ''}`);
    }
  };

  // Function to get appropriate status icon based on current status
  const getStatusIcon = () => {
    switch (analysisStatus) {
      case 'uploading':
        // Show upload icon with animation for uploading status
        return <Upload className="w-5 h-5 text-blue-600 animate-pulse" />;
      case 'analyzing':
        // Show clock icon with spinning animation for analyzing status
        return <Clock className="w-5 h-5 text-yellow-600 animate-spin" />;
      case 'completed':
        // Show checkmark icon for completed status
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'error':
        // Show alert icon for error status
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      default:
        // No icon for idle status
        return null;
    }
  };

  // Function to get appropriate status message based on current status
  const getStatusMessage = () => {
    switch (analysisStatus) {
      case 'uploading':
        // Show upload progress message
        return `Uploading files... ${uploadProgress}%`;
      case 'analyzing':
        // Show analysis in progress message
        return 'Analyzing your assignment against rubric criteria...';
      case 'completed':
        // Show completion message
        return 'Analysis completed successfully!';
      case 'error':
        // Show error message
        return 'Something went wrong. Please try again.';
      default:
        // Empty message for idle status
        return '';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Assignment Submission</h2>
        <p className="text-gray-600">Pre-Submission Grade Predictor - Compare requirements with your draft</p>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={handleBackToProgress}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 transition-colors"
          title="Back to Progress Tracking"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Back to Progress</span>
        </button>
        <div className="text-sm text-gray-500">
          Submit Assignment: {assignment.title || 'Assignment'}
        </div>
      </div>

      {/* Direct Upload Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pre-Submission Form */}
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Assignment Details</h3>
          <p className="text-gray-600 text-sm mb-6">Please provide assignment details before uploading files for analysis</p>
          
          <div className="space-y-4">
            {/* Subject Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject Name *
              </label>
              <input
                type="text"
                value={preSubmissionData.subjectName}
                onChange={(e) => handlePreSubmissionChange('subjectName', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="e.g., Database Systems, Programming, Networking"
              />
            </div>

            {/* Assignment Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assignment Title *
              </label>
              <input
                type="text"
                value={preSubmissionData.assignmentTitle}
                onChange={(e) => handlePreSubmissionChange('assignmentTitle', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="e.g., Database Design Project, Algorithm Analysis"
              />
            </div>

            {/* Assignment Details */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assignment Details *
              </label>
              <textarea
                value={preSubmissionData.assignmentDetails}
                onChange={(e) => handlePreSubmissionChange('assignmentDetails', e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Describe assignment requirements, objectives, and what needs to be done..."
              />
              <p className="text-gray-500 text-xs mt-1">
                {preSubmissionData.assignmentDetails.length}/20 characters minimum
              </p>
            </div>

            {/* Course Code */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Course Code (Optional)
              </label>
              <input
                type="text"
                value={preSubmissionData.courseCode}
                onChange={(e) => handlePreSubmissionChange('courseCode', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="e.g., CS301, IT202, DB400"
              />
            </div>

            {/* Submission Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Submission Type
              </label>
              <select
                value={preSubmissionData.submissionType}
                onChange={(e) => handlePreSubmissionChange('submissionType', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="document">Document</option>
                <option value="code">Code/Programming</option>
                <option value="design">Design Project</option>
                <option value="research">Research Paper</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Error Display */}
            {error && (
              <div className="p-3 bg-red-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600" />
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              </div>
            )}

            {/* Continue to Upload Button */}
            <button
              onClick={validatePreSubmission}
              className="w-full px-4 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
            >
              Continue to Upload
            </button>
          </div>
        </div>

        {/* File Upload Section */}
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Upload Assignment Files</h3>
          
          {formValidated ? (
            <div className="bg-blue-50 p-4 rounded-lg mb-4">
              <p className="font-medium text-blue-800">{preSubmissionData.subjectName}</p>
              <p className="text-blue-600 text-sm">{preSubmissionData.assignmentTitle}</p>
              <p className="text-blue-500 text-xs mt-1">Type: {preSubmissionData.submissionType}</p>
            </div>
          ) : (
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <p className="text-gray-600 text-center">Please fill assignment details first</p>
            </div>
          )}

          {/* Requirements File Upload */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <File className="w-4 h-4 inline mr-2" />
              Assignment Requirements (Rubric/Instructions)
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-400 transition-colors">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 text-sm mb-2">Drop requirements file here or click to browse</p>
              <p className="text-gray-500 text-xs mb-3">Supports PDF, DOC, DOCX, TXT (Images will show alert)</p>
              <input
                type="file"
                accept=".pdf,.doc,.docx,.txt"
                onChange={handleRubricUpload}
                className="hidden"
                id="requirements-upload"
              />
              <label
                htmlFor="requirements-upload"
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors cursor-pointer text-sm"
              >
                Choose Requirements File
              </label>
            </div>
            
            {rubricFile && (
              <div className="mt-3 p-3 bg-green-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="w-4 h-4 text-green-600" />
                    <div>
                      <p className="font-medium text-green-800 text-sm">{rubricFile.name}</p>
                      <p className="text-green-600 text-xs">{(rubricFile.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setRubricFile(null);
                      setAnalysisResult(null);
                    }}
                    className="text-red-600 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Draft File Upload */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Edit3 className="w-4 h-4 inline mr-2" />
              Draft Assignment Document
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-400 transition-colors">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 text-sm mb-2">Drop draft file here or click to browse</p>
              <p className="text-gray-500 text-xs mb-3">Supports PDF, DOC, DOCX, TXT (Images will show alert)</p>
              <input
                type="file"
                accept=".pdf,.doc,.docx,.txt"
                onChange={handleDraftUpload}
                className="hidden"
                id="draft-upload"
              />
              <label
                htmlFor="draft-upload"
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors cursor-pointer text-sm"
              >
                Choose Draft File
              </label>
            </div>
            
            {draftFile && (
              <div className="mt-3 p-3 bg-green-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="w-4 h-4 text-green-600" />
                    <div>
                      <p className="font-medium text-green-800 text-sm">{draftFile.name}</p>
                      <p className="text-green-600 text-xs">{(draftFile.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setDraftFile(null);
                      setAnalysisResult(null);
                    }}
                    className="text-red-600 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Analysis Button */}
            <button
              onClick={handleSubmit}
              disabled={!rubricFile || !draftFile || uploading || !formValidated}
              className="w-full px-4 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {uploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white inline mr-2"></div>
                  Processing...
                </>
              ) : (
                <>
                  <Target className="w-4 h-4 inline mr-2" />
                  Submit for Analysis
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Analysis Results */}
      {analysisResult && (
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Analysis Results</h3>
          
          <div className="space-y-4">
            {/* Grade Prediction */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold text-indigo-800">Predicted Grade Range</h4>
                <Target className="w-5 h-5 text-indigo-600" />
              </div>
              <p className="text-3xl font-bold text-indigo-900">{analysisResult.predictedGrade.grade}</p>
              <p className="text-indigo-600 text-sm mt-1">Confidence: {analysisResult.predictedGrade.confidence}%</p>
            </div>

            {/* Analysis Breakdown */}
            <div>
              <h4 className="font-bold text-gray-800 mb-3">Analysis Breakdown</h4>
              <div className="space-y-4">
                {analysisResult.gradingBreakdown.map((item, index) => (
                  <div key={index}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-600">{item.criteria}</span>
                      <span className="text-sm font-medium text-gray-800">{Math.round((item.predictedMarks / item.maxMarks) * 100)}%</span>
                    </div>
                    <div className="bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${Math.round((item.predictedMarks / item.maxMarks) * 100)}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{item.predictedMarks}/{item.maxMarks} marks</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Requirements Found */}
            <div>
              <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                Overall Performance
              </h4>
              <div className="bg-green-50 p-3 rounded-lg">
                <p className="text-green-800 font-medium">Predicted Grade: {analysisResult.predictedGrade.grade}</p>
                <p className="text-green-600 text-sm">Overall Score: {analysisResult.predictedGrade.percentage}%</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-4 border-t">
              <button 
                onClick={() => {
                  // Reset files and analysis to allow revision
                  setRubricFile(null);
                  setDraftFile(null);
                  setAnalysisResult(null);
                  setAnalysisStatus('idle');
                  setError(null);
                  setFormValidated(false);
                  showToastMessage('Ready to revise your assignment. Please fill the form again.');
                }}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                <Edit3 className="w-4 h-4 inline mr-2" />
                Revise Draft
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Status display section */}
      {analysisStatus !== 'idle' && !analysisResult && (
        <div className="mt-8 p-6 bg-gray-50 rounded-xl">
          <div className="flex items-center justify-center mb-4">
            {getStatusIcon()}
            <span className="ml-3 text-lg font-medium text-gray-700">
              {getStatusMessage()}
            </span>
          </div>
          
          {/* Upload progress bar */}
          {analysisStatus === 'uploading' && (
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          )}
        </div>
      )}

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 z-50 animate-pulse">
          <CheckCircle className="w-5 h-5" />
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

export default AssignmentSubmissionWithRubric;
