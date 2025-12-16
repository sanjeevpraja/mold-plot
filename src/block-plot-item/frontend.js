// Plot Block Frontend Interactivity - REST API Version (No Nonce Required)
(function() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initPlotBlocks);
    } else {
        initPlotBlocks();
    }

    function initPlotBlocks() {
        const plotBlocks = document.querySelectorAll('.wp-block-mold-plot-item');
        plotBlocks.forEach(block => {
            const trigger = block.querySelector('.plot-image-trigger');
            const plotId = trigger?.getAttribute('data-plot-id');
            if (trigger && plotId) {
                trigger.addEventListener('click', function(e) {
                    e.preventDefault();
                    openPlotModal(plotId);
                });
            }
        });
    }

    function openPlotModal(plotId) {
        // Create modal container if it doesn't exist
        let modal = document.getElementById('plot-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'plot-modal';
            modal.className = 'plot-modal';
            modal.setAttribute('aria-hidden', 'true');
            modal.innerHTML = `
                <div class="plot-modal__overlay"></div>
                <div class="plot-modal__main">
                    <button class="plot-modal__close" aria-label="Close modal">&times;</button>
                    <div class="plot-modal__body">
                        <div class="plot-modal__loading" style="text-align: center; padding: 40px;">
                            <div style="width: 40px; height: 40px; border: 3px solid #f3f3f3; border-top: 3px solid #3498db; border-radius: 50%; margin: 0 auto 20px; animation: spin 1s linear infinite;"></div>
                            <p>Loading plot details...</p>
                        </div>
                        <div class="plot-modal__data" style="display: none;">
                            <h2 class="plot-modal__title" style="margin-top: 0; color: #1e1e1e;"></h2>
                            <div class="plot-modal__image" style="margin: 20px 0;"></div>
                            <div class="plot-modal__content" style="max-height: 300px; overflow-y: auto; padding-right: 10px;"></div>
                        </div>
                        <div class="plot-modal__error" style="display: none; text-align: center; padding: 40px; color: #d63638;"></div>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);

            // Add CSS for spinner animation
            const style = document.createElement('style');
            style.textContent = `
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                .plot-modal[aria-hidden="false"] {
                    display: flex !important;
                }
            `;
            document.head.appendChild(style);
            // Add event listeners for closing
            modal.querySelector('.plot-modal__overlay').addEventListener('click', closePlotModal);
            modal.querySelector('.plot-modal__close').addEventListener('click', closePlotModal);
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') {
                    closePlotModal();
                }
            });
        }

        // Show loading state
        modal.setAttribute('aria-hidden', 'false');
        modal.querySelector('.plot-modal__loading').style.display = 'block';
        modal.querySelector('.plot-modal__data').style.display = 'none';
        modal.querySelector('.plot-modal__error').style.display = 'none';

        // Fetch plot data via REST API (no nonce required)
        fetch(`/wp-json/wp/v2/plot/${plotId}?_embed`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(plot => {
                // Extract featured image from _embedded
                let featuredImage = null;
                if (plot._embedded && plot._embedded['wp:featuredmedia']) {
                    const media = plot._embedded['wp:featuredmedia'][0];
                    featuredImage = media.source_url || media.media_details?.sizes?.large?.source_url || media.media_details?.sizes?.full?.source_url;
                }

                // Update modal content
                modal.querySelector('.plot-modal__title').textContent = plot.title.rendered;
                modal.querySelector('.plot-modal__content').innerHTML = plot.content.rendered;

                if (featuredImage) {
                    modal.querySelector('.plot-modal__image').innerHTML = 
                        `<img src="${featuredImage}" alt="${plot.title.rendered}"/>`;
                } else {
                    modal.querySelector('.plot-modal__image').innerHTML = '';
                }

                // Show data, hide loading
                modal.querySelector('.plot-modal__loading').style.display = 'none';
                modal.querySelector('.plot-modal__data').style.display = 'block';

                // Make images within content responsive
                modal.querySelectorAll('.plot-modal__content img').forEach(img => {
                    img.style.maxWidth = '100%';
                    img.style.height = 'auto';
                });
            })
            .catch(error => {
                console.error('Error fetching plot:', error);
                modal.querySelector('.plot-modal__loading').style.display = 'none';
                modal.querySelector('.plot-modal__error').style.display = 'block';
                modal.querySelector('.plot-modal__error').textContent = 'Could not load plot details. Please try again.';
            });
    }

    function closePlotModal() {
        const modal = document.getElementById('plot-modal');
        if (modal) {
            modal.setAttribute('aria-hidden', 'true');
        }
    }

    // Make functions available globally
    window.openPlotModal = openPlotModal;
    window.closePlotModal = closePlotModal;
})();