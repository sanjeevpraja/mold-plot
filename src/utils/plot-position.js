export function getPlotItemPosition(plotType, latitude, longitude) {
    let longitude_per = 0;
    let latitude_per = 0;

    if (plotType === 'image') {
        longitude_per = longitude ? Number(longitude) : 0;
        latitude_per = latitude ? Number(latitude) : 0;
    } else {
        longitude_per = longitude ? Math.round(((Number(longitude) + 180) / 360) * 86.67) : 0;
        latitude_per = latitude ? Math.round(((90 - Number(latitude)) / 180) * 131.43) : 0;
    }

    return { longitude_per, latitude_per };
}

export function getPlotItemPositionStyle(plotType, latitude, longitude) {
    const { longitude_per, latitude_per } = getPlotItemPosition(plotType, latitude, longitude);

    return {
        '--longitude': longitude,
        '--latitude': latitude,
        '--x-value': `${longitude_per}%`,
        '--y-value': `${latitude_per}%`,
    };
}
