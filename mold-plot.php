<?php
/*
Plugin Name: Mold Plot
Plugin URI: https://moldthemes.com
Description: Mold Plot Plugin
Version: 2.0
Author: Mold Themes
Author URI: https://www.moldthemes.com
Text Domain: mold-plot
Domain Path:  /languages
License: GPL-2.0-or-later
License URI: https://www.gnu.org/licenses/gpl-2.0.html
Requires at least: 6.0
Requires PHP: 7.4
*/

if ( ! defined( 'ABSPATH' ) ) exit;

/*
* Define constant
*/
define('MOLD_PLOT_MAIN_FILE_URL', __FILE__);
define('MOLD_PLOT_VERSION', '1.7');
define('MOLD_PLOT_BASE_URL', plugin_dir_url(__FILE__));

function mold_plot_is_mold_block_active()
{
	if ( ! function_exists( 'is_plugin_active' ) ) {
		include_once( ABSPATH . 'wp-admin/includes/plugin.php' );
	}
	return is_plugin_active('mold-blocks/mold-blocks.php');
}



/**
 * Enqueue Admin styles and scripts
 */
if (!function_exists('mold_load_plot_admin_styles')) {
	function mold_load_plot_admin_styles($hook)
	{
		wp_enqueue_style('mold-plot-admin', MOLD_PLOT_BASE_URL . 'css/plot-admin.css', array(), MOLD_PLOT_VERSION);

		global $post;
		if (is_object($post) && ($post->post_type == 'plot')) {
			wp_enqueue_script('plotadmin', MOLD_PLOT_BASE_URL . 'js/plot-admin.js', ['wp-data', 'wp-edit-post', 'wp-dom-ready'], MOLD_PLOT_VERSION, true);
		}
	}
	add_action('admin_enqueue_scripts', 'mold_load_plot_admin_styles');
}

/**
 * Enqueue Frontend styles and scripts
 */
if (!function_exists('mold_plot_enqueue_styles_scripts_plugin')) {

	function mold_plot_enqueue_styles_scripts_plugin()
	{
		wp_enqueue_script('mold-plot', MOLD_PLOT_BASE_URL . 'js/plot.js', array('jquery'), MOLD_PLOT_VERSION, true);
		wp_enqueue_style('mold-plot-core', MOLD_PLOT_BASE_URL . 'css/plot-core.css', array(), MOLD_PLOT_VERSION);

	}
	add_action('wp_enqueue_scripts', 'mold_plot_enqueue_styles_scripts_plugin', 200);
}



/*gutenberg block*/
function mold_plot_register_block()
{
	$options = get_option('mold_plot_blocks_settings');
	$blocks = [
		'block-plot',
		'block-plot-item',
		'block-plot-meta',
	];

	foreach ($blocks as $block) {
		$option_key = 'disable-' . $block;
		$is_disabled = isset($options[$option_key]) ? $options[$option_key] : '0';

		// Define the constant explicitly to satisfy naming convention checks
		if ($block === 'block-plot' && !defined('MOLD_BLOCK_PLOT')) {
			define('MOLD_BLOCK_PLOT', $is_disabled);
		} elseif ($block === 'block-plot-item' && !defined('MOLD_BLOCK_PLOT_ITEM')) {
			define('MOLD_BLOCK_PLOT_ITEM', $is_disabled);
		} elseif ($block === 'block-plot-meta' && !defined('MOLD_BLOCK_PLOT_META')) {
			define('MOLD_BLOCK_PLOT_META', $is_disabled);
		}

		// Register the block if not disabled
		if ($is_disabled !== '1') {
			if (file_exists(plugin_dir_path(__FILE__) . 'inc/' . $block . '.php')) {
				$function_name = 'mold_plot_render_' . str_replace('-', '_', str_replace('block-', '', $block));
				require_once plugin_dir_path(__FILE__) . 'inc/' . $block . '.php';
				register_block_type(plugin_dir_path(__FILE__) . "build/$block", [
					'render_callback' => $function_name,
                    'style' => 'mold-' . $block . '-style'
				]);
                wp_register_style(
                    'mold-' . $block . '-style',
                    plugin_dir_url(__FILE__) . "build/$block/style-index.css",
                    array(),
                    MOLD_PLOT_VERSION
                );
			} else {
				register_block_type(plugin_dir_path(__FILE__) . "build/$block");
			}
		}
	}
}

add_action('init', 'mold_plot_register_block');



/**
 * CPT Plot
 */
$mold_plot_cpt_file = plugin_dir_path(__FILE__) . 'cpt-plot/cpt-plot.php';
if (file_exists($mold_plot_cpt_file)) {
	require_once $mold_plot_cpt_file;

	/**
	 * Plot Setting
	 */
	require_once plugin_dir_path(__FILE__) . 'cpt-plot/plot-setting.php';
	require_once plugin_dir_path(__FILE__) . 'cpt-plot/cpm-fields.php';

}





// AJAX handler for fetching plot data
add_action('wp_ajax_mold_get_plot_data', 'mold_get_plot_data_callback');
add_action('wp_ajax_nopriv_mold_get_plot_data', 'mold_get_plot_data_callback');

function mold_get_plot_data_callback() {
    // Verify nonce for security
    $nonce = isset($_POST['nonce']) ? sanitize_text_field(wp_unslash($_POST['nonce'])) : '';
    if (!wp_verify_nonce($nonce, 'mold_plot_nonce')) {
        wp_die('Security check failed', 403);
    }

    $plot_id = isset($_POST['plot_id']) ? intval($_POST['plot_id']) : 0;

    if (!$plot_id) {
        wp_send_json_error('Invalid plot ID');
    }

    // Get the post
    $post = get_post($plot_id);

    if (!$post || $post->post_type !== 'plot') {
        wp_send_json_error('Plot not found');
    }

    // Prepare response
    $response = array(
        'title'     => get_the_title($post),
        'content'   => apply_filters('mold_plot_the_content', $post->post_content),
        'image'     => get_the_post_thumbnail_url($post, 'large'),
        'excerpt'   => get_the_excerpt($post),
    );

    wp_send_json_success($response);
}

// Ensure the prefixed content hook expands blocks and shortcodes
add_filter('mold_plot_the_content', 'do_blocks', 9);
add_filter('mold_plot_the_content', 'wptexturize');
add_filter('mold_plot_the_content', 'convert_smilies');
add_filter('mold_plot_the_content', 'wpautop');
add_filter('mold_plot_the_content', 'shortcode_unautop');
add_filter('mold_plot_the_content', 'prepend_attachment');
add_filter('mold_plot_the_content', 'wp_filter_content_tags');
add_filter('mold_plot_the_content', 'do_shortcode', 11);

