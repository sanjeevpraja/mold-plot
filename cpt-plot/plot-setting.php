<?php
if ( ! defined( 'ABSPATH' ) ) exit;
// Add submenu under "Plots"
add_action('admin_menu', 'mold_add_plot_settings_submenu');
function mold_add_plot_settings_submenu()
{
    add_submenu_page(
        'edit.php?post_type=plot',     // Parent: your CPT
        __('Plot Settings', 'mold-plot'), // Page title
        __('Settings', 'mold-plot'),      // Menu title
        'manage_options',               // Capability
        'plot-settings',                // Slug
        'mold_render_plot_settings_page' // Callback
    );
}

// Render the Plot Settings page
function mold_render_plot_settings_page()
{
?>
    <div class="wrap">
        <h1><?php esc_html_e('Plot Settings', 'mold-plot'); ?></h1>
        <form method="post" action="options.php">
            <?php
            settings_fields('plot_settings_group');
            do_settings_sections('plot-settings');
            submit_button();
            ?>
        </form>
    </div>
    <?php
}

// Register settings and fields
add_action('admin_init', 'mold_register_plot_settings');
function mold_register_plot_settings()
{
    // Register options
    register_setting('plot_settings_group', 'plot_type', 'sanitize_text_field');

    // Section
    add_settings_section(
        'plot_general_section',
        '',
        '',
        'plot-settings'
    );

    // ✅ Plot Type Field - Now using select dropdown
    add_settings_field(
        'plot_type',
        __('Plot Type', 'mold-plot'),
        function () {
            $selected = get_option('plot_type', 'World Map');
            $plot_types = array(
                'World Map' => 'world_map',
                'Image' => 'image',
            );
    ?>
        <select name="plot_type" style="width:300px;">
            <?php foreach ($plot_types as $value => $label) : ?>
                <option value="<?php echo esc_attr($value); ?>" <?php selected($selected, $value); ?>>
                    <?php echo esc_html($label); ?>
                </option>
            <?php endforeach; ?>
        </select>
<?php
        },
        'plot-settings',
        'plot_general_section'
    );
}
?>