import { __ } from '@wordpress/i18n';
import { Flex, FlexBlock, FlexItem, SelectControl, TextControl, ToggleGroupControl, ToggleGroupControlOption } from '@wordpress/components';
//import './SmartPaddingControl.scss'; // optional custom styling'];

const unitOptions = ['px', 'em', 'rem', '%'];

const UnitInput = ({ label, value = '', unit = 'px', onChangeValue, onChangeUnit }) => {
	return (
		<div style={{ marginBottom: '12px' }}>
			<label>
				{label}
			</label>
			<Flex>
				<FlexBlock>
					<TextControl
						value={value}
						onChange={(val) => onChangeValue(val)}
						type="number"
						min="0"
					/>
				</FlexBlock>
				<FlexItem>
					<SelectControl
						label={__('Unit', 'mold-tour')}
						hideLabelFromVision
						value={unit}
						options={unitOptions.map((u) => ({ label: u, value: u }))}
						onChange={(val) => onChangeUnit(val)}
					/>
				</FlexItem>
			</Flex>
		</div>
	);
};


const CompactUnitControl = ({ label = 'Padding', value, onChange }) => {
	const { inline, block, unit } = value;

	const update = (key, newVal) => {
		onChange({ ...value, [key]: newVal });
	};

	return (
		<div style={{ marginBottom: '16px' }}>
			<label style={{ fontWeight: 600, marginBottom: 4, display: 'block' }}>
				{__(label, 'textdomain')}
			</label>

			<Flex gap={2}>
				<FlexBlock>
					<TextControl
						label={__('Block', 'textdomain')}
						hideLabelFromVision
						value={block}
						type="number"
						min="0"
						onChange={(val) => update('block', val)}
					/>
				</FlexBlock>
				<FlexBlock>
					<TextControl
						label={__('Inline', 'textdomain')}
						hideLabelFromVision
						value={inline}
						type="number"
						min="0"
						onChange={(val) => update('inline', val)}
					/>
				</FlexBlock>
				<FlexItem>
					<SelectControl
						label={__('Unit', 'textdomain')}
						hideLabelFromVision
						value={unit}
						options={unitOptions.map((u) => ({ label: u, value: u }))}
						onChange={(val) => update('unit', val)}
					/>
				</FlexItem>
			</Flex>
		</div>
	);
};

export {UnitInput, CompactUnitControl};

