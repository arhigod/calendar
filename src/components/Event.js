import React from 'react';
import { render } from 'react-dom';

export default class Event extends React.Component {
    render() {
        return (
            <div className={"eventLine "+this.props.class} style={{width: this.props.width, marginTop: this.props.mt}} data-id={this.props.event.id} onClick={(e) => this.props.clickFunction(e,this.props.event)} >
                <p className="eventName">{this.props.event.type} - {this.props.event.title}</p>
            </div>
        )
    }
}
