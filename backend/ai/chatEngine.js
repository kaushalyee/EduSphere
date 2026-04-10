const mentalHealthData = require('./mentalHealthData.js');

const ACADEMIC_KEYWORDS = {
  'academic_dsa': [
    'dsa', 'data structure', 'algorithm', 'linked list', 'array',
    'stack', 'queue', 'tree', 'graph', 'sorting', 'searching',
    'recursion', 'binary search', 'dynamic programming', 'hashing'
  ],
  'academic_math': [
    'math', 'mathematics', 'calculus', 'algebra', 'discrete',
    'probability', 'statistics', 'logic', 'graph theory', 'set theory',
    'number theory', 'combinatorics', 'matrices', 'vectors'
  ],
  'academic_programming': [
    'programming', 'coding', 'java', 'python', 'javascript',
    'typescript', 'kotlin', 'swift', 'golang', 'rust',
    'c programming', 'c language', 'c++', 'coding in c',
    'weak in c', 'learn java', 'learn python'
  ],
  'academic_dbms': [
    'database', 'dbms', 'sql', 'query', 'normalization',
    'join', 'relational', 'mongodb', 'table', 'schema',
    'er diagram', 'transactions', 'indexing'
  ],
  'academic_networking': [
    'network', 'networking', 'osi', 'tcp', 'ip address',
    'protocol', 'subnet', 'router', 'dns', 'http', 'firewall',
    'ip model', 'computer network', 'lan', 'wan', 'mac address'
  ],
  'academic_oop': [
    'oop', 'object oriented', 'class', 'inheritance',
    'polymorphism', 'encapsulation', 'abstraction', 'interface',
    'object', 'method overriding', 'method overloading'
  ],
  'academic_web': [
    'web', 'html', 'css', 'react', 'node', 'frontend',
    'backend', 'web development', 'api', 'rest api',
    'javascript framework', 'vue', 'angular', 'express'
  ],
  'academic_os': [
    'operating system', 'os', 'process', 'thread',
    'cpu scheduling', 'memory management', 'deadlock',
    'virtual memory', 'file system', 'semaphore', 'mutex'
  ],
  'academic_se': [
    'software engineering', 'sdlc', 'agile', 'scrum',
    'design pattern', 'solid', 'testing', 'uml',
    'requirement analysis', 'software design', 'waterfall'
  ],
  'academic_cybersecurity': [
    'cybersecurity', 'security', 'encryption', 'hacking',
    'firewall', 'authentication', 'sql injection', 'xss',
    'cryptography', 'cyber', 'network security', 'malware',
    'firewalls', 'ids', 'intrusion detection'
  ],
  'academic_ai': [
    'ai', 'machine learning', 'neural network', 'deep learning',
    'regression', 'classification', 'data science', 'nlp',
    'computer vision', 'reinforcement learning', 'tensorflow'
  ],
  'academic_devops': [
    'devops', 'cloud', 'linux', 'docker', 'kubernetes',
    'aws', 'azure', 'gcp', 'shell', 'bash', 'git',
    'ci cd', 'linux fundamentals', 'cloud platform',
    'linux basics', 'ubuntu', 'server'
  ]
};

function preprocessInput(text) {
  if (!text) return "";
  // Convert text to lowercase
  let cleaned = text.toLowerCase();
  
  // Remove punctuation and special characters
  cleaned = cleaned.replace(/[^\w\s]|_/g, "");
  
  // Remove common filler words
  const fillerWords = ["um", "uh", "like", "just", "really", "very", "bro", "man", "dude", "literally", "honestly", "basically", "actually", "tbh", "ngl", "idk", "omg", "lol"];
  const regex = new RegExp("\\b(" + fillerWords.join("|") + ")\\b", "gi");
  cleaned = cleaned.replace(regex, "");
  
  // Trim extra whitespace
  return cleaned.replace(/\s+/g, " ").trim();
}

function tokenize(text) {
  // Split cleaned text into individual words
  const words = text.split(" ");
  
  // Remove very short words (less than 2 characters)
  return words.filter(word => word.length >= 2);
}

function calculateSimilarity(inputTokens, patternTokens) {
  if (inputTokens.length === 0 || patternTokens.length === 0) return 0;
  
  let score = 0;
  for (const token of inputTokens) {
    if (patternTokens.includes(token)) {
      score += 1; // Exact match
    } else {
      let partialMatch = false;
      for (const pToken of patternTokens) {
        if (pToken.includes(token) || token.includes(pToken)) {
          partialMatch = true;
          break;
        }
      }
      if (partialMatch) {
        score += 0.5; // Partial match
      }
    }
  }
  
  // Normalize based on length size to keep between 0 and 1
  let normalizedScore = score / Math.max(inputTokens.length, patternTokens.length);
  
  // Bonus score if input length is similar to pattern length
  const lengthDiff = Math.abs(inputTokens.length - patternTokens.length);
  if (lengthDiff <= 2) {
    normalizedScore += 0.1;
  }
  
  return Math.min(normalizedScore, 1);
}

function classifyIntent(userInput) {
  const cleanedText = preprocessInput(userInput);
  const inputTokens = tokenize(cleanedText);
  
  let highestScore = 0;
  let bestIntent = null;
  
  for (const intent of mentalHealthData.intents) {
    for (const pattern of intent.patterns) {
      const pCleaned = preprocessInput(pattern);
      const pTokens = tokenize(pCleaned);
      
      const similarity = calculateSimilarity(inputTokens, pTokens);
      if (similarity > highestScore) {
        highestScore = similarity;
        bestIntent = intent;
      }
    }
  }
  
  if (highestScore > 0.20 && bestIntent) {
    return { 
      tag: bestIntent.tag, 
      confidence: highestScore, 
      response: "",
      followUp: bestIntent.followUp || "" 
    };
  } else {
    const unknownIntent = mentalHealthData.intents.find(i => i.tag === "unknown");
    return {
      tag: "unknown",
      confidence: highestScore,
      response: "",
      followUp: unknownIntent ? (unknownIntent.followUp || "") : ""
    };
  }
}

function getResponse(userInput) {
  const classification = classifyIntent(userInput);
  const matchedIntent = mentalHealthData.intents.find(i => i.tag === classification.tag);
  
  let chosenResponse = "I'm not sure how to respond to that.";
  let followUp = classification.followUp;
  
  if (matchedIntent && matchedIntent.responses && matchedIntent.responses.length > 0) {
    const randomIndex = Math.floor(Math.random() * matchedIntent.responses.length);
    chosenResponse = matchedIntent.responses[randomIndex];
    followUp = matchedIntent.followUp || "";
  }
  
  let finalResponse = chosenResponse;
  
  if (classification.tag !== "unknown") {
    if (classification.confidence > 0.7) {
      // High confidence, respond normally
    } else if (classification.confidence >= 0.4 && classification.confidence <= 0.7) {
      finalResponse = "I think you might be feeling... " + chosenResponse;
    } else if (classification.confidence > 0.20 && classification.confidence < 0.4) {
      finalResponse = "I'm not sure I fully understand, but... " + chosenResponse;
    }
  }
  
  return {
    response: finalResponse,
    tag: classification.tag,
    confidence: classification.confidence,
    followUp: followUp
  };
}

function generateConversationTitle(firstMessage) {
  if (!firstMessage) return "New Conversation";
  const classification = classifyIntent(firstMessage);
  
  switch(classification.tag) {
    case "exam_stress": return "Exam Stress Support";
    case "anxiety": return "Anxiety & Worry";
    case "depression": return "Feeling Low";
    case "loneliness": return "Loneliness Support";
    case "motivation_loss": return "Motivation Help";
    case "burnout": return "Burnout Recovery";
    case "sleep_problems": return "Sleep Issues";
    case "family_pressure": return "Family Pressure";
    case "relationship_problems": return "Relationship Support";
    case "self_confidence": return "Self Confidence";
    case "anger": return "Anger Management";
    case "homesickness": return "Homesickness";
    case "financial_stress": return "Financial Stress";
    case "suicidal_thoughts": return "Crisis Support";
    case "positive_progress": return "Positive Progress";
    case "greeting": return firstMessage.substring(0, 30);
    default: return firstMessage.substring(0, 30);
  }
}

function extractAcademicTopic(userInput) {
  const cleaned = preprocessInput(userInput).toLowerCase();

  // Step 1: Direct keyword matching (most accurate)
  for (const [tag, keywords] of Object.entries(ACADEMIC_KEYWORDS)) {
    for (const keyword of keywords) {
      const words = cleaned.split(' ');
      let isMatch = false;
      if (keyword.trim().length === 1) {
        if (words.includes(keyword.trim())) isMatch = true;
      } else {
        if (cleaned.includes(keyword)) isMatch = true;
      }

      if (isMatch) {
        const matchedIntent = mentalHealthData.intents.find(i => i.tag === tag);
        if (matchedIntent && matchedIntent.category) {
          return {
            detected: true,
            category: matchedIntent.category,
            tag: tag,
            confidence: 1.0
          };
        }
      }
    }
  }

  // Step 2: Fall back to intent classification
  const classification = classifyIntent(userInput);
  if (classification.tag && classification.tag.startsWith('academic_')) {
    const matchedIntent = mentalHealthData.intents.find(
      i => i.tag === classification.tag
    );
    if (matchedIntent && matchedIntent.category) {
      return {
        detected: true,
        category: matchedIntent.category,
        tag: classification.tag,
        confidence: classification.confidence
      };
    }
  }

  return { detected: false, category: null };
}

module.exports = {
  preprocessInput,
  tokenize,
  calculateSimilarity,
  classifyIntent,
  getResponse,
  generateConversationTitle,
  extractAcademicTopic
};
