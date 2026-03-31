import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';
import { updateWindow } from 'mirador/src/state/actions/window';

const styles = {
  container: {
    width: '100%',
    marginTop: '16px',
    paddingBlockStart: '16px',
    paddingInlineStart: '0',
    paddingInlineEnd: '8px',
    paddingBlockEnd: '8px',
    borderBottom: 'none',
    borderTop: '0.5px solid rgba(0, 0, 0, 0.25)',
  },
  formControl: {
    width: '100%',
    marginTop: '0',
  },
  listItemText: {
    paddingInlineStart: '4px',
    paddingInlineEnd: '8px',
    marginBlockStart: '4px',
    marginBlockEnd: '4px',
    whiteSpace: 'normal',
  },
  status: {
    margin: 0,
    opacity: 0.8,
  },
};

const translations = {
  en: {
    availableManifests: 'View Related Titles',
    collapseSection: 'Collapse {{section}}',
    expandSection: 'Expand {{section}}',
    loadingManifests: 'Loading titles...',
    unavailableManifests: 'Unable to load title set.',
  }
};

function getSetManifestUrl(endpoint, identifier) {
  if (!endpoint || !identifier) return '';
  return `${endpoint.replace(/\/$/, '')}/api/presentation/sets/${identifier}/manifest.json`;
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

export default function createManifestSetSelector({ endpoint, identifier }) {
  // FIX: Compute the URL once outside the component so its reference is stable.
  // This makes it safe to include in the useEffect dependency array without
  // causing infinite re-renders, and documents clearly that it never changes
  // after the plugin is registered.
  const setManifestUrl = getSetManifestUrl(endpoint, identifier);

  // FIX: Sanitize the identifier for use as a plugin name. Identifiers
  // containing slashes, spaces, or other special characters could conflict
  // with Mirador's plugin registry key expectations.
  const safeIdentifier = identifier
    ? String(identifier).replace(/[^a-zA-Z0-9-_]/g, '_')
    : 'unknown';

  const ManifestSetSelector = ({
    currentManifestId = '',
    updateManifest,
    windowId = '',
  }) => {
    const { t } = useTranslation();
    const [items, setItems] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);

    useEffect(() => {
      if (!setManifestUrl) {
        setItems([]);
        setLoading(false);
        setError(t('unavailableManifests'));
        return undefined;
      }

      const controller = new AbortController();

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
            setError(
              fetchError.message
                ? `${t('unavailableManifests')} (${fetchError.message})`
                : t('unavailableManifests')
            );
          }
        } finally {
          // FIX: Always call setLoading(false). Previously, the abort guard
          // prevented this from running on abort, leaving `loading` stuck as
          // `true` if the component re-mounted before the fetch completed.
          // React silently drops state updates on unmounted components, so
          // calling setLoading unconditionally here is safe.
          setLoading(false);
        }
      }

      loadManifestSet();

      return () => controller.abort();

    // FIX: Added `setManifestUrl` to the dependency array. It is derived from
    // module-level constants and never changes at runtime, but including it
    // satisfies exhaustive-deps lint rules and makes the data-flow explicit.
    }, [t, setManifestUrl]);

    const selectedValue = useMemo(() => {
      if (!currentManifestId) return '';
      return items.some(item => item.id === currentManifestId) ? currentManifestId : '';
    }, [currentManifestId, items]);

    if (!loading && !error && items.length === 0) return null;

    const windowIdShort = windowId?.replace(/^window-/, '') || 'default';
    const sectionId = `manifest-selector-${windowIdShort}`;
    const sectionLabel = t('availableManifests');

    return (
      <div style={styles.container}>
        <Accordion
          slotProps={{ heading: { component: 'h4' } }}
          id={sectionId}
          elevation={0}
          expanded={open}
          onChange={(_event, isExpanded) => setOpen(isExpanded)}
          disableGutters
          square
          variant="compact"
        >
          <AccordionSummary
            id={`${sectionId}-header`}
            aria-controls={`${sectionId}-content`}
            aria-label={t(open ? 'collapseSection' : 'expandSection', { section: sectionLabel })}
            expandIcon={<ExpandMoreIcon />}
          >
            <Typography variant="overline">
              {sectionLabel}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            {loading && (
              <Typography style={styles.status} variant="body2">
                {t('loadingManifests')}
              </Typography>
            )}
            {!loading && error && (
              <Typography style={styles.status} variant="body2">
                {error}
              </Typography>
            )}
            {!loading && !error && (
              <FormControl style={styles.formControl}>
                {items.map(item => (
                  <MenuItem
                    key={item.id}
                    onClick={() => updateManifest(windowId, item.id)}
                    selected={item.id === selectedValue}
                  >
                    <ListItemText
                      primaryTypographyProps={{
                        variant: 'body1',
                        sx: {
                          overflowWrap: 'anywhere',
                          whiteSpace: 'normal',
                        },
                      }}
                      style={styles.listItemText}
                    >
                      {item.label}
                    </ListItemText>
                  </MenuItem>
                ))}
              </FormControl>
            )}
          </AccordionDetails>
        </Accordion>
      </div>
    );
  };

  ManifestSetSelector.propTypes = {
    currentManifestId: PropTypes.string,
    updateManifest: PropTypes.func.isRequired,
    windowId: PropTypes.string,
  };

  const mapStateToProps = (state, { windowId }) => {
    const window = state.windows?.[windowId] || {};

    return {
      currentManifestId: window.manifestId || '',
      windowId,
    };
  };

  const mapDispatchToProps = dispatch => ({
    updateManifest: (windowId, manifestId) => {
      // FIX: Added console.warn so developers can diagnose misconfigured props
      // rather than silently swallowing the no-op.
      if (!windowId || !manifestId) {
        if (process.env.NODE_ENV !== 'production') {
          console.warn(
            '[ManifestSetSelector] updateManifest called with missing windowId or manifestId.',
            { windowId, manifestId }
          );
        }
        return;
      }

      dispatch(updateWindow(windowId, {
        canvasId: null,
        manifestId,
      }));
    },
  });

  return {
    target: 'CanvasInfo',
    mode: 'add',
    name: `ManifestSetSelector-${safeIdentifier}`,
    component: ManifestSetSelector,
    mapStateToProps,
    mapDispatchToProps,
    config: {
      translations,
    },
  };
}
