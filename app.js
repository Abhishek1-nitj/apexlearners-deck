gsap.registerPlugin(ScrollTrigger);

const numSlides = 14;
let activeSlideIndex = 0;
let scrollTween = null;

lucide.createIcons();

const slidesContainer = document.querySelector('.slides-container');
const progressFill = document.getElementById('global-progress-fill');
const currSlideNumEl = document.getElementById('curr-slide-num');
const slideJumpInput = document.getElementById('slide-jump-input');
const prevBtn = document.getElementById('prev-slide-btn');
const nextBtn = document.getElementById('next-slide-btn');

function initScroll() {
  slidesContainer.style.width = `${numSlides * 100}vw`;

  scrollTween = gsap.to(slidesContainer, {
    x: () => -(slidesContainer.scrollWidth - window.innerWidth),
    ease: 'none',
    scrollTrigger: {
      trigger: '.viewport-wrapper',
      pin: true,
      scrub: 0.1,
      start: 'top top',
      end: () => '+=' + (slidesContainer.scrollWidth - window.innerWidth),
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        const progress = self.progress;
        progressFill.style.width = `${progress * 100}%`;
        const index = Math.round(progress * (numSlides - 1));
        if (index !== activeSlideIndex) {
          activeSlideIndex = index;
          updateNavigationState(index);
        }
      }
    }
  });

  document.querySelectorAll('.slide').forEach((slide) => {
    const slideHeader = slide.querySelector('.slide-header');
    if (slide.id === 'slide-10') {
      gsap.set(slideHeader, { opacity: 1, y: 0 });
    } else {
      gsap.fromTo(
        slideHeader,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          scrollTrigger: {
            trigger: slide,
            containerAnimation: scrollTween,
            start: 'left 80%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    }

    const animElements = slide.querySelectorAll(
      '.outcome-card, .grid-body-row, .metric-card, .pillar-card, .pipeline-node, .role-grid-card, .skill-pill, .filter-box, .profile-preview-card, .gauge-card, .sla-step-node, .engagement-card, .team-card'
    );

    if (animElements.length) {
      gsap.fromTo(
        animElements,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.08,
          scrollTrigger: {
            trigger: slide,
            containerAnimation: scrollTween,
            start: 'left 75%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    }
  });
}

function updateNavigationState(index) {
  const slideNumber = index + 1;
  currSlideNumEl.textContent = String(slideNumber).padStart(2, '0');
  if (slideJumpInput && document.activeElement !== slideJumpInput) slideJumpInput.value = slideNumber;

  document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
  if (index >= 0 && index < 3) document.querySelectorAll('.nav-btn')[0].classList.add('active');
  else if (index >= 3 && index < 5) document.querySelectorAll('.nav-btn')[1].classList.add('active');
  else if (index >= 5 && index < 7) document.querySelectorAll('.nav-btn')[2].classList.add('active');
  else if (index >= 7 && index < 8) document.querySelectorAll('.nav-btn')[3].classList.add('active');
  else if (index >= 8) document.querySelectorAll('.nav-btn')[4].classList.add('active');

  document.querySelectorAll('.progress-checkpoint').forEach(cp => {
    const cpIdx = parseInt(cp.getAttribute('data-idx'));
    cp.classList.toggle('active', cpIdx <= index);
  });
  document.body.classList.toggle('slide-8-active', index === 7);

  if (index === 3) {
    animateCounters('#slide-4 .counter');
  } else if (index === 6) {
    animateCounters('#slide-8 .counter');
    triggerBarChartAnimation();
  } else if (index === 8) {
    animateCounters('#slide-15 .counter');
  }
}

function animateCounters(selector) {
  document.querySelectorAll(selector).forEach(counter => {
    const target = parseInt(counter.getAttribute('data-target'));
    const duration = 1500;
    const startTime = performance.now();

    function update() {
      const elapsed = performance.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const value = Math.floor(progress * (2 - progress) * target);
      counter.textContent = value.toLocaleString();
      if (progress < 1) requestAnimationFrame(update);
      else counter.textContent = target.toLocaleString();
    }

    requestAnimationFrame(update);
  });
}

function scrollToSlide(index) {
  if (!scrollTween || !scrollTween.scrollTrigger) return;
  index = Math.max(0, Math.min(numSlides - 1, index));
  const st = scrollTween.scrollTrigger;
  const maxScroll = st.end - st.start;
  const targetScroll = st.start + (index / (numSlides - 1)) * maxScroll;
  window.scrollTo({ top: targetScroll, behavior: 'smooth' });
}

if (slideJumpInput) {
  slideJumpInput.value = 1;
  const jump = () => {
    const n = parseInt(slideJumpInput.value, 10);
    if (Number.isInteger(n) && n >= 1 && n <= numSlides) scrollToSlide(n - 1);
  };
  slideJumpInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') jump();
  });
  slideJumpInput.addEventListener('blur', jump);
}

if (prevBtn) {
  prevBtn.addEventListener('click', () => {
    if (activeSlideIndex > 0) scrollToSlide(activeSlideIndex - 1);
  });
}

if (nextBtn) {
  nextBtn.addEventListener('click', () => {
    if (activeSlideIndex < numSlides - 1) scrollToSlide(activeSlideIndex + 1);
  });
}

document.querySelectorAll('.nav-btn').forEach(btn => {
  btn.addEventListener('click', () => scrollToSlide(parseInt(btn.getAttribute('data-slide'))));
});

document.querySelectorAll('.progress-checkpoint').forEach(cp => {
  cp.addEventListener('click', () => scrollToSlide(parseInt(cp.getAttribute('data-idx'))));
});

window.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
    if (activeSlideIndex < numSlides - 1) {
      scrollToSlide(activeSlideIndex + 1);
      e.preventDefault();
    }
  } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
    if (activeSlideIndex > 0) {
      scrollToSlide(activeSlideIndex - 1);
      e.preventDefault();
    }
  }
});

window.scrollToSlide = scrollToSlide;

function initCanvasParticles() {
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);
  const particles = [];
  const particleCount = 45;
  const maxDistance = 150;

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.radius = Math.random() * 2 + 1;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(99, 102, 241, 0.25)';
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) particles.push(new Particle());

  function animate() {
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < maxDistance) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(6, 182, 212, ${(1 - dist / maxDistance) * 0.08})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(animate);
  }

  animate();
  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });
}

const btnRunPipeline = document.getElementById('btn-run-pipeline');
const runnerDot = document.getElementById('runner-dot');
const pipelineNodes = document.querySelectorAll('.pipeline-node');

if (btnRunPipeline) {
  btnRunPipeline.addEventListener('click', () => {
    pipelineNodes.forEach(node => node.classList.remove('active'));
    runnerDot.style.transition = 'none';
    runnerDot.style.transform = 'translateX(-100%)';
    runnerDot.offsetHeight;
    runnerDot.style.transition = 'transform 3.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    runnerDot.style.transform = 'translateX(100vw)';
    setTimeout(() => pipelineNodes[0].classList.add('active'), 0);
    setTimeout(() => pipelineNodes[1].classList.add('active'), 700);
    setTimeout(() => pipelineNodes[2].classList.add('active'), 1400);
    setTimeout(() => pipelineNodes[3].classList.add('active'), 2100);
    setTimeout(() => pipelineNodes[4].classList.add('active'), 2800);
    setTimeout(() => {
      confetti({ particleCount: 80, spread: 60, origin: { y: 0.6, x: 0.5 } });
    }, 3200);
  });
}

const eduButtons = document.querySelectorAll('#edu-buttons .config-btn');
const salarySlider = document.getElementById('salary-slider');
const salaryVal = document.getElementById('salary-val');
const cardName = document.getElementById('candidate-card-name');
const cardRole = document.getElementById('candidate-card-role');
const cardExp = document.getElementById('candidate-card-exp');
const eduTagsContainer = document.getElementById('candidate-edu-tags');
const profileCard = document.getElementById('interactive-profile-card');

const mockCandidateDatabase = {
  fresh: {
    biz: { name: 'Priya Sharma', role: 'MIS Analyst', exp: 'Fresher', tags: ['BBA', 'BCom'] },
    tech: { name: 'Rahul Gupta', role: 'Junior Data Analyst', exp: 'Fresher', tags: ['BCA', 'BSc'] }
  },
  experienced: {
    biz: { name: 'Arjun Verma', role: 'Operations Specialist', exp: '2 Years Experience', tags: ['BCom', 'MBA'] },
    tech: { name: 'Sneha Nair', role: 'Business Data Analyst', exp: '2.5 Years Experience', tags: ['BTech', 'BCA'] }
  }
};

function updateConfiguredCandidate() {
  const salary = parseInt(salarySlider.value);
  salaryVal.textContent = `₹${salary}K`;
  const isExp = salary > 30;
  const activeEduBtn = document.querySelector('#edu-buttons .config-btn.active');
  const isTech = activeEduBtn ? activeEduBtn.getAttribute('data-edu').includes('BTech') : false;
  const dataset = isExp ? mockCandidateDatabase.experienced : mockCandidateDatabase.fresh;
  const candidate = isTech ? dataset.tech : dataset.biz;

  gsap.fromTo(profileCard, { scale: 0.98, opacity: 0.9 }, { scale: 1, opacity: 1, duration: 0.3 });
  cardName.textContent = candidate.name;
  cardRole.textContent = candidate.role;
  cardExp.textContent = candidate.exp;
  eduTagsContainer.innerHTML = '';
  candidate.tags.forEach(tag => {
    const el = document.createElement('span');
    el.className = 'tag';
    el.textContent = tag;
    eduTagsContainer.appendChild(el);
  });
}

eduButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    eduButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    updateConfiguredCandidate();
  });
});

if (salarySlider) salarySlider.addEventListener('input', updateConfiguredCandidate);

function triggerBarChartAnimation() {
  document.querySelectorAll('.bar-fill').forEach(bar => {
    const targetHeight = bar.getAttribute('style').match(/--height:\s*([\d%]+)/)[1];
    bar.style.height = targetHeight;
  });
}

const mapNodes = document.querySelectorAll('.map-node');
const cityPills = document.querySelectorAll('.city-pill');

mapNodes.forEach((node, nodeIdx) => {
  node.addEventListener('mouseenter', () => highlightCityAndNode(nodeIdx));
});

cityPills.forEach((pill, nodeIdx) => {
  pill.addEventListener('mouseenter', () => highlightCityAndNode(nodeIdx));
});

function highlightCityAndNode(idx) {
  cityPills.forEach(p => p.classList.remove('active-city'));
  mapNodes.forEach(n => {
    n.style.fill = 'var(--color-primary)';
    n.style.r = '6px';
  });
  if (cityPills[idx]) cityPills[idx].classList.add('active-city');
  if (mapNodes[idx]) {
    mapNodes[idx].style.fill = 'var(--color-secondary)';
    mapNodes[idx].style.r = '9px';
  }
}

document.querySelectorAll('.hire-simulation-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const candName = btn.getAttribute('data-candidate');
    confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } });
    gsap.fromTo(btn, { scale: 0.95 }, { scale: 1, duration: 0.2, ease: 'bounce.out' });
    showSuccessToast(`Simulated hiring for ${candName}! Scorecard sent to sourcing queues.`);
  });
});

function showSuccessToast(message) {
  const toast = document.createElement('div');
  toast.className = 'toast-alert glow-border';
  toast.innerHTML = `<i data-lucide="party-popper" style="color: var(--color-success)"></i> <span>${message}</span>`;
  document.body.appendChild(toast);
  lucide.createIcons();
  Object.assign(toast.style, {
    position: 'fixed',
    bottom: '90px',
    right: '40px',
    background: 'rgba(15, 22, 38, 0.95)',
    border: '1px solid var(--color-success)',
    padding: '16px 24px',
    borderRadius: '12px',
    zIndex: '1000',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    boxShadow: 'var(--shadow-neon-success)',
    opacity: '0',
    transform: 'translateY(20px)',
    transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
    fontSize: '0.9rem',
    color: '#fff'
  });
  setTimeout(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';
  }, 10);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(20px)';
    setTimeout(() => toast.remove(), 400);
  }, 3500);
}

window.handleInquirySubmit = function (e) {
  e.preventDefault();
  const submitBtn = e.target.querySelector('.submit-btn');
  const origContent = submitBtn.innerHTML;
  submitBtn.innerHTML = `<i data-lucide="loader" class="spin"></i> Processing...`;
  submitBtn.disabled = true;
  lucide.createIcons();
  setTimeout(() => {
    submitBtn.innerHTML = `<i data-lucide="check-circle"></i> Inquiry Sent`;
    lucide.createIcons();
    confetti({ particleCount: 150, spread: 90, origin: { y: 0.5 } });
    setTimeout(() => {
      submitBtn.innerHTML = origContent;
      submitBtn.disabled = false;
    }, 2500);
  }, 1800);
};

initScroll();
initCanvasParticles();
