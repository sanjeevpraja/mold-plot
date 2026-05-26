export function getPlotAspectRatioStyle(width, height) {
    const w = Math.max(1, width || 100);
    const h = Math.max(1, height || 80);
    return `${w} / ${h}`;
}

export function getPlotAspectRatioInlineStyle(plotType, width, height) {
    if (plotType !== 'image') {
        return {};
    }
    return { '--plotAspectRatio': getPlotAspectRatioStyle(width, height) };
}
