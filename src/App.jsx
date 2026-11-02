    if (block.type === "code") return <pre key={i}><code>{block.text}</code></pre>;
    if (block.type === "hr") return <hr key={i} />;
    if (block.type === "table") return <div className="table-scroll" key={i}><table><tbody>{block.rows.map((row,j)=><tr key={j}>{row.map((cell,k)=> j===0 ? <th key={k}><InlineMarkdown text={cell}/></th> : <td key={k}><InlineMarkdown text={cell}/></td>)}</tr>)}</tbody></table></div>;
    return null;
  })}</div>;
}

function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function App() {
  const [activeSectionId, setActiveSectionId] = useState("linux");
  const [flashIndex, setFlashIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [randomOrder, setRandomOrder] = useState(false);
  const [randomMode, setRandomMode] = useState(false);
  const [randomDeck, setRandomDeck] = useState([]);
  const [randomFinished, setRandomFinished] = useState(false);

  const activeSection = sections.find(section => section.id === activeSectionId) || sections[0];
  const sectionCards = useMemo(
    () => randomOrder ? shuffleArray(activeSection.cards) : activeSection.cards,
    [activeSection, randomOrder]
  );

  const startRandomSession = () => {
    const allCards = sections.flatMap(section =>
      section.cards.map(card => ({ ...card, category: section.name }))
    );
    setRandomDeck(shuffleArray(allCards).slice(0, 5));
    setRandomMode(true);
    setRandomFinished(false);
    setFlashIndex(0);
    setIsFlipped(false);
    setRandomOrder(false);
  };

  const leaveRandomMode = () => {
    setRandomMode(false);
    setRandomFinished(false);
    setFlashIndex(0);
    setIsFlipped(false);
  };

  const cards = randomMode ? randomDeck : sectionCards;
  const currentCard = cards[flashIndex];

  const selectSection = id => {
    setIsFlipped(false);
    setActiveSectionId(id);
    setFlashIndex(0);
    setRandomOrder(false);
    setRandomMode(false);
    setRandomFinished(false);
  };

  const move = delta => {
    setIsFlipped(false);
    if (randomMode) {
      if (delta > 0 && flashIndex === randomDeck.length - 1) {
        setRandomFinished(true);
        return;
      }
      setFlashIndex(index => Math.max(0, Math.min(randomDeck.length - 1, index + delta)));
      return;
    }
    setFlashIndex(index => (index + delta + cards.length) % cards.length);
  };

  const shuffle = () => {
    if (randomMode) {
      startRandomSession();
      return;
    }
    setIsFlipped(false);
    setFlashIndex(0);
    setRandomOrder(true);
  };

  return <div className="app"><main className="content"><section className="flash-section">
    <div className="section-navigation">
      {sections.map(section => <button key={section.id} className={`section-button ${!randomMode && activeSectionId === section.id ? "active" : ""}`} onClick={() => selectSection(section.id)}>{section.name}</button>)}
      <button className={`section-button ${randomMode ? "active" : ""}`} onClick={startRandomSession}>Случайные 5</button>
    </div>

    {randomFinished ? <>
      <div className="counter">Случайная подборка · 5 из 5</div>
      <div className="flash-card" style={{ minHeight: 260, display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", padding: 32 }}>
        <div>
          <span className="card-title">ГОТОВО</span>
          <h1>Пять карточек пройдены.</h1>
          <p className="click-text">На сегодня достаточно. Можно спокойно возвращаться к своим делам.</p>
        </div>
      </div>
      <div className="flash-controls">
        <button onClick={startRandomSession}>Ещё 5 случайных</button>
        <button onClick={leaveRandomMode}>К категориям</button>
      </div>
    </> : <>
      <div className="counter">
        {randomMode
          ? `Случайная подборка · ${currentCard?.category || ""} · Вопрос ${flashIndex + 1} из 5`
          : `${activeSection.name} · Вопрос ${flashIndex + 1} из ${cards.length}`}
      </div>

      {currentCard && <div className={`flash-card ${isFlipped ? "flipped" : ""}`} onClick={() => setIsFlipped(value => !value)} role="button" tabIndex={0} onKeyDown={e => { if (e.key === "Enter" || e.key === " ") setIsFlipped(value => !value); }}>
        <div className="flash-card-inner"><div className="flash-card-front"><span className="card-title">ВОПРОС</span><h1>{currentCard.question}</h1><p className="click-text">Нажми на карточку, чтобы увидеть ответ</p></div>
          <div className="flash-card-back"><span className="card-title">ОТВЕТ</span><MarkdownAnswer source={currentCard.answer} /></div></div></div>}

      <div className="flash-controls">
        <button onClick={() => move(-1)} disabled={randomMode && flashIndex === 0}>← Назад</button>
        <button onClick={() => move(1)}>{randomMode && flashIndex === 4 ? "Завершить →" : "Следующая →"}</button>
        <button onClick={shuffle}>{randomMode ? "Другие 5" : "Перемешать"}</button>
      </div>
    </>}
  </section></main></div>;
}
