import axios from "axios"

export const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000",
})

export function axiosMultipart() {
  return axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000",
    headers: { "Content-Type": "multipart/form-data" },
  })
}
