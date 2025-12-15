import { BaseControl, TextControl, SelectControl, RangeControl, Flex, FlexItem, ButtonGroup, Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

const DIMENSION_UNITS = [
    { label: 'auto', value: 'auto' },
    { label: 'px', value: 'px' },
    { label: '%', value: '%' },
    { label: 'vw', value: 'vw' },
    { label: 'vh', value: 'vh' },
    { label: 'em', value: 'em' },
];

const DimensionControl = ({
    label = __('Dimension', 'mold-tour'),
    value = '',
    unit = 'px',
    onChange = () => {},
    min = 0,
    max = 100,
    step = 1,
    allowAuto = false,
}) => {
    const isAuto = value === 'auto';
    const numericValue = isAuto ? min : parseFloat(value) || 0;
    

    const getMaxValue = () => {
        switch(unit) {
            case 'px': return 1200;
            case '%':
            case 'vw':
            case 'vh': return 100;
            default: return max;
        }
    };

    const handleChange = (newValue, newUnit = unit) => {
        if (newValue === 'auto') {
            onChange('auto', newUnit);
        } else {
            const numValue = parseFloat(newValue);
            if (!isNaN(numValue)) {
                onChange(String(numValue), newUnit);
            } else {
                onChange('', newUnit);
            }
        }
    };

    const handleUnitChange = (newUnit) => {
        if (isAuto) {
            onChange('auto', newUnit);
        } else {
            const currentMax = getMaxValue();
            const clampedValue = Math.min(numericValue, currentMax);
            onChange(String(clampedValue), newUnit);
        }
    };

    return (
        <BaseControl label={label} className="wp-mold-dimension-control">
            {allowAuto && (
                <div style={{ marginBottom: '12px' }}>
                    <ButtonGroup>
                        <Button
                            variant={isAuto ? 'primary' : 'secondary'}
                            onClick={() => handleChange('auto')}
                        >
                            {__('Auto', 'mold-tour')}
                        </Button>
                        <Button
                            variant={!isAuto ? 'primary' : 'secondary'}
                            onClick={() => handleChange(numericValue)}
                        >
                            {__('Manual', 'mold-tour')}
                        </Button>
                    </ButtonGroup>
                </div>
            )}

            {!isAuto && (
                <Flex justify="space-between" align="flex-start" gap={2}>
                    <FlexItem>
                        <Flex align="flex-end" gap={0}>
                            <FlexItem>
                                <TextControl
                                    type="number"
                                    value={numericValue}
                                    onChange={(val) => handleChange(val)}
                                    min={min}
                                    max={getMaxValue()}
                                    step={step}
                                    className="wp-mold-dimension-control__input"
                                />
                            </FlexItem>
                            <FlexItem style={{ minWidth: '50px' }}>
                                <SelectControl
                                    value={unit}
                                    options={DIMENSION_UNITS}
                                    onChange={handleUnitChange}
                                    label={__('Unit', 'mold-tour')}
                                    hideLabelFromVision
                                    className="wp-mold-dimension-control__select"
                                />
                            </FlexItem>
                        </Flex>
                    </FlexItem>
                    <FlexItem style={{ width: '110px' }}>
                        <RangeControl
                            value={numericValue}
                            onChange={(val) => handleChange(val)}
                            min={min}
                            max={getMaxValue()}
                            step={step}
                            withInputField={false}
                            className="wp-mold-dimension-control__range"
                        />
                    </FlexItem>
                </Flex>
            )}
        </BaseControl>
    );
};

export default DimensionControl;