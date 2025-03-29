import Express from "./lib/router.js";


const PORT = process.env.PORT || 4000;

const app = new Express();

app.get('/employees', (req, res)=>{

})

app.delete('/user/delete/:id',  (req, res)=>{
    res.json({params: req.params});
})

app.listen(PORT, (err)=>{
    if(err) console.log('Something went wrong!');
    console.log(`Server runnig on port ${PORT}`);
})