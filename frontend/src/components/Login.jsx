import React, { Component } from 'react';
import { Redirect, withRouter } from 'react-router-dom';
import { PropTypes } from 'prop-types';
import ExitToApp from '@material-ui/icons/ExitToApp';
import Person from '@material-ui/icons/Person';
import Lock from '@material-ui/icons/Lock';
import CircularProgress from '@material-ui/core/CircularProgress';
import 'react-toastify/dist/ReactToastify.css';
// eslint-disable-next-line object-curly-newline
import { Button, Container, Form, FormGroup, Input } from 'reactstrap';

import AuthService from '../utils/AuthService';
import './Login.css';
import windowsLogo from '../imgs/windows.png';

class Login extends Component {
  static propTypes = {
    loggedIn: PropTypes.bool.isRequired,
    setLoggedIn: PropTypes.func.isRequired,
    displayToast: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      loading: false,
    };

    this.onSubmit = this.onSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    // TODO: Pass in a configurable API URL
    this.authService = new AuthService();
  }

  onSubmit(e) {
    e.preventDefault();
    this.setState({ loading: true });

    this.authService
      .login(this.state.username, this.state.password)
      .then(() => {
        this.props.setLoggedIn(true);
      })
      .catch(error => {
        this.setState({ password: '', loading: false });
        this.props.displayToast('error', error.message);
      });
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  render() {
    const { from } = this.props.location.state || { from: { pathname: '/' } };
    if (this.props.loggedIn === true) {
      return <Redirect to={from} />;
    }

    return (
      <Container>
        <div className="login-form-wrapper">
          <img className="login-logo" src={windowsLogo} alt="Microsoft Active Directory" />
          <h6 className="form-header">Login with your Windows credentials</h6>
          <Form onSubmit={this.onSubmit} className="login-form">
            <FormGroup>
              <Person className="input-icon" />
              <Input
                onChange={this.handleChange}
                value={this.state.username}
                className="login-input"
                name="username"
                required
                placeholder="Username"
              />
            </FormGroup>
            <FormGroup>
              <Lock className="input-icon" />
              <Input
                onChange={this.handleChange}
                value={this.state.password}
                className="login-input"
                type="password"
                name="password"
                required
                placeholder="Password"
              />
            </FormGroup>
            <FormGroup>
              <Button disabled={this.state.loading} className="login-btn">
                {this.state.loading ? (
                  <CircularProgress className="btn-icon" size="20px" />
                ) : (
                  <ExitToApp className="btn-icon" />
                )}
                Login
              </Button>
            </FormGroup>
          </Form>
        </div>
      </Container>
    );
  }
}

export default withRouter(Login);
