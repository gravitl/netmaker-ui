
export default {
    GROUP_FIELDS: [
        "addressrange",
        "displayname",
        "nodeslastmodified",
        "grouplastmodified",
        "defaulinterface",
        "defaultlistenport",
        "defaultpostup",
        "defaultpreup",
        "defaultkeepalive",
        "defaultsaveconfig",
        "accesskeys"
    ],
    NODE_FIELDS: [
        "address",
        "name",
        "listenport",
        "publickey",
        "endpoint",
        "postup",
        "preup",
        "persistentkeepalive",
        "saveconfig",
        "interface",
        "lastmodified",
        "lastcheckin",
        "macaddress",
        "group",
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
      }
}
