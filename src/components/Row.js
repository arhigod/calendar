import React from 'react';
import { render } from 'react-dom';
import { TableRow } from 'react-lightning-design-system';

import Box from './Box';

export default class Row extends React.Component {
    render() {
        this.lines = Array.from({ length: 10 }).fill(0);
        return (
            <TableRow className="row">
            {
                [...Array(7)].map((e,i)=> {
                    let x = new Date(this.props.date);
                    x.setDate(x.getDate()+i);
                    return <Box lines={this.lines} key={i} trainers={this.props.trainers} date={x} curentDate={this.props.curentDate} events={this.props.events} clickFunction={this.props.clickFunction} />
                })
            }
            </TableRow>
        )
    }
}
