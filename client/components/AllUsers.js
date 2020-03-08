import React from 'react';
import Typography from '@material-ui/core/Typography';

const AllUsers = props =>
    props.data.users.map( (user, i) => 
        <div className="field" key={'key'+i}><Typography>{user.name} - {user.mail}</Typography></div>
);

export default AllUsers;