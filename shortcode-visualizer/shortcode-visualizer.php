<?php
/**
 * Plugin Name: Expert Shortcode Renderer
 */

// 1. Analyze shortcode functions to find their attributes using PHP Reflection
function expert_get_shortcode_attributes($tag) {
    global $shortcode_tags;

    if (!isset($shortcode_tags[$tag])) {
        return [];
    }

    $callback = $shortcode_tags[$tag];

    try {
        // Find exactly where this shortcode's function is coded in the file system
        if (is_array($callback)) {
            $reflector = new ReflectionMethod($callback[0], $callback[1]);
        } elseif (is_string($callback) && function_exists($callback)) {
            $reflector = new ReflectionFunction($callback);
        } else {
            return []; // Can't reflect anonymous functions/closures easily
        }

        $filename = $reflector->getFileName();
        $startLine = $reflector->getStartLine() - 1;
        $endLine = $reflector->getEndLine();

        if (!$filename || !file_exists($filename)) {
            return [];
        }

        // Read the file lines where the shortcode is defined
        $file_lines = file($filename);
        $length = $endLine - $startLine;
        $code_block = implode("", array_slice($file_lines, $startLine, $length));

        // Regex to hunt down shortcode_atts( array(...) )
        $found_attributes = [];
        
        // 🔍 Pattern 1: Look for associative array keys 'attr' => 'default'
        if (preg_match('/shortcode_atts\s*\(\s*(?:array\s*\(|\[)([^?]+?)(?:\)|\])\s*,/s', $code_block, $matches)) {
            $array_contents = $matches[1];
            preg_match_all('/[\'"]([a-zA-Z0-9_\-]+)[\'"]\s*=>/', $array_contents, $keys);
            if (!empty($keys[1])) {
                $found_attributes = array_unique($keys[1]);
            }
        }

        // 🔍 Pattern 2: Look for extract(shortcode_atts(...)) style definitions
        if (empty($found_attributes)) {
            preg_match_all('/[\'"]([a-zA-Z0-9_\-]+)[\'"]\s*=>/', $code_block, $keys);
            if (!empty($keys[1])) {
                $found_attributes = array_unique($keys[1]);
            }
        }

        return $found_attributes;

    } catch (Exception $e) {
        return [];
    }
}


// 2. Enqueue block assets and pass the data to JavaScript
add_action('enqueue_block_editor_assets', function() {
    global $shortcode_tags;

    $tags = array_keys($shortcode_tags);
    sort($tags);

    $options = array(array('label' => 'Select a shortcode...', 'value' => ''));
    foreach ($tags as $tag) {
        $options[] = array('label' => $tag, 'value' => $tag);
    }

    // MAP OUT EVERY SHORTCODE'S ATTRIBUTES DYNAMICALLY!
    $mappedAttributes = [];
    foreach ($tags as $tag) {
        $attrs = expert_get_shortcode_attributes($tag);
        if (!empty($attrs)) {
            $mappedAttributes[$tag] = $attrs;
        }
    }

    $script_url = plugin_dir_url(__FILE__) . 'block.js';
    
    wp_enqueue_script(
        'expert-sc-js',
        $script_url,
        array('wp-blocks', 'wp-block-editor', 'wp-components', 'wp-server-side-render', 'wp-element'),
        filemtime(plugin_dir_path(__FILE__) . 'block.js')
    );

    wp_localize_script('expert-sc-js', 'expertData', array(
        'shortcodes' => $options,
        'mappedAttributes' => $mappedAttributes // Sent automatically!
    ));
});


// 3. Register Block Type & Render Callback
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

    ob_start();
    
    if (shortcode_exists($tag)) {
        echo do_shortcode("[{$tag} {$params}]");
    } else {
        echo "Shortcode [{$tag}] not found.";
    }

    $output = ob_get_clean();

    return !empty($output) ? '<div class="sc-render">' . $output . '</div>' : '<div>Shortcode returned no content.</div>';
}