import React, { useState, useCallback, useRef, useLayoutEffect } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import { CompanionWindowSection } from 'mirador'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import { FormControl } from '@mui/material'
import Typography from '@mui/material/Typography'
import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import CheckIcon from '@mui/icons-material/CheckSharp'
import MenuItem from '@mui/material/MenuItem'
import { updateConfig } from 'mirador/src/state/actions/config'
import { getLanguagesFromConfigWithCurrent } from 'mirador/src/state/selectors/config'
import { getManifestoInstance } from 'mirador/src/state/selectors/manifests'
import PropTypes from 'prop-types'

const translations = {
  en: {
    availableLanguages: 'Available languages',
    collapseSection: 'Collapse {{section}}',
    expandSection: 'Expand {{section}}',
  },
  ar: {
    availableLanguages: 'اللغات المتوفرة',
    collapseSection: 'طي {{section}}',
    expandSection: 'توسيع {{section}}',
  },
  // no translation for fa
  fa: {
    availableLanguages: 'Available languages',
    collapseSection: 'Collapse {{section}}',
    expandSection: 'Expand {{section}}',
  },  
}

const langstyles = {
  formControl: {
    width: '100%',
    marginTop: '0', 
  },
  listItemText: {
    paddingInlineStart: '20px',
    paddingInlineEnd: '20px',
    marginBlockStart: '4px',
    marginBlockEnd: '4px',
  },
}

const LanguageSelector = ({
  children,
  rootElem = {},
  handleClick = () => {},
  languages = [],
  resourceLanguages = [],
  windowId,
}) => {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const anchorRef = useRef(null)
  const [portalContainer, setPortalContainer] = useState(null)

  useLayoutEffect(() => {
    const anchor = anchorRef.current
    if (!anchor) return

    const scrollContainer = anchor.closest('.mirador-scrollto-scrollable')
    if (!scrollContainer) return

    // Find the CompanionWindowSection that contains our anchor (ManifestInfo's section)
    const mySection = Array.from(scrollContainer.children).find(child => child.contains(anchor))
    if (!mySection) return

    const div = document.createElement('div')
    scrollContainer.insertBefore(div, mySection)
    setPortalContainer(div)

    return () => {
      if (div.parentNode) div.parentNode.removeChild(div)
    }
  }, [])

  const handleChange = useCallback((_event, isExpanded) => {
    setOpen(isExpanded)
  }, [])

  const windowIdShort = windowId?.replace(/^window-/, '') || 'default'
  const sectionId = `language-selector-${windowIdShort}`
  const sectionLabel = t('availableLanguages')

  // Always render the anchor so the portal container can be created.
  // The portal is only shown when there are multiple languages to select from.
  return (
    <>
      <span ref={anchorRef} style={{ display: 'none' }} aria-hidden="true" />
      {children}
      {resourceLanguages.length >= 2 && portalContainer && createPortal(
        <CompanionWindowSection>
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
              <FormControl style={langstyles.formControl}>
                {languages.map(language => {
                  if (resourceLanguages.includes(language.locale)) {
                    return (
                      <MenuItem
                        key={language.locale}
                        onClick={() => handleClick({ rootElem, language })}
                      >
                        <ListItemIcon>{language.current && <CheckIcon />}</ListItemIcon>
                        <ListItemText
                          primaryTypographyProps={{ variant: 'body1' }}
                          style={langstyles.listItemText}
                        >
                          {language.label}
                        </ListItemText>
                      </MenuItem>
                    )
                  }
                  return null
                })}
              </FormControl>
            </AccordionDetails>
          </Accordion>
        </CompanionWindowSection>,
        portalContainer
      )}
    </>
  )
}

const mapDispatchToProps = (dispatch, { afterSelect }) => ({
  handleClick: ({rootElem, language} ) => {
    const { locale } = language

    let dir = 'ltr'

    if (locale === 'ar' || locale === 'fa') {
      dir = 'rtl'
    }

    rootElem.dir = dir

    dispatch(updateConfig({ language: locale }))

    afterSelect && afterSelect()
  },
})

const mapStateToProps = (state, { windowId }) => {
  // During manifest changes, getManifestoInstance can
  // briefly be undefined, and the plugin was calling .getLabel() unconditionally.
  // mapStateToProps now checks if the manifesto instance exists and 
  // falls back to resourceLanguages: [] until the new manifest is ready.
  const manifestoInstance = getManifestoInstance(state, { windowId })
  const resourceLanguages = manifestoInstance
    ? manifestoInstance.getLabel().reduce((langs, lang) => {
      langs.push(lang._locale)
      return langs
    }, [])
    : []

  return {
    languages: getLanguagesFromConfigWithCurrent(state),
    resourceLanguages,
    rootElem: document.getElementById(state.config.id),
    windowId,
  }
}

LanguageSelector.propTypes = {
  children: PropTypes.node,
  handleClick: PropTypes.func,
  languages: PropTypes.array,
  resourceLanguages: PropTypes.array,
  rootElem: PropTypes.object,
  windowId: PropTypes.string,
}

export default {
  target: 'ManifestInfo',
  mode: 'wrap',
  weight: 0,
  component: LanguageSelector,
  mapDispatchToProps,
  mapStateToProps,
  config: {
    translations,
  },
}
