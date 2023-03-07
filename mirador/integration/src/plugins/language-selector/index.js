import React from 'react'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import { FormControl } from '@material-ui/core'
import CheckIcon from '@material-ui/icons/CheckSharp'
import MenuItem from '@material-ui/core/MenuItem'
import CollapsibleSection from 'mirador/dist/es/src/containers/CollapsibleSection'
import { updateConfig } from 'mirador/dist/es/src/state/actions/config'
import { getLanguagesFromConfigWithCurrent } from 'mirador/dist/es/src/state/selectors/config'
import { getManifestoInstance } from 'mirador/dist/es/src/state/selectors/manifests'
import PropTypes from 'prop-types'
import translations from './translations'

const langstyles = {
  container: {
    marginTop: '16px',
    paddingTop: '16px',
    paddingLeft: '0',
    paddingRight: '8px',
    paddingBottom: '8px',
    borderBottom: 'none',
    borderTop: '0.5px solid rgba(0, 0, 0, 0.25)',
  },
  content: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'start',
    flexDirection: 'column',
    margin: '.5em 0',
  },
  formControl: {
    width: '100%',
  },
  selectMenu: {
    '&::before': {
      content: "''",
      borderBottom: '.1px solid rgba(0, 0, 0, 0.2)',
    },
  },
}

const LanguageSelector = (props) => {

  const { 
    handleClick, 
    languages, 
    t, 
    resourceLanguages,
  } = props

  // If there is only one language, don't show the language selector.
  if (resourceLanguages.length < 2) return

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
                      handleClick(language.locale)
                    }}
                  >
                    <ListItemIcon>{language.current && <CheckIcon />}</ListItemIcon>
                    <ListItemText primaryTypographyProps={{ variant: 'body1' }}>
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
  handleClick: (language) => {
    dispatch(updateConfig({ language }))

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
  }
}

LanguageSelector.propTypes = {
  handleClick: PropTypes.func.isRequired, 
  t: PropTypes.func.isRequired, 
  languages: PropTypes.array.isRequired,
  resourceLanguages: PropTypes.array.isRequired,
}

LanguageSelector.defaultProps = {
  handleClick: () =>  {},
  t: () =>  {},
  languages: [],
  resourceLanguages: [],
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
