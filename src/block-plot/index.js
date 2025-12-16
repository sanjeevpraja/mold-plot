import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, InspectorControls, InnerBlocks } from '@wordpress/block-editor';
import { PanelBody, RangeControl, SelectControl } from '@wordpress/components';
import ColorControl from '../components/ColorControl';
import { __ } from '@wordpress/i18n'; // Import translation function

import './editor.scss';
import './style.scss';

const plotTypeOptions = [ // Rename the array
    { label: 'World Map', value: 'world-map' },
    { label: 'Image', value: 'image' },
];


registerBlockType('mold/plot', {
    icon: {
        src: <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M9.60743 15.2128L9.99991 15.4803L10.3924 15.2128C10.5997 15.0712 15.4772 11.6982 15.4772 7.33333C15.4772 4.3925 13.0201 2 9.99991 2C6.97971 2 4.52263 4.3925 4.52263 7.33333C4.52263 11.6982 9.39947 15.0713 9.60743 15.2128ZM9.99991 3.33333C12.2648 3.33333 14.1079 5.12767 14.1079 7.33333C14.1079 10.3483 11.0964 12.9723 9.99991 13.8278C8.90343 12.9723 5.89195 10.3483 5.89195 7.33333C5.89195 5.12767 7.73454 3.33333 9.99991 3.33333ZM12.0539 7.33333C12.0539 6.2305 11.1325 5.33333 9.99991 5.33333C8.86731 5.33333 7.94593 6.2305 7.94593 7.33333C7.94593 8.43617 8.86731 9.33333 9.99991 9.33333C11.1325 9.33333 12.0539 8.43617 12.0539 7.33333ZM9.31525 7.33333C9.31525 6.96583 9.62215 6.66667 9.99991 6.66667C10.3773 6.66667 10.6846 6.96583 10.6846 7.33333C10.6846 7.70083 10.3773 8 9.99991 8C9.62215 8 9.31525 7.70083 9.31525 7.33333ZM15.1991 13H14.1079L13.0809 14.3333H14.386L15.6932 16.6667H4.30662L5.61381 14.3333H6.91894L5.89195 13H4.80077L2 18H18L15.1991 13Z" />
</svg>
    },
    attributes: {
        plotType: { type: "string", default: 'world-map' },
        bgColor: { type: "string", default: '#fff' },
        tooltipBgColor: { type: "string", default: '#fff' },
        tooltipTextColor: { type: "string", default: '#222' },
        tooltipFontSize: { type: "number", default: 12 },
        tooltipBorderRadius: { type: "number", default: 4 },
    },
    edit: ({ attributes, setAttributes }) => {
        const {
            plotType,
            bgColor,
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
                            value={plotType} // attribute
                            onChange={(newPlotType) => setAttributes({ plotType: newPlotType })}
                            options={plotTypeOptions} // Directly use the array
                        />
                        <ColorControl
                            label={__('Background Color', 'wp-mold')}
                            value={bgColor}
                            onChange={(newBgColor) => setAttributes({ bgColor: newBgColor })}
                            enableAlpha={true}
                        />
                    </PanelBody>

                    <PanelBody title={__('Tooltip', 'wp-mold')} initialOpen={true}>
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
            bgColor,
            tooltipBgColor,
            tooltipTextColor,
            tooltipFontSize,
            tooltipBorderRadius,
        } = attributes;

        const bgImage = new URL('world-map-color.png', import.meta.url).toString();
        const blockProps = useBlockProps.save({
            style: {
                '--bgImage': bgImage ? `url(${bgImage})` : 'none',
                "--bgColor" : bgColor,
                "--tooltipBgColor": tooltipBgColor,
                "--tooltipTextColor": tooltipTextColor,
                "--tooltipFontSize": `${tooltipFontSize}px`,
                "--tooltipBorderRadius": `${tooltipBorderRadius}px`,
            },
        });

        return (
            <div  {...blockProps}>
                <div className={`mold-plot-map plot-type-${plotType}`}>
                  <InnerBlocks.Content />
                </div>
            </div>
        );
    },
});
