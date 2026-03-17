(function(wp) {
    const { registerBlockType } = wp.blocks;
    // FIX: Pull from the correct package
    const ServerSideRender = wp.serverSideRender; 
    const { InspectorControls } = wp.blockEditor;
    const { PanelBody, TextControl, SelectControl } = wp.components;
    const { createElement, Fragment } = wp.element;

    // Safety: Ensure shortcodeOptions is always an array of objects
    const rawOptions = (window.expertData && window.expertData.shortcodes) ? window.expertData.shortcodes : [];
    const shortcodeOptions = Array.isArray(rawOptions) ? rawOptions : [{ label: 'Error loading tags', value: '' }];

    registerBlockType('expert/shortcode-preview', {
        title: 'EXPERT Shortcode Live',
        icon: 'visibility',
        category: 'text',
        attributes: {
            tag: { type: 'string', default: '' },
            params: { type: 'string', default: '' }
        },
        edit: function(props) {
            const { attributes, setAttributes } = props;

            return createElement(Fragment, null,
                createElement(InspectorControls, null,
                    createElement(PanelBody, { title: 'Settings' },
                        createElement(SelectControl, {
                            label: 'Choose Shortcode',
                            value: attributes.tag || '',
                            options: shortcodeOptions,
                            onChange: (v) => setAttributes({ tag: v })
                        }),
                        createElement(TextControl, {
                            label: 'Attributes',
                            value: attributes.params || '',
                            onChange: (v) => setAttributes({ params: v })
                        })
                    )
                ),
                createElement('div', { 
                    style: { 
                        border: '1px dashed #333',  
                        minHeight: '50px',
                        background: 'TRANSPARENT' 
                    } 
                },
                    // Only render ServerSideRender if we have a tag AND it is a string
                    (typeof attributes.tag === 'string' && attributes.tag !== '') 
                        ? createElement(ServerSideRender, { 
                            block: 'expert/shortcode-preview', 
                            attributes: {
                                tag: attributes.tag,
                                params: attributes.params || ''
                            }
                          })
                        : 'Select a shortcode tag in the sidebar to begin.'
                )
            );
        },
        save: () => null
    });
})(window.wp);