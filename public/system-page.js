(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', async function () {
    var file = document.body.dataset.contentFile;
    if (!file) return;

    try {
      // Content baked into the page at build time is used first (no flash of
      // old text); the fetch is only a fallback.
      var baked = window.__CMS_CONTENT__ && window.__CMS_CONTENT__[file];
      var content = baked;
      if (!content) {
        var response = await fetch('/content/de/' + encodeURIComponent(file) + '.json');
        if (!response.ok) {
          throw new Error('Could not load ' + file + ' content: HTTP ' + response.status);
        }
        content = await response.json();
      }

      document.querySelectorAll('[data-i18n]').forEach(function (element) {
        var value = content[element.dataset.i18n];
        if (typeof value === 'string') element.textContent = value;
      });

      var title = content[document.body.dataset.pageTitleKey];
      if (typeof title === 'string' && title.trim()) document.title = title.trim();
    } catch (error) {
      console.error('System page content could not be loaded from the CMS file.', error);
    } finally {
      document.documentElement.classList.remove('cms-pending');
    }
  });
})();
