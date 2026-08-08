document.addEventListener("DOMContentLoaded", () => {
  const header = document.getElementById("siteHeader");
  const navToggle = document.getElementById("navToggle");
  const navMenu = document.getElementById("navMenu");
  const navLinks = document.querySelectorAll(".nav-link");
  const slides = document.querySelectorAll(".hero-slide");
  const indicators = document.querySelectorAll(".indicator");
  const prevSlide = document.getElementById("prevSlide");
  const nextSlide = document.getElementById("nextSlide");
  const revealItems = document.querySelectorAll(".reveal");
  const sections = document.querySelectorAll("main section[id]");
  const catalogCards = document.querySelectorAll(".catalog-card");
  const catalogLightbox = document.getElementById("catalogLightbox");
  const lightboxImage = document.getElementById("lightboxImage");
  const lightboxCaption = document.getElementById("lightboxCaption");
  const lightboxClose = document.getElementById("lightboxClose");

  let currentSlide = 0;
  let slideTimer;

  const updateHeader = () => {
    header.classList.toggle("scrolled", window.scrollY > 30);
  };

  const closeMenu = () => {
    navMenu.classList.remove("open");
    header.classList.remove("menu-open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
  };

  const showSlide = (index) => {
    currentSlide = (index + slides.length) % slides.length;

    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle("active", slideIndex === currentSlide);
    });

    indicators.forEach((indicator, indicatorIndex) => {
      indicator.classList.toggle("active", indicatorIndex === currentSlide);
    });
  };


  const openLightbox = (card) => {
    const imageSrc = card.dataset.full;
    const title = card.dataset.title;

    lightboxImage.src = imageSrc;
    lightboxImage.alt = title;
    lightboxCaption.textContent = title;
    catalogLightbox.classList.add("open");
    catalogLightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("lightbox-active");
    lightboxClose.focus();
  };

  const closeLightbox = () => {
    catalogLightbox.classList.remove("open");
    catalogLightbox.setAttribute("aria-hidden", "true");
    document.body.classList.remove("lightbox-active");
    lightboxImage.src = "";
    lightboxImage.alt = "";
    lightboxCaption.textContent = "";
  };
  const startCarousel = () => {
    clearInterval(slideTimer);
    slideTimer = setInterval(() => {
      showSlide(currentSlide + 1);
    }, 5000);
  };

  navToggle.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("open");
    header.classList.toggle("menu-open", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
    navToggle.innerHTML = isOpen ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      closeMenu();
    });
  });

  prevSlide.addEventListener("click", () => {
    showSlide(currentSlide - 1);
    startCarousel();
  });

  nextSlide.addEventListener("click", () => {
    showSlide(currentSlide + 1);
    startCarousel();
  });

  indicators.forEach((indicator, index) => {
    indicator.addEventListener("click", () => {
      showSlide(index);
      startCarousel();
    });
  });


  catalogCards.forEach((card) => {
    card.addEventListener("click", () => {
      openLightbox(card);
    });

    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openLightbox(card);
      }
    });
  });

  lightboxClose.addEventListener("click", closeLightbox);

  catalogLightbox.addEventListener("click", (event) => {
    if (event.target === catalogLightbox) {
      closeLightbox();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && catalogLightbox.classList.contains("open")) {
      closeLightbox();
    }
  });
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.16 });

  revealItems.forEach((item) => revealObserver.observe(item));

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      navLinks.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
      });
    });
  }, {
    rootMargin: "-45% 0px -50% 0px",
    threshold: 0
  });

  sections.forEach((section) => navObserver.observe(section));

  document.addEventListener("click", (event) => {
    const clickedInsideMenu = navMenu.contains(event.target);
    const clickedToggle = navToggle.contains(event.target);

    if (!clickedInsideMenu && !clickedToggle && navMenu.classList.contains("open")) {
      closeMenu();
    }
  });

  window.addEventListener("scroll", updateHeader, { passive: true });
  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) {
      closeMenu();
    }
  });

  updateHeader();
  showSlide(0);
  startCarousel();
});

