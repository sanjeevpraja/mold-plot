<?php
/*
Plugin Name: Mold Plot
Plugin URI: http://moldthemes.com
Description: Mold Plot Plugin
Version: 3.0
Author: Mold Themes
Author URI: http://www.moldthemes.com
Text Domain: mold-plot
Domain Path:  /languages
*/

/*
* Define constant
*/
define('MOLD_PLOT_MAIN_FILE_URL', __FILE__);
define('MOLD_PLOT_VERSION', '1.7');
define('MOLD_PLOT_BASE_URL', plugin_dir_url(__FILE__));

function wp_mold_plot_is_mold_block_active()
{
	include_once(ABSPATH . 'wp-admin/includes/plugin.php');
	return is_plugin_active('mold-blocks/mold-blocks.php');
}

/**
 * Localization
 */
if (!function_exists('mold_load_plot_plugin_textdomain')) {
	function mold_load_plot_plugin_textdomain()
	{
		$domain = 'mold-plot';
		$locale = apply_filters('plugin_locale', get_locale(), $domain);
		// wp-content/languages/plugin-name/plugin-name-de_DE.mo
		load_textdomain($domain, trailingslashit(WP_LANG_DIR) . $domain . '/' . $domain . '-' . $locale . '.mo');
		// wp-content/plugins/plugin-name/languages/plugin-name-de_DE.mo
		load_plugin_textdomain($domain, FALSE, basename(dirname(__FILE__)) . '/languages/');
	}
	add_action('plugins_loaded', 'mold_load_plot_plugin_textdomain');
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
			wp_enqueue_script('plotadmin', MOLD_PLOT_BASE_URL . '/js/plot-admin.js', ['wp-data', 'wp-edit-post', 'wp-dom-ready'], false, MOLD_PLOT_VERSION);
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
		wp_enqueue_script('mold-plot', MOLD_PLOT_BASE_URL . 'js/plot.js', array('jquery'), array(), MOLD_PLOT_VERSION);
		wp_enqueue_style('mold-plot-core', MOLD_PLOT_BASE_URL . 'css/plot-core.css', array(), MOLD_PLOT_VERSION);

	}
	add_action('wp_enqueue_scripts', 'mold_plot_enqueue_styles_scripts_plugin', 200);
}



/*gutenberg block*/
function wp_mold_plot_register_block()
{
	$options = get_option('wp_mold_plot_blocks_settings');
	$blocks = [
		'block-plot',
		'block-plot-item',
		'block-plot-meta',
	];

	foreach ($blocks as $block) {
		$constant_name = 'MOLD_' . strtoupper(str_replace('-', '_', $block));
		$option_key = 'disable-' . $block;
		$is_disabled = isset($options[$option_key]) ? $options[$option_key] : '0';


		// Define the constant
		if (!defined($constant_name)) {
			define($constant_name, $is_disabled);
		}

		// Register the block if not disabled
		if ($is_disabled !== '1') {
			if (file_exists(plugin_dir_path(__FILE__) . 'inc/' . $block . '.php')) {
				$funtion_name = 'callback_' . str_replace('-', '_', $block);
				require_once plugin_dir_path(__FILE__) . 'inc/' . $block . '.php';
				register_block_type(__DIR__ . "/build/$block", [
					'render_callback' => $funtion_name,
                    'style' => 'mold-' . $block . '-style'
				]);
                wp_register_style(
                    'mold-' . $block . '-style',
                    plugin_dir_url(__FILE__) . "build/$block/style-index.css",
                    array(),
                    '1.0.0'
                );
			} else {
				register_block_type(__DIR__ . "/build/$block");
			}
		}
	}
}

add_action('init', 'wp_mold_plot_register_block');



/**
 * CPT Plot
 */
$plot_cpt_file = plugin_dir_path(__FILE__) . 'cpt-plot/cpt-plot.php';
if (file_exists($plot_cpt_file)) {
	require_once $plot_cpt_file;

	/**
	 * Plot Setting
	 */
	require_once 'cpt-plot/plot-setting.php';
	require_once 'cpt-plot/cpm-fields.php';

}












// AJAX handler for fetching plot data
add_action('wp_ajax_get_plot_data', 'mold_get_plot_data_callback');
add_action('wp_ajax_nopriv_get_plot_data', 'mold_get_plot_data_callback');

function mold_get_plot_data_callback() {
    // Verify nonce for security
    if (!wp_verify_nonce($_POST['nonce'] ?? '', 'mold_plot_nonce')) {
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
        'content'   => apply_filters('the_content', $post->post_content),
        'image'     => get_the_post_thumbnail_url($post, 'large'),
        'excerpt'   => get_the_excerpt($post),
    );

    wp_send_json_success($response);
}
