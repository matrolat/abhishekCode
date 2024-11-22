import { calculatePrimesInRange } from "./prime-calculator.js";

onmessage = function (e) {
  const { start, end, index } = e.data;

  // Logging the received data
  // console.log(`Worker ${index + 1} received range: start=${start}, end=${end}`);

  // Validate range input before processing
  if (isNaN(start) || isNaN(end) || start < 1 || end < 1 || start > end) {
    postMessage({ error: "Invalid range values received." });
    return;
  }

  try {
    // Attempt to calculate primes
    const primes = calculatePrimesInRange(start, end);
    postMessage({ result: primes }); // Send results back to main thread
  } catch (error) {
    // If an error occurs during calculation, log and send error to main thread
    console.error(`Worker ${index + 1} encountered an error:`, error);
    postMessage({ error: error.message || "An unknown error occurred in the worker." });
  }
};

onerror = function (error) {
  // If there's an error initializing the worker
  console.error("Worker initialization error:", error);
  postMessage({ error: "Worker initialization error." });
};
