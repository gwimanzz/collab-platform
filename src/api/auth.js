import axios from 'axios';

// API 엔드포인트 설정
const apiEndpoint = 'https://tukfifjks3.execute-api.ap-northeast-2.amazonaws.com/my-collab-api';

// 로그인 API 호출
export async function loginToLambda(username, password) {
  const url = `${apiEndpoint}/user/login`;

  try {
    const response = await axios.post(url, {
      email: username,
      password: password,
    });
    const { IdToken, AccessToken, RefreshToken } = response.data;
    localStorage.setItem('IdToken', IdToken);
    localStorage.setItem('AccessToken', AccessToken);
    localStorage.setItem('RefreshToken', RefreshToken);
    return response.data;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
}

// 회원가입 API 호출
export async function signUpToLambda(username, password) {
  const url = `${apiEndpoint}/user/signup`;

  try {
    const response = await axios.post(url, {
      email: username,
      password: password,
    });
    return response.data;
  } catch (error) {
    console.error('Error signing up:', error);
    throw error;
  }
}
