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
      currentConig: ''
    }
  }

  componentDidMount() {
    if (this.state.active) {
      ipcRenderer.send(channels.ACTIVE_REDSOCKS);
    }
    ipcRenderer.send(channels.READ_FILES);
    ipcRenderer.on(channels.READ_FILES, (event, arg) => {
      ipcRenderer.removeAllListeners(channels.READ_FILES);
      const { files, currentConfig } = arg;
      this.setState({ files, currentConfig });
    });
  }

  updateConfig = (fileName) => {
    this.setState({
      currentConfig: fileName
    });
    ipcRenderer.send(channels.CHANGE_REDSOCKS_CONFIG, [fileName,this.state.active]);
  }

  toogleActive = () => {
    this.setState({ active: !this.state.active }, () => {
      if (this.state.active) {
        ipcRenderer.send(channels.ACTIVE_REDSOCKS);
      } else {
        ipcRenderer.send(channels.STOP_REDSOCKS);
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

  render() {
    return (
      <div>
        <SideBar size={30} toogleSide={this.setOpenPanel} isOpen={this.state.openPanel} />
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
