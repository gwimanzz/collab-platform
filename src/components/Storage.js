import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { uploadFile, deleteFile, downloadFile } from '../api/auth';

function FileManagement() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    fetchFileList();
  }, []);

  const fetchFileList = async () => {
    const apiEndpoint = '/api_localhost3000';
    const url = `${apiEndpoint}/file/list`;

    try {
      const response = await axios.get(url);

      if (response.status === 200) {
        const fileList = JSON.parse(response.data.body);
        setFileList(fileList);
      } else {
        throw new Error(response.data.message || '파일 목록을 불러오는 데 실패했습니다.');
      }
    } catch (error) {
      console.error('파일 목록을 불러오는 중 오류 발생:', error);
      alert('파일 목록을 불러오는 데 실패했습니다. 다시 시도해 주세요.');
    }
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (selectedFile) {
      try {
        const result = await uploadFile(selectedFile);
        console.log('파일이 업로드되었습니다:', result);
        fetchFileList();
      } catch (error) {
        console.error('파일 업로드 중 오류 발생:', error);
      }
    }
  };

  const handleDelete = async (filenameToDelete) => {
    try {
      const result = await deleteFile(filenameToDelete);
      console.log('파일이 삭제되었습니다:', result);
      fetchFileList();
    } catch (error) {
      console.error('파일 삭제 중 오류 발생:', error);
    }
  };

  const handleDownload = async (filenameToDownload) => {
    try {
      await downloadFile(filenameToDownload);
    } catch (error) {
      console.error('파일 다운로드 중 오류 발생:', error);
    }
  };

  return (
    <div>
      <h2>파일 관리</h2>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>업로드</button>

      <h3>파일 목록</h3>
      <table>
        <thead>
          <tr>
            <th>유저</th>
            <th>파일명</th>
            <th>유형</th>
            <th>크기</th>
            <th>마지막 수정일</th>
            <th>다운로드</th>
            <th>삭제</th>
          </tr>
        </thead>
        <tbody>
          {fileList.map((file, index) => (
            <tr key={index}>
              <td>{file.user_id}</td>
              <td>{file.file_name}</td>
              <td>{file.file_type}</td>
              <td>{file.size}</td>
              <td>{file.last_modified}</td>
              <td>
                <button onClick={() => handleDownload(file.file_name)}>다운로드</button>
              </td>
              <td>
                <button onClick={() => handleDelete(file.file_name)}>삭제</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default FileManagement;
