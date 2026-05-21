import { useState, useCallback } from 'react';

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
  bg: '#030811', card: '#071224', cardBorder: '#0b2244',
  neon: '#00ffff', green: '#39ff14', pink: '#ff007f', amber: '#ffaa00',
  text: '#d1e4ff', textDim: '#3a537d', textMid: '#688dbf',
};

const styles = {
  root: { minHeight: '100vh', background: C.bg, color: C.text, fontFamily: '"Share Tech Mono", monospace', padding: '20px 0', position: 'relative' },
  gridBg: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundImage: `linear-gradient(rgba(0,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,255,0.02) 1px, transparent 1px)`, backgroundSize: '30px 30px', pointerEvents: 'none', zIndex: 0 },
  container: { position: 'relative', zIndex: 1, maxWidth: '1500px', margin: '0 auto', padding: '0 20px' },
  header: { borderBottom: `2px solid ${C.cardBorder}`, paddingBottom: '16px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle: { fontSize: '32px', fontWeight: '800', letterSpacing: '3px', background: `linear-gradient(90deg, ${C.neon}, ${C.green})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: 0 },
  headerSub: { fontSize: '12px', color: C.textMid, letterSpacing: '2px', marginTop: '4px' },
  
  glossaryGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' },
  glossaryCard: { background: `${C.card}bb`, border: `1px solid ${C.cardBorder}`, borderRadius: '8px', padding: '16px' },
  glossaryItem: { fontSize: '11px', marginBottom: '10px', lineHeight: '1.4' },
  glossaryTerm: { color: C.neon, fontWeight: '700' },
  chomskyTerm: { color: C.pink, fontWeight: '700' },

  grid: { display: 'grid', gridTemplateColumns: '380px 1fr', gap: '24px' },
  card: { background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: '8px', padding: '20px', position: 'relative', boxShadow: '0 4px 20px rgba(0,0,0,0.5)' },
  sectionTitle: (color = C.neon) => ({ fontSize: '12px', fontWeight: '700', color, letterSpacing: '2px', marginBottom: '16px', textTransform: 'uppercase' }),
  input: { width: '100%', background: '#020612', border: `1px solid ${C.cardBorder}`, borderRadius: '4px', padding: '10px 12px', color: C.green, fontFamily: 'inherit', fontSize: '14px', outline: 'none', boxSizing: 'border-box' },
  selectAlgo: { width: '100%', background: '#040d1a', border: `2px solid ${C.neon}`, borderRadius: '6px', padding: '10px', color: C.neon, fontFamily: 'inherit', fontSize: '12px', fontWeight: '700', outline: 'none', marginBottom: '14px', cursor: 'pointer' },
  btnPrimary: { flex: 1, background: `linear-gradient(135deg, ${C.green}33, ${C.green}11)`, border: `2px solid ${C.green}`, borderRadius: '4px', color: C.green, fontFamily: 'inherit', fontSize: '11px', fontWeight: '800', padding: '10px', cursor: 'pointer', letterSpacing: '1px' },
  btnSecondary: { background: 'transparent', border: `1px solid ${C.cardBorder}`, borderRadius: '4px', color: C.textMid, fontFamily: 'inherit', fontSize: '11px', padding: '10px 16px', cursor: 'pointer' },
  
  tapeWrap: { display: 'flex', alignItems: 'center', gap: '8px', overflowX: 'auto', padding: '35px 20px 35px', background: '#01040a', border: `2px solid ${C.cardBorder}`, borderRadius: '8px', boxShadow: 'inset 0 0 15px rgba(0,0,0,0.8)' },
  tapeCell: (isHead) => ({
    flexShrink: 0, width: '54px', height: '58px',
    border: isHead ? `3px solid ${C.pink}` : `1px solid ${C.cardBorder}`,
    borderRadius: '6px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative',
    background: isHead ? `linear-gradient(180deg, #30001a, #50002a)` : '#050f1f',
    color: isHead ? '#ffffff' : C.textMid,
    fontSize: '22px', fontWeight: isHead ? '900' : '400',
    boxShadow: isHead ? `0 0 20px ${C.pink}, inset 0 0 10px ${C.pink}` : 'none',
    transform: isHead ? 'scale(1.12)' : 'scale(1)',
    transition: 'all 0.15s ease-out',
  }),
  directionIndicator: (dir) => ({
    position: 'absolute', bottom: '-28px', fontSize: '16px', fontWeight: '900',
    color: dir === 'R' ? C.green : dir === 'L' ? C.neon : C.amber,
    animation: 'bounce 0.6s infinite alternate',
    textShadow: `0 0 8px ${dir === 'R' ? C.green : dir === 'L' ? C.neon : C.amber}`
  }),

  statusBadge: (status) => ({ padding: '6px 16px', borderRadius: '4px', fontSize: '12px', border: `2px solid ${status === 'accepted' ? C.green : status === 'rejected' ? C.pink : C.neon}`, color: status === 'accepted' ? C.green : status === 'rejected' ? C.pink : C.neon, fontWeight: '800', textShadow: `0 0 5px ${status==='accepted'?C.green:C.pink}` })
};

export default function App() {
  // 1. ESTADOS INICIALIZADOS DIRECTAMENTE (Ya no dependemos de un useEffect para rellenarlos)
  const [algoritmoActual, setAlgoritmoActual] = useState('suma_unaria');
  const [tapeInput, setTapeInput] = useState(ALGORITMOS.suma_unaria.inputPorDefecto);
  
  // Inicializamos la cinta directamente con los '_' y el input cortado
  const [tape, setTape] = useState(() => {
    const t = ALGORITMOS.suma_unaria.inputPorDefecto.split('');
    return ['_', '_', ...(t.length ? t : ['_']), '_', '_'];
  });
  
  const [headPosition, setHeadPosition] = useState(2);
  const [currentState, setCurrentState] = useState(() => ALGORITMOS.suma_unaria.transiciones[0]?.currentState || 'q0');
  const [transitions, setTransitions] = useState(ALGORITMOS.suma_unaria.transiciones);
  const [status, setStatus] = useState('idle');
  const [stepCount, setStepCount] = useState(0);
  const [logs, setLogs] = useState([`// SYSTEM: algoritmo [SUMA_UNARIA] cargado correctamente.`]);
  const [lastMove, setLastMove] = useState({ dir: 'S', text: 'MÁQUINA INICIALIZADA EN POSICIÓN [2]' });

  // 2. FUNCIÓN DE RE-INICIALIZACIÓN (Solo se llamará de forma reactiva en eventos de usuario)
  const initMachine = useCallback((inputOpcional, transicionesOpcionales, idAlgoOpcional) => {
    const cadenaALeer = inputOpcional !== undefined ? inputOpcional : tapeInput;
    const listaTransiciones = transicionesOpcionales !== undefined ? transicionesOpcionales : transitions;
    const nombreAlgoritmo = idAlgoOpcional !== undefined ? idAlgoOpcional : algoritmoActual;

    const t = cadenaALeer.split('');
    setTape(['_', '_', ...(t.length ? t : ['_']), '_', '_']);
    setHeadPosition(2);
    
    const estadoInicial = listaTransiciones[0]?.currentState || 'q0';
    setCurrentState(estadoInicial);
    setStatus('idle');
    setStepCount(0);
    setLastMove({ dir: 'S', text: 'MÁQUINA INICIALIZADA EN POSICIÓN [2]' });
    setLogs([`// SYSTEM: algoritmo [${nombreAlgoritmo.toUpperCase()}] cargado correctamente.`]);
  }, [tapeInput, transitions, algoritmoActual]);

  // Se ejecuta limpiamente una sola vez al montar la aplicación
  

  const stepExecution = () => {
    if (status === 'accepted' || status === 'rejected') return;
    const currentChar = tape[headPosition] || '_';
    
    let rule = transitions.find(t => t.currentState === currentState && t.readChar === currentChar);
    if (!rule) {
      rule = transitions.find(t => t.currentState === currentState && t.readChar === '*');
    }

    if (!rule) {
      setStatus('rejected');
      setLastMove({ dir: 'S', text: '🛑 ERROR: SIN TRANSICIÓN' });
      setLogs(p => [`// ERR: Detención abrupta. Sin transiciones para δ(${currentState}, '${currentChar}')`, ...p]);
      return;
    }

    const newTape = [...tape];
    const charAQuedar = rule.writeChar === '*' ? currentChar : rule.writeChar;
    newTape[headPosition] = charAQuedar;
    
    const antiguaPosicion = headPosition;
    let pos = headPosition;
    if (rule.direction === 'R') pos++;
    if (rule.direction === 'L') pos--;
    
    if (pos < 0) { newTape.unshift('_'); pos = 0; }
    if (pos >= newTape.length) newTape.push('_');

    setTape(newTape);
    setHeadPosition(pos);
    setCurrentState(rule.nextState);
    setStepCount(p => p + 1);
    
    const dirTexto = rule.direction === 'R' ? `DERECHA (→) de pos ${antiguaPosicion} a pos ${pos}` : rule.direction === 'L' ? `IZQUIERDA (←) de pos ${antiguaPosicion} a pos ${pos}` : `STAY (•) en pos ${pos}`;
    setLastMove({ dir: rule.direction, text: dirTexto });

    setLogs(p => [`// PASO ${stepCount + 1}: δ(${currentState},'${currentChar}') → (${rule.nextState},'${charAQuedar}',${rule.direction})`, ...p]);

    if (rule.nextState.toLowerCase().includes('accept')) {
      setStatus('accepted');
      setLogs(p => ['// COMPUTACIÓN COMPLETADA: Cadena aceptada y validada con éxito ✓', ...p]);
    } else if (rule.nextState.toLowerCase().includes('reject')) {
      setStatus('rejected');
      setLogs(p => ['// COMPUTACIÓN FALLIDA: La cadena entró en estado de rechazo ✗', ...p]);
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
              <p style={styles.headerSub}>SISTEMA OPERATIVO DE SIMULACIÓN Y EXPLICACIÓN FORMAL DE AUTÓMATAS</p>
            </div>
            <div style={styles.statusBadge(status)}>{status.toUpperCase()}</div>
          </header>

          {/* DOS GLOSARIOS FORMALES */}
          <div style={styles.glossaryGrid}>
            <div style={styles.glossaryCard}>
              <div style={styles.sectionTitle(C.neon)}>📋 ELEMENTOS DE LA MÁQUINA DE TURING M = ⟨Q, Σ, Γ, δ, q0, B, F⟩</div>
              <div style={styles.glossaryItem}>
                <span style={styles.glossaryTerm}>Q (Conjunto Finito de Estados):</span> Todos los estados internos lógicos en los que se puede encontrar el procesador (Ej: `q0`, `busca_A`).
              </div>
              <div style={styles.glossaryItem}>
                <span style={styles.glossaryTerm}>Σ (Alfabeto de Entrada):</span> Símbolos permitidos en la cadena original que escribe el usuario antes de iniciar la computación.
              </div>
              <div style={styles.glossaryItem}>
                <span style={styles.glossaryTerm}>Γ (Alfabeto de la Cinta):</span> Símbolos totales que la máquina puede escribir. Incluye a Σ y al símbolo Blanco (Γ &gt; Σ).
              </div>
              <div style={styles.glossaryItem}>
                <span style={styles.glossaryTerm}>B o _ (Símbolo Blanco):</span> Carácter de espacio vacío que llena la cinta hasta el infinito a la izquierda y derecha.
              </div>
              <div style={styles.glossaryItem}>
                <span style={styles.glossaryTerm}>δ (Función de Transición):</span> La matriz matemática que dicta la ejecución: δ(q_act, letra) → (q_sig, escribe, Dirección).
              </div>
              <div style={styles.glossaryItem}>
                <span style={styles.glossaryTerm}>Cabezal de Lectura/Escritura:</span> El puntero físico-lógico que se desplaza por las celdas leyendo, editando caracteres y moviéndose (R, L, S).
              </div>
            </div>

            <div style={styles.glossaryCard}>
              <div style={styles.sectionTitle(C.pink)}>🏛️ JERARQUÍA DE CHOMSKY (Clasificación de Lenguajes Formales)</div>
              <div style={styles.glossaryItem}>
                <span style={styles.chomskyTerm}>Tipo 0 (Gramáticas No Restringidas):</span> Reconocidas por las **Máquinas de Turing**. Son el tope de poder de cómputo; procesan cualquier lenguaje computable recursivamente enumerable.
              </div>
              <div style={styles.glossaryItem}>
                <span style={styles.chomskyTerm}>Tipo 1 (Gramáticas Sensibles al Contexto):</span> Reconocidas por **Autómatas Linealmente Acotados**. El tamaño de la memoria de trabajo está limitado por la longitud de la entrada.
              </div>
              <div style={styles.glossaryItem}>
                <span style={styles.chomskyTerm}>Tipo 2 (Gramáticas Libres de Contexto):</span> Reconocidas por **Autómatas de Pila (PDA)**. Utilizan estructuras de tipo LIFO (pilas) para procesar anidaciones, como los paréntesis balanceados.
              </div>
              <div style={styles.glossaryItem}>
                <span style={styles.chomskyTerm}>Tipo 3 (Gramáticas Regulares):</span> Reconocidas por **Autómatas Finitos (AFD / AFND)**. Son las más simples (Ej: expresiones regulares). No tienen memoria a largo plazo ni cintas.
              </div>
            </div>
          </div>

          {/* INTERFAZ PRINCIPAL DE TRABAJO */}
          <div style={styles.grid}>
            
            {/* PANEL IZQUIERDO DE CONTROL */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={styles.card}>
                <div style={styles.sectionTitle(C.neon)}>🛠️ CARGAR LÓGICA DE COMPUTACIÓN</div>
                
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

                <p style={{ fontSize: '11px', color: C.textMid, marginBottom: '16px', lineHeight: '1.4' }}>
                  {ALGORITMOS[algoritmoActual].descripcion}
                </p>

                <label style={{ fontSize: '10px', color: C.textDim, display: 'block', marginBottom: '6px', letterSpacing: '1px' }}>CINTA DE ENTRADA (Σ)</label>
                <input
                  style={styles.input}
                  type="text"
                  value={tapeInput}
                  onChange={e => setTapeInput(e.target.value)}
                  disabled={status !== 'idle'}
                />

                <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                  <button style={styles.btnPrimary} onClick={stepExecution} disabled={status==='accepted'||status==='rejected'}>▶ EJECUTAR PASO</button>
                  <button style={styles.btnSecondary} onClick={() => initMachine()}>↺ RESET</button>
                </div>
              </div>

              {/* RECUADRO DE MOVIMIENTO REALZADO */}
              <div style={{...styles.card, borderLeft: `4px solid ${C.amber}`}}>
                <div style={styles.sectionTitle(C.amber)}>📍 RASTREADOR DE DIRECCIÓN</div>
                <div style={{fontSize: '13px', fontWeight: 'bold', color: '#fff'}}>{lastMove.text}</div>
              </div>
            </div>

            {/* PANEL DERECHO: CINTA HIGH CONTRAST Y ESTADOS */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={styles.card}>
                <div style={styles.sectionTitle(C.textMid)}>◈ MONITOR DE TRABAJO DE CINTA FIJA (Γ)</div>
                <div style={styles.tapeWrap}>
                  {tape.map((char, i) => {
                    const isHead = i === headPosition;
                    return (
                      <div key={i} style={styles.tapeCell(isHead)}>
                        {isHead && <div style={{ position: 'absolute', top: '-18px', color: C.pink, fontSize: '12px', fontWeight: '900' }}>▼ CABEZAL</div>}
                        <span>{char}</span>
                        <span style={{ fontSize: '9px', color: isHead ? '#ffb3d9' : C.textDim, position: 'absolute', bottom: '2px' }}>{i}</span>
                        {isHead && (
                          <div style={styles.directionIndicator(lastMove.dir)}>
                            {lastMove.dir === 'R' ? '→' : lastMove.dir === 'L' ? '←' : '•'}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginTop: '20px' }}>
                  <div style={{ background: '#020612', padding: '12px', borderRadius: '4px', textAlign: 'center', border: `1px solid ${C.cardBorder}` }}>
                    <div style={{ fontSize: '9px', color: C.textDim, letterSpacing: '1px' }}>ESTADO ACTUAL (Q)</div>
                    <div style={{ color: C.neon, fontWeight: '700', fontSize: '16px', marginTop: '4px' }}>{currentState}</div>
                  </div>
                  <div style={{ background: '#020612', padding: '12px', borderRadius: '4px', textAlign: 'center', border: `1px solid ${C.cardBorder}` }}>
                    <div style={{ fontSize: '9px', color: C.textDim, letterSpacing: '1px' }}>POSICIÓN CABEZAL</div>
                    <div style={{ color: C.green, fontWeight: '700', fontSize: '16px', marginTop: '4px' }}>{headPosition}</div>
                  </div>
                  <div style={{ background: '#020612', padding: '12px', borderRadius: '4px', textAlign: 'center', border: `1px solid ${C.cardBorder}` }}>
                    <div style={{ fontSize: '9px', color: C.textDim, letterSpacing: '1px' }}>PASOS CALCULADOS</div>
                    <div style={{ color: C.amber, fontWeight: '700', fontSize: '16px', marginTop: '4px' }}>{stepCount}</div>
                  </div>
                </div>
              </div>

              {/* LOGS / CONSOLA */}
              <div style={styles.card}>
                <div style={{ fontSize: '10px', color: C.textDim, marginBottom: '6px', letterSpacing: '1px' }}>CONSOLE_OUTPUT // REGISTRO DE TRABAJO δ</div>
                <div style={{ background: '#01050f', padding: '12px', height: '130px', overflowY: 'auto', fontSize: '12px', borderRadius: '4px', border: `1px solid ${C.cardBorder}` }}>
                  {logs.map((l, idx) => <div key={idx} style={{ padding: '2px 0', color: l.includes('COMPLETADA')? C.green : l.includes('ERR')? C.pink : C.textMid, fontFamily: 'monospace' }}>{l}</div>)}
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
      
      {/* Estilos inyectados seguros compatibles con las estrictas reglas de React */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes bounce {
          from { transform: translateY(0); }
          to { transform: translateY(4px); }
        }
      `}} />
    </>
  );
}