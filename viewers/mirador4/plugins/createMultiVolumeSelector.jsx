import React, { useEffect, useMemo, useState, useCallback } from 'react';
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

/**
 * Mirador multi-volume selector plugin.
 *
 * Usage:
 *   createMultiVolumeSelector({ endpoint, identifier })
 *
 * `endpoint` is the viewer base URL and `identifier` is the IIIF multi-volume identifier
 * used to fetch `/api/presentation/multivolume/:identifier/manifest.json`.
 */
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
    unavailableManifests: 'Unable to load multi-volume titles.',
  }
};

/** Flatten common IIIF label shapes into a readable string. */
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

/** Support both IIIF Presentation 2 and 3 style identifiers. */
function getItemId(item) {
  return item?.id || item?.['@id'] || '';
}

/** Normalize set-manifest items into the shape the plugin renders. */
function normalizeItems(items) {
  if (!Array.isArray(items)) return [];

  return items.reduce((results, item) => {
    const id = getItemId(item);
    const label = labelToString(item?.label);

    if (id && label) {
      results.push({ id, label });
    } else {
      console.warn("Skipping invalid IIIF item", item);
    }
    return results;
  }, []);
}

/** Convert a IIIF manifest URL into the matching viewer page URL. */
function getViewerUrlFromManifestId(manifestId, endpoint) {

  if (!manifestId || !endpoint) return '';

  try {
    const manifestUrl = new URL(manifestId, endpoint);
    const pathSegments = manifestUrl.pathname.split('/').filter(Boolean);
    const presentationIndex = pathSegments.indexOf('presentation');

    if (presentationIndex === -1 || pathSegments.length < presentationIndex + 4) {
      return '';
    }

    const type = pathSegments[presentationIndex + 1];

    const identifier = pathSegments[presentationIndex + 2];

    if (!type || !identifier) return '';

    const viewerUrl = new URL(identifier, `${endpoint}/api/embed/`);

    const currentParams = new URLSearchParams(window.location.search);

    viewerUrl.search = currentParams.toString();

    return viewerUrl.toString();
  } catch (_error) {
    return '';
  }
}

/**
 * Create a Mirador plugin definition for a multi-volume panel.
 * The plugin is configured once from the embed context and then mounted by Mirador
 * in the CanvasInfo companion area for each window.
 */
export default function createMultiVolumeSelector({ endpoint, identifier }) {
  if (!endpoint || !identifier) {
    throw new Error(
      `Configuration Error: 'endpoint' and 'identifier' are required to initialize the MultiVolumeSelector. Received: endpoint=${endpoint}, identifier=${identifier}`
    );
  }

  /** Build the IIIF multi-volume manifest URL from the viewer endpoint and multi-volume identifier. */
  const setManifestUrl = `${endpoint}/api/presentation/multivolume/${identifier}/manifest.json`;

  const MultiVolumeSelector = ({
    currentManifestId = '',
    browseToManifest,
    windowId = '',
  }) => {
    const { t } = useTranslation();
    const [items, setItems] = useState([]);
    const [errorDetail, setErrorDetail] = useState('');
    const [loading, setLoading] = useState(true);
    
    // default to closed, avoid extra cognitive load for users.
    const [open, setOpen] = useState(false)

    const handleChange = useCallback((_event, isExpanded) => {
      setOpen(isExpanded)
    }, [])

    useEffect(() => {
      let active = true;

      if (!setManifestUrl) {
        if (active) {
          setItems([]);
          setLoading(false);
          setErrorDetail('');
        }
        return undefined;
      }

      const controller = new AbortController();

      async function loadManifestSet() {
        setLoading(true);
        setErrorDetail('');

        try {
          // Fetch the set manifest in the browser so the plugin can list the
          // manifests that belong to the current related-title set.
          const response = await fetch(setManifestUrl, {
            credentials: 'same-origin',
            signal: controller.signal,
          });

          if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
          }

          const manifest = await response.json();
          if (!active) return;

          setItems(normalizeItems(manifest?.items));
        } catch (fetchError) {
          if (fetchError.name !== 'AbortError' && active) {
            setErrorDetail(fetchError.message || '');
          }
        } finally {
          if (active) {
            setLoading(false);
          }
        }
      }

      loadManifestSet();

      return () => {
        active = false;
        controller.abort();
      };
    }, [setManifestUrl]);

    const selectedValue = useMemo(() => {
      if (!currentManifestId) return '';
      return items.some(item => item.id === currentManifestId) ? currentManifestId : '';
    }, [currentManifestId, items]);

    if (!loading && !errorDetail && items.length === 0) return null;

    const windowIdShort = windowId?.replace(/^window-/, '') || 'default';
    const sectionId = `manifest-selector-${windowIdShort}`;
    const sectionLabel = t('availableManifests');
    const error = errorDetail
      ? `${t('unavailableManifests')} (${errorDetail})`
      : (!setManifestUrl ? t('unavailableManifests') : '');

    return (
      <div style={styles.container}>
        <Accordion
          slotProps={{ heading: { component: 'h4' } }}
          id={sectionId}
          elevation={0}
          expanded={open}
          onChange={handleChange}
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
                    onClick={() => browseToManifest(item.id)}
                    selected={item.id === selectedValue}
                  >
                    <ListItemText
                      slotProps={
                        {
                          primary: {
                            variant: 'body1',
                            sx: {
                              overflowWrap: 'anywhere',
                              whiteSpace: 'normal',
                            },
                          },
                        }
                      }
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

  MultiVolumeSelector.propTypes = {
    browseToManifest: PropTypes.func.isRequired,
    currentManifestId: PropTypes.string,
    windowId: PropTypes.string,
  };

  const mapStateToProps = (state, { windowId }) => {
    const window = state.windows?.[windowId] || {};

    return {
      currentManifestId: window.manifestId || '',
      windowId,
    };
  };

  const mapDispatchToProps = () => ({
    browseToManifest: manifestId => {
      if (!manifestId) {
        throw new Error(`[MultiVolumeSelector] browseToManifest called with missing manifestId ${manifestId}.`);
      }
      const viewerUrl = getViewerUrlFromManifestId(manifestId, endpoint);
      if (!viewerUrl) {
        throw new Error(`[MultiVolumeSelector] Could not derive the URL from manifestId ${manifestId}.`);
      }

      window.location.assign(viewerUrl);

    }
  });

  return {
    target: 'CanvasInfo',
    mode: 'add',
    name: `MultiVolumeSelector-${identifier}`,
    component: MultiVolumeSelector,
    mapStateToProps,
    mapDispatchToProps,
    config: {
      translations,
    },
  };
}
