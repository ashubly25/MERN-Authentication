import React from 'react';
import Typography from '@material-ui/core/Typography';

class UserHome extends React.Component {
    render() {
        return (
                <div>
                <Typography>{this.props.user.name} ({this.props.user.mail})</Typography>
                </div>
        );
    }
}

export default UserHome;