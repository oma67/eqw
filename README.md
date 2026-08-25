# ExeQwork Website

Statische Website fuer ExeQwork.

## Struktur

- `index.html`: deutsche Startseite
- `en/`: englische Sprachversion
- `fr/`: franzoesische Sprachversion
- `assets/`: Bilder und Referenzlogos
- `styles.css`: globales Styling
- `script.js`: kleine Frontend-Initialisierung

Die Website benoetigt keinen Build-Prozess und kann als statische Website auf jedem normalen Webserver ausgeliefert werden.

## Kontaktformular

Die Kontaktseiten senden per JavaScript an `window.EXEQWORK_CONTACT_ENDPOINT`.
Der Endpoint wird zentral in `contact-config.js` gesetzt und sollte auf einen
Formularanbieter, eine Serverless Function oder eine eigene API zeigen. Die
Empfaenger-Mailadresse wird dadurch nicht im HTML veroeffentlicht.

Nach erfolgreichem Versand leiten alle Sprachversionen auf dieselbe
Conversion-URL weiter: `https://exeqwork.company/kontakt/danke/`.
