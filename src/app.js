import React from 'react';
import { render } from 'react-dom';
import { DateInput, Button, Table, TableHeader, TableRow, TableHeaderColumn, TableBody, TableRowColumn, Spinner, Modal, ModalHeader, ModalContent, ModalFooter } from 'react-lightning-design-system';

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
                <p>
                    {this.props.event.description}
                </p>
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
    constructor(props) {
        super(props);
        this.state = {
            showComponent: false,
        };
        this.handleClick = this.handleClick.bind(this);
        this.closeClick = this.closeClick.bind(this);
    }

    handleClick(e) {
        console.log(this.props.event.type);
        if (!this.state.showComponent)
            this.setState({
                showComponent: true,
            });
        if (e.target.classList.contains('slds-modal__container') || e.target.classList.contains('slds-modal')) this.closeClick();
    }

    closeClick() {
        console.log("closeClick");
        this.setState({
            showComponent: false,
        });
    }

    render() {
        return (
            <div data-id={this.props.event.id} onClick={(e) => this.handleClick(e)} >
                <p className="eventName">{this.props.event.type} - {this.props.event.title}</p>
            {
                this.state.showComponent ?
                    <MyModal closef={() => this.closeClick()} trainers={this.props.trainers} event={this.props.event} /> :
                    null
            }
            </div>
        )
    }
}

class Box extends React.Component {
    render() {
        return (
            <TableRowColumn className="box">
                <div className="day">
                    <span>{this.props.date.getDate()}</span>
                </div>
                {
                    this.props.events.map((e,i) => 
                        (e.start.substr(0,10) == this.props.date.toISOString().substr(0,10)) &&
                            <Event trainers={this.props.trainers} event={e} key={i} />                      
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
                    return <Box key={i} trainers={this.props.trainers} date={x} events={this.props.events} />
                })
            }
            </TableRow>
        )
    }
}

class App extends React.Component {
    constructor(props) {
        super(props);
        this.curentDate = new Date();
        this.date = new Date();
        this.date.setDate(1);
        while (this.date.getDay() > 0) {
            this.date.setDate(this.date.getDate() - 1);
        }
        this.state = {
            date: this.date,
        };
        this.dateChange = this.dateChange.bind(this);
    }

    shouldComponentUpdate(nextProps, nextState) {
        console.log('App should update',nextState.date.toISOString().substr(0,10) != this.state.date.toISOString().substr(0,10));
        return nextState.date.toISOString().substr(0,10) != this.state.date.toISOString().substr(0,10);
    }

    dateChange(date) {
        this.curentDate = new Date(date);
        this.date = new Date(date);
        this.date.setDate(1);
        while (this.date.getDay() > 0) {
            this.date.setDate(this.date.getDate() - 1);
        }
        this.setState({
            date: this.date,
        });
    }


    render() {
        return (
            <div className="wrapper">
                <div className="dateInput">
                    <DateInput label="Date Input" defaultValue={(new Date()).toISOString()} dateFormat="DD/MM/YYYY" onValueChange={(x)=>this.dateChange(x)} />
                </div>
                <Table bordered className="app">
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
                        [...Array(5)].map((e,i)=> {
                            let x = new Date(this.state.date);
                            x.setDate(x.getDate()+7*i);
                            return <Row key={i} date={x} trainers={this.props.trainers} events={this.props.events} />;
                            }
                        )
                    }
                    </TableBody>
                </Table>
            </div>
        )
    }
}

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
        }).catch(err => console.log(err));
}

fetch('http://128.199.53.150/events')
    .then(response => response.json())
    .then(events => {
        takeTrainers(events);
    }).catch(err => console.log(err));
