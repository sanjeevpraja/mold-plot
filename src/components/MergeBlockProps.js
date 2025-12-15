// utils/merge-block-props.js
export const mergeBlockProps = (baseProps, ...additionalProps) => {
  const merged = { ...baseProps };

  additionalProps.forEach(props => {
    // Merge className
    if (props.className) {
      merged.className = [merged.className, props.className]
        .filter(Boolean)
        .join(' ');
    }

    // Merge style
    if (props.style) {
      merged.style = { ...merged.style, ...props.style };
    }

    // Merge other props
    Object.keys(props).forEach(key => {
      if (key !== 'className' && key !== 'style') {
        merged[key] = props[key];
      }
    });
  });
  
  return merged;
};