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
  year: {
    flexGrow: 1,
    textAlign: 'end',
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
const TOTAL_COUNTRIES = 15;
const INTERMEDIATE_POINTS = 100;

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
    const topCountriesIn2016 = this.WorldGDP.filter(g => g.year === 2016)
      .sort((g1, g2) => g2.value - g1.value)
      .slice(0, TOTAL_COUNTRIES);

    this.top15CountryCode = [];
    topCountriesIn2016.forEach(c => {
      this.top15CountryCode.push(c.countryCode);
    });

    this.state = {
      year: MIN_YEAR,
      dataPoint: 0,
    };
  }

  componentDidMount() {
    this.timerID = setInterval(() => this.tick(), 10);
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  tick = () => {
    this.setState(prevState => {
      let nextPoint = prevState.dataPoint + 1;
      let nextYear = prevState.year;

      if (nextPoint > INTERMEDIATE_POINTS) {
        nextYear = prevState.year + 1;
        nextPoint = 0;
        if (nextYear > MAX_YEAR) nextYear = MAX_YEAR;
      }

      return {
        year: nextYear,
        dataPoint: nextPoint,
      };
    });
  };

  render() {
    return this.renderTop15();
  }

  getDisplayCountries = () => {
    let nextYear = this.state.year + 1;
    if (nextYear > MAX_YEAR) nextYear = MAX_YEAR;
    const displayCountriesThisYear = this.WorldGDP.filter(
      g => g.year === this.state.year,
    ).sort((g1, g2) => g2.value - g1.value);

    const displayCountriesNextYear = this.WorldGDP.filter(
      g => g.year === nextYear,
    ).sort((g1, g2) => g2.value - g1.value);

    const displayCountries = [];

    this.top15CountryCode.forEach(code => {
      const countryThisYearIndex = displayCountriesThisYear.findIndex(
        g => g.countryCode === code,
      );
      const countryNextYearIndex = displayCountriesNextYear.findIndex(
        g => g.countryCode === code,
      );
      const country = {
        size: 0,
        countryCode: code,
        rank: -1,
        gdpNumber: 0,
      };
      if (countryThisYearIndex >= 0 && countryNextYearIndex >= 0) {
        country.rank = countryThisYearIndex + 1;
        const thisGdpValue =
          displayCountriesThisYear[countryThisYearIndex].value;
        const nextGdpValue =
          displayCountriesNextYear[countryNextYearIndex].value;

        const delta =
          ((nextGdpValue - thisGdpValue) * this.state.dataPoint) /
          INTERMEDIATE_POINTS;

        const size = (delta + thisGdpValue) / 1000000000000;

        const gdpNumber = Math.round(size * 1000);
        country.size = size;
        country.gdpNumber = gdpNumber;
      }
      displayCountries.push(country);
    });

    return displayCountries;
  };

  renderTop15() {
    const { classes } = this.props;

    const displayCountries = this.getDisplayCountries();

    return (
      <div className={classes.root}>
        <div className={classes.year}>
          <Typography variant="h1" color="primary">
            {this.state.year}
          </Typography>
        </div>
        {displayCountries.map((c, index) => {
          const { size } = c;
          const gdpNumber = Math.round(c.gdpNumber);
          console.log(`${c.countryCode}-${size}-${gdpNumber}`);
          return (
            <CountryGdp
              className={classes.gdpDisplay}
              rank={c.rank}
              countryCode={getAlpha2(c.countryCode)}
              countryName={c.countryCode}
              size={size}
              containerStyle={{
                position: 'absolute',
                paddingLeft: '10px',
                top: `${(20 - size) * 40}px`,
                left: `${index * 6.5}vw`,
              }}
              gdpNumber={gdpNumber}
            />
          );
        })}
      </div>
    );
  }

  renderTop15ForEachYear() {
    const { classes } = this.props;

    const displayCountries = this.WorldGDP.filter(
      g => g.year === this.state.year,
    )
      .sort((g1, g2) => g2.value - g1.value)
      .slice(0, TOTAL_COUNTRIES);

    return (
      <div className={classes.root}>
        <div className={classes.year}>
          <Typography variant="h1" color="primary">
            {this.state.year}
          </Typography>
        </div>
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
                paddingLeft: '10px',
                top: `${(20 - size) * 40}px`,
                left: `${index * 6.5}vw`,
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
