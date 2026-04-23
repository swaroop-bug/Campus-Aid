const Quiz = require('../models/Quiz');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini (expects GEMINI_API_KEY in env)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Semesters mapping for Masters (4 semesters over 2 years)
const quizData = {
  1: {
    // Semester 1
    subjects: [
      'Research Methodology',
      'Advanced Database',
      'Modern Compiler Design',
      'Social Network Analysis',
      'Advanced Computer Networks'
    ]
  },
  2: {
    // Semester 2
    subjects: [
      'Digital Image Processing',
      'Natural Language Processing',
      'Human Computer Interaction',
      'Bioinformatics',
      'Cloud Computing'
    ]
  },
  3: {
    // Semester 3
    subjects: [
      'Big Data Analysis',
      'Blockchain Technology',
      'Machine Learning',
      'Security Attacks and Counter Measures'
    ]
  },
  4: {
    // Semester 4
    subjects: [
      'Web Mining',
      'Deep Learning'
    ]
  }
};

// Generate quiz using Gemini AI
const generateQuizWithAI = async (subject) => {
  try {
    console.log(`Generating quiz for: ${subject} using Gemini AI`);

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `Generate exactly 5 multiple choice questions about "${subject}" suitable for Masters-level (postgraduate) students. Keep the difficulty appropriate for the subject at graduate level and, if relevant, assume the subject is being taught in the intended semester.\n\nIMPORTANT: Return ONLY a valid JSON array with NO markdown, NO code blocks, NO extra text.\n\nFormat:\n[\n  {\n    "question": "What is...",\n    "options": ["Option A", "Option B", "Option C", "Option D"],\n    "correct": 0\n  }\n]\n\nRequirements:\n- Each question must have exactly 4 options\n- The "correct" field must be the index (0-3) of the correct answer\n- Questions should be clear, focused, and educational at Masters level\n- Return ONLY the JSON array, nothing else`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const content = response.text().trim();

    // Strip code fences if returned
    let jsonContent = content;
    if (content.includes('```')) {
      jsonContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    }

    const questions = JSON.parse(jsonContent);

    // Basic validation
    if (!Array.isArray(questions) || questions.length === 0) {
      throw new Error('Invalid response format from AI');
    }

    questions.forEach((q, index) => {
      if (!q.question || !Array.isArray(q.options) || q.options.length !== 4 || typeof q.correct !== 'number') {
        throw new Error(`Invalid question format at index ${index}`);
      }
    });

    return questions;
  } catch (err) {
    console.error('Gemini API Error:', err && err.message ? err.message : err);
    return getMockQuestions(subject);
  }
};

// Fallback mock questions for each Masters subject
const getMockQuestions = (subject) => {
  const mockQuizzes = {
    // Semester 1
    'Research Methodology': [
      { question: 'Which method is commonly used for qualitative research?', options: ['Randomized Controlled Trial', 'Case Study', 'ANOVA', 'Linear Regression'], correct: 1 },
      { question: 'What is a literature review?', options: ['Primary data collection', 'Analysis of experimental results', 'Survey of existing research', 'Statistical test'], correct: 2 },
      { question: 'What is the purpose of a research hypothesis?', options: ['To prove a theory', 'To provide a testable prediction', 'To collect data', 'To publish results'], correct: 1 },
      { question: 'Which sampling is non-probability?', options: ['Simple random sampling', 'Stratified sampling', 'Purposive sampling', 'Cluster sampling'], correct: 2 },
      { question: 'What does IRB stand for?', options: ['Institutional Review Board', 'International Research Body', 'Internal Review Bureau', 'Independent Research Board'], correct: 0 }
    ],
    'Advanced Database': [
      { question: 'What is ACID property related to?', options: ['Networking', 'Database transactions', 'Machine learning', 'Operating systems'], correct: 1 },
      { question: 'Which index type is good for range queries?', options: ['Hash index', 'B-tree index', 'Bitmap index', 'None'], correct: 1 },
      { question: 'What does normalization aim to reduce?', options: ['Security', 'Redundancy', 'Performance', 'Scalability'], correct: 1 },
      { question: 'What is a materialized view?', options: ['Virtual table', 'Stored query result', 'Index type', 'Backup copy'], correct: 1 },
      { question: 'Which is a NoSQL database?', options: ['MySQL', 'PostgreSQL', 'MongoDB', 'SQLite'], correct: 2 }
    ],
    'Modern Compiler Design': [
      { question: 'What does lexical analysis produce?', options: ['Tokens', 'AST', 'Bytecode', 'Machine code'], correct: 0 },
      { question: 'What is an Abstract Syntax Tree?', options: ['Concrete code', 'Tree representation of source', 'Optimized binary', 'Parser output error'], correct: 1 },
      { question: 'Which optimization removes unreachable code?', options: ['Loop unrolling', 'Dead code elimination', 'Inlining', 'Constant folding'], correct: 1 },
      { question: 'What phase does register allocation belong to?', options: ['Lexical', 'Parsing', 'Code generation', 'Linking'], correct: 2 },
      { question: 'What is a compiler backend mainly responsible for?', options: ['Tokenization', 'Type checking', 'Target code generation', 'Syntax analysis'], correct: 2 }
    ],
    'Social Network Analysis': [
      { question: 'What is a node in social network analysis?', options: ['Edge', 'Vertex representing an entity', 'Matrix', 'Algorithm'], correct: 1 },
      { question: 'What does centrality measure?', options: ['Importance of a node', 'Number of communities', 'Graph color', 'Edge weight'], correct: 0 },
      { question: 'Which metric measures clustering?', options: ['Betweenness', 'Closeness', 'Clustering coefficient', 'Degree'], correct: 2 },
      { question: 'What is modularity used for?', options: ['Detecting communities', 'Sorting nodes', 'Visualizing graphs', 'Encrypting edges'], correct: 0 },
      { question: 'What is an edge in a network?', options: ['A path', 'Connection between nodes', 'A community', 'A metric'], correct: 1 }
    ],
    'Advanced Computer Networks': [
      { question: 'Which layer handles routing?', options: ['Physical', 'Network', 'Transport', 'Application'], correct: 1 },
      { question: 'What is SDN?', options: ['Secure Data Networking', 'Software Defined Networking', 'Simple Data Node', 'Static Data Network'], correct: 1 },
      { question: 'What does QoS stand for?', options: ['Quality of Service', 'Quantity of Servers', 'Query on Storage', 'Queue of Systems'], correct: 0 },
      { question: 'Which protocol is connection-oriented?', options: ['UDP', 'TCP', 'ICMP', 'ARP'], correct: 1 },
      { question: 'What is MPLS used for?', options: ['Label switching', 'Address resolution', 'Encryption', 'Compression'], correct: 0 }
    ],

    // Semester 2
    'Digital Image Processing': [
      { question: 'What is image thresholding used for?', options: ['Compression', 'Segmentation', 'Colorization', 'Filtering'], correct: 1 },
      { question: 'Which transform is used for image compression?', options: ['Fourier Transform', 'Wavelet Transform', 'Laplace Transform', 'Z Transform'], correct: 1 },
      { question: 'What is edge detection?', options: ['Finding object boundaries', 'Smoothing', 'Color mapping', 'Scaling'], correct: 0 },
      { question: 'Which filter reduces noise while preserving edges?', options: ['Gaussian blur', 'Median filter', 'Box filter', 'Low-pass filter'], correct: 1 },
      { question: 'What does RGB stand for?', options: ['Red Green Blue', 'Random Gaussian Blur', 'Rapid Graph Build', 'None'], correct: 0 }
    ],
    'Natural Language Processing': [
      { question: 'What is tokenization?', options: ['Converting to tokens', 'Parsing syntax trees', 'Model training', 'Evaluation'], correct: 0 },
      { question: 'What is word embedding?', options: ['One-hot encoding', 'Dense vector representation of words', 'Stopword removal', 'Stemming'], correct: 1 },
      { question: 'Which model is transformer-based?', options: ['RNN', 'LSTM', 'BERT', 'HMM'], correct: 2 },
      { question: 'What is POS tagging?', options: ['Part-of-speech tagging', 'Probability of sequence', 'Pattern of speech', 'Phrase ordering'], correct: 0 },
      { question: 'What is BLEU used for?', options: ['Image quality', 'Translation evaluation', 'Speech recognition', 'Parsing'], correct: 1 }
    ],
    'Human Computer Interaction': [
      { question: 'What does usability evaluate?', options: ['Speed only', 'Ease of use and satisfaction', 'Security', 'Memory usage'], correct: 1 },
      { question: 'What is a prototype?', options: ['Final product', 'Early model for testing', 'Database schema', 'Algorithm'], correct: 1 },
      { question: 'Which method gathers user feedback qualitatively?', options: ['A/B testing', 'Surveys', 'Interviews', 'Unit tests'], correct: 2 },
      { question: 'What is affordance?', options: ['Security property', 'Visual cue indicating use', 'Backend API', 'Data model'], correct: 1 },
      { question: 'What is accessibility about?', options: ['Performance', 'Support for disabled users', 'Networking', 'Data storage'], correct: 1 }
    ],
    'Bioinformatics': [
      { question: 'What is sequence alignment?', options: ['Aligning database fields', 'Comparing biological sequences', 'Sorting numbers', 'Image alignment'], correct: 1 },
      { question: 'What does BLAST do?', options: ['Sequence alignment search', 'Protein folding', 'Image processing', 'Network routing'], correct: 0 },
      { question: 'What is a genome?', options: ['Protein structure', 'Complete DNA set', 'Algorithm', 'Data format'], correct: 1 },
      { question: 'Which data is common in bioinformatics?', options: ['Text logs', 'Genomic sequences', 'Financial records', 'Sensor data'], correct: 1 },
      { question: 'What is FASTA format?', options: ['Image format', 'Sequence file format', 'Database engine', 'Compression type'], correct: 1 }
    ],
    'Cloud Computing': [
      { question: 'What is IaaS?', options: ['Infrastructure as a Service', 'Internet as a Service', 'Integration as a Service', 'Information as a Service'], correct: 0 },
      { question: 'Which is a cloud deployment model?', options: ['Public, Private, Hybrid', 'Local, Remote', 'SaaS only', 'None'], correct: 0 },
      { question: 'What is virtualization?', options: ['Physical hardware creation', 'Creating virtual resources', 'Database normalization', 'Network routing'], correct: 1 },
      { question: 'What is auto-scaling used for?', options: ['Security', 'Automatic resource adjustment', 'Logging', 'Monitoring only'], correct: 1 },
      { question: 'What does CDN stand for?', options: ['Content Delivery Network', 'Central Database Node', 'Compute Data Network', 'Cloud Data Node'], correct: 0 }
    ],

    // Semester 3
    'Big Data Analysis': [
      { question: 'What is MapReduce used for?', options: ['Data visualization', 'Distributed processing of large data', 'Security', 'Networking'], correct: 1 },
      { question: 'What is HDFS?', options: ['Distributed file system', 'Database', 'Compression tool', 'API'], correct: 0 },
      { question: 'Which framework is used for cluster computing?', options: ['Django', 'Spark', 'Flask', 'Express'], correct: 1 },
      { question: 'What is a data lake?', options: ['Structured warehouse', 'Centralized raw data storage', 'Backup system', 'Index'], correct: 1 },
      { question: 'What does ETL stand for?', options: ['Extract Transform Load', 'Evaluate Test Load', 'Encrypt Transfer Link', 'Extract Transfer Link'], correct: 0 }
    ],
    'Blockchain Technology': [
      { question: 'What is a smart contract?', options: ['Legal paper', 'Self-executing code', 'Encryption algorithm', 'Consensus protocol'], correct: 1 },
      { question: 'What does decentralization mean?', options: ['Single point control', 'Distributed control across nodes', 'Faster networks', 'Private cloud'], correct: 1 },
      { question: 'Which data structure underpins blockchains?', options: ['Trees', 'Linked list of blocks', 'Hash tables', 'Queues'], correct: 1 },
      { question: 'What is a consensus mechanism?', options: ['Data backup', 'Agreement protocol among nodes', 'Compression method', 'Indexing'], correct: 1 },
      { question: 'Which platform popularized smart contracts?', options: ['Bitcoin', 'Ethereum', 'Litecoin', 'Monero'], correct: 1 }
    ],
    'Machine Learning': [
      { question: 'What is supervised learning?', options: ['Learning without labels', 'Learning with labeled data', 'Clustering only', 'Dimensionality reduction'], correct: 1 },
      { question: 'What is overfitting?', options: ['Good generalization', 'Model fits noise', 'Underfitting', 'Data augmentation'], correct: 1 },
      { question: 'Which algorithm is used for classification?', options: ['K-means', 'Linear Regression', 'Logistic Regression', 'PCA'], correct: 2 },
      { question: 'What is cross-validation used for?', options: ['Model evaluation', 'Data cleaning', 'Feature extraction', 'Deployment'], correct: 0 },
      { question: 'What is gradient descent?', options: ['Optimization algorithm', 'Data sorting', 'Network protocol', 'Encryption method'], correct: 0 }
    ],
    'Security Attacks and Counter Measures': [
      { question: 'What is a DDoS attack?', options: ['Data exfiltration', 'Distributed denial of service', 'Malware injection', 'Phishing'], correct: 1 },
      { question: 'What is SQL injection?', options: ['Network attack', 'Code injection via SQL queries', 'Phishing technique', 'Password brute force'], correct: 1 },
      { question: 'What does XSS target?', options: ['Server CPU', 'User browsers', 'Databases', 'Network routers'], correct: 1 },
      { question: 'What is a common countermeasure for injection attacks?', options: ['Input validation and parameterized queries', 'No authentication', 'Verbose errors', 'Open ports'], correct: 0 },
      { question: 'What is penetration testing?', options: ['Performance testing', 'Security testing by simulating attacks', 'Unit testing', 'Static analysis'], correct: 1 }
    ],

    // Semester 4
    'Web Mining': [
      { question: 'What is web mining?', options: ['Mining cryptocurrencies', 'Extracting useful information from web data', 'Web hosting', 'Web design'], correct: 1 },
      { question: 'Which type of web mining focuses on content?', options: ['Web structure mining', 'Web content mining', 'Web usage mining', 'Web security mining'], correct: 1 },
      { question: 'What is crawling?', options: ['Data analysis', 'Fetching pages from web', 'Rendering graphics', 'Compiling code'], correct: 1 },
      { question: 'What is an important challenge in web mining?', options: ['Small data volume', 'Heterogeneous and noisy data', 'No users', 'Static pages only'], correct: 1 },
      { question: 'What is link analysis used for?', options: ['Image processing', 'Analyzing relationships between pages', 'Encryption', 'Sorting algorithms'], correct: 1 }
    ],
    'Deep Learning': [
      { question: 'What is a deep neural network?', options: ['Shallow network', 'Network with many layers', 'A database', 'An OS'], correct: 1 },
      { question: 'Which activation is common in deep nets?', options: ['ReLU', 'Linear only', 'Step function', 'None'], correct: 0 },
      { question: 'What is backpropagation used for?', options: ['Data collection', 'Training neural networks', 'Model deployment', 'Feature scaling'], correct: 1 },
      { question: 'What is dropout used for?', options: ['Data augmentation', 'Regularization to prevent overfitting', 'Optimization', 'Activation'], correct: 1 },
      { question: 'Which framework is popular for deep learning?', options: ['Express', 'Django', 'TensorFlow', 'Laravel'], correct: 2 }
    ]
  };

  return mockQuizzes[subject] || [
    {
      question: `Sample question for ${subject}`,
      options: ['Option A', 'Option B', 'Option C', 'Option D'],
      correct: 0
    }
  ];
};

// Get available subjects for a year (Masters: each year = 2 semesters)
exports.getSubjects = async (req, res) => {
  try {
    // return all subjects across semesters
    const totalSemesters = Object.keys(quizData).length; // 4

    let allSubjects = [];
    for (let s = 1; s <= totalSemesters; s++) {
      if (quizData[s]) {
        const semSubjects = quizData[s].subjects.map(subject => ({
          subject,
          semester: s,
          label: `Semester ${s}`
        }));
        allSubjects = [...allSubjects, ...semSubjects];
      }
    }

    res.json({ subjects: allSubjects });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch subjects', error: error.message });
  }
};

// Get quiz for specific subject
exports.getQuiz = async (req, res) => {
  try {
    const { subject } = req.params;

    console.log(`Fetching quiz for Subject: ${subject}`);

    const questions = await generateQuizWithAI(subject);

    if (!questions || questions.length === 0) {
      return res.status(404).json({ message: 'Failed to generate quiz questions' });
    }

    res.json({ questions, subject, generatedBy: 'AI' });
  } catch (error) {
    console.error('Quiz generation error:', error);
    res.status(500).json({ message: 'Failed to generate quiz', error: error.message });
  }
};

// Submit quiz
exports.submitQuiz = async (req, res) => {
  try {
    const { subject, answers, questions } = req.body;

    let score = 0;
    (answers || []).forEach((answer, index) => {
      if (questions && questions[index] && answer === questions[index].correct) score++;
    });

    const quiz = new Quiz({
      subject,
      questions,
      user: req.userId,
      score,
      totalQuestions: questions ? questions.length : 0
    });

    await quiz.save();
    res.json({ score, totalQuestions: questions ? questions.length : 0, percentage: questions && questions.length ? (score / questions.length) * 100 : 0 });
  } catch (error) {
    res.status(500).json({ message: 'Quiz submission failed', error: error.message });
  }
};

// Get user scores
exports.getScores = async (req, res) => {
  try {
    const scores = await Quiz.find({ user: req.userId }).sort({ completedAt: -1 });
    res.json(scores);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch scores', error: error.message });
  }
};