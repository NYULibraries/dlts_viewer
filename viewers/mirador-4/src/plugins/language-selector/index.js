import React from 'react'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import { FormControl } from '@mui/material'
import CheckIcon from '@mui/icons-material/CheckSharp'
import MenuItem from '@mui/material/MenuItem'
import CollapsibleSection from 'mirador/dist/es/src/containers/CollapsibleSection'
import { updateConfig } from 'mirador/dist/es/src/state/actions/config'
import { getLanguagesFromConfigWithCurrent } from 'mirador/dist/es/src/state/selectors/config'
import { getManifestoInstance } from 'mirador/dist/es/src/state/selectors/manifests'
import PropTypes from 'prop-types'
import translations from './translations'

const langstyles = {
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
  content: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'start',
    flexDirection: 'column',
    margin: '0',
  },
  formControl: {
    width: '100%',
    marginTop: '0', 
  },
  sectionTitle: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingRight: '8px', 
  },
  selectMenu: {
    '&::before': {
      content: "''",
      borderBottom: '.1px solid rgba(0, 0, 0, 0.2)',
    },
  },
  listItemText: {
    paddingInlineStart: '20px',
    paddingInlineEnd: '20px',
    marginBlockStart: '4px',
    marginBlockEnd: '4px',
  },
}

const LanguageSelector = (props) => {

  const {
    rootElem,
    handleClick,
    languages,
    t,
    resourceLanguages,
  } = props

  // If there is only one language, don't show the language selector.
  if (resourceLanguages.length < 2) return (<></>)

  return (
    <div style={langstyles.container}>
      <CollapsibleSection label={t('availableLanguages')}>
        <FormControl style={langstyles.formControl}>
          {
            languages.map(language => {
              if (resourceLanguages.includes(language.locale)) {
                return (
                  <MenuItem
                    button={!language.current}
                    key={language.locale}
                    onClick={() => {
                      handleClick({ rootElem, language})
                    }}
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
            })
          }
        </FormControl>
      </CollapsibleSection>
    </div>
  )
}

const mapDispatchToProps = (dispatch, { afterSelect }) => ({
  handleClick: ({rootElem, language} ) => {
    const { locale } = language

    // @TODO: Hack until I can figure out the best way to pass the translation object to the props.
    // availableLanguages does not include language direction, so we need to add it.
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
  return {
    languages: getLanguagesFromConfigWithCurrent(state),
    resourceLanguages: getManifestoInstance(state, { windowId }).getLabel().reduce((langs, lang) => {
      langs.push(lang._locale)
      return langs
    }, []),
    rootElem: document.getElementById(state.config.id),
  }
}

LanguageSelector.propTypes = {
  handleClick: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  languages: PropTypes.array.isRequired,
  resourceLanguages: PropTypes.array.isRequired,
  rootElem: PropTypes.object,
}

LanguageSelector.defaultProps = {
  handleClick: () =>  {},
  t: () =>  {},
  languages: [],
  resourceLanguages: [],
  rootElem: {},
}

export default {
  target: 'CanvasInfo',
  mode: 'add',
  component: LanguageSelector,
  mapDispatchToProps,
  mapStateToProps,
  config: {
    translations,
  },
}
