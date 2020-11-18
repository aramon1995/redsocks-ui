import './config-basic.scss';
import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Col, Form } from 'react-bootstrap';
import { writeFile } from '../../../shared/read_write_redsocks_config';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-regular-svg-icons';

class ConfigBasic extends Component {

    constructor() {
        super()
        this.state = {
            visibility: 'password'
        }

    }

    changeVisibility = () => {
        if (this.state.visibility === 'password') {
            this.setState({ visibility: 'input' })
        } else {
            this.setState({ visibility: 'password' })
        }
    }

    handleChange(ta, id, section) {
        var data = this.props.data;
        data.content = writeFile(this.props.data.content, { section: section, target: id, value: ta.value });
        data[id] = ta.value;
        this.props.change(data)
        console.log(id)
        console.log(data)
    }

    render() {
        const formModel = [
            { label: 'User', placeholder: 'User name', id: 'user', section: 'base' },
            { label: 'Group', placeholder: 'Group name', id: 'group', section: 'base' },
            { label: 'Local ip', placeholder: 'ip to redirect connection', id: 'local_ip', section: 'redsocks' },
            { label: 'Local port', placeholder: 'port to redirect connection', id: 'local_port', section: 'redsocks' },
            { label: 'ip', placeholder: 'Proxy server ip', id: 'ip', section: 'redsocks' },
            { label: 'port', placeholder: 'Proxy server port', id: 'port', section: 'redsocks' },
            { label: 'Login', placeholder: 'User name for proxy server', id: 'login', section: 'redsocks' },
            { label: 'Password', placeholder: 'User password for proxy server', id: 'password', type: 'password', section: 'redsocks' },

        ]

        return (
            <Form>
                <Form.Row>
                    {formModel.map((data) => (
                        <Col md={6} key={data.id}>
                            <Form.Group controlId={data.id}>
                                <Form.Row>
                                    <Col sm={3} className='d-flex align-items-center flex-row-reverse'>
                                        <Form.Label className='mb-0'>
                                            {data.label}
                                        </Form.Label>
                                    </Col>
                                    <Col>
                                        <Form.Control
                                            defaultValue={this.props.data[data.id]}
                                            placeholder={data.placeholder}
                                            type={'type' in data ? data.type === 'password' ? this.state.visibility : data.type : 'input'}
                                            onChange={(e) => { this.handleChange(e.target, data.id, data.section) }} />
                                        {data.id === 'password' &&
                                            <FontAwesomeIcon className='float-right' icon={this.state.visibility==='password'?faEyeSlash:faEye}
                                                style={{
                                                    height:'100%',
                                                    position: 'absolute',
                                                    left: 'auto',
                                                    right: '10px',
                                                    top:'0',
                                                    color:'darkgray'
                                                }}
                                                onMouseOver={(e) => {this.changeVisibility() }}
                                                onMouseOut={(e) => {this.changeVisibility() }} />
                                        }
                                    </Col>
                                </Form.Row>
                            </Form.Group>
                        </Col>
                    ))}
                </Form.Row>
            </Form >
        );
    }
}

export default ConfigBasic;