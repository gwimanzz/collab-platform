import axios from 'axios';

const apiEndpoint = '/api_localhost3000';

// 로그인 API 호출
export async function loginToLambda(username, password) {
  const url = `${apiEndpoint}/user/login`;

  try {
    const response = await axios.post(
      url,
      {
        email: username,
        password: password,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('Response status:', response.status);
    console.log('Response data:', response.data);

    const { statusCode, body } = response.data;

    // JSON 형태의 body 파싱
    const parsedBody = JSON.parse(body);
    console.log('Parsed body:', parsedBody);

    if (statusCode === 401) {
      throw new Error(parsedBody || 'Incorrect username or password');
    }

    if (!parsedBody.AuthenticationResult || !parsedBody.AuthenticationResult.IdToken) {
      throw new Error('Missing token data');
    }

    const { AuthenticationResult } = parsedBody;
    const { IdToken, AccessToken, RefreshToken } = AuthenticationResult;

    // 토큰을 로컬 스토리지에 저장
    localStorage.setItem('IdToken', IdToken);
    localStorage.setItem('AccessToken', AccessToken);
    localStorage.setItem('RefreshToken', RefreshToken);

    return parsedBody;
  } catch (error) {
    console.error('Error logging in:', error.message);
    alert('Login failed. Please check your credentials and try again.');
    throw error;
  }
}

// 회원가입 API 호출
export async function signUpToLambda(username, password) {
  const url = `${apiEndpoint}/user/signup`;

  try {
    const response = await axios.post(
      url,
      {
        email: username,
        password: password,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('Response status:', response.status);
    console.log('Response data:', response.data);

    return response.data;
  } catch (error) {
    console.error('Error signing up:', error);
    alert('Signup failed. Please try again.');
    throw error;
  }
}
