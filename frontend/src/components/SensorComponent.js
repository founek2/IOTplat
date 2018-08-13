import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { map, toPairs, compose, prop, nth, head } from 'ramda';
import updatedBefore from '../utils/updatedBefore';

function moveCreatedToEnd(arr) {
	let created;
     const without = arr.filter(item => {
          if (item[0] !== 'created') {
			return true;
          }else {
			created = item;
			return false;
		}
     });
	without.push(created)
     return without;
};
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

function SensorComponent({ classes, heading, comment, data, imgPath, created }) {
     function convertDataToComponent(arrayOfData) {
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
	}
     const dataComponents = data ? compose(
          map(convertDataToComponent),
          moveCreatedToEnd,
          toPairs
     )(data) : null;
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
                    <Button size="small" color="primary" disabled>
                         Share
                    </Button>
                    <Button size="small" color="primary" disabled>
                         Learn More
                    </Button>
               </CardActions>
          </Card>
     );
}

SensorComponent.propTypes = {
     classes: PropTypes.object.isRequired
};

export default withStyles(styles)(SensorComponent);
