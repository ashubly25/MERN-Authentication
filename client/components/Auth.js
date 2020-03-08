import React from 'react';
import LogIn from './LogIn';
import SignUp from './SignUp';
import ButtonAppBar from './ButtonAppBar';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Fade from '@material-ui/core/Fade';
import LinearProgress from '@material-ui/core/LinearProgress';
import '../styles/Auth.css';

class Auth extends React.Component {

    constructor(props) {
        super(props);
        this.state = {login:true};
        this.login = this.login.bind(this);
        this.signup = this.signup.bind(this);
    }

    login() {
        this.setState({login:true});
        this.props.callbacks.resetAllErrors();
    }

    signup() {
        this.setState({login:false});
        this.props.callbacks.resetAllErrors();
    }

    render() {
        return (
            <div>
            <ButtonAppBar>
                <Button color="inherit" onClick={this.login}>Log In</Button>
                <Button color="inherit" onClick={this.signup}>Sign Up</Button>
            </ButtonAppBar>
            <Fade in={this.props.loading}>
            <LinearProgress/>
            </Fade>
            <Grid container justify="center" className="grid">
            <Paper className="paper">
            { this.state.login ?
            <LogIn callbacks={this.props.callbacks} loading={this.props.loading} error={this.props.error}/> :
            <SignUp callbacks={this.props.callbacks} loading={this.props.loading} error={this.props.error}/> }
            </Paper>
            </Grid>
            </div>
        );
    }
}

export default Auth;