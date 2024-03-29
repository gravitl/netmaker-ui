export interface LanguageResource {
  pro: {
    logs: string
    refresh: string
    metrics: string
    admin: string
    admintools: string
    nometrics: string
    choose: string
    extmetrics: string
    metrickeys: {
      latency: string
      uptime: string
      totaltime: string
      percentup: string
      connected: string
      totalsent: string
      totalreceived: string
      syncmetrics: string
      lessthanone: string
      datasent: string
      datareceived: string
      peerconnections: string
    }
    label: {
      usergroup: string
      usergroups: string
      networkuser: string
      networkusers: string
      selectnetwork: string
      welcome: string
      welcomecard: string
      networknumber: string
      vpnaccess: string
      clientconfig: string
      userpermissions: string
    }
    networkusers: {
      none: string
      deleteconfirm: string
      accesslevel: string
      nodelimit: string
      clientlimit: string
      groups: string
      nodes: string
      clients: string
    }
    network: {
      defaultaccesslevel: string
      defaultusernodelimit: string
      defaultuserclientlimit: string
      allowedusers: string
      allowedgroups: string
      networkedit: string
      managenetwork: string
    }
    helpers: {
      accesslevel: string
      usernodelimit: string
      userclientlimit: string
      failover: string
      noclients: string
    }
  }
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
    acls: string
  }
  acls: {
    acls: string
    nodes: string
    nodeview: string
    networkview: string
    aclicon: string
    nodesconfirm: string
    nodeconfirm: string
    viewall: string
    allowall: string
    blockall: string
    fullname: string
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
    clientjoin: string
    manual: string
    joincommand: string
    clickinstall: string
    joinloginbasic: string
    joinloginoauth: string
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
    acls: string
    userdashboard: string
    netadmindashboard: string
    nodeuserdashboard: string
    hosts: string
  }
  common: Record<string, string>
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
  error: Record<string, string>
  extclient: {
    extclients: string
    extclient: string
    create: string
    disabled: string
    delete: string
    viewing: string
    none: string
    name: string
    deleteconfirm: string
    changeconfirm: string
    download: string
    viewqr: string
    clientid: string
    qr: string
    edit: string
    enabled: string
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
    defaultnatenabled: string
    islocal: string
    ispointtosite: string
    defaultacl: string
    ipv4: string
    ipv6: string
    whatisipv4: string
    whatisipv6: string
    localrange: string
    defaultinterface: string
    defaultlistenport: string
    defaultpostup: string
    defaultpostdown: string
    keepalive: string
    extclient: string
    mtu: string
    nokeysignup: string
    pointtosite: string
    defaultaccesscontrol: string
    dynamicendpoint: string
    dynamicport: string
    localaddress: string
    nodename: string
    publickey: string
    nodepostup: string
    nodepostdown: string
    allowedips: string
    persistentkeepalive: string
    relayaddress: string
    nodeexpires: string
    lastcheckin: string
    macaddress: string
    network: string
    egressrange: string
    nodeos: string
    nodelocalrange: string
    isdnson: string
    networkhub: string
    nodeislocal: string
    isnodeconnected: string
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
    defaultnatenabled: string
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
    commswarn: string
    none: string
    defaultacl: string
    isipv6: string
    isipv4: string
    validation: {
      ipv4: string
      ipv6: string
      accesslevel: string
      nodelimit: string
      clientlimit: string
      netidcheck: string
    }
  }
  node: {
    hostname: string
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
    isingressrelay: string
    isegressrelay: string
    isrelayed: string
    ishub: string
    defaultacl: string
    onehub: string
    createhub: string
    updatenode: string
    endpointenable: string
    endpointdisable: string
    healthy: string
    error: string
    warning: string
    connected: string
    togglenode: string
    validation: {
      relayaddress: string
      egressgatewayrange: string
    }
    state: {
      error: string
      warning: string
      normal: string
      healthy: string
    }
    nodevisual: string
    version: string
    addresses: string
    udpdisabled: string
    failover: string
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
      groupname: string
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
    warnings: Record<string, string>
    update: {
      success: {
        node: string
        extclient: string
        networkrefresh: string
        user: string
        approve: string
        nodeacl: string
        networkuser: string
        host: string
      }
      failure: {
        node: string
        extclient: string
        networkrefresh: string
        user: string
        approve: string
        nodeacl: string
        networkuser: string
        host: string
      }
    }
    create: {
      success: {
        enrollmentkey: string
        enrollmentkeys: string
        accesskey: string
        egress: string
        ingress: string
        relay: string
        extclient: string
        dns: string
        user: string
        admin: string
        usergroup: string
        failover: string
        hostrelay: string
      }
      failure: {
        enrollmentkey: string
        enrollmentkeys: string
        accesskey: string
        egress: string
        ingress: string
        relay: string
        extclient: string
        dns: string
        user: string
        admin: string
        usergroup: string
        failover: string
        hostrelay: string
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
        usergroups: string
        networkuser: string
        host: string
        hostrelay: string
        enrollmentkey: string
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
        usergroups: string
        networkuser: string
        host: string
        hostalt: string
        hostrelay: string
        enrollmentkey: string
      }
    }
    login: {
      success: string
      failure: string
    }
  }
  hosts: Record<string, string>
  enrollmentkeys: Record<string, string>
}
