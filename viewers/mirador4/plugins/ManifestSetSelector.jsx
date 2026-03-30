import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import { updateWindow } from 'mirador/src/state/actions/window';

const styles = {
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: 0,
  },
  panel: {
    borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
    padding: '16px',
  },
  formControl: {
    width: '100%',
  },
  helper: {
    marginBottom: '12px',
  },
  status: {
    fontSize: '0.875rem',
    margin: 0,
    opacity: 0.8,
  },
};

function getSetManifestUrl(endpoint) {
  if (!endpoint) return '';
  return `${endpoint.replace(/\/$/, '')}/api/presentation/sets/aub_aco000056/manifest.json`;
}

function labelToString(label) {
  if (!label) return '';
  if (typeof label === 'string') return label;
  if (Array.isArray(label)) return label.map(labelToString).find(Boolean) || '';
  if (typeof label === 'object') {
    return Object.values(label)
      .flat()
      .map(value => labelToString(value))
      .find(Boolean) || '';
  }
  return '';
}

function getItemId(item) {
  return item?.id || item?.['@id'] || '';
}

function getItemLabel(item) {
  const label = labelToString(item?.label);
  if (label) return label;

  const itemId = getItemId(item);
  if (!itemId) return 'Untitled manifest';

  const segments = itemId.split('/').filter(Boolean);
  return segments[segments.length - 2] || segments[segments.length - 1] || itemId;
}

function normalizeItems(items) {
  if (!Array.isArray(items)) return [];

  return items
    .map(item => {
      const id = getItemId(item);
      if (!id) return null;

      return {
        id,
        label: getItemLabel(item),
      };
    })
    .filter(Boolean);
}

const ManifestSetSelector = ({
  TargetComponent,
  targetProps,
  currentManifestId,
  endpoint,
  position,
  updateManifest,
}) => {
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(position === 'left');

  useEffect(() => {
    if (position !== 'left' || !endpoint) return undefined;

    const controller = new AbortController();
    const setManifestUrl = getSetManifestUrl(endpoint);

    async function loadManifestSet() {
      setLoading(true);
      setError('');

      try {
        const response = await fetch(setManifestUrl, {
          credentials: 'same-origin',
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const manifest = await response.json();
        setItems(normalizeItems(manifest?.items));
      } catch (fetchError) {
        if (fetchError.name !== 'AbortError') {
          setError(`Unable to load manifest set (${fetchError.message}).`);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadManifestSet();

    return () => controller.abort();
  }, [endpoint, position]);

  const selectedValue = useMemo(() => {
    if (!currentManifestId) return '';
    return items.some(item => item.id === currentManifestId) ? currentManifestId : '';
  }, [currentManifestId, items]);

  return (
    <div style={styles.wrapper}>
      {position === 'left' && (
        <div style={{ ...styles.panel, display: targetProps.companionAreaOpen ? 'block' : 'none' }}>
          <Typography style={styles.helper} variant="overline">
            Manifest Set
          </Typography>
          {loading && <p style={styles.status}>Loading manifests...</p>}
          {!loading && error && <p style={styles.status}>{error}</p>}
          {!loading && !error && (
            <FormControl size="small" style={styles.formControl}>
              <InputLabel id={`manifest-set-selector-label-${targetProps.windowId}`}>
                Choose Manifest
              </InputLabel>
              <Select
                id={`manifest-set-selector-${targetProps.windowId}`}
                label="Choose Manifest"
                labelId={`manifest-set-selector-label-${targetProps.windowId}`}
                onChange={(event) => updateManifest(targetProps.windowId, event.target.value)}
                value={selectedValue}
              >
                <MenuItem disabled value="">
                  Choose Manifest
                </MenuItem>
                {items.map(item => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        </div>
      )}
      <TargetComponent {...targetProps} />
    </div>
  );
};

ManifestSetSelector.propTypes = {
  TargetComponent: PropTypes.elementType.isRequired,
  currentManifestId: PropTypes.string,
  endpoint: PropTypes.string,
  position: PropTypes.string,
  targetProps: PropTypes.shape({
    companionAreaOpen: PropTypes.bool,
    windowId: PropTypes.string.isRequired,
  }).isRequired,
  updateManifest: PropTypes.func.isRequired,
};

ManifestSetSelector.defaultProps = {
  currentManifestId: '',
  endpoint: '',
  position: '',
};

const mapStateToProps = (state, { windowId, targetProps }) => {
  const resolvedWindowId = windowId || targetProps?.windowId;
  const window = state.windows?.[resolvedWindowId] || {};
  const rootElement = document.getElementById(state.config.id);

  return {
    currentManifestId: window.manifestId || '',
    endpoint: rootElement?.dataset?.endpoint || '',
    position: targetProps?.position || '',
  };
};

const mapDispatchToProps = dispatch => ({
  updateManifest: (windowId, manifestId) => {
    if (!windowId || !manifestId) return;

    dispatch(updateWindow(windowId, {
      canvasId: null,
      manifestId,
    }));
  },
});

export default {
  target: 'CompanionArea',
  mode: 'wrap',
  name: 'ManifestSetSelector',
  component: ManifestSetSelector,
  mapStateToProps,
  mapDispatchToProps,
};
