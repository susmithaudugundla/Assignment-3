import axios from 'axios';

const URL = "http://localhost:3001/api/user"

class ApiCalls{
    getAllUsers(){
        return axios.get("http://localhost:3001/api/user").then(res => 
            //console.log(res.data);
            res.data
        );
    }

    createUser(data){
        return axios.post("http://localhost:3001/api/user",data).then(res => alert("User added succssfully"))
    }
}

export default ApiCalls;