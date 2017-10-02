import React from 'react';
import CSSModules from 'react-css-modules';
import { connect } from 'react-redux'
import build from 'redux-object';

import styles from './AvailableUnits.scss';

import Unit from '~/components/unit/Unit';

@connect(
  state => ({
    footmen: (build(state, 'footmen') || []).filter(unit => !unit.territory),
    knights: (build(state, 'knights') || []).filter(unit => !unit.territory),
    ships: (build(state, 'ships') || []).filter(unit => !unit.territory),
    siegeEngines: (build(state, 'siegeEngines') || []).filter(unit => !unit.territory),
  })
)
@CSSModules(styles)
export default class AvailableUnits extends React.Component {
  unitsByType() {
    const {
      footmen,
      knights,
      ships,
      siegeEngines,
      type,
      house,
    } = this.props;

    const units = [...footmen, ...knights, ...ships, ...siegeEngines];
    return units.filter(unit => unit.type.toLowerCase() === type && unit.houseName === house);
  }

  getFirstUnit() {
    const units = this.unitsByType();
    if(units.length === 0) { return; }
    return units[0];
  }

  getUnitsCount() {
    return this.unitsByType().length;
  }

  render() {
    const { type, house } = this.props;
    const unit = this.getFirstUnit();
    return (
      <div styleName="available-units">
        <strong>{this.getUnitsCount(type)}</strong>
        { unit ? <Unit {...unit} /> : <Unit houseName={house} type={type} disabled={true} /> }
      </div>
      );
  }
}
