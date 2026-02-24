(function () {
  const searchInput = document.getElementById('post-search');
  if (!searchInput) return;

  const postList = document.getElementById('post-list');
  const cards = Array.from(document.querySelectorAll('.post-item'));
  const sidebarItems = Array.from(document.querySelectorAll('.sidebar-post-item'));
  const homepageNoResults = document.getElementById('no-results');
  const sidebarNoResults = document.getElementById('sidebar-no-results');
  const loadMoreButton = document.getElementById('load-more-posts');

  const configuredLimit = parseInt(postList?.dataset.postsLimit || '', 10);
  const step = Number.isNaN(configuredLimit) || configuredLimit < 1 ? 6 : configuredLimit;
  let currentVisibleLimit = step;

  function updateHomepageResults(query) {
    if (!cards.length) return 0;

    let matched = 0;

    cards.forEach((card) => {
      const title = card.dataset.title || '';
      const preview = card.dataset.preview || '';
      const isMatch = title.includes(query) || preview.includes(query);

      if (!isMatch) {
        card.classList.add('d-none');
        return;
      }

      matched += 1;
      card.classList.toggle('d-none', matched > currentVisibleLimit);
    });

    homepageNoResults?.classList.toggle('d-none', matched !== 0);
    loadMoreButton?.classList.toggle('d-none', matched <= currentVisibleLimit);
    return matched;
  }

  function updateSidebarResults(query) {
    if (!sidebarItems.length) return 0;

    let matched = 0;

    sidebarItems.forEach((item) => {
      const title = item.dataset.title || '';
      const isMatch = title.includes(query);
      item.classList.toggle('d-none', !isMatch);
      if (isMatch) matched += 1;
    });

    sidebarNoResults?.classList.toggle('d-none', matched !== 0);
    return matched;
  }

  function filterArticles() {
    const query = searchInput.value.trim().toLowerCase();
    updateHomepageResults(query);
    updateSidebarResults(query);
  }

  searchInput.addEventListener('input', function () {
    currentVisibleLimit = step;
    filterArticles();
  });

  loadMoreButton?.addEventListener('click', function () {
    currentVisibleLimit += step;
    filterArticles();
  });

  filterArticles();
})();
