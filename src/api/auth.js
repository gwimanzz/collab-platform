import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // jwt-decode 패키지의 named export인 jwtDecode를 import

const apiEndpoint = '/api_localhost3000';

// 로그인 API 호출
export async function loginToLambda(username, password) {
  const url = `${apiEndpoint}/user/login`;

  try {
    const response = await axios.post(
      url,
      {
        body: JSON.stringify({
          email: username,
          password: password,
        }),
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('Response status:', response.status);
    console.log('Response data:', response.data);

    if (response.status === 200) {
      const parsedBody = JSON.parse(response.data.body);
      console.log('Parsed body:', parsedBody);

      if (parsedBody.statusCode === 401) {
        throw new Error(parsedBody.body || 'Incorrect username or password');
      }

      const { AuthenticationResult } = parsedBody;
      if (!AuthenticationResult || !AuthenticationResult.IdToken) {
        throw new Error('Missing token data');
      }

      const { IdToken, AccessToken, RefreshToken } = AuthenticationResult;

      localStorage.setItem('IdToken', IdToken);
      localStorage.setItem('AccessToken', AccessToken);
      localStorage.setItem('RefreshToken', RefreshToken);

      return parsedBody;
    } else {
      throw new Error(response.data.message || 'Login failed');
    }
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
}

// 회원가입 API 호출
export async function signUpToLambda(email, password, phone_number, nickname) {
  const url = `${apiEndpoint}/user/signup`;

  try {
    const response = await axios.post(
      url,
      {
        body: JSON.stringify({
          email,
          password,
          phone_number,
          nickname,
        }),
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

// 인증 코드 확인 API 호출 함수
export async function verifyEmailCode() {
  const email = localStorage.getItem('signedUpEmail'); // 로컬 스토리지에서 회원 가입 이메일 가져오기
  const code = localStorage.getItem('verificationCode');
  console.log('Email:', email);
  console.log('Code:', code);

  const url = `${apiEndpoint}/user/emailcheck`;
  const authToken = getAuthToken(); // 인증 토큰 가져오기

  console.log('AuthToken:', authToken);
  console.log('URL:', url);

  try {
    const response = await axios.post(
      url,
      {
        body: JSON.stringify({
          email: email,
          confirmation_code: code,
        }),
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`, // JWT 토큰을 헤더에 포함
        },
      }
    );

    console.log('Response status:', response.status);
    console.log('Response data:', response.data);

    return response.data; // API 응답 데이터 반환
  } catch (error) {
    console.error('Error verifying email code:', error);

    // 추가적인 에러 정보를 출력
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
      console.error('Response headers:', error.response.headers);
    } else if (error.request) {
      console.error('Request data:', error.request);
    } else {
      console.error('Error message:', error.message);
    }

    throw error; // 에러 처리: 콘솔에 로깅하고 예외를 다시 던짐
  }
}

// getAuthToken 함수는 실제 JWT 토큰을 반환하도록 구현되어야 합니다
function getAuthToken() {
  // 예제: 로컬 스토리지에서 토큰을 가져오는 경우
  return localStorage.getItem('authToken');
}

// 아이디 토큰 가져오기
function getIdToken() {
  return localStorage.getItem('IdToken'); // 예시로 localStorage에서 토큰을 가져오는 방법입니다.
}

// 파일을 base64로 인코딩하는 함수
function encodeFileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = error => reject(error);
    reader.readAsDataURL(file);
  });
}

// 파일 업로드 함수 수정
export async function uploadFile(file) {
  const url = `${apiEndpoint}/file/upload`;

  try {
    const base64Content = await encodeFileToBase64(file);
    const authToken = getIdToken(); // 인증 토큰 가져오기

    // 토큰 디코딩
    const decodedToken = jwtDecode(authToken);
    const nickname = decodedToken.nickname || 'Unknown'; // 토큰에서 닉네임 속성 가져오기

    const jsonData = {
      body: base64Content,
      headers: {
        'file-name': file.name,
        'nickname': nickname,
      },
    };

    const response = await axios.post(url, jsonData, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`, // 인증 헤더 추가
      },
    });

    console.log('응답 상태:', response.status);
    console.log('응답 데이터:', response.data);

    return response.data;
  } catch (error) {
    console.error('파일 업로드 오류:', error.response); // error.response를 출력하여 서버에서 전달된 오류 상세를 확인합니다.
    alert('파일 업로드 실패. 다시 시도해주세요.');
    throw error;
  }
}


// 파일 리스트를 가져오는 함수 (페이징 추가)
export async function fetchFileList(page = 1, pageSize = 10) {
  const url = `${apiEndpoint}/files/list`; // 파일 리스트를 가져오는 엔드포인트
  const offset = (page - 1) * pageSize;

  try {
    const response = await axios.get(url, {
      params: {
        offset: offset,
        limit: pageSize,
      },
    });

    if (response.status === 200) {
      const fileList = response.data; // Lambda 함수에서 반환된 파일 리스트

      // 파일 리스트를 UI에 출력
      renderFileList(fileList);

      return fileList;
    } else {
      throw new Error(response.data.message || 'Failed to fetch file list');
    }
  } catch (error) {
    console.error('Error fetching file list:', error);
    alert('Failed to fetch file list. Please try again.');
    throw error;
  }
}

// 파일 리스트를 UI에 렌더링하는 함수 (예시: HTML 테이블에 넣기)
function renderFileList(fileList) {
  const table = document.createElement('table');
  table.innerHTML = `
    <thead>
      <tr>
        <th>User Name</th>
        <th>File Name</th>
        <th>File Type</th>
        <th>Size</th>
        <th>Last Modified</th>
      </tr>
    </thead>
    <tbody>
      ${fileList.map(file => `
        <tr>
        <td>${file.user_id}</td>
        <td>${file.file_name}</td>
        <td>${file.file_type}</td>
        <td>${file.size}</td>
        <td>${file.last_modified}</td>
        </tr>
      `).join('')}
    </tbody>
  `;
  
  // 페이지의 적절한 위치에 추가
  const fileListContainer = document.getElementById('fileListContainer');
  fileListContainer.innerHTML = '';
  fileListContainer.appendChild(table);
}


// 파일 삭제
export async function deleteFile(filename) {
  const url = `${apiEndpoint}/file/delete`;

  try {
    const authToken = getAuthToken();

    if (!authToken) {
      throw new Error('Missing authentication token');
    }

    const response = await axios.delete(url, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      data: { filename } // Use 'data' instead of 'params' for DELETE method
    });

    console.log('Response status:', response.status);
    console.log('Response data:', response.data);

    return response.data;
  } catch (error) {
    console.error('Error deleting file:', error);
    alert('File deletion failed. Please try again.');
    throw error;
  }
}

// 파일 다운로드
export async function downloadFile(filename) {
  const url = `${apiEndpoint}/file/download`;

  try {
    const authToken = getAuthToken();

    if (!authToken) {
      throw new Error('Missing authentication token');
    }

    const response = await axios.post(url, { filename }, {
      responseType: 'blob',
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    const downloadUrl = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();

    console.log('File downloaded successfully');
  } catch (error) {
    console.error('Error downloading file:', error);
    alert('File download failed. Please try again.');
    throw error;
  }
}
