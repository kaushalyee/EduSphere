const mentalHealthData = require('./mentalHealthData.js');

const ACADEMIC_KEYWORDS = {
  'academic_ai': [
    'ai', 'machine learning', 'neural network', 'deep learning',
    'regression', 'classification', 'data science', 'nlp',
    'computer vision', 'reinforcement learning', 'tensorflow',
    'artificial intelligence', 'ml', 'weak in ai', 'weak in machine learning',
    'ai and machine learning', 'machine learning algorithms'
  ],
  'academic_dsa': [
    'dsa', 'data structure', 'algorithm', 'linked list', 'array',
    'stack', 'queue', 'tree', 'graph', 'sorting', 'searching',
    'recursion', 'binary search', 'dynamic programming', 'hashing',
    'weak in dsa', 'weak in algorithms'
  ],
  'academic_math': [
    'math', 'mathematics', 'calculus', 'algebra', 'discrete',
    'probability', 'statistics', 'logic', 'graph theory', 'set theory',
    'number theory', 'combinatorics', 'matrices', 'vectors',
    'weak in math', 'weak in mathematics'
  ],
  'academic_networking': [
    'network', 'networking', 'osi', 'tcp', 'ip address',
    'protocol', 'subnet', 'router', 'dns', 'http',
    'ip model', 'computer network', 'lan', 'wan', 'mac address',
    'weak in networking', 'weak in networks'
  ],
  'academic_dbms': [
    'database', 'dbms', 'sql', 'query', 'normalization',
    'join', 'relational', 'mongodb', 'table', 'schema',
    'er diagram', 'transactions', 'indexing',
    'weak in database', 'weak in sql'
  ],
  'academic_web': [
    'web', 'html', 'css', 'react', 'node', 'frontend',
    'backend', 'web development', 'api', 'rest api',
    'javascript framework', 'vue', 'angular', 'express',
    'weak in web', 'weak in html'
  ],
  'academic_os': [
    'operating system', 'os', 'process', 'thread',
    'cpu scheduling', 'memory management', 'deadlock',
    'virtual memory', 'file system', 'semaphore', 'mutex',
    'weak in os', 'weak in operating systems'
  ],
  'academic_oop': [
    'oop', 'object oriented', 'class', 'inheritance',
    'polymorphism', 'encapsulation', 'abstraction', 'interface',
    'object', 'method overriding', 'method overloading',
    'weak in oop', 'weak in object oriented'
  ],
  'academic_cybersecurity': [
    'cybersecurity', 'security', 'encryption', 'hacking',
    'firewall', 'authentication', 'sql injection', 'xss',
    'cryptography', 'cyber', 'network security', 'malware',
    'firewalls', 'ids', 'intrusion detection',
    'weak in security', 'weak in cybersecurity'
  ],
  'academic_se': [
    'software engineering', 'sdlc', 'agile', 'scrum',
    'design pattern', 'solid', 'testing', 'uml',
    'requirement analysis', 'software design', 'waterfall',
    'weak in software engineering', 'weak in sdlc'
  ],
  'academic_devops': [
    'devops', 'cloud', 'linux', 'docker', 'kubernetes',
    'aws', 'azure', 'gcp', 'shell', 'bash', 'git',
    'ci cd', 'linux fundamentals', 'cloud platform',
    'linux basics', 'ubuntu', 'server',
    'weak in linux', 'weak in devops', 'weak in cloud'
  ],
  'academic_programming': [
    'programming', 'coding', 'java', 'python', 'javascript',
    'typescript', 'kotlin', 'swift', 'golang', 'rust',
    'c programming', 'c language', 'c++', 'coding in c',
    'weak in c', 'learn java', 'learn python',
    'weak in programming', 'weak in coding', 'weak in java',
    'weak in python'
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
  // Step 1: Check academic keywords FIRST
  const academicCheck = extractAcademicTopic(userInput);
  if (academicCheck.detected) {
    const academicIntent = mentalHealthData.intents.find(i => i.tag === academicCheck.tag);
    if (academicIntent) {
      const randomIndex = Math.floor(Math.random() * academicIntent.responses.length);
      return {
        response: academicIntent.responses[randomIndex],
        tag: academicCheck.tag,
        confidence: 1.0,
        followUp: academicIntent.followUp || ''
      };
    }
  }

  // Step 2: Fall back to pattern matching for mental health
  const classification = classifyIntent(userInput);
  const matchedIntent = mentalHealthData.intents.find(i => i.tag === classification.tag);

  let chosenResponse = "I'm not sure how to respond to that.";
  let followUp = classification.followUp;

  if (matchedIntent?.responses?.length > 0) {
    const randomIndex = Math.floor(Math.random() * matchedIntent.responses.length);
    chosenResponse = matchedIntent.responses[randomIndex];
    followUp = matchedIntent.followUp || '';
  }

  let finalResponse = chosenResponse;
  if (classification.tag !== 'unknown') {
    if (classification.confidence >= 0.4 && classification.confidence <= 0.7) {
      finalResponse = 'I think you might be feeling... ' + chosenResponse;
    } else if (classification.confidence > 0.25 && classification.confidence < 0.4) {
      finalResponse = "I'm not sure I fully understand, but... " + chosenResponse;
    }
  }

  return {
    response: finalResponse,
    tag: classification.tag,
    confidence: classification.confidence,
    followUp
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
  const words = cleaned.split(' ');

  // Step 1: ALWAYS check academic keywords FIRST
  for (const [tag, keywords] of Object.entries(ACADEMIC_KEYWORDS)) {
    for (const keyword of keywords) {
      const kw = keyword.trim().toLowerCase();
      if (kw.length === 1) {
        if (words.includes(kw)) {
          const matchedIntent = mentalHealthData.intents.find(i => i.tag === tag);
          if (matchedIntent?.category) {
            return { detected: true, category: matchedIntent.category, tag, confidence: 1.0 };
          }
        }
      } else {
        if (cleaned.includes(kw)) {
          const matchedIntent = mentalHealthData.intents.find(i => i.tag === tag);
          if (matchedIntent?.category) {
            return { detected: true, category: matchedIntent.category, tag, confidence: 1.0 };
          }
        }
      }
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
