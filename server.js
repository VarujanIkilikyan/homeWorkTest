import express from 'express';
import 'dotenv/config'

const app = express();

const {PORT} = process.env;

// const hendler1 =(req, res,next) => {
//     console.log(`hendler1`)
//     req.customData = 'mycustomData';
//     next();
// }
//
// const hendler2 =(req, res) => {
//     console.log(`hendler2`)
//     res.send(`hendler2 : ${req.customData}`);
// }

app.get('/users/:name/:id',(req, res) => {
    res.json({
        params: req.params,
        query: req.query
    });
});

// app.post('/data',hendler2);

app.listen(+PORT,()=>{
    console.log(`server started is ${PORT}`);
})