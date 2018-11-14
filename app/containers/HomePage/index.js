/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 */

import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import { Paper } from '@material-ui/core';
import Button from '@material-ui/core/Button';


const StyledPaper = withStyles({
  root: {
    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    borderRadius: 3,
    border: 0,
    color: 'white',
    height: 48,
    padding: '0 30px',
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
  },
})(Paper);

/* eslint-disable react/prefer-stateless-function */
export class HomePage extends React.Component {


  render() {


    return (

        <div>
          <StyledPaper>
            <Button color="primary">Primary</Button>
            <Button color="secondary">Secondary</Button>
          </StyledPaper>
        </div>

    );
  }
}

HomePage.propTypes = {
  loading: PropTypes.bool,

};




export default HomePage;
