import React, { Component } from 'react';
import Popup from 'reactjs-popup';
import UserList from './UserList';
import axios from 'axios';
import ApiCalls from './ApiCalls';


const Apis = new ApiCalls();
class User extends Component{
    constructor(props){
        super(props);
        this.state = { 
            users:[],
            selectedFile: null,
            selectedFileName:"",
            selectedUsers:[],
            showMyComponent:false
          };
    }
    componentDidMount(){
        Apis.getAllUsers().then(res => {
            this.setState({users:res.users})
        })
    }
    onFileChange = (event) => { 
        this.setState({ selectedFile: event.target.files[0] });
        this.setState({selectedFileName: event.target.files[0].file}) 
       
    }; 
    onFileUpload = (e) => { 
          e.preventDefault(); 
        const formData = new FormData();  
        formData.append( 
          "file", 
          this.state.selectedFile, 
          this.state.selectedFile.name 
        ); 
        console.log(this.state.selectedFile); 

        axios.post("http://localhost:3001/api/user/bulk", formData,{
            headers:{
                'Content-Type':'multipart/form-data'
            }
        }); 
        e.returnValue = true;

    }; 
    
    handleCheck(id){
        let users = this.state.selectedUsers;
        const i = users.findIndex(user => user === id );
        if( i === -1){
            users.push(id);
            this.setState({selectedUsers:users})
        }
        else{
            users.splice(i, 1);
        }
        if(users.length !== 0){
            this.setState({showMyComponent:true})
        }
        else{
            this.setState({showMyComponent:false})
        }
    }
    deleteUsers(){
        const selectedUsers = this.state.selectedUsers;
        fetch(
            "http://localhost:3001/api/user/delete",
            {
              method: "delete",
              headers: {
               // Accept: "application/json",
                "Content-Type": "application/json",
              },
              body: JSON.stringify({selectedUsers})
            }
          )
            .then(response => response.json())
            .then(responseJson => {
              console.log(responseJson);
              this.setState({selectedUsers:[]});
              this.setState({showMyComponent:false})
              window.location.reload();
            })
            .catch(error => console.log("error", error));
    }
    render(){
        return(
        <div>
        <div className="bg-two">
          <div className="container">
            <div className="row">
            <Popup trigger={
                <div className="bulk-user text-center p-2 ml-auto" id="add-users">Add users in bulk</div>
            } position="bottom center">
                <div className="popup center" >
                  <div className="container">
                  <form onSubmit={this.onFileUpload} >
                  <input type="file" name="file" onChange={this.onFileChange} /> 
                    <button type="submit"> 
                    Upload! 
                    </button> 
                    </form>             
                </div>
            </div>
            </Popup>
            <Popup trigger={
                <div className="new-user text-center p-2 ml-auto" id="add-users"><i className="fas fa-plus"></i></div>
            } position="bottom center">
                <div className="popup center" >
                  <div className="container">
                  <form action="http://localhost:3001/api/user" method="POST" >
                        <div class="form-group">
                            <label for="name">Name</label>
                            <input type="text" name="name" class="form-control"/>
                        </div>
                        <div class="form-group">
                            <label for="phone">Phone Number</label>
                            <input type="text" name="mobile" class="form-control"/>
                        </div>
                        <div class="form-group">
                            <label for="email">Email</label>
                            <input type="text" name="email" class="form-control"/>
                        </div>
                        <div class="form-group">
                            <label for="about">About</label>
                            <input type="text" name="about" class="form-control"/>
                        </div>
                        <input type="submit" value="Submit"/>
                    </form>  
                                    
                </div>
            </div>
            </Popup>
              
              <div className="col-12 bg-common d-flex flex-row">
                <p className="styles"><span className="user">Users</span> | Showing all users</p>
                <div className="ml-auto d-flex flex-row">
                <i class="material-icons btn" onClick={() => this.deleteUsers()} style={this.state.showMyComponent ? {} : { display: 'none' }}>delete</i>
                
                </div>
              </div>
              <div className="col-12 bg-common1 d-flex flex-row justify-content-center">
              <table className="table">
                <thead key="thead">
                    <tr>
                    <th></th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Mobile</th>
                    <th>About Me</th>
                    </tr>
                </thead>
                {
                    this.state.users.map(user => 
                        <tr><input type="checkbox" onClick = {() => this.handleCheck(user.id) }/>
                        <td>{user.Name}</td>
                        <td>{user.Email}</td>
                        <td>{user.Mobile}</td>
                        <td>{user.About}</td>
                        </tr>
                    )
                }
            </table>
              </div>
            </div>
          </div>
            
         </div>
        </div>
           
        )
    }
}

export default User;
