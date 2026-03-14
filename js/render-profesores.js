const DATA_URL = './data-profesores.json';
const MAX_BIO_LENGTH = 220;

const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            cardObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

const escapeHTML = (value) => String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const normalizeCountry = (country) => {
    if (!country || country.toLowerCase() === 'all') return 'all';
    const map = {
        'mexico': 'México',
        'espana': 'España',
        'peru': 'Perú',
        'panama': 'Panamá',
        'republica dominicana': 'República Dominicana',
        'brazil': 'Brasil',
        'belgica': 'Bélgica',
        'france': 'Francia',
        'francia': 'Francia',
        'united states': 'Estados Unidos',
        'estados unidos': 'Estados Unidos',
        'eeuu': 'Estados Unidos',
        'usa': 'Estados Unidos'
    };
    const key = country.toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    return map[key] || country;
};

const getCountrySlug = (country) => {
    if (!country) return '';
    return country.toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-z-]/g, '');
};

const normalizeCity = (city) => {
    if (!city) return 'sin ciudad';
    let value = city.toString().trim().toLowerCase();
    value = value.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    value = value.replace(/\b(en|y|de|del|de la|comunas?|alrededores?|provincia|regi[oó]n|ciudad|capital)\b/g, '');
    value = value.replace(/\s*[;,\|\/]+\s*/g, ',').split(',')[0] || value;
    value = value.replace(/\s+/g, ' ').trim();

    // Cas spécifique : tout ce qui est dans la région métropolitaine de Santiago revient à Santiago
    if (/\b(santiago|rm|regiones?\s+de\s+la\s+metropolitana|metropolitana)\b/.test(value)) {
        return 'santiago';
    }

    // Compléments fréquents -> prendre la première localité
    if (value.includes('y')) {
        value = value.split('y')[0].trim();
    }

    return value || 'sin ciudad';
};

const cityLabel = (city) => {
    const normalized = normalizeCity(city);
    if (!normalized || normalized === 'sin ciudad') return 'Localidad desconocida';
    return normalized.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

const sortByCity = (list) => {
    return [...list].sort((a, b) => {
        const cityA = normalizeCity(a.ciudad).toLowerCase();
        const cityB = normalizeCity(b.ciudad).toLowerCase();
        if (cityA === cityB) {
            return (a.nombre || '').localeCompare(b.nombre || '');
        }
        return cityA.localeCompare(cityB);
    });
};

const createCard = (profesor) => {
    const row = document.createElement('div');
    row.className = 'profe-row';

    const imageHTML = profesor.foto
        ? `<div class="profe-row-image"><img src="${profesor.foto}" alt="${escapeHTML(profesor.nombre)}" loading="lazy"></div>`
        : `<div class="profe-row-image placeholder"></div>`;
    const socialText = profesor.redes ? escapeHTML(profesor.redes) : '';

    const bioText = profesor.bio ? escapeHTML(profesor.bio).replace(/\n/g, '<br>') : '';

    row.innerHTML = `
        ${imageHTML}
        <span class="profe-row-field profe-row-name">
            <strong>${escapeHTML(profesor.nombre)}</strong><br/>
            <small>${escapeHTML(normalizeCountry(profesor.pais))}</small>
        </span>
        <span class="profe-row-field">${escapeHTML(cityLabel(profesor.ciudad))}</span>
        <span class="profe-row-field">${escapeHTML(profesor.edades)}</span>
        <span class="profe-row-field">${escapeHTML(profesor.whatsapp)}</span>
        <span class="profe-row-field">${socialText}</span>
        <div class="profe-row-extra">${bioText || '—'}</div>
    `;

    const readMoreBtn = row.querySelector('.read-more');
    const bioExtra = row.querySelector('.bio-extra');
    const ellipsisEl = row.querySelector('.bio-ellipsis');
    if (readMoreBtn && bioExtra) {
        readMoreBtn.addEventListener('click', () => {
            const expanded = bioExtra.classList.toggle('visible');
            if (ellipsisEl) {
                ellipsisEl.classList.toggle('hidden', expanded);
            }
            readMoreBtn.textContent = expanded ? 'Leer menos' : 'Leer más';
        });
    }

    return row;
};

const createCountryCard = (country, count) => {
    const slug = getCountrySlug(country);
    const card = document.createElement('a');
    card.href = `./profesores-yoga-ninos-${slug}.html`;
    card.className = 'country-card';
    card.innerHTML = `
        <div class="country-card-content">
            <h3 class="country-name">${escapeHTML(country)}</h3>
            <p class="country-count">${count} ${count === 1 ? 'profesor' : 'profesores'}</p>
            <span class="country-link">Ver directorio →</span>
        </div>
    `;
    return card;
};

const createTableHeader = () => {
    const header = document.createElement('div');
    header.className = 'profe-row profe-row--header';
    header.innerHTML = `
        <div class="profe-row-image"></div>
        <span class="profe-row-field title">Profesor</span>
        <span class="profe-row-field">Ciudad</span>
        <span class="profe-row-field">Edades</span>
        <span class="profe-row-field">WhatsApp</span>
        <span class="profe-row-field">Redes</span>
    `;
    return header;
};

const loadInlineData = () => {
    const script = document.getElementById('profesores-data');
    if (!script) return null;
    const payload = script.textContent.trim();
    if (!payload) return null;
    try {
        return JSON.parse(payload);
    } catch (error) {
        console.error('Error leyendo datos embebidos', error);
        return null;
    }
};

const fetchProfesores = async () => {
    // 1. Prioridad: Datos globales (inyectados vía <script src="js/profesores-data.js">)
    if (window.PROFESORES_DATA) {
        return window.PROFESORES_DATA;
    }

    // 2. Datos embebidos en el HTML
    const inline = loadInlineData();
    if (inline) {
        return inline;
    }

    // 3. Fetch como último recurso (falla en local sin servidor)
    try {
        const response = await fetch(DATA_URL, { cache: 'no-store' });
        if (response.ok) return await response.json();
    } catch (error) {
        console.warn('CORS o error de red: No se pudo cargar JSON externo.', error);
    }
    return [];
};

window.initProfesores = async function({
    gridId,
    emptyStateId,
    filterContainerId = null,
    filterCountry = 'all',
    filtersEnabled = true,
    redirectMode = false,
    showCountryCardsOnAll = false
}) {
    const grid = document.getElementById(gridId);
    const emptyState = document.getElementById(emptyStateId);
    const filterContainer = filterContainerId ? document.getElementById(filterContainerId) : null;

    let currentCity = 'all';
    let cityFilterContainer = null;

    if (!grid || !emptyState) return;

    const allProfesores = await fetchProfesores();
    
    // Normalizar países y calcular conteos
    const countryCounts = {};
    allProfesores.forEach(p => {
        p.pais = normalizeCountry(p.pais);
        countryCounts[p.pais] = (countryCounts[p.pais] || 0) + 1;
    });

    const totalProfesores = allProfesores.length;
    let countries = [...new Set(allProfesores.map(p => p.pais).filter(p => !['all', ''].includes(p)))];
    countries = countries.sort((a, b) => a.localeCompare(b, 'es', { sensitivity: 'base' }));

    const renderProfesores = (target, city = 'all') => {
        const normalizedTarget = normalizeCountry(target);
        const normalizedCity = city ? normalizeCity(city) : 'all';
        currentCity = normalizedCity;
        grid.innerHTML = '';
        
        if (normalizedTarget === 'all' && showCountryCardsOnAll) {
            cityFilterContainer && (cityFilterContainer.innerHTML = '');
            // Mostrar tarjetas de países en lugar de la lista completa
            grid.classList.add('country-mode');
            countries.forEach(country => {
                grid.appendChild(createCountryCard(country, countryCounts[country]));
            });
            emptyState.style.display = 'none';
            grid.style.display = 'grid';
            return;
        }

        grid.classList.remove('country-mode');
        const filteredByCountry = normalizedTarget === 'all'
            ? allProfesores
            : allProfesores.filter(p => p.pais.toLowerCase() === normalizedTarget.toLowerCase());

        if (filteredByCountry.length === 0) {
            cityFilterContainer && (cityFilterContainer.innerHTML = '');
            emptyState.style.display = 'block';
            grid.style.display = 'none';
            return;
        }

        const cityGroups = filteredByCountry.reduce((acc, profe) => {
            const name = cityLabel(profe.ciudad);
            acc[name] = acc[name] || [];
            acc[name].push(profe);
            return acc;
        }, {});

        const cityNames = Object.keys(cityGroups).sort((a, b) => a.localeCompare(b, 'es', { sensitivity: 'base' }));

        if (cityFilterContainer && normalizedTarget !== 'all') {
            cityFilterContainer.innerHTML = '';
            const allCityBtn = document.createElement('button');
            allCityBtn.className = `filter-btn ${normalizedCity === 'all' ? 'active' : ''}`;
            allCityBtn.innerHTML = `Todas las localidades <span class="count">${filteredByCountry.length}</span>`;
            allCityBtn.addEventListener('click', () => {
                currentCity = 'all';
                renderProfesores(target, 'all');
            });
            cityFilterContainer.appendChild(allCityBtn);

            cityNames.forEach(cityName => {
                const cityBtn = document.createElement('button');
                cityBtn.className = `filter-btn ${normalizeCity(cityName) === normalizedCity ? 'active' : ''}`;
                const cityCount = cityGroups[cityName]?.length || 0;
                cityBtn.innerHTML = `${escapeHTML(cityName)} <span class="count">${cityCount}</span>`;
                cityBtn.addEventListener('click', () => {
                    currentCity = normalizeCity(cityName);
                    renderProfesores(target, cityName);
                });
                cityFilterContainer.appendChild(cityBtn);
            });
        } else if (cityFilterContainer) {
            cityFilterContainer.innerHTML = '';
        }

        const filteredList = normalizedCity === 'all'
            ? filteredByCountry
            : filteredByCountry.filter(p => normalizeCity(p.ciudad) === normalizedCity);

        if (filteredList.length === 0) {
            emptyState.style.display = 'block';
            grid.style.display = 'none';
            return;
        }

        emptyState.style.display = 'none';
        grid.style.display = 'grid';

        const grouped = filteredList.reduce((acc, profe) => {
            const cityName = cityLabel(profe.ciudad);
            acc[cityName] = acc[cityName] || [];
            acc[cityName].push(profe);
            return acc;
        }, {});

        const displayedCityNames = Object.keys(grouped).sort((a, b) => a.localeCompare(b, 'es', { sensitivity: 'base' }));

        displayedCityNames.forEach(cityName => {
            const groupTitle = document.createElement('h2');
            groupTitle.className = 'city-group-title';
            groupTitle.textContent = cityName;
            grid.appendChild(groupTitle);

            grid.appendChild(createTableHeader());

            const sorted = sortByCity(grouped[cityName]);
            sorted.forEach(profe => {
                const row = createCard(profe);
                grid.appendChild(row);
                setTimeout(() => row.classList.add('visible'), 50);
                cardObserver.observe(row);
            });
        });
    };

    // Minimiser les filtres lors du scroll pour une expérience plus épurée
    const filterSection = document.querySelector('.filter-section');
    let lastScrollY = window.scrollY;
    let ticking = false;

    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        if (!ticking) {
            window.requestAnimationFrame(() => {
                if (filterSection) {
                    if (currentScrollY > lastScrollY && currentScrollY > 120) {
                        filterSection.classList.add('compact');
                        if (currentScrollY > 340) {
                            filterSection.classList.add('hidden');
                        }
                    } else if (currentScrollY < lastScrollY - 5) {
                        filterSection.classList.remove('hidden');
                        filterSection.classList.remove('compact');
                    }
                }
                lastScrollY = currentScrollY;
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });

    if (filtersEnabled && filterContainer) {
        filterContainer.innerHTML = '';
        cityFilterContainer = document.createElement('div');
        cityFilterContainer.className = 'city-filter-container';
        filterContainer.appendChild(cityFilterContainer);
        const activeNormalized = normalizeCountry(filterCountry);

        // Botón "Todos"
        const allBtn = document.createElement('button');
        allBtn.className = `filter-btn ${activeNormalized === 'all' ? 'active' : ''}`;
        allBtn.innerHTML = `Todos los países <span class="count">${totalProfesores}</span>`;
        allBtn.addEventListener('click', () => {
            if (redirectMode && activeNormalized !== 'all') {
                window.location.href = './directorio-profesores.html';
                return;
            }
            filterContainer.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
            allBtn.classList.add('active');
            renderProfesores('all');
        });
        filterContainer.appendChild(allBtn);

        countries.forEach(country => {
            const btn = document.createElement('button');
            const normalizedTag = normalizeCountry(country);
            const isActive = activeNormalized.toLowerCase() === normalizedTag.toLowerCase();
            const count = countryCounts[country] || 0;

            btn.className = `filter-btn ${isActive ? 'active' : ''}`;
            btn.innerHTML = `${country} <span class="count">${count}</span>`;
            btn.addEventListener('click', () => {
                if (redirectMode) {
                    const slug = getCountrySlug(country);
                    window.location.href = `./profesores-yoga-ninos-${slug}.html`;
                    return;
                }
                filterContainer.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                renderProfesores(country);
            });
            filterContainer.appendChild(btn);
        });
    }

    renderProfesores(filterCountry);
};
