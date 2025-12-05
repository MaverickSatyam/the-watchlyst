<template>
    <footer class="footer">
      <div class="footer-content">
        <p>&copy; 2025 TheWATCHLYST. All rights reserved.</p>
        <div class="social-links">
          <a href="https://github.com/MaverickSatyam" target="_blank" class="social-icon">GitHub</a>
          <a href="#" target="" class="social-icon">Twitter</a>
          <a href="#" target="" class="social-icon">Instagram</a>
        </div>
      </div>
    </footer>
  </template>
  
  <script setup>
  // No script is required for this minimal footer.
  </script>
  
  <style scoped>
  .footer {
    color: white;
    height: 108px;
    box-sizing: border-box;
    padding: 1rem;
    text-align: center;
    font-size: 0.875rem;
    position: relative;
    margin-top: 1rem;

    border-top: 2px solid rgba(255, 255, 255, 0.2);
  }
  
  .footer-content {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .social-links {
    margin-top: 0.5rem;
  }
  
  .social-icon {
    color: whitesmoke;
    text-decoration: none;
    margin: 0 0.5rem;
  }
  
  .social-icon:hover {
    text-decoration: underline;
  }
  </style>
  