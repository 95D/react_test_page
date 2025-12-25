import React, { useEffect, useState } from 'react';
import './IdolListPage.css'; // 분리한 CSS 파일 임포트

const BASE_URL = 'https://api.matsurihi.me/api/mltd/v2';
const ICON_URL = 'https://storage.matsurihi.me/mltd/icon_l';

const IdolListPage = ({ onSelectIdol }) => {
  const [idols, setIdols] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIdolData = async () => {
      try {
        const idolCount = 52;
        const idolPromises = Array.from({ length: idolCount }, (_, i) => 
          fetch(`${BASE_URL}/idols/${i + 1}`).then(res => res.json())
        );

        const idolResults = await Promise.all(idolPromises);
        
        const idolsWithResource = await Promise.all(
          idolResults.map(async (idol) => {
            const cardRes = await fetch(`${BASE_URL}/cards?idolId=${idol.id}`).then(res => res.json());
            const resourceId = cardRes[0]?.resourceId || ""; 
            return {
              id: idol.id,
              fullName: idol.fullName,
              thumbnail: `${ICON_URL}/${resourceId}_1.png`
            };
          })
        );

        setIdols(idolsWithResource);
        setLoading(false);
      } catch (error) {
        console.error("Data fetch error:", error);
        setLoading(false);
      }
    };

    fetchIdolData();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="progress-bar-bg">
          <div className="progress-bar-fill"></div>
        </div>
        <p className="loading-text">아이돌 데이터를 불러오는 중입니다...</p>
      </div>
    );
  }
  
  return (
   <div className="idol-list-container">
      <header style={{ marginBottom: '30px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '1.8rem', color: '#333' }}>Idol List</h1>
      </header>

      <main className="idol-grid">
        {idols.map((idol) => (
          <div 
            key={idol.id}
            className="idol-card"
            onClick={() => onSelectIdol(idol.id)}
          >
            <div className="idol-thumbnail-container">
              <img 
                src={idol.thumbnail} 
                alt={idol.name}
                className="idol-thumbnail"
              />
            </div>
            <p className="idol-name">{idol.fullName}</p>
          </div>
        ))}
      </main>
    </div>
  );
};

export default IdolListPage;