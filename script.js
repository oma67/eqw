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

const formatEuro = new Intl.NumberFormat("de-DE", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

const formatNumber = new Intl.NumberFormat("de-DE", {
  maximumFractionDigits: 0,
});

const formatDecimal = new Intl.NumberFormat("de-DE", {
  maximumFractionDigits: 1,
});

document.querySelectorAll("[data-cc-roi]").forEach((calculator) => {
  const inputs = Object.fromEntries(
    Array.from(calculator.querySelectorAll("[data-roi-input]")).map((input) => [
      input.dataset.roiInput,
      input,
    ])
  );
  const outputs = Object.fromEntries(
    Array.from(calculator.querySelectorAll("[data-roi-output]")).map((output) => [
      output.dataset.roiOutput,
      output,
    ])
  );

  const readValue = (name) => {
    const value = Number.parseFloat(inputs[name]?.value || "0");
    return Number.isFinite(value) && value > 0 ? value : 0;
  };

  const updateRoi = () => {
    const requests = readValue("requests");
    const employees = Math.max(readValue("employees"), 1);
    const hours = readValue("hours");
    const hourlyRate = readValue("hourlyRate");
    const initialCost = 20000;
    const annualMaintenanceRate = 0.2;
    const usageYears = 5;
    const remainingEffortShare = 0.2;
    const automationShare = 1 - remainingEffortShare;
    const annualCost = initialCost / usageYears + initialCost * annualMaintenanceRate;
    const monthlyCost = annualCost / 12;

    const hoursSaved = requests * hours * automationShare;
    const weeklyHours = hoursSaved / employees / 46;
    const fteSaved = hoursSaved / 1748;
    const grossSavings = hoursSaved * hourlyRate;
    const netSavings = grossSavings - annualCost;
    const monthlyGrossSavings = grossSavings / 12;
    const paybackMonths = monthlyGrossSavings > 0 ? initialCost / monthlyGrossSavings : 0;

    outputs.hoursSaved.textContent = `${formatNumber.format(hoursSaved)} h`;
    outputs.weeklyHours.textContent = `${formatDecimal.format(weeklyHours)} h`;
    outputs.fteSaved.textContent = `${formatDecimal.format(fteSaved)} FTE`;
    outputs.grossSavings.textContent = formatEuro.format(grossSavings);
    outputs.monthlyCost.textContent = formatEuro.format(monthlyCost);
    outputs.paybackMonths.textContent = `${formatDecimal.format(paybackMonths)} Monate`;
    outputs.totalPotential.textContent = formatEuro.format(netSavings);
  };

  Object.values(inputs).forEach((input) => input.addEventListener("input", updateRoi));
  updateRoi();
});

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
