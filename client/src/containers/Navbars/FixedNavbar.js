import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import styled from 'styled-components'

const Nav = styled.nav`
  height: 50px;
  display: flex;
  border-bottom: 1px solid #e0e0e0;`

const NavLink = styled(Link)`
  color: #333333;
  font-family: 'Lexend Deca', sans-serif;
  text-decoration: none;
  &:hover { color: #9cc19f; }`

const mapStateToProps = state => ({})

// const mapDispatchToProps = dispatch => ({
//   onClickLogout: () => dispatch({ type: LOGOUT }),
//   onUnload: () => dispatch({ type: SETTINGS_PAGE_UNLOADED })
// })

class FixedNavbar extends Component {
  render() {
    return (
      <Nav>

        <NavLink to="/">
          <i className="ion-home"></i>
          &nbsp; landing &nbsp; &nbsp; &nbsp;
        </NavLink>

        <NavLink to='/register'>
          <i className="ion-person-add"></i>
          &nbsp; Register &nbsp; &nbsp; &nbsp;
        </NavLink>

        <NavLink to='/login'>
          <i className="ion-log-in"></i>
          &nbsp; Sign in &nbsp; &nbsp; &nbsp;
        </NavLink>

      </Nav>
    )
  }
}

export default connect(mapStateToProps, {})(FixedNavbar)
