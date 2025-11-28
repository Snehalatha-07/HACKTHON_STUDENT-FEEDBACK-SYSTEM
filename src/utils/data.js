// Data models and utility functions for the feedback system

// Generate unique IDs
export const generateId = () => '_' + Math.random().toString(36).substr(2, 9);

// Sample courses data
export const sampleCourses = [
  { id: '1', name: 'Computer Science 101', instructor: 'Dr. Smith', department: 'Computer Science' },
  { id: '2', name: 'Mathematics 201', instructor: 'Prof. Johnson', department: 'Mathematics' },
  { id: '3', name: 'Physics 150', instructor: 'Dr. Williams', department: 'Physics' },
  { id: '4', name: 'Chemistry 120', instructor: 'Prof. Brown', department: 'Chemistry' }
];

// Sample instructors data
export const sampleInstructors = [
  { id: '1', name: 'Dr. Smith', department: 'Computer Science', email: 'smith@university.edu' },
  { id: '2', name: 'Prof. Johnson', department: 'Mathematics', email: 'johnson@university.edu' },
  { id: '3', name: 'Dr. Williams', department: 'Physics', email: 'williams@university.edu' },
  { id: '4', name: 'Prof. Brown', department: 'Chemistry', email: 'brown@university.edu' }
];

// Question types for feedback forms
export const questionTypes = {
  RATING: 'rating',
  MULTIPLE_CHOICE: 'multiple_choice',
  TEXT: 'text',
  YES_NO: 'yes_no'
};

// Rating scales
export const ratingScales = {
  FIVE_STAR: { min: 1, max: 5, labels: ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'] },
  TEN_POINT: { min: 1, max: 10, labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'] }
};

// Default feedback form templates
export const defaultFormTemplates = {
  course: {
    title: 'Course Evaluation',
    questions: [
      {
        id: generateId(),
        type: questionTypes.RATING,
        question: 'How would you rate the overall quality of this course?',
        scale: ratingScales.FIVE_STAR,
        required: true
      },
      {
        id: generateId(),
        type: questionTypes.RATING,
        question: 'How clear were the course objectives and expectations?',
        scale: ratingScales.FIVE_STAR,
        required: true
      },
      {
        id: generateId(),
        type: questionTypes.RATING,
        question: 'How would you rate the course materials?',
        scale: ratingScales.FIVE_STAR,
        required: true
      },
      {
        id: generateId(),
        type: questionTypes.TEXT,
        question: 'What did you like most about this course?',
        required: false
      },
      {
        id: generateId(),
        type: questionTypes.TEXT,
        question: 'What suggestions do you have for improving this course?',
        required: false
      }
    ]
  },
  instructor: {
    title: 'Instructor Evaluation',
    questions: [
      {
        id: generateId(),
        type: questionTypes.RATING,
        question: 'How would you rate the instructor\'s teaching effectiveness?',
        scale: ratingScales.FIVE_STAR,
        required: true
      },
      {
        id: generateId(),
        type: questionTypes.RATING,
        question: 'How accessible was the instructor for help and questions?',
        scale: ratingScales.FIVE_STAR,
        required: true
      },
      {
        id: generateId(),
        type: questionTypes.RATING,
        question: 'How well did the instructor communicate course material?',
        scale: ratingScales.FIVE_STAR,
        required: true
      },
      {
        id: generateId(),
        type: questionTypes.YES_NO,
        question: 'Would you recommend this instructor to other students?',
        required: true
      },
      {
        id: generateId(),
        type: questionTypes.TEXT,
        question: 'Additional comments about the instructor:',
        required: false
      }
    ]
  }
};

// Utility functions for data management
export const dataUtils = {
  // Calculate average rating
  calculateAverageRating: (responses, questionId) => {
    const ratings = responses
      .map(response => response.answers[questionId])
      .filter(rating => rating !== undefined && rating !== null);
    
    if (ratings.length === 0) return 0;
    return ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
  },

  // Get response distribution for multiple choice or rating questions
  getResponseDistribution: (responses, questionId) => {
    const distribution = {};
    responses.forEach(response => {
      const answer = response.answers[questionId];
      if (answer !== undefined && answer !== null) {
        distribution[answer] = (distribution[answer] || 0) + 1;
      }
    });
    return distribution;
  },

  // Get text responses
  getTextResponses: (responses, questionId) => {
    return responses
      .map(response => response.answers[questionId])
      .filter(answer => answer && answer.trim().length > 0);
  },

  // Calculate completion rate
  calculateCompletionRate: (responses, totalStudents) => {
    return totalStudents > 0 ? (responses.length / totalStudents) * 100 : 0;
  },

  // Get feedback summary
  getFeedbackSummary: (responses, form) => {
    const summary = {
      totalResponses: responses.length,
      questionSummaries: {}
    };

    form.questions.forEach(question => {
      const questionSummary = {
        question: question.question,
        type: question.type
      };

      if (question.type === questionTypes.RATING) {
        questionSummary.averageRating = dataUtils.calculateAverageRating(responses, question.id);
        questionSummary.distribution = dataUtils.getResponseDistribution(responses, question.id);
      } else if (question.type === questionTypes.MULTIPLE_CHOICE || question.type === questionTypes.YES_NO) {
        questionSummary.distribution = dataUtils.getResponseDistribution(responses, question.id);
      } else if (question.type === questionTypes.TEXT) {
        questionSummary.responses = dataUtils.getTextResponses(responses, question.id);
      }

      summary.questionSummaries[question.id] = questionSummary;
    });

    return summary;
  }
};

// Local storage utilities
export const storageUtils = {
  // Save data to localStorage
  saveToStorage: (key, data) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      return false;
    }
  },

  // Load data from localStorage
  loadFromStorage: (key, defaultValue = null) => {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : defaultValue;
    } catch (error) {
      console.error('Error loading from localStorage:', error);
      return defaultValue;
    }
  },

  // Remove data from localStorage
  removeFromStorage: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Error removing from localStorage:', error);
      return false;
    }
  }
};

// Initialize default data if not present
export const initializeDefaultData = () => {
  // Initialize courses if not present
  if (!storageUtils.loadFromStorage('courses')) {
    storageUtils.saveToStorage('courses', sampleCourses);
  }

  // Initialize instructors if not present
  if (!storageUtils.loadFromStorage('instructors')) {
    storageUtils.saveToStorage('instructors', sampleInstructors);
  }

  // Initialize feedback forms if not present
  if (!storageUtils.loadFromStorage('feedbackForms')) {
    // Respect admin-controlled seeding flag. Default to true when flag is missing.
    const shouldSeed = storageUtils.loadFromStorage('seedDemoForms', true);

    if (shouldSeed) {
      // Seed demo forms for each sample course and instructor so students can submit feedback immediately
      const seededForms = [];
      sampleCourses.forEach(course => {
        const template = defaultFormTemplates.course;
        seededForms.push({
          id: generateId(),
          title: `${template.title} - ${course.name}`,
          description: `Please provide feedback for ${course.name}`,
          targetType: 'course',
          targetId: course.id,
          questions: template.questions.map(q => ({ ...q, id: generateId() })),
          createdAt: new Date().toISOString(),
          isActive: true,
          seeded: true
        });
      });

      sampleInstructors.forEach(instr => {
        const template = defaultFormTemplates.instructor;
        seededForms.push({
          id: generateId(),
          title: `${template.title} - ${instr.name}`,
          description: `Please provide feedback for ${instr.name}`,
          targetType: 'instructor',
          targetId: instr.id,
          questions: template.questions.map(q => ({ ...q, id: generateId() })),
          createdAt: new Date().toISOString(),
          isActive: true,
          seeded: true
        });
      });

      storageUtils.saveToStorage('feedbackForms', seededForms);
    } else {
      // Create an empty array so app logic can rely on its existence
      storageUtils.saveToStorage('feedbackForms', []);
    }
  }

  // Initialize feedback responses if not present
  if (!storageUtils.loadFromStorage('feedbackResponses')) {
    storageUtils.saveToStorage('feedbackResponses', []);
  }
};