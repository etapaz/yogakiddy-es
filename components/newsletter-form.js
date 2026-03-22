class YogaNewsletterForm extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.innerHTML = `
            <section class="section" id="download-cards">
                <div class="section-panel reveal" style="background-color: #E9EDCA; padding: 4rem clamp(2rem, 5vw, 4rem); max-width: 1100px; margin: 0 auto;">
                    <div class="flex-row">
                        <div style="flex: 1; text-align: center;">
                            <img src="assets/cartas-gratis.webp" alt="Cartas de Yoga Gratis" class="img-rounded-xl img-shadow" style="width: 100%; max-width: 450px; margin: 0 auto; display: block; transform: rotate(-2deg);">
                        </div>
                        <div style="flex: 1.3; text-align: left;">
                            <span class="pill-badge" style="border-color: #3D5A3A; color: #3D5A3A; background-color: rgba(255,255,255,0.5); margin-bottom: 1.5rem;">Regalo Exclusivo</span>
                            <h2 class="mb-3" style="color: #2C2C2C; font-size: clamp(2rem, 4vw, 2.5rem);">10 Cartas de Yoga <br><span style="color: #3D5A3A;">¡Totalmente Gratis!</span></h2>
                            <p class="mb-4 text-large" style="color: #4A4A4A;">
                                Transforma tus clases y momentos en familia con nuestras hermosas cartas ilustradas. Una herramienta lúdica probada por miles de educadoras.
                            </p>
                            
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 2.5rem;">
                                <div style="display: flex; align-items: center; gap: 0.8rem;">
                                    <div style="width: 24px; height: 24px; background: #3D5A3A; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 0.8rem;">✓</div>
                                    <span style="font-weight: 500; font-size: 0.95rem;">Listas para imprimir</span>
                                </div>
                                <div style="display: flex; align-items: center; gap: 0.8rem;">
                                    <div style="width: 24px; height: 24px; background: #3D5A3A; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 0.8rem;">✓</div>
                                    <span style="font-weight: 500; font-size: 0.95rem;">Alta resolución</span>
                                </div>
                                <div style="display: flex; align-items: center; gap: 0.8rem;">
                                    <div style="width: 24px; height: 24px; background: #3D5A3A; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 0.8rem;">✓</div>
                                    <span style="font-weight: 500; font-size: 0.95rem;">Diseño original</span>
                                </div>
                                <div style="display: flex; align-items: center; gap: 0.8rem;">
                                    <div style="width: 24px; height: 24px; background: #3D5A3A; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 0.8rem;">✓</div>
                                    <span style="font-weight: 500; font-size: 0.95rem;">Acceso inmediato</span>
                                </div>
                            </div>

                            <a href="https://academia.yogakiddy.com/super-pack-de-material-de-yoga-infantil-gratis/buy" target="_blank" class="btn btn--sage btn--lg" style="box-shadow: 0 10px 25px rgba(61, 90, 58, 0.25);">
                                ¡Quiero mis cartas ahora!
                            </a>
                            <p style="font-size: 0.85rem; margin-top: 1rem; opacity: 0.7;">* Al descargar te unirás a nuestra comunidad de +70.000 suscriptoras.</p>
                        </div>
                    </div>
                </div>
            </section>
        `;
    }
}

customElements.define('yk-newsletter-form', YogaNewsletterForm);
