import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import CSSModules from 'react-css-modules';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { DragSource, DropTarget, DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import TouchBackend from 'react-dnd-touch-backend';
import build from 'redux-object';

import WildlingsTrack from './wildlings-track/WildlingsTrack';
import InfluenceTrack from './influence-track/InfluenceTrack';

import { fetchBoard } from './redux/actions/';

import styles from './app.scss';

function DnDBackend()
{
  const is_touch_device = 'ontouchstart' in window || navigator.maxTouchPoints;
  if (is_touch_device) {
    return TouchBackend;
  }
  return HTML5Backend;
}

const specs = {
  drop(props, monitor, component) {
    return monitor.getDifferenceFromInitialOffset();
  }
};

@DropTarget("unit", specs, (connect, monitor) => {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop(),
  };
})
@CSSModules(styles)
export class Territory extends Component {
  render() {
    const { connectDropTarget, isOver } = this.props;
    const styleName =  isOver ? "territory-actived" : 'territory';

    return connectDropTarget(
      <g id={this.props.name} styleName={styleName}>
        <path d={this.props.boundaries} />
      </g>
    );
  }
}

const source = {
  beginDrag(props) {
    console.log(arguments);
    return { okay: "ok" };
  },
  endDrag(props, monitor, component) {
    console.log(monitor.getItem());
    console.log(monitor.getDropResult());
    console.log(monitor.didDrop());
    if (!monitor.didDrop()) { return false; }
    var r = monitor.getDropResult();
    const el = ReactDOM.findDOMNode(component);
    el.setAttribute("style", `pointer-events: all; position:absolute; top: ${el.offsetTop + r.y}px; left: ${el.offsetLeft + r.x}px;`);
  }
};

@DragSource("unit", source, (connect, monitor) => {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  }
})
@CSSModules(styles)
export class Piece extends Component {
  render() {
    const { connectDragSource } = this.props;
    const style = {
      position: 'absolute',
      top: 2137,
      left: 1342
    };
    return connectDragSource(<div id="42" className="unit" styleName={this.props.name} style={style}></div>);
  }
}

@DragDropContext(DnDBackend())
@connect(
  state => (
    { territory: state.territory }
  ),
  dispatch => (
    bindActionCreators({
      fetchBoard,
    }, dispatch)
  )
)
@CSSModules(styles)
class App extends Component {
  componentDidMount() {
    this.props.fetchBoard(1);
  }
  render() {
    return (
      <div styleName="app">
        <div styleName="board">
          <svg width="1980px" height="2975px">
            { this.renderTerritories() }
          </svg>
          <WildlingsTrack />
          { <InfluenceTrack /> }
          { /* <SupplyTrack /> */ }
          { /* <RoundTrack /> */ }
          { /* <VictoryTrack /> */ }
        </div>
        <aside>
          <div styleName="iron-throne-token"></div>
          <div styleName="valyrian-steel-blade-token"></div>
          <div styleName="mensseger-raven-token"></div>
          <div styleName="round-marker"></div>
          { this.renderFactions() }
          <div>
            { this.renderGarrisons() }
          </div>
        </aside>
      </div>
    );
  }

  renderTerritories(){
    return build(this.props, 'territory').map(territory => {
      return <Territory
        key={territory.id}
        name={territory.name}
        boundaries={territory.boundaries} />
    });
  }

  renderFactions() {
    const factions = [
      "baratheon",
      "lannister",
      "stark",
      "greyjoy",
      "tyrell",
      "martell"
    ];
    return factions.map(faction => {
      return (
        <div key={faction}>
          <Piece name={`${faction}-knight`} />
          <div styleName={`${faction}-influence-token`}></div>
          <div styleName={`${faction}-supply-token`}></div>
          <div styleName={`${faction}-victory-token`}></div>
          <div styleName={`${faction}-power-token`}></div>
          <div styleName={`${faction}-footman`}></div>
          <div styleName={`${faction}-knight`}></div>
          <div styleName={`${faction}-ship`}></div>
          <div styleName={`${faction}-siege-engine`}></div>
        </div>
        );
    });
  }

  renderGarrisons() {
    const garrisons = [
      "dragonstone",
      "highgarden",
      "lannisport",
      "pyke",
      "sunspear",
      "winterfell",
    ];

    return garrisons.map(garrison => {
      return (<div key={garrison} styleName={`garrison-${garrison}`}></div>);
    });
  }
}

export default App;
