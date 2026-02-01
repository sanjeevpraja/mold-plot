<?php
/**
 * Custom Post Type: Plot
 */

// Register Custom Post Type
function mold_create_plot_post_type() {
    $labels = array(
        'name'                  => _x('Plots', 'Post Type General Name', 'mold-plot'),
        'singular_name'         => _x('Plot', 'Post Type Singular Name', 'mold-plot'),
        'menu_name'             => __('Plots', 'mold-plot'),
        'name_admin_bar'        => __('Plot', 'mold-plot'),
        'archives'              => __('Plot Archives', 'mold-plot'),
        'attributes'            => __('Plot Attributes', 'mold-plot'),
        'parent_item_colon'     => __('Parent Plot:', 'mold-plot'),
        'all_items'             => __('All Plots', 'mold-plot'),
        'add_new_item'          => __('Add New Plot', 'mold-plot'),
        'add_new'               => __('Add New', 'mold-plot'),
        'new_item'              => __('New Plot', 'mold-plot'),
        'edit_item'             => __('Edit Plot', 'mold-plot'),
        'update_item'           => __('Update Plot', 'mold-plot'),
        'view_item'             => __('View Plot', 'mold-plot'),
        'view_items'            => __('View Plots', 'mold-plot'),
        'search_items'          => __('Search Plot', 'mold-plot'),
        'not_found'             => __('Not found', 'mold-plot'),
        'not_found_in_trash'    => __('Not found in Trash', 'mold-plot'),
        'featured_image'        => __('Featured Image', 'mold-plot'),
        'set_featured_image'    => __('Set featured image', 'mold-plot'),
        'remove_featured_image' => __('Remove featured image', 'mold-plot'),
        'use_featured_image'    => __('Use as featured image', 'mold-plot'),
        'insert_into_item'      => __('Insert into plot', 'mold-plot'),
        'uploaded_to_this_item' => __('Uploaded to this plot', 'mold-plot'),
        'items_list'            => __('Plots list', 'mold-plot'),
        'items_list_navigation' => __('Plots list navigation', 'mold-plot'),
        'filter_items_list'     => __('Filter plots list', 'mold-plot'),
    );

    $args = array(
        'label'                 => __('Plot', 'mold-plot'),
        'description'           => __('Plot information', 'mold-plot'),
        'labels'                => $labels,
        'supports'              => array('title', 'editor', 'thumbnail', 'revisions', 'custom-fields', 'page-attributes'),
        'taxonomies'            => array('grade', 'location', 'category', 'post_tag'),
        'hierarchical'          => true,
        'public'                => true,
        'show_ui'               => true,
        'show_in_menu'          => true,
        'menu_position'         => 20,
        'menu_icon'             => 'dashicons-admin-site-alt',
        'show_in_admin_bar'     => true,
        'show_in_nav_menus'     => true,
        'can_export'            => true,
        'has_archive'           => true,
        'exclude_from_search'   => false,
        'publicly_queryable'    => true,
        'capability_type'       => 'post',
        'show_in_rest'          => true,
    );

    register_post_type('plot', $args);
}
add_action('init', 'mold_create_plot_post_type', 0);


// Add default content when plot is created
function mold_set_default_plot_content($post_id, $post, $update) {
    // Only for new plot posts
    if ($update || $post->post_type !== 'plot') {
        return;
    }

    // Check if content is empty
    if (empty($post->post_content)) {
        $default_content = '';

        // Update the post
        wp_update_post(array(
            'ID' => $post_id,
            'post_content' => $default_content
        ));
    }
}
add_action('wp_insert_post', 'mold_set_default_plot_content', 10, 3);



// Enqueue admin script
function mold_plot_admin_scripts($hook) {
    if ($hook !== 'edit.php' || get_current_screen()->post_type !== 'plot') {
        return;
    }

    wp_enqueue_script(
        'plot-admin-featured',
        MOLD_PLOT_BASE_URL . '/js/plot-admin-featured.js', array('jquery'), '1.0', true);

    wp_localize_script('plot-admin-featured', 'plotFeatured', array(
        'ajax_url' => admin_url('admin-ajax.php'),
        'nonce'    => wp_create_nonce('plot_featured_nonce'),
    ));
}
add_action('admin_enqueue_scripts', 'mold_plot_admin_scripts');



// AJAX handler for toggling featured (using tag instead of meta)
function mold_plot_toggle_featured() {
    check_ajax_referer('plot_featured_nonce', 'nonce');

    $post_id = intval($_POST['post_id']);
    $tag_name = 'featured';

    // Get current tags for this post
    $tags = wp_get_post_terms($post_id, 'post_tag', array('fields' => 'names'));

    if (in_array($tag_name, $tags, true)) {
        // Remove the "featured" tag
        wp_remove_object_terms($post_id, $tag_name, 'post_tag');
        $new_status = 0;
    } else {
        // Add the "featured" tag (create if it doesn't exist)
        wp_add_object_terms($post_id, $tag_name, 'post_tag');
        $new_status = 1;
    }

    wp_send_json_success(array(
        'new_status' => $new_status,
        'icon' => $new_status ? 'dashicons-star-filled' : 'dashicons-star-empty',
    ));
}
add_action('wp_ajax_mold_plot_toggle_featured', 'mold_plot_toggle_featured');




?>