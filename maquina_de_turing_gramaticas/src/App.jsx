import { useState, useEffect } from 'react';

// BANCO DE ALGORITMOS PRECONFIGURADOS
const ALGORITMOS = {
  suma_unaria: {
    nombre: "➕ SUMA UNARIA (111 + 11)",
    descripcion: "Suma números en base 1 (donde 3 es '111' y 2 es '11'). Une los bloques de '1' eliminando el signo '+'.",
    inputPorDefecto: "111+11",
    transiciones: [
      { currentState: 'q0', readChar: '1', nextState: 'q0', writeChar: '1', direction: 'R' },
      { currentState: 'q0', readChar: '+', nextState: 'busca_final', writeChar: '1', direction: 'R' },
      { currentState: 'busca_final', readChar: '1', nextState: 'busca_final', writeChar: '1', direction: 'R' },
      { currentState: 'busca_final', readChar: '_', nextState: 'borra_ultimo', writeChar: '_', direction: 'L' },
      { currentState: 'borra_ultimo', readChar: '1', nextState: 'q_accept', writeChar: '_', direction: 'S' }
    ]
  },
  encriptado_cesar: {
    nombre: "🔐 ENCRIPTADO JULIO CÉSAR (Shift +1)",
    descripcion: "Cifra un texto desplazando cada letra una posición adelante en el abecedario (A→B, B→C, C→A).",
    inputPorDefecto: "ABCBA",
    transiciones: [
      { currentState: 'q0', readChar: 'A', nextState: 'q0', writeChar: 'B', direction: 'R' },
      { currentState: 'q0', readChar: 'B', nextState: 'q0', writeChar: 'C', direction: 'R' },
      { currentState: 'q0', readChar: 'C', nextState: 'q0', writeChar: 'A', direction: 'R' },
      { currentState: 'q0', readChar: '_', nextState: 'q_accept', writeChar: '_', direction: 'S' }
    ]
  },
  ejemplo_tribus: {
    nombre: "⛺ EJEMPLO DE LAS TRIBUS (Segregación)",
    descripcion: "Ordenamiento: Separa dos tribus rivales (X e Y) mezcladas en la cinta, moviendo los miembros 'X' a la izquierda.",
    inputPorDefecto: "YXXYXY",
    transiciones: [
      { currentState: 'q0', readChar: 'X', nextState: 'q0', writeChar: 'X', direction: 'R' },
      { currentState: 'q0', readChar: 'Y', nextState: 'busca_X', writeChar: 'Y', direction: 'R' },
      { currentState: 'q0', readChar: '_', nextState: 'q_accept', writeChar: '_', direction: 'S' },
      { currentState: 'busca_X', readChar: 'Y', nextState: 'busca_X', writeChar: 'Y', direction: 'R' },
      { currentState: 'busca_X', readChar: 'X', nextState: 'retrocede', writeChar: 'Y', direction: 'L' },
      { currentState: 'busca_X', readChar: '_', nextState: 'q_accept', writeChar: '_', direction: 'S' },
      { currentState: 'retrocede', readChar: 'Y', nextState: 'cambia_A_X', writeChar: 'X', direction: 'L' },
      { currentState: 'cambia_A_X', readChar: 'X', nextState: 'q0', writeChar: 'X', direction: 'R' },
      { currentState: 'cambia_A_X', readChar: 'Y', nextState: 'q0', writeChar: 'Y', direction: 'R' }
    ]
  },
  parentesis_balanceados: {
    nombre: "🧮 PARÉNTESIS BALANCEADOS",
    descripcion: "Verifica si los paréntesis de apertura y cierre están correctamente anidados eliminando los pares ( ).",
    inputPorDefecto: "(())",
    transiciones: [
      { currentState: 'q0', readChar: '(', nextState: 'q0', writeChar: '(', direction: 'R' },
      { currentState: 'q0', readChar: 'X', nextState: 'q0', writeChar: 'X', direction: 'R' },
      { currentState: 'q0', readChar: ')', nextState: 'busca_apertura', writeChar: 'X', direction: 'L' },
      { currentState: 'q0', readChar: '_', nextState: 'verificar_limpio', writeChar: '_', direction: 'L' },
      { currentState: 'busca_apertura', readChar: 'X', nextState: 'busca_apertura', writeChar: 'X', direction: 'L' },
      { currentState: 'busca_apertura', readChar: '(', nextState: 'q0', writeChar: 'X', direction: 'R' },
      { currentState: 'verificar_limpio', readChar: 'X', nextState: 'verificar_limpio', writeChar: 'X', direction: 'L' },
      { currentState: 'verificar_limpio', readChar: '_', nextState: 'q_accept', writeChar: '_', direction: 'S' }
    ]
  },
  contador_binario: {
    nombre: "🔢 CONTADOR BINARIO (+1)",
    descripcion: "Suma 1 a cualquier número binario. Se mueve al final y viaja hacia atrás aplicando el acarreo de bits.",
    inputPorDefecto: "1011",
    transiciones: [
      { currentState: 'q0', readChar: '1', nextState: 'q0', writeChar: '1', direction: 'R' },
      { currentState: 'q0', readChar: '0', nextState: 'q0', writeChar: '0', direction: 'R' },
      { currentState: 'q0', readChar: '_', nextState: 'acarreo', writeChar: '_', direction: 'L' },
      { currentState: 'acarreo', readChar: '1', nextState: 'acarreo', writeChar: '0', direction: 'L' },
      { currentState: 'acarreo', readChar: '0', nextState: 'retorno', writeChar: '1', direction: 'L' },
      { currentState: 'acarreo', readChar: '_', nextState: 'retorno', writeChar: '1', direction: 'L' },
      { currentState: 'retorno', readChar: '1', nextState: 'retorno', writeChar: '1', direction: 'L' },
      { currentState: 'retorno', readChar: '0', nextState: 'retorno', writeChar: '0', direction: 'L' },
      { currentState: 'retorno', readChar: '_', nextState: 'q_accept', writeChar: '_', direction: 'R' }
    ]
  },
  el_palindromo: {
    nombre: "🔄 DETECTOR DE PALÍNDROMOS",
    descripcion: "Compara los extremos de la palabra uno a uno (eliminándolos) para comprobar si es capicúa.",
    inputPorDefecto: "ABBA",
    transiciones: [
      { currentState: 'q0', readChar: 'A', nextState: 'busca_A', writeChar: '_', direction: 'R' },
      { currentState: 'q0', readChar: 'B', nextState: 'busca_B', writeChar: '_', direction: 'R' },
      { currentState: 'q0', readChar: '_', nextState: 'q_accept', writeChar: '_', direction: 'S' },
      { currentState: 'busca_A', readChar: 'A', nextState: 'busca_A', writeChar: 'A', direction: 'R' },
      { currentState: 'busca_A', readChar: 'B', nextState: 'busca_A', writeChar: 'B', direction: 'R' },
      { currentState: 'busca_A', readChar: '_', nextState: 'compara_A', writeChar: '_', direction: 'L' },
      { currentState: 'busca_B', readChar: 'A', nextState: 'busca_B', writeChar: 'A', direction: 'R' },
      { currentState: 'busca_B', readChar: 'B', nextState: 'busca_B', writeChar: 'B', direction: 'R' },
      { currentState: 'busca_B', readChar: '_', nextState: 'compara_B', writeChar: '_', direction: 'L' },
      { currentState: 'compara_A', readChar: 'A', nextState: 'retorno', writeChar: '_', direction: 'L' },
      { currentState: 'compara_B', readChar: 'B', nextState: 'retorno', writeChar: '_', direction: 'L' },
      { currentState: 'retorno', readChar: 'A', nextState: 'retorno', writeChar: 'A', direction: 'L' },
      { currentState: 'retorno', readChar: 'B', nextState: 'retorno', writeChar: 'B', direction: 'L' },
      { currentState: 'retorno', readChar: '_', nextState: 'q0', writeChar: '_', direction: 'R' }
    ]
  },
  generador_fractales: {
    nombre: "🌿 GENERADOR DE FRACTALES (L-System)",
    descripcion: "Aplica reglas de reescritura de fractales de texto. Aquí expande el axioma 'F' usando la regla clásica F → F+F.",
    inputPorDefecto: "F",
    transiciones: [
      { currentState: 'q0', readChar: 'F', nextState: 'expandir', writeChar: 'F', direction: 'R' },
      { currentState: 'expandir', readChar: '_', nextState: 'escribe_mas', writeChar: '+', direction: 'R' },
      { currentState: 'escribe_mas', readChar: '_', nextState: 'escribe_F', writeChar: 'F', direction: 'R' },
      { currentState: 'escribe_F', readChar: '_', nextState: 'q_accept', writeChar: '_', direction: 'S' }
    ]
  },
  elementos_sumas: {
    nombre: "📊 IDENTIFICADOR DE ELEMENTOS DE SUMA",
    descripcion: "Analiza sintácticamente la ecuación reconociendo los sumandos (S) y los operadores (+).",
    inputPorDefecto: "5+7",
    transiciones: [
      { currentState: 'q0', readChar: '5', nextState: 'q0', writeChar: 'S', direction: 'R' },
      { currentState: 'q0', readChar: '7', nextState: 'q0', writeChar: 'S', direction: 'R' },
      { currentState: 'q0', readChar: '+', nextState: 'q0', writeChar: '+', direction: 'R' },
      { currentState: 'q0', readChar: '_', nextState: 'q_accept', writeChar: '_', direction: 'S' }
    ]
  }
};

const C = {
  bg: '#050c14', card: '#0a1628', cardBorder: '#0d2440',
  neon: '#00e5ff', green: '#00ff88', pink: '#ff2d6b', amber: '#ffb800',
  text: '#c8d8e8', textDim: '#4a6080', textMid: '#7a98b8',
};

const styles = {
  root: { minHeight: '100vh', background: C.bg, color: C.text, fontFamily: '"Share Tech Mono", monospace', padding: '0', position: 'relative' },
  gridBg: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundImage: `linear-gradient(rgba(0,229,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,255,0.03) 1px, transparent 1px)`, backgroundSize: '40px 40px', pointerEvents: 'none', zIndex: 0 },
  container: { position: 'relative', zIndex: 1, maxWidth: '1400px', margin: '0 auto', padding: '24px' },
  header: { borderBottom: `1px solid ${C.cardBorder}`, paddingBottom: '20px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
  headerTitle: { fontSize: '28px', fontWeight: '700', letterSpacing: '4px', background: `linear-gradient(135deg, ${C.neon}, ${C.green})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: 0 },
  headerSub: { fontSize: '12px', color: C.textMid, letterSpacing: '2px', margin: '5px 0 0 0' },
  glossaryCard: { background: `${C.card}80`, border: `1px solid ${C.cardBorder}`, borderRadius: '8px', padding: '16px', marginBottom: '24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' },
  glossaryTerm: { color: C.neon, fontWeight: '700', display: 'block', marginBottom: '4px' },
  grid: { display: 'grid', gridTemplateColumns: '360px 1fr', gap: '20px' },
  card: { background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: '8px', padding: '20px', position: 'relative' },
  sectionTitle: (color = C.neon) => ({ fontSize: '11px', fontWeight: '700', color, letterSpacing: '2px', marginBottom: '16px' }),
  input: { width: '100%', background: C.bg, border: `1px solid ${C.cardBorder}`, borderRadius: '4px', padding: '8px 12px', color: C.green, fontFamily: 'inherit', fontSize: '14px', outline: 'none', boxSizing: 'border-box' },
  selectAlgo: { width: '100%', background: C.card, border: `2px solid ${C.neon}`, borderRadius: '6px', padding: '10px', color: C.neon, fontFamily: 'inherit', fontSize: '12px', fontWeight: '700', outline: 'none', marginBottom: '14px', cursor: 'pointer' },
  btnPrimary: { flex: 1, background: `linear-gradient(135deg, ${C.neon}22, ${C.neon}11)`, border: `1px solid ${C.neon}`, borderRadius: '4px', color: C.neon, fontFamily: 'inherit', fontSize: '11px', fontWeight: '700', padding: '9px 12px', cursor: 'pointer' },
  btnSecondary: { background: 'transparent', border: `1px solid ${C.cardBorder}`, borderRadius: '4px', color: C.textMid, fontFamily: 'inherit', fontSize: '11px', padding: '9px 14px', cursor: 'pointer' },
  tapeWrap: { display: 'flex', alignItems: 'center', gap: '6px', overflowX: 'auto', padding: '28px 16px 16px', background: `${C.bg}cc`, border: `1px solid ${C.cardBorder}`, borderRadius: '6px' },
  tapeCell: (isHead) => ({ flexShrink: 0, width: '48px', height: '52px', border: `1px solid ${isHead ? C.neon : C.cardBorder}`, borderRadius: '4px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', background: isHead ? `${C.neon}12` : `${C.card}`, color: isHead ? C.neon : C.textMid, fontSize: '18px' }),
  statusBadge: (status) => ({ padding: '6px 14px', borderRadius: '4px', fontSize: '11px', border: `1px solid ${status === 'accepted' ? C.green : status === 'rejected' ? C.pink : C.neon}`, color: status === 'accepted' ? C.green : status === 'rejected' ? C.pink : C.neon, fontWeight: '700' })
};

export default function App() {
  const [algoritmoActual, setAlgoritmoActual] = useState('suma_unaria');
  const [tapeInput, setTapeInput] = useState(ALGORITMOS.suma_unaria.inputPorDefecto);
  const [tape, setTape] = useState([]);
  const [headPosition, setHeadPosition] = useState(0);
  const [currentState, setCurrentState] = useState('q0');
  const [transitions, setTransitions] = useState(ALGORITMOS.suma_unaria.transiciones);
  const [status, setStatus] = useState('idle');
  const [stepCount, setStepCount] = useState(0);
  const [logs, setLogs] = useState([]);

  const initMachine = (inputOpcional, transicionesOpcionales, idAlgoOpcional) => {
    const cadenaALeer = inputOpcional !== undefined ? inputOpcional : tapeInput;
    const listaTransiciones = transicionesOpcionales !== undefined ? transicionesOpcionales : transitions;
    const nombreAlgo = idAlgoOpcional !== undefined ? idAlgoOpcional : algoritmoActual;

    const t = cadenaALeer.split('');
    setTape(['_', '_', ...(t.length ? t : ['_']), '_', '_']);
    setHeadPosition(2);
    
    const estadoInicial = listaTransiciones[0]?.currentState || 'q0';
    setCurrentState(estadoInicial);
    setStatus('idle');
    setStepCount(0);
    setLogs([`// SYSTEM: algoritmo [${nombreAlgo.toUpperCase()}] inicializado.`]);
  };

  // Único disparo de arranque al montar el componente
  useEffect(() => {
    initMachine(ALGORITMOS.suma_unaria.inputPorDefecto, ALGORITMOS.suma_unaria.transiciones, 'suma_unaria');
  }, []);

  const stepExecution = () => {
    if (status === 'accepted' || status === 'rejected') return;
    const currentChar = tape[headPosition] || '_';
    
    let rule = transitions.find(t => t.currentState === currentState && t.readChar === currentChar);
    if (!rule) {
      rule = transitions.find(t => t.currentState === currentState && t.readChar === '*');
    }

    if (!rule) {
      setStatus('rejected');
      setLogs(p => [`// ERR: Rompimiento de lógica. Sin transición para δ(${currentState}, '${currentChar}')`, ...p]);
      return;
    }

    const newTape = [...tape];
    const charAQuedar = rule.writeChar === '*' ? currentChar : rule.writeChar;
    newTape[headPosition] = charAQuedar;
    
    let pos = headPosition;
    if (rule.direction === 'R') pos++;
    if (rule.direction === 'L') pos--;
    
    if (pos < 0) { newTape.unshift('_'); pos = 0; }
    if (pos >= newTape.length) newTape.push('_');

    setTape(newTape);
    setHeadPosition(pos);
    setCurrentState(rule.nextState);
    setStepCount(p => p + 1);
    setLogs(p => [`// PASO ${stepCount + 1}: δ(${currentState},'${currentChar}') → (${rule.nextState},'${charAQuedar}',${rule.direction})`, ...p]);

    if (rule.nextState.toLowerCase().includes('accept')) {
      setStatus('accepted');
      setLogs(p => ['// COMPUTACIÓN COMPLETADA: Cadena aceptada de forma válida ✓', ...p]);
    } else if (rule.nextState.toLowerCase().includes('reject')) {
      setStatus('rejected');
      setLogs(p => ['// COMPUTACIÓN FALLIDA: Estado de rechazo alcanzado ✗', ...p]);
    }
  };

  return (
    <>
      <div style={styles.root}>
        <div style={styles.gridBg} />
        <div style={styles.container}>
          
          {/* HEADER */}
          <header style={styles.header}>
            <div>
              <h1 style={styles.headerTitle}>UNIVERSAL TURING COMPUTER //</h1>
              <p style={styles.headerSub}>PROCESADOR DINÁMICO DE ALFABETOS MÚLTIPLES</p>
            </div>
            <div style={styles.statusBadge(status)}>{status.toUpperCase()}</div>
          </header>

          {/* GLOSARIO */}
          <section style={styles.glossaryCard}>
            <div style={{ fontSize: '11px' }}>
              <span style={styles.glossaryTerm}>[ Σ ] ALFABETO LIBRE</span>
              <p style={{ color: C.textMid }}>Soporta cualquier palabra, texto o número. El motor procesa cadenas de longitud infinita.</p>
            </div>
            <div style={{ fontSize: '11px' }}>
              <span style={styles.glossaryTerm}>[ * ] REGLA COMODÍN</span>
              <p style={{ color: C.textMid }}>Un símbolo especial <b style={{ color: C.amber }}>*</b> en la tabla significa "procesa cualquier carácter desconocido sin detenerte".</p>
            </div>
            <div style={{ fontSize: '11px' }}>
              <span style={styles.glossaryTerm}>[ δ ] MÁQUINA UNIVERSAL</span>
              <p style={{ color: C.textMid }}>Puedes cambiar el algoritmo en el menú desplegable para reconfigurar la arquitectura al instante.</p>
            </div>
          </section>

          {/* INTERFAZ PRINCIPAL */}
          <div style={styles.grid}>
            
            {/* PANEL CONTROL */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={styles.card}>
                <div style={styles.sectionTitle(C.neon)}>🛠️ SELECCIONAR PROCESADOR</div>
                
                <select 
                  style={styles.selectAlgo} 
                  value={algoritmoActual} 
                  onChange={e => {
                    const nuevoAlgoId = e.target.value;
                    const algoDef = ALGORITMOS[nuevoAlgoId];
                    setAlgoritmoActual(nuevoAlgoId);
                    setTransitions(algoDef.transiciones);
                    setTapeInput(algoDef.inputPorDefecto);
                    initMachine(algoDef.inputPorDefecto, algoDef.transiciones, nuevoAlgoId);
                  }}
                >
                  {Object.keys(ALGORITMOS).map(id => (
                    <option key={id} value={id} style={{background: C.bg}}>{ALGORITMOS[id].nombre}</option>
                  ))}
                </select>

                <p style={{ fontSize: '10px', color: C.textMid, marginBottom: '14px', lineHeight: '1.4' }}>
                  {ALGORITMOS[algoritmoActual].descripcion}
                </p>

                <label style={{ fontSize: '10px', color: C.textDim, display: 'block', marginBottom: '4px' }}>CINTA DE ENTRADA (INPUT)</label>
                <input
                  style={styles.input}
                  type="text"
                  value={tapeInput}
                  onChange={e => setTapeInput(e.target.value)}
                  disabled={status !== 'idle'}
                />

                <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                  <button style={styles.btnPrimary} onClick={stepExecution} disabled={status==='accepted'||status==='rejected'}>▶ EJECUTAR PASO</button>
                  <button style={styles.btnSecondary} onClick={() => initMachine()}>↺ RESET</button>
                </div>
              </div>
            </div>

            {/* PANEL CINTA Y OUTPUT */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={styles.card}>
                <div style={styles.sectionTitle(C.textMid)}>◈ MONITOR DE CINTA COMPLIANT</div>
                <div style={styles.tapeWrap}>
                  {tape.map((char, i) => (
                    <div key={i} style={styles.tapeCell(i === headPosition)}>
                      {i === headPosition && <div style={{ position: 'absolute', top: '-18px', color: C.neon, fontSize: '10px' }}>▼</div>}
                      <span>{char}</span>
                      <span style={{ fontSize: '8px', color: C.textDim, position: 'absolute', bottom: '2px' }}>{i}</span>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginTop: '14px' }}>
                  <div style={{ background: C.bg, padding: '10px', borderRadius: '4px', textAlign: 'center' }}>
                    <div style={{ fontSize: '8px', color: C.textDim }}>ESTADO</div>
                    <div style={{ color: C.neon, fontWeight: '700' }}>{currentState}</div>
                  </div>
                  <div style={{ background: C.bg, padding: '10px', borderRadius: '4px', textAlign: 'center' }}>
                    <div style={{ fontSize: '8px', color: C.textDim }}>POSICIÓN</div>
                    <div style={{ color: C.green, fontWeight: '700' }}>{headPosition}</div>
                  </div>
                  <div style={{ background: C.bg, padding: '10px', borderRadius: '4px', textAlign: 'center' }}>
                    <div style={{ fontSize: '8px', color: C.textDim }}>PASOS</div>
                    <div style={{ color: C.amber, fontWeight: '700' }}>{stepCount}</div>
                  </div>
                </div>
              </div>

              {/* LOGS */}
              <div style={styles.card}>
                <div style={{ fontSize: '9px', color: C.textDim, marginBottom: '6px' }}>CONSOLE_OUTPUT //</div>
                <div style={{ background: '#020810', padding: '10px', height: '110px', overflowY: 'auto', fontSize: '11px', borderRadius: '4px' }}>
                  {logs.map((l, idx) => <div key={idx} style={{ color: l.includes('COMPLETADA')? C.green : l.includes('ERR')? C.pink : C.textMid }}>{l}</div>)}
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </>
  );
}