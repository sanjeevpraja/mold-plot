import worldMapUrl from '../block-plot/world-map.svg?url';
import worldMapPngUrl from '../block-plot/world-map-color.png';
import { getPlotAspectRatioInlineStyle } from './plot-aspect-ratio';

export function getPlotBackgroundImage(plotType, imageUrl) {
    if (plotType === 'image' && imageUrl) {
        return imageUrl;
    }
    if (plotType === 'image') {
        return '';
    }
    if (plotType === 'world-map-svg') {
        return worldMapUrl;
    }
    if (plotType === 'world-map') {
        return worldMapPngUrl;
    }
    return worldMapUrl;
}

export function getPlotBlockInlineStyles(attributes) {
    const {
        plotType,
        imageUrl,
        bgColor,
        mapColor,
        tooltipBgColor,
        tooltipTextColor,
        tooltipFontSize,
        tooltipBorderRadius,
        aspectRatioWidth,
        aspectRatioHeight,
    } = attributes;

    const bgImage = getPlotBackgroundImage(plotType, imageUrl);

    return {
        '--bgImage': bgImage ? `url(${bgImage})` : 'none',
        '--bgColor': bgColor,
        '--mapColor': mapColor,
        '--tooltipBgColor': tooltipBgColor,
        '--tooltipTextColor': tooltipTextColor,
        '--tooltipFontSize': `${tooltipFontSize}px`,
        '--tooltipBorderRadius': `${tooltipBorderRadius}px`,
        ...getPlotAspectRatioInlineStyle(plotType, aspectRatioWidth, aspectRatioHeight),
    };
}
