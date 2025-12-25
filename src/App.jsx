import React, { useState } from 'react';
import IdolListPage from './IdolListPage';
import IdolViewerPage from './IdolViewerPage';

const App = () => {
  // 선택된 아이돌 ID를 관리하는 상태 (null이면 리스트 페이지, ID가 있으면 상세 페이지)
  const [selectedIdolId, setSelectedIdolId] = useState(null);

  // 아이돌을 선택했을 때 실행될 함수
  const handleSelectIdol = (id) => {
    setSelectedIdolId(id);
    // 선택 시 페이지 최상단으로 스크롤 이동
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 뒤로가기 버튼을 눌렀을 때 실행될 함수
  const handleBackToList = () => {
    setSelectedIdolId(null);
  };

  return (
    <div className="app-container">
      {selectedIdolId ? (
        // ID가 있으면 뷰어 페이지를 렌더링
        <IdolViewerPage 
          idolId={selectedIdolId} 
          onBack={handleBackToList} 
        />
      ) : (
        // ID가 없으면 리스트 페이지를 렌더링
        <IdolListPage 
          onSelectIdol={handleSelectIdol} 
        />
      )}
    </div>
  );
};

export default App;