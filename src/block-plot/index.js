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
        src: <svg width="16" height="14" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.95508 0C11.3551 0 12.4443 1.08926 12.4443 2.48926V11.5107C12.4443 12.9107 11.3551 14 9.95508 14H5.59961C4.19978 13.9998 3.11133 12.9106 3.11133 11.5107V2.48926C3.11133 1.08938 4.19978 0.000188262 5.59961 0H9.95508ZM0.62207 2.33301C1.5554 2.33301 2.33301 3.11159 2.33301 4.04492V9.95605C2.33275 10.8892 1.55525 11.667 0.62207 11.667H0V10.1113H0.62207C0.699829 10.1113 0.777307 10.0334 0.777344 9.87793V4.04492C0.777344 3.96714 0.699848 3.88867 0.62207 3.88867H0V2.33301H0.62207ZM6.61133 10.1113C6.18184 10.1113 5.83311 10.4592 5.83301 10.8887C5.83301 11.3182 6.18177 11.667 6.61133 11.667C7.0408 11.6669 7.38867 11.3182 7.38867 10.8887C7.38857 10.4593 7.04074 10.1114 6.61133 10.1113ZM8.94434 10.1113C8.51488 10.1114 8.16709 10.4592 8.16699 10.8887C8.16699 11.3182 8.51481 11.667 8.94434 11.667C9.37389 11.667 9.72266 11.3182 9.72266 10.8887C9.72255 10.4592 9.37383 10.1113 8.94434 10.1113ZM15.5557 3.88867H14.9336C14.8558 3.88867 14.7773 3.96714 14.7773 4.04492V9.87793C14.7774 9.95567 14.8559 10.0332 14.9336 10.0332H15.5557V11.5889H14.9336C14.0003 11.5889 13.2227 10.8112 13.2227 9.87793V4.04492C13.2227 3.11159 14.0003 2.33301 14.9336 2.33301H15.5557V3.88867Z"/>
            </svg>
    },
    attributes: {
        plotType: { type: "string", default: 'world-map' },
        bgColor: { type: "string", default: '#fff' },
        tooltipBgColor: { type: "string", default: '#fff' },
        tooltipTextColor: { type: "string", default: '#222' },
        tooltipFontSize: { type: "number", default: 12 },
        tooltipBorderRadius: { type: "number", default: 10 },
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


        const blockProps = useBlockProps.save({
            style: {
                "--bgColor" : bgColor,
                "--tooltipBgColor": tooltipBgColor,
                "--tooltipTextColor": tooltipTextColor,
                "--tooltipFontSize": tooltipFontSize,
                "--tooltipBorderRadius": tooltipBorderRadius,
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
