(function () {
  var measurementId = "G-R0ZDNRNPEF";
  var storageKey = "eqw_analytics_consent";
  var consent = getStoredConsent();
  var lang = (document.documentElement.lang || "de").slice(0, 2);
  var scriptUrl = new URL(document.currentScript.src);
  var siteRoot = scriptUrl.href.replace(/analytics-consent\.js(?:\?.*)?$/, "");

  var copy = {
    de: {
      title: "Besucherstatistik",
      text:
        "Wir verwenden Google Analytics nur mit Ihrer Zustimmung, um Seitenaufrufe und die Nutzung unserer Website auszuwerten.",
      accept: "Akzeptieren",
      decline: "Ablehnen",
      privacy: "Datenschutzerklaerung",
      privacyPath: "disclaimer-haftungsausschluss/",
    },
    en: {
      title: "Visitor statistics",
      text:
        "We use Google Analytics only with your consent to evaluate page views and website usage.",
      accept: "Accept",
      decline: "Decline",
      privacy: "Privacy statement",
      privacyPath: "en/privacy-statement/",
    },
    fr: {
      title: "Statistiques de visite",
      text:
        "Nous utilisons Google Analytics uniquement avec votre consentement afin d'evaluer les pages vues et l'utilisation du site.",
      accept: "Accepter",
      decline: "Refuser",
      privacy: "Confidentialite",
      privacyPath: "fr/confidentialite/",
    },
  };

  var t = copy[lang] || copy.de;

  function getStoredConsent() {
    try {
      return localStorage.getItem(storageKey);
    } catch (error) {
      return null;
    }
  }

  function setStoredConsent(value) {
    try {
      localStorage.setItem(storageKey, value);
    } catch (error) {
      // If storage is blocked, keep the decision for the current page only.
    }
  }

  function loadAnalytics() {
    if (window.gtag) return;

    window.dataLayer = window.dataLayer || [];
    window.gtag = function () {
      window.dataLayer.push(arguments);
    };

    window.gtag("js", new Date());
    window.gtag("config", measurementId, { anonymize_ip: true });

    var script = document.createElement("script");
    script.async = true;
    script.src = "https://www.googletagmanager.com/gtag/js?id=" + measurementId;
    document.head.appendChild(script);
  }

  function removeBanner() {
    var banner = document.querySelector(".analytics-consent");
    if (banner) banner.remove();
  }

  function saveConsent(value) {
    setStoredConsent(value);
    removeBanner();
    if (value === "granted") loadAnalytics();
  }

  function showBanner() {
    var banner = document.createElement("section");
    banner.className = "analytics-consent";
    banner.setAttribute("aria-label", t.title);
    banner.innerHTML =
      '<div class="analytics-consent-copy">' +
      "<strong>" +
      t.title +
      "</strong>" +
      "<p>" +
      t.text +
      ' <a href="' +
      siteRoot +
      t.privacyPath +
      '">' +
      t.privacy +
      "</a></p>" +
      "</div>" +
      '<div class="analytics-consent-actions">' +
      '<button type="button" class="btn btn-secondary" data-analytics-choice="denied">' +
      t.decline +
      "</button>" +
      '<button type="button" class="btn btn-primary" data-analytics-choice="granted">' +
      t.accept +
      "</button>" +
      "</div>";

    banner.addEventListener("click", function (event) {
      var button = event.target.closest("[data-analytics-choice]");
      if (!button) return;
      saveConsent(button.getAttribute("data-analytics-choice"));
    });

    document.body.appendChild(banner);
  }

  if (consent === "granted") {
    loadAnalytics();
    return;
  }

  if (consent !== "denied") {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", showBanner);
    } else {
      showBanner();
    }
  }
})();
