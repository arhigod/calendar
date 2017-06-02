import React from 'react';
import { render } from 'react-dom';
import { ButtonGroup, DateInput, Button, Table, TableHeader, TableRow, TableHeaderColumn, TableBody } from 'react-lightning-design-system';

import Row from './Row';
import MyModal from './MyModal';

export default class App extends React.Component {
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
                            return <Row key={i} date={x} curentDate={this.state.curentDate} trainers={this.props.trainers} events={this.props.events} clickFunction={(e,ev)=>this.handleClick(e,ev)} />;
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
