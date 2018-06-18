import React from "react";
import { Router, Route, Switch } from "react-router-dom";
import Sensors from './Sensors';
import ControlPanel from './ControlPanel';
import { createBrowserHistory } from 'history';

const PropsRoute = ({ component, ...rest }) => {
	const Component = component;
	return (
		 <Route
			  {...rest}
			  render={routeProps => {
				   return <Component {...rest} />;
			  }}
		 />
	);
};

const browserHistory = createBrowserHistory();
function router({sensorsState, controlPanelState, userLevel}) {
      return (
            <Router history={browserHistory}>
                  <Switch>
                        <PropsRoute path="/controlPanel" component={ControlPanel} state={controlPanelState} userLevel={userLevel} />
                        <PropsRoute path="/" component={Sensors} state={sensorsState} userLevel={userLevel}/>
                  </Switch>
            </Router>
      );
}

export { browserHistory };
export default router;