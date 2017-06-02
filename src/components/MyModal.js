import React from 'react';
import { render } from 'react-dom';
import { Button, Modal, ModalHeader, ModalContent, ModalFooter } from 'react-lightning-design-system';

import MyModalBody from './MyModalBody';

export default class MyModal extends React.Component {
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
