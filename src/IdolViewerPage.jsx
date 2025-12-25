import React, { useEffect, useState } from 'react';
import './IdolViewerPage.css';

const BASE_URL = 'https://api.matsurihi.me/api/mltd/v2';
const ICON_URL = 'https://storage.matsurihi.me/mltd/icon_l';

const IdolViewerPage = ({ idolId, onBack }) => {
  console.log("Idol id:", idolId);
  const [data, setData] = useState({ profile: null, cards: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIdolDetail = async () => {
      try {
        setLoading(true);
        // 프로필 정보와 카드 리스트를 동시에 호출
        const [profileRes, cardsRes] = await Promise.all([
          fetch(`${BASE_URL}/idols/${idolId}`).then(res => res.json()),
          fetch(`${BASE_URL}/cards?idolId=${idolId}`).then(res => res.json())
        ]);

        setData({
          profile: profileRes,
          cards: cardsRes
        });
        setLoading(false);
      } catch (error) {
        console.error("상세 정보 로드 실패:", error);
        setLoading(false);
      }
    };

    fetchIdolDetail();
  }, [idolId]);

  if (loading) return (
    <div className="loading-container">
      <div className="progress-bar-bg"><div className="progress-bar-fill"></div></div>
      <p>상세 프로필을 로드 중입니다...</p>
    </div>
  );

  const { profile, cards } = data;

  return (
    <div className="viewer-container">
      {/* 1. 좌측 프로필 섹션 */}
      <aside className="profile-section">
        <button className="back-button" onClick={onBack}>← 뒤로가기</button>
        <div className="profile-title">{profile.type} Type</div>
        <h1 className="profile-name">{profile.name}</h1>
        <p style={{color: '#666', marginBottom: '20px'}}>{profile.cv}</p>

        <div className="info-grid">
          <span className="info-label">나이</span><span className="info-value">{profile.age}세</span>
          <span className="info-label">생일</span><span className="info-value">
            {profile.birthday && typeof profile.birthday === 'object' 
            ? `${profile.birthday.month}월 ${profile.birthday.day}일` 
            : profile.birthday}
          </span>
          <span className="info-label">별자리</span><span className="info-value">{profile.constellation.name}</span>
          <span className="info-label">혈액형</span><span className="info-value">{profile.bloodType.name}형</span>
          <span className="info-label">신장</span><span className="info-value">{profile.height}cm</span>
          <span className="info-label">몸무게</span><span className="info-value">{profile.weight}kg</span>
          <span className="info-label">사이즈</span><span className="info-value">{profile.measurements.bust}/{profile.measurements.waist}/{profile.measurements.hip}</span>
          <span className="info-label">취미</span><span className="info-value">{profile.hobby}</span>
          <span className="info-label">특기</span><span className="info-value">{profile.speciality}</span>
          <span className="info-label">좋아하는것</span><span className="info-value">{profile.favorites}</span>
        </div>
      </aside>

      {/* 2. 우측 카드 갤러리 섹션 */}
      <section className="card-section">
        <h2 className="section-title">Card Collection ({cards.length})</h2>
        <div className="card-gallery">
          {cards.map((card) => (
            <div key={card.id} className="viewer-card-item" title={card.name}>
              <img 
                src={`${ICON_URL}/${card.resourceId}_1.png`} 
                alt={card.name} 
                className="viewer-card-img"
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default IdolViewerPage;