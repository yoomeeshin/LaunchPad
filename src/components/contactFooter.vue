<template>
    <footer class="contact-footer">
    <div class="footer-content">
      <div class="contact-info">
        <h3>Contact Us</h3>
        <p>Email: contact@example.com</p>
        <p>Phone: +1 555-123-4567</p>
        <p>Address: 123 Main St, Anytown, USA</p>
      </div>

      <div class="social-links">
        <h3>Follow Us</h3>
        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a>
        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a>
        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">LinkedIn</a>
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
      </div>

      <div class="quick-links">
        <h3>Quick Links</h3>
        <a href="/about">About Us</a>
        <a href="/services">Services</a>
        <a href="/faq">FAQ</a>
        <a href="/privacy">Privacy Policy</a>
      </div>
    </div>
    <div class="copyright">
      <p>&copy; {{ new Date().getFullYear() }} BT3103 Group 12 Final Term Project. All rights reserved.</p>
    </div>
  </footer>

</template>

<style scoped>
.contact-footer {
  display: absolute;
  flex-direction: column;
  width: 100%;
  color: #fff;
  text-align: center;
  justify-content: center;
  position: absolute;
  z-index: 999;
}

.footer-content {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap; 
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

.contact-info,
.social-links,
.quick-links {
  margin: 20px;
  text-align: left;
}

.contact-info h3,
.social-links h3,
.quick-links h3 {
  margin-bottom: 10px;
  color: #ddd;
}

.contact-info p,
.social-links a,
.quick-links a {
  display: block;
  margin-bottom: 5px;
  color: #aaa;
  text-decoration: none;
}

.social-links a:hover,
.quick-links a:hover {
  color: #fff;
}

.copyright {
  margin-top: 20px;
  border-top: 1px solid #aaa;
  opacity: 0.5;
  padding-top: 10px;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .footer-content {
    flex-direction: column; 
    align-items: center; 
  }

  .contact-info,
  .social-links,
  .quick-links {
    text-align: center; 
  }
}
</style>