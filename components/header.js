class YogaHeader extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.render();
        this.setupMobileMenu();
        this.setupTopBar();
        this.setupHeaderScrollToggle();
    }

    setupHeaderScrollToggle() {
        const header = this.querySelector('.site-header');
        let lastScrollY = window.scrollY;
        let ticking = false;

        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    if (currentScrollY > lastScrollY && currentScrollY > 130) {
                        header.classList.add('hidden-nav');
                    } else if (currentScrollY < lastScrollY - 5) {
                        header.classList.remove('hidden-nav');
                    }
                    lastScrollY = currentScrollY;
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }

    setupTopBar() {
        const topBar = this.querySelector('.top-bar');
        const closeBtn = this.querySelector('.close-top-bar');

        if (sessionStorage.getItem('topBarDismissed') === 'true') {
            if (topBar) topBar.style.display = 'none';
        }

        if (closeBtn && topBar) {
            closeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                topBar.style.display = 'none';
                sessionStorage.setItem('topBarDismissed', 'true');
            });
        }
    }

    setupMobileMenu() {
        const nav = this.querySelector('.nav-links');
        const toggle = this.querySelector('.menu-toggle');
        const dropdown = this.querySelector('.dropdown > a');

        if (toggle && nav) {
            toggle.addEventListener('click', () => {
                nav.classList.toggle('active');
                toggle.classList.toggle('active');
            });

            // Toggle dropdown in mobile
            if (dropdown) {
                dropdown.addEventListener('click', (e) => {
                    if (window.innerWidth <= 768) {
                        e.preventDefault();
                        dropdown.parentElement.classList.toggle('open');
                    }
                });
            }

            nav.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', (e) => {
                    // Don't close menu if clicking the dropdown parent in mobile
                    if (window.innerWidth <= 768 && link.parentElement.classList.contains('dropdown')) {
                        return;
                    }
                    nav.classList.remove('active');
                    toggle.classList.remove('active');
                });
            });
        }
    }

    render() {
        const inSubdir = ['/services/', '/blog/', '/clase-gratis-'].some(seg => window.location.pathname.includes(seg));
        const pathPrefix = inSubdir ? '../' : '';
        const isPrivatePreview = window.location.pathname.includes('/clase-gratis-');

        this.innerHTML = `
        ${isPrivatePreview ? '' : `
        <div class="top-bar">
            <span class="sparkle sparkle-1">✨</span>
            <span class="sparkle sparkle-2">⭐</span>
            <span class="sparkle sparkle-3">✨</span>
            <span class="top-bar-icon">🎁</span>
            <span class="top-bar-text"><a href="https://academia.yogakiddy.com/super-pack-de-material-de-yoga-infantil-gratis/buy" target="_blank">Descarga 10 Cartas de Yoga GRATIS</a></span>
            <span class="top-bar-icon">🎁</span>
            <span class="sparkle sparkle-4">⭐</span>
            <span class="sparkle sparkle-5">✨</span>
            <span class="sparkle sparkle-6">⭐</span>
            <button class="close-top-bar" aria-label="Cerrar">&times;</button>
        </div>
        `}
        <header class="site-header">
            <nav class="container site-nav">
                <a href="${pathPrefix}index.html" class="logo">
                    <img src="${pathPrefix}assets/logo.webp" alt="YogaKiddy" style="height: 50px; width: auto;">
                    <span class="logo-text">YogaKiddy</span>
                </a>
                <ul class="nav-links">
                    <li class="dropdown">
                        <a href="#">Formaciones <span class="arrow-down"></span></a>
                        <ul class="dropdown-menu">
                            <li><a href="${pathPrefix}services/yoga-presencial.html">Presencial & Vivencial</a></li>
                            <li><a href="${pathPrefix}services/yoga-online-grabado.html">Curso Online (Grabado)</a></li>
                            <li><a href="${pathPrefix}services/yoga-online-vivo.html">Clases en Vivo (Meet)</a></li>
                            <li><a href="${pathPrefix}services/formacion-yoga-en-el-aula-en-linea.html">Yoga en el Aula (Online)</a></li>
                        </ul>
                    </li>
                    <li><a href="${pathPrefix}services/laboratorio-creativo-yogakiddy.html">Laboratorio: 10 Clases</a></li>
                    <li><a href="${pathPrefix}material.html">Material</a></li>
                    <li><a href="${pathPrefix}about.html">Nosotras</a></li>
                    <li><a href="${pathPrefix}blog.html">Blog</a></li>
                    <li><a href="${pathPrefix}contact.html">Contacto</a></li>
                    <li><a href="https://academia.yogakiddy.com/login" class="btn btn--sage btn-nav">Academia Online</a></li>
                </ul>
                <button class="menu-toggle" aria-label="Menu">
                    <span></span><span></span><span></span>
                </button>
            </nav>
        </header>
        <style>
            .top-bar {
                background: linear-gradient(135deg, #E8956B 0%, #F5A77D 100%);
                color: white;
                text-align: center;
                padding: 0.7rem 1rem;
                font-size: 0.85rem;
                font-weight: 600;
                position: relative;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 0.4rem;
                font-family: var(--font-heading, 'Quicksand', sans-serif);
                letter-spacing: 0.03em;
                overflow: hidden;
            }
            
            .top-bar::before {
                content: '';
                position: absolute;
                top: -50%;
                left: -50%;
                width: 200%;
                height: 200%;
                background: linear-gradient(
                    45deg,
                    transparent 30%,
                    rgba(255, 255, 255, 0.1) 50%,
                    transparent 70%
                );
                animation: shine 3s infinite;
            }
            
            @keyframes shine {
                0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
                100% { transform: translateX(100%) translateY(100%) rotate(45deg); }
            }
            
            .top-bar-text {
                position: relative;
                z-index: 2;
            }
            
            .top-bar-icon {
                font-size: 1.1rem;
                animation: bounce 2s ease-in-out infinite;
                position: relative;
                z-index: 2;
            }
            
            @keyframes bounce {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-4px); }
            }
            
            .sparkle {
                position: absolute;
                font-size: 0.8rem;
                opacity: 0;
                animation: sparkle 2.5s ease-in-out infinite;
                pointer-events: none;
            }
            
            .sparkle-1 { top: 20%; left: 15%; animation-delay: 0s; }
            .sparkle-2 { top: 60%; left: 25%; animation-delay: 0.5s; }
            .sparkle-3 { top: 30%; right: 20%; animation-delay: 1s; }
            .sparkle-4 { top: 70%; right: 15%; animation-delay: 1.5s; }
            .sparkle-5 { top: 40%; left: 8%; animation-delay: 2s; }
            .sparkle-6 { top: 50%; right: 30%; animation-delay: 0.8s; }
            
            @keyframes sparkle {
                0%, 100% { 
                    opacity: 0; 
                    transform: scale(0) rotate(0deg);
                }
                50% { 
                    opacity: 1; 
                    transform: scale(1) rotate(180deg);
                }
            }
            
            .top-bar a { 
                color: white; 
                text-decoration: none;
                position: relative;
                padding: 0.2rem 0.5rem;
                border-radius: 8px;
                background: rgba(255, 255, 255, 0.1);
                transition: all 0.3s ease;
            }
            .top-bar a:hover { 
                background: rgba(255, 255, 255, 0.2);
                transform: scale(1.05);
            }
            .close-top-bar {
                background: none; border: none; color: white; font-size: 1.4rem;
                cursor: pointer; padding: 0 0.8rem; position: absolute; right: 0.5rem;
                line-height: 1; opacity: 0.8; transition: opacity 0.2s; z-index: 3;
            }
            .close-top-bar:hover { opacity: 1; }

            .site-header {
                position: sticky;
                top: 0;
                z-index: 1000;
                width: 100%;
                background: rgba(253, 246, 236, 0.85);
                backdrop-filter: blur(20px);
                -webkit-backdrop-filter: blur(20px);
                border-bottom: 1px solid rgba(0,0,0,0.04);
                transition: transform 0.25s ease, box-shadow 0.3s ease, opacity 0.25s ease;
                transform: translateY(0);
            }

            .site-header.hidden-nav {
                transform: translateY(-110%);
                opacity: 0;
            }

            .site-nav {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding-top: 1rem;
                padding-bottom: 1rem;
            }

            .logo {
                font-family: var(--font-heading, 'Quicksand', sans-serif);
                font-size: 1.5rem;
                font-weight: 700;
                color: var(--color-text, #2C2C2C);
                letter-spacing: -0.02em;
                display: flex;
                align-items: center;
                gap: 12px;
                text-decoration: none;
            }
            .logo:hover { color: var(--color-accent, #3D5A3A); }
            
            .logo-text {
                font-size: 1.5rem;
                font-weight: 700;
                line-height: 1;
                display: block;
            }

            @media (max-width: 900px) {
                .logo-text {
                    display: none;
                }
            }

            .nav-links {
                display: flex;
                gap: 2rem;
                list-style: none;
                align-items: center;
            }

            .nav-links a {
                color: var(--color-text, #2C2C2C);
                font-weight: 500;
                font-size: 0.95rem;
                transition: color 0.3s ease;
            }
            .nav-links a:hover { color: var(--color-accent, #3D5A3A); }

            .btn-nav {
                padding: 0.7rem 1.5rem !important;
                font-size: 0.9rem !important;
                border-radius: 9999px;
                background-color: #9AB091; /* Sage color */
                color: white !important;
                font-weight: 600 !important;
                box-shadow: 0 4px 12px rgba(154, 176, 145, 0.2);
                transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
                display: inline-block;
            }
            .btn-nav:hover {
                transform: translateY(-3px) scale(1.02);
                box-shadow: 0 8px 20px rgba(154, 176, 145, 0.4);
                background-color: #8A9F82;
            }

            .dropdown { 
                position: relative; 
                padding-bottom: 0.5rem; /* Bridge the gap */
                margin-bottom: -0.5rem;
            }
            .dropdown-menu {
                display: none;
                position: absolute;
                top: 100%;
                left: -1rem;
                background: white;
                box-shadow: 0 15px 45px rgba(0,0,0,0.12);
                border-radius: 12px;
                padding: 0.8rem;
                min-width: 240px;
                list-style: none;
                z-index: 10;
                border: 1px solid rgba(0,0,0,0.04);
            }
            .dropdown-menu li { margin-bottom: 0.2rem; }
            .dropdown-menu a {
                display: block;
                padding: 0.8rem 1rem;
                border-radius: 8px;
                font-size: 0.9rem;
                color: #444 !important;
                transition: all 0.2s ease;
            }
            .dropdown-menu a:hover {
                background: rgba(154, 176, 145, 0.15);
                color: #2C3B2B !important;
                padding-left: 1.2rem; /* Subtle move effect */
            }
            .dropdown:hover .dropdown-menu { 
                display: block; 
                animation: fadeInDown 0.3s ease forwards;
            }

            .arrow-down {
                display: inline-block;
                width: 0;
                height: 0;
                margin-left: 5px;
                vertical-align: middle;
                border-top: 4px solid currentColor;
                border-right: 4px solid transparent;
                border-left: 4px solid transparent;
                transition: transform 0.3s ease;
            }
            .dropdown.open .arrow-down {
                transform: rotate(180deg);
            }

            @keyframes fadeInDown {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }

            /* Hamburger */
            .menu-toggle {
                display: none;
                cursor: pointer;
                background: none;
                border: none;
                width: 32px;
                height: 24px;
                position: relative;
                flex-direction: column;
                justify-content: space-between;
            }
            .menu-toggle span {
                display: block;
                width: 100%;
                height: 2px;
                background: var(--color-text, #2C2C2C);
                border-radius: 2px;
                transition: all 0.3s ease;
            }
            .menu-toggle.active span:nth-child(1) {
                transform: translateY(11px) rotate(45deg);
            }
            .menu-toggle.active span:nth-child(2) { opacity: 0; }
            .menu-toggle.active span:nth-child(3) {
                transform: translateY(-11px) rotate(-45deg);
            }

            @media (max-width: 768px) {
                .top-bar {
                    font-size: 0.75rem;
                    padding: 0.5rem 0.8rem;
                    flex-wrap: wrap;
                    justify-content: center;
                }
                .top-bar-text a {
                    font-size: 0.75rem;
                }
                .sparkle { display: none; }
                .menu-toggle { display: flex; }
                .nav-links {
                    display: none;
                    position: absolute;
                    top: 100%;
                    left: 0;
                    width: 100%;
                    background: white;
                    flex-direction: column;
                    padding: 2rem;
                    gap: 1.2rem;
                    box-shadow: 0 20px 40px rgba(0,0,0,0.08);
                    border-radius: 0 0 20px 20px;
                }
                .nav-links.active { display: flex; }
                .dropdown-menu {
                    position: static;
                    box-shadow: none;
                    background: rgba(154, 176, 145, 0.08);
                    width: 100%;
                    margin-top: 0.5rem;
                    display: none;
                    border-radius: 12px;
                    text-align: center;
                }
                .dropdown.open .dropdown-menu {
                    display: block;
                    animation: fadeInDown 0.4s ease;
                }
                .nav-links {
                    text-align: center;
                }
            }
        </style>
        `;
    }
}

customElements.define('yk-header', YogaHeader);
