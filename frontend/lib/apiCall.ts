import { jwtDecode, JwtPayload } from 'jwt-decode';
import axios from 'axios';

export const api = axios.create({
  baseURL: 'https://intelli-space-v1.azurewebsites.net/api',
  withCredentials: true,
});

export const getHeader = async () => {
  let accessToken;
  if (typeof window !== 'undefined') {
    try {
      //  console.log("....")
      accessToken = localStorage.getItem('access_token');
      if (!accessToken) return;
      const decoded: JwtPayload = jwtDecode(accessToken); // Type assertion for decoded data
      // @ts-ignore
      const isExpired = Date.now() >= decoded.exp * 1000; // Check expiration in milliseconds
      // console.log(isExpired)
      if (isExpired) {
        const userId = localStorage.getItem('userId');
        const response = await api.get(`/auth/newAccessToken?userId=${userId}`);
        if (response.data.content === 'Log out') {
          const userId = localStorage.getItem('userId');
          // console.log(userId);
          const response = await axios.get(
            `https://intelli-space-v1.azurewebsites.net/api/auth/logout/${userId}`,
          );
          // console.log(response.data);
          localStorage.removeItem('access_token');
          localStorage.removeItem('userId');
          localStorage.removeItem('storageID');
          localStorage.removeItem('folderId');
          localStorage.removeItem('parentFolder');
          localStorage.clear();
          document.cookie
            .split(';')
            .forEach(
              (c) =>
                (document.cookie = c
                  .replace(/^ +/, '')
                  .replace(
                    /=.*/,
                    `=;expires=${new Date().toUTCString()}; path=/`,
                  )),
            );
        } else {
          localStorage.removeItem('access_token');
          accessToken = response.data.accessToken;
          localStorage.setItem('access_token', accessToken);
        }
      }
    } catch (e) {
      console.log('Err', e);
    }
  }
  return {
    Authorization: `Bearer ${accessToken}`,
    // "Content-Type": "application/json",
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

export const createRootFolder = async (storageId: string, folder: Object) => {
  try {
    // console.log(storageId)
    const response = await api.post(
      `/folder/root_folder/create/${storageId}`,
      folder,
      {
        headers: await getHeader(),
      },
    );

    // console.log(response.data)
    return response.data;
  } catch (e) {
    console.log(e);
  }
};

export const sendMailPassword = async (email: string) => {
  try {
    let user = {
      email: email,
    };
    const response = await api.post(`/auth/resetPassword`, user);
    return response.data;
  } catch (e) {
    console.log(e);
  }
};

export const deleteFolder = async (storageId: string, folderId: number) => {
  try {
    const headers = await getHeader();
    const response = await api.delete(
      `/folder/delete/${storageId}?folderId=${folderId}`,
      {
        headers: headers,
      },
    );

    // console.log('Folder deleted successfully:', response.data)
    return response.data;
  } catch (error) {
    console.error('Error deleting folder:', error);
    throw error;
  }
};
export const updateFolder = async (
  storageId: string,
  folderId: string,
  newFolder: object,
) => {
  try {
    const headers = await getHeader();
    // console.log(newFolder);
    // @ts-ignore
    const response = await api.patch(
      `/folder/update/${storageId}/${folderId}`,
      newFolder,
      {
        headers: headers,
      },
    );
    return response.data;
  } catch (error) {
    console.error('Error deleting folder:', error);
    throw error;
  }
};

export const openFolder = async (
  storageId: string | null,
  folderId: string,
) => {
  try {
    const headers = await getHeader();
    const response = await api.get(
      `/folder/getFolder/${storageId}?folderId=${folderId}`,
      {
        headers: headers,
      },
    );

    return response.data;
  } catch (e) {
    console.error('Error :', e);
    throw e;
  }
};

export const createFolder = async (
  storageId: string,
  parentFolderId: string,
  newFolder: object,
) => {
  try {
    // console.log('storage Id' + storageId)
    const response = await api.post(
      `/folder/create/${storageId}/${parentFolderId}`,
      newFolder,
      {
        headers: await getHeader(),
      },
    );

    // console.log(response.data)
    return response.data;
  } catch (e) {
    console.log(e);
  }
};

export const uploadFile = async (
  userId: string | null,
  folderId: string,
  storageId: string | null,
  file: *,
) => {
  try {
    // console.log('upload file ')
    // console.log(file)
    const form = new FormData();
    form.append('file', file);

    const header = await getHeader();
    const response = await api.post(
      `/file/upload/${userId}/${folderId}/${storageId}`,
      form,
      {
        headers: header,
      },
    );
    return response.data;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const getCapacity = async (storageId: string | null) => {
  try {
    const header = await getHeader();
    const response = await api.get(
      `/storage/currentCapacity?storageId=${storageId}`,
      {
        headers: header,
      },
    );
    // console.log(response.data)

    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const softDelete = async (fileId: string) => {
  try {
    // console.log(fileId)
    const header = await getHeader();
    const response = await api.patch(
      `/file/softDelete?fileId=${fileId}`,
      {},
      {
        headers: header,
      },
    );
    return response.data;
  } catch (e) {
    console.log(e);
    throw e;
  }
};

export const getFile = async (
  fileId: string,
  fileName: string | null | undefined,
  userId: string | null,
) => {
  try {
    const header = await getHeader();
    const response = await api.get(
      `file/read/${userId}/${fileName}?fileId=${fileId}`,
      {
        headers: header,
        responseType: 'blob',
      },
    );
    return response.data;
  } catch (e) {
    console.log(e);
    throw e;
  }
};

export const deletedFile = async (storageId: string | null) => {
  try {
    const header = await getHeader();
    const response = await api.get(`file/trash/${storageId}`, {
      headers: header,
    });
    // console.log(response.data)
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const shareFolderCode = async (
  folderId: string,
  storageId: string | null,
  userId: string | null,
) => {
  try {
    const header = await getHeader();
    const response = await api.get(
      `folder/getShareCode?folderId=${folderId}&storageId=${storageId}&userId=${userId}`,
      {
        headers: header,
      },
    );
    // console.log(response.data)
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const deletePermanently = async (
  fileId: number,
  storageId: number,
  userId: number,
) => {
  try {
    const header = await getHeader();
    const response = await api.delete(
      `file/delete/${fileId}/${storageId}?userId=${userId}`,
      {
        headers: header,
      },
    );
    // console.log(response)
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
export const createNote = async (userId: string | null, note: object) => {
  try {
    // console.log(note)
    const header = await getHeader();
    const response = await api.post(`note/create/${userId}`, note, {
      headers: header,
    });
    // console.log(response)
    return response.data;
  } catch (e) {
    console.log(e);
    throw e;
  }
};

export const getAllNotes = async (userId: string | null) => {
  try {
    // console.log(userId)
    const header = await getHeader();
    const response = await api.get(`/note/${userId}`, {
      headers: header,
    });
    return response.data;
  } catch (e) {
    console.log(e);
  }
};

export const changeNoteStatus = async (noteId: string | null) => {
  try {
    const header = await getHeader();
    const response = await api.patch(
      `note/updateStatus?noteId=${noteId}`,
      {},
      {
        headers: header,
      },
    );
    return response.data;
  } catch (e) {
    console.log(e);
    throw e;
  }
};

export const deleteNote = async (noteId: string | null) => {
  try {
    const header = await getHeader();
    const response = await api.delete(`note/delete/${noteId}`, {
      headers: header,
    });
    return response.data;
  } catch (e) {
    console.log(e);
    throw e;
  }
};
export const summarizeNote = async (noteId: string | null) => {
  try {
    const header = await getHeader();
    const response = await api.patch(
      `note/sumarize/${noteId}`,
      {},
      {
        headers: header,
      },
    );
    return response.data;
  } catch (e) {
    console.log(e);
    throw e;
  }
};

export const updateNote = async (
  noteId: string | null,
  updatedNote: object,
) => {
  try {
    const header = await getHeader();
    // console.log(updatedNote)
    const response = await api.patch(`note/update/${noteId}`, updatedNote, {
      headers: header,
    });
    // console.log(response.data)
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const sendPrompt = async (prompt: string) => {
  try {
    // console.log(prompt)
    const header = await getHeader();
    const response = await api.post(
      'openai/chat',
      { prompt },
      {
        headers: header,
      },
    );
    // console.log(response.data)
    return response.data;
  } catch (error) {
    console.error('Error sending prompt:', error);
    throw error;
  }
};

export const getSharedFolder = async (code: string | null) => {
  try {
    console.log(code);
    const header = await getHeader();
    const response = await api.post(
      `folder/shared`,
      { sharedCode: code },
      { headers: header },
    );
    // console.log(response.data)
    return response.data;
  } catch (e) {
    console.log(e);
  }
};
export const downloadSharedFile = async (
  code: string | null,
  fileId: string,
  fileName: string,
) => {
  try {
    const header = await getHeader();
    const response = await api.get(
      `file/sharedFile/download?code=${code}&fileName=${fileName}&fileId=${fileId}`,
      {
        headers: header,
        responseType: 'blob',
      },
    );
    console.log(response);
    return response.data;
  } catch (error) {
    // @ts-ignore
    console.error(error.message);
    throw error;
  }
};
export const getCode = async (userId: string | null) => {
  try {
    const header = await getHeader();
    const response = await api.get(`rooms/create?userId=${userId}`, {
      headers: header,
    });
    return response.data;
  } catch (e) {
    console.log(e);
    throw e;
  }
};
