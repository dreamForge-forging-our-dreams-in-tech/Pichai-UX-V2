wp.blocks.registerBlockVariation('core/shortcode', {
    name: 'hr-block',
    title: 'HR',
    attributes: {
        // Change 'content' to 'text'
        text: '[hr]' 
    },
    isActive: ['text'], // Helps the editor recognize this variation
    scope: ['inserter'],
    icon: 'https://cdn-icons-png.flaticon.com/512/2111/2111432.png',
});