<?php
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

add_shortcode('github-issues', function ($atts) {
    // 1. Change 'repoUrl' to 'repourl' to match what the browser actually sees
    $a = shortcode_atts(array(
        'repourl' => 'https://api.github.com/repos/dreamForge-forging-our-dreams-in-tech/The-Magic-Garden/issues?state=all&per_page=100',
    ), $atts);

    // 2. Render it with the lowercase attribute name
    return '<github-issues repourl="' . esc_attr($a['repourl']) . '" class="grid-container github-issues"></github-issues>';
});

add_shortcode('github-login', function () {
    return '<github-login></github-login>';
});

function store_tile_shortcode($atts)
{
    // 1. Keys must be LOWERCASE here to match WordPress processing
    $a = shortcode_atts(array(
        'name' => 'default-store',
        'price' => '0.00',
        'release' => '2024-01-01',
        'shortdescription' => 'No description available.', // Lowercase
        'storeurl' => '#',                          // Lowercase
        'imagesrc' => 'https://via.placeholder.com/150', // Lowercase
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