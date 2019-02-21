import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { map, toPairs, compose, prop, nth, head, assoc } from 'ramda';
import updatedBefore from '../utils/updatedBefore';
import { askForPermissioToReceiveNotifications } from './../push-notification';
import NotificationDialog from './notificationDialog';
import Api from '../api' /* TODO very bad shit */

function moveCreatedToEnd(arr) {
     let created;
     const without = arr.filter(item => {
          if (item[0] !== 'created') {
               return true;
          } else {
               created = item;
               return false;
          }
     });
     without.push(created);
     return without;
}
const styles = {
     card: {
          maxWidth: 400,
          float: 'left',
          marginBottom: 1
     },
     media: {
          height: 0,
          paddingTop: '56.25%' // 16:9
     },
     data: {
          //  color: "rgba(0, 0, 0, 0.54)",
          fontSize: 15
     },
     dataContainer: {
          paddingTop: 17
     },
     created: {
          fontSize: 11
     },
     'p+p': {
          paddingTop: 100
     }
};
function isCreated(string) {
     return string === 'created';
}

function convertDataToComponent(classes) {
     return arrayOfData => {
          const obj = nth(1, arrayOfData);
          const key = head(arrayOfData);
          return isCreated(key) ? (
               <Typography component="p" className={classes.created} align="right" key={key}>
                    {updatedBefore(new Date(obj))}
               </Typography>
          ) : (
               <Typography component="p" className={classes.data} color="primary" key={key}>
                    {key} : {prop('value', obj)} {prop('unit', obj)}
               </Typography>
          );
     };
}

class SensorComponent extends React.Component {
     constructor(props) {
          super(props);
          this.state = {
               notifyDialog: {
                    open: false
               }
          };
     }
     openNotifyDialog = open => {
          this.setState({
               notifyDialog: {
                    open
               }
          });
	};
	confirmNotify = async (notifyObj) => {
		const token = await askForPermissioToReceiveNotifications();
		console.log(notifyObj)
		if (token) {
			Api.notifySensor(this.props._id, notifyObj, token)
		}

		this.openNotifyDialog(false);
	}
	removeNotification = async (notifyObj) => {
		const token = await askForPermissioToReceiveNotifications();
		if (token) {
			Api.notifySensorCancel(this.props._id, notifyObj, token)
		}

		this.openNotifyDialog(false);
	}
     render() {
          const { classes, heading, comment, data, imgPath, created } = this.props;
		
          const dataComponents = data
               ? compose(
                      map(convertDataToComponent(classes)),
                      moveCreatedToEnd,
                      toPairs
                 )(data)
               : null;
          return (
               <Card className={classes.card}>
                    <CardMedia
                         className={classes.media}
                         image={imgPath}
                         // image="/images/weatherStation.jpg"
                         title="Contemplative Reptile"
                    />
                    <CardContent>
                         <Typography gutterBottom variant="headline" component="h2">
                              {heading}
                         </Typography>
                         <Typography component="p">{comment}</Typography>
                         <div className={classes.dataContainer}>{dataComponents}</div>
                    </CardContent>
                    <CardActions>
                         <Button size="small" color="primary" onClick={() => this.openNotifyDialog(true)}>
                              Notify
                         </Button>
                         <Button size="small" color="primary" disabled>
                              Learn More
                         </Button>
                    </CardActions>
                    <NotificationDialog
					open={this.state.notifyDialog.open}
					handleClose={() => this.openNotifyDialog(false)} 
					handleConfirm={this.confirmNotify}
					sensors={Object.keys(data).filter((el) => el != "created")}
					handleRemoveNotification={this.removeNotification}
				/>
               </Card>
          );
     }
}
SensorComponent.propTypes = {
     classes: PropTypes.object.isRequired
};

export default withStyles(styles)(SensorComponent);
