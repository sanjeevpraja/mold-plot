import { BaseControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import DimensionControl from './DimensionControl';


const PositionControl = ({ positionMatrix, onChange }) => {
    const handlePositionChange = (side, value, unit) => {
        const updates = {
            ...positionMatrix,
            [`position${side}`]: value,
        };

        if (unit) {
            updates[`position${side}Unit`] = unit;
        }

        onChange({ positionMatrix: updates });
    };

    return (
        <div className="wp-mold-position-control">
            <BaseControl label={__('Position', 'mold-tour')}>
                {['Top', 'Right', 'Bottom', 'Left'].map((side) => {
                    const value = positionMatrix[`position${side}`];
                    const unit = positionMatrix[`position${side}Unit`];

                    return (
                        <DimensionControl
                            key={side}
                            label={__(side, 'mold-tour')}
                            value={value}
                            unit={unit}
                            onChange={(value, unit) => handlePositionChange(side, value, unit)}
                            min={unit === 'px' ? -1200 : -100}
                            max={unit === 'px' ? 1200 : 100}
                            step={unit === 'px' ? 10 : 1}
                            allowNegative
                        />
                    );
                })}
            </BaseControl>
        </div>
    );
};

export default PositionControl;
