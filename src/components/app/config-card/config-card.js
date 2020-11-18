import './config-card.scss';
import React, { Component } from 'react';
import { Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt, faCheckCircle } from '@fortawesome/free-regular-svg-icons';
import { Link } from 'react-router-dom';

class ConfigCard extends Component {

  render() {
    return (
      <Card className='card' bg='secondary' border='primary'>
        <Card.Header>
          {this.props.content['fileName']}
          <FontAwesomeIcon className='float-right ml-2'
            icon={faCheckCircle}
            style={{ color: this.props.current === this.props.content.fileName ? 'lightgreen' : 'white' }}
            onClick={()=>{this.props.update(this.props.content.fileName)}}
          />
        </Card.Header>
        <Card.Body>
          <div className='container'>
            <div className='row'>
              <div className='col-6'>
                <p>{this.props.content['user']}</p>
              </div>
              <div className='col-6'>
                <p>{this.props.content['group']}</p>
              </div>
            </div>
            <div className='row'>
              <div className='col-6'>
                <p>{this.props.content['local_ip']}</p>
              </div>
              <div className='col-6'>
                <p>{this.props.content['local_port']}</p>
              </div>
            </div>
            <div className='row'>
              <div className='col-6'>
                <p>{this.props.content['ip']}</p>
              </div>
              <div className='col-6'>
                <p>{this.props.content['port']}</p>
              </div>
            </div>
            {this.props.content['login'] !== null &&
              <div className='row'>
                <div className='col-6'>
                  <p>{this.props.content['login']}</p>
                </div>
                <div className='col-6'>
                  <p>{this.props.content['password']}</p>
                </div>
              </div>
            }
          </div>
        </Card.Body>
        <Card.Footer>
          <FontAwesomeIcon className='float-right ml-2' icon={faTrashAlt} />
          <Link to={'/config_' + this.props.content.fileName}>
            <FontAwesomeIcon className='float-right' icon={faEdit} />
          </Link>
        </Card.Footer>
      </Card>
    );
  }
}

export default ConfigCard;