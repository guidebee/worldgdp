/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 */

import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import CountryCodes from 'data/countrycode';
import WorldGDP from 'data/worldgdp';

import CountryGdp from 'components/CountryGdp';
import Typography from '@material-ui/core/Typography';
const styles = theme => ({
  root: {
    display: 'flex',
    padding: '20px',
    margin: '20px',
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gdpDisplay: {
    margin: theme.spacing.unit * 3,
    padding: theme.spacing.unit * 3,
  },
});

function getAlpha2(alpha3) {
  const countryCode = CountryCodes.find(c => c.alpha3 === alpha3);
  if (countryCode) return countryCode.alpha2;
  return alpha3;
}

const MIN_YEAR = 1960;
const MAX_YEAR = 2016;
/* eslint-disable react/prefer-stateless-function */
export class HomePage extends React.Component {
  constructor(props) {
    super(props);
    const countryCode = [];
    CountryCodes.forEach(c => {
      countryCode.push(c.alpha3);
    });
    this.WorldGDP = WorldGDP.filter(
      g => countryCode.indexOf(g.countryCode) > 0,
    );
    this.state = { year: MIN_YEAR };
  }

  componentDidMount() {
    this.timerID = setInterval(() => this.tick(), 500);
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  tick = () => {
    this.setState(prevState => {
      let nextYear = prevState.year + 1;
      if (nextYear > MAX_YEAR) nextYear = MIN_YEAR;
      return {
        year: nextYear,
      };
    });
  };

  render() {
    const { classes } = this.props;
    const totalCountry = 15;
    const displayCountries = this.WorldGDP.filter(
      g => g.year === this.state.year,
    )
      .sort((g1, g2) => g2.value - g1.value)
      .slice(0, totalCountry);

    return (
      <div className={classes.root}>
        <Typography variant="h1" color="primary">
          {this.state.year}
        </Typography>
        {displayCountries.map((c, index) => {
          const size = c.value / 1000000000000;
          const gdpNumber = Math.round(size * 1000);

          return (
            <CountryGdp
              className={classes.gdpDisplay}
              rank={index + 1}
              countryCode={getAlpha2(c.countryCode)}
              countryName={c.countryCode}
              size={size}
              containerStyle={{
                position: 'absolute',
                top: `${(20 - size) * 40}px`,
                left: `${index * 6}vw`,
              }}
              gdpNumber={gdpNumber}
            />
          );
        })}
      </div>
    );
  }
}

HomePage.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(HomePage);
