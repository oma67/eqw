const englishHostRedirects = {
  "/machine-learning": "/en/document-classifier/",
  "/referenzen": "/en/",
  "/universal-process-tool": "/en/universal-process-tool/",
};

if (window.location.hostname === "en.exeqwork.company") {
  const normalizedPath = window.location.pathname.replace(/\/$/, "");
  const redirectTarget = englishHostRedirects[normalizedPath];
  if (redirectTarget) {
    window.location.replace(redirectTarget);
  }
}

const year = document.getElementById("year");
if (year) {
  year.textContent = new Date().getFullYear();
}

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.2 }
);

document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
