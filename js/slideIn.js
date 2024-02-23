window.addEventListener('DOMContentLoaded', (event) => {
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if(entry.isIntersecting) {
        if(entry.target.classList.contains('contact-divider-title')) {
          entry.target.style.transform = 'scale(1) translateY(0)';
          entry.target.style.opacity = '1';
        } else if(entry.target.classList.contains('project__description__section-text__container')) {
          entry.target.style.transform = 'translateX(0)';
          entry.target.style.opacity = '1';
        } else if(entry.target.classList.contains('project__description__section-img')) {
          entry.target.style.transform = 'scale(1)';
          entry.target.style.opacity = '1';
        } else if(entry.target.classList.contains('project__card')) {
          entry.target.style.transform = 'translateY(0)';
          entry.target.style.opacity = '1';
        }
        observer.unobserve(entry.target);
      }
    });
  });

  document.querySelectorAll('.project__card, .project__description__section-text__container, .project__description__section-img, .contact-divider-title').forEach(div => {
    observer.observe(div);
  });
});
