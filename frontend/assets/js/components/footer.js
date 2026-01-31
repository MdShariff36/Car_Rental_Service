/**
 * Footer Component
 * Renders the site footer with company info, links, and contact details
 *
 * HTML Selectors Used:
 * - #footer: Main footer container
 * - .footer-grid: Grid layout for footer columns
 * - .footer-column: Individual footer columns
 * - .social-links: Social media links container
 * - .footer-bottom: Bottom footer section with copyright
 * - .trust-badges: Trust badges container
 */

class Footer {
  constructor() {
    this.footerHTML = `
    <footer class="site-footer" id="footer">
      <div class="container">
        <div class="footer-grid">
          <div class="footer-column">
            <h4>About Auto Prime</h4>
            <p>
              Auto Prime Rental offers premium self-drive cars for your
              convenience. Reliable, fast, and always ready for your journey.
            </p>
            <div class="social-links">
              <a href="#" aria-label="Facebook"><i class="fab fa-facebook"></i></a>
              <a href="#" aria-label="Twitter"><i class="fab fa-twitter"></i></a>
              <a href="#" aria-label="Instagram"><i class="fab fa-instagram"></i></a>
              <a href="#" aria-label="LinkedIn"><i class="fab fa-linkedin"></i></a>
            </div>
          </div>
          <div class="footer-column">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="index.html">Home</a></li>
              <li><a href="cars.html">Cars</a></li>
              <li><a href="services.html">Services</a></li>
              <li><a href="about.html">About Us</a></li>
              <li><a href="blog.html">Blog</a></li>
              <li><a href="contact.html">Contact</a></li>
            </ul>
          </div>
          <div class="footer-column">
            <h4>Support</h4>
            <ul>
              <li><a href="help.html">Help Center</a></li>
              <li><a href="faq.html">FAQs</a></li>
              <li><a href="terms.html">Terms of Service</a></li>
              <li><a href="privacy.html">Privacy Policy</a></li>
              <li><a href="reviews.html">Reviews</a></li>
            </ul>
          </div>
          <div class="footer-column">
            <h4>Contact Info</h4>
            <p>📍 Main Road, Trichy, Tamil Nadu</p>
            <p>📞 +91-9361261582</p>
            <p>📧 support@autoprime.com</p>
            <p>⏰ 24/7 Customer Support</p>
          </div>
        </div>
        <div class="footer-bottom">
          <p>&copy; 2026 Auto Prime Rental. All rights reserved.</p>
          <div class="trust-badges">
            <span>🔒 SSL Secured</span>
            <span>💳 Safe Payments</span>
            <span>✓ Verified Business</span>
          </div>
        </div>
      </div>
    </footer>`;
  }

  /**
   * Render the footer HTML into the target element
   * @param {string} targetSelector - CSS selector for target element (default: '#footer')
   */
  render(targetSelector = "#footer") {
    const target = document.querySelector(targetSelector);
    if (target) {
      target.outerHTML = this.footerHTML;
    }
  }

  /**
   * Initialize footer functionality after rendering
   */
  init() {
    this.updateCopyrightYear();
    this.setupSocialLinks();
  }

  /**
   * Update copyright year to current year
   */
  updateCopyrightYear() {
    const currentYear = new Date().getFullYear();
    const copyrightText = document.querySelector(".footer-bottom p");
    if (copyrightText) {
      copyrightText.textContent = `© ${currentYear} Auto Prime Rental. All rights reserved.`;
    }
  }

  /**
   * Setup social links (can be extended with analytics tracking)
   */
  setupSocialLinks() {
    const socialLinks = document.querySelectorAll(".social-links a");

    socialLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        // Prevent default for demo (since href="#")
        if (link.getAttribute("href") === "#") {
          e.preventDefault();
          console.log("Social link clicked:", link.getAttribute("aria-label"));
        }

        // Track social link clicks (integrate with analytics if needed)
        this.trackSocialClick(link.getAttribute("aria-label"));
      });
    });
  }

  /**
   * Track social media link clicks
   * @param {string} platform - Social media platform name
   */
  trackSocialClick(platform) {
    // Placeholder for analytics tracking
    // Could integrate with Google Analytics, Mixpanel, etc.
    console.log(`Social link clicked: ${platform}`);

    // Example: gtag('event', 'social_click', { platform: platform });
  }
}

// Auto-initialize when DOM is ready
if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", () => {
    const footer = new Footer();
    footer.render();
    footer.init();
  });
}

// Export for module usage
if (typeof module !== "undefined" && module.exports) {
  module.exports = Footer;
}
