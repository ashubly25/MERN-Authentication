import React from 'react';
import Auth from './Auth';
import Base from './Base';
import '../styles/App.css';

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {loading:false,error:{name:'',mail:'',key:''},user:{},data:{}};
        this.logIn = this.logIn.bind(this);
        this.signUp = this.signUp.bind(this);
        this.logOut = this.logOut.bind(this);
        this.fetchUser = this.fetchUser.bind(this);
        this.fetchAllUsers = this.fetchAllUsers.bind(this);
        this.resetError = this.resetError.bind(this);
        this.resetAllErrors = this.resetAllErrors.bind(this);
    }

    componentDidMount() {
        this.fetchUser();
    }

    get(url) {
        return fetch(url, {
            headers:{'Accept':'application/json'},
            method: "GET"
        }).then(res=>res.json());
    }

    post(url,data) {
        return fetch(url, {
            headers:{
                'Content-Type':'application/json',
                'Accept':'application/json'
            },
            method:"POST",
            body:JSON.stringify(data)
        }).then(res=>res.json());
    }

    fetchUser () {
        this.setState({loading:true});
        this.get("/User").then(res=>{
            this.setState({loading:false});
            if(res.success) this.setState({user:{login:{name:res.payload.name,mail:res.payload.mail}}});
        }).catch(err=>{this.setState({loading:false});});
    }

    signUp(name,mail,key) {
        let error=this.preSignUpError(name,mail,key);
        if(error) return this.setState({error:error});
        this.setState({loading:true});
        this.post("/Auth/SignUp",{name:name,key:key,mail:mail}).then(res=>{
            this.setState({loading:false});
            if(res.success) this.setState({user:{login:{name:name,mail:mail}}});
            else if(res.reason) {
                error = this.postSignUpError(res.reason);
                if(error) this.setState({error:error});
            }
        }).catch(err=>this.setState({loading:false}));
    }

    logIn(name,key) {
        let error = this.preLogInError(name,key);
        if(error) return this.setState({error:error});
        this.setState({loading:true});
        this.post("/Auth/LogIn",{name:name,key:key})
        .then(res=>{
            this.setState({loading:false});
            if (res.success) this.fetchUser();
            else if(res.reason) {
                error = this.postLogInError(res.reason);
                if(error) this.setState({error:error});
            }
        }).catch(err=>this.setState({loading:false}));
    }

    fetchAllUsers () {
        this.setState({loading:true});
        this.get("/AllUsers").then(res=>{
            this.setState({loading:false});
            if(res.success) this.setState({data:{users:res.payload}});
        }).catch(res=>this.setState({loading:false}));
    }

    logOut () {
        this.setState({loading:true});
        this.get("/Auth/LogOut").then(res=>{
            if(res.success) {
                this.setState({loading:false});
                this.setState({user:{}});
            }
        }).catch(err=>this.setState({loading:false}));
    }

    
    preSignUpError(name,mail,key) {
        
        let error={name:'',mail:'',key:''};
        
        if (!name)
            error.name = 'Username is required.';
        else {
            if(!/[a-zA-Z]/.test(name.charAt(0)))
                error.name += 'Username must begin with a letter. ';
            if(!/^[a-zA-Z0-9]*$/.test(name))
                error.name += 'Username can only contain letters and numbers. ';
            if(name.length<4)
                error.name += 'Username must be at least 4 character long.';
        }
        
        if (!key)
            error.key = 'Password is required.';
        else if (key.length<5)
            error.key = 'Password must be at least 5 characters long.';
        
        if(!mail)
            error.mail = 'Email is required.';
        else if(!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(mail))
            error.mail = 'Enter a valid email';
        
        if ( error.name || error.mail || error.key ) return error;
        else return false;
    }

    preLogInError(name,key) {
        
        let error = {name:'',key:'',mail:''};
        
        if (!name)
            error.name = 'Username is required.';
        else if(!/^[a-zA-Z][a-zA-Z0-9]{3,}$/.test(name))
            error.name = 'Invalid username.';
        
        if (!key)
            error.key = 'Password is required.';
        else if (key.length<5)
            error.key = 'Invalid password';
        
        if ( error.name || error.key ) return error;
        else return false;
    }

    postLogInError(serverError) {
        
        let error={name:'',key:'',mail:''};
        
        if(serverError.notFound)
            error.name = "User doesn't exist. Sign Up to create a new account.";
        else if(serverError.incorrectKey)
            error.key = "Incorrect password and/or username.";
        
        if ( error.name || error.key ) return error;
        else return false;
    }

    postSignUpError(serverError) {
        
        let error={name:'',mail:'',key:''};
        
        if(serverError.nameConflict)
            error.name = "Username taken. Try different username.";
        
        if(serverError.mailConflict)
            error.mail = "Email already registered. Log in to your pre-existing account.";
        
        if ( error.name || error.mail ) return error;
        else return false;
    }

    resetError(name) {
        this.setState(state=>{
            state.error[name] = '';
            return state;
        });
    }

    resetAllErrors() { this.setState({error:{name:'',key:'',mail:''}}); }

    render() {
        
        return (
            
            <div>
            
            { this.state.user.login ?
            
            <Base
              user={{name:this.state.user.login.name,mail:this.state.user.login.mail}}
              callbacks={{logOut:this.logOut,fetchAllUsers:this.fetchAllUsers}}
              data={this.state.data}/> :
            
            <Auth
              callbacks={{
                  logIn:this.logIn,
                  signUp:this.signUp,
                  resetError:this.resetError,
                  resetAllErrors:this.resetAllErrors
              }}
              loading={this.state.loading}
              error={this.state.error}
            /> }
            
            </div>

        );
    }
}

export default App;