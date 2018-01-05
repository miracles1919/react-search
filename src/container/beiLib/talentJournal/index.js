import React from 'react'

const TalentJournal = () => {
  const imgStyle = {
    width: '1200px',
    height: '500px',
  }
  return (
    <div>
      <img src={require('./img/banner.png')} style={imgStyle} alt="人才期刊" />
    </div>
  )
}

export default TalentJournal
