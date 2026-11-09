(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', async function () {
    var file = document.body.dataset.contentFile;
    if (!file) return;

    try {
      var response = await fetch('/content/de/' + encodeURIComponent(file) + '.json');
      if (!response.ok) {
        throw new Error('Could not load ' + file + ' content: HTTP ' + response.status);
      }

      var content = await response.json();
      document.querySelectorAll('[data-i18n]').forEach(function (element) {
        var value = content[element.dataset.i18n];
        if (typeof value === 'string') element.textContent = value;
      });

      var title = content[document.body.dataset.pageTitleKey];
      if (typeof title === 'string' && title.trim()) document.title = title.trim();
    } catch (error) {
      console.error('System page content could not be loaded from the CMS file.', error);
    }
  });
})();
