import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = async newObject => {
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

const like = async (blog) => {
  const response = await axios.put(`${baseUrl}/${blog.id}`, { ...blog, likes: blog.likes + 1 })
  return response.data
}

const remove = async (id) => {
  console.log(token)
  const config = {
    headers: { Authorization: token },
  }

  await axios.delete(`${baseUrl}/${id}`, config)
}

export default { getAll, create, setToken, like, remove }
