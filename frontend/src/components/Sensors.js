import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import SensorComponent from "./SensorComponent";
import { map, head } from "ramda";

const styles = {
      "@global": {
            "p + p": {
                  paddingTop: 7
            }
      }
};

function createComponent({ body, created, data, title, _id, imgPath }) {
      return (
            <SensorComponent
                  heading={title}
                  comment={body}
                  data={head(data)}
			   key={_id}
			   _id={_id}
			   imgPath={imgPath}
			   created={created}
            />
      );
}
class Sensors extends Component {
      render() {
            const { state } = this.props;
            const sensorComponents = map(createComponent, state.data);
            return <div>{sensorComponents}</div>;
      }
}
Sensors.propTypes = {
      classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Sensors);
