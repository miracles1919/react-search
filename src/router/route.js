import React, { Component } from 'react'
import { Router, Route, Redirect, IndexRoute, browserHistory, hashHistory } from 'react-router'

import Header from '../component/Layout/Header'

const Login = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('../component/login').default)
  }, 'login')
}

const BeiLib = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('../container/beiLib').default)
  }, 'beiLib')
}

const TalLib = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('../container/talLib').default)
  }, 'talLib')
}

const Talent = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('../container/beiLib/talentJournal').default)
  }, 'talentJournal')
}

const HawkEye = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('../container/beiLib/hawkEye/index').default)
  }, 'hawkeye')
}

const RouteConfig = (
  <Router history={hashHistory}>
    <Route path="/" component={Header}>
      <Route path="login" getComponent={Login} />
      <Route path="beiLib" getComponent={BeiLib}>
        <IndexRoute component={require('../container/beiLib/recommend').default} />
        <Route path="talent" getComponent={Talent} />
        <Route path="hawkeye" getComponent={HawkEye} />
      </Route>
      <Route path="talLib" getComponent={TalLib} />

    </Route>

    <Redirect from="*" to="/" />
  </Router>
)

export default RouteConfig
