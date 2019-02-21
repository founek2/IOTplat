import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import onEnter from '../utils/onEnter';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import { assoc } from 'ramda';
import { withStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';

const styles = theme => ({
     actionSelect: {
          width: '100%'
     },
     formControl: {
          margin: theme.spacing.unit,
          minWidth: 120
     },
     dialogContent: {
          //maxWidth: 350
     }
});

class NotificationDialog extends Component {
     constructor(props) {
          super(props);
          this.state = {
               boundary: 0,
               action: 'below',
               interval: 10,
               sensor: ''
          };
     }

     handleChange = field => e => {
          this.setState(assoc(field, e.target.value, this.state));
     };
     confirm = () => {
          if (this.state.boundary !== '' && this.state.sensor !== '') this.props.handleConfirm(this.state);
     };
     removeNotification = () => {
          if (this.state.sensor !== '') this.props.handleRemoveNotification(this.state);
     };
     render() {
          const { open, handleClose, classes, sensors } = this.props;
          const { boundary, action, interval, sensor } = this.state;

          return (
               <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">Notifikace</DialogTitle>

                    <DialogContent className={classes.dialogContent}>
                         <FormControl className={classes.formControl}>
                              <InputLabel htmlFor="sensor-helper">Sensor</InputLabel>
                              <Select
                                   value={sensor}
                                   onChange={this.handleChange('sensor')}
                                   input={<Input name="age" id="sensor-helper" />}
                                   className={classes.actionSelect}
                              >
                                   <MenuItem value="">
                                        <em>None</em>
                                   </MenuItem>
                                   {sensors.map(name => (
                                        <MenuItem value={name} key={name}>
                                             {name}
                                        </MenuItem>
                                   ))}
                              </Select>
                         </FormControl>
                         <FormControl className={classes.formControl}>
                              <InputLabel htmlFor="age-helper">Akce</InputLabel>
                              <Select
                                   value={action}
                                   onChange={this.handleChange('action')}
                                   input={<Input name="age" id="age-helper" />}
                                   className={classes.actionSelect}
                              >
                                   <MenuItem value="below">Pod</MenuItem>
                                   <MenuItem value="over">Nad</MenuItem>
                              </Select>
                         </FormControl>

                         <FormControl className={classes.formControl}>
                              <InputLabel htmlFor="interval-helper">Interval</InputLabel>
                              <Select
                                   value={interval}
                                   onChange={this.handleChange('interval')}
                                   input={<Input name="age" id="interval-helper" />}
                                   className={classes.actionSelect}
                              >
                                   <MenuItem value={5}>5 min</MenuItem>
                                   <MenuItem value={10}>10 min</MenuItem>
                                   <MenuItem value={20}>20 min</MenuItem>
                              </Select>
                         </FormControl>
                         <FormControl className={classes.formControl}>
                              <TextField
                                   fullWidth
                                   margin="normal"
                                   label="hodnota"
                                   name="boundary"
                                   type="number"
                                   onChange={this.handleChange('boundary')}
                                   value={boundary}
                                   onKeyDown={onEnter(this.confirm)}
                              />
                         </FormControl>
                    </DialogContent>
                    <DialogActions>
                         <Button onClick={handleClose} color="primary">
                              Zrušit
                         </Button>
                         <Button onClick={this.removeNotification} color="primary">
                              Odhlásit
                         </Button>
                         <Button onClick={this.confirm} color="primary">
                              Potvrdit
                         </Button>
                    </DialogActions>
               </Dialog>
          );
     }
}

export default withStyles(styles)(NotificationDialog);
