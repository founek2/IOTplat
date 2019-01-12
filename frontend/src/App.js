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
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListSubheader from '@material-ui/core/ListSubheader';
import Router from './components/router';
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
     constructor(props) {
          super(props);
          const jwt = localStorage.getItem('jwt');
          this.state = defaultState(jwt);
          if (jwt) Api.setJwt(jwt);
          Api.setHandleError(this.handleSnackbarOpen);
          Api.setLogOut(this.logOut);
	}
	componentDidMount(){
          this.initApp();
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
                         this.saveState
                    );
               }
          });
     };

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
          //console.log(e.message);
          this.setState({
               snackbar: newSnackState
          });
          return null;
     };
     clickMenuItem = order => {
          switch (order) {
               case 0:
                    setTimeout(this.handleMenuOpen, 170);
                    this.setState({ route: '/' });
                    break;
               case 1:
                    setTimeout(this.handleMenuOpen, 170);
                    this.setState({ route: '/controlPanel' });
                    break;
               default:
                    setTimeout(this.handleMenuOpen, 170);
                    this.setState({ route: '/' });
                    break;
          }
          setTimeout(this.saveState, 300); // to save after menu closed
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
     handleLogin = (userName, password, cleanInputs) => {
          if (userName.length > 2) {
               if (password.length > 2) {
                    Api.login(userName, password).then(json => {
                         if (json) {
						cleanInputs();
                              const { jwt, level } = json;
                              const { loginForm } = this.state;
                              const newLoginForm = assoc('open', false, loginForm);
                              this.setState(
                                   {
                                        loginForm: newLoginForm,
                                        user: {
                                             userName: userName,
                                             logIn: true,
                                             level
                                        }
                                   },
                                   this.saveState
                              );
                              Api.setJwt(jwt);
                              localStorage.setItem('jwt', jwt);
                         }
                    });
               } else {
                    this.handleSnackbarOpen(new Error('Minimální délka hesla je 3'));
               }
          } else {
               this.handleSnackbarOpen(new Error('Minimální délka jména je 3'));
          }
     };
     closeUserMenu = () => {
          this.setState({
               userMenu: { open: false }
          });
     };
     openUserMenu = () => {
          this.setState({
               userMenu: { open: true }
          });
     };
     handleUserMenuItem = order => {
          this.closeUserMenu();
          switch (order) {
               case 0: // setting
                    break;
               case 1: // Account
                    break;
               case 2: // logOut
                    this.logOut();
                    break;
               default:
                    break;
          }
     };
     logOut = () => {
          localStorage.removeItem('jwt');
          localStorage.removeItem('state');
          Api.setJwt(null);
          const { user } = this.state;
          const newUser = assoc('logIn', false, user);
          this.setState({
               user: newUser
          });
     };
     handleSimpleMode = _id => {
          if (this.state.simpleMode === _id) {
               this.setState(
                    {
                         simpleMode: false
                    },
                    this.saveState
               );
          } else {
               this.setState(
                    {
                         simpleMode: _id
                    },
                    this.saveState
               );
          }
     };
     saveState = () => {
          localStorage.setItem('state', JSON.stringify(this.state));
     };
     render() {
          const { classes } = this.props;
          const { snackbar, controlPanel, sensors, user, userMenu } = this.state;
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
                              <div>
                                   <Button color="inherit" onClick={user.logIn ? this.openUserMenu : this.handleLoginOpen}>
                                        {user.logIn ? user.userName : 'LOGIN'}
                                   </Button>
                                   <Menu
                                        open={userMenu.open}
                                        anchorOrigin={{
                                             vertical: 'top',
                                             horizontal: 'right'
                                        }}
                                        transformOrigin={{
                                             vertical: 'top',
                                             horizontal: 'right'
                                        }}
                                        onClose={this.closeUserMenu}
                                   >
                                        <MenuItem onClick={() => this.handleUserMenuItem(0)}>nastavení</MenuItem>
                                        <MenuItem onClick={() => this.handleUserMenuItem(1)}>Účet</MenuItem>
                                        <MenuItem onClick={() => this.handleUserMenuItem(2)}>Odhlásit</MenuItem>
                                   </Menu>
                              </div>
                         </Toolbar>
                    </AppBar>
                    <Drawer open={this.state.menu.open} onClose={this.handleMenuOpen}>
                         <div tabIndex={0} role="button">
                              {fullList}
                         </div>
                    </Drawer>
                    <Login state={this.state.loginForm} handleClose={this.handleLoginOpen} handleLogin={this.handleLogin} />
                    <Router
                         sensorsState={sensors}
                         controlPanelState={{ ...controlPanel, simpleMode: this.state.simpleMode }}
                         userLevel={user.level}
                         actualRoute={this.state.route}
                         handleSimpleMode={this.handleSimpleMode}
                    />
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
