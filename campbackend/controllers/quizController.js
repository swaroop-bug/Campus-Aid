const { getDb } = require('../config/firebase');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini (expects GEMINI_API_KEY in env)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ─── Department → Semester → Subjects mapping ───

const DEPARTMENTS = {
  CS: {
    name: 'Computer Science',
    semesters: {
      1: ['Research Methodology', 'Advanced Database', 'Modern Compiler Design', 'Social Network Analysis', 'Advanced Computer Networks'],
      2: ['Digital Image Processing', 'Natural Language Processing', 'Human Computer Interaction', 'Bioinformatics', 'Cloud Computing'],
      3: ['Big Data Analysis', 'Blockchain Technology', 'Machine Learning', 'Security Attacks and Counter Measures'],
      4: ['Web Mining', 'Deep Learning']
    }
  },
  IT: {
    name: 'Information Technology',
    semesters: {
      1: ['Digital Image Processing', 'Big Data Analytics', 'Soft Computing', 'Network Security', 'Research Methodology', 'Research Writing'],
      2: ['Machine Learning', 'Computer Vision', 'Cloud Computing', 'Enterprise Security Architecture', 'Microservices Architecture'],
      3: ['Human-Computer Interaction', 'Blockchain Concepts and Techniques', 'Advanced Internet of Things', 'Advances in Machine Learning', 'Computer Forensics'],
      4: ['Natural Language Processing', 'Internship', 'Project']
    }
  },
  DS: {
    name: 'Data Science',
    semesters: {
      1: ['Research Methodology for Data Scientist', 'Statistical Techniques for Data Science', 'Machine Learning: Foundations to Advanced Techniques', 'Data Engineering Concepts'],
      2: ['Modern NLP: Techniques, Tools, and Applications', 'Time Series and Forecasting', 'Data Governance and Compliance', 'Data Visualization and Storytelling']
    }
  },
  MACS: {
    name: 'Mathematics and Computational Sciences',
    semesters: {
      1: ['Linear Algebra', 'Real Analysis', 'Number Theory', 'Research Methodology', 'Probability & Statistics (using R Software)', 'SageMath'],
      2: ['Graph Theory using Sagemath', 'Measure Theory', 'Algebra-I', 'Ordinary Differential Equations (ODE)', 'Python', 'Computational Geometry', 'Topology', 'Combinatorics', 'Integral Transforms and Their Applications'],
      3: ['Complex Analysis', 'Number Theory (Advanced)', 'Numerical Analysis', 'Research Methodology (Advanced)', 'Machine Learning', 'Digital Signal Processing', 'Integral Equations and Calculus of Variations', 'Coding Theory', 'Optimization Techniques'],
      4: ['Functional Analysis', 'Ring and Module Theory', 'Advanced Complex Analysis', 'Differential Geometry', 'Commutative Algebra', 'Operation Research', 'Stochastic Processes', 'Special Functions', 'Artificial Intelligence', 'Data Analytics', 'Cryptography', 'Project']
    }
  }
};

// Generate quiz using Gemini AI
const generateQuizWithAI = async (subject, department) => {
  try {
    const deptName = DEPARTMENTS[department]?.name || 'Masters';
    console.log(`Generating quiz for: ${subject} (${deptName}) using Gemini AI`);

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `Generate exactly 5 multiple choice questions about "${subject}" suitable for Masters-level (postgraduate) students studying ${deptName}. Keep the difficulty appropriate for the subject at graduate level.\n\nIMPORTANT: Return ONLY a valid JSON array with NO markdown, NO code blocks, NO extra text.\n\nFormat:\n[\n  {\n    "question": "What is...",\n    "options": ["Option A", "Option B", "Option C", "Option D"],\n    "correct": 0\n  }\n]\n\nRequirements:\n- Each question must have exactly 4 options\n- The "correct" field must be the index (0-3) of the correct answer\n- Questions should be clear, focused, and educational at Masters level\n- Return ONLY the JSON array, nothing else`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const content = response.text().trim();

    // Strip code fences if returned
    let jsonContent = content;
    if (content.includes('```')) {
      jsonContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    }

    const questions = JSON.parse(jsonContent);

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

// Fallback mock questions
const getMockQuestions = (subject) => {
  const mockQuizzes = {
    // ── CS ──
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
    ],
    // ── IT ──
    'Big Data Analytics': [
      { question: 'What is the primary purpose of Hadoop?', options: ['Web development', 'Distributed storage and processing', 'Mobile apps', 'Security'], correct: 1 },
      { question: 'What is Apache Spark?', options: ['Database', 'In-memory cluster computing framework', 'Web server', 'Compiler'], correct: 1 },
      { question: 'What does batch processing do?', options: ['Real-time analysis', 'Processes large datasets at once', 'Streaming data', 'User interaction'], correct: 1 },
      { question: 'What is data warehouse?', options: ['Raw data storage', 'Structured repository for analysis', 'Backup system', 'Cache'], correct: 1 },
      { question: 'What is NoSQL used for?', options: ['Relational data only', 'Handling unstructured/semi-structured data', 'File compression', 'Networking'], correct: 1 }
    ],
    'Soft Computing': [
      { question: 'What is fuzzy logic?', options: ['Binary logic', 'Logic handling degrees of truth', 'Quantum computing', 'Formal verification'], correct: 1 },
      { question: 'What are genetic algorithms inspired by?', options: ['Physics', 'Biological evolution', 'Chemistry', 'Mathematics'], correct: 1 },
      { question: 'What is a neural network?', options: ['Database system', 'Computing system inspired by brain', 'Network protocol', 'Compiler'], correct: 1 },
      { question: 'What does swarm intelligence simulate?', options: ['Individual behavior', 'Collective behavior of decentralized systems', 'Database queries', 'Memory management'], correct: 1 },
      { question: 'What is a membership function in fuzzy logic?', options: ['Database function', 'Function defining degree of membership', 'Sorting algorithm', 'Encryption key'], correct: 1 }
    ],
    'Network Security': [
      { question: 'What is a firewall used for?', options: ['Data storage', 'Network traffic filtering', 'Code compilation', 'Image processing'], correct: 1 },
      { question: 'What is encryption?', options: ['Data compression', 'Converting data to unreadable form', 'Data deletion', 'Network routing'], correct: 1 },
      { question: 'What is a VPN?', options: ['Virtual Private Network', 'Visual Processing Node', 'Variable Path Network', 'Verified Public Network'], correct: 0 },
      { question: 'What is IDS?', options: ['Internet Data Service', 'Intrusion Detection System', 'Internal Data Storage', 'Integrated Display System'], correct: 1 },
      { question: 'What is PKI?', options: ['Public Key Infrastructure', 'Private Key Index', 'Protocol Key Interface', 'Public Knowledge Integration'], correct: 0 }
    ],
    'Research Writing': [
      { question: 'What is a thesis statement?', options: ['Bibliography entry', 'Central argument of a paper', 'Data table', 'Abstract'], correct: 1 },
      { question: 'What is plagiarism?', options: ['Original work', 'Using others work without credit', 'Peer review', 'Data analysis'], correct: 1 },
      { question: 'What is a citation?', options: ['Chapter heading', 'Reference to source material', 'Topic sentence', 'Footnote only'], correct: 1 },
      { question: 'What is peer review?', options: ['Self-assessment', 'Evaluation by field experts', 'Student grading', 'Automated checking'], correct: 1 },
      { question: 'What is an abstract?', options: ['Full paper', 'Brief summary of research', 'Bibliography', 'Methodology only'], correct: 1 }
    ],
    'Computer Vision': [
      { question: 'What is object detection?', options: ['Finding files', 'Locating objects in images', 'Data mining', 'Network scanning'], correct: 1 },
      { question: 'What is CNN commonly used for?', options: ['Text processing', 'Image classification', 'Database queries', 'Network routing'], correct: 1 },
      { question: 'What is image segmentation?', options: ['Splitting image files', 'Partitioning image into meaningful regions', 'Compression', 'Encryption'], correct: 1 },
      { question: 'What is optical flow?', options: ['Light measurement', 'Pattern of motion between frames', 'Color space', 'Resolution'], correct: 1 },
      { question: 'What does YOLO stand for in CV?', options: ['You Only Look Once', 'Yellow Object Locator Online', 'Yield Output Layer Operation', 'None'], correct: 0 }
    ],
    'Enterprise Security Architecture': [
      { question: 'What is zero trust architecture?', options: ['Trust everything', 'Never trust, always verify', 'Open networks', 'No security'], correct: 1 },
      { question: 'What is IAM?', options: ['Identity and Access Management', 'Internet Application Model', 'Internal Audit Method', 'Intelligent Alert Manager'], correct: 0 },
      { question: 'What is SIEM?', options: ['Software Integration Model', 'Security Information and Event Management', 'System Interface Engine', 'Secure Internet Module'], correct: 1 },
      { question: 'What is data loss prevention?', options: ['Backup only', 'Strategies to prevent unauthorized data transfer', 'Encryption only', 'Firewall only'], correct: 1 },
      { question: 'What is compliance in security?', options: ['Performance optimization', 'Adhering to regulations and standards', 'Network speed', 'Code quality'], correct: 1 }
    ],
    'Microservices Architecture': [
      { question: 'What is a microservice?', options: ['Monolithic app', 'Small independent service', 'Database', 'UI component'], correct: 1 },
      { question: 'What is API Gateway?', options: ['Database connector', 'Entry point for microservices', 'Load balancer only', 'Cache server'], correct: 1 },
      { question: 'What is service discovery?', options: ['Finding bugs', 'Automatically detecting service locations', 'Code review', 'Testing'], correct: 1 },
      { question: 'What is containerization?', options: ['Physical servers', 'Packaging apps with dependencies', 'Database sharding', 'Network segmentation'], correct: 1 },
      { question: 'Which tool is popular for container orchestration?', options: ['Git', 'Kubernetes', 'Jenkins', 'Nginx'], correct: 1 }
    ],
    'Human-Computer Interaction': [
      { question: 'What does usability evaluate?', options: ['Speed only', 'Ease of use and satisfaction', 'Security', 'Memory usage'], correct: 1 },
      { question: 'What is a prototype?', options: ['Final product', 'Early model for testing', 'Database schema', 'Algorithm'], correct: 1 },
      { question: 'Which method gathers user feedback qualitatively?', options: ['A/B testing', 'Surveys', 'Interviews', 'Unit tests'], correct: 2 },
      { question: 'What is affordance?', options: ['Security property', 'Visual cue indicating use', 'Backend API', 'Data model'], correct: 1 },
      { question: 'What is accessibility about?', options: ['Performance', 'Support for disabled users', 'Networking', 'Data storage'], correct: 1 }
    ],
    'Blockchain Concepts and Techniques': [
      { question: 'What is a smart contract?', options: ['Legal paper', 'Self-executing code on blockchain', 'Encryption algorithm', 'Consensus protocol'], correct: 1 },
      { question: 'What is proof of work?', options: ['Employment proof', 'Consensus requiring computational effort', 'Authentication method', 'Encryption standard'], correct: 1 },
      { question: 'What is a hash function in blockchain?', options: ['Encryption key', 'One-way function producing fixed output', 'Database query', 'Sort algorithm'], correct: 1 },
      { question: 'What is immutability in blockchain?', options: ['Data can be changed', 'Data cannot be altered once recorded', 'Data is encrypted', 'Data is compressed'], correct: 1 },
      { question: 'What is a distributed ledger?', options: ['Central database', 'Shared database across nodes', 'File system', 'Cache'], correct: 1 }
    ],
    'Advanced Internet of Things': [
      { question: 'What is IoT?', options: ['Internet of Things', 'Integration of Technology', 'Internal Operations Tool', 'Internet of Transfers'], correct: 0 },
      { question: 'What protocol is common in IoT?', options: ['HTTP only', 'MQTT', 'FTP', 'SMTP'], correct: 1 },
      { question: 'What is edge computing?', options: ['Cloud computing', 'Processing data near source', 'Database management', 'Web development'], correct: 1 },
      { question: 'What is a sensor in IoT?', options: ['Display device', 'Device detecting physical properties', 'Router', 'Server'], correct: 1 },
      { question: 'What is fog computing?', options: ['Cloud alternative', 'Intermediate layer between edge and cloud', 'Database type', 'Network protocol'], correct: 1 }
    ],
    'Advances in Machine Learning': [
      { question: 'What is transfer learning?', options: ['Moving data', 'Using pre-trained model for new task', 'Data transfer', 'Network switching'], correct: 1 },
      { question: 'What is reinforcement learning?', options: ['Supervised learning', 'Learning through rewards and penalties', 'Unsupervised clustering', 'Feature engineering'], correct: 1 },
      { question: 'What is a GAN?', options: ['Graph Analysis Network', 'Generative Adversarial Network', 'General Approximation Node', 'Gradient Accumulation Network'], correct: 1 },
      { question: 'What is attention mechanism?', options: ['Memory management', 'Focusing on relevant parts of input', 'Data filtering', 'Network routing'], correct: 1 },
      { question: 'What is AutoML?', options: ['Manual ML', 'Automated machine learning pipeline', 'ML compiler', 'ML database'], correct: 1 }
    ],
    'Computer Forensics': [
      { question: 'What is digital forensics?', options: ['Web development', 'Investigating digital evidence', 'Data entry', 'Network setup'], correct: 1 },
      { question: 'What is chain of custody?', options: ['Blockchain', 'Documented handling of evidence', 'Network chain', 'Data pipeline'], correct: 1 },
      { question: 'What is steganography?', options: ['Encryption', 'Hiding data within other data', 'Compression', 'Hashing'], correct: 1 },
      { question: 'What is volatile data?', options: ['Permanent storage', 'Data lost when power off', 'Encrypted data', 'Compressed data'], correct: 1 },
      { question: 'What tool is used for disk forensics?', options: ['Photoshop', 'EnCase', 'Excel', 'PowerPoint'], correct: 1 }
    ],
    // ── DS ──
    'Research Methodology for Data Scientist': [
      { question: 'What is the scientific method?', options: ['Random experimentation', 'Systematic observation and testing', 'Data collection only', 'Publishing papers'], correct: 1 },
      { question: 'What is reproducibility?', options: ['Getting different results', 'Ability to replicate findings', 'Data deletion', 'Model training'], correct: 1 },
      { question: 'What is a control group?', options: ['Treatment group', 'Group not receiving treatment for comparison', 'Data analysis group', 'Survey group'], correct: 1 },
      { question: 'What is the p-value?', options: ['Probability of result occurring by chance', 'Power value', 'Prediction value', 'Performance value'], correct: 0 },
      { question: 'What is experimental design?', options: ['UI design', 'Planning research experiments', 'Database design', 'Network design'], correct: 1 }
    ],
    'Statistical Techniques for Data Science': [
      { question: 'What is regression analysis?', options: ['Classification', 'Modeling relationship between variables', 'Clustering', 'Dimensionality reduction'], correct: 1 },
      { question: 'What is a confidence interval?', options: ['Exact value', 'Range likely containing population parameter', 'Standard deviation', 'Mean'], correct: 1 },
      { question: 'What is hypothesis testing?', options: ['Data collection', 'Statistical method to test assumptions', 'Model training', 'Feature selection'], correct: 1 },
      { question: 'What does ANOVA test?', options: ['Correlation', 'Differences between group means', 'Regression', 'Classification'], correct: 1 },
      { question: 'What is Bayesian statistics?', options: ['Frequentist approach', 'Using prior knowledge to update probability', 'Descriptive statistics only', 'Time series only'], correct: 1 }
    ],
    'Machine Learning: Foundations to Advanced Techniques': [
      { question: 'What is feature engineering?', options: ['Building features', 'Creating informative input variables', 'Software engineering', 'Data deletion'], correct: 1 },
      { question: 'What is ensemble learning?', options: ['Single model', 'Combining multiple models', 'Data preprocessing', 'Feature selection'], correct: 1 },
      { question: 'What is regularization?', options: ['Data cleaning', 'Technique to prevent overfitting', 'Model deployment', 'Data collection'], correct: 1 },
      { question: 'What is the bias-variance tradeoff?', options: ['Data quality issue', 'Balance between underfitting and overfitting', 'Hardware issue', 'Network issue'], correct: 1 },
      { question: 'What is random forest?', options: ['Decision tree', 'Ensemble of decision trees', 'Neural network', 'SVM variant'], correct: 1 }
    ],
    'Data Engineering Concepts': [
      { question: 'What is a data pipeline?', options: ['Physical pipe', 'Series of data processing steps', 'Database query', 'API endpoint'], correct: 1 },
      { question: 'What is data ingestion?', options: ['Data deletion', 'Collecting and importing data', 'Data visualization', 'Data encryption'], correct: 1 },
      { question: 'What is schema-on-read?', options: ['Schema applied on write', 'Schema applied when data is read', 'No schema', 'Fixed schema'], correct: 1 },
      { question: 'What is Apache Kafka used for?', options: ['Web hosting', 'Real-time data streaming', 'Image processing', 'Code compilation'], correct: 1 },
      { question: 'What is data partitioning?', options: ['Data deletion', 'Dividing data for efficient processing', 'Data encryption', 'Data backup'], correct: 1 }
    ],
    'Modern NLP: Techniques, Tools, and Applications': [
      { question: 'What is a transformer model?', options: ['RNN variant', 'Architecture using self-attention', 'CNN for text', 'Markov model'], correct: 1 },
      { question: 'What is GPT?', options: ['Graph Processing Tool', 'Generative Pre-trained Transformer', 'General Purpose Technology', 'Guided Pattern Training'], correct: 1 },
      { question: 'What is sentiment analysis?', options: ['Syntax checking', 'Determining emotional tone of text', 'Grammar correction', 'Translation'], correct: 1 },
      { question: 'What is named entity recognition?', options: ['File naming', 'Identifying entities like names/places', 'Database naming', 'Variable naming'], correct: 1 },
      { question: 'What is text summarization?', options: ['Expanding text', 'Creating concise version of text', 'Translating text', 'Encrypting text'], correct: 1 }
    ],
    'Time Series and Forecasting': [
      { question: 'What is a time series?', options: ['Random data', 'Data points ordered by time', 'Cross-sectional data', 'Categorical data'], correct: 1 },
      { question: 'What is ARIMA?', options: ['Neural network', 'AutoRegressive Integrated Moving Average', 'Database model', 'Visualization tool'], correct: 1 },
      { question: 'What is seasonality?', options: ['Random variation', 'Repeating patterns at regular intervals', 'Linear trend', 'Noise'], correct: 1 },
      { question: 'What is stationarity?', options: ['Moving data', 'Statistical properties constant over time', 'Increasing trend', 'Random walk'], correct: 1 },
      { question: 'What is forecasting?', options: ['Historical analysis only', 'Predicting future values', 'Data cleaning', 'Data storage'], correct: 1 }
    ],
    'Data Governance and Compliance': [
      { question: 'What is data governance?', options: ['Data storage', 'Management of data availability and integrity', 'Data deletion', 'Data backup'], correct: 1 },
      { question: 'What is GDPR?', options: ['Database system', 'General Data Protection Regulation', 'Data processing engine', 'Graph database'], correct: 1 },
      { question: 'What is data lineage?', options: ['Data type', 'Tracking data from origin to destination', 'Data encryption', 'Data format'], correct: 1 },
      { question: 'What is data quality?', options: ['Data size', 'Accuracy and completeness of data', 'Data speed', 'Data color'], correct: 1 },
      { question: 'What is data stewardship?', options: ['Data deletion', 'Responsible management of data assets', 'Data compression', 'Data streaming'], correct: 1 }
    ],
    'Data Visualization and Storytelling': [
      { question: 'What is the purpose of data visualization?', options: ['Data storage', 'Communicating insights through visuals', 'Data encryption', 'Data collection'], correct: 1 },
      { question: 'Which tool is popular for visualization?', options: ['Excel only', 'Tableau', 'Notepad', 'Calculator'], correct: 1 },
      { question: 'What is a heat map?', options: ['Temperature chart', 'Color-coded data matrix', 'Bar chart', 'Pie chart'], correct: 1 },
      { question: 'What is data storytelling?', options: ['Fiction writing', 'Narrating data insights with context', 'Data entry', 'Database design'], correct: 1 },
      { question: 'What chart shows distribution?', options: ['Pie chart', 'Histogram', 'Line chart', 'Scatter plot'], correct: 1 }
    ],
    // ── MACS ──
    'Linear Algebra': [
      { question: 'What is an eigenvalue?', options: ['Matrix dimension', 'Scalar associated with eigenvector', 'Determinant', 'Trace'], correct: 1 },
      { question: 'What is a vector space?', options: ['Physical space', 'Set with vector addition and scalar multiplication', 'Database', 'Graph'], correct: 1 },
      { question: 'What is the rank of a matrix?', options: ['Size', 'Maximum number of linearly independent rows/columns', 'Determinant value', 'Trace value'], correct: 1 },
      { question: 'What is an orthogonal matrix?', options: ['Square matrix with inverse equal to transpose', 'Diagonal matrix', 'Zero matrix', 'Identity matrix'], correct: 0 },
      { question: 'What is the null space?', options: ['Empty set', 'Set of vectors mapped to zero by a matrix', 'Range', 'Column space'], correct: 1 }
    ],
    'Real Analysis': [
      { question: 'What is a Cauchy sequence?', options: ['Divergent sequence', 'Sequence where terms get arbitrarily close', 'Periodic sequence', 'Constant sequence'], correct: 1 },
      { question: 'What is a metric space?', options: ['Physical space', 'Set with distance function', 'Vector space', 'Topological order'], correct: 1 },
      { question: 'What is uniform convergence?', options: ['Pointwise convergence', 'Convergence independent of point', 'Divergence', 'Oscillation'], correct: 1 },
      { question: 'What is the Bolzano-Weierstrass theorem about?', options: ['Limits', 'Bounded sequences have convergent subsequences', 'Integration', 'Differentiation'], correct: 1 },
      { question: 'What is a compact set?', options: ['Open set', 'Closed and bounded set in R^n', 'Infinite set', 'Empty set'], correct: 1 }
    ],
    'Number Theory': [
      { question: 'What is a prime number?', options: ['Divisible by many', 'Only divisible by 1 and itself', 'Even number', 'Negative number'], correct: 1 },
      { question: 'What does the GCD compute?', options: ['Least common multiple', 'Greatest common divisor', 'Prime factorization', 'Modular inverse'], correct: 1 },
      { question: 'What is modular arithmetic?', options: ['Regular arithmetic', 'Arithmetic with remainders', 'Matrix arithmetic', 'Complex arithmetic'], correct: 1 },
      { question: 'What is Euler totient function?', options: ['Prime counting', 'Count of integers coprime to n', 'Factorial function', 'Fibonacci function'], correct: 1 },
      { question: 'What is Fermat Little Theorem about?', options: ['Geometry', 'Property of powers modulo prime', 'Calculus', 'Statistics'], correct: 1 }
    ],
    'Probability & Statistics (using R Software)': [
      { question: 'What is R primarily used for?', options: ['Web development', 'Statistical computing and graphics', 'Mobile apps', 'Game development'], correct: 1 },
      { question: 'What is a probability distribution?', options: ['Data table', 'Function describing likelihood of outcomes', 'Graph type', 'Database'], correct: 1 },
      { question: 'What is the central limit theorem?', options: ['Sampling theorem', 'Sample means approximate normal distribution', 'Regression theorem', 'Classification theorem'], correct: 1 },
      { question: 'What is standard deviation?', options: ['Mean', 'Measure of data spread', 'Median', 'Mode'], correct: 1 },
      { question: 'What function creates a vector in R?', options: ['vector()', 'c()', 'list()', 'array()'], correct: 1 }
    ],
    'SageMath': [
      { question: 'What is SageMath?', options: ['Web framework', 'Open-source mathematics software', 'Database', 'Operating system'], correct: 1 },
      { question: 'SageMath is built on top of which language?', options: ['Java', 'Python', 'C++', 'Ruby'], correct: 1 },
      { question: 'What can SageMath compute?', options: ['Only arithmetic', 'Algebra, calculus, number theory and more', 'Only graphs', 'Only statistics'], correct: 1 },
      { question: 'What is a symbolic expression in SageMath?', options: ['String', 'Mathematical expression manipulated symbolically', 'Number', 'List'], correct: 1 },
      { question: 'SageMath can plot graphs.', options: ['True', 'False', 'Only 2D', 'Only 3D'], correct: 0 }
    ],
    'Graph Theory using Sagemath': [
      { question: 'What is a graph in graph theory?', options: ['Chart', 'Set of vertices and edges', 'Database', 'Function'], correct: 1 },
      { question: 'What is a Hamiltonian path?', options: ['Shortest path', 'Path visiting every vertex exactly once', 'Eulerian path', 'Random walk'], correct: 1 },
      { question: 'What is graph coloring?', options: ['Drawing', 'Assigning colors to vertices with constraints', 'Painting', 'Shading'], correct: 1 },
      { question: 'What is a planar graph?', options: ['3D graph', 'Graph drawable without edge crossings', 'Complete graph', 'Bipartite graph'], correct: 1 },
      { question: 'What is the chromatic number?', options: ['Number of edges', 'Minimum colors needed to color graph', 'Number of vertices', 'Degree'], correct: 1 }
    ],
    'Measure Theory': [
      { question: 'What is a sigma-algebra?', options: ['Algebraic structure', 'Collection of sets closed under countable operations', 'Matrix algebra', 'Group theory concept'], correct: 1 },
      { question: 'What is the Lebesgue measure?', options: ['Length generalization', 'Standard way to assign measure to subsets of R^n', 'Volume formula', 'Area formula'], correct: 1 },
      { question: 'What is a measurable function?', options: ['Continuous function', 'Function compatible with sigma-algebras', 'Linear function', 'Polynomial function'], correct: 1 },
      { question: 'What is the Lebesgue integral?', options: ['Riemann integral', 'Generalization of Riemann integral', 'Improper integral', 'Line integral'], correct: 1 },
      { question: 'What is a null set?', options: ['Empty set', 'Set with measure zero', 'Infinite set', 'Open set'], correct: 1 }
    ],
    'Algebra-I': [
      { question: 'What is a group?', options: ['Set with addition only', 'Set with operation satisfying closure, associativity, identity, inverse', 'Database', 'Graph'], correct: 1 },
      { question: 'What is an abelian group?', options: ['Non-commutative group', 'Commutative group', 'Infinite group', 'Finite group only'], correct: 1 },
      { question: 'What is a subgroup?', options: ['Superset', 'Subset that is also a group', 'Empty set', 'Quotient'], correct: 1 },
      { question: 'What is Lagrange theorem about?', options: ['Calculus', 'Order of subgroup divides order of group', 'Number theory', 'Topology'], correct: 1 },
      { question: 'What is a homomorphism?', options: ['Bijection', 'Structure-preserving map between groups', 'Isometry', 'Projection'], correct: 1 }
    ],
    'Ordinary Differential Equations (ODE)': [
      { question: 'What is an ODE?', options: ['Partial differential equation', 'Equation with derivatives of one variable', 'Algebraic equation', 'Integral equation'], correct: 1 },
      { question: 'What is the order of an ODE?', options: ['Number of terms', 'Highest derivative order', 'Number of variables', 'Degree'], correct: 1 },
      { question: 'What is a linear ODE?', options: ['Nonlinear equation', 'ODE linear in unknown function and its derivatives', 'Polynomial equation', 'Algebraic equation'], correct: 1 },
      { question: 'What is an initial value problem?', options: ['Boundary value problem', 'ODE with conditions at a single point', 'Optimization problem', 'Eigenvalue problem'], correct: 1 },
      { question: 'What method solves first-order linear ODEs?', options: ['Euler method only', 'Integrating factor method', 'Fourier transform', 'Laplace only'], correct: 1 }
    ],
    'Python': [
      { question: 'What type is Python?', options: ['Compiled only', 'Interpreted high-level language', 'Assembly', 'Hardware description'], correct: 1 },
      { question: 'What is a list in Python?', options: ['Immutable sequence', 'Mutable ordered sequence', 'Dictionary', 'Set'], correct: 1 },
      { question: 'What is NumPy used for?', options: ['Web development', 'Numerical computing with arrays', 'Database access', 'GUI development'], correct: 1 },
      { question: 'What is a lambda function?', options: ['Named function', 'Anonymous inline function', 'Class method', 'Module'], correct: 1 },
      { question: 'What does pip do?', options: ['Compile code', 'Install Python packages', 'Debug code', 'Format code'], correct: 1 }
    ],
    'Computational Geometry': [
      { question: 'What is a convex hull?', options: ['Concave shape', 'Smallest convex set containing points', 'Random polygon', 'Circle'], correct: 1 },
      { question: 'What is Voronoi diagram?', options: ['Bar chart', 'Partition of plane based on distance to points', 'Network diagram', 'Flow chart'], correct: 1 },
      { question: 'What is Delaunay triangulation?', options: ['Random triangulation', 'Triangulation maximizing minimum angle', 'Square grid', 'Hexagonal grid'], correct: 1 },
      { question: 'What is line sweep algorithm?', options: ['Sorting algorithm', 'Processing geometric objects by sweeping a line', 'Graph algorithm', 'Tree traversal'], correct: 1 },
      { question: 'What is point-in-polygon test?', options: ['Drawing points', 'Determining if point is inside polygon', 'Creating polygons', 'Measuring area'], correct: 1 }
    ],
    'Topology': [
      { question: 'What is a topological space?', options: ['Metric space only', 'Set with collection of open sets', 'Vector space', 'Group'], correct: 1 },
      { question: 'What is a homeomorphism?', options: ['Group homomorphism', 'Continuous bijection with continuous inverse', 'Isometry', 'Linear map'], correct: 1 },
      { question: 'What is a connected space?', options: ['Disconnected space', 'Space that cannot be split into two open sets', 'Finite space', 'Compact space'], correct: 1 },
      { question: 'What is the Hausdorff property?', options: ['Compactness', 'Distinct points have disjoint neighborhoods', 'Connectedness', 'Continuity'], correct: 1 },
      { question: 'What is a basis for a topology?', options: ['Vector basis', 'Collection generating all open sets', 'Matrix basis', 'Number basis'], correct: 1 }
    ],
    'Combinatorics': [
      { question: 'What is a permutation?', options: ['Combination', 'Ordered arrangement of objects', 'Partition', 'Selection'], correct: 1 },
      { question: 'What is the pigeonhole principle?', options: ['Sorting', 'If n+1 objects in n boxes, one box has at least 2', 'Counting', 'Probability'], correct: 1 },
      { question: 'What is a generating function?', options: ['Random function', 'Formal power series encoding a sequence', 'Polynomial ring', 'Matrix function'], correct: 1 },
      { question: 'What is inclusion-exclusion principle?', options: ['Counting without overlap', 'Formula to count union of sets', 'Exclusion only', 'Inclusion only'], correct: 1 },
      { question: 'What is a partition of an integer?', options: ['Division', 'Way to write integer as sum of positive integers', 'Factorization', 'Modular form'], correct: 1 }
    ],
    'Integral Transforms and Their Applications': [
      { question: 'What is the Laplace transform?', options: ['Fourier transform', 'Integral transform for differential equations', 'Z-transform', 'Wavelet transform'], correct: 1 },
      { question: 'What is the Fourier transform?', options: ['Time domain only', 'Decomposes function into frequency components', 'Space transform', 'Number transform'], correct: 1 },
      { question: 'What is the inverse Laplace transform?', options: ['Forward transform', 'Converting from s-domain back to time domain', 'Fourier series', 'Z-transform'], correct: 1 },
      { question: 'What is a convolution?', options: ['Addition', 'Mathematical operation combining two functions', 'Subtraction', 'Division'], correct: 1 },
      { question: 'Where is Laplace transform commonly used?', options: ['Web development', 'Solving differential equations and control systems', 'Database queries', 'Graphics'], correct: 1 }
    ],
    'Complex Analysis': [
      { question: 'What is an analytic function?', options: ['Discontinuous function', 'Complex differentiable function', 'Real function only', 'Polynomial only'], correct: 1 },
      { question: 'What are Cauchy-Riemann equations?', options: ['Algebraic equations', 'Conditions for complex differentiability', 'ODE system', 'Matrix equations'], correct: 1 },
      { question: 'What is a singularity?', options: ['Regular point', 'Point where function is not analytic', 'Zero', 'Maximum'], correct: 1 },
      { question: 'What is the residue theorem?', options: ['Integration theorem', 'Evaluates contour integrals using residues', 'Algebra theorem', 'Number theory result'], correct: 1 },
      { question: 'What is a Laurent series?', options: ['Taylor series', 'Series with negative and positive powers', 'Fourier series', 'Power series only'], correct: 1 }
    ],
    'Numerical Analysis': [
      { question: 'What is numerical interpolation?', options: ['Extrapolation', 'Estimating values between known data points', 'Integration', 'Differentiation'], correct: 1 },
      { question: 'What is Newton-Raphson method?', options: ['Integration method', 'Root-finding iterative method', 'Sorting algorithm', 'Matrix method'], correct: 1 },
      { question: 'What is numerical integration?', options: ['Symbolic integration', 'Approximate computation of integrals', 'Differentiation', 'Interpolation'], correct: 1 },
      { question: 'What is truncation error?', options: ['Rounding error', 'Error from approximating infinite process', 'Systematic error', 'Random error'], correct: 1 },
      { question: 'What is Gaussian elimination?', options: ['Integration method', 'Method for solving linear systems', 'Root finding', 'Interpolation'], correct: 1 }
    ],
    'Functional Analysis': [
      { question: 'What is a Banach space?', options: ['Incomplete space', 'Complete normed vector space', 'Finite space', 'Discrete space'], correct: 1 },
      { question: 'What is a Hilbert space?', options: ['Banach space', 'Complete inner product space', 'Topological space', 'Metric space only'], correct: 1 },
      { question: 'What is a bounded linear operator?', options: ['Unbounded operator', 'Linear map with bounded norm', 'Nonlinear operator', 'Compact operator only'], correct: 1 },
      { question: 'What is the Hahn-Banach theorem about?', options: ['Integration', 'Extension of linear functionals', 'Differentiation', 'Eigenvalues'], correct: 1 },
      { question: 'What is the dual space?', options: ['Same space', 'Space of continuous linear functionals', 'Subspace', 'Quotient space'], correct: 1 }
    ],
    'Cryptography': [
      { question: 'What is symmetric encryption?', options: ['Different keys for encrypt/decrypt', 'Same key for encrypt and decrypt', 'No key needed', 'Hash function'], correct: 1 },
      { question: 'What is RSA?', options: ['Symmetric algorithm', 'Asymmetric public-key algorithm', 'Hash function', 'Encoding scheme'], correct: 1 },
      { question: 'What is a hash function in cryptography?', options: ['Encryption', 'One-way function producing fixed-size output', 'Decryption', 'Key exchange'], correct: 1 },
      { question: 'What is AES?', options: ['Asymmetric encryption', 'Advanced Encryption Standard (symmetric)', 'Hash algorithm', 'Key exchange protocol'], correct: 1 },
      { question: 'What is a digital signature?', options: ['Physical signature', 'Cryptographic verification of authenticity', 'Password', 'Username'], correct: 1 }
    ],
    'Artificial Intelligence': [
      { question: 'What is heuristic search?', options: ['Random search', 'Search using rules of thumb to find solutions', 'Exhaustive search', 'No search'], correct: 1 },
      { question: 'What is a knowledge base?', options: ['Database', 'Structured collection of facts and rules', 'File system', 'Cache'], correct: 1 },
      { question: 'What is the Turing test?', options: ['Programming test', 'Test of machine intelligence', 'Math exam', 'Speed test'], correct: 1 },
      { question: 'What is a decision tree?', options: ['Random forest', 'Tree-structured model for decisions', 'Neural network', 'Graph database'], correct: 1 },
      { question: 'What is natural language understanding?', options: ['Translation only', 'Machine comprehension of human language', 'Speech synthesis', 'Text formatting'], correct: 1 }
    ],
  };

  return mockQuizzes[subject] || [
    { question: `What is ${subject} primarily concerned with?`, options: ['Theory and concepts', 'Practical applications', 'Both theory and practice', 'Neither'], correct: 2 },
    { question: `Which skill is most important for studying ${subject}?`, options: ['Problem solving', 'Memorization', 'Drawing', 'Typing'], correct: 0 },
    { question: `${subject} is typically studied at what level?`, options: ['Primary school', 'High school', 'Undergraduate', 'Postgraduate'], correct: 3 },
    { question: `What is a key learning outcome of ${subject}?`, options: ['Deep understanding of core concepts', 'Speed reading', 'Handwriting', 'Foreign languages'], correct: 0 },
    { question: `How is ${subject} typically assessed?`, options: ['Written exams and assignments', 'Physical tests', 'Art projects', 'Cooking'], correct: 0 }
  ];
};

// Get available subjects
exports.getSubjects = async (req, res) => {
  try {
    const department = req.query.department || 'CS';
    const deptData = DEPARTMENTS[department];

    if (!deptData) {
      return res.status(400).json({ message: `Unknown department: ${department}. Valid: CS, IT, DS, MACS` });
    }

    let allSubjects = [];
    const semesters = Object.keys(deptData.semesters);
    for (const sem of semesters) {
      const semSubjects = deptData.semesters[sem].map(subject => ({
        subject,
        semester: parseInt(sem),
        label: `Semester ${sem}`
      }));
      allSubjects = [...allSubjects, ...semSubjects];
    }
    res.json({ subjects: allSubjects, department, departmentName: deptData.name });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch subjects', error: error.message });
  }
};

// Get quiz for specific subject
exports.getQuiz = async (req, res) => {
  try {
    const { subject } = req.params;
    const department = req.query.department || 'CS';
    console.log(`Fetching quiz for Subject: ${subject} (Dept: ${department})`);

    const questions = await generateQuizWithAI(subject, department);

    if (!questions || questions.length === 0) {
      return res.status(404).json({ message: 'Failed to generate quiz questions' });
    }

    res.json({ questions, subject, department, generatedBy: 'AI' });
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

    const db = getDb();
    await db.collection('quizzes').add({
      subject,
      questions,
      user: req.userId,
      score,
      totalQuestions: questions ? questions.length : 0,
      completedAt: new Date().toISOString(),
    });

    res.json({
      score,
      totalQuestions: questions ? questions.length : 0,
      percentage: questions && questions.length ? (score / questions.length) * 100 : 0,
    });
  } catch (error) {
    res.status(500).json({ message: 'Quiz submission failed', error: error.message });
  }
};

// Get user scores
exports.getScores = async (req, res) => {
  try {
    const db = getDb();
    const snapshot = await db
      .collection('quizzes')
      .where('user', '==', req.userId)
      .orderBy('completedAt', 'desc')
      .get();
    const scores = snapshot.docs.map(doc => ({ _id: doc.id, ...doc.data() }));
    res.json(scores);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch scores', error: error.message });
  }
};

// Export DEPARTMENTS for use in other modules
exports.DEPARTMENTS = DEPARTMENTS;