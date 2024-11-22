// main.js

import { ERROR_MESSAGES, CSS_CLASSES } from "./constants.js";
import { log, logError, updateProgress } from "./utils.js";
import { calculatePrimesInRange } from "./prime-calculator.js";

var totalPrimes = []
var completedWorkers = 0
// DOM Elements
const singleThreadBtn = document.getElementById("singleThreadBtn");
const multiThreadBtn = document.getElementById("multiThreadBtn");
const cancelBtn = document.getElementById("cancelBtn");
const progress = document.getElementById("progress");
const result = document.getElementById("result");
const limitInput = document.getElementById("limitInput");
const coreSelect = document.getElementById("coreSelect");

// State Variables
let workers = [];
let startTime;

// Single-Threaded Execution
singleThreadBtn.addEventListener("click", () => {
  const limit = parseInt(limitInput.value, 10);

  if (isNaN(limit) || limit <= 0) {
    updateProgress(progress, ERROR_MESSAGES.INVALID_INPUT, true);
    return;
  }

  updateProgress(progress, "Calculating...");
  result.textContent = "";
  startTime = performance.now();

  const primes = calculatePrimesInRange(2, limit);
  const endTime = performance.now();
  updateProgress(progress, `Done in ${((endTime - startTime) / 1000).toFixed(2)} seconds (Single-Threaded).`);
  result.textContent = `Found ${primes.length} primes.`;
});

// Multi-Threaded Execution
multiThreadBtn.addEventListener("click", () => {

  const limit = parseInt(limitInput.value, 10);
  const workersCount = parseInt(coreSelect.value, 10);

  if (isNaN(limit) || limit <= 0) {
    updateProgress(progress, ERROR_MESSAGES.INVALID_INPUT, true);
    return;
  }

  updateProgress(progress, "Calculating...");
  result.textContent = "";
  cancelBtn.disabled = false;
  startTime = performance.now();

  const rangePerWorker = Math.ceil(limit / workersCount);

  workers = Array.from({ length: workersCount }, (_, index) => {
    const worker = new Worker("scripts/worker-thread.js",{type:"module"});
    const start = index * rangePerWorker + 1;
    const end = Math.min((index + 1) * rangePerWorker, limit);
    
    // Log the data sent to the worker for debugging
    // console.log(`Main thread: Sending range to worker ${index + 1}: start=${start}, end=${end}`);
    
    worker.postMessage({ start, end, index });

    // Handle messages from the worker
    worker.onmessage = (event) => {
      const { result, error } = event.data;

      if (error) {
        logError(`Error in worker ${index + 1}: ${error}`);
        updateProgress(progress, ERROR_MESSAGES.WORKER_ERROR, true);
        cancelBtn.disabled = true;

        workers.forEach((w) => w.terminate());
        workers = [];
        return;
      }

      totalPrimes = totalPrimes.concat(result);
      completedWorkers++;

      if (completedWorkers === workersCount) {
        const endTime = performance.now();
        updateProgress(progress, `Done in ${((endTime - startTime) / 1000).toFixed(2)} seconds (Multi-Threaded with ${workersCount} cores).`);
        result.textContent = `Found ${totalPrimes.length} primes.`;
        cancelBtn.disabled = true;

        workers.forEach((w) => w.terminate());
        workers = [];
      }
    };

    worker.onerror = (error) => {
      logError(`Error in worker ${index + 1}: ${error.message || "An unknown error occurred."}`);
      updateProgress(progress, ERROR_MESSAGES.WORKER_ERROR, true);
      cancelBtn.disabled = true;

      workers.forEach((w) => w.terminate());
      workers = [];
    };

    return worker;
  });
});


// Cancel Operation
cancelBtn.addEventListener("click", () => {
  log("Cancel button clicked.");
  workers.forEach((worker) => worker.terminate());
  workers = [];
  updateProgress(progress, ERROR_MESSAGES.OPERATION_CANCELLED, true);
  cancelBtn.disabled = true;
});
