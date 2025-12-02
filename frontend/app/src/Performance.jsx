import { useState, useEffect } from 'react';

function Performance() {
  const [userName, setUserName] = useState(sessionStorage.getItem('userName') || '');
  const [answer, setAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [showNamePrompt, setShowNamePrompt] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [pendingAction, setPendingAction] = useState(null);
  const correctAnswer = '83';
  useEffect(() => {
    sessionStorage.removeItem('userName');
    setUserName(''); 
    setAnswer(''); 
    setShowResult(false);
  }, []);
  useEffect(() => {
    fetch('https://tate-mcrae-journey.onrender.com/api/comments/performance')
      .then(res => res.json())
      .then(data => setComments(data))
      .catch(err => console.error(err));
  }, []);
  useEffect(() => {
    if (pendingAction) {
        if (pendingAction.type === 'comment' && userName) {
            handleComment(true);
            setPendingAction(null);
        } else if (pendingAction.type === 'quiz') {
            handleAnswer(pendingAction.answer);
            setPendingAction(null);
        }
    }
}, [userName, pendingAction]);
  const handleAnswer = (ans) => {
    if (showResult) {
        return;
    }
    setAnswer(ans);
    setShowResult(true);
  };
  const handleComment = (isRerun = false) => {
    const textToPost = isRerun && pendingAction && pendingAction.type === 'comment' 
        ? pendingAction.text 
        : newComment;
    if (!userName) {
      if (textToPost.trim()) {
        setPendingAction({ type: 'comment', text: textToPost });
        setShowNamePrompt(true);
      }
      return;
    }
    if (textToPost.trim()) {
      fetch('https://tate-mcrae-journey.onrender.com/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ page: 'performance', name: userName, text: textToPost })
      })
        .then(res => res.json())
        .then(comment => {
          setComments([comment, ...comments]);
          setNewComment('');
        })
        .catch(err => console.error(err));
    }
  };

  return (
    <div className="page-container">
      <h1 className="page-title">The Triple Threat</h1>
      <p className="page-subtitle">Performance & Stage Presence</p>

      {showNamePrompt && (
        <div style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999}}>
          <div style={{background: 'white', padding: '2rem', borderRadius: '16px', color: '#000'}}>
            <h3>What's your name?</h3>
            <input
              type="text"
              placeholder="Your name"
              autoFocus
              onKeyPress={(e) => {
                if (e.key === 'Enter' && e.target.value.trim()) {
                  const enteredName = e.target.value;
                  sessionStorage.setItem('userName', enteredName);
                  setUserName(enteredName);
                  setShowNamePrompt(false);
                }
              }}
              style={{color: '#000', background: '#f0f0f0', border: '1px solid #ccc'}}
            />
          </div>
        </div>
      )}
      <div className="content-card">
        <h2>🎤 More Than Just a Singer</h2>
        <p>
          Tate dominates as a triple threat. Singing, dancing, and performing with captivating intensity. 
          Her ability to execute complex choreography while singing live sets her apart from most pop artists.
        </p>
      </div>
      <div className="content-card">
        <h2>🌎 Miss Possessive World Tour (2024-2025)</h2>
        <p>
          83 shows across the globe, grossing $110.8 million and selling over 1 million tickets! 
          The tour averaged 13,480 tickets per show, featuring elaborate production and high-energy performances.
        </p>
      </div>
      <div className="content-card">
        <h2>💃 The Britney Comparison</h2>
        <p>
          Many compare Tate to Britney Spears. Tate watches Britney's music videos constantly for inspiration, 
          bringing her own contemporary dance style to create performances that feel both nostalgic and fresh.
        </p>
      </div>
      <div className="content-card">
        <h2>🏆 Recognition & Awards</h2>
        <p>
          🏆 JUNO Awards: Artist of the Year (2024 & 2025)<br/>
          🎵 Grammy Nomination (2026): Best Dance Pop Recording<br/>
          📺 Multiple MTV VMA nominations<br/>
          🌟 Forbes 30 Under 30 (2021) - youngest musician
        </p>
      </div>
      <div className="content-card">
        <h2>🧠 Quiz: How many shows in the Miss Possessive Tour?</h2>
        {['50', '65', '83', '100'].map(opt => (
          <button
            key={opt}
            onClick={() => handleAnswer(opt)}
            disabled={showResult}
            style={{
              background: showResult 
                ? (opt === correctAnswer ? '#22c55e' : (answer === opt ? '#dc2626' : '#a78bfa'))
                : (answer === opt ? '#8b5cf6' : '#a78bfa'), 
              display: 'block',
              width: '100%',
              marginBottom: '0.5rem',
              transition: 'background 0.3s'
            }}
          >
            {opt} shows 
            {showResult && opt === correctAnswer && ' ✅'} 
            {showResult && answer === opt && opt !== correctAnswer && ' ❌'} 
          </button>
        ))}
        {showResult && (
          <div style={{marginTop: '1rem', padding: '1rem', background: answer === correctAnswer ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)', borderRadius: '8px'}}>
            {answer === correctAnswer ? '✅ Correct! 83 shows!' : '❌ Not quite! It was 83 shows.'}
          </div>
        )}
      </div>
      <div className="content-card">
        <h2>💬 Comments</h2>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Leave a comment..."
        />
        <button onClick={() => handleComment(false)}>Post Comment</button>
        <div style={{marginTop: '2rem'}}>
          {comments.map((c, i) => (
            <div key={i} style={{padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', marginBottom: '1rem'}}>
              <strong>{c.name}</strong>
              <p>{c.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
export default Performance;