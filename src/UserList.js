import React, { Component } from 'react';
import ApiCalls from './ApiCalls';

const Apis = new ApiCalls();

class UserList extends Component{
    constructor(props){
        super(props);
        this.state = {
            users:[]
        }
    }
    componentDidMount(){
        Apis.getAllUsers().then(res => {
            this.setState({users:res.users})
        })
    }
    render(){
        return(
            <table className="table">
                <thead key="thead">
                    <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Mobile</th>
                    <th>About Me</th>
                    </tr>
                </thead>
                {
                    this.state.users.map(user => 
                        <tr>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{user.mobile}</td>
                        <td>{user.about}</td>
                        </tr>
                    )
                }
            </table>
        )
    }
}

export default UserList;