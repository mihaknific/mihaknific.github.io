// Arhiv projektov

document.addEventListener('DOMContentLoaded', () => {
    const normalize = (str) => str.toLowerCase().trim();

    const projects = [
        {
            id: "racunkomat",
            title: "Računkomat",
            description: "Hitro orodje za izdajanje računov, delujoče tudi brez spleta. Idealno za samostojne podjetnike.",
            category: "Aplikacija",
            tags: ["POSLOVANJE"],
            keywords: [
                "račun", "računi", "računkomat", "racunkomat", "racun", "faktura", "fakturiranje",
                "poslovanje", "s.p.", "samostojni podjetnik", "offline"
            ],
            normalizedKeywords: null,
            link: "https://mihaknific.github.io/racunkomat/",
            date: "2026-06-15"
        },
        {
            id: "besedomat",
            title: "Besedomat",
            description: "Vsestransko orodje za urejanje, analizo, čiščenje in pretvorbo besedil z več kot 50 funkcijami.",
            category: "Orodje",
            tags: ["BESEDILO"],
            keywords: [
                "besedomat", "besedilo", "urejanje", "pdf", "prelomi", "regex", "analiza", "orodje"
            ],
            normalizedKeywords: null,
            link: "https://mihaknific.github.io/besedomat/",
            date: "2026-08-19"
        },
        {
            id: "epub-reader",
            title: "E-bralnik",
            description: "Prilagodljiv bralnik za ePub in PDF z glasovnim branjem ter možnostjo nastavitve načina branja po meri.",
            category: "Aplikacija",
            tags: ["E-KNJIGE"],
            keywords: [
                "bralnik", "epub", "pdf", "knjige", "tts", "glasovno branje", "e-knjige"
            ],
            normalizedKeywords: null,
            link: "https://mihaknific.github.io/spletni-bralnik/",
            date: "2026-08-31"
        },
        {
            id: "upn",
            title: "UPN Generator",
            description: "Hitro orodje za ustvarjanje in izvoz plačilnih nalogov v PDF s kodo QR, pripravljeno za tisk.",
            category: "Orodje",
            tags: ["OBRAZCI"],
            keywords: [
                "upn", "upn generator", "položnica", "qr koda", "obrazci", "plačilo", "pdf"
            ],
            normalizedKeywords: null,
            link: "https://mihaknific.github.io/upn-generator/",
            date: "2026-06-15"
        },
        {
            id: "slovenski-mediji",
            title: "Atlas medijev",
            description: "Pregled slovenskih medijev z analizo zanesljivosti virov, lastništva in filtriranjem novic.",
            category: "Analitika",
            tags: ["MEDIJSKI PROSTOR"],
            keywords: [
                "mediji", "novice", "slovenski mediji", "atlas medijev", "viri", "analitika", "časopisi", "portali"
            ],
            normalizedKeywords: null,
            link: "https://mihaknific.github.io/medijski-atlas/",
            date: "2026-08-02"
        },
        {
            id: "miselni-izzivi",
            title: "Miselni izzivi",
            description: "15 interaktivnih miselnih iger in testov za urjenje spomina, pozornosti in miselne hitrosti.",
            category: "Izobraževanje",
            tags: ["TRENING", "KOGNICIJA"],
            keywords: [
                "miselni izzivi", "stroop", "spomin", "kognitivni trening", "igre", "reakcija", "pozornost"
            ],
            normalizedKeywords: null,
            link: "https://mihaknific.github.io/miselni-izzivi/",
            date: "2026-07-27"
        },
        {
            id: "odprto",
            title: "Odprta Znanost",
            description: "Odprto okolje za učenje, prosto dostopna učna gradiva, digitalni učbeniki in vizualne simulacije.",
            category: "Izobraževanje",
            tags: ["PLATFORMA", "ZNANOST"],
            keywords: [
                "odprta znanost", "učim.se", "učenje", "učbeniki", "gradiva", "simulacije", "izobraževanje"
            ],
            normalizedKeywords: null,
            link: "https://mihaknific.github.io/odprta-znanost/",
            date: "2026-08-31"
        },
        {
            id: "bralnik",
            title: "Bralnik klasikov",
            description: "Interaktivni portal za branje del slovenskih avtorjev s prilagodljivim videzom in temami.",
            category: "Izobraževanje",
            tags: ["LITERATURA"],
            keywords: [
                "bralnik", "klasiki", "literatura", "slovenska književnost", "prešeren", "cankar"
            ],
            normalizedKeywords: null,
            link: "https://mihaknific.github.io/slovenska-knjizevnost/",
            date: "2026-06-08"
        },
        {
            id: "tekstovna-igra",
            title: "PRIPOVEDI",
            description: "Interaktivne tekstovne zgodbe z razvejanimi odločitvami, atmosfero in več različnimi svetovi.",
            category: "Igra",
            tags: ["PUSTOLOVŠČINA"],
            keywords: [
                "pripovedi", "tekstovna igra", "interaktivne zgodbe", "pustolovščina", "fikcija", "zgodba", "igra"
            ],
            normalizedKeywords: null,
            link: "https://mihaknific.github.io/pripovedi/",
            date: "2026-09-03"
        },
        {
            id: "financna-neodvisnost",
            title: "Finančna pot",
            description: "Vodič in interaktivni kalkulator za načrtovanje poti do finančne neodvisnosti, prilagojen začetnikom.",
            category: "Orodje",
            tags: ["OSEBNE FINANCE"],
            keywords: [
                "finančna neodvisnost", "finančna pot", "finance", "osebne finance", "FIRE",
                "kalkulator", "investiranje", "ETF", "varčevanje", "finančna svoboda"
            ],
            normalizedKeywords: null,
            link: "https://mihaknific.github.io/financna-neodvisnost/",
            date: "2026-09-04"
        },
        {
            id: "upn-qr-studio",
            title: "UPN QR API — testna stran",
            description: "Samostojna testna stran ob projektu API; ne gosti niti kliče zalednega API-ja. Za celovitejše in bolj dodelano ustvarjanje plačilnih nalogov priporočam UPN Generator.",
            category: "Testna stran",
            tags: ["API", "TESTER", "PLAČILA", "QR KODA"],
            keywords: [
                "upn qr api", "api tester", "testna stran", "upn qr studio", "upn", "sepa", "epc",
                "plačilni nalog", "qr koda", "pdf", "generator", "validacija", "upn generator"
            ],
            normalizedKeywords: null,
            link: "https://mihaknific.github.io/upn-qr-api/",
            date: "2026-09-05"
        },
        {
            id: "firefox-add-on-opomnik",
            title: "Vmes",
            description: "Firefoxova razširitev za opomnike za odmore in časovne omejitve spletnih strani.",
            category: "Razširitev",
            tags: ["FIREFOX", "ZASEBNOST"],
            keywords: [
                "vmes", "firefox", "dodatek", "razširitev", "web extension", "opomnik",
                "opomniki", "odmor", "fokus", "produktivnost", "časovna omejitev", "zasebnost"
            ],
            normalizedKeywords: null,
            link: "https://mihaknific.github.io/Vmes-opomniki-za-odmore-in-spletni-fokus/",
            date: "2026-09-01"
        },
        {
            id: "sanctissima-felis",
            title: "Sanctissima Felis",
            description: "Hudomušna interaktivna spletna predstavitev Njene Vzvišene Brezbrižnosti.",
            category: "Spletna stran",
            tags: ["MAČKE", "INTERAKTIVNO"],
            keywords: [
                "sanctissima felis", "shiva", "mačka", "mačja", "interaktivna spletna stran",
                "Njeno Vzvišeno Veličanstvo", "oltar"
            ],
            normalizedKeywords: null,
            link: "https://mihaknific.github.io/sanctissima-felis/",
            date: "2026-11-07"
        }
    ];

    // Predpomnjena normalizacija za hitrejše iskanje
    projects.forEach(project => {
        project.normalizedKeywords = project.keywords.map(kw => normalize(kw));
        project.normalizedTags = project.tags.map(tag => normalize(tag));
        project.normalizedCategory = normalize(project.category);
        project.normalizedTitle = normalize(project.title);
        project.normalizedDescription = normalize(project.description);
    });

    // Dinamično generirane kategorije iz podatkov (vedno 'all' na začetku, po slovenski abecedi)
    const uniqueCategories = [...new Set(projects.map(p => p.category))].sort((a, b) => a.localeCompare(b, 'sl'));
    const categories = ['all', ...uniqueCategories];

    // Pomožna funkcija za pravilno slovensko sklanjanje besede "projekt"
    function formatProjectCount(n) {
        const mod100 = n % 100;
        if (mod100 === 1) return `${n} projekt`;
        if (mod100 === 2) return `${n} projekta`;
        if (mod100 === 3 || mod100 === 4) return `${n} projekti`;
        return `${n} projektov`;
    }

    const projectsContainer = document.getElementById('projectsContainer');
    const searchInput = document.getElementById('searchInput');
    const categorySelect = document.getElementById('categorySelect');
    const sortSelect = document.getElementById('sortSelect');
    const gridViewBtn = document.getElementById('gridViewBtn');
    const listViewBtn = document.getElementById('listViewBtn');
    const noResults = document.getElementById('noResults');
    const clearFiltersBtn = document.getElementById('clearFiltersBtn');
    const searchResultsLive = document.getElementById('searchResultsLive'); // ARIA live region

    let currentCategory = 'all';
    const validViewModes = ['grid', 'list'];
    let savedViewMode = null;
    try {
        savedViewMode = localStorage.getItem('archiveViewMode');
    } catch (e) {
        // Zasebni način brskanja
    }
    let currentViewMode = validViewModes.includes(savedViewMode) ? savedViewMode : 'grid';

    // Priprava iskalnika Fuse.js
    let fuse = null;
    try {
        if (typeof Fuse !== 'undefined' && Fuse instanceof Function) {
            fuse = new Fuse(projects, {
                keys: [
                    { name: 'title', weight: 0.6 },
                    { name: 'description', weight: 0.4 }
                ],
                threshold: 0.2,
                ignoreLocation: true,
                minMatchCharLength: 3,
                includeScore: true
            });
        }
    } catch (err) {
        console.warn("Inicializacija iskalnika ni uspela:", err);
    }

    // Možnosti kategorij v izbirniku
    function generateCategoryOptions() {
        if (!categorySelect) return;
        categorySelect.innerHTML = '';

        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category === 'all' ? 'Vse' : category;
            categorySelect.appendChild(option);
        });
    }

    // Razvrščanje in filtriranje
    function compareBySortMode(a, b, sortMode) {
        if (sortMode === 'newest') {
            return new Date(b.date) - new Date(a.date);
        }
        if (sortMode === 'az') {
            return a.title.localeCompare(b.title, 'sl');
        }
        if (sortMode === 'za') {
            return b.title.localeCompare(a.title, 'sl');
        }
        return 0;
    }

    function scoreProject(project, term, fuzzyScore) {
        let best = 1;

        // Keywords — naprosto ujemanje z predpomnjenim poljem
        for (const nkw of project.normalizedKeywords) {
            if (nkw === term) {
                best = Math.min(best, 0.02);
            } else if (nkw.includes(term) || term.includes(nkw)) {
                best = Math.min(best, 0.05);
            }
        }

        // Naslov — predpomnjen
        if (project.normalizedTitle === term) {
            best = Math.min(best, 0.03);
        } else if (project.normalizedTitle.includes(term)) {
            best = Math.min(best, 0.1);
        }

        if (project.normalizedTags.some(tag => tag.includes(term))) {
            best = Math.min(best, 0.2);
        }

        if (project.normalizedCategory.includes(term)) {
            best = Math.min(best, 0.25);
        }

        if (project.normalizedDescription.includes(term)) {
            best = Math.min(best, 0.35);
        }

        // Fuzzy samo če ni substring zadetka
        if (best >= 1 && fuzzyScore !== undefined && fuzzyScore <= 0.2) {
            best = Math.min(best, 0.45 + fuzzyScore * 0.2);
        }

        return best;
    }

    function searchProjects(searchTerm) {
        if (!searchTerm.trim()) {
            return { items: [...projects], scores: null };
        }

        const term = normalize(searchTerm);
        let fuzzyScores = null;
        
        try {
            if (fuse) {
                fuzzyScores = new Map(fuse.search(term).map(result => [result.item.id, result.score]));
            }
        } catch (err) {
            console.warn("Iskanje ni uspelo:", err);
        }

        const scored = projects
            .map(project => ({
                project,
                score: scoreProject(project, term, fuzzyScores?.get(project.id))
            }))
            .filter(entry => entry.score < 1);

        scored.sort((a, b) => a.score - b.score);

        return {
            items: scored.map(entry => entry.project),
            scores: new Map(scored.map(entry => [entry.project.id, entry.score]))
        };
    }

    // Izris kartic projektov
    function renderProjects(data, totalCount = null, showNoResults = false) {
        projectsContainer.innerHTML = '';
        
        if (data.length === 0) {
            projectsContainer.style.display = 'none';
            if (showNoResults) {
                noResults.classList.remove('hidden');
                if (searchResultsLive) {
                    searchResultsLive.textContent = 'Ni projektov, ki bi ustrezali iskanju.';
                }
            } else {
                noResults.classList.add('hidden');
                if (searchResultsLive) {
                    searchResultsLive.textContent = 'Prikazujem 0 projektov.';
                }
            }
            return;
        }

        projectsContainer.style.display = '';
        noResults.classList.add('hidden');

        // ARIA: Napoji screen reader s podrobnim poročilom in pravilnim sklanjanjem
        if (searchResultsLive) {
            const total = totalCount || data.length;
            if (total === data.length) {
                searchResultsLive.textContent = `Prikazujem ${formatProjectCount(data.length)}.`;
            } else {
                searchResultsLive.textContent = `Prikazujem ${formatProjectCount(data.length)} od ${total}.`;
            }
        }

        data.forEach(project => {
            const card = document.createElement('a');
            card.href = project.link;
            card.className = 'card';
            card.setAttribute('aria-label', `${project.title} - ${project.description}`);
            card.setAttribute('target', '_blank');
            card.setAttribute('rel', 'noopener noreferrer');

            // Card content struktura
            const cardContent = document.createElement('div');
            cardContent.className = 'card-content';

            // Card meta (kategorija)
            const cardMeta = document.createElement('div');
            cardMeta.className = 'card-meta';

            const cardTag = document.createElement('div');
            cardTag.className = 'card-tag';
            cardTag.textContent = project.category;
            cardMeta.appendChild(cardTag);

            cardContent.appendChild(cardMeta);

            // Info group (naslov + opis)
            const infoGroup = document.createElement('div');
            infoGroup.className = 'list-info-group';

            const title = document.createElement('h3');
            title.textContent = project.title;
            infoGroup.appendChild(title);

            const description = document.createElement('p');
            description.textContent = project.description;
            infoGroup.appendChild(description);

            cardContent.appendChild(infoGroup);

            // Arrow (samo za list view)
            const arrow = document.createElement('div');
            arrow.className = 'list-arrow';
            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.setAttribute('viewBox', '0 0 24 24');
            svg.setAttribute('fill', 'none');
            svg.setAttribute('stroke', 'currentColor');
            svg.setAttribute('stroke-width', '2');
            svg.setAttribute('width', '20');
            svg.setAttribute('height', '20');
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('d', 'M5 12h14M12 5l7 7-7 7');
            svg.appendChild(path);
            arrow.appendChild(svg);
            cardContent.appendChild(arrow);

            card.appendChild(cardContent);
            projectsContainer.appendChild(card);
        });
    }

    // Posodobitev prikaza glede na filtre in iskanje
    function updateDisplay() {
        const searchTerm = searchInput.value.trim();
        const category = currentCategory;
        const sortMode = sortSelect.value;

        const { items, scores } = searchProjects(searchTerm);
        let filteredData = items;
        const totalCount = items.length; // Skupno število iskanih rezultatov
        const hasActiveFilter = searchTerm.length > 0 || category !== 'all';
        const showNoResults = hasActiveFilter || projects.length === 0;

        if (category !== 'all') {
            filteredData = filteredData.filter(project => project.category === category);
        }

        filteredData.sort((a, b) => {
            if (scores) {
                const scoreDiff = (scores.get(a.id) ?? 1) - (scores.get(b.id) ?? 1);
                if (scoreDiff !== 0) return scoreDiff;
            }
            return compareBySortMode(a, b, sortMode);
        });

        renderProjects(filteredData, totalCount, showNoResults);
    }

    function handleCategoryChange() {
        if (!categorySelect) return;
        currentCategory = categorySelect.value;
        updateDisplay();
    }

    // Tipkovnične bližnjice (G: mreža, L: seznam)
    document.addEventListener('keydown', (e) => {
        const ignoredTags = ['INPUT', 'TEXTAREA', 'SELECT'];
        if (ignoredTags.includes(e.target.tagName) || e.target.isContentEditable) {
            return;
        }
        // Bližnjice G in L naj delujejo le, ko je arhiv viden/odprt
        const archivePanel = document.getElementById('archive-panel');
        if (archivePanel && !archivePanel.classList.contains('active')) {
            return;
        }
        // G = Grid view
        if (e.key === 'g' || e.key === 'G') {
            setViewMode('grid');
        }
        // L = List view
        if (e.key === 'l' || e.key === 'L') {
            setViewMode('list');
        }
    });

    // Poslušalci dogodkov
    if (searchInput) {
        searchInput.addEventListener('input', updateDisplay);
    }

    if (sortSelect) {
        sortSelect.addEventListener('change', updateDisplay);
    }

    if (categorySelect) {
        categorySelect.addEventListener('change', handleCategoryChange);
    }

    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', () => {
            searchInput.value = '';
            sortSelect.value = 'newest';
            currentCategory = 'all';
            if (categorySelect) categorySelect.value = 'all';

            updateDisplay();
            // Focus management — vrnemo se v search input
            searchInput.focus();
        });
    }

    // Preklop načina prikaza (mreža / seznam)
    function setViewMode(mode) {
        const normalizedMode = validViewModes.includes(mode) ? mode : 'grid';
        const isGridMode = normalizedMode === 'grid';
        projectsContainer.classList.toggle('view-grid', isGridMode);
        projectsContainer.classList.toggle('view-list', !isGridMode);
        gridViewBtn?.classList.toggle('active', isGridMode);
        listViewBtn?.classList.toggle('active', !isGridMode);
        gridViewBtn?.setAttribute('aria-pressed', isGridMode ? 'true' : 'false');
        listViewBtn?.setAttribute('aria-pressed', isGridMode ? 'false' : 'true');
        currentViewMode = normalizedMode;
        try {
            localStorage.setItem('archiveViewMode', normalizedMode);
        } catch (e) {
            // Zasebni način brskanja
        }
    }

    if (gridViewBtn) {
        gridViewBtn.addEventListener('click', () => setViewMode('grid'));
    }

    if (listViewBtn) {
        listViewBtn.addEventListener('click', () => setViewMode('list'));
    }

    // Začetni izris
    generateCategoryOptions();
    setViewMode(currentViewMode);
    updateDisplay();
});
