const mongoose = require('mongoose');
const AssignmentRequirement = require('../models/AssignmentRequirement');
const AssignmentSubmission = require('../models/AssignmentSubmission');
const PredictionResult = require('../models/PredictionResult');

/**
 * GET /api/assignments/student/:studentId
 * Returns all assignments for a student
 */
exports.getStudentAssignments = async (req, res) => {
  try {
    const { studentId } = req.params;

    // Mock data for now - in real implementation, fetch from database
    const mockAssignments = [
      {
        _id: '1',
        title: "Database Design Project",
        subject: "Database Systems",
        description: "Design a complete database system for an e-commerce platform",
        dueDate: new Date("2024-04-15"),
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
        _id: '2',
        title: "Algorithm Analysis",
        subject: "Programming",
        description: "Analyze time and space complexity of given algorithms",
        dueDate: new Date("2024-04-10"),
        status: "submitted",
        submittedAt: new Date("2024-04-08"),
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
        _id: '3',
        title: "Network Security Report",
        subject: "Networking",
        description: "Comprehensive report on network security vulnerabilities and solutions",
        dueDate: new Date("2024-04-20"),
        status: "graded",
        submittedAt: new Date("2024-04-18"),
        gradedAt: new Date("2024-04-19"),
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

    return res.status(200).json({
      success: true,
      assignments: mockAssignments,
      total: mockAssignments.length
    });
  } catch (error) {
    console.error("Error fetching assignments:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching assignments.",
      error: error.message,
    });
  }
};

const fs = require('fs');
const path = require('path');

/**
 * POST /api/assignments/analyze-submission
 * Analyzes assignment by comparing requirements with draft using text analysis
 */
exports.analyzeSubmission = async (req, res) => {
  try {
    const { requirementsFile, draftFile, assignmentId, studentId } = req.body;

    if (!requirementsFile || !draftFile) {
      return res.status(400).json({
        success: false,
        message: "Both requirements and draft files are required"
      });
    }

    // Read uploaded files
    const requirementsText = await extractTextFromFile(req.files.requirementsFile);
    const draftText = await extractTextFromFile(req.files.draftFile);

    // Perform text analysis
    const analysis = performTextAnalysis(requirementsText, draftText);

    // Generate prediction based on analysis
    const prediction = generatePrediction(analysis);

    return res.status(200).json({
      success: true,
      prediction,
      analysis
    });
  } catch (error) {
    console.error("Error analyzing submission:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while analyzing submission.",
      error: error.message,
    });
  }
};

/**
 * Extract text from uploaded file
 */
async function extractTextFromFile(file) {
  const filePath = file.tempFilePath;
  const fileExtension = path.extname(file.name).toLowerCase();
  
  try {
    let text = '';
    
    if (fileExtension === '.txt') {
      // Read text file directly
      text = fs.readFileSync(filePath, 'utf8');
    } else if (fileExtension === '.pdf' || fileExtension === '.doc' || fileExtension === '.docx') {
      // For demo purposes, we'll simulate text extraction
      // In a real implementation, you would use libraries like:
      // - pdf-parse for PDF files
      // - mammoth for DOCX files
      // - antiword for DOC files
      
      // Mock extracted text based on file type
      if (file.name.toLowerCase().includes('requirement') || file.name.toLowerCase().includes('rubric')) {
        text = generateMockRequirementsText();
      } else {
        text = generateMockDraftText();
      }
    }
    
    return text;
  } catch (error) {
    console.error('Error extracting text:', error);
    throw new Error('Failed to extract text from file');
  }
}

/**
 * Generate mock requirements text for demonstration
 */
function generateMockRequirementsText() {
  return `
ASSIGNMENT REQUIREMENTS

Database Design Project

Objective: Design a complete database system for an e-commerce platform

Requirements:
1. Entity-Relationship Diagram showing all entities and relationships
2. Database normalization to Third Normal Form (3NF)
3. Complete SQL schema with table definitions
4. Sample SQL queries for CRUD operations
5. Documentation of design decisions

Grading Criteria:
- ER Diagram: 25%
- Normalization: 25%
- SQL Schema: 20%
- Sample Queries: 20%
- Documentation: 10%

Submission Guidelines:
- Submit as a single PDF document
- Include all diagrams and code
- Maximum 15 pages
- Due date: April 15, 2024
  `.trim();
}

/**
 * Generate mock draft text for demonstration
 */
function generateMockDraftText() {
  return `
DATABASE DESIGN PROJECT

Introduction
This document presents the database design for an e-commerce platform called "ShopHub". 
The platform will handle user management, product catalog, order processing, and payments.

Entity-Relationship Diagram
The ER diagram includes the following entities:
- Users (customers and administrators)
- Products
- Categories
- Orders
- OrderItems
- Payments
- Reviews

Relationships:
- Users can place many Orders (1:N)
- Orders contain many OrderItems (1:N)
- OrderItems belong to Products (N:1)
- Products belong to Categories (N:1)
- Users can write many Reviews (1:N)
- Reviews belong to Products (N:1)

Database Normalization
The database is normalized to 3NF:

First Normal Form (1NF):
- All tables have primary keys
- No repeating groups
- All attributes are atomic

Second Normal Form (2NF):
- No partial dependencies
- All non-key attributes depend on the entire primary key

Third Normal Form (3NF):
- No transitive dependencies
- All non-key attributes depend only on the primary key

SQL Schema

CREATE TABLE Users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE Categories (
    category_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    parent_category_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_category_id) REFERENCES Categories(category_id)
);

CREATE TABLE Products (
    product_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    stock_quantity INT NOT NULL DEFAULT 0,
    category_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES Categories(category_id)
);

CREATE TABLE Orders (
    order_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
    total_amount DECIMAL(10,2) NOT NULL,
    shipping_address TEXT,
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

Sample Queries

-- Get all products with category information
SELECT p.product_id, p.name, p.price, c.name as category_name
FROM Products p
JOIN Categories c ON p.category_id = c.category_id
WHERE p.stock_quantity > 0
ORDER BY p.name;

-- Get user's order history
SELECT o.order_id, o.order_date, o.status, o.total_amount,
       COUNT(oi.order_item_id) as item_count
FROM Orders o
LEFT JOIN OrderItems oi ON o.order_id = oi.order_id
WHERE o.user_id = ?
GROUP BY o.order_id
ORDER BY o.order_date DESC;

-- Update product stock
UPDATE Products 
SET stock_quantity = stock_quantity - ? 
WHERE product_id = ? AND stock_quantity >= ?;

Design Decisions
1. Used surrogate keys (auto-increment) for better performance
2. Implemented proper foreign key constraints for data integrity
3. Added timestamps for audit trails
4. Used appropriate data types for each column
5. Created indexes on frequently queried columns

Conclusion
The database design meets all requirements for the e-commerce platform.
The schema is normalized to 3NF and includes all necessary entities and relationships.
  `.trim();
}

/**
 * Perform text analysis comparing requirements with draft
 */
function performTextAnalysis(requirementsText, draftText) {
  // Clean and normalize text
  const cleanRequirements = normalizeText(requirementsText);
  const cleanDraft = normalizeText(draftText);
  
  // Extract key terms from requirements
  const requirementTerms = extractKeyTerms(cleanRequirements);
  
  // Calculate coverage
  const coverage = calculateCoverage(requirementTerms, cleanDraft);
  
  // Analyze section completeness
  const sections = analyzeSections(cleanDraft);
  
  // Analyze structure quality
  const structure = analyzeStructure(cleanDraft);
  
  // Calculate similarity score
  const similarity = calculateSimilarity(cleanRequirements, cleanDraft);
  
  return {
    requirementTerms,
    coverage,
    sections,
    structure,
    similarity,
    wordCount: cleanDraft.split(/\s+/).length,
    keyTermsFound: coverage.termsFound,
    totalRequirements: requirementTerms.length
  };
}

/**
 * Normalize text by removing common words and symbols
 */
function normalizeText(text) {
  // Convert to lowercase
  text = text.toLowerCase();
  
  // Remove special characters and extra whitespace
  text = text.replace(/[^\w\s]/g, ' ');
  text = text.replace(/\s+/g, ' ').trim();
  
  // Remove common stop words
  const stopWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can', 'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them'];
  
  const words = text.split(' ').filter(word => word.length > 2 && !stopWords.includes(word));
  
  return words.join(' ');
}

/**
 * Extract key terms from requirements
 */
function extractKeyTerms(requirementsText) {
  // Common academic and technical terms to look for
  const technicalTerms = [
    'database', 'schema', 'sql', 'query', 'table', 'entity', 'relationship',
    'normalization', 'er', 'diagram', 'design', 'crud', 'primary', 'key',
    'foreign', 'constraint', 'index', 'join', 'select', 'insert', 'update',
    'delete', 'transaction', 'backup', 'security', 'performance', 'optimization',
    'architecture', 'model', 'requirement', 'specification', 'documentation',
    'implementation', 'testing', 'deployment', 'maintenance', 'scalability',
    'reliability', 'availability', 'consistency', 'integrity', 'concurrency'
  ];
  
  const words = requirementsText.split(' ');
  const foundTerms = [];
  
  technicalTerms.forEach(term => {
    if (requirementsText.includes(term)) {
      foundTerms.push(term);
    }
  });
  
  // Also extract multi-word terms
  const multiWordTerms = [
    'entity relationship', 'primary key', 'foreign key', 'normal form',
    'crud operations', 'sql schema', 'database design', 'sample queries'
  ];
  
  multiWordTerms.forEach(term => {
    if (requirementsText.includes(term)) {
      foundTerms.push(term);
    }
  });
  
  return [...new Set(foundTerms)]; // Remove duplicates
}

/**
 * Calculate how many requirement terms are covered in the draft
 */
function calculateCoverage(requirementTerms, draftText) {
  let termsFound = 0;
  const foundTerms = [];
  
  requirementTerms.forEach(term => {
    if (draftText.includes(term)) {
      termsFound++;
      foundTerms.push(term);
    }
  });
  
  const coveragePercentage = requirementTerms.length > 0 ? 
    (termsFound / requirementTerms.length) * 100 : 0;
  
  return {
    termsFound,
    totalTerms: requirementTerms.length,
    coveragePercentage,
    foundTerms
  };
}

/**
 * Analyze section completeness
 */
function analyzeSections(draftText) {
  const expectedSections = [
    'introduction', 'objective', 'requirement', 'design', 'implementation',
    'schema', 'query', 'conclusion', 'documentation', 'analysis'
  ];
  
  const foundSections = [];
  
  expectedSections.forEach(section => {
    if (draftText.includes(section)) {
      foundSections.push(section);
    }
  });
  
  const completeness = (foundSections.length / expectedSections.length) * 100;
  
  // Identify missing sections
  const missingSections = expectedSections.filter(section => !foundSections.includes(section));
  
  return {
    foundSections,
    missingSections,
    completeness,
    totalExpected: expectedSections.length
  };
}

/**
 * Analyze document structure quality
 */
function analyzeStructure(draftText) {
  const sentences = draftText.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const words = draftText.split(/\s+/);
  const paragraphs = draftText.split(/\n\n+/).filter(p => p.trim().length > 0);
  
  // Calculate average sentence length
  const avgSentenceLength = words.length / sentences.length;
  
  // Calculate average paragraph length
  const avgParagraphLength = words.length / paragraphs.length;
  
  // Structure score based on various factors
  let structureScore = 0;
  
  // Word count (ideal: 500-2000 words)
  if (words.length >= 500 && words.length <= 2000) {
    structureScore += 25;
  } else if (words.length >= 300 && words.length <= 3000) {
    structureScore += 15;
  } else {
    structureScore += 5;
  }
  
  // Sentence length (ideal: 15-25 words)
  if (avgSentenceLength >= 15 && avgSentenceLength <= 25) {
    structureScore += 25;
  } else if (avgSentenceLength >= 10 && avgSentenceLength <= 30) {
    structureScore += 15;
  } else {
    structureScore += 5;
  }
  
  // Paragraph structure (ideal: 3-7 paragraphs)
  if (paragraphs.length >= 3 && paragraphs.length <= 7) {
    structureScore += 25;
  } else if (paragraphs.length >= 2 && paragraphs.length <= 10) {
    structureScore += 15;
  } else {
    structureScore += 5;
  }
  
  // Technical content presence
  const technicalIndicators = ['create table', 'select', 'insert', 'update', 'delete', 'join', 'schema', 'entity'];
  const technicalContent = technicalIndicators.filter(indicator => draftText.includes(indicator)).length;
  structureScore += (technicalContent / technicalIndicators.length) * 25;
  
  return {
    structureScore: Math.round(structureScore),
    wordCount: words.length,
    sentenceCount: sentences.length,
    paragraphCount: paragraphs.length,
    avgSentenceLength: Math.round(avgSentenceLength),
    avgParagraphLength: Math.round(avgParagraphLength),
    technicalContent: technicalContent
  };
}

/**
 * Calculate similarity score between requirements and draft
 */
function calculateSimilarity(requirementsText, draftText) {
  const reqWords = requirementsText.split(' ');
  const draftWords = draftText.split(' ');
  
  // Create word frequency maps
  const reqFreq = {};
  const draftFreq = {};
  
  reqWords.forEach(word => {
    reqFreq[word] = (reqFreq[word] || 0) + 1;
  });
  
  draftWords.forEach(word => {
    draftFreq[word] = (draftFreq[word] || 0) + 1;
  });
  
  // Calculate cosine similarity
  const allWords = new Set([...reqWords, ...draftWords]);
  let dotProduct = 0;
  let reqMagnitude = 0;
  let draftMagnitude = 0;
  
  allWords.forEach(word => {
    const reqCount = reqFreq[word] || 0;
    const draftCount = draftFreq[word] || 0;
    
    dotProduct += reqCount * draftCount;
    reqMagnitude += reqCount * reqCount;
    draftMagnitude += draftCount * draftCount;
  });
  
  reqMagnitude = Math.sqrt(reqMagnitude);
  draftMagnitude = Math.sqrt(draftMagnitude);
  
  if (reqMagnitude === 0 || draftMagnitude === 0) {
    return 0;
  }
  
  return Math.round((dotProduct / (reqMagnitude * draftMagnitude)) * 100);
}

/**
 * Generate prediction based on analysis results
 */
function generatePrediction(analysis) {
  const { coverage, sections, structure, similarity, wordCount } = analysis;
  
  // Calculate weighted score
  const requirementWeight = 0.4;
  const sectionWeight = 0.3;
  const structureWeight = 0.2;
  const similarityWeight = 0.1;
  
  const weightedScore = 
    (coverage.coveragePercentage * requirementWeight) +
    (sections.completeness * sectionWeight) +
    (structure.structureScore * structureWeight) +
    (similarity * similarityWeight);
  
  // Generate grade range based on score
  let gradeRange;
  if (weightedScore >= 85) {
    gradeRange = "A (85-100%)";
  } else if (weightedScore >= 75) {
    gradeRange = "B (75-84%)";
  } else if (weightedScore >= 65) {
    gradeRange = "C (65-74%)";
  } else if (weightedScore >= 55) {
    gradeRange = "D (55-64%)";
  } else {
    gradeRange = "F (0-54%)";
  }
  
  // Generate suggestions
  const suggestions = [];
  
  if (coverage.coveragePercentage < 80) {
    suggestions.push("Include more key terms from the requirements in your draft");
  }
  
  if (sections.completeness < 80) {
    suggestions.push(`Add missing sections: ${sections.missingSections.join(', ')}`);
  }
  
  if (structure.structureScore < 70) {
    suggestions.push("Improve document structure with better organization and formatting");
  }
  
  if (wordCount < 500) {
    suggestions.push("Expand your content to meet minimum length requirements");
  } else if (wordCount > 3000) {
    suggestions.push("Consider condensing your content for better readability");
  }
  
  if (similarity < 60) {
    suggestions.push("Ensure your draft more closely addresses the specific requirements");
  }
  
  return {
    gradeRange,
    overallScore: Math.round(weightedScore),
    requirementCoverage: Math.round(coverage.coveragePercentage),
    sectionCompleteness: Math.round(sections.completeness),
    structureQuality: structure.structureScore,
    requirementsFound: coverage.termsFound,
    totalRequirements: coverage.totalTerms,
    missingSections: sections.missingSections,
    suggestions,
    wordCount,
    keyTermsFound: coverage.termsFound,
    similarityScore: similarity,
    structureScore: structure.structureScore
  };
}

/**
 * POST /api/assignments/submit
 * Submits assignment for grading
 */
exports.submitAssignment = async (req, res) => {
  try {
    const { assignmentId, studentId, filePath, predictionId } = req.body;

    // Mock submission logic
    const submission = {
      _id: new mongoose.Types.ObjectId(),
      assignmentId,
      studentId: studentId || "demo_student",
      filePath,
      predictionId,
      submittedAt: new Date(),
      status: "submitted",
      fileMetadata: {
        fileName: req.body.fileName || "assignment.pdf",
        fileSize: req.body.fileSize || 2048000,
        fileType: req.body.fileType || "application/pdf"
      }
    };

    // Save submission to database (mock)
    // const newSubmission = new AssignmentSubmission(submission);
    // await newSubmission.save();

    return res.status(200).json({
      success: true,
      submission,
      message: "Assignment submitted successfully"
    });
  } catch (error) {
    console.error("Error submitting assignment:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while submitting assignment.",
      error: error.message,
    });
  }
};

/**
 * GET /api/assignments/:assignmentId/details
 * Returns detailed information about a specific assignment
 */
exports.getAssignmentDetails = async (req, res) => {
  try {
    const { assignmentId } = req.params;

    // Mock assignment details
    const assignmentDetails = {
      _id: assignmentId,
      title: "Database Design Project",
      subject: "Database Systems",
      description: "Design a complete database system for an e-commerce platform including user management, product catalog, order processing, and payment integration.",
      dueDate: new Date("2024-04-15"),
      maxMarks: 100,
      submissionType: "document",
      status: "pending",
      instructions: [
        "Create a comprehensive ER diagram showing all entities and relationships",
        "Normalize your database design to at least 3NF",
        "Provide SQL DDL statements for table creation",
        "Include sample queries for CRUD operations",
        "Document your design decisions and trade-offs"
      ],
      requirements: [
        {
          category: "Documentation",
          items: ["ER Diagram", "Normalization report", "Design documentation"]
        },
        {
          category: "Implementation",
          items: ["SQL Schema", "Sample queries", "Test data"]
        },
        {
          category: "Analysis",
          items: "Performance considerations and optimization strategies"
        }
      ],
      rubric: [
        {
          criterion: "Database Design",
          weight: 30,
          description: "Quality of ER diagram and normalization"
        },
        {
          criterion: "SQL Implementation",
          weight: 35,
          description: "Correctness and efficiency of SQL code"
        },
        {
          criterion: "Documentation",
          weight: 20,
          description: "Clarity and completeness of documentation"
        },
        {
          criterion: "Analysis",
          weight: 15,
          description: "Performance analysis and optimization"
        }
      ],
      resources: [
        {
          type: "document",
          title: "Database Design Guidelines",
          url: "/resources/database-guidelines.pdf"
        },
        {
          type: "video",
          title: "Normalization Tutorial",
          url: "/resources/normalization-tutorial.mp4"
        }
      ]
    };

    return res.status(200).json({
      success: true,
      assignment: assignmentDetails
    });
  } catch (error) {
    console.error("Error fetching assignment details:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching assignment details.",
      error: error.message,
    });
  }
};

/**
 * GET /api/assignments/student/:studentId/submissions
 * Returns all submissions for a student
 */
exports.getStudentSubmissions = async (req, res) => {
  try {
    const { studentId } = req.params;

    // Mock submissions data
    const submissions = [
      {
        _id: '1',
        assignmentId: '2',
        assignmentTitle: "Algorithm Analysis",
        subject: "Programming",
        submittedAt: new Date("2024-04-08"),
        status: "graded",
        grade: 88,
        feedback: "Excellent analysis of algorithms with clear explanations. Could improve on edge case analysis.",
        filePath: "/submissions/algorithm-analysis.pdf",
        prediction: {
          gradeRange: "85-92%",
          confidence: 87
        }
      },
      {
        _id: '2',
        assignmentId: '3',
        assignmentTitle: "Network Security Report",
        subject: "Networking",
        submittedAt: new Date("2024-04-18"),
        status: "graded",
        grade: 85,
        feedback: "Good coverage of security topics. Implementation plan needs more detail.",
        filePath: "/submissions/network-security.pdf",
        prediction: {
          gradeRange: "82-88%",
          confidence: 84
        }
      }
    ];

    return res.status(200).json({
      success: true,
      submissions,
      total: submissions.length
    });
  } catch (error) {
    console.error("Error fetching submissions:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching submissions.",
      error: error.message,
    });
  }
};
