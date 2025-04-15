// Loading and animation functions
document.addEventListener('DOMContentLoaded', function() {
  setTimeout(() => {
      document.querySelector('.loading-screen').classList.add('fade-out');
      setTimeout(() => {
          document.querySelector('.loading-screen').style.display = 'none';
      }, 1000);
  }, 2000);
  
  // Add animation delay to sections for staggered effect
  const sections = document.querySelectorAll('.section');
  sections.forEach((section, index) => {
      section.style.animationDelay = `${0.2 * index}s`;
  });
  
  // Set up the mouse-controlled carousel functionality
  setupMouseCarousel();
  
  // Set up event tracking
  setupEventTracking();

  // Set up text analysis
  setupTextAnalysis();
});

// Mouse-controlled carousel functionality
function setupMouseCarousel() {
  const carousel = document.querySelector('.carousel');
  const skillItems = document.querySelectorAll('.skill-item');
  const carouselContainer = document.querySelector('.carousel-container');
  let isMouseDown = false;
  let startX, scrollLeft;
  
  // Enable manual scrolling
  // Mouse events for drag scrolling
  carousel.addEventListener('mousedown', (e) => {
      isMouseDown = true;
      carousel.style.cursor = 'grabbing';
      startX = e.pageX - carousel.offsetLeft;
      scrollLeft = carousel.scrollLeft;
  });
  
  carousel.addEventListener('mouseleave', () => {
      isMouseDown = false;
      carousel.style.cursor = 'grab';
  });
  
  carousel.addEventListener('mouseup', () => {
      isMouseDown = false;
      carousel.style.cursor = 'grab';
  });
  
  carousel.addEventListener('mousemove', (e) => {
      if (!isMouseDown) return;
      e.preventDefault();
      const x = e.pageX - carousel.offsetLeft;
      const walk = (x - startX) * 2; // Multiply by 2 for faster scrolling
      carousel.scrollLeft = scrollLeft - walk;
  });
  
  // Apply hover effects to each skill item and center it
  skillItems.forEach((item, index) => {
      item.addEventListener('mouseenter', () => {
          // Remove active class from all items
          skillItems.forEach(i => i.classList.remove('active'));
          // Add active class to hovered item
          item.classList.add('active');
          
          // Center the hovered item in the carousel
          const itemWidth = item.offsetWidth;
          const containerWidth = carouselContainer.offsetWidth;
          const itemOffset = item.offsetLeft;
          const scrollPosition = itemOffset - (containerWidth / 2) + (itemWidth / 2);
          
          carousel.scrollTo({
              left: scrollPosition,
              behavior: 'smooth'
          });
      });
  });
  
  // Add active class to first item initially
  if (skillItems.length > 0) {
      skillItems[0].classList.add('active');
  }
}

// Event tracking function for user interactions
function setupEventTracking() {
  // Initialize page view tracking
  logPageView();
  
  // Track all click events using event delegation
  document.addEventListener('click', function(event) {
      // Get the clicked element
      const target = event.target;
      
      // Determine object type based on element properties
      let objectType = determineObjectType(target);
      
      // Log the click event
      logEvent('click', objectType);
  });
  
  // Track element views using Intersection Observer API
  setupViewTracking();
}

// Function to determine what type of object was interacted with
function determineObjectType(element) {
  // Check element tag name and attributes to determine type
  if (element.tagName === 'IMG' || element.tagName === 'SVG' || element.closest('.gallery-item')) {
      return 'image';
  } else if (element.tagName === 'A' || element.closest('a')) {
      return 'link';
  } else if (element.tagName === 'BUTTON' || element.classList.contains('cv-btn')) {
      return 'button';
  } else if (element.classList.contains('menu-item') || element.closest('.menu-item')) {
      return 'menu-item';
  } else if (element.closest('.skill-item')) {
      return 'skill-item';
  } else if (element.closest('.timeline-item')) {
      return 'timeline-item';
  } else if (element.closest('.achievement-item')) {
      return 'achievement-item';
  } else if (element.tagName === 'H1' || element.tagName === 'H2' || element.tagName === 'H3' || 
            element.tagName === 'P' || element.tagName === 'SPAN') {
      return 'text';
  } else {
      // For any other element, get the most specific identifier
      return element.id ? `element-id:${element.id}` : 
             (element.className ? `element-class:${element.className}` : `element:${element.tagName.toLowerCase()}`);
  }
}

// Function to log events in the required format with IST timestamp
function logEvent(eventType, objectType) {
  const now = new Date();
  
  // Convert to IST (UTC+5:30)
  const istOptions = { 
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
  };
  
  const timestamp = now.toLocaleString('en-IN', istOptions);
  console.log(`${timestamp}, ${eventType}, ${objectType}`);
}

// Log page view on initial load
function logPageView() {
  logEvent('view', 'page');
}

// Track when elements come into view
function setupViewTracking() {
  // Create an observer for tracking when elements come into view
  const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
          // If the element is now visible
          if (entry.isIntersecting) {
              const target = entry.target;
              // Don't log view events for the entire body or very common elements
              if (target.tagName !== 'BODY' && target.tagName !== 'DIV') {
                  const objectType = determineObjectType(target);
                  logEvent('view', objectType);
              }
              
              // Stop observing this element after it's been viewed once
              observer.unobserve(target);
          }
      });
  }, {
      // Element is considered "viewed" when 70% visible
      threshold: 0.7
  });
  
  // Observe important elements that we want to track views for
  const elementsToObserve = [
      ...document.querySelectorAll('.section'),
      ...document.querySelectorAll('.gallery-item'),
      ...document.querySelectorAll('.skill-item'),
      ...document.querySelectorAll('.timeline-item'),
      ...document.querySelectorAll('.achievement-item'),
      ...document.querySelectorAll('.profile-card'),
      ...document.querySelectorAll('h2')
  ];
  
  elementsToObserve.forEach(element => {
      observer.observe(element);
  });
}

// Text Analysis Functionality
function setupTextAnalysis() {
  // Set up the analyze button click handler
  document.getElementById('analyze-btn').addEventListener('click', function() {
      const text = document.getElementById('text-input').value;
      
      // Show results container
      document.querySelector('.analysis-results').style.display = 'block';
      
      // Perform analysis
      analyzeText(text);
  });
}

function analyzeText(text) {
  // Calculate basic statistics
  const letterCount = (text.match(/[a-zA-Z]/g) || []).length;
  const wordCount = text.split(/\s+/).filter(word => word.length > 0).length;
  const spaceCount = (text.match(/\s/g) || []).length;
  const newlineCount = (text.match(/\n/g) || []).length;
  const specialCount = (text.match(/[^\w\s]/g) || []).length;
  
  // Update basic stats in the DOM
  document.getElementById('letter-count').textContent = letterCount;
  document.getElementById('word-count').textContent = wordCount;
  document.getElementById('space-count').textContent = spaceCount;
  document.getElementById('newline-count').textContent = newlineCount;
  document.getElementById('special-count').textContent = specialCount;
  
  // Tokenize text (converting to lowercase and splitting by spaces and punctuation)
  const tokens = text.toLowerCase().match(/\b\w+\b/g) || [];
  
  // Process pronouns
  const pronouns = [
      'i', 'me', 'my', 'mine', 'myself',
      'you', 'your', 'yours', 'yourself', 'yourselves',
      'he', 'him', 'his', 'himself',
      'she', 'her', 'hers', 'herself',
      'it', 'its', 'itself',
      'we', 'us', 'our', 'ours', 'ourselves',
      'they', 'them', 'their', 'theirs', 'themselves',
      'this', 'that', 'these', 'those',
      'who', 'whom', 'whose', 'which', 'what'
  ];
  
  // Process prepositions
  const prepositions = [
      'about', 'above', 'across', 'after', 'against', 'along', 'amid', 'among',
      'around', 'at', 'before', 'behind', 'below', 'beneath', 'beside', 'between',
      'beyond', 'by', 'concerning', 'considering', 'despite', 'down', 'during',
      'except', 'for', 'from', 'in', 'inside', 'into', 'like', 'near', 'of',
      'off', 'on', 'onto', 'out', 'outside', 'over', 'past', 'regarding',
      'round', 'since', 'through', 'throughout', 'to', 'toward', 'towards',
      'under', 'underneath', 'until', 'unto', 'up', 'upon', 'with', 'within', 'without'
  ];
  
  // Process indefinite articles
  const indefiniteArticles = ['a', 'an', 'some', 'any', 'each', 'every'];
  
  // Count occurrences
  const pronounCounts = countOccurrences(tokens, pronouns);
  const prepositionCounts = countOccurrences(tokens, prepositions);
  const articleCounts = countOccurrences(tokens, indefiniteArticles);
  
  // Update DOM with counts
  displayCounts('pronoun-counts', pronounCounts);
  displayCounts('preposition-counts', prepositionCounts);
  displayCounts('article-counts', articleCounts);
}

function countOccurrences(tokens, wordList) {
  const counts = {};
  
  // Initialize counts
  wordList.forEach(word => {
      counts[word] = 0;
  });
  
  // Count occurrences
  tokens.forEach(token => {
      if (wordList.includes(token)) {
          counts[token]++;
      }
  });
  
  // Filter out words with zero occurrences
  return Object.fromEntries(
      Object.entries(counts).filter(([_, count]) => count > 0)
  );
}

function displayCounts(elementId, counts) {
  const container = document.getElementById(elementId);
  container.innerHTML = '';
  
  // Sort by count (descending)
  const sortedCounts = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  if (sortedCounts.length === 0) {
      container.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #777;">None found in the text.</p>';
      return;
  }
  
  sortedCounts.forEach(([word, count]) => {
      const item = document.createElement('div');
      item.className = 'word-count-item';
      item.innerHTML = `
          <span class="word">${word}</span>
          <span class="count">${count}</span>
      `;
      container.appendChild(item);
  });
}