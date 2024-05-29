import { useGoogleLogin } from '@react-oauth/google';
import { Button } from '@/components/auth_ui/Button';
import { FcGoogle } from 'react-icons/fc';
import React from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { setStorageID } from '@/lib/features/todos/storageSlice';
import { AppDispatch } from '@/lib/store'; // Import storage actions

export const CustomButton = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const login = useGoogleLogin({
    onSuccess: async (codeResponse) => {
      // console.log(codeResponse)
      const response = await axios.get(
        `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${codeResponse.access_token}`,
      );
      // console.log(response.data)
      const loginResponse = await axios.get(
        `http://localhost:8888/api/auth/oauth2/login?name=${response.data.family_name}&email=${response.data.email}`,
      );
      // console.log(loginResponse.data)
      localStorage.setItem('access_token', loginResponse.data.accessToken);
      document.cookie = `refreshToken=${loginResponse.data.refreshToken}`;
      localStorage.setItem('userId', loginResponse.data.user.id);
      localStorage.setItem('storageID', loginResponse.data.storageId);
      // console.log(loginResponse.data.storageId)
      dispatch(setStorageID(loginResponse.data.storageId));
      localStorage.setItem('storageID', loginResponse.data.storageId);

      router.push('/dashboard');
    },
    prompt: 'select_account',
    onError: () => {
      console.log('Login failed');
    },
  });

  return (
    <div>
      <Button
        className="socialFormBtn hoverScale"
        onClick={() => {
          login();
        }}
      >
        <FcGoogle className="w-10 h-10" />
      </Button>
    </div>
  );
};
