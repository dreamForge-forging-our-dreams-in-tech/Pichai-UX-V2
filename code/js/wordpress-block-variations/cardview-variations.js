wp.blocks.registerBlockVariation('core/shortcode', {
    name: 'store-tile-block',
    title: 'Store Tile',
    attributes: {
        // Change 'content' to 'text'
        text: '[store-tile]' 
    },
    isActive: ['text'], // Helps the editor recognize this variation
    scope: ['inserter'],
    icon: 'https://cdn-icons-png.flaticon.com/512/2111/2111432.png',
});