import { jwtDecode, JwtPayload } from "jwt-decode";
import axios from "axios";


export const api = axios.create({
  baseURL: "http://localhost:8888/api",
  withCredentials: true,
});

export const getHeader = async () => {
  let accessToken = localStorage.getItem("access_token");
  // @ts-ignore
  const decoded: JwtPayload = jwtDecode(accessToken); // Type assertion for decoded data
  // @ts-ignore
  const isExpired = Date.now() >= decoded.exp * 1000; // Check expiration in milliseconds
  if (isExpired) {
    const userId = localStorage.getItem("userId");
    const response = await api.get(`/auth/newAccessToken?userId=${userId}`);
    localStorage.removeItem("access_token");
    localStorage.setItem("access_token", response.data.accessToken);
  }

  accessToken = localStorage.getItem("access_token");
  return {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  };
};

export const getAllRootFolder = async (storageId: string) => {
  try {
    const response = await api.get(`/folder/rootFolders/${storageId}`, {
      headers: await getHeader(),
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const createRootFolder = async (storageId: string, folder: Object)=>{
  try{
    console.log(storageId)
    const response = await api.post(`/folder/root_folder/create/${storageId}`,
    folder,
    {
      headers: await getHeader()
    },
  )
    console.log("API CALLLLLL")

    console.log(response.data)
    return response.data;

  }catch (e) {
    console.log(e)
  }
}

export const sendMailPassword= async (email:string)=>{
  try{
    let user={
      email: email
    }
    const response = await  api.post(`/auth/resetPassword`, user )
    return response.data
  }catch (e) {
    console.log(e)
  }
}

