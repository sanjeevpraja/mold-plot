import { __ } from '@wordpress/i18n';
import {
	Flex,
	FlexBlock,
	FlexItem,
	TextControl,
	SelectControl,
} from '@wordpress/components';
import ColorControl from './ColorControl';

const BorderControl = ({ label = 'Border', value, onChange }) => {
	const { width, style, color } = value;

	const update = (key, newVal) => {
		onChange({ ...value, [key]: newVal });
	};

	return (
		<div style={{ marginBottom: '20px' }}>
			<label style={{ display: 'block', fontWeight: 600, marginBottom: 4 }}>
				{__(label, 'mold-tour')}
			</label>

			<Flex gap={2}>
				<FlexBlock>
					<TextControl
						label={__('Width (px)', 'mold-tour')}
						hideLabelFromVision
						value={width}
						type="number"
						min="0"
						onChange={(val) => update('width', val)}
						style={{ minWidth: '80px' }}
					/>
				</FlexBlock>

				<FlexItem>
					<SelectControl
						label={__('Style', 'mold-tour')}
						hideLabelFromVision
						value={style}
						options={[
							{ label: __('Solid', 'mold-tour'), value: 'solid' },
							{ label: __('Dashed', 'mold-tour'), value: 'dashed' },
							{ label: __('Dotted', 'mold-tour'), value: 'dotted' },
							{ label: __('None', 'mold-tour'), value: 'none' },
						]}
						onChange={(val) => update('style', val)}
					/>
				</FlexItem>
        <FlexItem>
            <ColorControl
            value={color}
            onChange={(val) => update('color', val)}
						enableAlpha={true}
						hideHex={true}
          />
        </FlexItem>
			</Flex>

		</div>
	);
};

export default BorderControl;
