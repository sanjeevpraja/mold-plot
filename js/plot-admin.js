jQuery(document).ready(function ($) {
    $('.plot-featured-toggle').on('click', function (e) {
        e.preventDefault();
        var $icon = $(this).find('.dashicons');
        var postId = $(this).data('post-id');

        $.post(plotFeatured.ajax_url, {
            action: 'plot_toggle_featured',
            post_id: postId,
            nonce: plotFeatured.nonce
        }, function (response) {
            if (response.success) {
                $icon.removeClass('dashicons-star-filled dashicons-star-empty')
                     .addClass(response.data.icon);
            }
        });
    });
});
