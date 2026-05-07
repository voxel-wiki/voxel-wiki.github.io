// Set darkmode
const modeButton = document.getElementById('mode');

if (modeButton) {
  modeButton.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
  });
}

// enforce local storage setting but also fallback to user-agent preferences
if (localStorage.getItem('theme') === 'dark' || (!localStorage.getItem('theme') && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
  document.body.classList.add('dark');
}

const wikiSidebarToggle = document.getElementById('wiki-sidebar-toggle');
const wikiSidebarClose = document.querySelector('[data-sidebar-close]');
const desktopSidebar = window.matchMedia('(min-width: 992px)');
const wikiSidebarChapterGroups = Array.from(document.querySelectorAll('[data-wiki-sidebar-chapter]'));

function setWikiSidebarExpanded(expanded) {
  if (wikiSidebarToggle) {
    wikiSidebarToggle.setAttribute('aria-expanded', expanded ? 'true' : 'false');
  }
}

function syncWikiSidebarButton() {
  const expanded = desktopSidebar.matches
    ? !document.documentElement.classList.contains('wiki-sidebar-collapsed')
    : document.body.classList.contains('wiki-sidebar-open');

  setWikiSidebarExpanded(expanded);
}

function toggleWikiSidebar() {
  if (desktopSidebar.matches) {
    document.body.classList.toggle('wiki-sidebar-collapsed');
    document.documentElement.classList.toggle('wiki-sidebar-collapsed');
    localStorage.setItem('wiki-sidebar', document.body.classList.contains('wiki-sidebar-collapsed') ? 'closed' : 'open');
  } else {
    document.body.classList.toggle('wiki-sidebar-open');
  }

  syncWikiSidebarButton();
}

if (localStorage.getItem('wiki-sidebar') === 'closed') {
  document.body.classList.add('wiki-sidebar-collapsed');
  document.documentElement.classList.add('wiki-sidebar-collapsed');
}

if (wikiSidebarToggle) {
  wikiSidebarToggle.addEventListener('click', toggleWikiSidebar);
}

if (wikiSidebarClose) {
  wikiSidebarClose.addEventListener('click', () => {
    document.body.classList.remove('wiki-sidebar-open');
    syncWikiSidebarButton();
  });
}

desktopSidebar.addEventListener('change', () => {
  if (desktopSidebar.matches) {
    document.body.classList.remove('wiki-sidebar-open');
  }

  syncWikiSidebarButton();
});

if (wikiSidebarChapterGroups.length > 0) {
  const storedChapter = localStorage.getItem('wiki-sidebar-chapter');
  const matchingStoredChapter = storedChapter
    ? wikiSidebarChapterGroups.find((group) => group.dataset.wikiSidebarChapter === storedChapter)
    : null;

  if (matchingStoredChapter) {
    wikiSidebarChapterGroups.forEach((group) => {
      group.open = group === matchingStoredChapter;
    });
  } else {
    const openGroup = wikiSidebarChapterGroups.find((group) => group.open);
    if (openGroup) {
      localStorage.setItem('wiki-sidebar-chapter', openGroup.dataset.wikiSidebarChapter);
      wikiSidebarChapterGroups.forEach((group) => {
        group.open = group === openGroup;
      });
    }
  }

  wikiSidebarChapterGroups.forEach((group) => {
    group.addEventListener('toggle', () => {
      if (!group.open) {
        return;
      }

      wikiSidebarChapterGroups.forEach((otherGroup) => {
        if (otherGroup !== group) {
          otherGroup.open = false;
        }
      });

      localStorage.setItem('wiki-sidebar-chapter', group.dataset.wikiSidebarChapter);
    });
  });
}

syncWikiSidebarButton();
