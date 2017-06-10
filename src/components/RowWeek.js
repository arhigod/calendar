import React from 'react';
import { render } from 'react-dom';
import { TableRow } from 'react-lightning-design-system';

import BoxWeek from './BoxWeek';

export default class RowWeek extends React.Component {
    render() {
        return (
            <TableRow className="row">
                {
                    this.props.text ?
                    <BoxWeek text={this.props.text} date={this.props.date} curentDate={this.props.curentDate} /> :
                    <BoxWeek trainers={this.props.trainers} date={this.props.date} curentDate={this.props.curentDate} events={this.props.events} clickFunction={this.props.clickFunction} />
                }
            </TableRow>
        )
    }
}
