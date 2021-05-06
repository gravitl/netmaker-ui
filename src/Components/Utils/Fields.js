
export default {
    NETWORK_FIELDS: [
        "addressrange",
        "addressrange6",
        "localrange",
        "displayname",
        "nodeslastmodified",
        "networklastmodified",
        "defaultinterface",
        "defaultlistenport",
        "defaultpostup",
        "defaultpostdown",
        "defaultkeepalive",
        "defaultcheckininterval",
        "isdualstack",
        "defaultsaveconfig",
        "accesskeys",
    ],
    NODE_FIELDS: [
        "address",
        "address6",
        "name",
        "listenport",
        "publickey",
        "endpoint",
        "expdatetime",
        "postup",
        "postdown",
        "persistentkeepalive",
        "saveconfig",
        "interface",
        "lastmodified",
        "lastcheckin",
        "macaddress",
        "network",
        "localaddress"
    ],
    timeConverter: (UNIX_timestamp) => {
        const a = new Date(UNIX_timestamp * 1000);
        const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        const year = a.getFullYear();
        const month = months[a.getMonth()];
        const date = a.getDate();
        const hour = a.getHours();
        const min = a.getMinutes();
        const sec = a.getSeconds();
        const time = date + ' ' + month + ', ' + year + ' - ' + hour + ':' + min + ':' + sec ;
        return time;
      },
      datePickerConverter: (UNIX_timestamp) => {
        const a = new Date(UNIX_timestamp * 1000);
        // const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        const year = a.getFullYear();
        const month = a.getMonth() < 10 ? '0' + a.getMonth() : a.getMonth();
        const date = a.getDate() < 10 ? '0' + a.getDate() : a.getDate();
        const hour = a.getHours() < 10 ? '0' + a.getHours() : a.getHours();
        const min = a.getMinutes() < 10 ? '0' + a.getMinutes() : a.getMinutes();
        const time = year + '-' + month + '-' + date + 'T' + hour + ':' + min ;
        return time;
      },
      makeKey: function makeid(length) {
        let result           = [];
        let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let charactersLength = characters.length;
        for ( let i = 0; i < length; i++ ) {
            result.push(characters.charAt(Math.floor(Math.random() * 
            charactersLength)));
       }
       return result.join('');
    }
}
