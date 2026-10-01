/* TCG Vault theme — vanilla JS, no dependencies. */
(function () {
  'use strict';

  /* ---------- Auto-submit selects / checkboxes (currency selector, sort, filters) ---------- */
  document.addEventListener('change', function (event) {
    var el = event.target;
    if (el.matches && el.matches('[data-autosubmit]') && el.form) {
      el.form.submit();
    }
  });

  /* ---------- Quantity +/- buttons ---------- */
  document.addEventListener('click', function (event) {
    var button = event.target.closest('[data-qty-minus], [data-qty-plus]');
    if (!button) return;
    var wrapper = button.closest('.quantity');
    var input = wrapper && wrapper.querySelector('[data-qty-input]');
    if (!input) return;
    var step = button.hasAttribute('data-qty-plus') ? 1 : -1;
    var min = input.min !== '' ? parseInt(input.min, 10) : 0;
    var max = input.max !== '' ? parseInt(input.max, 10) : Infinity;
    var value = (parseInt(input.value, 10) || 0) + step;
    value = Math.max(min, Math.min(max, value));
    if (String(value) !== input.value) {
      input.value = value;
      input.dispatchEvent(new Event('change', { bubbles: true }));
    }
  });

  /* ---------- Cart: update totals as soon as a quantity changes ---------- */
  var cartForm = document.querySelector('[data-cart-form]');
  if (cartForm) {
    var cartTimer;
    cartForm.addEventListener('change', function (event) {
      if (!event.target.matches('[data-cart-qty]')) return;
      var input = event.target;
      var max = input.max !== '' ? parseInt(input.max, 10) : Infinity;
      if (parseInt(input.value, 10) > max) input.value = max;
      if (parseInt(input.value, 10) < 0 || input.value === '') input.value = 0;
      clearTimeout(cartTimer);
      cartTimer = setTimeout(function () {
        cartForm.classList.add('is-loading');
        // Posting to /cart without "checkout" updates quantities and reloads the cart,
        // so every amount is recalculated by Shopify in the active currency.
        HTMLFormElement.prototype.submit.call(cartForm);
      }, 400);
    });
  }

  /* ---------- Product page: variant picker (card / pack) ---------- */
  document.querySelectorAll('[data-product-section]').forEach(function (section) {
    var jsonEl = section.querySelector('[data-product-json]');
    if (!jsonEl) return;
    var data;
    try {
      data = JSON.parse(jsonEl.textContent);
    } catch (e) {
      return;
    }

    var form = section.querySelector('[data-product-form]');
    var idInput = section.querySelector('[data-variant-id]');
    var priceEl = section.querySelector('[data-price]');
    var compareEl = section.querySelector('[data-compare-price]');
    var unitEl = section.querySelector('[data-price-unit]');
    var specUnit = section.querySelector('[data-spec-unit]');
    var specSku = section.querySelector('[data-spec-sku]');
    var stockEl = section.querySelector('[data-stock]');
    var qtyInput = section.querySelector('[data-qty-input]');
    var addButton = section.querySelector('[data-add-to-cart]');
    var errorEl = section.querySelector('[data-form-error]');
    var mainMedia = section.querySelector('[data-main-media]');
    var strings = window.TCG_STRINGS || {};
    var optionIndex = (data.options || []).map(function (n) { return String(n).toLowerCase().trim(); }).indexOf(data.optionName);

    function selectedOptions() {
      var values = [];
      section.querySelectorAll('.variant-picker__input:checked').forEach(function (input) {
        values[parseInt(input.dataset.optionIndex, 10)] = input.value;
      });
      return values;
    }

    function findVariant(values) {
      return data.variants.find(function (variant) {
        return variant.options.every(function (value, i) { return value === values[i]; });
      });
    }

    function showMedia(mediaId) {
      if (!mainMedia || !mediaId) return;
      var thumb = section.querySelector('[data-thumb][data-media-id="' + mediaId + '"]');
      if (thumb) setMainImage(thumb);
    }

    function setMainImage(thumb) {
      var img = mainMedia.querySelector('img');
      if (!img) return;
      img.src = thumb.dataset.src;
      img.srcset = thumb.dataset.srcset;
      img.alt = thumb.dataset.alt;
      section.querySelectorAll('[data-thumb]').forEach(function (t) { t.classList.toggle('is-active', t === thumb); });
    }

    section.querySelectorAll('[data-thumb]').forEach(function (thumb) {
      thumb.addEventListener('click', function () { setMainImage(thumb); });
    });

    function update() {
      var values = selectedOptions();
      var variant = findVariant(values);
      if (errorEl) errorEl.hidden = true;

      if (!variant) {
        addButton.disabled = true;
        addButton.textContent = strings.unavailable || 'Unavailable';
        if (stockEl) stockEl.innerHTML = '<span class="stock stock--out">' + (strings.unavailable || 'Unavailable') + '</span>';
        return;
      }

      idInput.value = variant.id;
      if (priceEl) priceEl.textContent = variant.price;
      if (compareEl) {
        compareEl.textContent = variant.compareAtPrice || '';
        compareEl.hidden = !variant.compareAtPrice;
      }
      if (optionIndex > -1) {
        var unit = String(variant.options[optionIndex]).toLowerCase();
        if (unitEl) unitEl.textContent = '/ ' + unit;
        if (specUnit) specUnit.textContent = unit;
      }
      if (specSku) specSku.textContent = variant.sku || '—';

      if (stockEl) {
        var html;
        if (!variant.available) {
          html = '<span class="stock stock--out">' + (strings.soldOut || 'Sold out') + '</span>';
        } else if (variant.tracked && variant.inventory <= data.lowStock) {
          html = '<span class="stock stock--low">' + (strings.lowStock || 'Only [count] left').replace('[count]', variant.inventory) + '</span>';
        } else {
          html = '<span class="stock stock--in">' + (strings.inStock || 'In stock') + '</span>';
        }
        stockEl.innerHTML = html;
      }

      if (qtyInput) {
        if (variant.tracked && variant.inventory > 0) {
          qtyInput.max = variant.inventory;
          if (parseInt(qtyInput.value, 10) > variant.inventory) qtyInput.value = variant.inventory;
        } else {
          qtyInput.removeAttribute('max');
        }
      }

      addButton.disabled = !variant.available;
      addButton.textContent = variant.available ? (strings.addToCart || 'Add to cart') : (strings.soldOut || 'Sold out');

      showMedia(variant.mediaId);

      var url = new URL(window.location.href);
      url.searchParams.set('variant', variant.id);
      window.history.replaceState({}, '', url.toString());
    }

    section.addEventListener('change', function (event) {
      if (event.target.matches('.variant-picker__input')) update();
    });

    if (form) {
      form.addEventListener('submit', function (event) {
        if (!qtyInput) return;
        var qty = parseInt(qtyInput.value, 10);
        var max = qtyInput.max !== '' ? parseInt(qtyInput.max, 10) : Infinity;
        var message = '';
        if (!qty || qty < 1) {
          message = strings.qtyMin || 'Quantity must be at least 1.';
        } else if (qty > max) {
          message = (strings.qtyMax || 'Only [count] available.').replace('[count]', max);
        }
        if (message) {
          event.preventDefault();
          if (errorEl) {
            errorEl.textContent = message;
            errorEl.hidden = false;
          }
        }
      });
    }
  });

  /* ---------- Wholesale form validation (English messages for international buyers) ---------- */
  document.querySelectorAll('[data-validate-form]').forEach(function (form) {
    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    function fieldError(field) {
      if (field.matches('[data-required-group]')) {
        return field.querySelector('input:checked') ? '' : field.dataset.error;
      }
      var value = field.value.trim();
      if (field.required && !value) return field.dataset.error || 'This field is required.';
      if (field.type === 'email' && value && !emailPattern.test(value)) return field.dataset.error;
      if (field.minLength > 0 && value && value.length < field.minLength) return field.dataset.error;
      return '';
    }

    function show(field, message) {
      var wrapper = field.closest('.field');
      var errorEl = wrapper && wrapper.querySelector('.field__error');
      if (wrapper) wrapper.classList.toggle('field--invalid', !!message);
      if (!field.matches('[data-required-group]')) field.setAttribute('aria-invalid', message ? 'true' : 'false');
      if (errorEl) {
        errorEl.textContent = message;
        errorEl.hidden = !message;
      }
    }

    var fields = form.querySelectorAll('input[required]:not([type="radio"]), select[required], textarea[required], [data-required-group]');

    fields.forEach(function (field) {
      var target = field.matches('[data-required-group]') ? field : field;
      target.addEventListener('change', function () { show(field, fieldError(field)); });
      if (!field.matches('[data-required-group]')) {
        field.addEventListener('blur', function () { if (field.value) show(field, fieldError(field)); });
      }
    });

    form.addEventListener('submit', function (event) {
      var firstInvalid = null;
      fields.forEach(function (field) {
        var message = fieldError(field);
        show(field, message);
        if (message && !firstInvalid) firstInvalid = field;
      });
      if (firstInvalid) {
        event.preventDefault();
        var focusTarget = firstInvalid.matches('[data-required-group]') ? firstInvalid.querySelector('input') : firstInvalid;
        if (focusTarget) focusTarget.focus();
      }
    });
  });

  /* ---------- Close desktop dropdowns / drawer when clicking outside ---------- */
  document.addEventListener('click', function (event) {
    document.querySelectorAll('[data-dropdown][open], [data-menu-drawer][open]').forEach(function (details) {
      if (!details.contains(event.target)) details.removeAttribute('open');
    });
  });
  document.addEventListener('keyup', function (event) {
    if (event.key !== 'Escape') return;
    document.querySelectorAll('[data-dropdown][open], [data-menu-drawer][open]').forEach(function (details) {
      details.removeAttribute('open');
      var summary = details.querySelector('summary');
      if (summary) summary.focus();
    });
  });

  /* ---------- Customer pages helpers ---------- */
  document.querySelectorAll('select[data-default]').forEach(function (select) {
    if (select.dataset.default) select.value = select.dataset.default;
  });
  document.addEventListener('click', function (event) {
    var confirmButton = event.target.closest('[data-confirm]');
    if (confirmButton && !window.confirm(confirmButton.dataset.confirm)) event.preventDefault();

    var toggle = event.target.closest('[data-toggle-recover]');
    if (toggle) {
      event.preventDefault();
      var recover = document.getElementById('recover');
      var login = document.getElementById('login');
      if (recover && login) {
        var showRecover = recover.hidden;
        recover.hidden = !showRecover;
        login.hidden = showRecover;
      }
    }
  });
  if (window.location.hash === '#recover') {
    var recoverBox = document.getElementById('recover');
    var loginBox = document.getElementById('login');
    if (recoverBox && loginBox) {
      recoverBox.hidden = false;
      loginBox.hidden = true;
    }
  }
})();
