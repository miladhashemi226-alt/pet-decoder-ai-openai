
/**
 * Comprehensive validation utilities
 */

// File validation constants
export const MAX_FILE_SIZE_MB = 100;
export const MIN_VIDEO_DURATION_SECONDS = 1;
export const MAX_VIDEO_DURATION_SECONDS = 120; // 2 minutes

// File validation
export const isValidFileType = (file, allowedTypes = ['image/', 'video/']) => {
  if (!file || !file.type) return false;
  return allowedTypes.some(type => file.type.startsWith(type));
};

export const isValidFileSize = (file, maxSizeMB = MAX_FILE_SIZE_MB) => {
  if (!file || !file.size) return false;
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
};

export const getVideoDuration = (file) => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.muted = true;
    video.playsInline = true;

    const cleanup = () => {
      URL.revokeObjectURL(video.src);
      video.src = '';
    };

    video.onloadedmetadata = () => {
      cleanup();
      resolve(video.duration);
    };

    video.onerror = () => {
      cleanup();
      reject(new Error('Failed to load video metadata'));
    };

    try {
      video.src = URL.createObjectURL(file);
    } catch (error) {
      cleanup();
      reject(error);
    }
  });
};

// String sanitization
export const sanitizeString = (str, maxLength = 1000) => {
  if (!str) return '';
  
  // Remove null bytes
  let sanitized = str.replace(/\0/g, '');
  
  // Trim whitespace
  sanitized = sanitized.trim();
  
  // Limit length
  if (maxLength && sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength);
  }
  
  // Remove potentially dangerous HTML/script tags (basic XSS prevention)
  sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  sanitized = sanitized.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '');
  
  return sanitized;
};

// Email validation
export const isValidEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
};

// Pet profile validation
export const validatePetProfile = (petData) => {
  const errors = {};
  
  if (!petData.name || petData.name.trim().length === 0) {
    errors.name = "Pet name is required";
  } else if (petData.name.length > 50) {
    errors.name = "Pet name must be less than 50 characters";
  }
  
  if (!petData.species) {
    errors.species = "Species is required";
  } else if (!['dog', 'cat', 'other'].includes(petData.species)) {
    errors.species = "Invalid species";
  }
  
  if (petData.breed && petData.breed.length > 100) {
    errors.breed = "Breed name must be less than 100 characters";
  }
  
  if (petData.birthday) {
    const birthDate = new Date(petData.birthday);
    const today = new Date();
    
    if (isNaN(birthDate.getTime())) {
      errors.birthday = "Invalid date format";
    } else if (birthDate > today) {
      errors.birthday = "Birthday cannot be in the future";
    } else if (birthDate < new Date('1900-01-01')) {
      errors.birthday = "Birthday is too far in the past";
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Activity log validation
export const validateActivityLog = (activityData) => {
  const errors = {};
  
  if (!activityData.pet_id) {
    errors.pet_id = "Pet selection is required";
  }
  
  if (!activityData.activity_type) {
    errors.activity_type = "Activity type is required";
  } else if (!['feeding', 'walk', 'play', 'sleep', 'grooming', 'medication', 'vet', 'other'].includes(activityData.activity_type)) {
    errors.activity_type = "Invalid activity type";
  }
  
  if (activityData.duration !== '' && activityData.duration !== null && activityData.duration !== undefined) {
    const duration = Number(activityData.duration);
    if (isNaN(duration)) {
      errors.duration = "Duration must be a number";
    } else if (duration < 0) {
      errors.duration = "Duration cannot be negative";
    } else if (duration > 1440) {
      errors.duration = "Duration cannot exceed 24 hours (1440 minutes)";
    }
  }
  
  if (activityData.notes && activityData.notes.length > 500) {
    errors.notes = "Notes must be less than 500 characters";
  }
  
  if (!activityData.date) {
    errors.date = "Date is required";
  } else {
    const activityDate = new Date(activityData.date);
    const today = new Date();
    today.setHours(23, 59, 59, 999); // End of today
    
    if (isNaN(activityDate.getTime())) {
      errors.date = "Invalid date format";
    } else if (activityDate > today) {
      errors.date = "Activity date cannot be in the future";
    } else if (activityDate < new Date('2020-01-01')) {
      errors.date = "Activity date is too far in the past";
    }
  }
  
  if (activityData.mood && !['happy', 'playful', 'neutral', 'tired', 'anxious', 'aggressive'].includes(activityData.mood)) {
    errors.mood = "Invalid mood selection";
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Contact form validation
export const validateContactForm = (formData) => {
  const errors = {};
  
  if (!formData.name || formData.name.trim().length === 0) {
    errors.name = "Name is required";
  } else if (formData.name.length > 100) {
    errors.name = "Name must be less than 100 characters";
  }
  
  if (!formData.email || !isValidEmail(formData.email)) {
    errors.email = "Valid email is required";
  }
  
  if (!formData.subject || formData.subject.trim().length === 0) {
    errors.subject = "Subject is required";
  } else if (formData.subject.length > 200) {
    errors.subject = "Subject must be less than 200 characters";
  }
  
  if (!formData.message || formData.message.trim().length === 0) {
    errors.message = "Message is required";
  } else if (formData.message.length < 10) {
    errors.message = "Message must be at least 10 characters";
  } else if (formData.message.length > 2000) {
    errors.message = "Message must be less than 2000 characters";
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Vaccine record validation
export const validateVaccineRecord = (vaccineData) => {
  const errors = {};
  
  if (!vaccineData.pet_id) {
    errors.pet_id = "Pet selection is required";
  }
  
  if (!vaccineData.vaccine_name) {
    errors.vaccine_name = "Vaccine name is required";
  }
  
  if (!vaccineData.date_administered) {
    errors.date_administered = "Administration date is required";
  } else {
    const adminDate = new Date(vaccineData.date_administered);
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    
    if (isNaN(adminDate.getTime())) {
      errors.date_administered = "Invalid date format";
    } else if (adminDate > today) {
      errors.date_administered = "Administration date cannot be in the future";
    }
  }
  
  if (vaccineData.next_due_date) {
    const dueDate = new Date(vaccineData.next_due_date);
    const adminDate = new Date(vaccineData.date_administered);
    
    if (isNaN(dueDate.getTime())) {
      errors.next_due_date = "Invalid date format";
    } else if (vaccineData.date_administered && dueDate <= adminDate) {
      errors.next_due_date = "Due date must be after administration date";
    }
  }
  
  if (vaccineData.veterinarian && vaccineData.veterinarian.length > 100) {
    errors.veterinarian = "Veterinarian name must be less than 100 characters";
  }
  
  if (vaccineData.clinic_name && vaccineData.clinic_name.length > 200) {
    errors.clinic_name = "Clinic name must be less than 200 characters";
  }
  
  if (vaccineData.notes && vaccineData.notes.length > 500) {
    errors.notes = "Notes must be less than 500 characters";
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// URL validation
export const isValidURL = (url) => {
  if (!url || typeof url !== 'string') return false;
  
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
};

// Date helpers
export const isValidDate = (dateString) => {
  if (!dateString) return false;
  const date = new Date(dateString);
  return !isNaN(date.getTime());
};

export const isFutureDate = (dateString) => {
  if (!isValidDate(dateString)) return false;
  return new Date(dateString) > new Date();
};

export const isPastDate = (dateString) => {
  if (!isValidDate(dateString)) return false;
  return new Date(dateString) < new Date();
};
