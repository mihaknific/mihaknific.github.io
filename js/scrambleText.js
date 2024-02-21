const sentences = [
  "Transform your text online.",
  "UPPERCASE transformation? We’re raising the bar, one letter at a time!",
  "Strip your HTML off the text!"];

let currentSentence = 0;
let currentWord = 0;
let currentLetter = 0;
let scrambleInterval;
let typewriterInterval;

const typewriterSpeed = 120; // Speed of typewriter effect in milliseconds
const scrambleSpeed = 60; // Speed of scramble effect in milliseconds
const scrambleCharacters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?/`~"\'\\'; // Characters used in scramble effect
const pauseBetweenSentences = 800; // Pause between sentences in milliseconds

function scramble() {
  let words = sentences[currentSentence].split(' ');
  if (currentLetter < words[currentWord].length) {
      let scrambleText = '';
      for (let i = 0; i < 1; i++) {
          if (currentLetter + i < words[currentWord].length) {
              scrambleText += scrambleCharacters[Math.floor(Math.random() * scrambleCharacters.length)];
          }
      }
      words[currentWord] = words[currentWord].slice(0, currentLetter) + scrambleText;
  }
  document.getElementById('scramble').innerHTML = words.map((word, index) => 
      index > currentWord ? `<span style="color: transparent;">${word}</span>` : 
      index === currentWord && currentLetter < words[currentWord].length ? `<span style="color: white;">${word}</span>` : word
  ).join(' ');
}

function typewriter() {
  let words = sentences[currentSentence].split(' ');
  if (currentLetter < words[currentWord].length) {
      currentLetter++;
  } else {
      currentWord++;
      if (currentWord < words.length) {
          currentLetter = 0;
      } else {
          clearInterval(scrambleInterval);
          clearInterval(typewriterInterval);
          document.getElementById('scramble').textContent = sentences[currentSentence]; // Display the whole sentence
          currentSentence = (currentSentence + 1) % sentences.length;
          currentWord = 0;
          currentLetter = 0;
          setTimeout(start, pauseBetweenSentences); // Pause before starting the next sentence
      }
  }
}

function start() {
  scrambleInterval = setInterval(scramble, scrambleSpeed);
  typewriterInterval = setInterval(typewriter, typewriterSpeed);
}

start();
