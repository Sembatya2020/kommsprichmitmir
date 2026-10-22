(function () {
  if (!window.CMS || !window.React) return;

  var h = window.React.createElement;

  function toData(entry) {
    var data = entry && entry.get && entry.get('data');
    return data && data.toJS ? data.toJS() : {};
  }

  function asArray(value) {
    return Array.isArray(value) ? value : [];
  }

  function htmlTag(tag, className, html) {
    return h(tag, {
      className: className,
      dangerouslySetInnerHTML: { __html: html || '' }
    });
  }

  function renderCards(cards, isPricing) {
    return asArray(cards).map(function (card, index) {
      var className = isPricing
        ? 'cms-preview-price-card' + (card && card.featured ? ' cms-preview-price-card--featured' : '')
        : 'cms-preview-service-card';

      if (isPricing) {
        return h('article', { className: className, key: 'price-' + index }, [
          h('div', { className: 'cms-preview-price-eyebrow', key: 'eyebrow' }, card && card.eyebrow ? card.eyebrow : ''),
          h('div', { className: 'cms-preview-price-amount', key: 'amount' }, [
            h('span', { className: 'cms-preview-price-currency', key: 'currency' }, card && card.currency ? card.currency : 'CHF'),
            h('span', { className: 'cms-preview-price-number', key: 'price' }, card && card.price ? card.price : ''),
            h('span', { className: 'cms-preview-price-unit', key: 'unit' }, card && card.unit ? card.unit : '')
          ]),
          htmlTag('p', 'cms-preview-price-desc', card && card.desc),
          h('div', { className: 'cms-preview-price-link', key: 'link' }, card && card.link_text ? card.link_text : '')
        ]);
      }

      return h('article', { className: className, key: 'service-' + index }, [
        h('h3', { className: 'cms-preview-card-title', key: 'title' }, card && card.title ? card.title : ''),
        htmlTag('p', 'cms-preview-card-desc', card && card.desc),
        h('div', { className: 'cms-preview-card-link', key: 'link' }, card && card.link_text ? card.link_text : '')
      ]);
    });
  }

  function renderTextBlocks(blocks) {
    return asArray(blocks)
      .filter(function (block) {
        return block && (block.type === 'text' || block.type === 'heading' || block.type === 'subheading' || block.type === 'quote');
      })
      .slice(0, 5)
      .map(function (block, index) {
        if (block.type === 'heading') return h('h3', { className: 'cms-preview-subheading', key: 'block-' + index }, block.text || '');
        if (block.type === 'subheading') return h('h4', { className: 'cms-preview-miniheading', key: 'block-' + index }, block.text || '');
        if (block.type === 'quote') return htmlTag('blockquote', 'cms-preview-quote', block.text);
        return htmlTag('p', 'cms-preview-paragraph', block.text);
      });
  }

  var pagePreviews = {
    beratung: {
      label: 'Beratung',
      labelEn: 'Counselling',
      title: 'beratung_page_title',
      heading: 'beratung_h1',
      subtitle: 'beratung_subtitle',
      blocks: ['beratung_blocks']
    },
    supervision: {
      label: 'Supervision',
      labelEn: 'Supervision',
      title: 'supervision_page_title',
      heading: 'supervision_h1',
      subtitle: 'supervision_subtitle',
      blocks: ['supervision_blocks']
    },
    preise: {
      label: 'Preise',
      labelEn: 'Pricing',
      title: 'preise_page_title',
      heading: 'preise_h1',
      subtitle: 'preise_subtitle',
      intro: 'preise_intro'
    },
    'ueber-mich': {
      label: 'Über mich',
      labelEn: 'About me',
      title: 'about_page_title',
      heading: 'about_h1',
      subtitle: 'about_subtitle',
      blocks: ['about_intro_blocks', 'about_personal_blocks', 'about_background_blocks']
    },
    kontakt: {
      label: 'Kontakt',
      labelEn: 'Contact',
      title: 'kontakt_page_title',
      heading: 'kontakt_h1',
      subtitle: 'kontakt_subtitle'
    },
    agb: {
      label: 'AGB',
      labelEn: 'Terms and conditions',
      title: 'agb_page_title',
      heading: 'agb_h1',
      blocks: ['agb_blocks']
    },
    datenschutz: {
      label: 'Datenschutz',
      labelEn: 'Privacy policy',
      title: 'datenschutz_page_title',
      heading: 'datenschutz_h1',
      blocks: ['datenschutz_blocks']
    },
    'nutzung-impressum': {
      label: 'Nutzung & Impressum',
      labelEn: 'Usage & Imprint',
      title: 'nutzung_page_title',
      heading: 'nutzung_h1',
      blocks: ['nutzung_blocks']
    },
    'allgemein-footer': {
      label: 'Allgemein & Footer',
      labelEn: 'General & Footer'
    }
  };

  function PagePreview(props, data, lang) {
    var slug = props.entry && props.entry.get && props.entry.get('slug');
    var page = pagePreviews[slug] || pagePreviews['allgemein-footer'];
    var blockContent = (page.blocks || []).reduce(function (all, key) {
      return all.concat(renderTextBlocks(data[key]));
    }, []);
    var title = data[page.title] || (lang === 'EN' ? page.labelEn : page.label);
    var heading = data[page.heading] || title;
    var subtitle = data[page.subtitle] || data[page.intro] || '';
    var sections = [];

    if (blockContent.length) {
      sections.push(h('section', { className: 'cms-preview-section', key: 'content' }, [
        h('div', { className: 'cms-preview-copy', key: 'copy' }, blockContent)
      ]));
    }

    if (slug === 'preise') {
      sections.push(h('section', { className: 'cms-preview-section', key: 'prices' }, [
        h('h2', { className: 'cms-preview-section-title', key: 'title' }, data.preise_h1 || 'Preise'),
        htmlTag('p', 'cms-preview-section-intro', data.preise_intro),
        h('div', { className: 'cms-preview-grid cms-preview-grid--pricing', key: 'grid' }, renderCards(data.preise_cards, true))
      ]));
    } else if (slug === 'kontakt' && asArray(data.kontakt_methods).length) {
      sections.push(h('section', { className: 'cms-preview-section', key: 'contact' }, [
        h('div', { className: 'cms-preview-grid cms-preview-grid--services', key: 'methods' },
          asArray(data.kontakt_methods).map(function (method, index) {
            return h('article', { className: 'cms-preview-service-card', key: 'method-' + index }, [
              h('h3', { className: 'cms-preview-card-title', key: 'title' }, method.title || ''),
              h('p', { className: 'cms-preview-card-desc', key: 'value' }, method.value || ''),
              h('p', { className: 'cms-preview-card-desc', key: 'note' }, method.note || '')
            ]);
          })
        )
      ]));
    } else if (slug === 'allgemein-footer' && data.footer_brand) {
      sections.push(h('section', { className: 'cms-preview-section', key: 'footer' }, [
        h('p', { className: 'cms-preview-footer-brand', key: 'brand' }, data.footer_brand)
      ]));
    }

    if (data.about_quote) {
      sections.push(h('section', { className: 'cms-preview-section', key: 'quote' }, [
        h('blockquote', { className: 'cms-preview-quote', key: 'text' }, data.about_quote)
      ]));
    }

    return h('div', { className: 'cms-preview-page' }, [
      h('header', { className: 'cms-preview-header', key: 'header' }, [
        h('div', { className: 'cms-preview-brand', key: 'brand' }, data.footer_logo || 'Komm · sprich · mit mir'),
        h('div', { className: 'cms-preview-lang', key: 'lang' }, lang)
      ]),
      h('section', { className: 'cms-preview-hero', key: 'hero' }, [
        h('div', { className: 'cms-preview-eyebrow', key: 'eyebrow' }, title),
        h('h1', { className: 'cms-preview-title', key: 'title' }, heading),
        h('p', { className: 'cms-preview-lead', key: 'subtitle' }, subtitle)
      ])
    ].concat(sections));
  }

  function ContentPreview(props) {
    var data = toData(props.entry);
    var collectionName = props.collection && props.collection.get && props.collection.get('name');
    var slug = props.entry && props.entry.get && props.entry.get('slug');
    var lang = collectionName === 'english' ? 'EN' : 'DE';

    if (slug !== 'startseite') {
      return PagePreview(props, data, lang);
    }

    var services = renderCards(data.services_cards, false);
    var prices = renderCards(data.preise_cards, true);

    return h('div', { className: 'cms-preview-page' }, [
      h('header', { className: 'cms-preview-header', key: 'header' }, [
        h('div', { className: 'cms-preview-brand', key: 'brand' }, data.footer_logo || 'Komm · sprich · mit mir'),
        h('div', { className: 'cms-preview-lang', key: 'lang' }, lang)
      ]),

      h('section', { className: 'cms-preview-hero', key: 'hero' }, [
        h('div', { className: 'cms-preview-eyebrow', key: 'eyebrow' }, data.hero_eyebrow || ''),
        htmlTag('h1', 'cms-preview-title', data.hero_h1),
        htmlTag('p', 'cms-preview-lead', data.hero_p),
        h('div', { className: 'cms-preview-actions', key: 'actions' }, [
          h('span', { className: 'cms-preview-btn cms-preview-btn--primary', key: 'btn1' }, data.hero_btn1 || ''),
          h('span', { className: 'cms-preview-btn cms-preview-btn--ghost', key: 'btn2' }, data.hero_btn2 || '')
        ])
      ]),

      h('section', { className: 'cms-preview-section', key: 'welcome' }, [
        h('div', { className: 'cms-preview-eyebrow', key: 'welcome-eyebrow' }, data.welcome_eyebrow || ''),
        h('h2', { className: 'cms-preview-section-title', key: 'welcome-title' }, data.welcome_h2 || ''),
        h('div', { className: 'cms-preview-copy', key: 'welcome-copy' }, renderTextBlocks(data.welcome_blocks))
      ]),

      h('section', { className: 'cms-preview-section', key: 'services' }, [
        h('div', { className: 'cms-preview-eyebrow', key: 'services-eyebrow' }, data.services_eyebrow || ''),
        h('h2', { className: 'cms-preview-section-title', key: 'services-title' }, data.services_h2 || ''),
        htmlTag('p', 'cms-preview-section-intro', data.services_p),
        h('div', { className: 'cms-preview-grid cms-preview-grid--services', key: 'services-grid' }, services)
      ]),

      h('section', { className: 'cms-preview-section', key: 'pricing' }, [
        h('div', { className: 'cms-preview-eyebrow', key: 'pricing-eyebrow' }, data.preise_subtitle || ''),
        h('h2', { className: 'cms-preview-section-title', key: 'pricing-title' }, data.preise_h1 || data.preise_page_title || ''),
        htmlTag('p', 'cms-preview-section-intro', data.preise_intro),
        h('div', { className: 'cms-preview-grid cms-preview-grid--pricing', key: 'pricing-grid' }, prices)
      ]),

      h('section', { className: 'cms-preview-section', key: 'gallery' }, [
        h('div', { className: 'cms-preview-eyebrow', key: 'gallery-eyebrow' }, data.gallery_eyebrow || ''),
        h('h2', { className: 'cms-preview-section-title', key: 'gallery-title' }, data.gallery_h2 || ''),
        htmlTag('p', 'cms-preview-section-intro', data.gallery_p)
      ]),

      h('footer', { className: 'cms-preview-footer', key: 'footer' }, [
        h('div', { className: 'cms-preview-footer-logo', key: 'footer-logo' }, data.footer_logo || 'Komm · sprich · mit mir'),
        htmlTag('p', 'cms-preview-footer-brand', data.footer_brand)
      ])
    ]);
  }

  window.CMS.registerPreviewStyle('preview.css');
  window.CMS.registerPreviewTemplate('deutsch', ContentPreview);
  window.CMS.registerPreviewTemplate('english', ContentPreview);
})();