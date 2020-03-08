import React from 'react';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import FormHelperText from '@material-ui/core/FormHelperText';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';

class SignUp extends React.Component {

    constructor(props) {
        super(props);
        this.state = {name: '', key: '', mail: '',showKey:false};
        this.submit = this.submit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.toggleKey = this.toggleKey.bind(this);
    }

    handleChange (event) {
      this.setState({[event.target.name]: event.target.value});
      this.props.callbacks.resetError([event.target.name]);
    }

    submit () { this.props.callbacks.signUp(this.state.name,this.state.mail,this.state.key); }

    error(name) {
      return !Object.is(this.props.error[name],'');
    }

    toggleKey() {
      this.setState(state => ({ showKey: !state.showKey }));
    } 

    mouseDown(event) {event.preventDefault();}
    
    render() {
        return (
            <div>
            
            <div className="field"><Typography variant="headline" color="inherit">Sign up</Typography></div>
            
            <div className="field">
            <FormControl error={this.error('name')} fullWidth>
              <InputLabel htmlFor="name" >Username</InputLabel>
              <Input id="name" name="name" value={this.state.name} onChange={this.handleChange} />
              { this.props.error.name && <FormHelperText> { this.props.error.name } </FormHelperText> }
            </FormControl>
            </div>

            <div className="field">
            <FormControl error={this.error('mail')} fullWidth>
              <InputLabel htmlFor="mail" >Email</InputLabel>
              <Input id="mail" name="mail" value={this.state.mail} onChange={this.handleChange} />
              { this.props.error.mail && <FormHelperText> { this.props.error.mail } </FormHelperText> }
            </FormControl>
            </div>

            <div className="field">
            <FormControl error={this.error('key')} fullWidth>
              <InputLabel htmlFor="key">Password</InputLabel>
              <Input id="key" type={this.state.showKey?'text':'password'} name="key" value={this.state.key} onChange={this.handleChange} 
              endAdornment ={
                <InputAdornment position="end">
                  <IconButton
                    onClick={this.toggleKey}
                    onMouseDown={this.mouseDown}
                  >
                    {this.state.showKey ?  <i class="material-icons">visibility</i> : <i class="material-icons">visibility_off</i> }
                  </IconButton>
                </InputAdornment>
              }/>
              { this.props.error.key && <FormHelperText> { this.props.error.key } </FormHelperText> }
            </FormControl>
            </div>

            <div className="button">
              <Button disabled={this.props.loading||this.error('name')||this.error('mail')||this.error('key')}
              variant="contained" color="default" onClick={this.submit}> Sign Up </Button>
            </div>
            
            </div>
        );
    }
}

export default SignUp;