import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import '../styles/ButtonAppBar.css';

class ButtonAppBar extends React.Component {
   render() {
    return (
      <div className="root">
        <AppBar position="static">
          <Toolbar>
            <Typography variant="title" color="inherit" className="flex">
              MERN APP
            </Typography>
            {this.props.children}
          </Toolbar>
        </AppBar>
      </div>
    );
   }
}

export default ButtonAppBar;