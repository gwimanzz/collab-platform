import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { uploadFile, deleteFile, downloadFile, fetchAllFiles } from '../api/auth';
import '../styles/storage.css'; // CSS 파일 import

function FileManagement() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalFiles, setTotalFiles] = useState(0); // 총 파일 수를 저장할 상태
  const pageSize = 10;

  useEffect(() => {
    fetchAllFilesAndPaginate();
  }, []);

  const fetchAllFilesAndPaginate = async (page = 1) => {
    try {
      const { files, totalCount } = await fetchAllFiles();
      const sortedFiles = files.sort((a, b) => new Date(b.last_modified) - new Date(a.last_modified));
      setTotalFiles(totalCount);
      paginateFiles(sortedFiles, page); // 정렬된 파일 목록을 페이지네이션 함수에 전달
    } catch (error) {
      console.error('파일 목록을 불러오는 중 오류 발생:', error);
    }
  };

  const paginateFiles = (files, page) => {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const pageFiles = files.slice(startIndex, endIndex);
    setFileList(pageFiles);
    setCurrentPage(page);
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (selectedFile) {
      try {
        const result = await uploadFile(selectedFile);
        console.log('파일이 업로드되었습니다:', result);
        fetchAllFilesAndPaginate(); // 업로드 후 파일 목록을 다시 가져오고 페이징합니다.
      } catch (error) {
        console.error('파일 업로드 중 오류 발생:', error);
      }
    }
  };

  const handleDelete = async (file_name_S3, user_id, timestamp) => {
    try {
      const result = await deleteFile(file_name_S3, user_id, timestamp);
      console.log('파일이 삭제되었습니다:', result);
      const updatedFiles = fileList.filter(file => file.file_name_S3 !== file_name_S3);
      setFileList(updatedFiles); // 삭제된 파일을 목록에서 제거
      setTotalFiles(prevTotal => prevTotal - 1); // 총 파일 수 감소

      // 다음 페이지의 파일을 가져올 필요가 있는 경우
      if (currentPage > 1 && fileList.length === 1) {
        fetchAllFilesAndPaginate(currentPage - 1); // 이전 페이지를 요청
      } else {
        fetchAllFilesAndPaginate(currentPage); // 현재 페이지를 다시 요청
      }
    } catch (error) {
      console.error('파일 삭제 중 오류 발생:', error);
    }
  };

  const handleDownload = async (file_name_S3) => {
    try {
      await downloadFile(file_name_S3);
    } catch (error) {
      console.error('파일 다운로드 중 오류 발생:', error);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      fetchAllFilesAndPaginate(currentPage - 1); // 이전 페이지를 요청
    }
  };

  const handleNextPage = async () => {
    const totalPages = Math.ceil(totalFiles / pageSize);
    if (currentPage < totalPages) {
      const nextPage = currentPage + 1;
      try {
        const { files } = await fetchAllFiles(nextPage); // 다음 페이지를 요청
        const sortedFiles = files.sort((a, b) => new Date(b.last_modified) - new Date(a.last_modified));
        paginateFiles(sortedFiles, nextPage);
      } catch (error) {
        console.error('다음 페이지 파일 목록을 불러오는 중 오류 발생:', error);
      }
    }
  };

  return (
    <div>
      <h2>파일 관리</h2>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>업로드</button>

      <h3>파일 목록 ({totalFiles}개)</h3>
      <table className="file-table">
        <thead>
          <tr>
            <th className="num-cell">번호</th>
            <th className="user-cell">유저</th>
            <th className="filename-cell">파일명</th>
            <th className="type-cell">유형</th>
            <th className="size-cell">크기</th>
            <th className="modified-cell">마지막 수정일</th>
            <th className="download-cell">다운로드</th>
            <th className="delete-cell">삭제</th>
          </tr>
        </thead>
        <tbody>
          {fileList.map((file, index) => (
            <tr key={index}>
              <td className="num-cell">{(currentPage - 1) * pageSize + index + 1}</td>
              <td className="user-cell">{file.user_id}</td>
              <td className="filename-cell">{file.file_name}</td>
              <td className="type-cell">{file.file_type}</td>
              <td className="size-cell">{file.size}</td>
              <td className="modified-cell">{file.last_modified}</td>
              <td className="download-cell">
                <button onClick={() => handleDownload(file.file_name_S3)}>다운로드</button>
              </td>
              <td className="delete-cell">
                <button onClick={() => handleDelete(file.file_name_S3, file.user_id, file.timestamp)}>삭제</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        <button onClick={handlePrevPage} disabled={currentPage === 1}>이전</button>
        <span>{currentPage}</span>
        <button onClick={handleNextPage} disabled={currentPage === Math.ceil(totalFiles / pageSize)}>다음</button>
      </div>
    </div>
  );
}

export default FileManagement;
