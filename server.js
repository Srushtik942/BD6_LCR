const PORT = 3000;
const {app} = require('./index');
app.listen(PORT,()=>{
    console.log(`Server is running on ${PORT}`);
})
