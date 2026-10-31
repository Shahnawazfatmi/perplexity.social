// ==================== script.js ====================
// Controls: header, mobile nav, scroll reveal, counters, work filters,
// contact form, back-to-top and the PerplexityBot chatbot.

document.addEventListener("DOMContentLoaded", () => {
  initHeader();
  initMobileMenu();
  initReveal();
  initCounters();
  initWorkFilters();
  setupContactForm();
  initBackToTop();
  initChatbot();
  setFooterYear();
});

// ==================== HEADER ====================
function initHeader() {
  const header = document.querySelector(".site-header");
  if (!header) return;

  const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 10);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

// ==================== NAVIGATION ====================
function initMobileMenu() {
  const mobileMenu = document.getElementById("mobile-menu");
  const navLinks = document.querySelector(".nav__links");
  if (!mobileMenu || !navLinks) return;

  // Inside the header so the dimmed overlay also covers the header bar
  // while staying below the drawer and toggle.
  const overlay = document.createElement("div");
  overlay.className = "nav-overlay";
  document.querySelector(".site-header").appendChild(overlay);

  const setOpen = (open) => {
    navLinks.classList.toggle("active", open);
    mobileMenu.classList.toggle("open", open);
    overlay.classList.toggle("show", open);
    mobileMenu.setAttribute("aria-expanded", String(open));
    document.body.classList.toggle("nav-open", open);
    document.body.style.overflow = open ? "hidden" : "";
  };

  mobileMenu.addEventListener("click", () => setOpen(!navLinks.classList.contains("active")));
  overlay.addEventListener("click", () => setOpen(false));
  navLinks.querySelectorAll("a").forEach(link => link.addEventListener("click", () => setOpen(false)));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setOpen(false);
  });
  window.addEventListener("resize", () => {
    if (window.innerWidth > 960) setOpen(false);
  });
}

// ==================== SCROLL REVEAL ====================
function initReveal() {
  const els = document.querySelectorAll(".reveal, [data-animate]");
  if (!("IntersectionObserver" in window)) {
    els.forEach(el => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });

  els.forEach(el => observer.observe(el));
}

// ==================== COUNTERS ====================
// Usage: <span data-count="120" data-suffix="K+" data-decimals="0">0</span>
function initCounters() {
  const els = document.querySelectorAll("[data-count]");
  if (!els.length) return;

  const animate = (el) => {
    const target = parseFloat(el.dataset.count) || 0;
    const decimals = parseInt(el.dataset.decimals || "0", 10);
    const prefix = el.dataset.prefix || "";
    const suffix = el.dataset.suffix || "";
    const duration = 1600;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = prefix + (target * eased).toFixed(decimals) + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  if (!("IntersectionObserver" in window)) {
    els.forEach(animate);
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animate(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  els.forEach(el => observer.observe(el));
}

// ==================== WORK FILTERS ====================
function initWorkFilters() {
  const buttons = document.querySelectorAll(".filter-btn");
  const cards = document.querySelectorAll(".work-card[data-category]");
  if (!buttons.length || !cards.length) return;

  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      buttons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const filter = btn.dataset.filter;
      cards.forEach(card => {
        const match = filter === "all" || card.dataset.category.split(" ").includes(filter);
        card.classList.toggle("is-hidden", !match);
      });
    });
  });
}

// ==================== CONTACT FORM ====================
function setupContactForm() {
  const form = document.getElementById("contact-form");
  if (!form) return;

  const status = document.getElementById("form-status");
  const submitBtn = form.querySelector('button[type="submit"]');
  const btnHtml = submitBtn.innerHTML;

  const showStatus = (type, message) => {
    if (!status) return;
    status.className = `form-status show form-status--${type}`;
    status.innerHTML = `<i class="fa-solid ${type === "success" ? "fa-circle-check" : "fa-circle-exclamation"}"></i> ${message}`;
  };

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';

    fetch(form.action, {
      method: "POST",
      headers: { Accept: "application/json" },
      body: new FormData(form)
    })
      .then(res => {
        if (res.ok) {
          showStatus("success", "Thanks! Your message has been sent. We'll get back to you within 24 hours.");
          form.reset();
        } else {
          showStatus("error", "Oops! Something went wrong. Please try again or reach us on WhatsApp.");
        }
      })
      .catch(err => {
        console.error("Form submission error:", err);
        showStatus("error", "Network error. Please try again later or call us at +91 89869 23909.");
      })
      .finally(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = btnHtml;
      });
  });
}

// ==================== BACK TO TOP ====================
function initBackToTop() {
  const btn = document.createElement("button");
  btn.className = "to-top";
  btn.setAttribute("aria-label", "Back to top");
  btn.innerHTML = '<i class="fa-solid fa-arrow-up"></i>';
  document.body.appendChild(btn);

  window.addEventListener("scroll", () => btn.classList.toggle("show", window.scrollY > 600), { passive: true });
  btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}

function setFooterYear() {
  document.querySelectorAll("[data-year]").forEach(el => (el.textContent = new Date().getFullYear()));
}

// ==================== ADVANCED CHATBOT ====================
function initChatbot() {
  // Widget markup is injected so every page gets the same bot
  if (!document.getElementById("chatbot-container")) {
    const wrap = document.createElement("div");
    wrap.id = "chatbot-container";
    wrap.innerHTML = `
      <div id="chatbot-body" role="dialog" aria-label="PerplexityBot chat">
        <div id="chatbot-header">
          <div class="chatbot-id">
            <div class="chatbot-id__avatar"><i class="fa-solid fa-robot"></i></div>
            <div>
              <strong>PerplexityBot</strong>
              <span>● Online — replies instantly</span>
            </div>
          </div>
          <button id="chatbot-close" aria-label="Close chat"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <div id="chat-output" aria-live="polite"></div>
        <div class="chat-quick">
          <button type="button" data-q="What services do you offer?">Services</button>
          <button type="button" data-q="What is the pricing?">Pricing</button>
          <button type="button" data-q="Tell me about the AI predictor">AI Predictor</button>
          <button type="button" data-q="How can I contact you?">Contact</button>
        </div>
        <div id="chat-input-area">
          <input type="text" id="chat-input" placeholder="Type your message..." aria-label="Message" />
          <button id="send-btn" aria-label="Send"><i class="fa-solid fa-paper-plane"></i></button>
        </div>
      </div>
      <button id="chatbot-icon" aria-label="Open chat">
        <i class="fa-solid fa-comment-dots"></i>
        <span>Chat with us</span>
      </button>`;
    document.body.appendChild(wrap);
  }

  const chatbotIcon = document.getElementById("chatbot-icon");
  const chatbotBody = document.getElementById("chatbot-body");
  const chatbotClose = document.getElementById("chatbot-close");
  const chatOutput = document.getElementById("chat-output");
  const chatInput = document.getElementById("chat-input");
  const sendBtn = document.getElementById("send-btn");

  let greeted = false;
  chatbotIcon.addEventListener("click", () => {
    chatbotBody.classList.toggle("show");
    if (!greeted) {
      addMessage("Hey there 👋 I'm PerplexityBot — your growth buddy for influencer success! Ask me about services, pricing, the AI predictor or how to get started.", "bot");
      greeted = true;
    }
    if (chatbotBody.classList.contains("show")) chatInput.focus();
  });
  chatbotClose.addEventListener("click", () => chatbotBody.classList.remove("show"));

  let context = "";
  let lastTopic = "";

  // ===== Enhanced Response Library =====
  const responses = {
    greetings: [
      "Hey there 👋 I'm PerplexityBot — your growth buddy for influencer success!",
      "Hi! 😊 I’m here to help you explore everything about our platform.",
      "Hello there! Ready to level up your influencer game today?"
    ],
    join: [
      "Joining is easy! Share your social profiles through our contact page and we’ll design your site. 🚀",
      "Just fill the form on the Contact page — we’ll get back within 24 hours with a plan.",
      "Share your profiles, we design, you start getting deals — that’s it!"
    ],
    brandDeals: [
      "Once your site is live, brands can reach out directly for collaborations. 💼",
      "Your site includes a media kit and collab form so brands can contact you in one click.",
      "We help you look professional to brands — stats, past collabs and rates in one place!"
    ],
    services: [
      "We offer portfolio websites, social stats integration, brand collab tools, SEO and an AI views predictor!",
      "Our platform helps you with personalized websites, brand collaborations and performance tracking.",
      "Check the Services page — from portfolio setup to analytics and SEO, we’ve got you covered."
    ],
    pricing: [
      "Plans start with a Starter package and scale up to Creator Pro and custom Brand plans. 💎 See the Services page for details.",
      "We keep pricing simple and transparent — check the pricing section on our Services page.",
      "Want a custom quote? Drop your details on the Contact page and we’ll reply within 24 hours."
    ],
    contact: [
      "You can reach us at +91 89869 23909 📞 or on WhatsApp anytime!",
      "Need support? Call, WhatsApp or email us — we're quick to respond!",
      "Use the Contact page form or call +91 89869 23909 for direct help."
    ],
    portfolio: [
      "You can showcase your best content — reels, videos, posts and brand collabs — all in one clean page.",
      "Your portfolio is your personal brand space — show the best of your creativity!",
      "Check our Work page to see a live influencer demo site."
    ],
    analytics: [
      "Analytics show your performance — engagement, reach, clicks and audience trends.",
      "Your site can display follower growth and engagement to build trust with brands.",
      "We integrate your social stats so brands see real numbers instantly."
    ],
    ai: [
      "Our AI Predictor uses an ensemble of Random Forest + XGBoost to estimate YouTube views before you publish. 🤖",
      "The AI Predictor helps you plan content smarter — try it on the AI Predictor page!",
      "It learns from historical video data to forecast views, so you can test titles and timing first."
    ],
    seo: [
      "We optimize your site for search engines — so brands find you faster.",
      "SEO ensures your profile ranks better and attracts the right audience.",
      "We handle discoverability so you can focus on content."
    ],
    about: [
      "Perplexity.social was founded by Shahnawaz Akhtar Fatmee to bridge the gap between influencers and brands. Read more on our About page!",
      "We’re a tech-driven team blending web development, data science and AI for creators."
    ],
    privacy: [
      "Your data and content are 100% secure — you control what’s visible to brands.",
      "We take privacy seriously. Nothing is shared without your permission.",
      "Your information stays private, always."
    ],
    support: [
      "Our team is here for you — chat, call, or email anytime.",
      "Need guidance? We’re always just a message away.",
      "We love helping creators — reach out and we’ll sort it fast!"
    ],
    followUpPricing: "Since you’re joining, we’ll suggest the plan that fits your stage — no pressure upgrades! 💡",
    followUpBrand: "After joining, you’ll be visible to brands who can directly contact you — just keep your page updated!",
    default: [
      "Hmm 🤔 I didn’t get that. Try asking about joining, pricing, services, or collaborations!",
      "Could you rephrase that? I can help with joining, pricing, the AI predictor or brand info!",
      "Not sure I caught that — wanna know about plans, joining, or services?"
    ]
  };

  // ===== Topic Detection =====
  const topicMap = {
    hi: "greetings", hello: "greetings", hey: "greetings",
    join: "join", signup: "join", register: "join", "get started": "join", "create profile": "join",
    "brand deal": "brandDeals", brand: "brandDeals", collab: "brandDeals",
    services: "services", service: "services", offerings: "services", features: "services",
    pricing: "pricing", price: "pricing", cost: "pricing", plans: "pricing", "how much": "pricing",
    contact: "contact", phone: "contact", email: "contact", whatsapp: "contact", support: "support",
    portfolio: "portfolio", demo: "portfolio", work: "portfolio",
    analytics: "analytics", stats: "analytics",
    ai: "ai", predict: "ai", ml: "ai", model: "ai", views: "ai",
    seo: "seo", about: "about", founder: "about", who: "about",
    privacy: "privacy"
  };

  function randomReply(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  // ===== Improved Context-Aware Logic =====
  function getBotReply(message) {
    const msg = message.toLowerCase();
    let detectedTopic = "";

    for (const key in topicMap) {
      const pattern = new RegExp(`\\b${key}\\b`);
      if (pattern.test(msg)) {
        detectedTopic = topicMap[key];
        break;
      }
    }

    if (context === "join" && detectedTopic === "pricing") {
      context = "";
      return responses.followUpPricing;
    }
    if (context === "join" && detectedTopic === "brandDeals") {
      context = "";
      return responses.followUpBrand;
    }

    if (detectedTopic) {
      context = detectedTopic;
      lastTopic = detectedTopic;
      return Array.isArray(responses[detectedTopic])
        ? randomReply(responses[detectedTopic])
        : responses[detectedTopic];
    } else if (lastTopic) {
      return `Still thinking about ${lastTopic}? You can ask me more details about it!`;
    }

    return randomReply(responses.default);
  }

  // ===== Add Message to Chat =====
  function addMessage(content, sender) {
    const msgElem = document.createElement("p");
    msgElem.classList.add(sender === "user" ? "user-message" : "bot-message");
    msgElem.textContent = content;
    chatOutput.appendChild(msgElem);
    chatOutput.scrollTop = chatOutput.scrollHeight;
  }

  // ===== Send Message Function =====
  function sendMessage(text) {
    const userMessage = (text || chatInput.value).trim();
    if (!userMessage) return;
    addMessage(userMessage, "user");
    chatInput.value = "";

    const typingMsg = document.createElement("p");
    typingMsg.classList.add("bot-message", "typing");
    chatOutput.appendChild(typingMsg);
    chatOutput.scrollTop = chatOutput.scrollHeight;

    setTimeout(() => {
      typingMsg.remove();
      addMessage(getBotReply(userMessage), "bot");
    }, 700 + Math.random() * 500);
  }

  sendBtn.addEventListener("click", () => sendMessage());
  chatInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") sendMessage();
  });
  document.querySelectorAll(".chat-quick button").forEach(btn => {
    btn.addEventListener("click", () => sendMessage(btn.dataset.q));
  });
}
