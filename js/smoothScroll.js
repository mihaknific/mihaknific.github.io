function smoothScroll(sectionId) {

    // Wait for 1 second (1000 milliseconds)
    setTimeout(function () {
        // Scroll to the section
        document.getElementById(sectionId).scrollIntoView({ behavior: 'smooth' });
    });
}