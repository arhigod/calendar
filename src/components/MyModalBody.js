import React from 'react';
import { render } from 'react-dom';
import { Icon } from 'react-lightning-design-system';

export default class MyModalBody extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			renderMap: false,
		}
		this.renderMap = this.renderMap.bind(this);
	}
	renderMap() {
		this.setState({
			renderMap: true,
		})
	}
    render() {
    	let start = (new Date(this.props.event.start)).toLocaleString();
    	let finish = new Date(this.props.event.start);
    	finish.setMilliseconds(this.props.event.duration);
    	finish = finish.toLocaleString();
    	setTimeout(this.renderMap, 1600);
        return (
            <div className="modalBody">
            	<div className="date">
            		<Icon icon="utility:dayview" size="small" />
	            	<p>
	            		{`${start} - ${finish}`}
	            	</p>
	            </div>
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
                {
                	this.state.renderMap ?
                	<div className="map" dangerouslySetInnerHTML={{__html: '<iframe frameborder="0" src="https://www.google.com/maps/embed/v1/place?q=vulісa Akadеmіka Kuprеvіča 1, Building 5, Minsk&key=AIzaSyAF-vbk6kyPKb3CplU49bTq2r26vvQK5BM" allowfullscreen></iframe>'}}/> :
            		<div className="map" />
            	}
            </div>
        )
    }
}
