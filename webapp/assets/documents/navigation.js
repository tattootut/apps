/* Local navigation only. No profile, payment, consent or analytics writes. */
(function () {
  'use strict';
  const opener = document.getElementById('openDocuments');
  const dialog = document.getElementById('documentsDialog');
  const closer = document.getElementById('closeDocuments');
  if (!opener || !dialog || !closer) return;
  let previousFocus;
  let previousScroll;
  let previousOverflow;

  opener.addEventListener('click', function () {
    if (dialog.open) return;
    previousFocus = document.activeElement;
    previousScroll = { x: window.scrollX, y: window.scrollY };
    previousOverflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = 'hidden';
  });
  closer.addEventListener('click', function () { dialog.close(); });
  dialog.addEventListener('close', function () {
    document.body.style.overflow = previousOverflow;
    if (previousFocus && previousFocus.isConnected) previousFocus.focus({ preventScroll: true });
    if (previousScroll) window.scrollTo(previousScroll.x, previousScroll.y);
  });
  dialog.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function (event) {
      const webApp = window.Telegram && window.Telegram.WebApp;
      if (!webApp || typeof webApp.openLink !== 'function') return;
      try {
        webApp.openLink(link.href);
        event.preventDefault();
      } catch (_) {
        // Keep the ordinary external link usable if the Telegram API fails.
      }
    });
  });
})();
