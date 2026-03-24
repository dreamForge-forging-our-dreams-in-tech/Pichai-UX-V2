(function(wp) {
    const { registerBlockType } = wp.blocks;
    const ServerSideRender = wp.serverSideRender; 
    const { InspectorControls } = wp.blockEditor;
    const { PanelBody, TextControl, SelectControl } = wp.components;
    const { createElement, Fragment } = wp.element;

    const rawOptions = (window.expertData && window.expertData.shortcodes) ? window.expertData.shortcodes : [];
    const shortcodeOptions = Array.isArray(rawOptions) ? rawOptions : [{ label: 'Error loading tags', value: '' }];
    
    // Grabbing our harvested list from PHP
    const mappedAttributes = (window.expertData && window.expertData.mappedAttributes) ? window.expertData.mappedAttributes : {};

    // Helper to extract keys & values from the parameter string (e.g. 'orgName="dream" theme="dark"')
    const parseParams = (str) => {
        const obj = {};
        if (!str) return obj;
        const regex = /([a-zA-Z0-9_\-]+)="([^"]*)"/g;
        let match;
        while ((match = regex.exec(str)) !== null) {
            obj[match[1]] = match[2];
        }
        return obj;
    };

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
            const selectedTag = attributes.tag || '';

            // Find if our harvester found specific keys for this shortcode
            const knownAttrs = mappedAttributes[selectedTag] || [];
            const currentAttrObj = parseParams(attributes.params);

            return createElement(Fragment, null,
                createElement(InspectorControls, null,
                    createElement(PanelBody, { title: 'Settings' },
                        createElement(SelectControl, {
                            label: 'Choose Shortcode',
                            value: selectedTag,
                            options: shortcodeOptions,
                            onChange: (v) => setAttributes({ tag: v })
                        }),

                        // Render separate text boxes for each attribute found!
                        knownAttrs.map((attrKey) => {
                            return createElement(TextControl, {
                                label: `Attribute: ${attrKey}`,
                                value: currentAttrObj[attrKey] || '',
                                onChange: (newVal) => {
                                    const updatedObj = { ...currentAttrObj, [attrKey]: newVal };
                                    
                                    // Turn object back into a string: 'orgName="someValue" someOtherKey="val2"'
                                    const updatedStr = Object.entries(updatedObj)
                                        .filter(([_, v]) => v !== '') // Don't include empty strings
                                        .map(([k, v]) => `${k}="${v}"`)
                                        .join(' ');

                                    setAttributes({ params: updatedStr.trim() });
                                }
                            });
                        }),

                        // Keep the raw string as a fallback just in case!
                        createElement(TextControl, {
                            label: 'Raw Attributes String (Fallback)',
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
                    (typeof selectedTag === 'string' && selectedTag !== '') 
                        ? createElement(ServerSideRender, { 
                            block: 'expert/shortcode-preview', 
                            attributes: {
                                tag: selectedTag,
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