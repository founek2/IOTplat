import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import {assocPath} from 'ramda';

class FormDialog extends Component {
	state = {fields: {
		"userName": {
			value: "",
			errorMessage: "",
		},
		"password": {
			value: "",
			errorMessage: "",
		},
	}}
	handleFieldChange = path => value => {
          const newFields = assocPath([...path], value.target.value, this.state.fields);
          this.setState({
               fields: newFields
          });
     };
     render() {
		const { state, handleClose, handleLogin } = this.props;
		const {userName, password} = this.state.fields;
          const { open } = state;
          const handleUseChange = this.handleFieldChange(['userName', 'value']);
          const handlePasswordChange = this.handleFieldChange(['password', 'value']);
          return (
               <div>
                    <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                         <DialogTitle id="form-dialog-title">Subscribe</DialogTitle>
                         <DialogContent>
                              <DialogContentText>Zadejte svoje přihlašovací údaje.</DialogContentText>
                              <TextField
                                   autoFocus
                                   margin="normal"
                                   label="Uživatelské jméno"
                                   name="userName"
                                   type="text"
                                   onChange={handleUseChange}
							fullWidth
							value={userName.value}
                              />
                              <TextField
                                   margin="dense"
                                   label="Heslo"
                                   type="password"
                                   name="password"
                                   onChange={handlePasswordChange}
							fullWidth
							value={password.value}
                              />
                         </DialogContent>
                         <DialogActions>
                              <Button onClick={handleClose} color="primary">
                                   Zrušit
                              </Button>
                              <Button onClick={handleLogin(userName.value, password.value)} color="primary">
                                   Přihlásit
                              </Button>
                         </DialogActions>
                    </Dialog>
               </div>
          );
     }
}

export default FormDialog;
