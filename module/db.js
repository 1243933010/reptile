//DB库
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const Config = require('./config.js');

class Db{
    static getInstance(){
        if(!Db.instance){
            Db.instance = new Db();
        }
        return Db.instance;
    }
    constructor(){
        this.dbClient =null;  //放db对象
        this.connect();
    }
   
    /*
    
    */
    connect(){   //链接数据库
        let that = this;
      
        return new Promise((resolve,reject)=>{
            if(!this.dbClient){   //解决数据库对此链接问题
                MongoClient.connect(Config.dbUrl,{useNewUrlParser:true,useUnifiedTopology: true},(err,client)=>{
                    if(err)return;
                    let db = client.db(Config.dbName);
                    that.dbClient = db;
                    resolve(db)
                    })
            }else{
                resolve(that.dbClient)
            }
            
        })
    }
    /*
    集合  查找数据
    */
    find(collectionName,json,filter={},offset=0,limit=0){
       return new Promise((resolve,reject)=>{
        this.connect().then((res)=>{
            let result = res.collection(collectionName).find(json).project(filter).skip(offset).limit(limit);
            result.toArray((err,docs)=>{
                if(err) reject(err);
                resolve(docs);
            })
        })
       })
    }
    
    //插入
    insert(collectionName,json){
        return new Promise((resolve,reject)=>{
            this.connect().then((res)=>{
                res.collection(collectionName).insertOne(json,(err,result)=>{
                    if(err)reject(err);
                    resolve(result)
                })
            })
        })
    }
    //更新
    update(collectionName,updateDate,json){
        return new Promise((resolve,reject)=>{
            this.connect().then((res)=>{
                res.collection(collectionName).updateOne(updateDate,{$set:json},(err,result)=>{
                    if(err)reject(err)
                    resolve(result);
                })
            })
        })
    }
    //删除
    remove(collectionName,json){
        return new Promise((resolve,reject)=>{
            this.connect().then((res)=>{
                res.collection(collectionName).remove(json,true,(err,result)=>{
                    if(err)reject(err);
                    resolve(result);
                })
            })
        })
    }
    //处理id
    getID(id){  //mongodb里面查询_id把字符串转换成对象
        return new ObjectID(id);
    }
}


module.exports =  Db.getInstance();



