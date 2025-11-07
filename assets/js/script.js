// ==================== script.js ====================
// Controls: Nav toggle, demo data load, counters, contact form

document.addEventListener("DOMContentLoaded", () => {
  initMobileMenu();
  loadDemoData();
  setupContactForm();
});

// ==================== NAVIGATION ====================
function initMobileMenu() {
  const mobileMenu = document.getElementById('mobile-menu');
  const navLinks = document.querySelector('.nav-links');

  if (mobileMenu && navLinks) {
    mobileMenu.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      mobileMenu.classList.toggle('open');
    });

    const links = navLinks.querySelectorAll('a');
    links.forEach(link => {
      link.addEventListener('click', () => {
        if (navLinks.classList.contains('active')) {
          navLinks.classList.remove('active');
          mobileMenu.classList.remove('open');
        }
      });
    });
  }
}

// ==================== DEMO DATA ====================
function loadDemoData() {
  const url = "assets/data/sample_data.json";
  fetch(url)
    .then(res => res.json())
    .then(data => {
      if (data.stats) renderStats(data.stats);
      if (data.samples) renderPortfolioSamples(data.samples);
    })
    .catch(err => console.error("Could not load demo data:", err));
}

function renderStats(stats) {
  const container = document.getElementById('stats');
  if (!container) return;
  container.innerHTML = '';
  stats.forEach(s => {
    const card = document.createElement('div');
    card.className = 'stat-card';
    card.innerHTML = `
      <h3>${s.platform}</h3>
      <p class="stat-number" data-target="${s.count}">0</p>
      <p class="muted">${s.note || ''}</p>
    `;
    container.appendChild(card);
  });
  animateCounters();
}

function animateCounters() {
  const els = document.querySelectorAll('.stat-number');
  els.forEach(el => {
    const target = parseInt(el.dataset.target, 10) || 0;
    const duration = 1200;
    const stepTime = Math.max(20, Math.floor(duration / Math.max(1, target)));
    let current = 0;
    const step = () => {
      current += Math.max(1, Math.floor(target / (duration / stepTime)));
      if (current >= target) {
        el.textContent = target.toLocaleString();
      } else {
        el.textContent = current.toLocaleString();
        setTimeout(step, stepTime);
      }
    };
    step();
  });
}

function renderPortfolioSamples(samples) {
  const container = document.getElementById('portfolio-items');
  if (!container) return;
  container.innerHTML = '';
  samples.forEach(s => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <img src="${s.image}" alt="${escapeHtml(s.title)}">
      <h4>${escapeHtml(s.title)}</h4>
      <p>${escapeHtml(s.description)}</p>
      <p style="margin-top:8px"><a class="btn" href="${s.link}" target="_blank">View Content</a></p>
    `;
    container.appendChild(card);
  });
}

// ==================== CONTACT FORM ====================
function setupContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const subject = document.getElementById('subject').value.trim();
    const message = document.getElementById('message').value.trim();

    const formspreeEndpoint = "https://formspree.io/f/movknraw";

    fetch(formspreeEndpoint, {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, subject, message })
    })
    .then(res => {
      if (res.ok) {
        alert("Message sent successfully!");
        form.reset();
      } else {
        alert("Oops! Something went wrong.");
      }
    })
    .catch(err => {
      console.error("Form submission error:", err);
      alert("Error sending message. Try again later.");
    });
  });
}

// ==================== ADVANCED CHATBOT ====================
document.addEventListener("DOMContentLoaded", () => {
  const chatbotIcon = document.getElementById("chatbot-icon");
  const chatbotBody = document.getElementById("chatbot-body");
  const chatbotClose = document.getElementById("chatbot-close");
  const chatOutput = document.getElementById("chat-output");
  const chatInput = document.getElementById("chat-input");
  const sendBtn = document.getElementById("send-btn");

  chatbotIcon.addEventListener("click", () => chatbotBody.classList.toggle("show"));
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
      "Joining is easy! Just sign up, customize your page, and you're good to go. 🚀",
      "You can join by creating a free influencer page and showcasing your talent!",
      "Set up your profile in minutes and start attracting brands instantly!"
    ],
    brandDeals: [
      "Once your profile’s live, brands can reach out directly for collaborations. 💼",
      "We help you connect with verified brands that fit your style.",
      "After joining, you’ll start getting brand visibility and collab requests!"
    ],
    services: [
      "We offer influencer websites, portfolios, branding, SEO, and analytics — everything you need to stand out!",
      "Our platform helps you with personalized pages, brand collaborations, and performance tracking.",
      "We make influencer marketing easy — from portfolio setup to sponsorships."
    ],
    pricing: [
      "We’ve got flexible plans, from a free profile to advanced premium options. 💎",
      "You can start free and upgrade later as you grow — simple and transparent.",
      "Want specific pricing for website or brand packages?"
    ],
    contact: [
      "You can reach us at 8986923909 📞 or by email anytime!",
      "Need support? Call us or drop an email — we're quick to respond!",
      "You can always message us here or contact 8986923909 for direct help."
    ],
    portfolio: [
      "You can showcase your best content — reels, posts, stories, and more — all in one clean page.",
      "Your portfolio is your personal brand space — show the best of your creativity!",
      "You can upload visuals, videos, and brand collabs for brands to explore."
    ],
    analytics: [
      "Analytics show your performance — engagement, reach, clicks, and audience trends.",
      "You can track how your content performs and which posts attract brands.",
      "Our analytics dashboard gives you clear insights into your influence growth."
    ],
    seo: [
      "We optimize your page for search engines — so brands find you faster.",
      "SEO ensures your profile ranks better and attracts the right audience.",
      "We handle discoverability so you can focus on content."
    ],
    privacy: [
      "Your data and content are 100% secure — you control what’s visible to brands.",
      "We take privacy seriously. Nothing is shared without your permission.",
      "Your information stays private, always."
    ],
    support: [
      "Our team is here 24/7 for you — chat, call, or email anytime.",
      "Need guidance? We’re always just a message away.",
      "We love helping creators — reach out and we’ll sort it fast!"
    ],
    followUpPricing: "Since you’re joining, our plans start from free and scale with your growth — no pressure upgrades! 💡",
    followUpBrand: "After joining, you’ll be visible to brands who can directly contact you — just keep your page updated!",
    default: [
      "Hmm 🤔 I didn’t get that. Try asking about joining, pricing, services, or collaborations!",
      "Could you rephrase that? I can help with joining, pricing, or brand info!",
      "Not sure I caught that — wanna know about plans, joining, or services?"
    ]
  };

  // ===== Topic Detection =====
  const topicMap = {
    hi: "greetings", hello: "greetings", hey: "greetings",
    join: "join", signup: "join", register: "join", "create profile": "join",
    "brand deal": "brandDeals", "brand": "brandDeals", "collab": "brandDeals",
    services: "services", offerings: "services", features: "services",
    pricing: "pricing", cost: "pricing", plans: "pricing", "how much": "pricing",
    contact: "contact", phone: "contact", email: "contact", support: "support",
    portfolio: "portfolio", analytics: "analytics", seo: "seo",
    privacy: "privacy"
  };

  function randomReply(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  // ===== Improved Context-Aware Logic =====
  function getBotReply(message) {
    const msg = message.toLowerCase();
    let detectedTopic = "";

    for (let key in topicMap) {
      if (msg.includes(key)) {
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
  function sendMessage() {
    const userMessage = chatInput.value.trim();
    if (!userMessage) return;
    addMessage(userMessage, "user");
    chatInput.value = "";

    const typingMsg = document.createElement("p");
    typingMsg.classList.add("bot-message", "typing");
    typingMsg.textContent = "";
    chatOutput.appendChild(typingMsg);
    chatOutput.scrollTop = chatOutput.scrollHeight;

    setTimeout(() => {
      typingMsg.remove();
      addMessage(getBotReply(userMessage), "bot");
    }, 800 + Math.random() * 600);
  }

  sendBtn.addEventListener("click", sendMessage);
  chatInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
  });
});

// for ai powerd recomendations
document.addEventListener("DOMContentLoaded", function () {
  const openButton = document.getElementById("openAIButton");
  const aiSection = document.getElementById("aiAppSection");

  openButton.addEventListener("click", function () {
    aiSection.style.display = "block";
    window.scrollTo({
      top: aiSection.offsetTop,
      behavior: "smooth",
  
    });
  });
});
