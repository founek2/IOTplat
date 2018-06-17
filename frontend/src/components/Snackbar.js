import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Snackbar from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";

const styles = theme => ({
      close: {
            width: theme.spacing.unit * 4,
            height: theme.spacing.unit * 4
      }
});

class SimpleSnackbar extends React.Component {
      state = {
            open: false
      };

      handleClick = () => {
            this.setState({ open: true });
      };

      handleClose = (event, reason) => {
            if (reason === "clickaway") {
                  return;
            }

            this.setState({ open: false });
      };

      render() {
            const { classes, open, onClose, hideDuration, message } = this.props;
            return (
                  <div>
                        <Snackbar
                              anchorOrigin={{
                                    vertical: "bottom",
                                    horizontal: "right"
                              }}
                              open={open}
                              autoHideDuration={hideDuration}
                              onClose={onClose}
                              ContentProps={{
                                    "aria-describedby": "message-id"
                              }}
                              message={<span>{message}</span>}
                              action={[
                                    <IconButton
                                          key="close"
                                          aria-label="Close"
                                          color="inherit"
                                          className={classes.close}
                                          onClick={onClose}
                                    >
                                          <CloseIcon />
                                    </IconButton>
                              ]}
                        />
                  </div>
            );
      }
}

SimpleSnackbar.propTypes = {
      classes: PropTypes.object.isRequired
};

export default withStyles(styles)(SimpleSnackbar);
