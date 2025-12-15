// import { SelectControl } from '@wordpress/components';
// import { __ } from '@wordpress/i18n';

// const TShirtSizeControl = ({ label = __('Size', 'your-text-domain'), value, onChange }) => {
//     const options = [
//         { label: __('XS', 'your-text-domain'), value: 'xs' },
//         { label: __('S', 'your-text-domain'), value: 's' },
//         { label: __('M', 'your-text-domain'), value: 'm' },
//         { label: __('L', 'your-text-domain'), value: 'l' },
//         { label: __('XL', 'your-text-domain'), value: 'xl' },
//     ];

//     return (
//         <SelectControl
//             label={label}
//             value={value}
//             options={options}
//             onChange={(newValue) => onChange(newValue)}
//         />
//     );
// };

// export default TShirtSizeControl;

import { ButtonGroup, Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

const TShirtSizeControl = ({
	label = __('Size', 'mold-tour'),
	value,
	onChange,
	variant = 'full', // or 'sm'
}) => {
	const sizes = variant === 'sm'
		? ['S', 'M', 'L']
		: ['XS', 'S', 'M', 'L', 'XL'];

	return (
		<div className="tshirt-size-control" style={{ marginBottom: '16px' }}>
			{label && <p className="components-base-control__label">{label}</p>}
			<ButtonGroup>
				{sizes.map((size) => (
					<Button
						key={size}
						isPrimary={value === size.toLowerCase()}
						isSecondary={value !== size.toLowerCase()}
						onClick={() => onChange(size.toLowerCase())}
            style={{paddingInline: '15px'}}
					>
						{size}
					</Button>
				))}
			</ButtonGroup>
		</div>
	);
};

export default TShirtSizeControl;


