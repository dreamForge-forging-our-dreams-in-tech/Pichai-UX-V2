wp.blocks.registerBlockVariation('core/shortcode', {
    name: 'github-repos-block',
    title: 'GitHub Repositories',
    attributes: {
        // Change 'content' to 'text'
        text: '[github-repos]' 
    },
    isActive: ['text'], // Helps the editor recognize this variation
    scope: ['inserter'],
    icon: 'https://cdn-icons-png.flaticon.com/512/2111/2111432.png',
});

wp.blocks.registerBlockVariation('core/shortcode', {
    name: 'github-issues-block',
    title: 'GitHub Issues',
    attributes: {
        // Change 'content' to 'text'
        text: '[github-issues]' 
    },
    isActive: ['text'], // Helps the editor recognize this variation
    scope: ['inserter'],
    icon: 'https://static.thenounproject.com/png/1446467-200.png',
});

wp.blocks.registerBlockVariation('core/shortcode', {
    name: 'github-login-block',
    title: 'GitHub Login',
    attributes: {
        // Change 'content' to 'text'
        text: '[github-login]' 
    },
    isActive: ['text'], // Helps the editor recognize this variation
    scope: ['inserter'],
    icon: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJ03yvVXvs-In8Y6zQUHuW1VXUogfBo_zcmQ&s',
});


wp.blocks.registerBlockVariation('core/shortcode', {
    name: 'github-mde-block',
    title: 'GitHub MDE',
    attributes: {
        // Change 'content' to 'text'
        text: '[github-mde]' 
    },
    isActive: ['text'], // Helps the editor recognize this variation
    scope: ['inserter'],
    icon: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJ03yvVXvs-In8Y6zQUHuW1VXUogfBo_zcmQ&s',
});