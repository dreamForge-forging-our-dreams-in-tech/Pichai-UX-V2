<?php
/**
 * Plugin Name: Expert Shortcode Renderer
 */

add_action('enqueue_block_editor_assets', function() {
    global $shortcode_tags;

    // Get all registered shortcode tags and format them for a dropdown
    $tags = array_keys($shortcode_tags);
    sort($tags);

    $options = array(array('label' => 'Select a shortcode...', 'value' => ''));
    foreach ($tags as $tag) {
        $options[] = array('label' => $tag, 'value' => $tag);
    }

    $script_url = plugin_dir_url(__FILE__) . 'block.js';
    
wp_enqueue_script(
    'expert-sc-js',
    $script_url,
    array('wp-blocks', 'wp-block-editor', 'wp-components', 'wp-server-side-render', 'wp-element'), // Ensure this is exactly like this
    filemtime(plugin_dir_path(__FILE__) . 'block.js')
);

    // This pushes the data into a global JS variable called 'expertData'
    wp_localize_script('expert-sc-js', 'expertData', array(
        'shortcodes' => $options
    ));
});

add_action('init', function() {
    register_block_type('expert/shortcode-preview', array(
        'render_callback' => 'expert_render_callback',
        'attributes' => array(
            'tag' => array('type' => 'string', 'default' => ''),
            'params' => array('type' => 'string', 'default' => '')
        )
    ));
});

function expert_render_callback($atts) {
    $tag = isset($atts['tag']) ? trim(strval($atts['tag'])) : '';
    $params = isset($atts['params']) ? trim(strval($atts['params'])) : '';

    if (empty($tag)) return '<div>Select a shortcode...</div>';

    // Start a buffer to catch "echoed" content from messy shortcodes
    ob_start();
    
    if (shortcode_exists($tag)) {
        echo do_shortcode("[{$tag} {$params}]");
    } else {
        echo "Shortcode [{$tag}] not found.";
    }

    $output = ob_get_clean();

    // ERROR #130 FIX: Ensure we return a non-empty string with a wrapper
    return !empty($output) ? '<div class="sc-render">' . $output . '</div>' : '<div>Shortcode returned no content.</div>';
}