import { ButtonGroup, Button, BaseControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import DimensionControl from './DimensionControl';

const WidthControl = (props) => {
    const {
        label = __('Width', 'mold-tour'),
        type = 'auto', // Default type
        value = 100, // Default value (only used in manual mode)
        unit = 'px', // Default unit
        onChange = () => {}, // Safe default empty function
        min = 0,
    } = props;

    const handleTypeChange = (newType) => {
        if (newType === 'auto') {
            onChange('auto', 100, unit);
        } else {
            onChange('manual', value, unit);
        }
    };

    const handleDimensionChange = (newValue, newUnit) => {
        onChange(type, newValue, newUnit);
    };

    return (
        <div className="wp-mold-width-control">
            <BaseControl label={label}>
                <ButtonGroup className="wp-mold-width-toggle">
                    <Button
                        variant={type === 'auto' ? 'primary' : 'secondary'}
                        onClick={() => handleTypeChange('auto')}
                    >
                        {__('Auto', 'mold-tour')}
                    </Button>
                    <Button
                        variant={type === 'manual' ? 'primary' : 'secondary'}
                        onClick={() => handleTypeChange('manual')}
                    >
                        {__('Manual', 'mold-tour')}
                    </Button>
                </ButtonGroup>
            </BaseControl>

            {type === 'manual' && (
                <DimensionControl
                    label={label + ' Value'}
                    value={value}
                    unit={unit}
                    onChange={handleDimensionChange}
                    min={min}
                    max={unit === 'px' ? 1200 : 100}
                    allowAuto={false}
                />
            )}
        </div>
    );
};

export default WidthControl;