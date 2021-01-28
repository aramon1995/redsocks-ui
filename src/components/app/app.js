import './app.scss';
import React, { Component } from 'react';
import ConfigCard from './config-card';
import SideBar from './side-bar';
import { Route } from 'react-router-dom';
import { Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import ConfigFileEditor from '../config-file-editor';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog } from '@fortawesome/free-solid-svg-icons';
import { channels } from '../../shared/constant';
const { ipcRenderer } = window;

class App extends Component {

  constructor() {
    super()
    this.state = {
      files: [],
      openPanel: false,
      active: true,
      currentConfig: '',
      password: ''
    }
  }


  componentDidMount() {
    ipcRenderer.on(channels.UPDATE_ACTIVE,(event,arg)=>{
      this.setState({active:arg})
    })
    ipcRenderer.on(channels.UPDATE_CURRENT_CONFIG,(event,arg)=>{
      this.setState({currentConfig:arg,active:true})
    })
    ipcRenderer.send(channels.LOAD_INITIAL_STATE);
    ipcRenderer.on(channels.LOAD_INITIAL_STATE, (event, arg)=>{
      ipcRenderer.removeAllListeners(channels.LOAD_INITIAL_STATE)
      const {password, active, currentConfig} = arg;
      this.setState({password,active,currentConfig})
      if (active) { 
        ipcRenderer.send(channels.ACTIVE_REDSOCKS, password);
      }
    })
    ipcRenderer.send(channels.READ_FILES);
    ipcRenderer.on(channels.READ_FILES, (event, arg) => {
      ipcRenderer.removeAllListeners(channels.READ_FILES);
      const {files} = arg;
      this.setState({files});
    });
  }

  updateConfig = (fileName) => {
    this.setState({
      currentConfig: fileName
    });
    ipcRenderer.send(channels.CHANGE_REDSOCKS_CONFIG, [fileName, this.state.active, this.state.password]);
  }

  toogleActive = () => {
    ipcRenderer.send(channels.UPDATE_APP_CONFIG, ['active',!this.state.active]);
    this.setState({ active: !this.state.active }, () => {
      if (this.state.active) {
        ipcRenderer.send(channels.ACTIVE_REDSOCKS, this.state.password);
      } else {
        ipcRenderer.send(channels.STOP_REDSOCKS, this.state.password);
      }
    });
  }

  update = (index, data) => {
    var change = this.state.files;
    change[index] = data;
    this.setState({
      files: change
    });
  }

  setOpenPanel = () => {
    this.setState({ openPanel: !this.state.openPanel });
  }

  savePassword = (newPassword) => {
    this.setState({
      password: newPassword
    })
  }

  render() {
    return (
      <div>
        <SideBar size={30} toogleSide={this.setOpenPanel} isOpen={this.state.openPanel} password = {this.state.password} changePassword={this.savePassword} />
        <div className="App">
          <header className="App-header">
            <div className='container-fluid'>
              <div className='row'>
                <div className='col-auto'>
                  <h1>Redsocks Config Editor</h1>
                </div>
                <div className='col d-flex align-items-center flex-row-reverse' style={{ fontSize: '1.5rem' }}>
                  <FontAwesomeIcon className='mb-2 mt-2 ml-2'
                    icon={faCog}
                    onClick={this.setOpenPanel}
                  />
                </div>
              </div>
            </div>
          </header>

          <Route exact path='/'>
            <Form.Switch label='Active redsocks' id='custom-switch' checked={this.state.active} onChange={this.toogleActive} />
            {this.state.files.map((val) => (
              <ConfigCard key={val['fileName']} content={val} current={this.state.currentConfig} update={this.updateConfig} />
            ))}
          </Route>
          {this.state.files.map((val, index) => (
            <Route key={val['fileName']} path={'/config_' + val['fileName']}>
              <ConfigFileEditor content={val} update={this.update} index={index} />
            </Route>
          ))}
        </div>
      </div>
    );
  }
}

export default App;
