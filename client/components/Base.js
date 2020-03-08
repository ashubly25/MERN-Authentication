import React from 'react';
import ButtonAppBar from './ButtonAppBar';
import AllUsers from './AllUsers';
import UserHome from './UserHome';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Fade from '@material-ui/core/Fade';
import Paper from '@material-ui/core/Paper';
import LinearProgress from '@material-ui/core/LinearProgress';
import '../styles/Base.css';

class Base extends React.Component {
    constructor(props) {
        super(props);
        this.state = {home:true};
        this.home = this.home.bind(this);
        this.allUsers = this.allUsers.bind(this);
    }
    
    home() {this.setState({home:true});}
    
    allUsers() {
        this.props.callbacks.fetchAllUsers();
        this.setState({home:false});
    }
    
    render() {
        return (
            <div>
            <ButtonAppBar>
                <Button color="inherit" onClick={this.home}>Home</Button>
                <Button color="inherit" onClick={this.allUsers}>All Users</Button>
                <Button color="inherit" onClick={this.props.callbacks.logOut}>Log out</Button>
            </ButtonAppBar>
            <Fade in={this.props.loading}>
            <LinearProgress/>
            </Fade>
            <Grid className="grid" container justify="center">
            <Paper className="paper">
            { this.state.home && <UserHome user={this.props.user}/> }
            { !this.state.home && this.props.data.users && <AllUsers data={this.props.data}/> }
            </Paper>
            </Grid>
            </div>
        );
    }
}

export default Base;