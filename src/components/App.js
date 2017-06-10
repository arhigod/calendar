import React from 'react';
import { render } from 'react-dom';
import { ButtonGroup, DateInput, Button } from 'react-lightning-design-system';

import MyModal from './MyModal';
import TableWeek from './TableWeek';
import TableMonth from './TableMonth';

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            date: new Date(),
            curentDate: new Date(),
            showModal: false,
            view: 'month',
        };
        this.state.date.setHours(0, 0, 0, 0);
        this.state.curentDate.setHours(0, 0, 0, 0);
        this.state.date.setDate(1);
        this.state.date.setHours(0, 0, 0, 0);
        while (this.state.date.getDay() > 0) {
            this.state.date.setDate(this.state.date.getDate() - 1);
        }
        this.modalSwipe();

        this.dateChange = this.dateChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.closeClick = this.closeClick.bind(this);
        this.changeView = this.changeView.bind(this);
    }

    modalSwipe() {
        let mouseDown = false;
        let startSwipeX = 0;
        let startSwipeY = 0;
        let startSwipeModalPos = 0;
        let modalMove = false;
        document.addEventListener('touchstart', e => {
            if (this.state.showModal) {
                document.querySelector('.slds-modal__container').style['transition-duration'] = '0s';
                mouseDown = true;
                modalMove = false;
                startSwipeX = e.changedTouches[0].pageX;
                startSwipeY = e.changedTouches[0].pageY;
                startSwipeModalPos = parseInt(document.querySelector('.slds-modal__container').style.transform.substr(11)) || 0;
            }
        });
        document.addEventListener('touchmove', e => {        
            if (mouseDown && Math.abs(e.changedTouches[0].pageY-startSwipeY) < 100 && (modalMove || Math.abs(startSwipeModalPos - startSwipeX + e.changedTouches[0].pageX) > 50)) {
                modalMove = true;
                document.querySelector('.slds-modal__container').style.transform = `translateX(${startSwipeModalPos - startSwipeX + e.changedTouches[0].pageX}px)`;
            }
            if (Math.abs(e.changedTouches[0].pageY-startSwipeY) >= 100) {
                modalMove = false;
                document.querySelector('.slds-modal__container').style.transform = `translateX(0px)`;
            }
        });
        document.addEventListener('touchend', e => {
            if (mouseDown && modalMove) {
                document.querySelector('.slds-modal__container').style['transition-duration'] = '1s';
                mouseDown = false;
                if (startSwipeX - e.changedTouches[0].pageX < -125) {
                    this.closeClick();
                } else if (startSwipeX - e.changedTouches[0].pageX > 125) {
                    this.closeClick();
                } else {
                    document.querySelector('.slds-modal__container').style.transform = `translateX(0px)`;
                }
            };
        });
    }

    dateChange(date) {
        let d = new Date(date);
        if (this.state.view=="month") d.setDate(1);
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
        if (e.target.classList.contains('modal')) {
            this.closeClick();
        }
    }

    closeClick() {
        this.setState({
            showModal: false,
        });
    }

    changeView(view) {
        this.state.view = view;
        this.dateChange(this.state.curentDate);
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.state.showModal != nextState.showModal) return true;
        if (this.state.view != nextState.view) return true;
        //if (this.state.curentDate.toLocString() == nextState.curentDate.toLocString()) return false;
        return true;
    }

    render() {
        return (
            <div className="wrapper" onClick={(e)=>this.handleClick(e)} >                
                <div className="dateInput">
                    <ButtonGroup className="buttons">
                        <Button type="neutral" className={this.state.view == "month" ? "btn-active" : ""} onClick={()=>this.changeView('month')}>
                            month
                        </Button>                
                        <Button type="neutral" className={this.state.view == "week" ? "btn-active" : ""} onClick={()=>this.changeView('week')}>
                            week
                        </Button>
                    </ButtonGroup>
                    <ButtonGroup className="buttons">
                        <Button type="icon-border" icon="left" onClick={()=>{
                            let d = new Date(this.state.curentDate);
                            if (this.state.view == "month") {
                                d.setMonth(d.getMonth()-1);
                            } else {
                                d.setDate(d.getDate()-7);
                            }
                            this.dateChange(d)}
                        } />
                        <Button type="icon-border" icon="home" onClick={()=>this.dateChange(new Date())}/>
                        <Button type="icon-border" icon="right" onClick={()=>{
                            let d = new Date(this.state.curentDate);
                            if (this.state.view == "month") {
                                d.setMonth(d.getMonth()+1);
                            } else {
                                d.setDate(d.getDate()+7);
                            }
                            this.dateChange(d)}
                        } />
                    </ButtonGroup>
                    <DateInput readOnly className="dateLabel" value={this.state.curentDate.toLocString('string')} dateFormat="DD/MM/YYYY" onValueChange={(x)=>this.dateChange(x)} />
                </div>
                {
                    this.state.view == 'month' ?
                    <TableMonth trainers={this.props.trainers} events={this.props.events} date={this.state.date} curentDate={this.state.curentDate} handleClick={(e,ev)=>this.handleClick(e,ev)} /> :
                    <TableWeek trainers={this.props.trainers} events={this.props.events} date={this.state.date} curentDate={this.state.curentDate} handleClick={(e,ev)=>this.handleClick(e,ev)} />
                }                
                {
                    this.state.showModal ?
                    <MyModal closef={() => this.closeClick()} trainers={this.props.trainers} event={this.state.event} /> :
                    null
                }
            </div>
        )
    }
}
