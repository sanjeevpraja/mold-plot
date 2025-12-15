import { BaseControl, Button, Popover } from '@wordpress/components';
import { ColorPalette } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import './style.scss';

const ColorControl = ({ label, value, onChange, enableAlpha = false, clearable = false, hideHex =false }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <BaseControl label={__(label, 'mold-tour')}>
            <div className="mold-color-control">
                <Button
                    className="mold-color-control__button"
                    onClick={() => setIsOpen(!isOpen)}
                    style={{ 
                        background: value,
                    }}
                />
                {!hideHex && <span style={{ marginLeft: '10px' }}>{value}</span>}

                {isOpen && (
                    <Popover
                        position="middle right"
                        onClose={() => setIsOpen(false)}
                        className="mold-color-control__popover"
                        focusOnMount={false}
                    >
                        <div style={{ padding: '16px', width: '220px' }}>
                            <ColorPalette
                                value={value}
                                onChange={onChange}
                                clearable={clearable}
                                enableAlpha={enableAlpha}
                            />
                            <div style={{ marginTop: '10px', textAlign: 'right' }}>
                                <Button
                                    variant="secondary"
                                    onClick={() => setIsOpen(false)}
                                    style={{ marginTop: '10px' }}
                                >
                                    {__('Close', 'mold-tour')}
                                </Button>
                            </div>
                        </div>
                    </Popover>
                )}
            </div>
        </BaseControl>
    );
};

export default ColorControl;