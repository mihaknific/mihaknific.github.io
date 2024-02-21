var headerIndex = 0;
var paragraphIndex = 0;

function typeWriterHeader() {
  var headerContent = 'Hello.';
  if (headerIndex < headerContent.length) {
    document.getElementById('headerText').innerHTML += headerContent.charAt(headerIndex);
    headerIndex++;
    setTimeout(typeWriterHeader, 120); // Adjust speed by changing delay time
  } else {
    setTimeout(function() {
      document.getElementById('headerCursor').style.display = 'none';
      document.getElementById('paragraphCursor').style.display = 'inline';
      document.getElementById('paragraphCursor').classList.add('blink_cursor');
      setTimeout(typeWriterParagraph, 750); // Start typing the second text after 0.5 seconds
    }, 600); // Keep the first cursor blinking for an additional second
  }
}

function typeWriterParagraph() {
  var paragraphContent = "I'm NAME — a Cognitive Science student with an interest in technology and people.";
  if (paragraphIndex < paragraphContent.length) {
    document.getElementById('paragraphText').innerHTML += paragraphContent.charAt(paragraphIndex);
    var delay = paragraphContent.charAt(paragraphIndex) === ' ' ? 110 : 70;
    paragraphIndex++;
    setTimeout(typeWriterParagraph, delay); // Adjust speed by changing delay time
  }
}

setTimeout(typeWriterHeader, 1000); // Start typing after 1 second
