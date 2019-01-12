import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import { update, toPairs } from 'ramda';
import indexedMap from '../utils/indexedMap';
import Api from '../api';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

const styles = theme => ({
     root: {
          width: '100%'
     },
     heading: {
          fontSize: theme.typography.pxToRem(17)
     },
     details: {
          alignItems: 'center'
     },
     column: {
          flexBasis: '50%'
     },
     helper: {
          borderLeft: `2px solid ${theme.palette.divider}`,
          padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`
     },
     offButton: {
          color: 'rgba(0, 0, 0, 0.54)'
     },
     simple: {
          position: 'absolute',
          // right: '0px',
          top: '35px',
          right: '-8px'
     }
});
function createDetails(classes, buttonsState, handleButtonClick) {
     return (arr, index) => {
          const key = arr[0];
          const data = arr[1];
          if (data.hidden) return null;
          const description = data.description;
          let controlButtons;
          if (data.type === 'on/off') {
               controlButtons = (
                    <div>
                         <Button
                              disabled={!buttonsState[index][0]}
                              onClick={e => handleButtonClick(e, index, 0, key)}
                              color="primary"
                              name="on"
                              variant="raised"
                         >
                              Zapnuto
                         </Button>
                         <Button
                              color="secondary"
                              onClick={e => handleButtonClick(e, index, 1, key)}
                              disabled={!buttonsState[index][1]}
                              name="off"
                         >
                              Vypnuto
                         </Button>
                    </div>
               );
          } else if (data.type === 'toogle') {
               controlButtons = (
                    <Button onClick={e => handleButtonClick(e, index, 1, key)} color="primary" name="on" variant="raised">
                         Aktivovat
                    </Button>
               );
          }
          return (
               <ExpansionPanelDetails className={classes.details} key={index}>
                    <div className={classes.column}>{controlButtons}</div>
                    <div className={classNames(classes.column, classes.helper)}>
                         <Typography variant="caption">
                              {description}
                              <br />
                         </Typography>
                    </div>
               </ExpansionPanelDetails>
          );
     };
}

class DetailedExpansionPanel extends Component {
     constructor(props) {
          super(props);
          const arrOfKeys = toPairs(this.props.manageData).filter(arr => arr[0] !== 'updated');
          const newState = indexedMap((arr, index) => {
               if (arr[1].state === 0) {
                    return [false, true];
               } else {
                    return [true, false];
               }
          }, arrOfKeys);
          this.state = {
               buttonsState: newState
          };
     }

     handleButtonClick = (e, index, type, key) => {
          const { buttonsState } = this.state;
          const errorCallback = () => {
               this.setState({
                    buttonsState: buttonsState
               });
          };
          if (type === 0) {
               const newButtonsState = update(index, [false, true], buttonsState);
               this.setState({
                    buttonsState: newButtonsState
               });
               this.sendData(type, key, errorCallback);
          } else if (type === 1) {
               const newButtonsState = update(index, [true, false], buttonsState);
               this.setState({
                    buttonsState: newButtonsState
               });
               this.sendData(type, key, errorCallback);
          }
     };
     sendData = (type, key, errorCallback) => {
          Api.manageData(this.props._id, { [key]: type }, errorCallback);
	};
	clickSimple = () => {
		const {_id, handleSimpleMode} = this.props;
		handleSimpleMode(_id)
	}
     render() {
          const { classes, manageData, title, _id, simpleMode } = this.props;
          const { buttonsState } = this.state;
          const arrOfKeys = toPairs(manageData).filter(arr => arr[0] !== 'updated');
          const curryedCreateDetails = createDetails(classes, buttonsState, this.handleButtonClick);
          const details = indexedMap(curryedCreateDetails, arrOfKeys);

          return (
               <div className={classes.root}>
                    <ExpansionPanel defaultExpanded>
                         <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                              <div className={classes.column}>
                                   <Typography>
                                        <span className={classes.heading}>{title}</span>
                                   </Typography>
                              </div>
                         </ExpansionPanelSummary>

                         <FormControlLabel control={<Switch value="simpleMode" checked={_id === simpleMode} onClick={this.clickSimple} />} className={classes.simple} />

                         {details}
                         <Divider />
                    </ExpansionPanel>
               </div>
          );
     }
}

DetailedExpansionPanel.propTypes = {
     classes: PropTypes.object.isRequired
};

export default withStyles(styles)(DetailedExpansionPanel);
