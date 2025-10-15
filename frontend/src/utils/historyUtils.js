/**
 * Utility functions to manage browser history and prevent back navigation
 */

/**
 * Prevents back navigation by replacing the current history entry
 * This effectively removes the login page from browser history
 */
export const preventBackNavigation = () => {
  // Replace current history entry with the current page
  // This removes the login page from browser history
  window.history.replaceState(null, '', window.location.href);
  
  // Add a new history entry to prevent back button from working
  window.history.pushState(null, '', window.location.href);
  
  // Listen for popstate events and prevent back navigation
  const handlePopState = (event) => {
    // Push the current state again to prevent going back
    window.history.pushState(null, '', window.location.href);
  };
  
  // Add event listener
  window.addEventListener('popstate', handlePopState);
  
  // Return cleanup function
  return () => {
    window.removeEventListener('popstate', handlePopState);
  };
};

/**
 * Clears browser history and prevents back navigation
 * More aggressive approach that completely disables back button
 */
export const clearHistoryAndPreventBack = () => {
  // Clear the entire history stack
  window.history.replaceState(null, '', window.location.href);
  
  // Add multiple history entries to make back navigation ineffective
  for (let i = 0; i < 10; i++) {
    window.history.pushState(null, '', window.location.href);
  }
  
  // Override the back button behavior
  const handlePopState = (event) => {
    // Always push forward to prevent going back
    window.history.pushState(null, '', window.location.href);
  };
  
  window.addEventListener('popstate', handlePopState);
  
  // Return cleanup function
  return () => {
    window.removeEventListener('popstate', handlePopState);
  };
};

/**
 * Disables browser back button completely
 * This is the most aggressive approach
 */
export const disableBackButton = () => {
  // Override the history.back method
  const originalBack = window.history.back;
  window.history.back = () => {
    // Do nothing - effectively disable back button
  };
  
  // Override the history.go method for negative values
  const originalGo = window.history.go;
  window.history.go = (delta) => {
    if (delta < 0) {
      // Prevent going back
      return;
    }
    // Allow going forward
    originalGo.call(window.history, delta);
  };
  
  // Handle popstate events
  const handlePopState = (event) => {
    // Push current state to prevent back navigation
    window.history.pushState(null, '', window.location.href);
  };
  
  window.addEventListener('popstate', handlePopState);
  
  // Return cleanup function to restore original behavior
  return () => {
    window.history.back = originalBack;
    window.history.go = originalGo;
    window.removeEventListener('popstate', handlePopState);
  };
};
