import axios from 'axios'

const Axios = axios.create({
  baseURL: '/',
  withCredentials: true,
})

export { Axios as default }
