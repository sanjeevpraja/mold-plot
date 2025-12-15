import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, InnerBlocks, InspectorControls, MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import {
    PanelBody,
    TextControl,
    TextareaControl,
    SelectControl,
    RangeControl,
    ToggleControl
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useState, useEffect } from '@wordpress/element';

import './editor.scss';
import './style.scss';

registerBlockType('mold/plot-item', {
    icon: {
        src: <svg width="10" height="14" viewBox="0 0 10 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6.84473 0C8.24459 0.00014636 9.33301 1.08935 9.33301 2.48926V11.5107C9.33301 12.9106 8.24459 13.9999 6.84473 14H2.48926C1.08926 14 0 12.9107 0 11.5107V2.48926C0 1.08926 1.08926 0 2.48926 0H6.84473ZM3.5 10.1113C3.07054 10.1114 2.72276 10.4592 2.72266 10.8887C2.72266 11.3182 3.07048 11.667 3.5 11.667C3.92955 11.667 4.27832 11.3182 4.27832 10.8887C4.27822 10.4592 3.92949 10.1113 3.5 10.1113ZM5.83301 10.1113C5.40366 10.1115 5.05577 10.4593 5.05566 10.8887C5.05566 11.3181 5.4036 11.6668 5.83301 11.667C6.26256 11.667 6.61133 11.3182 6.61133 10.8887C6.61123 10.4592 6.2625 10.1113 5.83301 10.1113Z" />
        </svg>
    },

    attributes: {
        imageId: {
            type: 'number',
            default: 0
        },
        imageUrl: {
            type: 'string',
            default: ''
        },
        imageAlt: {
            type: 'string',
            default: ''
        },
        borderRadius: {
            type: 'number',
            default: 0
        },
        imageSize: {
            type: 'number',
            default: 60
        },
        latitude: {
            type: 'string',
            default: ''
        },
        longitude: {
            type: 'string',
            default: ''
        },
        description: {
            type: 'string',
            default: ''
        },
        plotId: {
            type: 'string',
            default: ''
        },
        showCoordinates: {
            type: 'boolean',
            default: true
        }
    },

    edit: ({ attributes, setAttributes }) => {
        const blockProps = useBlockProps();
        const {
            imageId,
            imageUrl,
            imageAlt,
            borderRadius,
            imageSize,
            latitude,
            longitude,
            description,
            plotId,
            showCoordinates
        } = attributes;

        // State for available plot posts
        const [plotOptions, setPlotOptions] = useState([]);

        // Fetch plot posts from custom post type
        useEffect(() => {
            // Fetch plot posts using REST API
            wp.apiFetch({
                path: '/wp/v2/plot?per_page=100'  // Change 'plot' to your actual CPT slug
            }).then(posts => {
                const options = posts.map(post => ({
                    label: post.title.rendered + (post.id ? ` (ID: ${post.id})` : ''),
                    value: post.id.toString()
                }));
                setPlotOptions(options);
            }).catch(error => {
                console.error('Error fetching plot posts:', error);
            });
        }, []);


        return (
            <>
                <InspectorControls>
                    <PanelBody title={__('Image Settings', 'mold-plot')} initialOpen={true}>
                        <MediaUploadCheck>
                            <MediaUpload
                                onSelect={(media) => {
                                    setAttributes({
                                        imageId: media.id,
                                        imageUrl: media.url,
                                        imageAlt: media.alt || ''
                                    });
                                }}
                                allowedTypes={['image']}
                                value={imageId}
                                render={({ open }) => (
                                    <div>
                                        {!imageUrl ? (
                                            <button
                                                onClick={open}
                                                className="components-button is-secondary"
                                                style={{ marginBottom: '10px' }}
                                            >
                                                {__('Select Image', 'mold-plot')}
                                            </button>
                                        ) : (
                                            <div>
                                                <img
                                                    src={imageUrl}
                                                    alt={imageAlt}
                                                    style={{
                                                        maxWidth: '100%',
                                                        borderRadius: `${borderRadius}px`,
                                                        marginBottom: '10px'
                                                    }}
                                                />
                                                <button
                                                    onClick={open}
                                                    className="components-button is-secondary"
                                                    style={{ marginRight: '10px' }}
                                                >
                                                    {__('Replace Image', 'mold-plot')}
                                                </button>
                                                <button
                                                    onClick={() => setAttributes({
                                                        imageId: 0,
                                                        imageUrl: '',
                                                        imageAlt: ''
                                                    })}
                                                    className="components-button is-link is-destructive"
                                                >
                                                    {__('Remove Image', 'mold-plot')}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            />
                        </MediaUploadCheck>
                        <RangeControl
                            label={__('Border Radius', 'mold-plot')}
                            value={borderRadius}
                            onChange={(value) => setAttributes({ borderRadius: value })}
                            min={0}
                            max={50}
                            step={1}
                        />

                        <RangeControl
                            label={__('Image Size', 'mold-plot')}
                            value={imageSize}
                            onChange={(value) => setAttributes({ imageSize: value })}
                            min={30}
                            max={150}
                            step={10}
                        />
                    </PanelBody>
                    <PanelBody title={__('Location Information', 'mold-plot')} initialOpen={false}>
                        <TextControl
                            label={__('Latitude', 'mold-plot')}
                            value={latitude}
                            onChange={(value) => setAttributes({ latitude: value })}
                            placeholder="e.g., 40.7128"
                            type="text"
                        />

                        <TextControl
                            label={__('Longitude', 'mold-plot')}
                            value={longitude}
                            onChange={(value) => setAttributes({ longitude: value })}
                            placeholder="e.g., -74.0060"
                            type="text"
                        />

                        <ToggleControl
                            label={__('Show Coordinates', 'mold-plot')}
                            checked={showCoordinates}
                            onChange={(value) => setAttributes({ showCoordinates: value })}
                        />
                    </PanelBody>
                    <PanelBody title={__('Plot Information', 'mold-plot')} initialOpen={false}>
                        <SelectControl
                            label={__('Select Plot', 'mold-plot')}
                            value={plotId}
                            options={[
                                { label: __('Select a plot...', 'mold-plot'), value: '' },
                                ...plotOptions
                            ]}
                            onChange={(value) => setAttributes({ plotId: value })}
                        />

                        <TextareaControl
                            label={__('Description', 'mold-plot')}
                            value={description}
                            onChange={(value) => setAttributes({ description: value })}
                            placeholder={__('Enter plot description...', 'mold-plot')}
                            rows={4}
                        />
                    </PanelBody>
                </InspectorControls>

                <div {...blockProps}>
                    <div className="plot-item-image">
                        {imageUrl && (

                            <img
                                src={imageUrl}
                                alt={imageAlt}
                                style={{
                                    width: '100%',
                                    height: 'auto',
                                    borderRadius: `${borderRadius}px`
                                }}
                            />
                        )}
                    </div>

                    <div className="plot-item-info">
                        {(latitude || longitude || description) && (
                            <>
                                {plotId && (
                                    <div className="plot-id" style={{ fontWeight: 'bold', marginBottom: '10px' }}>
                                        {__('Plot ID:', 'mold-plot')} {plotId}
                                    </div>
                                )}

                                {showCoordinates && (latitude || longitude) && (
                                    <div className="plot-coordinates" style={{ fontSize: '0.9em', color: '#666' }}>
                                        {latitude && longitude ? `${latitude}, ${longitude}` : latitude || longitude}
                                    </div>
                                )}
                            </>
                        )}
                        {description ? (
                            <div className="plot-description" style={{ marginBottom: '10px' }}>
                                {description}
                            </div>
                        ) : (
                            <div className="plot-description-placeholder" style={{ marginBottom: '10px' }}>
                                {__('Enter plot description...', 'mold-plot')}
                            </div>
                        )}


                    </div>
                </div>
            </>
        );
    },

    save: ({ attributes }) => {
        const blockProps = useBlockProps.save({
            className: 'swiper-slide plot-item'
        });

        const {
            imageUrl,
            imageAlt,
            borderRadius,
            imageSize,
            latitude,
            longitude,
            description,
            plotId,
            showCoordinates
        } = attributes;

        // Get the correct image URL based on selected size
        let displayImageUrl = imageUrl;
        if (imageUrl && imageSize !== 'full') {
            // In the frontend, you might need to handle different image sizes differently
            // This would typically be handled server-side or with a helper function
            displayImageUrl = imageUrl.replace('/wp-content/uploads/', `/wp-content/uploads/${imageSize}/`);
        }

        return (
            <div {...blockProps}>
                {imageUrl && (
                    <div className="plot-item-image">
                        <img
                            src={displayImageUrl}
                            alt={imageAlt}
                            className={`plot-image-size-${imageSize}`}
                            style={{ borderRadius: `${borderRadius}px` }}
                            data-image-id={attributes.imageId}
                        />
                    </div>
                )}

                {(latitude || longitude || description || plotId) && (
                    <div className="plot-item-info">
                        {plotId && (
                            <div className="plot-id" data-plot-id={plotId}>
                                {__('Plot ID:', 'mold-plot')} {plotId}
                            </div>
                        )}

                        {description && (
                            <div className="plot-description">
                                {description}
                            </div>
                        )}

                        {showCoordinates && (latitude || longitude) && (
                            <div className="plot-coordinates">
                                {latitude && longitude ? `${latitude}, ${longitude}` : latitude || longitude}
                            </div>
                        )}
                    </div>
                )}

            </div>
        );
    },
});