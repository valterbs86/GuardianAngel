'use server';

let detectedSequence: string[] = [];
let storedSequence: string | null = null;
let callback: (() => void) | null = null;

export const initializeButtonSequenceDetection = () => {
  if (typeof window === 'undefined') {
    // Skip initialization on server-side
    return;
  }

  // Load the button sequence from localStorage when the app starts
  storedSequence = localStorage.getItem('buttonSequence');
  console.log("loaded sequence:" + storedSequence);
  // Add event listeners for keydown events
  window.addEventListener('keydown', handleKeyDown);
};

export const setPanicCallback = async (cb: () => void) => {
  callback = cb;
};

const handleKeyDown = (event: KeyboardEvent) => {
  if (!storedSequence) {
    return;
  }

  const keyName = event.key.toLowerCase();
  detectedSequence.push(keyName);
  console.log("keydown:" + keyName);
  const sequenceArray = storedSequence.split(',');

  if (detectedSequence.length > sequenceArray.length) {
    // Reset the sequence if it becomes longer than the expected sequence
    detectedSequence = detectedSequence.slice(detectedSequence.length - sequenceArray.length);
  }

  const currentSequence = detectedSequence.join(',');

  if (storedSequence && currentSequence === storedSequence) {
    // Trigger the callback function if the detected sequence matches the stored sequence
    console.log('Panic sequence detected!');
    if (callback) {
      callback();
    }
    resetSequence();
  }
};

export const resetSequence = async () => {
  detectedSequence = [];
};

export const setStoredSequence = async (sequence: string) => {
  storedSequence = sequence;
};

