<?php
function wc_tag(string $tag, array $attrs = [], string $class = 'grid-container'): string
{
    $html = "<$tag" . ($class ? " class=\"$class\"" : '');
    foreach ($attrs as $key => $val) {
        $html .= ' ' . $key . '="' . esc_attr($val) . '"';
    }
    return "$html></$tag>";
}

function sc_github_repos($atts)
{
    return wc_tag('github-repositories', shortcode_atts([
        'orgName' => 'dreamForge-forging-our-dreams-in-tech',
    ], $atts ?? []), 'grid-container');
}
add_shortcode('github-repos', 'sc_github_repos');

function sc_github_issues($atts)
{
    return wc_tag('github-issues', shortcode_atts([
        'repourl' => 'https://api.github.com/repos/dreamForge-forging-our-dreams-in-tech/The-Magic-Garden/issues?state=all&per_page=100',
        'previewpage' => '#',
    ], $atts ?? []), 'grid-container github-issues');
}
add_shortcode('github-issues', 'sc_github_issues');

function sc_github_login($atts)
{
    return wc_tag('github-login', [], '');
}
add_shortcode('github-login', 'sc_github_login');

function sc_store_tile($atts)
{
    return wc_tag('store-tile', shortcode_atts([
        'name' => 'default-store',
        'price' => '0.00',
        'release' => '2024-01-01',
        'shortdescription' => 'No description available.',
        'storeurl' => '#',
        'imagesrc' => 'https://via.placeholder.com/150',
    ], $atts ?? []), 'grid-container');
}
add_shortcode('store-tile', 'sc_store_tile');

function github_mde_func($atts)
{
    return wc_tag('github-mde', shortcode_atts([
        'orgname' => 'dreamForge-forging-our-dreams-in-tech',
        'repo' => 'The-Magic-Garden',
        'readonly' => 'false',
        'issuenumber' => '',
        'comments' => 'false',

    ], $atts ?? []), '');
}
add_shortcode('github-mde', 'github_mde_func');

function hr($atts)
{
    return wc_tag('hr', shortcode_atts([
        'titletext' => '',
    ], $atts ?? []), '');
}
add_shortcode('hr', 'hr');