import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // jwt-decode 패키지의 named export인 jwtDecode를 import

const apiEndpoint = '/api_localhost3000';


// getAuthToken 함수는 실제 JWT 토큰을 반환하도록 구현되어야 합니다
function getAuthToken() {
  // 예제: 로컬 스토리지에서 토큰을 가져오는 경우
  return localStorage.getItem('authToken');
}

// 아이디 토큰 가져오기
function getIdToken() {
  return localStorage.getItem('IdToken'); // 예시로 localStorage에서 토큰을 가져오는 방법입니다.
}

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
    const idToken = getIdToken(); // 인증 토큰 가져오기
   
    // 토큰 디코딩
    const decodedToken = jwtDecode(idToken);
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
        Authorization: `Bearer ${idToken}`, // 인증 헤더 추가
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


// 파일 리스트를 가져오는 함수 (서버에서 모든 파일 목록을 가져옴)
export async function fetchAllFiles() {
  const url = `${apiEndpoint}/file/list`;
  
  try {
    const response = await axios.get(url);
    
    if (response.status === 200) {
      const responseBody = JSON.parse(response.data.body); // "body" 문자열을 객체로 파싱
      const fileList = responseBody.files;
      const totalCount = responseBody.totalCount;
      
      
      
      return { files: fileList, totalCount };
    } else {
      throw new Error(response.data.message || '파일 목록을 불러오는 데 실패했습니다.');
    }
  } catch (error) {
    console.error('파일 목록을 불러오는 중 오류 발생:', error);
    alert('파일 목록을 불러오는 데 실패했습니다. 다시 시도해 주세요.');
    throw error;
  }
}


// 파일 삭제 API 호출 함수
export async function deleteFile(file_name_S3, user_id, timestamp) {
  const url = `${apiEndpoint}/file/delete`;
  console.log(file_name_S3)
  console.log(user_id)
  console.log(timestamp)
  try {
    const idToken = getIdToken();
    console.log(idToken)

    if (!idToken) {
      throw new Error('Missing authentication token');
    }

    const response = await axios({
      method: 'delete', // DELETE 메서드로 설정
      url: url,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`,
      },
      data: {  // 이 부분에서 요청 데이터를 JSON으로 전송합니다
        httpMethod: 'DELETE',  // 요청에서 httpMethod을 명시적으로 지정합니다
        headers: {
          'file-name': file_name_S3,
          'user-id': user_id,
          'timestamp': timestamp
        }
      }
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
export async function downloadFile(file_name_S3) {
  const url = `${apiEndpoint}/file/download`;

  try {
    // Lambda 함수에 전송할 데이터
    const requestData = {
      file_name: file_name_S3
    };

    // Lambda 함수 호출
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestData)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    // Base64 인코딩된 파일 내용 가져오기
    const responseData = await response.json();
    const encodedContent = responseData.body;

    // Base64 디코딩하여 Blob 객체 생성
    const byteCharacters = atob(encodedContent);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray]);

    // 파일 다운로드 (브라우저 환경 기준)
    const downloadUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;

    // 파일 이름 변경 로직
    const fileNameParts = file_name_S3.split('_');
    const newFileName = fileNameParts.slice(1).join('_'); // '_' 이후의 모든 부분을 합쳐서 새로운 파일 이름으로 설정

    link.download = newFileName;

    // 링크를 body에 추가하고 클릭하여 다운로드 실행
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    console.log('파일 다운로드 및 이름 변경 완료:', newFileName);
  } catch (error) {
    console.error('파일 다운로드 중 오류 발생:', error);
  }
}
