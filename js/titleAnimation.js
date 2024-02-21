// Get the spans
const spans = document.querySelectorAll('.title-animation span');

// Add the event listeners to the spans
spans.forEach((span, idx) => {
  span.addEventListener('click', (e) => {
    e.target.classList.add('active');
  });
  span.addEventListener('animationend', (e) => {
    e.target.classList.remove('active');
  });
});

// Flag to check if the animations have been triggered
let animationsTriggered = false;

window.addEventListener('scroll', () => {
  // If the animations have already been triggered, do nothing
  if (animationsTriggered) return;

  // Get the current scroll position
  const scrollPosition = window.scrollY || document.documentElement.scrollTop;

  // Get 40% of the window's height
  const triggerHeight = window.innerHeight * 0.3;

  // Check if we've scrolled more than 40vh
  if (scrollPosition > triggerHeight) {
    // If so, add the 'active' class to the spans
    spans.forEach((span, idx) => {
      // Remove the delay for the first element
      const delay = idx === 0 ? 0 : 750 * idx;
      setTimeout(() => {
        span.classList.add('active');
      }, delay);
    });

    // Set the flag to true
    animationsTriggered = true;
  }
});
