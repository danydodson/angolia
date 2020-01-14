import React, { Component } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'

import { loginUser } from '../../actions/auth'

import {
  LOGIN,
  LOGIN_PAGE_UNLOADED,
  UPDATE_FIELD_AUTH
} from '../../actions/types'

const Form = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;`

const Input = styled.input`
  padding: 1.5rem 1rem;
  margin-top: 2rem;
  border: 1px solid #cccccc;
  border-radius: 3px;`

const Submit = styled.button`
  margin-top: 2rem;`

const mapStateToProps = state => ({
  ...state._auth,
  auth: state._auth,
  errors: state._errors
})

const mapDispatchToProps = dispatch => ({
  onChangeEmail: value =>
    dispatch({ type: UPDATE_FIELD_AUTH, key: 'email', value }),
  onChangePassword: value =>
    dispatch({ type: UPDATE_FIELD_AUTH, key: 'password', value }),
  onSubmit: (userData) =>
    dispatch({ type: LOGIN, payload: loginUser(userData) }),
  onUnload: () =>
    dispatch({ type: LOGIN_PAGE_UNLOADED })
})


class Login extends Component {
  constructor() {
    super()
    this.changeEmail = e => this.props.onChangeEmail(e.target.value)
    this.changePassword = e => this.props.onChangePassword(e.target.value)
    this.submitForm = (email, password) => e => {
      e.preventDefault()
      const userData = { email: email, password: password }
      console.log(userData)
      this.props.onSubmit(userData)
    }
  }

  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      this.props.history.push('/profiles')
    }
  }

  componentWillUnmount() {
    this.props.onUnload()
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.auth.isAuthenticated) {
      this.props.history.goBack()
    }
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors })
    }
  }


  // onSubmit(e) {
  //   e.preventDefault()
  //   const userData = {
  //     email: this.state.email,
  //     password: this.state.password
  //   }
  //   this.props.loginUser(userData)
  // }

  render() {
    const email = this.props.email
    const password = this.props.password

    const content = (
      <Form onSubmit={this.submitForm(email, password)}>
        <Input
          type='email'
          name='email'
          value={email}
          onChange={this.changeEmail}
          placeholder='Email' />
        <Input
          type='password'
          name='password'
          value={password}
          onChange={this.changePassword}
          placeholder='Password' />
        <Submit type='submit'>Submit</Submit>
      </Form>
    )
    return content
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)
