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

const contactEndpoint = window.EXEQWORK_CONTACT_ENDPOINT || "";

document.querySelectorAll("[data-contact-form]").forEach((form) => {
  const status = form.querySelector("[data-form-status]");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (form.elements.website && form.elements.website.value) {
      return;
    }

    if (!contactEndpoint) {
      status.textContent = form.dataset.errorMessage;
      status.className = "form-status is-error";
      return;
    }

    const submitButton = form.querySelector('button[type="submit"]');
    const previousLabel = submitButton ? submitButton.textContent : "";
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = form.dataset.submittingMessage || previousLabel;
    }

    try {
      const payload = Object.fromEntries(new FormData(form));
      payload._subject = "Neue Kontaktformular-Anfrage von exeqwork.company";
      payload._template = "table";
      payload._captcha = "true";
      payload._honey = payload.website || "";
      payload._url = window.location.href;
      delete payload.website;

      const response = await fetch(contactEndpoint, {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Contact form request failed");
      }

      form.reset();
      status.textContent = form.dataset.successMessage;
      status.className = "form-status is-success";
      if (form.dataset.successUrl) {
        window.location.assign(form.dataset.successUrl);
      }
    } catch (error) {
      status.textContent = form.dataset.errorMessage;
      status.className = "form-status is-error";
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = previousLabel;
      }
    }
  });
});
