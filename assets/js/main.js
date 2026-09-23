/**
 * Interactive Scripting for Portfolio
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Navbar Scroll Effect
  const navbar = document.querySelector('.navbar');
  const handleScroll = () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Trigger initially in case of refresh

  // 2. Typewriter Effect
  const words = ["Fullstack Developer", "Software Engineer", "Problem Solver", "Tech Enthusiast"];
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const typewriterElement = document.getElementById('typewriter');
  
  const type = () => {
    const currentWord = words[wordIndex];
    if (isDeleting) {
      typewriterElement.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typewriterElement.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
    }

    let typeSpeed = isDeleting ? 40 : 100;

    if (!isDeleting && charIndex === currentWord.length) {
      // Pause at full word
      typeSpeed = 1500;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      typeSpeed = 500; // pause before typing next word
    }

    setTimeout(type, typeSpeed);
  };
  
  if (typewriterElement) {
    type();
  }

  // 3. ScrollSpy Active Links Custom Implementation
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.navbar-nav .nav-link');

  const spyScroll = () => {
    let currentId = '';
    const scrollPosition = window.scrollY + 120; // offset for sticky nav

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPosition >= sectionTop && scrollPosition < (sectionTop + sectionHeight)) {
        currentId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  };
  window.addEventListener('scroll', spyScroll);
  spyScroll(); // Run on load

  // 4. Smooth Scrolling for Navbar Links
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href');
      const targetSection = document.querySelector(targetId);
      if (targetSection) {
        // Close mobile navbar menu if open
        const navbarCollapse = document.querySelector('.navbar-collapse');
        if (navbarCollapse.classList.contains('show')) {
          const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
          if (bsCollapse) bsCollapse.hide();
        }

        window.scrollTo({
          top: targetSection.offsetTop - 80, // offset for sticky nav
          behavior: 'smooth'
        });
      }
    });
  });

  // 5. Contact Form Submission — via Web3Forms (no backend needed)
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name    = document.getElementById('formName').value.trim();
      const email   = document.getElementById('formEmail').value.trim();
      const subject = document.getElementById('formSubject').value.trim();
      const message = document.getElementById('formMessage').value.trim();
      const formResponse = document.getElementById('formResponse');
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;

      if (!name || !email || !subject || !message) return;

      // Loading state
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Mengirim...`;

      try {
        const res = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({
            access_key: '5bd677ac-3137-41e4-b308-30b86f99d0b6',
            name: name,
            email: email,
            subject: subject,
            message: message,
            from_name: 'Portfolio Contact Form'
          })
        });

        const result = await res.json();

        if (result.success) {
          // Sukses
          if (formResponse) {
            formResponse.innerHTML = `
              <div class="d-flex align-items-center text-white py-3 px-3 mb-3" style="background: rgba(168, 85, 247, 0.1); border: 1px solid var(--accent-color); border-radius: 8px;">
                <i class="fa-solid fa-circle-check fs-4 me-3" style="color: var(--accent-light);"></i>
                <div><strong>Pesan Terkirim!</strong> Terima kasih, saya akan segera membalas email Anda.</div>
              </div>
            `;
          }
          contactForm.reset();
        } else {
          throw new Error(result.message || 'Gagal mengirim');
        }
      } catch (err) {
        // Error
        if (formResponse) {
          formResponse.innerHTML = `
            <div class="d-flex align-items-center text-white py-3 px-3 mb-3" style="background: rgba(220, 38, 38, 0.1); border: 1px solid rgba(220, 38, 38, 0.5); border-radius: 8px;">
              <i class="fa-solid fa-triangle-exclamation fs-4 me-3" style="color: #f87171;"></i>
              <div><strong>Gagal mengirim.</strong> Pastikan API key sudah diisi dengan benar, atau coba lagi.</div>
            </div>
          `;
        }
      }

      // Kembalikan tombol
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;

      // Hilangkan notifikasi setelah 8 detik
      setTimeout(() => { if (formResponse) formResponse.innerHTML = ''; }, 8000);
    });
  }
});
