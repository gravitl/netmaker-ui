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
    dockerrun: string
    windows: string
    clientinstall: string
    manual: string
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
    graphs: string
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
    selectall: string
    count: string
    search: string
    pending: string
    cidr: string
    type: string
    max: string
    min: string
    chars: string
    optional: string
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
    title: string
    disabled: string
    default: string
    custom: string
    address: string
    name: string
    nodeaddress: string
  }
  error: {
    notfound: string
    network: string
    tokenexpire: string
    unauthorized: string
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
    download: string
    viewqr: string
    clientid: string
    qr: string
    edit: string
  }
  ingress: {
    none: string
    add: string
    name: string
    gateways: string
    clients: string
    view: string
  }
  helper: {
    egress: string
    egressiface: string
    udpholepunching: string
    islocal: string
    ispointtosite: string
  }
  network: {
    allowmanualsignup: string
    networks: string
    network: string
    addressrange: string
    addressrange6: string
    localrange: string
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
    ispointtosite: string
    defaultsaveconfig: string
    accesskeys: string
    defaultudpholepunch: string
    islocal: string
    create: string
    netid: string
    deleteconfirm: string
    refresh: string
    details: string
    refreshconfirm: string
    graphs: string
    graphview: string
    graph: string
    iscomms: string
    commswarn: string
  }
  node: {
    nodes: string
    node: string
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
    statushub: string
    confirmrelay: string
    confirmingress: string
    confirmegress: string
    deleteconfirm: string
    choose: string
    details: string
    sync: string
    pendingApproval: string
    approve: string
    approveconfirm: string
    none: string
    isingressegress: string
    isingressegressrelay: string
    isrelayed: string
    ishub: string
    onehub: string
    createhub: string
    updatenode: string
    state: {
      error: string
      warning: string
      normal: string
      healthy: string
    }
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
      failed: string
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
    delete: string
    edit: string
    details: string
    deleteTitle: string
    networks: {
      create: string
      delete: string
      edit: string
    }
    label: {
      password: string
      confirmation: string
      username: string
    }
    validation: {
      username: string
      password: string
      confirmation: string
    }
    update: {
      header: string
      password: string
      passwordTitle: string
      passwordSubmit: string
      adminSubmit: string
      submit: string
      isAdmin: string
      networks: string
      isAdminTitle: string
      createAdmin: string
    }
    table: {
      name: string
      isAdmin: string
      networks: string
    }
    create: {
      button: string
      isAdmin: string
      networks: string
      createAdmin: string
      isAdminTitle: string
    }
  }
  toast: {
    pending: string
    update: {
      success: {
        node: string
        extclient: string
        networkrefresh: string
        user: string
        approve: string
      }
      failure: {
        node: string
        extclient: string
        networkrefresh: string
        user: string
        approve: string
      }
    }
    create: {
      success: {
        accesskey: string
        egress: string
        ingress: string
        relay: string
        extclient: string
        dns: string
        user: string
        admin: string
      }
      failure: {
        accesskey: string
        egress: string
        ingress: string
        relay: string
        extclient: string
        dns: string
        user: string
        admin: string
      }
    }
    delete: {
      success: {
        accesskey: string
        egress: string
        ingress: string
        relay: string
        extclient: string
        dns: string
        user: string
        node: string
      }
      failure: {
        accesskey: string
        egress: string
        ingress: string
        relay: string
        extclient: string
        dns: string
        user: string
        node: string
      }
    }
    login: {
      success: string
      failure: string
    }
  }
}
