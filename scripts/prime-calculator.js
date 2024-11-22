// prime-calculator.js

// Function to Calculate Primes in a Given Range
export function calculatePrimesInRange(start, end) {
    const primes = [];
    for (let i = start; i <= end; i++) {
      if (isPrime(i)) primes.push(i);
    }
    return primes;
  }
  
  // Function to Check if a Number is Prime
  export function isPrime(num) {
    if (num <= 1) return false; // Exclude numbers <= 1
    if (num <= 3) return true;  // 2 and 3 are prime numbers
    if (num % 2 === 0 || num % 3 === 0) return false; // Eliminate multiples of 2 and 3
    for (let i = 5, sqrt = Math.sqrt(num); i <= sqrt; i += 6) {
      if (num % i === 0 || num % (i + 2) === 0) return false; // Check divisibility by 5, 7, 11, 13, ...
    }
    return true; // If no divisors found, it's prime
  }
  