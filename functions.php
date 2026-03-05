<?php
function my_theme_setup()
{
    // This tells WordPress to look for the /templates/ folder
    add_theme_support('block-templates');

    // Optional: Adds support for the "Wide" and "Full" alignment in the editor
    add_theme_support('align-wide');
}
add_action('after_setup_theme', 'my_theme_setup');


//add the main css and js import file to wordpress to be used in the theme
function my_custom_theme_assets()
{
    wp_enqueue_style('my-style', get_template_directory_uri() . '/assets/css/custom.css');

    wp_enqueue_script_module('my-script', get_template_directory_uri() . '/assets/js/imports.js', array(), '1.0');
}
add_action('wp_enqueue_scripts', 'my_custom_theme_assets');

//add the main css and js import file to wordpress to be used in the block editor
add_action('enqueue_block_editor_assets', 'my_custom_theme_assets');

/**
 * Register custom query variables to prevent WordPress from 
 * blocking the incoming GitHub user data.
 */
function dreamforge_register_query_vars($vars)
{
    $vars[] = 'auth_success';
    $vars[] = 'user';
    $vars[] = 'auth_error';
    return $vars;
}
add_filter('query_vars', 'dreamforge_register_query_vars');


//registreert wordpress shortcodes met variables
function github_repos_shortcode($atts)
{
    // 1. Define defaults and merge with user input
    $a = shortcode_atts(array(
        'orgName' => 'dreamForge-forging-our-dreams-in-tech', // default value
    ), $atts);

    // 2. Return the HTML output
    return '<github-repositories orgName="' . $a['orgName'] . '" class="grid-container"></github-repositories>';
}
add_shortcode('github-repos', 'github_repos_shortcode');

add_shortcode('github-issues', function () {
    return '<github-issues class="grid-container"></github-issues>';
});

add_shortcode('github-login', function () {
    return '<github-login></github-login>';
});

function store_tile_shortcode($atts)
{
    // 1. Keys must be LOWERCASE here to match WordPress processing
    $a = shortcode_atts(array(
        'name'             => 'default-store',
        'price'            => '0.00',
        'release'          => '2024-01-01',
        'shortdescription' => 'No description available.', // Lowercase
        'storeurl'         => '#',                          // Lowercase
        'imagesrc'         => 'https://via.placeholder.com/150', // Lowercase
    ), $atts);

    // 2. Escape the output for security and stability
    return sprintf(
        '<store-tile name="%s" price="%s" release="%s" shortDescription="%s" storeUrl="%s" imageSrc="%s" class="grid-container"></store-tile>',
        esc_attr($a['name']),
        esc_attr($a['price']),
        esc_attr($a['release']),
        esc_attr($a['shortdescription']),
        esc_attr($a['storeurl']),
        esc_attr($a['imagesrc'])
    );
}
add_shortcode('store-tile', 'store_tile_shortcode');

//adds shortcodes to the block inserter for wordpress.
function dreamforge_editor_assets()
{
    wp_enqueue_script(
        'dreamforge-github-block-variations',
        get_template_directory_uri() . '/assets/js/wordpress-block-variations/github-variations.js',
        array('wp-blocks'), // Dependency on WordPress blocks library
        '1.0',
        true
    );

    wp_enqueue_script(
        'dreamforge-cardview-block-variations',
        get_template_directory_uri() . '/assets/js/wordpress-block-variations/cardview-variations.js',
        array('wp-blocks'), // Dependency on WordPress blocks library
        '1.0',
        true
    );
}
add_action('enqueue_block_editor_assets', 'dreamforge_editor_assets');