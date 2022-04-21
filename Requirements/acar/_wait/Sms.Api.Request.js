const Req = require('request');

const Data = {
    KurumsalIsim: "",
    KNo: "",
    KullaniciAdi: "acar",
    Sifre: "",
    Numaralar: [""],
}

class SMS {

    /**
    * @param {content} string 
    * @param {type} string
    * @returns {Promise<void>}
    */

    static Send(content, type = "VatanSMS") {
        switch (type) { 
            case "VatanSMS": {
                return Req({method: "GET", 
                    url: `http://panel.vatansms.com/panel/smsgonder1N.php?kno=${Data.KNo}&kul_ad=${Data.KullaniciAdi}&sifre=${Data.Sifre}&gonderen=${Data.KurumsalIsim}&mesaj=${content}&numaralar=${Data.Numaralar}&tur=Normal` 
                })
            };
        }
    }
}
module.exports = { SMS }

