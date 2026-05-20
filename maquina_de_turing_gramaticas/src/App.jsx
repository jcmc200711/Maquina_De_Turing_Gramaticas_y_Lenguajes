import { useState, useEffect } from 'react';

const defaultTransitions = [
  { currentState: 'q0', readChar: '0', nextState: 'q0', writeChar: '0', direction: 'R' },
  { currentState: 'q0', readChar: '1', nextState: 'q0', writeChar: '1', direction: 'R' },
  { currentState: 'q0', readChar: '_', nextState: 'q1', writeChar: '_', direction: 'L' },
  { currentState: 'q1', readChar: '1', nextState: 'q1', writeChar: '0', direction: 'L' },
  { currentState: 'q1', readChar: '0', nextState: 'q_accept', writeChar: '1', direction: 'S' },
  { currentState: 'q1', readChar: '_', nextState: 'q_accept', writeChar: '1', direction: 'S' },
];

const C = {
  bg: '#050c14',
  card: '#0a1628',
  cardBorder: '#0d2440',
  neon: '#00e5ff',
  green: '#00ff88',
  pink: '#ff2d6b',
  amber: '#ffb800',
  text: '#c8d8e8',
  textDim: '#4a6080',
  textMid: '#7a98b8',
};

const styles = {
  root: {
    minHeight: '100vh',
    background: C.bg,
    color: C.text,
    fontFamily: '"Share Tech Mono", "Courier New", monospace',
    padding: '0',
    position: 'relative',
    overflow: 'hidden',
  },
  gridBg: {
    position: 'fixed',
    top: 0, left: 0,
    width: '100%', height: '100%',
    backgroundImage: `
      linear-gradient(rgba(0,229,255,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,229,255,0.03) 1px, transparent 1px)
    `,
    backgroundSize: '40px 40px',
    pointerEvents: 'none',
    zIndex: 0,
  },
  container: {
    position: 'relative',
    zIndex: 1,
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '24px',
  },
  header: {
    borderBottom: `1px solid ${C.cardBorder}`,
    paddingBottom: '20px',
    marginBottom: '28px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    gap: '12px',
  },
  headerTitle: {
    fontSize: '28px',
    fontWeight: '700',
    letterSpacing: '4px',
    background: `linear-gradient(135deg, ${C.neon}, ${C.green})`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    margin: 0,
    lineHeight: 1.2,
  },
  headerSub: {
    fontSize: '10px',
    color: C.textDim,
    letterSpacing: '3px',
    marginTop: '4px',
  },
  statusBadge: (status) => ({
    padding: '6px 14px',
    borderRadius: '4px',
    fontSize: '11px',
    fontWeight: '700',
    letterSpacing: '2px',
    border: `1px solid ${status === 'accepted' ? C.green : status === 'rejected' ? C.pink : C.neon}`,
    background: `${status === 'accepted' ? C.green : status === 'rejected' ? C.pink : C.neon}18`,
    color: status === 'accepted' ? C.green : status === 'rejected' ? C.pink : C.neon,
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  }),
  statusDot: (status) => ({
    width: '7px', height: '7px',
    borderRadius: '50%',
    background: status === 'accepted' ? C.green : status === 'rejected' ? C.pink : C.neon,
    animation: 'pulse 1.5s ease-in-out infinite',
  }),
  grid: {
    display: 'grid',
    gridTemplateColumns: '320px 1fr',
    gap: '20px',
    alignItems: 'start',
  },
  card: {
    background: C.card,
    border: `1px solid ${C.cardBorder}`,
    borderRadius: '8px',
    padding: '20px',
    position: 'relative',
    overflow: 'hidden',
  },
  cardCorner: {
    position: 'absolute',
    top: 0, left: 0,
    width: '40px', height: '40px',
    borderTop: `2px solid ${C.neon}`,
    borderLeft: `2px solid ${C.neon}`,
    borderRadius: '8px 0 0 0',
  },
  cardCornerBR: {
    position: 'absolute',
    bottom: 0, right: 0,
    width: '24px', height: '24px',
    borderBottom: `1px solid ${C.neon}40`,
    borderRight: `1px solid ${C.neon}40`,
    borderRadius: '0 0 8px 0',
  },
  sectionTitle: (color = C.neon) => ({
    fontSize: '11px',
    fontWeight: '700',
    color,
    letterSpacing: '3px',
    marginBottom: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  }),
  label: {
    fontSize: '10px',
    color: C.textDim,
    letterSpacing: '2px',
    marginBottom: '6px',
    display: 'block',
  },
  input: {
    width: '100%',
    background: C.bg,
    border: `1px solid ${C.cardBorder}`,
    borderRadius: '4px',
    padding: '8px 12px',
    color: C.green,
    fontFamily: 'inherit',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s',
  },
  btnPrimary: {
    flex: 1,
    background: `linear-gradient(135deg, ${C.neon}22, ${C.neon}11)`,
    border: `1px solid ${C.neon}`,
    borderRadius: '4px',
    color: C.neon,
    fontFamily: 'inherit',
    fontSize: '11px',
    fontWeight: '700',
    letterSpacing: '2px',
    padding: '9px 12px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  btnSecondary: {
    background: 'transparent',
    border: `1px solid ${C.cardBorder}`,
    borderRadius: '4px',
    color: C.textMid,
    fontFamily: 'inherit',
    fontSize: '11px',
    letterSpacing: '1px',
    padding: '9px 14px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  tableWrap: {
    maxHeight: '200px',
    overflowY: 'auto',
    border: `1px solid ${C.cardBorder}`,
    borderRadius: '4px',
    background: C.bg,
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '11px',
  },
  th: {
    padding: '7px 8px',
    color: C.textDim,
    letterSpacing: '1px',
    borderBottom: `1px solid ${C.cardBorder}`,
    textAlign: 'left',
    background: `${C.neon}08`,
    fontWeight: '400',
  },
  td: {
    padding: '6px 8px',
    borderBottom: `1px solid ${C.cardBorder}20`,
    color: C.textMid,
  },
  ruleInput: {
    background: 'transparent',
    border: 'none',
    borderBottom: `1px solid ${C.cardBorder}`,
    color: C.text,
    fontFamily: 'inherit',
    fontSize: '11px',
    padding: '4px',
    outline: 'none',
    width: '100%',
    textAlign: 'center',
  },
  select: {
    background: C.bg,
    border: `1px solid ${C.cardBorder}`,
    color: C.neon,
    fontFamily: 'inherit',
    fontSize: '11px',
    padding: '4px',
    outline: 'none',
    width: '100%',
    borderRadius: '3px',
  },
  tapeWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    overflowX: 'auto',
    padding: '28px 16px 16px',
    background: `${C.bg}cc`,
    border: `1px solid ${C.cardBorder}`,
    borderRadius: '6px',
    minHeight: '90px',
    scrollbarWidth: 'thin',
    scrollbarColor: `${C.cardBorder} transparent`,
  },
  tapeCell: (isHead) => ({
    flexShrink: 0,
    width: '48px',
    height: '52px',
    border: `1px solid ${isHead ? C.neon : C.cardBorder}`,
    borderRadius: '4px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    background: isHead ? `${C.neon}12` : `${C.card}`,
    color: isHead ? C.neon : C.textMid,
    fontSize: '18px',
    fontWeight: isHead ? '700' : '400',
    transition: 'all 0.25s',
    boxShadow: isHead ? `0 0 16px ${C.neon}30` : 'none',
    transform: isHead ? 'translateY(-4px)' : 'none',
  }),
  tapeCellIdx: {
    fontSize: '9px',
    color: C.textDim,
    position: 'absolute',
    bottom: '3px',
  },
  tapeHead: {
    position: 'absolute',
    top: '-20px',
    color: C.neon,
    fontSize: '12px',
    animation: 'bounce 1s ease-in-out infinite',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '12px',
    marginTop: '16px',
  },
  statBox: (color = C.neon) => ({
    background: C.bg,
    border: `1px solid ${C.cardBorder}`,
    borderRadius: '6px',
    padding: '12px',
    textAlign: 'center',
  }),
  statLabel: {
    fontSize: '9px',
    color: C.textDim,
    letterSpacing: '2px',
    marginBottom: '4px',
  },
  statValue: (color) => ({
    fontSize: '20px',
    fontWeight: '700',
    color,
  }),
  logBox: {
    background: '#020810',
    border: `1px solid ${C.cardBorder}`,
    borderRadius: '6px',
    padding: '14px',
    height: '130px',
    overflowY: 'auto',
    fontSize: '11px',
    lineHeight: '1.7',
    fontFamily: 'inherit',
  },
  logHeader: {
    fontSize: '9px',
    color: C.textDim,
    letterSpacing: '3px',
    borderBottom: `1px solid ${C.cardBorder}`,
    paddingBottom: '6px',
    marginBottom: '8px',
  },
  divider: {
    border: 'none',
    borderTop: `1px solid ${C.cardBorder}`,
    margin: '16px 0',
  },
};

export default function App() {
  const [tapeInput, setTapeInput] = useState('1011');
  const [tape, setTape] = useState([]);
  const [headPosition, setHeadPosition] = useState(0);
  const [currentState, setCurrentState] = useState('q0');
  const [transitions, setTransitions] = useState(defaultTransitions);
  const [status, setStatus] = useState('idle');
  const [stepCount, setStepCount] = useState(0);
  const [logs, setLogs] = useState([]);
  const [newRule, setNewRule] = useState({ currentState: '', readChar: '', nextState: '', writeChar: '', direction: 'R' });
  const [hoveredBtn, setHoveredBtn] = useState(null);

  const initMachine = () => {
    const t = tapeInput.split('');
    if (!t.length) t.push('_');
    setTape(['_', '_', ...t, '_', '_']);
    setHeadPosition(2);
    setCurrentState('q0');
    setStatus('idle');
    setStepCount(0);
    setLogs(['// INIT: máquina cargada — estado q0']);
  };

  useEffect(() => { initMachine(); }, [tapeInput]);

  const stepExecution = () => {
    if (status === 'accepted' || status === 'rejected') return;
    const currentChar = tape[headPosition] || '_';
    const rule = transitions.find(t => t.currentState === currentState && t.readChar === currentChar);
    if (!rule) {
      setStatus('rejected');
      setLogs(p => [`// ERR: sin transición δ(${currentState}, '${currentChar}')`, ...p]);
      return;
    }
    const newTape = [...tape];
    newTape[headPosition] = rule.writeChar;
    let pos = headPosition;
    if (rule.direction === 'R') pos++;
    if (rule.direction === 'L') pos--;
    if (pos < 0) { newTape.unshift('_'); pos = 0; }
    if (pos >= newTape.length) newTape.push('_');
    setTape(newTape);
    setHeadPosition(pos);
    setCurrentState(rule.nextState);
    setStepCount(p => p + 1);
    setLogs(p => [`// STEP ${stepCount + 1}: δ(${currentState},'${currentChar}') → (${rule.nextState},'${rule.writeChar}',${rule.direction})`, ...p]);
    if (rule.nextState.includes('accept')) {
      setStatus('accepted');
      setLogs(p => ['// OK: estado de aceptación alcanzado ✓', ...p]);
    } else if (rule.nextState.includes('reject')) {
      setStatus('rejected');
      setLogs(p => ['// FAIL: estado de rechazo alcanzado ✗', ...p]);
    }
  };

  const addTransition = (e) => {
    e.preventDefault();
    if (!newRule.currentState || !newRule.readChar || !newRule.nextState || !newRule.writeChar) return;
    setTransitions([...transitions, newRule]);
    setNewRule({ currentState: '', readChar: '', nextState: '', writeChar: '', direction: 'R' });
  };

  const statesInvolved = Array.from(new Set([
    ...transitions.map(t => t.currentState),
    ...transitions.map(t => t.nextState),
  ]));

  const totalStates = statesInvolved.length;
  const svgW = Math.max(600, totalStates * 140);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: ${C.bg}; }
        @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.3; } }
        @keyframes bounce { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-4px); } }
        @keyframes fadeIn { from { opacity:0; transform:translateY(4px); } to { opacity:1; transform:translateY(0); } }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${C.cardBorder}; border-radius: 2px; }
        .btn-primary:hover { background: ${C.neon}30 !important; box-shadow: 0 0 12px ${C.neon}30; }
        .btn-secondary:hover { border-color: ${C.textMid} !important; color: ${C.text} !important; }
        .btn-add:hover { background: ${C.green}30 !important; }
        .rule-row:hover td { background: ${C.neon}08; }
        .tape-input:focus { border-color: ${C.neon} !important; box-shadow: 0 0 0 2px ${C.neon}18; }
        .rule-input:focus { border-bottom-color: ${C.neon} !important; }
      `}</style>

      <div style={styles.root}>
        <div style={styles.gridBg} />

        <div style={styles.container}>
          {/* HEADER */}
          <header style={styles.header}>
            <div>
              <h1 style={styles.headerTitle}>TURING_MACHINE // OS v2.6</h1>
              <p style={styles.headerSub}>SISTEMA COMPLETO DE PROCESAMIENTO Y GENERACIÓN DE AUTÓMATAS</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '10px', color: C.textDim, letterSpacing: '2px' }}>ESTADO GLOBAL</span>
              <div style={styles.statusBadge(status)}>
                <div style={styles.statusDot(status)} />
                {status.toUpperCase()}
              </div>
            </div>
          </header>

          {/* MAIN GRID */}
          <div style={styles.grid}>

            {/* LEFT PANEL */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={styles.card}>
                <div style={styles.cardCorner} />
                <div style={styles.cardCornerBR} />

                <div style={styles.sectionTitle(C.neon)}>
                  <span style={{ color: C.amber }}>⚡</span> CONFIGURACIÓN DE ENTRADA
                </div>

                <label style={styles.label}>CINTA INICIAL (INPUT)</label>
                <input
                  className="tape-input"
                  style={styles.input}
                  type="text"
                  value={tapeInput}
                  onChange={e => setTapeInput(e.target.value.replace(/[^a-zA-Z0-9_]/g, ''))}
                  placeholder="ej: 1011"
                  disabled={status !== 'idle' && status !== 'paused'}
                />

                <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                  <button
                    className="btn-primary"
                    style={styles.btnPrimary}
                    onClick={stepExecution}
                    disabled={status === 'accepted' || status === 'rejected'}
                  >
                    ▶ PASO A PASO
                  </button>
                  <button
                    className="btn-secondary"
                    style={styles.btnSecondary}
                    onClick={initMachine}
                  >
                    ↺ RESET
                  </button>
                </div>
              </div>

              {/* TABLA DE TRANSICIONES */}
              <div style={styles.card}>
                <div style={styles.cardCorner} />
                <div style={styles.sectionTitle(C.green)}>
                  <span>δ</span> TABLA DE TRANSICIONES
                </div>

                <div style={styles.tableWrap}>
                  <table style={styles.table}>
                    <thead>
                      <tr>
                        {['ACT', 'LEE', 'SIG', 'ESCR', 'DIR', ''].map(h => (
                          <th key={h} style={styles.th}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {transitions.map((t, i) => {
                        const isActive = currentState === t.currentState && tape[headPosition] === t.readChar;
                        return (
                          <tr key={i} className="rule-row" style={{ background: isActive ? `${C.neon}10` : 'transparent' }}>
                            <td style={{ ...styles.td, color: isActive ? C.neon : C.textMid, fontWeight: isActive ? '700' : '400' }}>{t.currentState}</td>
                            <td style={{ ...styles.td, color: isActive ? C.neon : C.textDim }}>'{t.readChar}'</td>
                            <td style={{ ...styles.td, color: isActive ? C.green : C.textMid }}>{t.nextState}</td>
                            <td style={{ ...styles.td, color: isActive ? C.neon : C.textDim }}>'{t.writeChar}'</td>
                            <td style={{ ...styles.td, color: C.amber }}>{t.direction}</td>
                            <td style={styles.td}>
                              <button
                                onClick={() => setTransitions(transitions.filter((_, j) => j !== i))}
                                style={{ background: 'none', border: 'none', color: C.pink, cursor: 'pointer', fontSize: '12px', padding: '2px 4px' }}
                              >✕</button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* AÑADIR REGLA */}
                <form onSubmit={addTransition}>
                  <div style={{
                    display: 'grid', gridTemplateColumns: 'repeat(5,1fr)',
                    gap: '6px', marginTop: '10px',
                    background: C.bg, padding: '10px', borderRadius: '4px',
                    border: `1px solid ${C.cardBorder}`,
                  }}>
                    {[
                      { key: 'currentState', ph: 'Q_ant' },
                      { key: 'readChar', ph: 'Lee', max: 1 },
                      { key: 'nextState', ph: 'Q_sig' },
                      { key: 'writeChar', ph: 'Escr', max: 1 },
                    ].map(({ key, ph, max }) => (
                      <input
                        key={key}
                        className="rule-input"
                        style={styles.ruleInput}
                        placeholder={ph}
                        maxLength={max}
                        value={newRule[key]}
                        onChange={e => setNewRule({ ...newRule, [key]: e.target.value })}
                      />
                    ))}
                    <select
                      style={styles.select}
                      value={newRule.direction}
                      onChange={e => setNewRule({ ...newRule, direction: e.target.value })}
                    >
                      <option>R</option>
                      <option>L</option>
                      <option>S</option>
                    </select>
                  </div>
                  <button
                    type="submit"
                    className="btn-add"
                    style={{
                      width: '100%', marginTop: '8px',
                      background: `${C.green}15`,
                      border: `1px solid ${C.green}60`,
                      borderRadius: '4px', color: C.green,
                      fontFamily: 'inherit', fontSize: '10px',
                      fontWeight: '700', letterSpacing: '2px',
                      padding: '8px', cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    + AÑADIR TRANSICIÓN
                  </button>
                </form>
              </div>
            </div>

            {/* RIGHT PANEL */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

              {/* CINTA */}
              <div style={styles.card}>
                <div style={styles.cardCorner} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <div style={styles.sectionTitle(C.textMid)}>
                    <span style={{ color: C.neon }}>◈</span> CINTA DE MEMORIA
                  </div>
                  <span style={{ fontSize: '9px', color: C.textDim, letterSpacing: '2px' }}>SISTEMA_CINTA_v1</span>
                </div>

                <div style={styles.tapeWrap}>
                  {tape.map((char, i) => {
                    const isHead = i === headPosition;
                    return (
                      <div key={i} style={styles.tapeCell(isHead)}>
                        {isHead && <div style={styles.tapeHead}>▼</div>}
                        <span style={{ fontWeight: isHead ? '700' : '400' }}>{char}</span>
                        <span style={styles.tapeCellIdx}>{i}</span>
                      </div>
                    );
                  })}
                </div>

                <div style={styles.statsGrid}>
                  <div style={styles.statBox(C.neon)}>
                    <div style={styles.statLabel}>ESTADO ACTUAL</div>
                    <div style={styles.statValue(C.neon)}>{currentState}</div>
                  </div>
                  <div style={styles.statBox(C.green)}>
                    <div style={styles.statLabel}>POSICIÓN CABEZAL</div>
                    <div style={styles.statValue(C.green)}>{headPosition}</div>
                  </div>
                  <div style={styles.statBox(C.amber)}>
                    <div style={styles.statLabel}>TOTAL PASOS</div>
                    <div style={styles.statValue(C.amber)}>{stepCount}</div>
                  </div>
                </div>
              </div>

              {/* AUTÓMATA SVG */}
              <div style={styles.card}>
                <div style={styles.cardCorner} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <div style={styles.sectionTitle(C.neon)}>
                    <span>◉</span> DIAGRAMA DEL AUTÓMATA
                  </div>
                  <span style={{ fontSize: '9px', color: C.green, background: `${C.green}10`, border: `1px solid ${C.green}30`, padding: '3px 8px', borderRadius: '3px', letterSpacing: '1px' }}>
                    AUTO-RENDER
                  </span>
                </div>

                <div style={{ background: C.bg, border: `1px solid ${C.cardBorder}`, borderRadius: '6px', padding: '16px', overflowX: 'auto' }}>
                  <svg width={svgW} height="220" viewBox={`0 0 ${svgW} 220`} style={{ display: 'block', minWidth: '100%' }}>
                    <defs>
                      <marker id="arr" viewBox="0 0 10 10" refX="18" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                        <path d="M0 1 L10 5 L0 9z" fill={C.neon} />
                      </marker>
                      <marker id="arr-active" viewBox="0 0 10 10" refX="18" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                        <path d="M0 1 L10 5 L0 9z" fill={C.green} />
                      </marker>
                      <filter id="glow">
                        <feGaussianBlur stdDeviation="2" result="blur" />
                        <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                      </filter>
                    </defs>

                    {/* Transiciones */}
                    {transitions.map((t, i) => {
                      const si = statesInvolved.indexOf(t.currentState);
                      const ti2 = statesInvolved.indexOf(t.nextState);
                      if (si === -1 || ti2 === -1) return null;
                      const x1 = 80 + si * 140, y1 = 110;
                      const x2 = 80 + ti2 * 140, y2 = 110;
                      const isActive = currentState === t.currentState && tape[headPosition] === t.readChar;
                      const color = isActive ? C.green : `${C.neon}50`;
                      const label = `${t.readChar}→${t.writeChar},${t.direction}`;

                      if (si === ti2) {
                        return (
                          <g key={i}>
                            <path d={`M${x1-16} ${y1-16} A22 22 0 1 1 ${x1+16} ${y1-16}`}
                              fill="none" stroke={color} strokeWidth={isActive ? 2 : 1}
                              markerEnd={isActive ? 'url(#arr-active)' : 'url(#arr)'}
                              filter={isActive ? 'url(#glow)' : ''}
                            />
                            <text x={x1} y={y1 - 52} fill={isActive ? C.green : C.textDim} fontSize="9" textAnchor="middle">{label}</text>
                          </g>
                        );
                      }
                      const cx = (x1 + x2) / 2;
                      const cy = x2 > x1 ? y1 - 45 : y1 + 45;
                      return (
                        <g key={i}>
                          <path d={`M${x1} ${y1} Q${cx} ${cy} ${x2} ${y2}`}
                            fill="none" stroke={color} strokeWidth={isActive ? 2 : 1}
                            strokeDasharray={isActive ? '0' : '4 3'}
                            markerEnd={isActive ? 'url(#arr-active)' : 'url(#arr)'}
                            filter={isActive ? 'url(#glow)' : ''}
                          />
                          <text x={cx} y={x2 > x1 ? cy - 6 : cy + 14} fill={isActive ? C.green : C.textDim} fontSize="9" textAnchor="middle">{label}</text>
                        </g>
                      );
                    })}

                    {/* Nodos */}
                    {statesInvolved.map((state, idx) => {
                      const x = 80 + idx * 140, y = 110;
                      const isCurrent = state === currentState;
                      const isAccept = state.includes('accept');
                      return (
                        <g key={state} transform={`translate(${x},${y})`}>
                          {isAccept && <circle r="27" fill="none" stroke={C.green} strokeWidth="1" opacity="0.5" />}
                          <circle r="22"
                            fill={isCurrent ? `${C.neon}22` : C.card}
                            stroke={isCurrent ? C.neon : isAccept ? C.green : C.cardBorder}
                            strokeWidth={isCurrent ? 2 : 1.5}
                            filter={isCurrent ? 'url(#glow)' : ''}
                          />
                          <text fill={isCurrent ? C.neon : C.textMid} fontSize="10" textAnchor="middle" dy="4" fontFamily="Share Tech Mono, monospace">
                            {state.length > 8 ? state.slice(0, 7) + '…' : state}
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                </div>
              </div>

              {/* LOG */}
              <div style={styles.card}>
                <div style={styles.logHeader}>CORE_LOG_OUTPUT //</div>
                <div style={styles.logBox}>
                  {logs.map((log, i) => (
                    <div key={i} style={{
                      color: log.includes('OK') || log.includes('STEP') ? C.neon
                        : log.includes('ERR') || log.includes('FAIL') ? C.pink
                        : C.textDim,
                      animation: i === 0 ? 'fadeIn 0.3s ease' : 'none',
                    }}>
                      {log}
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

          <footer style={{ marginTop: '24px', paddingTop: '16px', borderTop: `1px solid ${C.cardBorder}`, textAlign: 'center', fontSize: '9px', color: C.textDim, letterSpacing: '3px' }}>
            PROCESADOR CUÁNTICO DE TURING — ENTORNO DE SIMULACIÓN REACT // {new Date().getFullYear()}
          </footer>
        </div>
      </div>
    </>
  );
}
