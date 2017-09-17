import React from 'react';
import CSSModules from 'react-css-modules';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import build from 'redux-object';

import styles from './InfluenceTracks.scss';

import { droppable, draggable } from '~/decorators';
import { moveInfluenceToken } from '~/redux/actions';

@connect(
  (state, props) => {
    console.log('InfluenceTracks', props);
    return {
      token: build(state, 'influenceToken', props.id),
    }
  },
  dispatch => (
    bindActionCreators({
      moveInfluenceToken,
    }, dispatch)
  )
)
@draggable('influence-token')
@CSSModules(styles)
export class InfluenceToken extends React.Component {
  constructor(props) {
    super(props);
    this.state = { x: 0, y: 0, position: props.position };
  }

  endDrag(monitor) {
    const { x, y, position } = monitor.getDropResult();
    this.props.moveInfluenceToken(this.props.id, { x, y, position });
  }

  render() {
    const { connectDragSource, x, y, position, house } = this.props;
    const style = {
      transform: `translate(${x}px, ${y}px)`,
      position: position ? 'static' : 'absolute',
    };
    return connectDragSource(
      <div styleName={`${house}-influence-token`} style={style}></div>
    );
  }
}

@droppable('influence-token')
@connect(
  state => ({ tokens: build(state, 'influenceTokens') }),
)
@CSSModules(styles)
export class InfluencePosition extends React.Component {
  drop(monitor) {
    console.log('InfluencePosition#drop');
    return { position: this.props.position, x: 0, y: 0 };
  }

 findTokenBy(track, position) {
   const result = this.props.tokens.filter(
     token => token.track === track &&
       token.position === position
   );
   return result ? result[0] : null;
  }

  render() {
    console.log('InfluencePosition#render');
    const { connectDropTarget, track, position, isOver } = this.props;
    const token = this.findTokenBy(track, position);

    return connectDropTarget(
      <li data-dragging-over={isOver || null}>
        { token ? <InfluenceToken {...token} /> : null }
      </li>
    );
  }
}

@CSSModules(styles)
export default class InfluenceTracks extends React.Component {
  renderTrack(track) {
    const positions = [6, 5, 4, 3, 2, 1];
    return positions.map(position => <InfluencePosition
      key={position}
      track={track}
      position={position} />
    );
  }

  render() {
    console.log('InfluenceTracks#render');
    const tracks = ['iron_throne', 'fiefdoms', 'kings_court'];

    return <div styleName="tracks">
      { tracks.map(track => <ol key={track}>{ this.renderTrack(track) }</ol>) }
    </div>
  }
}

