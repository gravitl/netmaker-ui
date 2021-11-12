export interface LanguageResource {
  header: {
    login: string
    logout: string
    docs: string
    networks: string
    nodes: string
    accessKeys: string
    dns: string
    externalClients: string
    users: string
  }
  accesskey: {
    accesskeys: string
    accesskey: string
    create: string
    delete: string
    viewing: string
    usesremaining: string
    none: string
    name: string
    uses: string
    deleteconfirm: string
    details: string
    accessToken: string
    installCommand: string
  }
  breadcrumbs: {
    home: string
    networks: string
    nodes: string
    edit: string
    accessKeys: string
    extClients: string
    users: string
    dns: string
    dashboard: string
    createegress: string
    createrelay: string
  }
  common: {
    disabled: string
    notFound: string
    version: string
    server: string
    delete: string
    cancel: string
    save: string
    submit: string
    reset: string
    edit: string
    create: string
    accept: string
    view: string
    autofill: string
    manage: string
    select: string
    name: string
    copy: string
  }
  dashboard: {
    title: string
  }
  dialog: {
    title: string
    deleteNetwork: string
    confirm: string
    cancel: string
  }
  dns: {
    dns: string
    create: string
    delete: string
    viewing: string
    none: string
    entry: string
    deleteconfirm: string
  }
  error: {
    notfound: string
  }
  extclient: {
    extclients: string
    extclient: string
    create: string
    delete: string
    viewing: string
    none: string
    name: string
    deleteconfirm: string
  }
  helper: {
    egress: string
    egressiface: string
  }
  network: {
    allowmanualsignup: string
    networks: string
    network: string
    addressrange: string
    addressrange6: string
    localrange: string
    displayname: string
    nodeslastmodified: string
    networklastmodified: string
    defaultinterface: string
    defaultlistenport: string
    defaultpostup: string
    defaultpostdown: string
    defaultkeepalive: string
    checkininterval: string
    defaultextclientdns: string
    defaultmtu: string
    isdualstack: string
    defaultsaveconfig: string
    accesskeys: string
    defaultudpholepunch: string
    islocal: string
    create: string
    netid: string
    deleteconfirm: string
  }
  node: {
    nodes: string
    id: string
    accesskey: string
    lastpeerupdate: string
    keyupdatetimestamp: string
    checkininterval: string
    ispending: string
    action: string
    localrange: string
    isingressgateway: string
    isegressgateway: string
    isrelay: string
    pullchanges: string
    dnson: string
    isdualstack: string
    ipforwarding: string
    roaming: string
    islocal: string
    isserver: string
    ingressgatewayrange: string
    address: string
    address6: string
    name: string
    listenport: string
    publickey: string
    endpoint: string
    expdatetime: string
    postup: string
    postdown: string
    persistentkeepalive: string
    saveconfig: string
    interface: string
    lastmodified: string
    lastcheckin: string
    macaddress: string
    network: string
    localaddress: string
    egressgatewayranges: string
    allowedips: string
    udpholepunch: string
    isstatic: string
    mtu: string
    relayaddrs: string
    os: string
    status: string
    createegress: string
    createingress: string
    createrelay: string
    removeegress: string
    removeingress: string
    removerelay: string
    statusegress: string
    statusingress: string
    statusrelay: string
    confirmrelay: string
    confirmingress: string
    confirmegress: string
    deleteconfirm: string
  }
  login: {
    validation: {
      username: string
      password: string
      confirmation: string
    }
    label: {
      username: string
      password: string
      confirmation: string
    }
    oauth: {
      login: string
    }
    admin: {
      create: string
      creating: string
    }
    header: string
    login: string
    loginFailed: string
    logout: string
  }
  users: {
    header: string
    create: string
    delete: string
    edit: string
    details: string
    networks: {
      create: string
      delete: string
      edit: string
    }
  }
  toast: {
    pending: string,
    update: {
      success: {
        node: string
      }
      failure: {
        node: string
      }
    },
    create: {
      success: {
        egress: string
      }
      failure: {
        egress: string
      }
    }
  }
}
