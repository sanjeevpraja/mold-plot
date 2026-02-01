<?php
if ( ! defined( 'ABSPATH' ) ) exit;
// Add Meta Boxes
function add_plot_meta_boxes()
{
    add_meta_box(
        'plot_details',
        __('Plot Details', 'mold-plot'),
        'plot_details_callback',
        'plot',  // Changed from 'plot' to match your CPT
        'normal',
        'high'
    );
}
add_action('add_meta_boxes', 'add_plot_meta_boxes');

// Meta Box Callback Function
function plot_details_callback($post)
{
    // Add nonce field for security
    wp_nonce_field('plot_meta_box', 'plot_meta_box_nonce');

    // Get current values
    $plot_x = get_post_meta($post->ID, '_plot_x', true);
    $plot_y = get_post_meta($post->ID, '_plot_y', true);

?>
    <table class="form-table" role="presentation">
        <tbody>
            <tr>
                <th scope="row"><label for="plot_x"><?php esc_html_e('Longitude', 'mold-plot'); ?></label></th>
                <td><input type="number" step="any" id="plot_x" name="plot_x" value="<?php echo esc_attr($plot_x); ?>" class="regular-text" /></td>
            </tr>
            <tr>
                <th scope="row"><label for="plot_y"><?php esc_html_e('Latitude', 'mold-plot'); ?></label></th>
                <td><input type="number" step="any" id="plot_y" name="plot_y" value="<?php echo esc_attr($plot_y); ?>" class="regular-text" /></td>
            </tr>
        </tbody>
    </table>
<?php
}

// Save Meta Box Data - FIXED VERSION
function save_plot_meta_box_data($post_id)
{
    // Check if nonce is set and valid
    if (!isset($_POST['plot_meta_box_nonce']) || !wp_verify_nonce(sanitize_key(wp_unslash($_POST['plot_meta_box_nonce'])), 'plot_meta_box')) {
        return;
    }

    // Check user permissions
    if (!current_user_can('edit_post', $post_id)) return;
    
    // Check for autosave
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) return;
    
    // Check post type - CHANGED FROM 'tour' TO 'plot'
    if (get_post_type($post_id) !== 'plot') return;

    // Save longitude (x)
    if (isset($_POST['plot_x'])) {
        $plot_x = sanitize_text_field(wp_unslash($_POST['plot_x']));
        update_post_meta($post_id, '_plot_x', $plot_x);
    }
    
    // Save latitude (y)
    if (isset($_POST['plot_y'])) {
        $plot_y = sanitize_text_field(wp_unslash($_POST['plot_y']));
        update_post_meta($post_id, '_plot_y', $plot_y);
    }
}
add_action('save_post', 'save_plot_meta_box_data');

function get_plot_meta($post_id, $field)
{
    return get_post_meta($post_id, '_plot_' . $field, true);
}

function display_plot_info($post_id = null)
{
    if (!$post_id) {
        $post_id = get_the_ID();
    }

    $fields = array(
        'x' => __('Longitude', 'mold-plot'),
        'y' => __('Latitude', 'mold-plot'),
    );

    echo '<div class="cpt-info">';
    foreach ($fields as $field => $label) {
        $value = get_plot_meta($post_id, $field);
        if (!empty($value)) {
            echo '<div class="cpt-field">';
            echo '<strong>' . esc_html($label) . ':</strong> ';
            echo esc_html($value);
            echo '</div>';
        }
    }
    echo '</div>';
}

function register_plot_meta_fields()
{
    $fields = array(
        'x',
        'y',
    );

    foreach ($fields as $field_name) {
        // Register the meta field for Gutenberg/REST API
        register_post_meta('plot', '_plot_' . $field_name, array(
            'show_in_rest' => true,
            'single' => true,
            'type' => 'string',
            'auth_callback' => function () {
                return current_user_can('edit_posts');
            },
        ));

        // Add a shortcode for each field with post_id parameter
        add_shortcode('plot_' . $field_name, function ($atts) use ($field_name) {  // Changed from 'tour_' to 'plot_'
            $atts = shortcode_atts(array(
                'post_id' => get_the_ID(),
            ), $atts);

            $meta_value = get_post_meta($atts['post_id'], '_plot_' . $field_name, true);
            return esc_html($meta_value);
        });
    }
}
add_action('init', 'register_plot_meta_fields');

// Admin list view
function plot_admin_columns($columns)
{
    $new_columns = array();
    $new_columns['cb'] = $columns['cb'];
    $new_columns['featured'] = '<span class="dashicons dashicons-star-filled" title="Featured"></span>';
    $new_columns['title'] = $columns['title'];
    $new_columns['x'] = __('Longitude', 'mold-plot');
    $new_columns['y'] = __('Latitude', 'mold-plot');
    $new_columns['date'] = $columns['date'];

    return $new_columns;
}
add_filter('manage_plot_posts_columns', 'plot_admin_columns');

// Display custom columns in admin
function plot_custom_columns($column, $post_id)
{
    switch ($column) {
        case 'featured':
            $tags = wp_get_post_terms($post_id, 'post_tag', array('fields' => 'names'));
            $is_featured = in_array('featured', $tags, true);
            $icon = $is_featured ? 'dashicons-star-filled' : 'dashicons-star-empty';
            $title = $is_featured ? __('Unmark as featured', 'mold-plot') : __('Mark as featured', 'mold-plot');
            echo '<a href="#" class="plot-featured-toggle" data-post-id="' . esc_attr($post_id) . '" title="' . esc_attr($title) . '">
            <span class="dashicons ' . esc_attr($icon) . '"></span>
          </a>';
            break;  
        case 'x':
            echo esc_html(get_post_meta($post_id, '_plot_x', true));
            break;
        case 'y':
            echo esc_html(get_post_meta($post_id, '_plot_y', true));
            break;
    }
}
add_action('manage_plot_posts_custom_column', 'plot_custom_columns', 10, 2);

// Make columns sortable
function plot_sortable_columns($columns)
{
    $columns['x'] = 'x';
    $columns['y'] = 'y';
    return $columns;
}
add_filter('manage_edit-plot_sortable_columns', 'plot_sortable_columns');
?>