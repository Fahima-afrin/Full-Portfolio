// === Theme Toggle ===
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark-theme");
}
document.getElementById("theme-toggle").addEventListener("click", function () {
  document.body.classList.toggle("dark-theme");
  localStorage.setItem("theme", document.body.classList.contains("dark-theme") ? "dark" : "light");
});

// === Language Selector ===
document.getElementById("language-selector").addEventListener("change", function (event) {
  const selectedLanguage = event.target.value;
  alert(`Language changed to ${selectedLanguage}`);
});

// === Password Strength Indicator ===
const passwordInput = document.getElementById("signup-password");
const strengthBar = document.getElementById("signup-password-strength");
passwordInput?.addEventListener("input", function () {
  const val = passwordInput.value;
  let strength = 0;
  if (val.length > 5) strength += 20;
  if (val.match(/[A-Z]/)) strength += 20;
  if (val.match(/[0-9]/)) strength += 20;
  if (val.match(/[a-z]/)) strength += 20;
  if (val.match(/[!@#\$%\^&\*]/)) strength += 20;
  strengthBar.value = strength;
});

// === Section Tabs in Portfolio ===
function switchTab(targetId) {
  const sections = document.querySelectorAll(".portfolio-tab-section");
  sections.forEach(sec => sec.style.display = "none");
  document.getElementById(targetId).style.display = "block";
}

const tabButtons = ["tab-about", "tab-skills", "tab-education", "tab-experience", "tab-projects"];
tabButtons.forEach(id => {
  const btn = document.getElementById(id);
  if (btn) {
    btn.addEventListener("click", () => switchTab(btn.dataset.target));
  }
});

// === Login & Signup ===
function showLogin() {
  document.getElementById("login-form").style.display = "block";
  document.getElementById("signup-form").style.display = "none";
}
function showSignup() {
  document.getElementById("login-form").style.display = "none";
  document.getElementById("signup-form").style.display = "block";
}
document.getElementById("go-to-signup").addEventListener("click", showSignup);
document.getElementById("go-to-login").addEventListener("click", showLogin);

function showBlogOnly() {
  document.body.classList.add("login-mode");
  document.querySelector(".blog-section")?.style.setProperty("display", "block");
  document.getElementById("portfolio-form").style.display = "none";
  document.getElementById("blog-editor")?.style.setProperty("display", "none");
  showLogin();
}
function showPortfolio() {
  document.body.classList.remove("login-mode");
  document.querySelector(".blog-section")?.style.setProperty("display", "none");
  document.getElementById("portfolio-form").style.display = "block";
  document.getElementById("blog-editor")?.style.setProperty("display", "block");
  document.getElementById("login-form").style.display = "none";
  document.getElementById("signup-form").style.display = "none";
  document.getElementById("home-btn").style.display = "inline-block";
  document.getElementById("logout-btn").style.display = "inline-block";
  switchTab("about-section");
}

function handleAuth(formType) {
  const email = document.getElementById(`${formType}-email`).value;
  const password = document.getElementById(`${formType}-password`).value;
  if (formType === "signup") {
    const confirmPassword = document.getElementById("confirm-password").value;
    if (password !== confirmPassword) return alert("Passwords do not match.");
    alert("Sign up successful!");
  } else {
    if (!email || !password) return alert("Please enter valid credentials");
    alert("Logged in successfully!");
  }
  showPortfolio();
}
document.getElementById("login").addEventListener("submit", function (e) {
  e.preventDefault();
  handleAuth("login");
});
document.getElementById("signup").addEventListener("submit", function (e) {
  e.preventDefault();
  handleAuth("signup");
});

document.getElementById("logout-btn").addEventListener("click", function () {
  document.getElementById("portfolio").reset();
  showBlogOnly();
  document.getElementById("home-btn").style.display = "none";
  document.getElementById("logout-btn").style.display = "none";
  alert("Logged out successfully!");
});
document.getElementById("home-btn").addEventListener("click", function () {
  showBlogOnly();
  document.getElementById("home-btn").style.display = "none";
  document.getElementById("logout-btn").style.display = "none";
});

// === Work Experience Section ===
document.getElementById("add-work-experience").addEventListener("click", function () {
  const div = document.createElement("div");
  div.className = "work-experience-section";
  div.innerHTML = `
    <input type="text" placeholder="Company Name" required>
    <input type="text" placeholder="Job Duration" required>
    <textarea placeholder="Job Responsibilities" required></textarea>
    <button type="button" class="remove-section">Remove</button>`;
  div.querySelector(".remove-section").addEventListener("click", () => div.remove());
  document.getElementById("work-experience-container").appendChild(div);
});

// === Image Preview ===
document.getElementById("photo")?.addEventListener("change", function (e) {
  const file = e.target.files[0];
  const reader = new FileReader();
  reader.onloadend = function () {
    document.getElementById("image-preview").src = reader.result;
    window.uploadedImage = reader.result;
  };
  if (file) reader.readAsDataURL(file);
});

// === PDF Export (triggered by button in project section) ===
document.getElementById("download-pdf")?.addEventListener("click", function () {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  const getVal = id => document.getElementById(id)?.value || "";
  const name = getVal("full-name");
  const contact = getVal("contact-info");
  const linkedin = getVal("linkedin");
  const bio = getVal("bio");
  const soft = getVal("soft-skills");
  const tech = getVal("technical-skills");
  const inst = getVal("institute");
  const deg = getVal("degree");
  const year = getVal("year");
  const grade = getVal("grade");
  const projects = getVal("projects");
  let y = 10;
  doc.setFontSize(16);
  doc.text(`Resume / Portfolio: ${name}`, 10, y);
  y += 10;
  doc.setFontSize(12);
  doc.text(`Contact: ${contact}`, 10, y);
  y += 10;
  doc.text(`LinkedIn: ${linkedin}`, 10, y);
  y += 10;
  doc.text(`Bio: ${bio}`, 10, y);
  y += 10;
  doc.text(`Soft Skills: ${soft}`, 10, y);
  y += 10;
  doc.text(`Technical Skills: ${tech}`, 10, y);
  y += 10;
  doc.text(`Education: ${inst}, ${deg}, ${year}, Grade: ${grade}`, 10, y);
  y += 10;
  doc.text(`Work Experience:`, 10, y);
  y += 10;
  document.querySelectorAll(".work-experience-section").forEach(section => {
    const [company, duration, resp] = section.querySelectorAll("input, textarea");
    doc.text(`- ${company.value} (${duration.value})`, 10, y);
    y += 10;
    doc.text(`  ${resp.value}`, 10, y);
    y += 10;
  });
  doc.text(`Projects & Publications:`, 10, y);
  y += 10;
  doc.text(projects, 10, y);
  y += 10;
  if (window.uploadedImage) doc.addImage(window.uploadedImage, 'JPEG', 140, 10, 50, 50);
  doc.save("Professional_Portfolio.pdf");

  // Auto-scroll to preview
  document.getElementById("portfolio-preview")?.scrollIntoView({ behavior: "smooth" });
  alert("Resume-style PDF exported successfully!");
  alert("Resume-style PDF exported successfully!");
});

// === Form Submission (optional action for preview or analytics) ===
document.getElementById("portfolio").addEventListener("submit", function (e) {
  e.preventDefault();
  alert("Portfolio data saved. You may now download the PDF from the Projects tab.");
});

// === Blog Editor ===
const blogForm = document.getElementById("new-blog-form");
blogForm?.addEventListener("submit", function (e) {
  e.preventDefault();
  const title = document.getElementById("blog-title").value;
  const content = document.getElementById("blog-content").value;
  const newPost = document.createElement("div");
  newPost.className = "blog-post";
  newPost.innerHTML = `<h3>${title}</h3><p>${content}</p>`;
  document.querySelector(".blog-section").prepend(newPost);
  blogForm.reset();
  alert("Blog post published!");
});

// === Default View ===
showBlogOnly();