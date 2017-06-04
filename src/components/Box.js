import React from 'react';
import { render } from 'react-dom';
import { TableRowColumn } from 'react-lightning-design-system';

import Event from './Event';

export default class Box extends React.Component {
    render() {
        let classes = this.props.date.getMonth() == this.props.curentDate.getMonth() ? "box" : "box inactiveMonth";
        classes = this.props.curentDate.toLocString() == this.props.date.toLocString() ? "box curentDate" : classes;
        let line = -1;
        for (let i = 0; i < this.props.lines.length; i++) {
            this.props.lines[i]--;
        }
        return (
            <TableRowColumn className={classes}>
                <div className="day">
                    <span>{this.props.date.getDate()}</span>
                </div>
                {
                    this.props.events.map((e,i) => {    
                        if (e.multiStart.reduce((pv,cv) => pv || cv.toLocString() == this.props.date.toLocString(),false)) { 
                            line++;
                            let d = new Date(e.start); d.setMilliseconds(e.duration);
                            let length = Math.min(Math.ceil((d-this.props.date)/86400000),7-this.props.date.getDay());
                            let w = length*100+'%';
                            let ww = (length-1)*17;
                            let borderClass = '';
                            if (this.props.date.toLocString() != e.multiStart[0].toLocString()) {
                                borderClass+='left ';
                                ww+=8;
                            }
                            if (this.props.date.toLocString() != e.multiStart[e.multiStart.length-1].toLocString()) {
                                borderClass+='right';
                                ww+=8;
                            }

                            w = 'calc('+w+' + '+ww+'px)';
                            let mt = 10;
                            while(this.props.lines[line]>0) {
                                line++;
                                mt+=29;
                            }                            
                            this.props.lines[line] = Math.ceil((d-this.props.date)/86400000);            
                            this.props.lines.map(x=>x>0 ? x-1 : 0);
                            return <Event class={borderClass} width={w} mt={mt+'px'} trainers={this.props.trainers} event={e} key={i} clickFunction={this.props.clickFunction} />   
                        }
                    }
                    )
                }
            </TableRowColumn>
        )
    }
}
