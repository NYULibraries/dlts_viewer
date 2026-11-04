import { useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';

/**
 * Applies mirador-image-tools CSS filters to the OpenSeadragon canvas.
 * Renders nothing — must stay on OpenSeadragonViewer to receive `viewer`.
 */
const MiradorImageToolsFilter = ({
  enabled = true,
  viewer = null,
  viewConfig = {},
}) => {
  const { brightness = 100, contrast = 100, saturate = 100, grayscale = 0, invert = 0 } = viewConfig;

  const applyFilters = useCallback(() => {
    const { canvas } = viewer || {};
    if (!canvas) return;

    const controlledFilters = ['brightness', 'contrast', 'saturate', 'grayscale', 'invert'];
    const currentFilters = canvas.style.filter.split(' ');
    const newFilters = currentFilters.filter((filter) => !controlledFilters.some((type) => filter.includes(type)));
    newFilters.push(`brightness(${brightness}%)`);
    newFilters.push(`contrast(${contrast}%)`);
    newFilters.push(`saturate(${saturate}%)`);
    newFilters.push(`grayscale(${grayscale}%)`);
    newFilters.push(`invert(${invert}%)`);
    canvas.style.filter = newFilters.join(' ');
  }, [viewer, brightness, contrast, saturate, grayscale, invert]);

  useEffect(() => {
    if (enabled && viewer) applyFilters();
  }, [applyFilters, enabled, viewer]);

  return null;
};

MiradorImageToolsFilter.propTypes = {
  enabled: PropTypes.bool,
  viewConfig: PropTypes.object,
  viewer: PropTypes.object,
};

export default MiradorImageToolsFilter;
