const validNetworkNames = [
    "network",
    "net",
    "dev",
    "dev-net",
    "office",
    "office-vpn",
    "netmaker-vpn",
    "securoserv",
    "quick",
    "long",
    "private",
    "my-net",
    "it-dept",
    "test-net",
    "kube-net",
]

export const genRandomNumber = (size: number, inclusive: boolean) => {
    if (inclusive) {
        return Math.floor(Math.random() * size + 1)
    }
    return Math.floor(Math.random() * size)
}

export const randomCIDR = () => `10.${genRandomNumber(254, true)}.${genRandomNumber(254, true)}.0/24`

export const randomNetworkName = () => validNetworkNames[genRandomNumber(validNetworkNames.length, false)]

export const copy = (text: string) => navigator.clipboard.writeText(text)
