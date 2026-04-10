// Import Node.js file system module for reading files from disk
const fs = require('fs');
// Import Node.js path module for handling file paths
const path = require('path');

// Import PDF parsing library for extracting text from PDF files
const pdfParse = require('pdf-parse');

// Import mammoth for Word document processing
const mammoth = require('mammoth');

// Create a class to encapsulate all assignment analysis functionality
class AssignmentAnalyzer {
  // Constructor method called when creating new analyzer instance
  constructor() {
    // Define grade ranges with their percentage thresholds and labels
    this.gradeRanges = {
      'A': { min: 85, max: 100, label: 'A - Distinction' },
      'B': { min: 70, max: 84, label: 'B - Merit' },
      'C': { min: 55, max: 69, label: 'C - Pass' },
      'D': { min: 0, max: 54, label: 'D - Needs Improvement' }
    };
  }

  /**
   * Extract text from PDF file
   * This method reads a PDF file and returns its text content
   */
  async extractTextFromPDF(filePath) {
    try {
      console.log('Extracting text from PDF:', filePath);
      // Read the PDF file into a buffer
      const buffer = fs.readFileSync(filePath);
      console.log('PDF file size:', buffer.length, 'bytes');
      
      // Parse the PDF and extract text using the older version
      const data = await pdfParse(buffer);
      console.log('PDF text extracted, length:', data.text.length);
      return data.text;
    } catch (error) {
      // Log any errors that occur during PDF reading
      console.error('Error reading PDF:', error);
      console.error('PDF error details:', error.message);
      // Return empty text instead of throwing error to allow analysis to continue
      console.log('Returning empty text for PDF analysis');
      return '';
    }
  }

  /**
   * Extract text from Word file using mammoth library
   * This method reads a Word document and returns its text content
   */
  async extractTextFromWord(filePath) {
    try {
      console.log('Extracting text from Word:', filePath);
      // Use mammoth to extract text from Word documents
      const buffer = fs.readFileSync(filePath);
      console.log('Word file size:', buffer.length, 'bytes');
      
      const result = await mammoth.extractRawText({ buffer });
      console.log('Word text extracted, length:', result.value.length);
      return result.value;
    } catch (error) {
      // Log any errors that occur during Word file reading
      console.error('Error reading Word file:', error);
      console.error('Word error details:', error.message);
      // Return empty text instead of throwing error to allow analysis to continue
      console.log('Returning empty text for Word analysis');
      return '';
    }
  }

  /**
   * Extract criteria from rubric text
   * This method analyzes rubric text and extracts grading criteria
   */
  extractCriteriaFromRubric(rubricText) {
    // Initialize empty array to store extracted criteria
    const criteria = [];
    
    console.log('Extracting criteria from rubric text...');
    console.log('Rubric text sample:', rubricText.substring(0, 500));
    
    // Try to detect if this is a structured rubric or just assignment description
    const hasExplicitCriteria = this.looksLikeStructuredRubric(rubricText);
    
    if (hasExplicitCriteria) {
      // Extract explicit criteria using more restrictive regex patterns
      const patterns = [
        // Pattern 1: "Introduction ........... 10 marks" - more specific
        /\b([A-Za-z\s&]+)\b[.\-:]+\s*(\d+)\s*(?:marks?|points?)?\b/gi,
        // Pattern 2: "Research & References (20)" - parentheses with numbers
        /\b([A-Za-z\s&]+)\s*\(\s*(\d+)\s*(?:marks?|points?)?\s*\)/gi,
        // Pattern 3: "Analysis: 30 marks" - colon with numbers
        /\b([A-Za-z\s&]+)\b:\s*(\d+)\s*(?:marks?|points?)?\b/gi,
        // Pattern 4: "Weighted 25%" - percentage based
        /\b([A-Za-z\s&]+)\b[^\d]*(\d+)[^\d]*%\b/gi
      ];

      console.log('Trying to extract criteria with patterns...');
      
      // Loop through each pattern and try to extract criteria
      for (const pattern of patterns) {
        let match;
        // Use regex exec to find all matches in the text
        while ((match = pattern.exec(rubricText)) !== null) {
          // Extract the criterion name and marks from the match
          let name = match[1].trim();
          let maxMarks = parseInt(match[2]);
          
          // Clean up the criterion name - remove common words that aren't criteria
          name = name.replace(/\b(and|the|this|that|with|for|in|on|at|to|from|by|of|it|is|are)\b/gi, '').trim();
          
          // Only accept criteria with reasonable names and marks
          if (name.length > 2 && name.length < 50 && maxMarks > 0 && maxMarks <= 100) {
            // Check if this criterion already exists to avoid duplicates
            if (!criteria.find(c => c.name.toLowerCase() === name.toLowerCase())) {
              console.log(`Found valid criterion: "${name}" - ${maxMarks} marks`);
              // Add the extracted criterion to our array
              criteria.push({
                name: name,  // The name of the criterion
                maxMarks: maxMarks,  // Maximum marks for this criterion
                keywords: this.extractKeywords(name),  // Extract relevant keywords
                description: `${name} section worth ${maxMarks} marks`  // Generate description
              });
            }
          }
        }
      }
    } else {
      // Generate default criteria based on common academic assignment structure
      console.log('No explicit criteria found, generating default criteria...');
      return this.generateDefaultCriteria(rubricText);
    }
    
    // If no criteria were found, create a basic structure
    if (criteria.length === 0) {
      console.log('No criteria extracted, using fallback...');
      return this.generateDefaultCriteria(rubricText);
    }
    
    console.log(`Extracted ${criteria.length} criteria:`, criteria.map(c => ({ name: c.name, marks: c.maxMarks })));
    return criteria;
  }

  /**
   * Check if rubric text looks like a structured rubric with explicit criteria
   */
  looksLikeStructuredRubric(text) {
    // Look for patterns that indicate explicit grading criteria
    const explicitPatterns = [
      /\d+\s*(?:marks?|points?)/gi,  // "10 marks", "20 points"
      /\([^\)]*\d+[^\)]*\)/gi,  // "(20)", "(out of 50)"
      /criteria|criterion|rubric/gi,  // Contains these keywords
      /grade|assessment|evaluation/gi  // Contains assessment keywords
    ];
    
    // Count how many patterns match
    const matches = explicitPatterns.reduce((count, pattern) => {
      return count + (text.match(pattern) ? 1 : 0);
    }, 0);
    
    console.log(`Structured rubric detection: ${matches}/4 patterns matched`);
    return matches >= 2; // Need at least 2 matches to consider it structured
  }

  /**
   * Generate default criteria for assignments without explicit rubrics
   */
  generateDefaultCriteria(text) {
    console.log('Generating default criteria based on assignment content...');
    
    // Analyze text to determine assignment type and generate appropriate criteria
    const criteria = [];
    
    // Adjust criteria based on text content
    const textLower = text.toLowerCase();
    
    // If it's a reflection assignment, adjust criteria
    if (textLower.includes('reflection') || textLower.includes('reflect')) {
      console.log('Detected reflection assignment - using reflection criteria');
      return [
        { name: 'Self-Reflection', maxMarks: 25, keywords: ['reflection', 'self', 'analysis', 'learning', 'personal'] },
        { name: 'Evidence & Examples', maxMarks: 25, keywords: ['evidence', 'examples', 'specific', 'concrete', 'incident'] },
        { name: 'Critical Analysis', maxMarks: 25, keywords: ['critical', 'analysis', 'evaluation', 'insight', 'assessment'] },
        { name: 'Action Planning', maxMarks: 25, keywords: ['action', 'plan', 'goals', 'improvement', 'future'] }
      ];
    }
    
    // If it's a technical/programming assignment
    if (textLower.includes('code') || textLower.includes('program') || textLower.includes('software') || textLower.includes('development')) {
      console.log('Detected technical assignment - using technical criteria');
      return [
        { name: 'Code Quality', maxMarks: 30, keywords: ['code', 'quality', 'functionality', 'efficiency', 'implementation'] },
        { name: 'Documentation', maxMarks: 20, keywords: ['documentation', 'comments', 'readability', 'explanation'] },
        { name: 'Testing & Validation', maxMarks: 25, keywords: ['testing', 'validation', 'verification', 'debugging'] },
        { name: 'Problem Solving', maxMarks: 25, keywords: ['problem', 'solving', 'approach', 'algorithm', 'logic'] }
      ];
    }
    
    // If it's a research/academic paper
    if (textLower.includes('research') || textLower.includes('paper') || textLower.includes('study') || textLower.includes('analysis')) {
      console.log('Detected research assignment - using research criteria');
      return [
        { name: 'Research Quality', maxMarks: 30, keywords: ['research', 'methodology', 'approach', 'investigation'] },
        { name: 'Critical Analysis', maxMarks: 25, keywords: ['critical', 'analysis', 'evaluation', 'interpretation'] },
        { name: 'Evidence & Sources', maxMarks: 25, keywords: ['evidence', 'sources', 'references', 'citation', 'data'] },
        { name: 'Structure & Clarity', maxMarks: 20, keywords: ['structure', 'organization', 'clarity', 'coherence'] }
      ];
    }
    
    // If it's an essay/report
    if (textLower.includes('essay') || textLower.includes('report') || textLower.includes('writing')) {
      console.log('Detected essay/report assignment - using writing criteria');
      return [
        { name: 'Content & Analysis', maxMarks: 35, keywords: ['content', 'analysis', 'depth', 'substance'] },
        { name: 'Structure & Organization', maxMarks: 25, keywords: ['structure', 'organization', 'format', 'flow'] },
        { name: 'Research & Evidence', maxMarks: 20, keywords: ['research', 'evidence', 'support', 'examples'] },
        { name: 'Writing Quality', maxMarks: 20, keywords: ['writing', 'grammar', 'style', 'clarity'] }
      ];
    }
    
    // Default academic assignment criteria
    console.log('Using default academic criteria');
    return [
      { name: 'Content Quality', maxMarks: 30, keywords: ['content', 'quality', 'analysis', 'depth', 'substance'] },
      { name: 'Structure & Organization', maxMarks: 20, keywords: ['structure', 'organization', 'format', 'layout', 'coherence'] },
      { name: 'Research & References', maxMarks: 20, keywords: ['research', 'references', 'citation', 'sources', 'evidence'] },
      { name: 'Writing Style', maxMarks: 15, keywords: ['writing', 'style', 'grammar', 'clarity', 'readability'] },
      { name: 'Critical Thinking', maxMarks: 15, keywords: ['critical', 'thinking', 'analysis', 'evaluation', 'insight'] }
    ];
  }

  /**
   * Extract keywords from criteria name
   * This method generates relevant keywords for each criterion
   */
  extractKeywords(criteriaName) {
    // Convert criterion name to lowercase for easier matching
    const name = criteriaName.toLowerCase();
    // Define mapping of criterion types to their relevant keywords
    const keywordMap = {
      'introduction': ['introduction', 'intro', 'background', 'overview'],
      'research': ['research', 'references', 'citation', 'bibliography', 'sources'],
      'analysis': ['analysis', 'analyze', 'examination', 'evaluation'],
      'conclusion': ['conclusion', 'summary', 'final', 'ending'],
      'formatting': ['formatting', 'format', 'layout', 'structure', 'presentation']
    };

    // Loop through keyword map to find matching keywords
    for (const [key, keywords] of Object.entries(keywordMap)) {
      // If criterion name contains the key, return its keywords
      if (name.includes(key)) {
        return keywords;
      }
    }

    // Default: extract words from criteria name longer than 3 characters
    return name.split(/\s+/).filter(word => word.length > 3);
  }

  /**
   * Get default criteria if extraction fails
   * This method returns standard criteria when rubric parsing fails
   */
  getDefaultCriteria() {
    // Return array of standard assignment criteria
    return [
      { name: 'Introduction', maxMarks: 10, keywords: ['introduction', 'intro'], description: 'Introduction section' },
      { name: 'Research & References', maxMarks: 20, keywords: ['research', 'references', 'citation'], description: 'Research and references' },
      { name: 'Analysis', maxMarks: 30, keywords: ['analysis', 'analyze'], description: 'Analysis section' },
      { name: 'Conclusion', maxMarks: 10, keywords: ['conclusion', 'summary'], description: 'Conclusion section' },
      { name: 'Formatting', maxMarks: 10, keywords: ['formatting', 'format'], description: 'Formatting and presentation' }
    ];
  }

  /**
   * Analyze draft against criteria
   * This method checks the student's draft against each rubric criterion
   */
  analyzeDraft(draftText, criteria) {
    // Initialize empty array to store analysis results
    const results = [];
    // Convert draft text to lowercase for easier keyword matching
    const lowerDraftText = draftText.toLowerCase();
    // Split draft text into words for counting
    const words = draftText.split(/\s+/).filter(word => word.length > 0);

    // Loop through each criterion and analyze it
    for (const criterion of criteria) {
      // Analyze this specific criterion
      const analysis = this.checkCriterion(lowerDraftText, words, criterion);
      // Add the analysis results to our array
      results.push(analysis);
    }

    // Return the complete analysis results
    return results;
  }

  /**
   * Check individual criterion
   * This method performs detailed checks on a single criterion
   */
  checkCriterion(draftText, words, criterion) {
    // Initialize checks object with default values
    const checks = {
      hasSection: false,  // Whether section heading was found
      wordCount: 0,  // Number of words in the document
      keywordsFound: 0,  // Number of matching keywords found
      referencesCount: 0,  // Number of references found
      formattingCorrect: false  // Whether formatting is correct
    };

    // Initialize score accumulator
    let score = 0;

    // Check 1: Section presence (40% weight)
    const sectionKeywords = criterion.keywords.some(keyword => 
      draftText.includes(keyword.toLowerCase())
    );
    checks.hasSection = sectionKeywords;  // Store if section was found
    if (checks.hasSection) {
      score += 40;  // Add 40% of possible score
    }

    // Check 2: Word count (30% weight)
    checks.wordCount = words.length;  // Store total word count
    if (checks.wordCount > 100) {  // Minimum threshold check
      score += 30;  // Add 30% of possible score
    }

    // Check 3: Keywords found (20% weight)
    const keywordMatches = criterion.keywords.filter(keyword => 
      draftText.includes(keyword.toLowerCase())
    );
    checks.keywordsFound = keywordMatches.length;  // Store count of found keywords
    if (checks.keywordsFound > 0) {
      score += 20;  // Add 20% of possible score
    }

    // Check 4: References (10% weight)
    if (criterion.name.toLowerCase().includes('reference') || 
        criterion.name.toLowerCase().includes('research')) {
      // Define patterns that indicate references
      const refPatterns = ['et al', 'http', 'www.', 'doi:', 'ref.'];
      // Count occurrences of reference patterns
      checks.referencesCount = refPatterns.reduce((count, pattern) => 
        count + (draftText.split(pattern).length - 1), 0
      );
      
      if (checks.referencesCount >= 3) {  // Minimum 3 references
        score += 10;  // Add 10% of possible score
      }
    } else {
      // For non-reference criteria, check formatting
      checks.formattingCorrect = this.checkFormatting(draftText);
      if (checks.formattingCorrect) {
        score += 10;  // Add 10% of possible score
      }
    }

    // Calculate predicted marks based on score percentage
    const predictedMarks = Math.round((score / 100) * criterion.maxMarks);

    // Return complete analysis object for this criterion
    return {
      criteria: criterion.name,  // Name of the criterion
      maxMarks: criterion.maxMarks,  // Maximum possible marks
      predictedMarks,  // Predicted marks from analysis
      checks  // Detailed check results
    };
  }

  /**
   * Basic formatting check
   * This method performs basic formatting validation
   */
  checkFormatting(text) {
    // Check if document has paragraph breaks (multiple newlines)
    const hasParagraphs = text.includes('\n\n');
    // Check if document has proper sentence endings
    const hasSentences = /[.!?]\s+[A-Z]/.test(text);
    // Return true if both formatting checks pass
    return hasParagraphs && hasSentences;
  }

  /**
   * Calculate final grade prediction
   * This method determines overall grade from breakdown
   */
  calculateGrade(breakdown) {
    // Calculate total maximum marks from all criteria
    const totalMax = breakdown.reduce((sum, item) => sum + item.maxMarks, 0);
    // Calculate total predicted marks from all criteria
    const totalPredicted = breakdown.reduce((sum, item) => sum + item.predictedMarks, 0);
    
    // Handle edge case where no criteria exist
    if (totalMax === 0) {
      return { percentage: 0, grade: 'D - Needs Improvement', confidence: 0 };
    }

    // Calculate overall percentage score
    const percentage = Math.round((totalPredicted / totalMax) * 100);
    
    // Initialize default grade and confidence
    let grade = 'D - Needs Improvement';
    let confidence = 50;  // Base confidence level

    // Loop through grade ranges to find matching grade
    for (const [key, range] of Object.entries(this.gradeRanges)) {
      // Check if percentage falls within this grade range
      if (percentage >= range.min && percentage <= range.max) {
        grade = range.label;  // Set the grade label
        // Higher confidence for middle ranges (more reliable predictions)
        if (percentage >= 60 && percentage <= 80) {
          confidence = 75;
        } else if (percentage >= 70 && percentage <= 85) {
          confidence = 85;  // Highest confidence for common grade ranges
        }
        break;  // Exit loop once grade is found
      }
    }

    // Return complete grade prediction object
    return {
      percentage,  // Overall percentage score
      grade,  // Grade label with description
      confidence  // Confidence level in prediction
    };
  }

  /**
   * Main analysis function
   * This is the primary method that orchestrates the entire analysis
   */
  async analyzeSubmission(rubricFilePath, draftFilePath) {
    try {
      console.log('Starting analysis submission...');
      console.log('Rubric file:', rubricFilePath);
      console.log('Draft file:', draftFilePath);
      
      // Step 1: Extract text from both uploaded files
      console.log('Step 1: Extracting text from files...');
      const rubricText = await this.extractTextFromFile(rubricFilePath);
      const draftText = await this.extractTextFromFile(draftFilePath);
      
      console.log('Rubric text length:', rubricText.length);
      console.log('Draft text length:', draftText.length);

      // Step 2: Extract criteria from rubric text
      console.log('Step 2: Extracting criteria from rubric...');
      const criteria = this.extractCriteriaFromRubric(rubricText);
      console.log('Extracted criteria count:', criteria.length);

      // Step 3: Analyze draft against extracted criteria
      console.log('Step 3: Analyzing draft against criteria...');
      const breakdown = this.analyzeDraft(draftText, criteria);
      console.log('Analysis breakdown completed');

      // Step 4: Calculate final grade prediction
      console.log('Step 4: Calculating grade prediction...');
      const predictedGrade = this.calculateGrade(breakdown);
      console.log('Grade prediction completed:', predictedGrade);

      // Return complete analysis results object
      const result = {
        rubricAnalysis: {
          criteria,  // Extracted criteria from rubric
          extractedAt: new Date()  // Timestamp of analysis
        },
        gradingBreakdown: breakdown,  // Detailed breakdown by criterion
        predictedGrade  // Final grade prediction
      };
      
      console.log('Analysis completed successfully');
      return result;
    } catch (error) {
      // Log any errors that occur during analysis
      console.error('Analysis error:', error);
      console.error('Analysis error details:', error.message);
      console.error('Analysis error stack:', error.stack);
      // Throw descriptive error for calling code to handle
      throw new Error('Failed to analyze submission: ' + error.message);
    }
  }

  /**
   * Extract text from file based on extension
   * This method determines file type and calls appropriate extractor
   */
  async extractTextFromFile(filePath) {
    // Get file extension from file path
    const ext = path.extname(filePath).toLowerCase();
    
    // Use switch statement to handle different file types
    switch (ext) {
      case '.pdf':
        // Call PDF extractor for PDF files
        return await this.extractTextFromPDF(filePath);
      case '.docx':
      case '.doc':
        // Call Word extractor for Word files
        return await this.extractTextFromWord(filePath);
      case '.txt':
        // Read text files directly
        return fs.readFileSync(filePath, 'utf8');
      default:
        // Throw error for unsupported file types
        throw new Error(`Unsupported file type: ${ext}`);
    }
  }
}

// Export a singleton instance of the analyzer for use throughout the application
module.exports = new AssignmentAnalyzer();
