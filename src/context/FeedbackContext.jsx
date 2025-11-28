import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { initializeDefaultData, storageUtils, generateId } from '../utils/data.js';

// Initial state
const initialState = {
  user: null, // { id, name, role: 'admin' | 'student' }
  courses: [],
  instructors: [],
  feedbackForms: [],
  feedbackResponses: [],
  currentForm: null,
  loading: false,
  error: null
};

// Action types
const actionTypes = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_USER: 'SET_USER',
  LOAD_DATA: 'LOAD_DATA',
  ADD_FEEDBACK_FORM: 'ADD_FEEDBACK_FORM',
  UPDATE_FEEDBACK_FORM: 'UPDATE_FEEDBACK_FORM',
  DELETE_FEEDBACK_FORM: 'DELETE_FEEDBACK_FORM',
  SUBMIT_FEEDBACK_RESPONSE: 'SUBMIT_FEEDBACK_RESPONSE',
  SET_CURRENT_FORM: 'SET_CURRENT_FORM',
  ADD_COURSE: 'ADD_COURSE',
  UPDATE_COURSE: 'UPDATE_COURSE',
  DELETE_COURSE: 'DELETE_COURSE',
  ADD_INSTRUCTOR: 'ADD_INSTRUCTOR',
  UPDATE_INSTRUCTOR: 'UPDATE_INSTRUCTOR',
  DELETE_INSTRUCTOR: 'DELETE_INSTRUCTOR'
};

// Reducer function
const feedbackReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.SET_LOADING:
      return { ...state, loading: action.payload };
    
    case actionTypes.SET_ERROR:
      return { ...state, error: action.payload, loading: false };
    
    case actionTypes.SET_USER:
      return { ...state, user: action.payload };
    
    case actionTypes.LOAD_DATA:
      return {
        ...state,
        courses: action.payload.courses,
        instructors: action.payload.instructors,
        feedbackForms: action.payload.feedbackForms,
        feedbackResponses: action.payload.feedbackResponses,
        loading: false
      };
    
    case actionTypes.ADD_FEEDBACK_FORM:
      const newForms = [...state.feedbackForms, action.payload];
      storageUtils.saveToStorage('feedbackForms', newForms);
      return { ...state, feedbackForms: newForms };
    
    case actionTypes.UPDATE_FEEDBACK_FORM:
      const updatedForms = state.feedbackForms.map(form =>
        form.id === action.payload.id ? action.payload : form
      );
      storageUtils.saveToStorage('feedbackForms', updatedForms);
      return { ...state, feedbackForms: updatedForms };
    
    case actionTypes.DELETE_FEEDBACK_FORM:
      const filteredForms = state.feedbackForms.filter(form => form.id !== action.payload);
      storageUtils.saveToStorage('feedbackForms', filteredForms);
      return { ...state, feedbackForms: filteredForms };
    
    case actionTypes.SUBMIT_FEEDBACK_RESPONSE:
      const newResponses = [...state.feedbackResponses, action.payload];
      storageUtils.saveToStorage('feedbackResponses', newResponses);
      return { ...state, feedbackResponses: newResponses };
    
    case actionTypes.SET_CURRENT_FORM:
      return { ...state, currentForm: action.payload };
    
    case actionTypes.ADD_COURSE:
      const newCourses = [...state.courses, action.payload];
      storageUtils.saveToStorage('courses', newCourses);
      return { ...state, courses: newCourses };
    
    case actionTypes.UPDATE_COURSE:
      const updatedCourses = state.courses.map(course =>
        course.id === action.payload.id ? action.payload : course
      );
      storageUtils.saveToStorage('courses', updatedCourses);
      return { ...state, courses: updatedCourses };
    
    case actionTypes.DELETE_COURSE:
      const filteredCourses = state.courses.filter(course => course.id !== action.payload);
      storageUtils.saveToStorage('courses', filteredCourses);
      return { ...state, courses: filteredCourses };
    
    case actionTypes.ADD_INSTRUCTOR:
      const newInstructors = [...state.instructors, action.payload];
      storageUtils.saveToStorage('instructors', newInstructors);
      return { ...state, instructors: newInstructors };
    
    case actionTypes.UPDATE_INSTRUCTOR:
      const updatedInstructors = state.instructors.map(instructor =>
        instructor.id === action.payload.id ? action.payload : instructor
      );
      storageUtils.saveToStorage('instructors', updatedInstructors);
      return { ...state, instructors: updatedInstructors };
    
    case actionTypes.DELETE_INSTRUCTOR:
      const filteredInstructors = state.instructors.filter(instructor => instructor.id !== action.payload);
      storageUtils.saveToStorage('instructors', filteredInstructors);
      return { ...state, instructors: filteredInstructors };
    
    default:
      return state;
  }
};

// Create context
const FeedbackContext = createContext();

// Context provider component
export const FeedbackProvider = ({ children }) => {
  const [state, dispatch] = useReducer(feedbackReducer, initialState);

  // Initialize data on mount
  useEffect(() => {
    initializeDefaultData();
    // Load persisted user if available
    const persistedUser = storageUtils.loadFromStorage('user', null);
    if (persistedUser) {
      dispatch({ type: actionTypes.SET_USER, payload: persistedUser });
    }
    loadData();
  }, []);

  // Action creators
  const actions = {
    setLoading: (loading) => dispatch({ type: actionTypes.SET_LOADING, payload: loading }),
    
    setError: (error) => dispatch({ type: actionTypes.SET_ERROR, payload: error }),
    
    // setUser accepts either a user object or an object with a _persist flag: { ...user, _persist: true }
    setUser: (user) => {
      if (!user) {
        storageUtils.removeFromStorage('user');
        dispatch({ type: actionTypes.SET_USER, payload: null });
        return;
      }

      // If caller included a temporary _persist flag, persist to storage
      const { _persist, ...userData } = user;
      if (_persist) {
        storageUtils.saveToStorage('user', userData);
      }
      dispatch({ type: actionTypes.SET_USER, payload: userData });
    },
    
    loadData: () => {
      try {
        const courses = storageUtils.loadFromStorage('courses', []);
        const instructors = storageUtils.loadFromStorage('instructors', []);
        const feedbackForms = storageUtils.loadFromStorage('feedbackForms', []);
        const feedbackResponses = storageUtils.loadFromStorage('feedbackResponses', []);
        
        dispatch({
          type: actionTypes.LOAD_DATA,
          payload: { courses, instructors, feedbackForms, feedbackResponses }
        });
      } catch (error) {
        dispatch({ type: actionTypes.SET_ERROR, payload: 'Failed to load data' });
      }
    },
    
    addFeedbackForm: (formData) => {
      const newForm = {
        id: generateId(),
        ...formData,
        createdAt: new Date().toISOString(),
        isActive: true
      };
      dispatch({ type: actionTypes.ADD_FEEDBACK_FORM, payload: newForm });
      return newForm;
    },
    
    updateFeedbackForm: (formData) => {
      dispatch({ type: actionTypes.UPDATE_FEEDBACK_FORM, payload: formData });
    },
    
    deleteFeedbackForm: (formId) => {
      dispatch({ type: actionTypes.DELETE_FEEDBACK_FORM, payload: formId });
    },
    
    submitFeedbackResponse: (responseData) => {
      const newResponse = {
        id: generateId(),
        ...responseData,
        submittedAt: new Date().toISOString()
      };
      dispatch({ type: actionTypes.SUBMIT_FEEDBACK_RESPONSE, payload: newResponse });
      return newResponse;
    },
    
    setCurrentForm: (form) => {
      dispatch({ type: actionTypes.SET_CURRENT_FORM, payload: form });
    },
    
    addCourse: (courseData) => {
      const newCourse = {
        id: generateId(),
        ...courseData
      };
      dispatch({ type: actionTypes.ADD_COURSE, payload: newCourse });
      return newCourse;
    },
    
    updateCourse: (courseData) => {
      dispatch({ type: actionTypes.UPDATE_COURSE, payload: courseData });
    },
    
    deleteCourse: (courseId) => {
      dispatch({ type: actionTypes.DELETE_COURSE, payload: courseId });
    },
    
    addInstructor: (instructorData) => {
      const newInstructor = {
        id: generateId(),
        ...instructorData
      };
      dispatch({ type: actionTypes.ADD_INSTRUCTOR, payload: newInstructor });
      return newInstructor;
    },
    
    updateInstructor: (instructorData) => {
      dispatch({ type: actionTypes.UPDATE_INSTRUCTOR, payload: instructorData });
    },
    
    deleteInstructor: (instructorId) => {
      dispatch({ type: actionTypes.DELETE_INSTRUCTOR, payload: instructorId });
    }
  };

  const loadData = actions.loadData;

  return (
    <FeedbackContext.Provider value={{ ...state, ...actions }}>
      {children}
    </FeedbackContext.Provider>
  );
};

// Custom hook to use the feedback context
export const useFeedback = () => {
  const context = useContext(FeedbackContext);
  if (!context) {
    throw new Error('useFeedback must be used within a FeedbackProvider');
  }
  return context;
};

export default FeedbackContext;