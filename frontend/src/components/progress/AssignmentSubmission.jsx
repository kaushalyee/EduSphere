import React, { useState, useEffect } from 'react';
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
  ArrowRight
} from 'lucide-react';

const AssignmentSubmission = () => {
  const [assignments, setAssignments] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [requirementsFile, setRequirementsFile] = useState(null);
  const [draftFile, setDraftFile] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('assignments');
  const [preSubmissionData, setPreSubmissionData] = useState({
    subjectName: '',
    assignmentTitle: '',
    assignmentDetails: '',
    courseCode: '',
    submissionType: 'document'
  });

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const studentId = "demo_student";
      
      // Mock data for now
      const mockAssignments = [
        {
          id: 1,
          title: "Database Design Project",
          subject: "Database Systems",
          description: "Design a complete database system for an e-commerce platform",
          dueDate: "2024-04-15",
          status: "pending",
          requirements: [
            "Entity-Relationship Diagram",
            "Normalization (3NF)",
            "SQL Schema",
            "Sample Queries"
          ],
          maxMarks: 100,
          submissionType: "document"
        },
        {
          id: 2,
          title: "Algorithm Analysis",
          subject: "Programming",
          description: "Analyze time and space complexity of given algorithms",
          dueDate: "2024-04-10",
          status: "submitted",
          submittedAt: "2024-04-08",
          requirements: [
            "Big O notation analysis",
            "Space complexity calculations",
            "Optimization suggestions",
            "Code examples"
          ],
          maxMarks: 100,
          submissionType: "document",
          prediction: {
            gradeRange: "85-92%",
            confidence: 87,
            strengths: ["Clear explanations", "Good examples"],
            improvements: ["Add more test cases", "Include edge cases"]
          }
        },
        {
          id: 3,
          title: "Network Security Report",
          subject: "Networking",
          description: "Comprehensive report on network security vulnerabilities and solutions",
          dueDate: "2024-04-20",
          status: "graded",
          submittedAt: "2024-04-18",
          gradedAt: "2024-04-19",
          grade: 88,
          requirements: [
            "Vulnerability analysis",
            "Security solutions",
            "Implementation plan",
            "Risk assessment"
          ],
          maxMarks: 100,
          submissionType: "document",
          feedback: "Excellent analysis of security vulnerabilities. Implementation plan could be more detailed."
        }
      ];

      setAssignments(mockAssignments);
    } catch (err) {
      console.error('Failed to fetch assignments:', err);
      setError('Failed to load assignments');
    } finally {
      setLoading(false);
    }
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
    
    if (assignmentDetails.length < 10) {
      setError('Please provide more details about the assignment (minimum 10 characters)');
      return false;
    }
    
    setError(null);
    return true;
  };

  const handlePreSubmissionSubmit = () => {
    if (validatePreSubmission()) {
      // Store pre-submission data and show file upload section
      setActiveTab('upload');
    }
  };

  const handleRequirementsUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    // Check if file is an image
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg'];
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
    
    if (imageExtensions.includes(fileExtension)) {
      // Show alert for image files
      alert(`Images are not allowed for assignment submission.\n\nYou selected: ${file.name}\n\nPlease upload a document file instead:\n• PDF files (.pdf)\n• Word documents (.doc, .docx)\n• Text files (.txt)`);
      // Clear the file input
      event.target.value = '';
      return;
    }
    
    setRequirementsFile(file);
    setError(null);
    setPrediction(null);
  };

  const handleDraftUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    // Check if file is an image
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg'];
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
    
    if (imageExtensions.includes(fileExtension)) {
      // Show alert for image files
      alert(`Images are not allowed for assignment submission.\n\nYou selected: ${file.name}\n\nPlease upload a document file instead:\n• PDF files (.pdf)\n• Word documents (.doc, .docx)\n• Text files (.txt)`);
      // Clear the file input
      event.target.value = '';
      return;
    }
    
    setDraftFile(file);
    setError(null);
    setPrediction(null);
  };

  const handleAnalysis = async () => {
    if (!requirementsFile || !draftFile) {
      setError('Please upload both requirements and draft files');
      return;
    }

    try {
      setLoading(true);
      
      // Create form data for file upload
      const formData = new FormData();
      formData.append('requirementsFile', requirementsFile);
      formData.append('draftFile', draftFile);
      formData.append('assignmentId', selectedAssignment?.id || '1');
      formData.append('studentId', 'demo_student');
      formData.append('subjectName', preSubmissionData.subjectName);
      formData.append('assignmentTitle', preSubmissionData.assignmentTitle);
      formData.append('assignmentDetails', preSubmissionData.assignmentDetails);
      formData.append('courseCode', preSubmissionData.courseCode);
      formData.append('submissionType', preSubmissionData.submissionType);

      // Call analysis API
      const response = await api.post('/assignments/analyze-submission', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setPrediction(response.data.prediction);
      setError(null);
    } catch (err) {
      console.error('Analysis failed:', err);
      setError('Failed to analyze assignment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'text-orange-600 bg-orange-50';
      case 'submitted': return 'text-blue-600 bg-blue-50';
      case 'graded': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'submitted': return <CheckCircle className="w-4 h-4" />;
      case 'graded': return <FileCheck className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  if (loading && assignments.length === 0) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading assignments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Assignment Submission</h2>
          <p className="text-gray-600">Pre-Submission Grade Predictor - Compare requirements with your draft</p>
        </div>
        <button
          className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors shadow-sm"
        >
          <Target className="w-4 h-4" />
          Explore Assignment Submission
          <ArrowRight className="w-4 h-4" />
        </button>
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
                {preSubmissionData.assignmentDetails.length}/10 characters minimum
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

            {/* Submit Button */}
            <button
              onClick={handlePreSubmissionSubmit}
              disabled={!preSubmissionData.subjectName.trim() || !preSubmissionData.assignmentTitle.trim() || preSubmissionData.assignmentDetails.length < 10}
              className="w-full px-4 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Continue to File Upload
            </button>
          </div>
        </div>

        {/* File Upload Section */}
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Upload Assignment Files</h3>
          
          {preSubmissionData.subjectName ? (
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
                accept="*/*" // Allow all files so users can select images
                onChange={handleRequirementsUpload}
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
            
            {requirementsFile && (
              <div className="mt-3 p-3 bg-green-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="w-4 h-4 text-green-600" />
                    <div>
                      <p className="font-medium text-green-800 text-sm">{requirementsFile.name}</p>
                      <p className="text-green-600 text-xs">{(requirementsFile.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setRequirementsFile(null);
                      setPrediction(null);
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
                accept="*/*" // Allow all files so users can select images
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
                      setPrediction(null);
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
              onClick={handleAnalysis}
              disabled={!requirementsFile || !draftFile || loading || !preSubmissionData.subjectName}
              className="w-full px-4 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white inline mr-2"></div>
                  Analyzing...
                </>
              ) : (
                <>
                  <Target className="w-4 h-4 inline mr-2" />
                  Analyze & Predict Grade
                </>
              )}
            </button>

            {error && (
              <div className="mt-4 p-3 bg-red-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600" />
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              </div>
            )}
          </div>

          {/* Prediction Results */}
          {prediction && (
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Analysis Results</h3>
              
              <div className="space-y-4">
                {/* Grade Prediction */}
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold text-indigo-800">Predicted Grade Range</h4>
                    <Target className="w-5 h-5 text-indigo-600" />
                  </div>
                  <p className="text-3xl font-bold text-indigo-900">{prediction.gradeRange}</p>
                  <p className="text-indigo-600 text-sm mt-1">Based on requirement coverage analysis</p>
                </div>

                {/* Analysis Breakdown */}
                <div>
                  <h4 className="font-bold text-gray-800 mb-3">Analysis Breakdown</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-gray-600">Requirement Coverage</span>
                        <span className="text-sm font-medium text-gray-800">{prediction.requirementCoverage}%</span>
                      </div>
                      <div className="bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${prediction.requirementCoverage}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-gray-600">Section Completeness</span>
                        <span className="text-sm font-medium text-gray-800">{prediction.sectionCompleteness}%</span>
                      </div>
                      <div className="bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${prediction.sectionCompleteness}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-gray-600">Structure Quality</span>
                        <span className="text-sm font-medium text-gray-800">{prediction.structureQuality}%</span>
                      </div>
                      <div className="bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-orange-500 h-2 rounded-full"
                          style={{ width: `${prediction.structureQuality}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Key Requirements Found */}
                <div>
                  <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Key Requirements Found
                  </h4>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <p className="text-green-800 font-medium">{prediction.requirementsFound} of {prediction.totalRequirements} key requirements identified</p>
                    <p className="text-green-600 text-sm mt-1">Coverage: {prediction.requirementCoverage}%</p>
                  </div>
                </div>

                {/* Missing Sections */}
                {prediction.missingSections && prediction.missingSections.length > 0 && (
                  <div>
                    <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-orange-600" />
                      Missing or Weak Sections
                    </h4>
                    <ul className="space-y-1">
                      {prediction.missingSections.map((section, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                          <X className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                          {section}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Suggestions */}
                <div>
                  <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                    <Edit3 className="w-4 h-4 text-blue-600" />
                    Suggestions for Improvement
                  </h4>
                  <ul className="space-y-1">
                    {prediction.suggestions.map((suggestion, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                        <Info className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Analysis Details */}
                <div className="bg-gray-50 p-3 rounded-lg">
                  <h4 className="font-medium text-gray-800 mb-2">Analysis Details</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-500">Word Count:</span>
                      <span className="text-gray-800 ml-2">{prediction.wordCount}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Key Terms:</span>
                      <span className="text-gray-800 ml-2">{prediction.keyTermsFound}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Similarity Score:</span>
                      <span className="text-gray-800 ml-2">{prediction.similarityScore}%</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Structure Score:</span>
                      <span className="text-gray-800 ml-2">{prediction.structureScore}%</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-4 border-t">
                  <button className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors">
                    <Save className="w-4 h-4 inline mr-2" />
                    Submit Assignment
                  </button>
                  <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors">
                    <Edit3 className="w-4 h-4 inline mr-2" />
                    Revise Draft
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssignmentSubmission;
