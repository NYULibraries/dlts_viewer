import React, { Fragment } from 'react'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import CollapsibleSection from 'mirador/dist/es/src/containers/CollapsibleSection'
import { FormControl } from '@material-ui/core'
import CheckIcon from '@material-ui/icons/CheckSharp'
import MenuItem from '@material-ui/core/MenuItem'
import PropTypes from 'prop-types'
import * as actions from 'mirador/dist/es/src/state/actions'
import { getLanguagesFromConfigWithCurrent } from 'mirador/dist/es/src/state/selectors'

const langstyles = {
  container: {
    marginTop: '16px',
    paddingTop: '16px',
    paddingLeft: '0',
    borderBottom: '0.5px solid rgba(0, 0, 0, 0.25)',
    paddingRight: '8px',
    paddingBottom: '8px',
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

  const { t, handleClick, languages, viewerLanguages } = props

  return (
    <Fragment>
      <div style={langstyles.container}>
        <CollapsibleSection label={t('Available languages')}>
          <FormControl style={langstyles.formControl}>
          {
            languages.map(language => {
              if (viewerLanguages.includes(language.locale)) {
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
    </Fragment>
  )

}

const mapDispatchToProps = (dispatch, { afterSelect }) => ({
  handleClick: (language) => {
    dispatch(actions.updateConfig({ language }))

    afterSelect && afterSelect()
  },
})

LanguageSelector.propTypes = {
  handleClick: PropTypes.func.isRequired, 
  languages: PropTypes.object.isRequired,
  viewerLanguages: PropTypes.array.isRequired,
}

const mapStateToProps = (state) => ({
  languages: getLanguagesFromConfigWithCurrent(state),
  viewerLanguages: state.config.viewerLanguages,
})

export default {
  target: 'CanvasInfo',
  mode: 'add',
  component: LanguageSelector,
  mapDispatchToProps: mapDispatchToProps,
  mapStateToProps: mapStateToProps,
}
