(() => {
  const menuButton = document.querySelector('.menu-toggle');
  const mobileNav = document.getElementById('MobileNav');
  if (menuButton && mobileNav) menuButton.addEventListener('click', () => {
    const expanded = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!expanded));
    mobileNav.hidden = expanded;
    document.body.classList.toggle('menu-open', !expanded);
  });
  document.querySelectorAll('.desktop-nav, .mobile-nav').forEach((nav) => {
    const seen = new Set();
    nav.querySelectorAll('a[href]').forEach((link) => {
      const url = new URL(link.href, window.location.origin);
      const destination = url.pathname + url.search;
      if (seen.has(destination)) link.remove();
      else seen.add(destination);
    });
  });
  if (mobileNav) mobileNav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
    mobileNav.hidden = true;
    menuButton?.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
  }));

  const searchLayer = document.getElementById('IVSearch');
  const searchInput = document.querySelector('[data-predictive-input]');
  const searchForm = document.querySelector('[data-predictive-form]');
  const resultsPanel = document.querySelector('[data-predictive-results]');
  let searchTimer;
  let activeController;
  const openSearch = () => {
    if (!searchLayer) return;
    searchLayer.hidden = false;
    document.body.classList.add('search-open');
    window.requestAnimationFrame(() => searchInput?.focus());
  };
  const closeSearch = () => {
    if (!searchLayer) return;
    searchLayer.hidden = true;
    document.body.classList.remove('search-open');
    if (searchInput) searchInput.value = '';
    if (resultsPanel) resultsPanel.innerHTML = '<span>POPULAR CATEGORIES</span><div><a href="/collections/creatine">CREATINE</a><a href="/collections/pre-workout">PRE-WORKOUT</a><a href="/collections/supplements">SUPPLEMENTS</a></div>';
  };
  document.querySelectorAll('[data-search-open]').forEach((button) => button.addEventListener('click', openSearch));
  document.querySelectorAll('[data-search-close]').forEach((button) => button.addEventListener('click', closeSearch));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && searchLayer && !searchLayer.hidden) closeSearch();
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      openSearch();
    }
  });
  const renderPredictiveResults = (products, query) => {
    if (!resultsPanel) return;
    resultsPanel.replaceChildren();
    const heading = document.createElement('span');
    heading.textContent = products.length ? 'MATCHING PRODUCTS' : 'NO PRODUCTS FOUND';
    resultsPanel.append(heading);
    if (!products.length) {
      const empty = document.createElement('p');
      empty.className = 'iv-search-empty';
      empty.textContent = 'No matches for “' + query + '”. Try another product or brand.';
      resultsPanel.append(empty);
      return;
    }
    const list = document.createElement('div');
    list.className = 'iv-search-results';
    products.forEach((product) => {
      const link = document.createElement('a');
      link.className = 'iv-search-result';
      link.href = product.url;
      if (product.featured_image?.url) {
        const image = document.createElement('img');
        image.src = product.featured_image.url;
        image.alt = product.featured_image.alt || product.title;
        image.loading = 'lazy';
        link.append(image);
      }
      const copy = document.createElement('span');
      copy.className = 'iv-search-result-copy';
      const title = document.createElement('strong');
      title.textContent = product.title;
      const vendor = document.createElement('small');
      vendor.textContent = product.vendor || 'IRON VAULT';
      copy.append(title, vendor);
      link.append(copy);
      if (product.price) {
        const price = document.createElement('b');
        price.textContent = product.price;
        link.append(price);
      }
      list.append(link);
    });
    resultsPanel.append(list);
  };
  if (searchInput && resultsPanel && searchLayer) {
    searchInput.addEventListener('input', () => {
      const query = searchInput.value.trim();
      window.clearTimeout(searchTimer);
      activeController?.abort();
      if (query.length < 2) {
        resultsPanel.innerHTML = '<span>POPULAR CATEGORIES</span><div><a href="/collections/creatine">CREATINE</a><a href="/collections/pre-workout">PRE-WORKOUT</a><a href="/collections/supplements">SUPPLEMENTS</a></div>';
        return;
      }
      searchTimer = window.setTimeout(async () => {
        activeController = new AbortController();
        const url = new URL(searchLayer.dataset.predictiveUrl, window.location.origin);
        url.searchParams.set('q', query);
        url.searchParams.set('resources[type]', 'product');
        url.searchParams.set('resources[limit]', '6');
        url.searchParams.set('resources[options][unavailable_products]', 'hide');
        url.searchParams.set('resources[options][fields]', 'title,product_type,variants.title,vendor');
        try {
          const response = await fetch(url.toString(), { signal: activeController.signal, headers: { Accept: 'application/json' } });
          if (!response.ok) throw new Error('Predictive search request failed');
          const data = await response.json();
          const products = data.resources?.results?.products || [];
          renderPredictiveResults(products, query);
        } catch (error) {
          if (error.name !== 'AbortError') {
            resultsPanel.innerHTML = '<span>SEARCH PRODUCTS</span><p class="iv-search-empty">Live suggestions are unavailable. Press Enter to see all results.</p>';
          }
        }
      }, 220);
    });
    searchForm?.addEventListener('submit', (event) => {
      if (!searchInput.value.trim()) {
        event.preventDefault();
        searchInput.focus();
      }
    });
  }

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reducedMotion && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
    }), { threshold: 0.12 });
    document.querySelectorAll('[data-reveal]').forEach((node) => observer.observe(node));
  }
  document.querySelectorAll('.faq-item').forEach((item) => item.addEventListener('toggle', () => {
    if (item.open) document.querySelectorAll('.faq-item[open]').forEach((other) => { if (other !== item) other.open = false; });
  }));
})();