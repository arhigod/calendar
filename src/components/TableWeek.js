import React from 'react';
import { render } from 'react-dom';
import { Table, TableBody } from 'react-lightning-design-system';

import RowWeek from './RowWeek';

export default class TableWeek extends React.Component {
    render() {
        let dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return (
            <Table bordered noRowHover className="app">
                <TableBody>
                {
                    [...Array(14)].map((e,i)=> {
                        let x = new Date(this.props.date);
                        if (i%2==0) {
                            x.setDate(x.getDate()+i/2);
                            return <RowWeek key={i} text={dayNames[i/2]} date={x} curentDate={this.props.curentDate}/>
                        }                        
                        x.setDate(x.getDate()+(i-1)/2);
                        return <RowWeek key={i} date={x} curentDate={this.props.curentDate} trainers={this.props.trainers} events={this.props.events} clickFunction={this.props.handleClick} />
                        }
                    )
                }
                </TableBody>
            </Table>
        )
    }
}
