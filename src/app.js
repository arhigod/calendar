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
            <div className={"eventLine "+this.props.class} style={{width: this.props.width, marginTop: this.props.mt+'px'}} data-id={this.props.event.id} onClick={(e) => this.props.modalFunc(e,this.props.event)} >
                <p className="eventName">{this.props.event.type} - {this.props.event.title}</p>
            </div>
        )
    }
}

class Box extends React.Component {
    render() {
        let classes = this.props.date.getMonth() == this.props.curentDate.getMonth() ? "box" : "box inactiveMonth";
        classes = this.props.curentDate.toLString() == this.props.date.toLString() ? "box curentDate" : classes;
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
                        if (e.multiStart.reduce((pv,cv) => pv || cv.toLString() == this.props.date.toLString(),false)) { 
                            line++;
                            let d = new Date(e.start); d.setMilliseconds(e.duration);
                            let length = Math.min(Math.ceil((d-this.props.date)/86400000),7-this.props.date.getDay());
                            let w = length*100+'%';
                            let ww = (length-1)*17;
                            let borderClass = '';
                            if (this.props.date.toLString() != e.multiStart[0].toLString()) {
                                borderClass+='left ';
                                ww+=8;
                            }
                            if (this.props.date.toLString() != e.multiStart[e.multiStart.length-1].toLString()) {
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
                            return <Event class={borderClass} width={w} mt={mt} trainers={this.props.trainers} event={e} key={i} modalFunc={this.props.modalFunc} />   
                        }
                    }
                    )
                }
            </TableRowColumn>
        )
    }
}

class Row extends React.Component {
    render() {
        this.lines = Array.from({ length: 10 }).fill(0);
        return (
            <TableRow className="row">
            {
                [...Array(7)].map((e,i)=> {
                    let x = new Date(this.props.date);
                    x.setDate(x.getDate()+i);
                    return <Box takeLine={this.takeLine} lines={this.lines} key={i} trainers={this.props.trainers} date={x} curentDate={this.props.curentDate} events={this.props.events} modalFunc={this.props.modalFunc} />
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
        this.state.date.setHours(0, 0, 0, 0);
        this.state.curentDate.setHours(0, 0, 0, 0);
        this.state.date.setDate(1);
        this.state.date.setHours(0, 0, 0, 0);
        while (this.state.date.getDay() > 0) {
            this.state.date.setDate(this.state.date.getDate() - 1);
        }
        this.dateChange = this.dateChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.closeClick = this.closeClick.bind(this);
    }

    dateChange(date) {
        let d = new Date(date);
        d.setDate(1);
        d.setHours(0, 0, 0, 0);
        while (d.getDay() > 0) {
            d.setDate(d.getDate() - 1);
        }
        let dd = new Date(date);
        dd.setHours(0, 0, 0, 0);
        this.setState({
            curentDate: dd,
            date: d,
        });
    }

    handleClick(e, event) {
        if (!this.state.showModal && event) {
            this.setState({
                showModal: true,
                event: event,
            });
        }
        if (e.target.classList.contains('slds-modal__container') || e.target.classList.contains('slds-modal')) {
            this.closeClick();
        }
    }

    closeClick() {
        this.setState({
            showModal: false,
        });
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.state.showModal != nextState.showModal) return true;
        if (this.state.curentDate.toLString() == nextState.curentDate.toLString()) return false;
        return true;
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
                    <DateInput value={this.state.curentDate.toLString()} dateFormat="DD/MM/YYYY" onValueChange={(x)=>this.dateChange(x)} />
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
    events.map(e => {
        e.multiStart = [new Date(e.start)];
        let d = new Date(e.start);
        d.setMilliseconds(e.duration);
        d.setDate(d.getDate() - d.getDay());
        d.setHours(0, 0, 0, 0);
        while (d > e.multiStart[0]) {
            e.multiStart.push(new Date(d));
            d.setDate(d.getDate() - 7);
        }
    })
    rend(events, trainers);
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

Date.prototype.toLString = function() {
    return `${this.getFullYear()}.${this.getMonth()+1}.${this.getDate()}`;
}

fetch('http://128.199.53.150/events')
    .then(response => response.json())
    .then(events => {
        events.map(e => {
            e.multiStart = [new Date(e.start)];
            let d = new Date(e.start);
            d.setMilliseconds(e.duration);
            d.setDate(d.getDate() - d.getDay());
            d.setHours(0, 0, 0, 0);
            while (d > e.multiStart[0]) {
                e.multiStart.push(new Date(d));
                d.setDate(d.getDate() - 7);
            }
        })
        takeTrainers(events);
    }).catch((err) => localData());
