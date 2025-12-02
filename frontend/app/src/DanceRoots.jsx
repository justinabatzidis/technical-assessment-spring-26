import { useState, useEffect } from 'react';
function DanceRoots() {
  const [userName, setUserName] = useState(sessionStorage.getItem('userName') || '');
  const [answer, setAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [showNamePrompt, setShowNamePrompt] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [pendingAction, setPendingAction] = useState(null);
  const correctAnswer = '13';
  useEffect(() => {
    sessionStorage.removeItem('userName');
    setUserName(''); 
    setAnswer(''); 
    setShowResult(false);
  }, []);
    useEffect(() => {
    fetch('http://tate-mcrae-journey.onrender.com/api/comments/dance-roots')
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
      fetch('http://tate-mcrae-journey.onrender.com/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ page: 'dance-roots', name: userName, text: textToPost })
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
      <h1 className="page-title">From Ballet Barre to Billboard Charts</h1>
      <p className="page-subtitle">How Dance Shaped Tate McRae</p>
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
        <h2>🩰 Early Training</h2>
        <p>
          Tate began dance training at age 6 in Calgary, studying ballet, contemporary, jazz, and hip-hop. 
          She competed at prestigious competitions and won multiple Dance Awards titles as a child.
        </p>
      </div>
      <div className="content-card">
        <h2>📺 So You Think You Can Dance</h2>
        <p>
          At age 13, Tate placed 3rd on SYTYCD, which was the highest for a Canadian. She even performed with 
          Justin Bieber at age 12 during his Purpose Tour in Calgary.
        </p>
      </div>
      <div className="content-card">
        <h2>🎥 YouTube Beginnings</h2>
        <p>
          In 2017, Tate started "Create With Tate" on YouTube, posting bedroom performances. 
          Her song "One Day" went viral with 40M+ views, catching RCA Records' attention.
        </p>
      </div>
      <div className="content-card">
        <h2>💃 Dance Meets Music</h2>
        <p>
          Tate choreographs her own routines, blending contemporary dance with pop energy. 
          Dance isn't just her background now. It's the foundation of her entire artistry.
        </p>
      </div>
      <div className="content-card">
        <h2>🧠 Quiz: How old was Tate on SYTYCD?</h2>
        {['10', '13', '15', '16'].map(opt => (
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
            {opt} years old
            {showResult && opt === correctAnswer && ' ✅'} 
            {showResult && answer === opt && opt !== correctAnswer && ' ❌'} 
          </button>
        ))}
        {showResult && (
          <div style={{marginTop: '1rem', padding: '1rem', background: answer === correctAnswer ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)', borderRadius: '8px'}}>
            {answer === correctAnswer ? '✅ Correct! She was 13!' : '❌ Not quite! She was 13.'}
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
export default DanceRoots;