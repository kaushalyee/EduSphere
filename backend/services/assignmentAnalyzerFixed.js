const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');

/**
 * Fixed Assignment Analyzer - More robust criteria extraction
 */
class FixedAssignmentAnalyzer {
  constructor() {
    this.gradeRanges = [
      { min: 85, max: 100, grade: 'A - Distinction', confidence: 90 },
      { min: 75, max: 84, grade: 'B - Merit', confidence: 80 },
      { min: 65, max: 74, grade: 'C - Pass', confidence: 70 },
      { min: 55, max: 64, grade: 'D - Needs Improvement', confidence: 60 },
      { min: 0, max: 54, grade: 'F - Fail', confidence: 50 }
    ];
  }

  /**
   * Extract text from PDF with better error handling
   */
  async extractTextFromPDF(filePath) {
    try {
      console.log('Extracting text from PDF:', filePath);
      const buffer = fs.readFileSync(filePath);
      console.log('PDF file size:', buffer.length, 'bytes');
      
      if (buffer.length === 0) {
        throw new Error('PDF file is empty');
      }
      
      const data = await pdfParse(buffer);
      console.log('PDF text extracted, length:', data.text.length);
      
      if (!data.text || data.text.trim().length === 0) {
        throw new Error('No text could be extracted from PDF');
      }
      
      return data.text;
    } catch (error) {
      console.error('Error reading PDF:', error);
      console.error('PDF error details:', error.message);
      throw new Error(`Failed to extract text from PDF: ${error.message}`);
    }
  }

  /**
   * Extract text from Word document with better error handling
   */
  async extractTextFromWord(filePath) {
    try {
      console.log('Extracting text from Word:', filePath);
      const buffer = fs.readFileSync(filePath);
      console.log('Word file size:', buffer.length, 'bytes');
      
      if (buffer.length === 0) {
        throw new Error('Word file is empty');
      }
      
      const result = await mammoth.extractRawText({ buffer });
      console.log('Word text extracted, length:', result.value.length);
      
      if (!result.value || result.value.trim().length === 0) {
        throw new Error('No text could be extracted from Word document');
      }
      
      return result.value;
    } catch (error) {
      console.error('Error reading Word file:', error);
      console.error('Word error details:', error.message);
      throw new Error(`Failed to extract text from Word document: ${error.message}`);
    }
  }

  /**
   * Extract text from file based on type
   */
  async extractTextFromFile(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    
    if (ext === '.pdf') {
      return await this.extractTextFromPDF(filePath);
    } else if (ext === '.doc' || ext === '.docx') {
      return await this.extractTextFromWord(filePath);
    } else if (ext === '.txt') {
      const text = fs.readFileSync(filePath, 'utf8');
      if (!text || text.trim().length === 0) {
        throw new Error('Text file is empty');
      }
      return text;
    } else {
      throw new Error('Unsupported file type: ' + ext);
    }
  }

  /**
   * FIXED: More robust criteria extraction
   */
  extractCriteriaFromRubric(rubricText) {
    console.log('=== FIXED CRITERIA EXTRACTION ===');
    console.log('Rubric text length:', rubricText.length);
    console.log('Rubric text sample:', rubricText.substring(0, 300));
    
    // First, check if this is actually a rubric or just content
    const isStructuredRubric = this.isStructuredRubric(rubricText);
    console.log('Is structured rubric:', isStructuredRubric);
    
    if (!isStructuredRubric) {
      console.log('Not a structured rubric - using default criteria');
      return this.getDefaultCriteria(rubricText);
    }
    
    // Try to extract explicit criteria
    const explicitCriteria = this.extractExplicitCriteria(rubricText);
    
    if (explicitCriteria.length > 0 && explicitCriteria.length <= 8) {
      console.log('Found explicit criteria:', explicitCriteria.length);
      return explicitCriteria;
    } else {
      console.log('No valid explicit criteria found - using default');
      return this.getDefaultCriteria(rubricText);
    }
  }

  /**
   * Check if text is actually a structured rubric
   */
  isStructuredRubric(text) {
    const textLower = text.toLowerCase();
    
    // Look for clear rubric indicators
    const rubricIndicators = [
      /\d+\s*(?:marks?|points?)/gi,  // "10 marks", "20 points"
      /\(\s*\d+\s*(?:marks?|points?)?\s*\)/gi,  // "(20 marks)"
      /criteria|criterion|rubric|assessment/gi,  // Rubric keywords
      /grade|grading|evaluation|score/gi,  // Grading keywords
      /introduction|conclusion|analysis|research/gi  // Common criteria
    ];
    
    let matches = 0;
    rubricIndicators.forEach(pattern => {
      if (text.match(pattern)) matches++;
    });
    
    // Need at least 2 matches to be considered a structured rubric
    const isRubric = matches >= 2;
    console.log(`Rubric indicators matched: ${matches}/5`);
    
    return isRubric;
  }

  /**
   * Extract explicit criteria with strict validation
   */
  extractExplicitCriteria(text) {
    const criteria = [];
    
    // Very strict patterns for criteria extraction
    const strictPatterns = [
      // Pattern: "Introduction: 10 marks"
      /\b([A-Za-z\s&]{3,30})\s*:\s*(\d{1,3})\s*(?:marks?|points?)\b/gi,
      // Pattern: "Research (20 marks)"
      /\b([A-Za-z\s&]{3,30})\s*\(\s*(\d{1,3})\s*(?:marks?|points?)?\s*\)/gi,
      // Pattern: "Analysis - 15 marks"
      /\b([A-Za-z\s&]{3,30})\s*[-]\s*(\d{1,3})\s*(?:marks?|points?)\b/gi
    ];
    
    strictPatterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(text)) !== null) {
        const name = match[1].trim();
        const marks = parseInt(match[2]);
        
        // Very strict validation
        if (this.isValidCriterion(name, marks)) {
          criteria.push({
            name: name,
            maxMarks: marks,
            keywords: this.extractKeywords(name),
            description: `${name} worth ${marks} marks`
          });
        }
      }
    });
    
    // Remove duplicates and validate total
    const uniqueCriteria = this.removeDuplicates(criteria);
    const totalMarks = uniqueCriteria.reduce((sum, c) => sum + c.maxMarks, 0);
    
    // Only accept if total marks are reasonable (20-200)
    if (totalMarks >= 20 && totalMarks <= 200) {
      return uniqueCriteria;
    } else {
      console.log(`Invalid total marks: ${totalMarks} - rejecting criteria`);
      return [];
    }
  }

  /**
   * Validate individual criterion
   */
  isValidCriterion(name, marks) {
    // Name validation
    if (!name || name.length < 3 || name.length > 30) return false;
    
    // Marks validation
    if (!marks || marks < 1 || marks > 50) return false;
    
    // Exclude common non-criteria words
    const excludeWords = ['and', 'the', 'this', 'that', 'with', 'for', 'in', 'on', 'at', 'to', 'from', 'by', 'of', 'it', 'is', 'are', 'was', 'were'];
    const words = name.toLowerCase().split(' ');
    
    // If too many exclude words, it's probably not a criterion
    const excludeCount = words.filter(word => excludeWords.includes(word)).length;
    if (excludeCount > words.length * 0.6) return false;
    
    return true;
  }

  /**
   * Remove duplicate criteria
   */
  removeDuplicates(criteria) {
    const seen = new Set();
    return criteria.filter(criterion => {
      const key = criterion.name.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  /**
   * Get default criteria based on content analysis
   */
  getDefaultCriteria(text) {
    const textLower = text.toLowerCase();
    
    // Detect assignment type and return appropriate criteria
    if (textLower.includes('reflection') || textLower.includes('reflect')) {
      console.log('Using reflection criteria');
      return [
        { name: 'Self-Reflection', maxMarks: 25, keywords: ['reflection', 'self', 'personal', 'learning'] },
        { name: 'Evidence & Examples', maxMarks: 25, keywords: ['evidence', 'examples', 'specific', 'concrete'] },
        { name: 'Critical Analysis', maxMarks: 25, keywords: ['critical', 'analysis', 'evaluation', 'insight'] },
        { name: 'Action Planning', maxMarks: 25, keywords: ['action', 'plan', 'goals', 'improvement'] }
      ];
    }
    
    // Default academic criteria
    console.log('Using default academic criteria');
    return [
      { name: 'Content Quality', maxMarks: 30, keywords: ['content', 'quality', 'depth', 'substance'] },
      { name: 'Structure & Organization', maxMarks: 25, keywords: ['structure', 'organization', 'format', 'coherence'] },
      { name: 'Research & Evidence', maxMarks: 25, keywords: ['research', 'evidence', 'sources', 'references'] },
      { name: 'Writing Style', maxMarks: 20, keywords: ['writing', 'style', 'grammar', 'clarity'] }
    ];
  }

  /**
   * Extract keywords from criteria name
   */
  extractKeywords(criteriaName) {
    const name = criteriaName.toLowerCase();
    const keywordMap = {
      'content': ['content', 'quality', 'depth', 'substance', 'material'],
      'structure': ['structure', 'organization', 'format', 'layout', 'coherence'],
      'research': ['research', 'references', 'citation', 'sources', 'evidence'],
      'writing': ['writing', 'style', 'grammar', 'clarity', 'readability'],
      'analysis': ['analysis', 'critical', 'evaluation', 'assessment', 'insight'],
      'reflection': ['reflection', 'self', 'personal', 'learning', 'growth'],
      'introduction': ['introduction', 'intro', 'background', 'overview'],
      'conclusion': ['conclusion', 'summary', 'closing', 'ending'],
      'evidence': ['evidence', 'examples', 'support', 'proof', 'demonstration']
    };
    
    const keywords = [];
    Object.entries(keywordMap).forEach(([key, words]) => {
      if (name.includes(key)) {
        keywords.push(...words);
      }
    });
    
    return keywords.length > 0 ? keywords : [name];
  }

  /**
   * Analyze draft against criteria
   */
  analyzeDraft(draftText, criteria) {
    const breakdown = [];
    const draftLower = draftText.toLowerCase();
    
    criteria.forEach(criterion => {
      let score = 0;
      const checks = {
        keywordsFound: 0,
        hasSection: false,
        wordCount: draftText.split(/\s+/).length,
        sentences: draftText.split(/[.!?]+/).length
      };
      
      // Check for keywords
      criterion.keywords.forEach(keyword => {
        if (draftLower.includes(keyword.toLowerCase())) {
          checks.keywordsFound++;
        }
      });
      
      // Check for section headers
      const sectionPattern = new RegExp(criterion.name.split(' ').join('[\\s\\n]*'), 'i');
      checks.hasSection = sectionPattern.test(draftText);
      
      // Calculate score based on multiple factors
      const keywordScore = Math.min((checks.keywordsFound / criterion.keywords.length) * 40, 40);
      const sectionScore = checks.hasSection ? 20 : 0;
      const lengthScore = Math.min((checks.wordCount / 500) * 20, 20);
      const sentenceScore = Math.min((checks.sentences / 10) * 20, 20);
      
      score = Math.round(keywordScore + sectionScore + lengthScore + sentenceScore);
      score = Math.min(score, criterion.maxMarks);
      
      breakdown.push({
        criteria: criterion.name,
        maxMarks: criterion.maxMarks,
        predictedMarks: score,
        checks: checks,
        feedback: this.generateFeedback(score, criterion.maxMarks, checks)
      });
    });
    
    return breakdown;
  }

  /**
   * Generate feedback for each criterion
   */
  generateFeedback(score, maxMarks, checks) {
    const percentage = (score / maxMarks) * 100;
    
    if (percentage >= 80) {
      return 'Excellent work on this criterion.';
    } else if (percentage >= 60) {
      return 'Good effort, but could be improved.';
    } else if (percentage >= 40) {
      return 'Needs significant improvement.';
    } else {
      return 'Major issues found - please revise.';
    }
  }

  /**
   * Calculate final grade
   */
  calculateGrade(breakdown) {
    const totalMarks = breakdown.reduce((sum, item) => sum + item.maxMarks, 0);
    const earnedMarks = breakdown.reduce((sum, item) => sum + item.predictedMarks, 0);
    const percentage = totalMarks > 0 ? Math.round((earnedMarks / totalMarks) * 100) : 0;
    
    const gradeRange = this.gradeRanges.find(range => percentage >= range.min && percentage <= range.max);
    
    return {
      percentage,
      grade: gradeRange.grade,
      confidence: gradeRange.confidence,
      totalMarks,
      earnedMarks
    };
  }

  /**
   * Main analysis method
   */
  async analyzeSubmission(rubricFilePath, draftFilePath) {
    try {
      console.log('=== FIXED ANALYSIS START ===');
      console.log('Rubric file:', rubricFilePath);
      console.log('Draft file:', draftFilePath);
      
      // Step 1: Extract text from files
      console.log('Step 1: Extracting text from files...');
      const rubricText = await this.extractTextFromFile(rubricFilePath);
      const draftText = await this.extractTextFromFile(draftFilePath);
      
      console.log('Rubric text length:', rubricText.length);
      console.log('Draft text length:', draftText.length);
      
      // Step 2: Extract criteria from rubric
      console.log('Step 2: Extracting criteria from rubric...');
      const criteria = this.extractCriteriaFromRubric(rubricText);
      console.log('Criteria extracted:', criteria.length);
      
      // Step 3: Analyze draft against criteria
      console.log('Step 3: Analyzing draft against criteria...');
      const breakdown = this.analyzeDraft(draftText, criteria);
      
      // Step 4: Calculate grade
      console.log('Step 4: Calculating grade...');
      const predictedGrade = this.calculateGrade(breakdown);
      
      console.log('=== FIXED ANALYSIS COMPLETE ===');
      console.log('Final grade:', predictedGrade);
      
      return {
        rubricAnalysis: criteria,
        gradingBreakdown: breakdown,
        predictedGrade: predictedGrade
      };
      
    } catch (error) {
      console.error('=== FIXED ANALYSIS ERROR ===');
      console.error('Error:', error.message);
      console.error('Stack:', error.stack);
      throw new Error(`Analysis failed: ${error.message}`);
    }
  }
}

// Export the fixed analyzer
module.exports = new FixedAssignmentAnalyzer();
