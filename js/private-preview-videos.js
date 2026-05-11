document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.video-wrapper[data-video-poster]').forEach((wrapper) => {
        const posterSrc = wrapper.dataset.videoPoster;
        if (!posterSrc || wrapper.querySelector('.video-poster-button')) return;

        const iframe = wrapper.querySelector('iframe');
        const label = iframe?.getAttribute('title') || 'Reproducir video';
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'video-poster-button';
        button.setAttribute('aria-label', label);
        button.innerHTML = `
            <img src="${posterSrc}" alt="" loading="lazy">
            <span class="video-poster-play" aria-hidden="true"></span>
        `;

        button.addEventListener('click', () => {
            wrapper.classList.add('video-wrapper--ready');
            button.remove();
        });

        wrapper.appendChild(button);
    });
});
