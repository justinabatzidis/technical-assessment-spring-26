import { useState, useEffect } from 'react';
function MusicalEvolution() {
  const [userName, setUserName] = useState(sessionStorage.getItem('userName') || '');
  const [poll, setPoll] = useState(null);
  const [showNamePrompt, setShowNamePrompt] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [pendingAction, setPendingAction] = useState(null);
  useEffect(() => {
    sessionStorage.removeItem('userName');
    setUserName(''); 
  }, []);
  useEffect(() => {
    fetch('http://tate-mcrae-journey.onrender.com/api/poll/favorite-song')
      .then(res => res.json())
      .then(data => setPoll(data))
      .catch(err => console.error(err));

    fetch('http://tate-mcrae-journey.onrender.com/api/comments/musical-evolution')
      .then(res => res.json())
      .then(data => setComments(data))
      .catch(err => console.error(err));
  }, []);
  useEffect(() => {
    if (pendingAction) {
        if (pendingAction.type === 'comment' && userName) {
            handleComment(true);
            setPendingAction(null);
        } else if (pendingAction.type === 'vote' && userName) {
            handleVote(pendingAction.option, true);
            setPendingAction(null);
        }
    }
  }, [userName, pendingAction]);
  const handleVote = (option, isRerun = false) => {
    if (!userName) {
      setPendingAction({ type: 'vote', option: option });
      setShowNamePrompt(true);
      return;
    }
    fetch('http://tate-mcrae-journey.onrender.com/api/poll/vote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ questionId: 'favorite-song', option, userName })
    })
      .then(res => res.json())
      .then(data => setPoll(data))
      .catch(err => console.error(err));
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
        body: JSON.stringify({ page: 'musical-evolution', name: userName, text: textToPost })
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
      <h1 className="page-title">EPs and Albums: The Musical Journey</h1>
      <p className="page-subtitle">Tate McRae's Evolution from Bedroom Pop to Global Stardom</p>
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
        <h2>🤍 all the things i never said (2020 EP)</h2>
        <p>
          This was Tate's debut EP, featuring five songs including the lead single "tear myself apart." It set the foundational tone for her music: emotionally raw, bedroom-pop introspection rooted in vulnerability and teenage angst.
        </p>
      </div>
      <div className="content-card">
        <h2>🧡 TOO YOUNG TO BE SAD (2021 EP)</h2>
        <p>
          This six-track EP became the most streamed female EP of 2021 on Spotify. It featured the massive international hit "you broke me first," which launched her into wider recognition. This EP solidified her blend of confessional lyrics and radio-ready production.
        </p>
      </div>
      <div className="content-card">
        <h2>🩷 i used to think i could fly (2022 Album)</h2>
        <p>
          Tate's debut studio album is a raw, angsty exploration of young adulthood and heartbreak. It introduced her signature sound and featured the viral single "she's all i wanna be." The album peaked at number 13 on the Billboard 200, signaling her arrival as a major pop voice.
        </p>
      </div>
      <div className="content-card">
        <h2>🖤 THINK LATER (2023 Album)</h2>
        <p>
          Moving away from the intimacy of her debut, THINK LATER embraces a more energetic, dance-pop sound. 
          The album is driven by hit single "greedy," a bold, catchy track that topped the Billboard Global 200 and the Canadian Hot 100, 
          and cemented her transition into a global superstar with high-octane production.
        </p>
      </div>
      <div className="content-card">
        <h2>💙 So Close To What (2025 Album)</h2>
        <p>
          Her third and most critically acclaimed album, So Close To What, debuted at #1 on the Billboard 200. This record showcases a more mature, complex sound, balancing dance-floor anthems 
          with poignant ballads, and solidified her lyrical depth and artistic control.
        </p>
      </div>
      <div className="content-card">
        <h2>✨ SO CLOSE TO WHAT??? (2025 Deluxe Album)</h2>
        <p>
          The expanded edition, SO CLOSE TO WHAT??? (deluxe), enriched the era with 5 new tracks, including the highly-praised 
          "TIT FOR TAT." The deluxe release reinforced the album's themes and provided 
          fresh, blue-toned visuals that dominated social media.
        </p>
      </div> {}
      <div className="content-card">
        <h2>🎵 Poll: Favorite Song?</h2>
        {poll && poll.options.map((opt, i) => (
          <div key={i} style={{marginBottom: '1rem', padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '8px'}}>
            <div style={{marginBottom: '0.5rem'}}>
              <strong>{opt.text}</strong> - {opt.voters.length} {opt.voters.length === 1 ? 'vote' : 'votes'}
            </div>
            {opt.voters.length > 0 && (
              <div style={{fontSize: '0.9rem', opacity: 0.8}}>
                Voted by: {opt.voters.join(', ')}
              </div>
            )}
            <button onClick={() => handleVote(opt.text, false)}>Vote</button>
          </div>
        ))}
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
export default MusicalEvolution;