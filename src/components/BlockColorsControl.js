import ColorControl from './ColorControl';
import { __ } from '@wordpress/i18n';

const BlockColorsControl = ({ colors, onChange }) => {
    const updateColor = (key, value) => {
        const newColors = { ...colors };
        newColors[key] = value;
        onChange(newColors);
    };

    return (
        <>
            <div className="color-control-wrap">
                <label>{__('Text', 'mold-tour')}</label>
                <ColorControl
                    value={colors.textColor}
                    onChange={(value) => updateColor('textColor', value)}
                    enableAlpha={true}
                    clearable={true}
                />
            </div>
            <div className="color-control-wrap">
                <label>{__('Background', 'mold-tour')}</label>
                <ColorControl
                    value={colors.bgColor}
                    onChange={(value) => updateColor('bgColor', value)}
                    enableAlpha={true}
                    clearable={true}
                />
            </div>
            <div className="color-control-wrap">
                <label>{__('Text Hover', 'mold-tour')}</label>
                <ColorControl
                    value={colors.textColorHover}
                    onChange={(value) => updateColor('textColorHover', value)}
                    enableAlpha={true}
                    clearable={true}
                    />
            </div>
            <div className="color-control-wrap">
                <label>{__('Background Hover', 'mold-tour')}</label>
                <ColorControl
                    value={colors.bgColorHover}
                    onChange={(value) => updateColor('bgColorHover', value)}
                    enableAlpha={true}
                    clearable={true}
                />
            </div>
        </>
    );
};

export default BlockColorsControl;
