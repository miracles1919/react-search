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

const Talent = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('../container/beiLib/talent').default)
  }, 'talent')
}

const TalenFollowUp = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('../container/talenFollowUp').default)
  }, 'talenFollowUp')
}
const JobMana = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('../container/myTalents/jobMana').default)
  }, 'jobMana')
}
const Mytalents = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('../container/myTalents').default)
  }, 'myTalents')
}
const TalenFollow = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('../container/myTalents/talenFollow').default)
  }, 'talenFollow')
}
const UploadResume = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('../container/myTalents/uploadResume').default)
  }, 'uploadResume')
}

const HawkEye = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('../container/beiLib/hawkEye/index').default)
  }, 'hawkeye')
}

const MyResumeList = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('../container/myTalents/chengpin/index').default)
  }, 'myresumelist')
}
const RouteConfig = (
  <Router history={hashHistory}>
    <Route path="/" component={Header}>
      <Route path="login" getComponent={Login} />
      <Route path="talenFollowUp" getComponent={TalenFollowUp} />
      <Route path="myTalents" getComponent={Mytalents} >
        <IndexRoute component={require('../container/myTalents/chengpin').default} />
        <Route path="talenFollow" getComponent={TalenFollow} />
        <Route path="jobMana" getComponent={JobMana} />
        <Route path="myresumelist" getComponent={MyResumeList} />
        <Route path="uploadResume" getComponent={UploadResume} />
      </Route>
      <Route path="beiLib" getComponent={BeiLib}>
        <IndexRoute component={require('../container/beiLib/recommend').default} />
        <Route path="talent" getComponent={Talent} />
        <Route path="hawkeye" getComponent={HawkEye} />
      </Route>

    </Route>

    <Redirect from="*" to="/" />
  </Router>
)

export default RouteConfig
