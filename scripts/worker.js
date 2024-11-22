// In the worker.js file

// Listen for the message from the main thread
self.onmessage = function(event) {
    const { start, end, index } = event.data;
  
    // Log the message to confirm the worker received it
    console.log("Message received by worker:", { start, end, index });
  
    // Perform any tasks with the data (e.g., some calculation)
    const result = (end - start) * index;  // Example calculation
  
    // Send the result back to the main thread
    postMessage(result);
  };
  