// utils.js

// General Logging Function with Level
export const log = (message, level = 'LOG') => {
    console.log(`[${level}]: ${message}`);
  };
  
  // Error Logging Function
  export const logError = (message) => {
    log(message, 'ERROR');
  };
  
  // Update Progress Function
  export function updateProgress(progressElement, message, isError = false) {
    progressElement.textContent = message;
    progressElement.className = isError ? "progress-error" : "progress-success";
    
    // Optional: If you have a progress bar or want to reset it
    if (!isError) {
      progressElement.style.width = "0%"; // Reset the progress bar width if needed
    }
  }
  