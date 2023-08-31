const express = require('express');
const {connectToDb, getDb} = require('./db');
const { ObjectId } = require('mongodb');
const app = express();

app.use(express.json())

let db;

connectToDb((err) =>{
    if(!err){
        app.listen(3000, () => {
            console.log('Uygulama 3000.portta calisiyor') // error yoksa , 3000.portta çalışacak
        } )

        db = getDb() // dataBase bilgisini yükledik

    }else{
            console.log("veri dinlenemiyor")
    }
    
})

app.get('/api', (req,res) => {
    let kitaplar = [];
    const sayfa = req.query.s || 0
    const sayfaVeriAdet = 3;
    db.collection('kitaplar')
       .find()
       .skip(sayfa*sayfaVeriAdet)
       .limit(sayfaVeriAdet)
       .forEach(kitap => kitaplar.push(kitap))
       .then(() => {
        res.status(200).json(kitaplar)
       })
       .catch(() => {
        res.status(500).json({hata:'verilere erisilemedi'})
       })
})



app.post('/api',(req,res) => {
    const kitap = req.body;

    db.collection('kitaplar')
        .insertOne(kitap)
        .then(sonuc => {
            res.status(201).json(sonuc)
        })
        .catch(err => {
            res.status(500).json({hata: 'Veri eklenemedi'})
        })

})



app.delete('/api/:id',(req,res) => {
    if(ObjectId.isValid(req.params.id)){ // Bu ifade, verilen req.params.id değerinin geçerli bir MongoDB ObjectId formatında olup olmadığını kontrol eder. Geçerli bir ObjectId formatında değilse bu işlev false döner,
        db.collection('kitaplar')
          .deleteOne({_id: new ObjectId(req.params.id)})
            .then(sonuc => {
                res.status(200).json(sonuc)
            })
            .catch(err => {
                res.status(500).json({hata:'Veri silinemedi'})
            })
    }else{
        res.status(500).json({hata:"Id geçerli değil"})
    }
})


app.get('/api/:id',(req,res) => {
    if(ObjectId.isValid(req.params.id)){ // Bu ifade, verilen req.params.id değerinin geçerli bir MongoDB ObjectId formatında olup olmadığını kontrol eder. Geçerli bir ObjectId formatında değilse bu işlev false döner,
        db.collection('kitaplar')
          .findOne({_id: new ObjectId(req.params.id)})
            .then(sonuc => {
                res.status(200).json(sonuc)
            })
            .catch(err => {
                res.status(500).json({hata:'Veri ye erisilemedi'})
            })
    }else{
        res.status(500).json({hata:"Id geçerli değil"})
    }
})




app.patch('/api/:id',(req,res) => {
    const guncellenecekVeri = req.body;
    if(ObjectId.isValid(req.params.id)){ // Bu ifade, verilen req.params.id değerinin geçerli bir MongoDB ObjectId formatında olup olmadığını kontrol eder. Geçerli bir ObjectId formatında değilse bu işlev false döner,
        db.collection('kitaplar')
          .updateOne({_id: new ObjectId(req.params.id)},{$set:guncellenecekVeri})
            .then(sonuc => {
                res.status(200).json(sonuc)
            })
            .catch(err => {
                res.status(500).json({hata:'Veri güncellenemedi'})
            })
    }else{
        res.status(500).json({hata:"Id geçerli değil"})
    }

})



// req.params bir nesne döndürür. 
//Bu nesne, rotada tanımlanan parametrelerin isimlerini anahtar olarak 
//ve bu parametrelere karşılık gelen değerleri de değer olarak içerir

//req.params = {
//    id: "12345"
//  }


//req.params = {
//    category: "science",
//    title: "space-exploration"
// }


