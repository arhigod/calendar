import React from 'react';
import { render } from 'react-dom';
import { ButtonGroup, util, DateInput, Button, Table, TableHeader, TableRow, TableHeaderColumn, TableBody, TableRowColumn, Spinner, Modal, ModalHeader, ModalContent, ModalFooter } from 'react-lightning-design-system';

class MyModalBody extends React.Component {
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

class MyModal extends React.Component {
    render() {
        return (
            <Modal opened size="large" >
                <ModalHeader title={this.props.event.type + ' - ' + this.props.event.title} closeButton={false} />
                <ModalContent>
                    <MyModalBody trainers={this.props.trainers} event={this.props.event} />
                </ModalContent>
                <ModalFooter directional={false}>
                    <Button type="brand" label="Done" onClick={() => this.props.closef()} />
                </ModalFooter>
            </Modal>
        )
    }
}

class Event extends React.Component {
    render() {
        return (
            <div className="eventLine" data-id={this.props.event.id} onClick={(e) => this.props.modalFunc(e,this.props.event)} >
                <p className="eventName">{this.props.event.type} - {this.props.event.title}</p>
            </div>
        )
    }
}

class Box extends React.Component {
    render() {
        let classes = this.props.date.getMonth() == this.props.curentDate.getMonth() ? "box" : "box inactiveMonth";
        classes = this.props.curentDate.toISOString().substr(0, 10) == this.props.date.toISOString().substr(0, 10) ? "box curentDate" : classes;
        return (
            <TableRowColumn className={classes}>
                <div className="day">
                    <span>{this.props.date.getDate()}</span>
                </div>
                {
                    this.props.events.map((e,i) => 
                        (e.start.substr(0,10) == this.props.date.toISOString().substr(0,10)) &&
                            <Event trainers={this.props.trainers} event={e} key={i} modalFunc={this.props.modalFunc} />                      
                    )
                }
            </TableRowColumn>
        )
    }
}

class Row extends React.Component {
    render() {
        return (
            <TableRow className="row">
            {
                [...Array(7)].map((e,i)=> {
                    let x = new Date(this.props.date);
                    x.setDate(x.getDate()+i);
                    return <Box key={i} trainers={this.props.trainers} date={x} curentDate={this.props.curentDate} events={this.props.events} modalFunc={this.props.modalFunc} />
                })
            }
            </TableRow>
        )
    }
}

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            date: new Date(),
            curentDate: new Date(),
            showModal: false,
        };
        this.state.date.setDate(1);
        while (this.state.date.getDay() > 0) {
            this.state.date.setDate(this.state.date.getDate() - 1);
        }
        this.dateChange = this.dateChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.closeClick = this.closeClick.bind(this);
    }

    // shouldComponentUpdate(nextProps, nextState) {
    //     console.log('App should update', nextState.curentDate.toISOString().substr(0, 10) != this.state.curentDate.toISOString().substr(0, 10));
    //     //return nextState.curentDate.toISOString().substr(0, 10) != this.state.curentDate.toISOString().substr(0, 10);
    //     return true;
    // }

    dateChange(date) {
        let d = new Date(date);
        d.setDate(1);
        while (d.getDay() > 0) {
            d.setDate(d.getDate() - 1);
        }
        this.setState({
            curentDate: new Date(date),
            date: d,
        });
    }

    handleClick(e, event) {
        if (!this.state.showModal && event)
            this.setState({
                showModal: true,
                event: event,
            });
        if (e.target.classList.contains('slds-modal__container') || e.target.classList.contains('slds-modal')) this.closeClick();
    }

    closeClick() {
        this.setState({
            showModal: false,
        });
    }

    render() {
        let c = (new Date(this.state.date));
        c.setDate(this.state.date.getDate() + 7 * 5);
        c = c.getMonth() == this.state.curentDate.getMonth() ? 6 : 5;
        return (
            <div className="wrapper" onClick={(e)=>this.handleClick(e)} >
                <div className="dateInput">
                    <ButtonGroup className="buttons">
                        <Button type="icon-border" icon="left" onClick={()=>{
                            let d = new Date(this.state.curentDate);
                            d.setDate(0);
                            this.dateChange(d.setDate(1))}
                        } />
                        <Button type="icon-border" icon="home" onClick={()=>this.dateChange(new Date())}/>
                        <Button type="icon-border" icon="right" onClick={()=>{
                            let d = new Date(this.state.curentDate);
                            d.setDate(32);
                            return this.dateChange(d.setDate(1))}
                        } />
                    </ButtonGroup>
                    <DateInput value={this.state.curentDate.toISOString()} dateFormat="DD/MM/YYYY" onValueChange={(x)=>this.dateChange(x)} />
                </div>
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
                            let x = new Date(this.state.date);
                            x.setDate(x.getDate()+7*i);
                            return <Row key={i} date={x} curentDate={this.state.curentDate} trainers={this.props.trainers} events={this.props.events} modalFunc={(e,ev)=>this.handleClick(e,ev)} />;
                            }
                        )
                    }
                    </TableBody>
                </Table>
                {
                    this.state.showModal ?
                    <MyModal closef={() => this.closeClick()} trainers={this.props.trainers} event={this.state.event} /> :
                    null
                }
            </div>
        )
    }
}

util.setAssetRoot('./salesforce-lightning-design-system/assets');

render(
    <div>
        <div style={{position: "absolute", top: "50%", left: "50%", width: "100px", height: "100px", transform:"translate(-50%,-50%)"}}>
            <Spinner type="brand" size="large" />
        </div>
    </div>,
    document.querySelector('#root')
);

let rend = function(events, trainers) {
    render(
        <div>
            <App trainers={trainers} events={events} />   
        </div>,
        document.querySelector('#root')
    );
}

let takeTrainers = function(events) {
    fetch('http://128.199.53.150/trainers')
        .then(response => response.json())
        .then(trainers => {
            rend(events, trainers);
        });
}

let localData = function() {
    console.log('ooops');
    let events = require('./../events.json');
    let trainers = require('./../trainers.json');
    rend(events,trainers);
}

fetch('http://128.199.53.150/events')
    .then(response => response.json())
    .then(events => {
        takeTrainers(events);
    }).catch((err) => localData());
