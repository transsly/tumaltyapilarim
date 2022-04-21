const mongoose = require("mongoose");

const schema = mongoose.model('User', new mongoose.Schema({
    id: String,
    Isim: String,
    Yas: String,
    Cinsiyet: String,
    Yetkili: String,
    Email: String,
    ip: String,
    Loglar: { type: Object, default: {} },
    Toplamteyit: { type: Number, default: 0 },
    Teyitler: { type: Array, default: [] },
    Taglandı: { type: Boolean, default: false },
    Taglayan: String,
    Taglılar: { type: Object },
    Yetkilimi: { type: Boolean, default: false },
    Yetkiekleyen: String,
    Yetkililer: { type: Object },
    Kullanimlar: { type: Object, default: {} },
    Isimler: { type: Array, default: [] },
}));

module.exports = schema;

 /**
 * @param {String} id
 * @returns {Document} 
 */

 module.exports.findOrCreate = async (no) => {
    let kull = await schema.findOneAndUpdate({id: no}, {}, {setDefaultsOnInsert: true, new: true, upsert: true});
    return kull;
  }