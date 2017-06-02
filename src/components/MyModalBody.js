import React from 'react';
import { render } from 'react-dom';

export default class MyModalBody extends React.Component {
    render() {
        return (
            <div className="modalBody">
                <div className="speakers">
                    {
                        this.props.event.speakers.map((id) => 
                                <div key={id} className="speaker">
                                    <img src={this.props.trainers.filter(t => t.id == id)[0].avatar} />
                                    <span>{this.props.trainers.filter(t => t.id == id)[0].name}</span>
                                </div>
                            )
                    }
                </div>
                <div className="description">
                    <p>
                        {this.props.event.description}
                    </p>
                </div>
                <div className="resources">
                    {
                        this.props.event.resources.map((res, i) => 
                                <div key={i} className="resource">
                                    <a href={res.resource} target="_blank">{res.type}</a>
                                    <p>{res.description}</p>
                                </div>
                            )
                    }
                </div>
            </div>
        )
    }
}
