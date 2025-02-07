const React = require('react');
const { render } = require('@testing-library/react');
const {
  renderTrack,
  renderTrackRTL,
  renderThumbDark,
  renderThumbLight,
  renderView,
  renderViewRTL,
  kanbanRenderTrack,
  kanbanRenderThumbDark,
  kanbanRenderThumbLight,
  kanbanRenderView
} = require('../../../components/Scrollbar/Scrollbar');

describe('Scrollbar Components', () => {
  const defaultStyle = { color: 'red' };
  const defaultProps = { className: 'test-class' };

  describe('renderTrack', () => {
    it('combine correctement les styles', () => {
      const { container } = render(
        renderTrack({ style: defaultStyle, ...defaultProps })
      );

      const element = container.firstChild;
      expect(element).toHaveStyle({
        position: 'absolute',
        maxWidth: '100%',
        width: '6px',
        opacity: '0',
        right: '0',
        color: 'red'
      });
      expect(element).toHaveClass('test-class');
    });
  });

  describe('renderTrackRTL', () => {
    it('applique les styles RTL correctement', () => {
      const { container } = render(
        renderTrackRTL({ style: defaultStyle, ...defaultProps })
      );

      const element = container.firstChild;
      expect(element).toHaveStyle({
        position: 'absolute',
        width: '6px',
        left: '0',
        color: 'red'
      });
    });
  });

  describe('renderThumbDark', () => {
    it('applique les styles sombres correctement', () => {
      const { container } = render(
        renderThumbDark({ style: defaultStyle, ...defaultProps })
      );

      const element = container.firstChild;
      expect(element).toHaveStyle({
        borderRadius: '15px',
        background: 'rgba(222, 222, 222, .1)',
        color: 'red'
      });
    });
  });

  describe('renderThumbLight', () => {
    it('applique les styles clairs correctement', () => {
      const { container } = render(
        renderThumbLight({ style: defaultStyle, ...defaultProps })
      );

      const element = container.firstChild;
      expect(element).toHaveStyle({
        borderRadius: '15px',
        background: 'rgba(48, 48, 48, .1)',
        color: 'red'
      });
    });
  });

  describe('renderView', () => {
    it('applique la marge correctement', () => {
      const { container } = render(
        renderView({ style: defaultStyle, ...defaultProps })
      );

      const element = container.firstChild;
      expect(element).toHaveStyle({
        marginRight: '-22px',
        color: 'red'
      });
    });
  });

  describe('renderViewRTL', () => {
    it('applique les marges RTL correctement', () => {
      const { container } = render(
        renderViewRTL({ style: defaultStyle, ...defaultProps })
      );

      const element = container.firstChild;
      expect(element).toHaveStyle({
        marginRight: 'unset',
        marginLeft: '-15px',
        color: 'red'
      });
    });
  });

  describe('Kanban Components', () => {
    it('applique les styles kanban correctement', () => {
      const { container: trackContainer } = render(
        kanbanRenderTrack({ style: defaultStyle, ...defaultProps })
      );
      const { container: thumbDarkContainer } = render(
        kanbanRenderThumbDark({ style: defaultStyle, ...defaultProps })
      );
      const { container: thumbLightContainer } = render(
        kanbanRenderThumbLight({ style: defaultStyle, ...defaultProps })
      );
      const { container: viewContainer } = render(
        kanbanRenderView({ style: defaultStyle, ...defaultProps })
      );

      expect(trackContainer.firstChild).toHaveStyle({
        width: '6px',
        right: '0'
      });
      expect(thumbDarkContainer.firstChild).toHaveStyle({
        background: 'rgba(222, 222, 222, .1)'
      });
      expect(thumbLightContainer.firstChild).toHaveStyle({
        background: 'rgba(48, 48, 48, .1)'
      });
      expect(viewContainer.firstChild).toHaveStyle({
        position: 'relative',
        marginRight: '-15px'
      });
    });
  });
}); 