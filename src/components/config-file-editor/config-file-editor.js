import './config-file-editor.scss';
import ConfigAdvanced from './config-advanced';
import ConfigBasic from './config-basic';
import { saveFile } from '../../shared/read_write_redsocks_config'
import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToggleButtonGroup, ToggleButton, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { Link, Route, Redirect, withRouter } from 'react-router-dom';

class ConfigFileEditor extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data:{...this.props.content}
            , unsavedChanges: false
        };
        console.log(this.state)
    }

    handleChange = (change) => {        
        this.setState({
            data:change,
            unsavedChanges: true
        });

    }

    saveChanges = () => {
        saveFile(this.state.data.content, this.state.data.fileName);
        this.setState({unsavedChanges:false});
        this.props.update(this.props.index,this.state.data);
    }

    render() {
        return (
            <div className='container-fluid'>
                <div className='row'>
                    <div className='col-4 pb-5'>
                        <Link to='/'>
                            <FontAwesomeIcon icon={faArrowLeft} />
                        </Link>
                    </div>
                    <div className='col-4'>
                        <ToggleButtonGroup name='editType' defaultValue={1} type='radio'>
                            <ToggleButton value={1} onClick={() => { this.props.history.push('/config_' + this.state.data.fileName + '/basic') }}>
                                Basic
                            </ToggleButton>
                            <ToggleButton value={2} onClick={() => { this.props.history.push('/config_' + this.state.data.fileName + '/advanced') }}>
                                Advanced
                            </ToggleButton>
                        </ToggleButtonGroup>
                    </div>
                    <div className='col-4'>
                        <Button onClick={this.saveChanges}>Save</Button>
                        {this.state.unsavedChanges &&
                            <p>There are changes without save</p>}
                    </div>
                </div>
                <Route path={'/config_' + this.state.data.fileName + '/advanced'}>
                    <ConfigAdvanced content={this.state.data.content} fileName={this.state.data.fileName} change={this.handleChange} />
                </Route>
                <Route path={'/config_' + this.state.data.fileName + '/basic'}>
                    <ConfigBasic data={this.state.data} change={this.handleChange} />
                </Route>
                <Redirect from={'/config_' + this.state.data.fileName} to={'/config_' + this.state.data.fileName + '/basic'} />
            </div>
        );
    }
}

export default withRouter(ConfigFileEditor);