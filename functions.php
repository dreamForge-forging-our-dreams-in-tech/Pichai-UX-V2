<?php

require_once(get_template_directory() . '/shortcode_registery.php');
function my_theme_setup()
{
    add_theme_support('block-templates');
    add_theme_support('align-wide');
}
add_action('after_setup_theme', 'my_theme_setup');

function my_custom_theme_assets()
{
    wp_enqueue_style('my-style', get_template_directory_uri() . '/code/css/custom.css');
    wp_enqueue_script_module('my-script', get_template_directory_uri() . '/code/js/imports.js', array(), '1.0');
}
add_action('wp_enqueue_scripts', 'my_custom_theme_assets');
add_action('enqueue_block_editor_assets', 'my_custom_theme_assets');

//adds shortcodes to the block inserter for wordpress.
function dreamforge_editor_assets()
{
    wp_enqueue_script(
        'dreamforge-github-block-variations',
        get_template_directory_uri() . '/code/js/wordpress-block-variations/github-variations.js',
        array('wp-blocks'), // Dependency on WordPress blocks library
        '1.0',
        true
    );

    wp_enqueue_script(
        'dreamforge-cardview-block-variations',
        get_template_directory_uri() . '/code/js/wordpress-block-variations/cardview-variations.js',
        array('wp-blocks'), // Dependency on WordPress blocks library
        '1.0',
        true
    );
}
add_action('enqueue_block_editor_assets', 'dreamforge_editor_assets');