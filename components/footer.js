class YogaFooter extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.render();
    }

    render() {
        const inSubdir = ['/services/', '/blog/', '/clase-gratis-'].some(seg => window.location.pathname.includes(seg));
        const pathPrefix = inSubdir ? '../' : '';
        const isPrivatePreview = window.location.pathname.includes('/clase-gratis-');

        this.innerHTML = `
        <style>
            /* WhatsApp Float */
            .whatsapp-float {
                position: fixed;
                bottom: 30px;
                right: 30px;
                width: 56px;
                height: 56px;
                background-color: #25d366;
                color: #FFF;
                border-radius: 50%;
                text-align: center;
                box-shadow: 0 6px 20px rgba(37, 211, 102, 0.35);
                z-index: 10000;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: transform 0.3s ease, box-shadow 0.3s ease;
            }
            .whatsapp-float:hover {
                transform: scale(1.1);
                box-shadow: 0 8px 25px rgba(37, 211, 102, 0.5);
            }
            .whatsapp-label {
                position: absolute;
                right: 68px;
                background: #25d366;
                color: white;
                padding: 8px 16px;
                border-radius: 9999px;
                font-size: 0.82rem;
                font-weight: 600;
                white-space: nowrap;
                opacity: 0;
                visibility: hidden;
                transition: opacity 0.3s, transform 0.3s;
                transform: translateX(10px);
                box-shadow: 0 4px 15px rgba(0,0,0,0.1);
            }
            .whatsapp-float:hover .whatsapp-label {
                opacity: 1;
                visibility: visible;
                transform: translateX(0);
            }
            .whatsapp-icon-svg {
                width: 30px;
                height: 30px;
                fill: white;
            }

            /* Footer */
            .site-footer {
                background-color: #2C3B2B; /* A more organic dark green than pure black */
                color: rgba(255,255,255,0.95);
                padding: 5rem 0 2rem;
            }
            .footer-grid {
                display: grid;
                grid-template-columns: 1.5fr 1fr 1fr 1.2fr;
                gap: 3rem;
            }
            .footer-heading {
                font-family: var(--font-heading, 'Quicksand', sans-serif);
                font-weight: 700;
                font-size: 1.1rem;
                color: white;
                margin-bottom: 1.5rem;
            }
            .footer-brand {
                font-family: var(--font-heading, 'Quicksand', sans-serif);
                font-size: 1.8rem;
                font-weight: 700;
                color: white;
                margin-bottom: 1rem;
            }
            .footer-desc {
                font-size: 0.9rem;
                color: rgba(255,255,255,0.95);
                line-height: 1.7;
            }
            .footer-links {
                list-style: none;
                padding: 0;
            }
            .footer-links li { margin-bottom: 0.6rem; }
            .footer-links a {
                color: rgba(255,255,255,0.95);
                font-size: 0.9rem;
                transition: color 0.3s ease, transform 0.2s ease;
                display: inline-block;
            }
            .footer-links a:hover { 
                color: white; 
                transform: translateX(3px);
            }
            .footer-contact p {
                font-size: 0.9rem;
                margin-bottom: 0.5rem;
                color: rgba(255,255,255,0.95);
            }
            .footer-insta-single {
                margin-top: 1rem;
            }
            .footer-insta-single a {
                display: block;
                border-radius: 12px;
                overflow: hidden;
                transition: transform 0.3s ease, box-shadow 0.3s ease;
            }
            .footer-insta-single img {
                width: 100%;
                height: auto;
                object-fit: cover;
                transition: opacity 0.3s ease, transform 0.3s ease;
                display: block;
            }
            .footer-insta-single a:hover {
                transform: translateY(-3px);
                box-shadow: 0 6px 20px rgba(0,0,0,0.2);
            }
            .footer-insta-single a:hover img { 
                opacity: 0.9;
            }

            .footer-gift-card {
                background: rgba(255,255,255,0.08);
                border: 1px solid rgba(255,255,255,0.12);
                border-radius: 12px;
                padding: 1rem;
                transition: all 0.3s ease;
            }
            .footer-gift-card:hover {
                background: rgba(255,255,255,0.12);
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            }

            .footer-bottom {
                border-top: 1px solid rgba(255,255,255,0.15);
                margin-top: 3rem;
                padding-top: 2rem;
                text-align: center;
                font-size: 0.85rem;
                color: rgba(255,255,255,0.85);
            }

            @media (max-width: 768px) {
                .footer-grid {
                    grid-template-columns: 1fr 1fr;
                    gap: 2rem;
                }
            }
            @media (max-width: 480px) {
                .footer-grid {
                    grid-template-columns: 1fr;
                }
            }
        </style>

        <a href="https://api.whatsapp.com/send/?phone=56954797227&text=Hola%2C+quiero+m%C3%A1s+informaci%C3%B3n&type=phone_number&app_absent=0" class="whatsapp-float" target="_blank" rel="noopener noreferrer">
            <span class="whatsapp-label">WhatsApp</span>
            <svg class="whatsapp-icon-svg" viewBox="0 0 448 512">
                <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.7 17.7 69.4 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.1 0-65.6-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-5.5-2.8-23.2-8.5-44.2-27.1-16.4-14.6-27.4-32.7-30.6-38.1-3.2-5.5-.3-8.5 2.5-11.2 2.5-2.5 5.5-6.5 8.3-9.7 2.8-3.3 3.7-5.5 5.5-9.3 1.9-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 13.2 5.8 23.5 9.2 31.5 11.8 13.3 4.2 25.5 3.6 35.1 2.2 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
            </svg>
        </a>

        <footer class="site-footer">
            <div class="container">
                <div class="footer-grid">
                    <div>
                        <div class="footer-brand">
                            YogaKiddy
                        </div>
                        <p class="footer-desc">Inspirando calma, creatividad y bienestar en la infancia a través del yoga y la atención plena. Desde 2016.</p>
                        <div style="margin-top: 1.5rem;">
                            ${isPrivatePreview ? '' : `
                            <a href="https://academia.yogakiddy.com/super-pack-de-material-de-yoga-infantil-gratis/buy" target="_blank" class="footer-gift-card" style="display: flex; align-items: center; gap: 0.8rem; text-decoration: none;">
                                <img src="${pathPrefix}assets/cartas-gratis.webp" alt="Cartas Gratis" style="width: 45px; height: 45px; object-fit: cover; border-radius: 6px; border: 1px solid rgba(255,255,255,0.2);">
                                <div>
                                    <span style="display: block; font-weight: 700; font-size: 0.85rem; color: #E8956B; line-height: 1.2;">Regalo Gratis</span>
                                    <span style="display: block; font-size: 0.8rem; color: rgba(255,255,255,0.9);">Descarga 10 Cartas de Yoga</span>
                                </div>
                            </a>
                            `}
                            <a href="https://open.spotify.com/artist/65RlyLIY7Iok1DIkAu8QZK" target="_blank" class="footer-gift-card" style="display: flex; align-items: center; gap: 0.8rem; text-decoration: none; ${isPrivatePreview ? '' : 'margin-top: 1rem;'}">
                                <div style="width: 45px; height: 45px; background: #1DB954; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="white">
                                        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                                    </svg>
                                </div>
                                <div>
                                    <span style="display: block; font-weight: 700; font-size: 0.85rem; color: #1DB954; line-height: 1.2;">Música de Yoga</span>
                                    <span style="display: block; font-size: 0.8rem; color: rgba(255,255,255,0.9);">Escucha en Spotify</span>
                                </div>
                            </a>
                        </div>
                    </div>
                    <div>
                        <h4 class="footer-heading">Explora</h4>
                        <ul class="footer-links">
                            <li><a href="${pathPrefix}index.html">Inicio</a></li>
                            <li><a href="${pathPrefix}about.html">Nosotras</a></li>
                            <li><a href="${pathPrefix}directorio-profesores.html">Directorio de Profesores</a></li>
                            <li><a href="${pathPrefix}services/yoga-presencial.html">Formaciones</a></li>
                            <li><a href="${pathPrefix}ruleta-de-yoga.html">Ruleta de Yoga</a></li>
                            <li><a href="${pathPrefix}dados-de-yoga.html">Dados de Yoga</a></li>
                            <li><a href="${pathPrefix}contact.html">Contacto</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 class="footer-heading">Contacto</h4>
                        <p style="font-size: 0.9rem; margin-bottom: 0.5rem; color: rgba(255,255,255,0.95);">info@yogakiddy.com</p>
                        <p style="font-size: 0.9rem; margin-bottom: 0.5rem; color: rgba(255,255,255,0.95);">+56 9 5479 7227</p>
                    </div>
                    <div>
                        <h4 class="footer-heading">Comunidad</h4>
                        <p style="font-size: 0.85rem; margin-bottom: 1rem; color: rgba(255,255,255,0.9); display: flex; align-items: center; gap: 0.5rem;">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0;">
                                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                            </svg>
                            <span>+70.000 seguidoras en Instagram</span>
                        </p>
                        <div class="footer-insta-single">
                            <a href="https://www.instagram.com/yogakiddy/" target="_blank" rel="noopener noreferrer">
                                <img src="${pathPrefix}assets/instagram_2.webp" alt="Instagram YogaKiddy" loading="lazy">
                            </a>
                        </div>
                    </div>
                </div>
                <div class="footer-bottom">
                    <p style="color: rgba(255,255,255,0.9);">&copy; 2026 YogaKiddy Academy. Hecho con amor para mentes curiosas.</p>
                </div>
            </div>
        </footer>
        `;
    }
}

customElements.define('yk-footer', YogaFooter);
