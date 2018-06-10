import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import classNames from "classnames";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelActions from "@material-ui/core/ExpansionPanelActions";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Chip from "@material-ui/core/Chip";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import { keys, update, toPairs } from "ramda";
import indexedMap from "../utils/indexedMap";
import Api from '../api';
const styles = theme => ({
      root: {
            width: "100%"
      },
      heading: {
            fontSize: theme.typography.pxToRem(17)
      },
      details: {
            alignItems: "center"
      },
      column: {
            flexBasis: "50%"
      },
      helper: {
            borderLeft: `2px solid ${theme.palette.divider}`,
            padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`
      },
      offButton: {
            color: "rgba(0, 0, 0, 0.54)"
      }
});
function createDetails(classes, buttonsState, handleButtonClick) {
      return (arr, index) => {
		 const key = arr[0];
		 const data = arr[1];
            console.log(buttonsState, index, key);
            const description = data.description;
            return (
                  <ExpansionPanelDetails className={classes.details} key={index}>
                        <div className={classes.column}>
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
                                    onClick={e => handleButtonClick(e,index, 1, key)}
							 disabled={!buttonsState[index][1]}
							 name="off"
                              >
                                    Vypnuto
                              </Button>
                        </div>
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
            const arrOfKeys = toPairs(this.props.manageData).filter(arr => arr[0] !== "updated" );
            const newState = indexedMap((arr, index) => {
                  if (arr[1].state === 0) {
                        return [false, true];
                  }else {
				return [true, false];
			   }
            }, arrOfKeys);
            this.state = {
                  buttonsState: newState
            };
      }

      handleButtonClick = (e, index, type, key) => {
		  const { buttonsState } = this.state;
		  // console.log(e.target.getTarget)
            if (type === 0) {
                  const newButtonsState = update(index, [false, true], buttonsState);
                  this.setState({
                        buttonsState: newButtonsState
			   });
			   this.sendData(type, key)
            } else if (type === 1) {
                  const newButtonsState = update(index, [true, false], buttonsState);
                  this.setState({
                        buttonsState: newButtonsState
			   });
			   this.sendData(type, key)
            }
	 };
	 sendData = (type, key) => {
		Api.manageData(this.props._id, {[key]: type});
	 }
      render() {
            const { classes, manageData } = this.props;
            const { buttonsState } = this.state;
            const arrOfKeys = toPairs(manageData).filter(arr => arr[0] !== "updated" );
            const curryedCreateDetails = createDetails(
                  classes,
                  buttonsState,
                  this.handleButtonClick
            );
            const details = indexedMap(curryedCreateDetails, arrOfKeys);

            return (
                  <div className={classes.root}>
                        <ExpansionPanel defaultExpanded>
                              <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                                    <div className={classes.column}>
                                          <Typography className={classes.heading}>Lustr</Typography>
                                    </div>
                              </ExpansionPanelSummary>
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
