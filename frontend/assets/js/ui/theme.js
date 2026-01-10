const Theme = {
    init: () => {
        const savedTheme = Storage.get('app_theme') || 'light'; [cite: 106, 176]
        document.documentElement.setAttribute('data-theme', savedTheme);
    },
    toggle: () => {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', next);
        Storage.set('app_theme', next);
    }
};