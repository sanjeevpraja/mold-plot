<?php
if ( ! defined( 'ABSPATH' ) ) exit;
// render.php
// Block rendering function
function callback_block_plot_meta($attributes, $content, $block)
{
    $html_tag = !empty($attributes['htmlTag']) ? $attributes['htmlTag'] : 'p';
    $fallback = !empty($attributes['fallback']) ? $attributes['fallback'] : '';
    $meta_key = !empty($attributes['metaKey']) ? $attributes['metaKey'] : 'tour_days';

    $plot_type   = get_option('plot_type', 'world_map');


    // Get the current post ID
    $post_id = get_the_ID();

    if (!$post_id) {
        return '<div class="wp-mold-plot-meta-error">' . __('No post found', 'mold-plot') . '</div>';
    }

    // Check if we're dealing with a tour post type
    if (get_post_type($post_id) !== 'plot') {
        return '<div class="wp-mold-plot-meta-error">' . __('Not a plot post', 'mold-plot') . '</div>';
    }

    // Get the meta value - use underscore prefix to match your meta key pattern
    $meta_value = get_post_meta($post_id, '_' . $meta_key, true);
    $terms = get_the_terms($post_id, 'grade');

    // Use fallback if meta value is empty
    $display_content = !empty($meta_value) ? $meta_value : $fallback;

    // Sanitize the HTML tag
    $allowed_tags = array('p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'div', 'span');
    $html_tag = in_array($html_tag, $allowed_tags) ? $html_tag : 'p';

    $block_props = array(
        'class' => 'wp-mold-plot-meta',
    );

    $wrapper_attributes = get_block_wrapper_attributes($block_props);

    if ($meta_key == 'plot_x') {
        $output = sprintf(
            '<%1$s class="wp-mold-plot-meta-info meta-x">%2$s</%1$s>',
            $html_tag,
            esc_html($display_content)
        );
    }
    elseif ($meta_key == 'plot_y') {
        $output = sprintf(
            '<%1$s class="wp-mold-plot-meta-info meta-y">%2$s</%1$s>',
            $html_tag,
            esc_html($display_content)
        );
    }
    else {
        // For all tour meta fields (they're all text fields)
        $output = sprintf(
            '<%1$s class="wp-mold-plot-meta-info">%2$s</%1$s>',
            $html_tag,
            esc_html($display_content)
        );
    }

    return sprintf(
        '<div %s>%s</div>',
        $wrapper_attributes,
        $output
    );
}