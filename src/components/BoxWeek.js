import React from 'react';
import { render } from 'react-dom';
import { TableRowColumn } from 'react-lightning-design-system';

import Event from './Event';

export default class BoxWeek extends React.Component {
    render() {
        let classes = this.props.date.getMonth() == this.props.curentDate.getMonth() ? "" : "inactiveMonth";
        classes = this.props.curentDate.toLocString() == this.props.date.toLocString() ? "curentDate" : classes;
        if (this.props.text) return <TableRowColumn className={"boxDayName "+classes}>{`${this.props.text} ${this.props.date.toLocString('beauty')}`}</TableRowColumn>
        return (
            <TableRowColumn className={"box "+classes}>
                <div className="day">
                    <span>{this.props.date.getDate()}</span>
                </div>
                {
                    this.props.events.map((e,i) => {    
                        let start = new Date(e.start);
                        let finish = new Date(e.start); finish.setMilliseconds(e.duration);
                        if (start.toLocString()<=this.props.date.toLocString() && this.props.date.toLocString()<=finish.toLocString()) {
                            let length = Math.min(Math.ceil((finish-this.props.date)/86400000),7-this.props.date.getDay());
                            let ww = 0;
                            let borderClass = '';
                            if (this.props.date.toLocString() != start.toLocString()) {
                                borderClass+='left ';
                                ww+=8;
                            }
                            if (this.props.date.toLocString() != finish.toLocString()) {
                                borderClass+='right';
                                ww+=8;
                            }
                            let w = 'calc(100% + '+ww+'px)';                      
                            return <Event class={borderClass} width={w} mt={'10px'} trainers={this.props.trainers} event={e} key={i} clickFunction={this.props.clickFunction} />   
                        }
                    }
                    )
                }
            </TableRowColumn>
        )
    }
}
