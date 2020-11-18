import './side-bar.scss';
import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { Form } from 'react-bootstrap';

class SideBar extends Component {

    constructor() {
        super();
        this.state = {
            runOnStart: false,
            tryIcon: false,
            saveCredentials: false,
            user: '',
            password: ''
        }
    }
    closeSide = () => {
        this.props.toogleSide()
    }

    toggleConfig = (target, value) => {
        this.setState({
            [target]: !value
        });
        if (target === 'saveCredentials' && value === false) {
            this.setState({
                user: '',
                password: ''
            })
        }
    }

    render() {
        if (this.props.isOpen) {
            document.documentElement.style.overflow = 'hidden';
        } else {
            document.documentElement.style.overflow = 'auto';
        }

        return (
            <div>
                {this.props.isOpen &&
                    <div
                        style={{
                            position: 'absolute',
                            zIndex: '2',
                            height: '100%',
                            width: '100%',
                            background: 'black',
                            opacity: '50%'
                        }}
                        onClick={this.closeSide} />}
                <div className='side-bar'
                    style={{
                        transform: this.props.isOpen ? 'translate(0%)' : 'translate(-100%)',
                        width: this.props.size + '%',
                        height: '100%',
                        position: 'absolute',
                        zIndex: '3',
                        background: '#332f3b'
                    }}>
                    <div className='container'>
                        <div className='row'>
                            <div className='col-12 d-flex align-items-end flex-column-reverse'>
                                <FontAwesomeIcon className='mb-2 mt-2 ml-2 close-button'
                                    icon={faTimes}
                                    onClick={this.closeSide}
                                    color='white'
                                    size='lg'
                                    cursor='pointer'
                                />
                            </div>
                            <div className='col-12 pt-5'>
                                <Form.Switch label='Run on Start' id='runOnStart' checked={this.state.runOnStart}
                                    onChange={(e) => { this.toggleConfig(e.target.id, this.state[e.target.id]) }}
                                    style={{ color: 'white' }} />
                            </div>
                            <div className='col-12 pt-3'>
                                <Form.Switch label='Try icon' id='tryIcon' checked={this.state.tryIcon}
                                    onChange={(e) => { this.toggleConfig(e.target.id, this.state[e.target.id]) }}
                                    style={{ color: 'white' }} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default SideBar;