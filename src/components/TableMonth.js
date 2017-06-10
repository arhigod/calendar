import React from 'react';
import { render } from 'react-dom';
import { Table, TableHeader, TableRow, TableHeaderColumn, TableBody } from 'react-lightning-design-system';

import RowMonth from './RowMonth';

export default class TableMonth extends React.Component {
    render() {
        let c = (new Date(this.props.date));
        c.setDate(this.props.date.getDate() + 7 * 5);
        c = c.getMonth() == this.props.curentDate.getMonth() ? 6 : 5;
        return (
            <Table bordered noRowHover className="app">
               <TableHeader>
                    <TableRow className="row">
                    {
                        ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((e,i) =>
                            <TableHeaderColumn className="box" key={i}>
                                {e}
                            </TableHeaderColumn>
                        )
                    }
                    </TableRow>
                </TableHeader>
                <TableBody>
                {
                    [...Array(c)].map((e,i)=> {
                        let x = new Date(this.props.date);
                        x.setDate(x.getDate()+7*i);
                        return <RowMonth key={i} date={x} curentDate={this.props.curentDate} trainers={this.props.trainers} events={this.props.events} clickFunction={this.props.handleClick} />;
                        }
                    )
                }
                </TableBody>
            </Table>
        )
    }
}
