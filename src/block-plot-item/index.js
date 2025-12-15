import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, InspectorControls, MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import {
    PanelBody,
    TextControl,
    SelectControl,
    RangeControl,
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
        thumbnailUrl: {
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
            default: 'Enter Text'
        },
        plotId: {
            type: 'string',
            default: ''
        }
    },

    edit: ({ attributes, setAttributes }) => {
        const blockProps = useBlockProps();
        const {
            imageId,
            imageUrl,
            thumbnailUrl,
            imageAlt,
            borderRadius,
            imageSize,
            latitude,
            longitude,
            description,
            plotId
        } = attributes;

        // State for available plot posts
        const [plotOptions, setPlotOptions] = useState([]);

        // Fetch plot posts from custom post type
        useEffect(() => {
            wp.apiFetch({
                path: '/wp/v2/plot?per_page=100'
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

        // Fetch image data when imageId changes
        useEffect(() => {
            if (imageId && imageId > 0) {
                wp.apiFetch({
                    path: `/wp/v2/media/${imageId}`
                }).then(media => {
                    // Get thumbnail URL if available, otherwise fallback to full size
                    const thumbnail = media.media_details?.sizes?.thumbnail?.source_url || 
                                     media.media_details?.sizes?.medium?.source_url || 
                                     media.source_url || 
                                     imageUrl;
                    
                    setAttributes({
                        imageUrl: media.source_url,
                        thumbnailUrl: thumbnail,
                        imageAlt: media.alt_text || media.title.rendered || ''
                    });
                }).catch(error => {
                    console.error('Error fetching media:', error);
                });
            }
        }, [imageId]);

        const handleImageChange = (newImage) => {
            // Get thumbnail URL if available
            const thumbnail = newImage.sizes?.thumbnail?.url || 
                             newImage.sizes?.medium?.url || 
                             newImage.url;
            
            setAttributes({
                imageId: newImage.id,
                imageUrl: newImage.url,
                thumbnailUrl: thumbnail,
                imageAlt: newImage.alt || ''
            });
        };

        // Determine which image URL to display
        const displayImageUrl = thumbnailUrl || imageUrl;

        

        return (
            <>
                <InspectorControls>
                    <PanelBody title={__('Image Settings', 'mold-plot')} initialOpen={true}>
                        <MediaUploadCheck>
                            <MediaUpload
                                onSelect={handleImageChange}
                                allowedTypes={['image']}
                                value={imageId}
                                render={({ open }) => (
                                    <div>
                                        {!displayImageUrl ? (
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
                                                    src={displayImageUrl}
                                                    alt={imageAlt}
                                                    style={{
                                                        maxWidth: '100%',
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
                                                        thumbnailUrl: '',
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
                        <hr/>
                        <RangeControl
                            label={__('Border Radius', 'mold-plot')}
                            value={borderRadius}
                            onChange={(value) => setAttributes({ borderRadius: value })}
                            min={0}
                            max={150}
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
                </InspectorControls>

                <div {...blockProps}>
                    <div className="plot-item-image" style={{borderRadius: `${borderRadius}px`}}>
                        <MediaUpload
                            onSelect={handleImageChange}
                            allowedTypes={['image']}
                            value={imageId}
                            render={({ open }) => (
                                <div onClick={open} style={{ cursor: 'pointer' }}>
                                    {displayImageUrl ? (
                                        <img 
                                            src={displayImageUrl} 
                                            alt={imageAlt} 
                                            style={{ 
                                                borderRadius: `${borderRadius}px`,
                                                objectFit: 'cover'
                                            }}
                                        />
                                    ) : (
                                        <button className="btn-add-media" title="Add Image">
                                            <i className="dashicons dashicons-plus"></i>
                                        </button>
                                    )}
                                </div>
                            )}
                        />
                    </div>

                    <div className="plot-item-info">
                        <div class="plot-meta">
                            <div class="plot-lon-lat">
                                <TextControl
                                    label={__('Latitude', 'mold-plot')}
                                    value={latitude}
                                    onChange={(value) => setAttributes({ latitude: value })}
                                    placeholder="e.g., 40.71"
                                    type="number"
                                    min={-90}
                                    max={90}
                                />
                                <TextControl
                                    label={__('Longitude', 'mold-plot')}
                                    value={longitude}
                                    onChange={(value) => setAttributes({ longitude: value })}
                                    placeholder="e.g., -74.00"
                                    type="number"
                                    min={-180}
                                    max={180}
                                />
                            </div>
                            <div className="plot-id" >
                                <SelectControl
                                    label={__('Select Plot', 'mold-plot')}
                                    value={plotId}
                                    options={[
                                        { label: __('Select a plot...', 'mold-plot'), value: '' },
                                        ...plotOptions
                                    ]}
                                    onChange={(value) => setAttributes({ plotId: value })}
                                />
                            </div>
                        </div>
                        <TextControl
                            tagName="span"
                            className='plot-description'
                            value={description}
                            onChange={(newDescription) => setAttributes({ description: newDescription })}
                        />
                    </div>
                </div>
            </>
        );
    },

    save: ({ attributes }) => {

        const {
            imageId,
            imageUrl,
            thumbnailUrl,
            imageAlt,
            borderRadius,
            imageSize,
            latitude,
            longitude,
            description,
            plotId,
        } = attributes;

        const longitude_per = longitude ? Math.round(((Number(longitude) + 180) / 360) * 100) : 0;
        const latitude_per = latitude ? Math.round(((90 - Number(latitude)) / 180) * 100) : 0;

        const blockProps = useBlockProps.save({
            className: 'plot-item',
            style: {
                "--longitude": longitude,
                "--latitude": latitude,
                "--x-value": longitude_per+"%",
                "--y-value": latitude_per+"%"
            }
        });

        // Use thumbnail URL if available, otherwise fallback to full image URL
        const displayImageUrl = thumbnailUrl || imageUrl;

        return (
            <div {...blockProps}>
                {displayImageUrl && (
                    <div className="plot-item-image">
                        {plotId && (
                               <button 
                        className="plot-image-trigger" 
                        type="button"
                        data-plot-id={plotId}
                        aria-label={`View details for plot ${plotId}`}
                    >
                        <img
                            src={displayImageUrl}
                            alt={imageAlt}
                            style={{
                                borderRadius: `${borderRadius}px`,
                                width: `${imageSize}px`,
                                height: `${imageSize}px`,
                                objectFit: 'cover'
                            }}
                        />
                    </button>
                        )}
                        {!plotId && (
                            <img
                            src={displayImageUrl}
                            alt={imageAlt}
                            className={`plot-image-size-${imageSize}`}
                            style={{ 
                                borderRadius: `${borderRadius}px`,
                                width: `${imageSize}px`,
                                height: `${imageSize}px`,
                                objectFit: 'cover'
                            }}
                            data-image-id={imageId}
                        />
                        )}

                        <div className="plot-item-info">
                        {/* {plotId && (
                            <div className="plot-id" data-plot-id={plotId}>
                                {__('Plot ID:', 'mold-plot')} {plotId}
                            </div>
                        )} */}

                        {description && (
                            <div className="plot-description">
                                {description}
                            </div>
                        )}
                    </div>
                    </div>
                )}

            </div>
        );
    },
});
