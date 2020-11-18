import './config-advanced.scss';
import React, { Component } from 'react';
import { parseRedsocksConfig } from '../../../shared/read_write_redsocks_config'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Form } from 'react-bootstrap';

class ConfigAdvanced extends Component {

    changeSize(text) {
        return text.split('\n').length + 1;
    }
    handleChange(value) {
        const data = parseRedsocksConfig(this.props.fileName, value)
        this.props.change(data)
    }

    render() {
        return (
            <Form>
                <Form.Control as='textarea' defaultValue={this.props.content}
                    rows={this.changeSize(this.props.content)}
                    onChange={(e) => {
                        this.handleChange(e.target.value)
                        e.target.rows = this.changeSize(e.target.value);
                    }} />
            </Form>
        );
    }
}

export default ConfigAdvanced;