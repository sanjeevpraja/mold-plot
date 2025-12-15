import { __ } from '@wordpress/i18n';
import { select } from '@wordpress/data';

/**
 * Get font family options for select controls
 * @return {Array} Array of font family options
 */
export const getFontFamilyOptions = () => {
  const { fontFamilies } = select('core/block-editor').getSettings()?.typography || {};
  const defaultOptions = [
    { label: __('Default', 'mold-tour'), value: '' }
  ];

  if (!fontFamilies || fontFamilies.length === 0) {
    return defaultOptions.concat([
      { 
        label: __('System Font', 'mold-tour'),
        value: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif' 
      },
      { label: __('Arial', 'mold-tour'), value: 'Arial, sans-serif' },
      { label: __('Georgia', 'mold-tour'), value: 'Georgia, serif' },
    ]);
  }

  return defaultOptions.concat(
    fontFamilies.map((fontFamily) => ({
      label: fontFamily.name,
      value: fontFamily.fontFamily,
      slug: fontFamily.slug
    }))
  );
};