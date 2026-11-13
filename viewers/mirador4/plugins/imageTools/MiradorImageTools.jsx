import PropTypes from 'prop-types';
import BrightnessIcon from '@mui/icons-material/Brightness5';
import TonalityIcon from '@mui/icons-material/Tonality';
import GradientIcon from '@mui/icons-material/Gradient';
import ContrastIcon from '@mui/icons-material/ExposureSharp';
import InvertColorsIcon from '@mui/icons-material/InvertColors';
import TuneSharpIcon from '@mui/icons-material/TuneSharp';
import CloseSharpIcon from '@mui/icons-material/CloseSharp';
import ReplaySharpIcon from '@mui/icons-material/ReplaySharp';
import { styled } from '@mui/material/styles';
import { MiradorMenuButton, useTranslation } from 'mirador';
import ImageTool from './ImageTool.jsx';
import ImageRotation from './ImageRotation.jsx';
import ImageFlip from './ImageFlip.jsx';

const Root = styled('div')(() => ({
  alignItems: 'center',
  display: 'flex',
  flexDirection: 'row',
}));

const ControlContainer = styled('div')(() => ({
  display: 'flex',
  flexDirection: 'row',
}));

/**
 * Image tools control set for the window top bar (WindowTopBarPluginArea).
 */
const MiradorImageTools = ({
  enabled = true,
  open = true,
  updateViewport,
  updateWindow,
  viewConfig = {},
  windowId,
}) => {
  const { t } = useTranslation();

  const { flip = false, brightness = 100, contrast = 100, saturate = 100, grayscale = 0, invert = 0 } = viewConfig;

  const handleChange = (param) => (value) => {
    updateViewport(windowId, { [param]: value });
  };

  const handleReset = () => {
    updateViewport(windowId, {
      brightness: 100,
      contrast: 100,
      flip: false,
      grayscale: 0,
      invert: 0,
      rotation: 0,
      saturate: 100,
    });
  };

  const toggleState = () => {
    updateWindow(windowId, { imageToolsOpen: !open });
  };

  const toggleRotate = (value) => {
    const offset = flip ? -1 * value : value;
    updateViewport(windowId, { rotation: (viewConfig.rotation + offset) % 360 });
  };

  const toggleFlip = () => {
    updateViewport(windowId, { flip: !flip });
  };

  if (!enabled) return null;

  const toggleButton = (
    <MiradorMenuButton
      aria-expanded={open}
      aria-haspopup
      aria-label={t('collapse', { context: open ? 'open' : 'close' })}
      onClick={toggleState}
    >
      {open ? <CloseSharpIcon /> : <TuneSharpIcon />}
    </MiradorMenuButton>
  );

  return (
    <Root>
      {open && (
        <>
          <ControlContainer>
            <ImageRotation label={t('rotateRight')} onClick={() => toggleRotate(90)} variant="right" />
            <ImageRotation label={t('rotateLeft')} onClick={() => toggleRotate(-90)} variant="left" />
            <ImageFlip flipped={flip} label={t('flip')} onClick={toggleFlip} />
          </ControlContainer>
          <ControlContainer>
            <ImageTool
              type="brightness"
              label={t('brightness')}
              max={200}
              windowId={windowId}
              value={brightness}
              onChange={handleChange('brightness')}
            >
              <BrightnessIcon />
            </ImageTool>
            <ImageTool
              type="contrast"
              label={t('contrast')}
              max={200}
              windowId={windowId}
              value={contrast}
              onChange={handleChange('contrast')}
            >
              <ContrastIcon style={{ transform: 'rotate(180deg)' }} />
            </ImageTool>
            <ImageTool
              type="saturate"
              label={t('saturation')}
              max={200}
              windowId={windowId}
              value={saturate}
              onChange={handleChange('saturate')}
            >
              <GradientIcon />
            </ImageTool>
            <ImageTool
              type="grayscale"
              variant="toggle"
              label={t('greyscale')}
              windowId={windowId}
              value={grayscale}
              onChange={handleChange('grayscale')}
            >
              <TonalityIcon />
            </ImageTool>
            <ImageTool
              type="invert"
              variant="toggle"
              label={t('invert')}
              windowId={windowId}
              value={invert}
              onChange={handleChange('invert')}
            >
              <InvertColorsIcon />
            </ImageTool>
          </ControlContainer>
          <ControlContainer>
            <MiradorMenuButton aria-label={t('revert')} onClick={handleReset}>
              <ReplaySharpIcon />
            </MiradorMenuButton>
          </ControlContainer>
        </>
      )}
      {toggleButton}
    </Root>
  );
};

MiradorImageTools.propTypes = {
  enabled: PropTypes.bool,
  open: PropTypes.bool,
  updateViewport: PropTypes.func.isRequired,
  updateWindow: PropTypes.func.isRequired,
  viewConfig: PropTypes.object,
  windowId: PropTypes.string.isRequired,
};

export const TestableImageTools = MiradorImageTools;

export default MiradorImageTools;
