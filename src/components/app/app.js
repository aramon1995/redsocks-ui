import './app.scss';
import React, { Component } from 'react';
import ConfigCard from './config-card';
import SideBar from './side-bar';
import { readFiles } from '../../shared/read_write_redsocks_config';
import { Route } from 'react-router-dom';
import { Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import ConfigFileEditor from '../config-file-editor';
import { changeRedsocksConfig, stopRedsocks, activeRedsocks } from '../../shared/active_redsocks_config';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog } from '@fortawesome/free-solid-svg-icons';

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
      activeRedsocks((error) => { console.log(error) });
    }
    readFiles('/home/alejandrorh/.redsocksui/configFiles/', (content) => {
      this.setState({
        files: content,
        currentConfig: content[0].fileName
      })
    });
  }

  updateConfig = (fileName) => {
    this.setState({
      currentConfig: fileName
    });
    changeRedsocksConfig(fileName, this.state.active, () => { console.log('error') });
  }

  toogleActive = () => {
    this.setState({ active: !this.state.active }, () => {
      if (this.state.active) {
        activeRedsocks((error) => { console.log(error) })
      } else {
        stopRedsocks((error) => { console.log('error stopeeando ' + error) })
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
    this.setState({openPanel:!this.state.openPanel});
}

render() {
  return (
    <div>
      <SideBar size={30} toogleSide={this.setOpenPanel} isOpen={this.state.openPanel}/>
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
