import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { assocPath } from 'ramda';
import onEnter from '../utils/onEnter'

class FormDialog extends Component {
     state = {
          fields: {
               userName: {
                    value: '',
                    errorMessage: ''
               },
               password: {
                    value: '',
                    errorMessage: ''
               }
          }
     };
     handleFieldChange = path => value => {
          const newFields = assocPath([...path], value.target.value, this.state.fields);
          this.setState({
               fields: newFields
          });
	};
	cleanFields = () => {
		this.setState({
			fields: {
				userName: {
					value: '',
					errorMessage: ''
				},
				password: {
					value: '',
					errorMessage: ''
				}
			}
		})
	}
     render() {
          const { state, handleClose, handleLogin } = this.props;
          const { userName, password } = this.state.fields;
          const { open } = state;
          const handleUserChange = this.handleFieldChange(['userName', 'value']);
          const handlePasswordChange = this.handleFieldChange(['password', 'value']);

          const logIn = () => {
				handleLogin(userName.value, password.value, this.cleanFields);
          };
          return (
               <div>
                    <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                         <DialogTitle id="form-dialog-title">Přihlášení</DialogTitle>
                         <DialogContent>
                              <TextField
                                   autoFocus
                                   margin="normal"
                                   label="Uživatelské jméno"
                                   name="userName"
                                   type="text"
                                   onChange={handleUserChange}
                                   fullWidth
                                   value={userName.value}
                                   onKeyDown={onEnter(logIn)}
                              />
                              <TextField
                                   margin="dense"
                                   label="Heslo"
                                   type="password"
                                   name="password"
                                   onChange={handlePasswordChange}
                                   fullWidth
                                   value={password.value}
                                   onKeyDown={onEnter(logIn)}
                              />
                         </DialogContent>
                         <DialogActions>
                              <Button onClick={handleClose} color="primary">
                                   Zrušit
                              </Button>
                              <Button onClick={logIn} color="primary">
                                   Přihlásit
                              </Button>
                         </DialogActions>
                    </Dialog>
               </div>
          );
     }
}

export default FormDialog;
