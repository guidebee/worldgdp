/**
 *
 * CountryGdp
 *
 */

import React from 'react';

import { withStyles } from '@material-ui/core/styles/index';
import PropTypes from 'prop-types';
import Badge from '@material-ui/core/Badge';
import { Paper } from '@material-ui/core';

import Flag from 'react-flagkit';
import Typography from '@material-ui/core/Typography';

const styles = () => ({
  root: {
    display: 'flex',
    margin: 0,
    padding: '5px',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    backgroundColor: 'purple',
  },

  flag: {
    alignSelf: 'center',
  },
  countryName: {
    color: 'white',
  },
  gdpNumber: { color: 'yellow' },
});

/* eslint-disable react/prefer-stateless-function */
class CountryGdp extends React.PureComponent {
  render() {
    const {
      classes,
      rank,
      countryCode,
      countryName,
      size,
      gdpNumber,
      containerStyle,
    } = this.props;
    return (
      <Badge color="error" badgeContent={rank} style={containerStyle}>
        <Paper className={classes.root}>
          <Typography className={classes.gdpNumber}>{gdpNumber}</Typography>
          <Flag
            style={{
              width: `${size * 21 + 20}px`,
              height: `${size * 15 + 20}px`,
            }}
            key={countryName}
            country={countryCode}
            className={classes.flag}
          />
          <Typography className={classes.countryName}>{countryName}</Typography>
        </Paper>
      </Badge>
    );
  }
}

CountryGdp.defaultProps = {
  size: 1,
  gdpNumber: 0,
};

CountryGdp.propTypes = {
  classes: PropTypes.object.isRequired,
  rank: PropTypes.number.isRequired,
  size: PropTypes.number,
  gdpNumber: PropTypes.number,
  countryCode: PropTypes.string.isRequired,
  countryName: PropTypes.string.isRequired,
  containerStyle: PropTypes.object,
};

export default withStyles(styles)(CountryGdp);
