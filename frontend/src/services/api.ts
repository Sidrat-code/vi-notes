import axios from 'axios'

const API = axios.create({
  baseURL: 'http://localhost:5000/api'
})

export const documentService = {
  save: (data: {
    title: string
    content: string
    pasteEvents: any[]
    wordCount: number
  }) => API.post('/documents', data),
}