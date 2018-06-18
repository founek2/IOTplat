import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './App.css';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import withRoot from './withRoot';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import DraftsIcon from '@material-ui/icons/Drafts';
import MenuIcon from '@material-ui/icons/Menu';
import BuildIcon from '@material-ui/icons/Build';
import CloudIcon from '@material-ui/icons/Cloud';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import Router, { browserHistory } from './components/router';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Snackbar from './components/Snackbar';
import { merge, assoc, filter, o, not, assocPath } from 'ramda';
import Api from './api';
import defaultState from './defaultState';
import Login from './components/login';

const isManageable = ({ manageable }) => manageable;
const notManageable = o(not, isManageable);

const styles = theme => ({
     root: {
          flexGrow: 1
     },
     flex: {
          flex: 1
     },
     menuButton: {
          marginLeft: -12,
          marginRight: 20
     }
});

class App extends Component {
     constructor(props){
		super(props)
		const jwt = localStorage.getItem('jwt');
		this.state = defaultState(jwt);
		if (jwt) Api.setJwt(jwt)
		Api.setHandleError(this.handleSnackbarOpen);
		this.initApp()
	}

     initApp = () => {
		Api.initState().then(json => {
               if (json) {
                    const { sensors, controlPanel } = this.state;
                    const { docs } = json;
                    const sensorsData = filter(notManageable, docs);
                    const newSensors = assoc('data', sensorsData, sensors);

                    const controlData = filter(isManageable, docs);
                    const newControlPanel = assoc('data', controlData, controlPanel);
                    this.setState(
                         {
                              sensors: newSensors,
                              controlPanel: newControlPanel
                         },
                         () => localStorage.setItem('state', JSON.stringify(this.state))
                    );
               }
          });
	}

     handleMenuOpen = () => {
          this.setState({
               menu: { open: !this.state.menu.open }
          });
     };
     handleSnackbarClose = () => {
          const snackbarState = this.state.snackbar;
          const newSnackState = merge(snackbarState, { open: false });
          this.setState({
               snackbar: newSnackState
          });
     };
     handleSnackbarOpen = e => {
          const snackbarState = this.state.snackbar;
          const newSnackState =
               typeof e.message === 'string'
                    ? merge(snackbarState, { open: true, message: e.message })
                    : merge(snackbarState, { open: true, message: 'Není připojení k internetu!' });
          console.log(e.message);
          this.setState({
               snackbar: newSnackState
          });
          return null;
     };
     clickMenuItem = order => {
          switch (order) {
               case 0:
                    browserHistory.push('/');
                    setTimeout(this.handleMenuOpen, 170);
                    break;
               case 1:
                    browserHistory.push('/controlPanel');
                    setTimeout(this.handleMenuOpen, 170);
                    break;
               default:
                    browserHistory.push('/');
                    setTimeout(this.handleMenuOpen, 170);
                    break;
          }
     };
     handleLoginOpen = () => {
          const { loginForm } = this.state;
          const newLoginForm = assoc('open', !loginForm.open, loginForm);
          this.setState({
               loginForm: newLoginForm
          });
     };
     handleFieldChange = prop => value => {
          const newLoginForm = assocPath(['fields', ...prop], value.target.value, this.state.loginForm);
          this.setState({
               loginForm: newLoginForm
          });
     };
     handleLogin = (userName, password) => () => {
          Api.login(userName, password).then(json => {
               if (json) {
                    const { jwt, level } = json;
                    const { loginForm } = this.state;
                    const newLoginForm = assoc('open', false, loginForm);
                    this.setState({
                         loginForm: newLoginForm,
                         user: {
						userName: userName,
						logIn: true,
						level
                         }
				});
				Api.setJwt(jwt);
				localStorage.setItem('jwt', jwt);
				localStorage.setItem('state', JSON.stringify(this.state))
               }
          });
     };
     render() {
          const { classes } = this.props;
          const { snackbar, controlPanel, sensors, user } = this.state;
          const fullList = (
               <div className={classes.fullList}>
                    <List component="nav" subheader={<ListSubheader component="div">Menu</ListSubheader>}>
                         <ListItem button onClick={() => this.clickMenuItem(0)}>
                              <ListItemIcon>
                                   <CloudIcon />
                              </ListItemIcon>
                              <ListItemText inset primary="Senzory" />
                         </ListItem>
                         <ListItem button onClick={() => this.clickMenuItem(1)}>
                              <ListItemIcon>
                                   <BuildIcon />
                              </ListItemIcon>
                              <ListItemText inset primary="Ovládácí panel" />
                         </ListItem>
                    </List>
                    <Divider />
                    <List>
                         <ListItem button>
                              <ListItemIcon>
                                   <DraftsIcon />
                              </ListItemIcon>
                              <ListItemText inset primary="Support" />
                         </ListItem>
                    </List>
               </div>
		);
		
          return (
               <div>
                    <AppBar position="static">
                         <Toolbar>
                              <IconButton
                                   className={classes.menuButton}
                                   color="inherit"
                                   aria-label="Menu"
                                   onClick={this.handleMenuOpen}
                              >
                                   <MenuIcon />
                              </IconButton>
                              <Typography variant="title" color="inherit" className={classes.flex}>
                                   IOT platforma
                              </Typography>
                              <Button color="inherit" onClick={this.handleLoginOpen}>
                                  {(user && user.logIn) ? user.userName : "LOGIN"}
                              </Button>
                         </Toolbar>
                    </AppBar>
                    <Drawer open={this.state.menu.open} onClose={this.handleMenuOpen}>
                         <div tabIndex={0} role="button">
                              {fullList}
                         </div>
                    </Drawer>
                    <Login
                         state={this.state.loginForm}
                         handleClose={this.handleLoginOpen}
                         handleLogin={this.handleLogin}
                    />
                    <Router sensorsState={sensors} controlPanelState={controlPanel} userLevel={user.level} />
                    <Snackbar
                         open={snackbar.open}
                         onClose={this.handleSnackbarClose}
                         hideDuration={snackbar.hideDuration}
                         message={snackbar.message}
                    />
               </div>
          );
     }
}

App.propTypes = {
     classes: PropTypes.object.isRequired
};

export default withRoot(withStyles(styles)(App));
