import ls from 'local-storage'
import axios from 'axios'
import jwt from 'jwt-decode'
import Common from '../../Common'

const API = axios.create({
	baseURL: `${Common.BACKEND_URL}/api/users`
})

const USER_KEY = "netmaker-user"

export default {
    getUser: (setUser, setNeedsLogin) => {
        const userData = ls.get(USER_KEY)
        if (userData) {
            const user = JSON.parse(userData)
            if ((Date.now() / 1000) >= user.expiration) {
                ls.remove(USER_KEY);
                setUser(null);
                setNeedsLogin(true);
            } else {
                setUser(user)
                setNeedsLogin(false)
            }
        } else {
            setUser(null)
            setNeedsLogin(true)
        }
    },
    getAllUsers: async (token, setUsers) => {
        try {
            const usersResponse = await API.get('', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            })
            setUsers(usersResponse.data)
            return usersResponse.data
        } catch (err) {
            setUsers([])
            return false
        }
    },
    deleteUser: async (token, username) => {
        try {
            const userResponse = await API.delete(`/${username}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            })
            return userResponse
        } catch (err) {
            return false
        }
    },
    authenticate: async (username, password) => {
        try {
            const userdata = await API.post('/adm/authenticate', { username, password })
            if (userdata.status === 200) {
                const decoded = jwt(userdata.data.Response.AuthToken)
                const userdata2 = await API.get(`/${username}`, {headers: {
                    'Authorization': `Bearer ${userdata.data.Response.AuthToken}`
                }})
                if (userdata2.status === 200 && userdata2.data && userdata2.data.isadmin) {
                    ls.set(USER_KEY, JSON.stringify({username: userdata.data.Response.UserName, expiration: decoded.exp, token: userdata.data.Response.AuthToken, isadmin: true}))
                } else {
                    ls.set(USER_KEY, JSON.stringify({username: userdata.data.Response.UserName, expiration: decoded.exp, token: userdata.data.Response.AuthToken, isadmin: false}))
                } 
            }
            return userdata.data.Response
        } catch (err) {
            return false
        }
    },
    createRegularUser: async (token, username, password, networks) => {
        try {
            const userResponse = await API.post(`/${username}`, {username, password, networks}, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-type': 'application/json',
                }
            });
            return userResponse
        } catch(err) {
            return false
        }
    },
    decode: (username, token) => {
        if (!username || !token) {
            return false
        }
        try {
            const decoded = jwt(token)
            ls.set(USER_KEY, JSON.stringify({username, expiration: decoded.exp, token}))
            return true
        } catch (err) {
            return false
        }
    },
    update: async (username, password) => {
        try {
            const oldUserData = ls.get(USER_KEY)
            if (oldUserData) {
                const oldUser = JSON.parse(oldUserData)
                const userdata = await API.put(`/${oldUser.username}`, { username, password }, { headers: {
                    'Authorization': `Bearer ${oldUser.token}`
                } })
                if (userdata.status === 200) {
                    // console.log(userdata.data.Response.AuthToken)
                    ls.set(USER_KEY, JSON.stringify({username: username, expiration: oldUser.expiration, token: oldUser.token}))
                    return userdata.data
                } else {
                    return false
                }
            } else return false
        } catch (err) {
            return false
        }
    },
    logout: (setUser, setNeedsLogin) => {
        ls.remove(USER_KEY)
        setUser(null)
        setNeedsLogin(true)
    },
    createAdmin: async (username, password) => {
        return (await API.post('/adm/createadmin', {
            username,
            password
        }, {headers: {}}))
    },
    hasAdmin: callback => {
        API.get('/adm/hasadmin', { headers: {} })
            .then(response => {
                if (response.status === 200) {
                    callback(response.data)
                } else {
                    callback(false)
                }
            }).catch(err => {
                callback(false, err)
            })
    },
    getParameterByName: (name, url = window.location.href) => {
        name = name.replace(/\[\]]/g, '\\$&');
        var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
      }
}