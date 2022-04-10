const { 
    getOne,getMany,
    create,update,
    deleteOne,
    getList,getManyReference 
} = require("./controller.js");
let router2 = require('express').Router();



function generateCRUD(router,modelName,model){
    console.log( model)
    // getList, getMany and getManyReference endpoint
    console.log( router)
    router2.get(`/${modelName}`,async (req,res) => {
        const params = req.query;

        if ( params.id ) {
            // getMany endpoint
            // GET http://my.api.url/modelName?id=id&id=456&id=789
            getMany(model,params).then(({status,response:{ data,total }}) => {
                res.set({
                    'Access-Control-Expose-Headers': 'X-Total-Count',
                    'X-Total-Count': total
                });


    
                res.status(status).json(data);
            })
        // } else if(params._sort){
        //     // GET http://my.api.url/modelName?author_id=345
        //     getManyReference(model,params).then(({status,response:{total,data}}) => {
        //         res.set({
        //             'Access-Control-Expose-Headers': 'X-Total-Count',
        //             'X-Total-Count': total
        //         });
    
        //         res.status(status).json(data);
        //     })
        }else{
            // getList endpoint
            // GET http://my.api.url/modelName?_sort=title&_order=ASC&_start=0&_end=24
            getList(model,params).then(({status,response:{total,data}}) => {
                res.set({
                    'Access-Control-Expose-Headers': 'X-Total-Count',
                    'X-Total-Count': total
                });
    
                res.status(status).json(data);
            })
        }
    });

    // getOne endpoint
    // GET http://my.api.url/modelName/id
    router2.get(`/${modelName}/:id`,async (req,res) => {
        const params = req.params;
        getOne(model,params).then(({status,response:{data}}) => {
            res.status(status).json(data);
        })
    });
    console.log('here', modelName)
    // create
    // POST http://my.api.url/modelName
    router2.post("/NFT",async (req,res) => {
        console.log('here 2')
        const params = req.body;
        create(model,params).then(({status,response:{data}}) => {
            res.status(status).json(data);
        })
    });

    // update
    // PUT http://my.api.url/modelName/id
    router2.put(`/${modelName}/:id`,async (req,res) => {
        const params = { ...req.body, ...req.params };
        update(model,params).then(({status,response:{data}}) => {
            res.status(status).json(data);
        })
    });

    // delete
    // DELETE http://my.api.url/modelName/id
    router2.delete(`/${modelName}/:id`,async (req,res) => {
        deleteOne(model,req.params).then(({status,response:{data}}) => {
            res.status(status).json(data);
        })
    });
    return router2
}

module.exports = {
    generateCRUD
}
