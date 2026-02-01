import worldMapUrl from './world-map.svg?url';
import worldMapPngUrl from './world-map-color.png';
import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, InspectorControls, InnerBlocks, MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import { PanelBody, RangeControl, SelectControl, Button } from '@wordpress/components';
import ColorControl from '../components/ColorControl';
import { __ } from '@wordpress/i18n'; // Import translation function

import './editor.scss';
import './style.scss';

const plotTypeOptions = [ // Rename the array
    { label: 'World Map', value: 'world-map' },
    { label: 'World Map (SVG)', value: 'world-map-svg' },
    { label: 'Image', value: 'image' },
];

const tooltipTypeOptions = [
    { label: 'Show', value: 'tooltip-show' },
    { label: 'Show on Hover', value: 'tooltip-show-on-hover' },
    { label: 'Rotate', value: 'tooltip-rotate' },
];

registerBlockType('mold/plot', {
    icon: {
        src: <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.60743 15.2128L9.99991 15.4803L10.3924 15.2128C10.5997 15.0712 15.4772 11.6982 15.4772 7.33333C15.4772 4.3925 13.0201 2 9.99991 2C6.97971 2 4.52263 4.3925 4.52263 7.33333C4.52263 11.6982 9.39947 15.0713 9.60743 15.2128ZM9.99991 3.33333C12.2648 3.33333 14.1079 5.12767 14.1079 7.33333C14.1079 10.3483 11.0964 12.9723 9.99991 13.8278C8.90343 12.9723 5.89195 10.3483 5.89195 7.33333C5.89195 5.12767 7.73454 3.33333 9.99991 3.33333ZM12.0539 7.33333C12.0539 6.2305 11.1325 5.33333 9.99991 5.33333C8.86731 5.33333 7.94593 6.2305 7.94593 7.33333C7.94593 8.43617 8.86731 9.33333 9.99991 9.33333C11.1325 9.33333 12.0539 8.43617 12.0539 7.33333ZM9.31525 7.33333C9.31525 6.96583 9.62215 6.66667 9.99991 6.66667C10.3773 6.66667 10.6846 6.96583 10.6846 7.33333C10.6846 7.70083 10.3773 8 9.99991 8C9.62215 8 9.31525 7.70083 9.31525 7.33333ZM15.1991 13H14.1079L13.0809 14.3333H14.386L15.6932 16.6667H4.30662L5.61381 14.3333H6.91894L5.89195 13H4.80077L2 18H18L15.1991 13Z" />
        </svg>
    },
    attributes: {
        plotType: { type: "string", default: 'world-map' },
        imageId: { type: 'number', default: 0 },
        imageUrl: { type: 'string', default: '' },
        bgColor: { type: "string", default: '#fff' },
        mapColor: { type: "string", default: '#cccccc' },
        tooltipType: { type: "string", default: 'tooltip-show' },
        tooltipInterval: { type: "number", default: 1000 },
        tooltipBgColor: { type: "string", default: '#fff' },
        tooltipTextColor: { type: "string", default: '#222' },
        tooltipFontSize: { type: "number", default: 12 },
        tooltipBorderRadius: { type: "number", default: 4 },
    },
    edit: ({ attributes, setAttributes }) => {
        const {
            plotType,
            imageId,
            imageUrl,
            bgColor,
            mapColor,
            tooltipType,
            tooltipInterval,
            tooltipBgColor,
            tooltipTextColor,
            tooltipFontSize,
            tooltipBorderRadius,
        } = attributes;
        const blockProps = useBlockProps({
            withoutDefaultClassName: true,
            className: 'mold-plot-edit',
        });

        return (
            <>
                <InspectorControls>
                    <PanelBody title={__('Plot Settings', 'wp-mold')} initialOpen={true}>
                        <SelectControl
                            label={__('Plot Type', 'wp-mold')}
                            value={plotType} // attribute
                            onChange={(newPlotType) => setAttributes({ plotType: newPlotType })}
                            options={plotTypeOptions} // Directly use the array
                        />
                        {plotType === 'image' && (
                            <MediaUploadCheck>
                                <MediaUpload
                                    onSelect={(media) => setAttributes({ imageId: media.id, imageUrl: media.url })}
                                    allowedTypes={['image']}
                                    value={imageId}
                                    render={({ open }) => (
                                        <div style={{ marginBottom: '15px' }}>
                                            <label style={{ display: 'block', marginBottom: '5px' }}>{__('Plot Image', 'wp-mold')}</label>
                                            {imageUrl ? (
                                                <>
                                                    <img src={imageUrl} alt="Plot Background" style={{ maxWidth: '100%', marginBottom: '10px' }} />
                                                    <Button isSecondary onClick={open} style={{ marginRight: '10px' }}>{__('Replace Image', 'wp-mold')}</Button>
                                                    <Button isDestructive isLink onClick={() => setAttributes({ imageId: 0, imageUrl: '' })}>{__('Remove Image', 'wp-mold')}</Button>
                                                </>
                                            ) : (
                                                <Button isSecondary onClick={open}>{__('Select Image', 'wp-mold')}</Button>
                                            )}
                                        </div>
                                    )}
                                />
                            </MediaUploadCheck>
                        )}
                        <ColorControl
                            label={__('Background Color', 'wp-mold')}
                            value={bgColor}
                            onChange={(newBgColor) => setAttributes({ bgColor: newBgColor })}
                            enableAlpha={true}
                        />
                        {plotType === 'world-map-svg' && (
                            <ColorControl
                                label={__('Map Color', 'wp-mold')}
                                value={mapColor}
                                onChange={(newMapColor) => setAttributes({ mapColor: newMapColor })}
                                enableAlpha={true}
                            />
                        )}
                    </PanelBody>

                    <PanelBody title={__('Tooltip', 'wp-mold')} initialOpen={true}>
                        <SelectControl
                            value={tooltipType}
                            onChange={(newTooltipType) => setAttributes({ tooltipType: newTooltipType })}
                            options={tooltipTypeOptions}
                        />
                        {tooltipType == 'tooltip-rotate' && (
                            <RangeControl
                                label={__("Tooltip Interval", "wp-mold")}
                                value={tooltipInterval}
                                onChange={(newTooltipInterval) => setAttributes({ tooltipInterval: newTooltipInterval })}
                                min={1000}
                                max={10000}
                                step={500}
                            />
                        )}
                        <ColorControl
                            label={__('Tooltip bacground', 'wp-mold')}
                            value={tooltipBgColor}
                            onChange={(newTooltipBgColor) => setAttributes({ tooltipBgColor: newTooltipBgColor })}
                            enableAlpha={true}
                        />
                        <ColorControl
                            label={__('Tooltip Text Color', 'wp-mold')}
                            value={tooltipTextColor}
                            onChange={(newTooltipTextColor) => setAttributes({ tooltipTextColor: newTooltipTextColor })}
                            enableAlpha={true}
                        />
                        <RangeControl
                            label={__("Tooltip Font Size", "wp-mold")}
                            value={tooltipFontSize}
                            onChange={(newTooltipFontSize) => setAttributes({ tooltipFontSize: newTooltipFontSize })}
                            min={8}
                            max={24}
                        />

                        <RangeControl
                            label={__('Tooltip Border Radius', 'wp-mold')}
                            value={tooltipBorderRadius}
                            onChange={(newTooltipBorderRadius) => setAttributes({ tooltipBorderRadius: newTooltipBorderRadius })}
                            min={0}
                            max={20}
                        />
                    </PanelBody>
                </InspectorControls>


                <div {...blockProps}>
                    <InnerBlocks
                        allowedBlocks={['mold/plot-item']}
                    />
                </div>
            </>
        );
    },
    save: ({ attributes }) => {
        const {
            plotType,
            imageUrl,
            bgColor,
            mapColor,
            tooltipType,
            tooltipInterval,
            tooltipBgColor,
            tooltipTextColor,
            tooltipFontSize,
            tooltipBorderRadius,
        } = attributes;

        const defaultBgImage = worldMapUrl;

        let bgImage = defaultBgImage;
        if (plotType === 'image' && imageUrl) {
            bgImage = imageUrl;
        } else if (plotType === 'image' && !imageUrl) {
            bgImage = ''; // No image if type is image but none selected
        } else if (plotType === 'world-map-svg') {
            bgImage = worldMapUrl;
        } else if (plotType === 'world-map') {
            bgImage = worldMapPngUrl;
        }

        const blockProps = useBlockProps.save({
            style: {
                '--bgImage': bgImage ? `url(${bgImage})` : 'none',
                "--bgColor": bgColor,
                "--mapColor": mapColor,
                "--tooltipBgColor": tooltipBgColor,
                "--tooltipTextColor": tooltipTextColor,
                "--tooltipFontSize": `${tooltipFontSize}px`,
                "--tooltipBorderRadius": `${tooltipBorderRadius}px`,
            },
        });

        return (
            <div  {...blockProps}>
                <div className={`mold-plot-map plot-type-${plotType} ${tooltipType}`} data-interval={tooltipInterval}>
                    <InnerBlocks.Content />
                </div>
            </div>
        );
    },
});