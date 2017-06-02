import React from 'react';
import { render } from 'react-dom';
import { Spinner, util } from 'react-lightning-design-system';

import App from './components/App';

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

fetch('http://128.199.53.150/events').catch((err) => localData())
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
    }).catch((err) => console.log(err));
