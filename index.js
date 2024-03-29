const  express = require("express");
const uuid = require("uuid");
const cors = require ("cors");

const port = process.env.PORT || 3001;
const app = express();
app.use(express.json());
app.use(cors());

const users = [];
const check_user_id = (request, response, next) => {
    const {id} = request.params;
    
    const index = users.findIndex(user => user.id === id)
    
    if (index < 0) {
        return response.status(404).json({error: "User not found"})
    }

    request.user_index = index
    request.user_id = id

    next()
}

app.get('/users',(request, response) =>{
    return response.json(users)
})

app.post('/users',(request, response) =>{
    
    try{    
        const {name, age} = request.body

        const user = {id:uuid.v4(), name, age}
    
        users.push(user)

        return response.status(201).json(user)
    }catch(err){
        return response.status(500).json({error:err.message});
    }
});

app.put('/users/:id',check_user_id,(request, response) =>{
    const {name, age} = request.body
    const index = request.user_index
    const id = request.user_id

    const update_user ={id, name, age}
    
    users[index] = update_user

    return response.json(update_user)
})

app.delete('/users/:id',check_user_id,(request, response) =>{
    const index = request.user_index

    users.splice(index,1)

    return response.status(204).json()
})

app.listen(port, () =>{
    console.log(`Server started on port ${port}`)
})