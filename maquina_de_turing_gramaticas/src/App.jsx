import { useState, useCallback } from 'react';
import { TuringDiagram } from './TuringDiagram.jsx';
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
    descripcion: "Ordenamiento: Separa dos tribus rivales (X e Y) moviendo las 'X' a la izquierda mediante intercambios sucesivos.",
    inputPorDefecto: "YXXYXY",
    transiciones: [
      // q0 busca una 'Y' para empezar a controlar el orden
      { currentState: 'q0', readChar: 'X', nextState: 'q0', writeChar: 'X', direction: 'R' },
      { currentState: 'q0', readChar: 'Y', nextState: 'busca_X', writeChar: 'Y', direction: 'R' },
      { currentState: 'q0', readChar: '_', nextState: 'q_accept', writeChar: '_', direction: 'S' },
      
      // busca_X espera encontrar una 'X' saltándose las 'Y' para hacer el intercambio
      { currentState: 'busca_X', readChar: 'Y', nextState: 'busca_X', writeChar: 'Y', direction: 'R' },
      { currentState: 'busca_X', readChar: 'X', nextState: 'intercambia', writeChar: 'Y', direction: 'L' },
      { currentState: 'busca_X', readChar: '_', nextState: 'q_accept', writeChar: '_', direction: 'S' },
      
      // retrocede un paso y cambia la 'Y' anterior por la 'X'
      { currentState: 'intercambia', readChar: 'Y', nextState: 'regresa_inicio', writeChar: 'X', direction: 'L' },
      
      // Vuelve al inicio de la cinta (_) para reiniciar el escaneo de forma segura
      { currentState: 'regresa_inicio', readChar: 'X', nextState: 'regresa_inicio', writeChar: 'X', direction: 'L' },
      { currentState: 'regresa_inicio', readChar: 'Y', nextState: 'regresa_inicio', writeChar: 'Y', direction: 'L' },
      { currentState: 'regresa_inicio', readChar: '_', nextState: 'q0', writeChar: '_', direction: 'R' }
    ]
  },
  parentesis_balanceados: {
    nombre: "🧮 PARÉNTESIS BALANCEADOS",
    descripcion: "Verifica si los paréntesis están correctamente anidados eliminando los pares ( ).",
    inputPorDefecto: "(())",
    transiciones: [
      // q0 busca el primer paréntesis de cierre ')'
      { currentState: 'q0', readChar: '(', nextState: 'q0', writeChar: '(', direction: 'R' },
      { currentState: 'q0', readChar: 'X', nextState: 'q0', writeChar: 'X', direction: 'R' },
      { currentState: 'q0', readChar: ')', nextState: 'busca_apertura', writeChar: 'X', direction: 'L' },
      { currentState: 'q0', readChar: '_', nextState: 'ir_inicio', writeChar: '_', direction: 'L' },
      
      // busca hacia atrás el '(' más cercano para emparejarlo con una 'X'
      { currentState: 'busca_apertura', readChar: 'X', nextState: 'busca_apertura', writeChar: 'X', direction: 'L' },
      { currentState: 'busca_apertura', readChar: '(', nextState: 'q0', writeChar: 'X', direction: 'R' },
      
      // Va al extremo izquierdo antes de validar toda la cinta
      { currentState: 'ir_inicio', readChar: 'X', nextState: 'ir_inicio', writeChar: 'X', direction: 'L' },
      { currentState: 'ir_inicio', readChar: '(', nextState: 'ir_inicio', writeChar: '(', direction: 'L' }, // Por si quedaron sin pareja
      { currentState: 'ir_inicio', readChar: '_', nextState: 'verificar_limpio', writeChar: '_', direction: 'R' },
      
      // Recorre a la derecha; si solo hay 'X', acepta. Si encuentra un '(' colgado, no acepta.
      { currentState: 'verificar_limpio', readChar: 'X', nextState: 'verificar_limpio', writeChar: 'X', direction: 'R' },
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
    nombre: "🔄 DETECTOR DE PALÍNDROMOS (A, B, C)",
    descripcion: "Compara los extremos de la palabra uno a uno eliminándolos. ¡Soporta de forma unificada las letras A, B, C!",
    inputPorDefecto: "ABBA",
    transiciones: (() => {
      // 🌟 Declaramos el alfabeto combinado que necesitas
      const alfabeto = ["A", "B", "C"];
      let t = [];

      // 1. Transiciones desde el estado inicial q0
      // Lee el primer carácter, lo borra para marcarlo como procesado y abre su rama específica
      alfabeto.forEach(letra => {
        t.push({ currentState: 'q0', readChar: letra, nextState: `busca_${letra}`, writeChar: '_', direction: 'R' });
      });
      // Si lee un espacio en blanco de entrada, significa que la cadena está vacía o terminamos con éxito
      t.push({ currentState: 'q0', readChar: '_', nextState: 'q_accept', writeChar: '_', direction: 'S' });

      // 2. Generación dinámica de estados de búsqueda y comparación por cada elemento
      alfabeto.forEach(letraActual => {
        // En el estado busca_LETRA, salta CUALQUIER elemento del alfabeto moviéndose a la derecha
        alfabeto.forEach(letraSalto => {
          t.push({ currentState: `busca_${letraActual}`, readChar: letraSalto, nextState: `busca_${letraActual}`, writeChar: letraSalto, direction: 'R' });
        });
        // Cuando encuentra el espacio en blanco al final de la cinta, retrocede un paso a la izquierda para comparar
        t.push({ currentState: `busca_${letraActual}`, readChar: '_', nextState: `compara_${letraActual}`, writeChar: '_', direction: 'L' });

        // Si la celda del extremo derecho coincide con la que buscamos, la borra y activa el retorno
        t.push({ currentState: `compara_${letraActual}`, readChar: letraActual, nextState: 'retorno', writeChar: '_', direction: 'L' });
        
        // Caso especial (longitudes impares): si al ir a comparar se cruza con un espacio vacío,
        // significa que era el carácter del centro de la palabra y ya está emparejado. ¡Se acepta!
        t.push({ currentState: `compara_${letraActual}`, readChar: '_', nextState: 'q_accept', writeChar: '_', direction: 'S' });
      });

      // 3. Estado de retorno al extremo izquierdo
      // Salta cualquier elemento del alfabeto moviéndose todo hacia la izquierda
      alfabeto.forEach(letraSalto => {
        t.push({ currentState: 'retorno', readChar: letraSalto, nextState: 'retorno', writeChar: letraSalto, direction: 'L' });
      });
      // Cuando topa con el blanco del inicio, avanza un paso a la derecha y reinicia en q0
      t.push({ currentState: 'retorno', readChar: '_', nextState: 'q0', writeChar: '_', direction: 'R' });

      return t;
    })()
  },
  generador_fractales: {
    nombre: "🌿 GENERADOR DE FRACTALES (L-System)",
    descripcion: "Aplica reglas de reescritura de fractales de texto. Aquí expande el axioma 'F' usando la regla clásica F → F+F.",
    inputPorDefecto: "F",
    transiciones: [
      { currentState: 'q0', readChar: 'F', nextState: 'expandir', writeChar: 'F', direction: 'R' },
      { currentState: 'q0', readChar: '_', nextState: 'q_accept', writeChar: '_', direction: 'S' },
      { currentState: 'expandir', readChar: '_', nextState: 'escribe_mas', writeChar: '+', direction: 'R' },
      { currentState: 'escribe_mas', readChar: '_', nextState: 'escribe_F', writeChar: 'F', direction: 'R' },
      { currentState: 'escribe_F', readChar: '_', nextState: 'q_accept', writeChar: '_', direction: 'S' }
    ]
  },
  elementos_sumas: {
    nombre: "📊 IDENTIFICADOR DE ELEMENTOS DE SUMA UNIVERSAL",
    descripcion: "Analiza sintácticamente la ecuación reconociendo todos los dígitos numéricos como sumandos (S) y los operadores (+).",
    inputPorDefecto: "123+456",
    transiciones: (() => {
      let t = [];
      const digitos = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

      // Genera una regla para cada número posible del 0 al 9
      digitos.forEach(digito => {
        t.push({ currentState: 'q0', readChar: digito, nextState: 'q0', writeChar: 'S', direction: 'R' });
      });

      // Mantiene el operador más y el fin de cadena
      t.push({ currentState: 'q0', readChar: '+', nextState: 'q0', writeChar: '+', direction: 'R' });
      t.push({ currentState: 'q0', readChar: '_', nextState: 'q_accept', writeChar: '_', direction: 'S' });

      return t;
    })()
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
  grid: { display: 'grid', gridTemplateColumns: '380px 1fr', gap: '24px', marginBottom: '24px' },
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
    textShadow: `0 0 8px ${dir === 'R' ? C.green : dir === 'L' ? C.neon : C.amber}`
  }),
  statusBadge: (status) => ({ padding: '6px 16px', borderRadius: '4px', fontSize: '12px', border: `2px solid ${status === 'accepted' ? C.green : status === 'rejected' ? C.pink : C.neon}`, color: status === 'accepted' ? C.green : status === 'rejected' ? C.pink : C.neon, fontWeight: '800', textShadow: `0 0 5px ${status==='accepted'?C.green:C.pink}` }),
  table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px', marginTop: '10px' },
  th: { borderBottom: `2px solid ${C.cardBorder}`, padding: '12px 16px', color: C.neon, fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' },
  td: { padding: '12px 16px', borderBottom: `1px solid #041021`, fontFamily: 'monospace' }
};

export default function App() {
  const [algoritmoActual, setAlgoritmoActual] = useState('suma_unaria');
  const [tapeInput, setTapeInput] = useState(ALGORITMOS.suma_unaria.inputPorDefecto);

  const [glosarioTuringAbierto, setGlosarioTuringAbierto] = useState(false);
  const [glosarioChomskyAbierto, setGlosarioChomskyAbierto] = useState(false);

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
  const [activeRuleIdx, setActiveRuleIdx] = useState(-1); 

  const initMachine = useCallback((inputOpcional, transicionesOpcionales, idAlgoOpcional) => {
    const cadenaALeer = inputOpcional !== undefined ? inputOpcional : tapeInput;
    const listaTransiciones = transicionesOpcionales !== undefined ? transicionesOpcionales : transitions;
    const nombreAlgoritmo = idAlgoOpcional !== undefined ? idAlgoOpcional : algoritmoActual;

    const t = cadenaALeer.toUpperCase().split(''); 
    
    setTape(['_', '_', ...(t.length ? t : ['_']), '_', '_']);
    setHeadPosition(2);
    
    const estadoInicial = listaTransiciones[0]?.currentState || 'q0';
    setCurrentState(estadoInicial);
    setStatus('idle');
    setStepCount(0);
    setActiveRuleIdx(-1);
    setLastMove({ dir: 'S', text: 'MÁQUINA INICIALIZADA EN POSICIÓN [2]' });
    setLogs([`// SYSTEM: algoritmo [${nombreAlgoritmo.toUpperCase()}] cargado correctamente.`]);
  }, [tapeInput, transitions, algoritmoActual]);

  const stepExecution = () => {
    if (status === 'accepted' || status === 'rejected') return;
    const currentChar = tape[headPosition] || '_';
    
    // --- 🌟 EL TRUCO DE LA VARIABLE DINÁMICA ---
    let letraGuardada = null; // Declaración en el ámbito de la función
    if (currentState.includes('_') && !currentState.endsWith('_')) {
      letraGuardada = currentState.split('_')[1]; // ¡Corregido! Sin re-declarar let
    }

    let ruleIdx = transitions.findIndex(t => {
      const tState = t.currentState.replace('$', letraGuardada);
      const tRead = t.readChar === '$' ? letraGuardada : t.readChar;
      
      return tState === currentState && 
             (tRead === currentChar || tRead === 'DINAMICO' && currentChar !== '_');
    });

    if (ruleIdx === -1) {
      ruleIdx = transitions.findIndex(t => t.currentState === currentState && t.readChar === '*');
    }

    if (ruleIdx === -1) {
      setStatus('rejected');
      setActiveRuleIdx(-1);
      setLastMove({ dir: 'S', text: '🛑 ERROR: SIN TRANSICIÓN' });
      setLogs(p => [`// ERR: Detención abrupta. Sin transiciones para δ(${currentState}, '${currentChar}')`, ...p]);
      return;
    }

    const rule = transitions[ruleIdx];
    setActiveRuleIdx(ruleIdx);

    let nextStateDinamico = rule.nextState;
    if (rule.nextState.includes('$')) {
      const letraAFormatear = letraGuardada || currentChar;
      nextStateDinamico = rule.nextState.replace('$', letraAFormatear);
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
    setCurrentState(nextStateDinamico); 
    setStepCount(p => p + 1);
    
    const dirTexto = rule.direction === 'R' ? `DERECHA (→) de pos ${antiguaPosicion} a pos ${pos}` : rule.direction === 'L' ? `IZQUIERDA (←) de pos ${antiguaPosicion} a pos ${pos}` : `STAY (•) en pos ${pos}`;
    setLastMove({ dir: rule.direction, text: dirTexto });

    setLogs(p => [`// PASO ${stepCount + 1}: δ(${currentState},'${currentChar}') → (${nextStateDinamico},'${charAQuedar}',${rule.direction})`, ...p]);

    if (nextStateDinamico.toLowerCase().includes('accept')) {
      setStatus('accepted');
      setLogs(p => ['// COMPUTACIÓN COMPLETADA: Cadena aceptada y validada con éxito ✓', ...p]);
    } else if (nextStateDinamico.toLowerCase().includes('reject')) {
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
              <h1 style={styles.headerTitle}>MÁQUINA DE TURING //</h1>
              <p style={styles.headerSub}>SIMULACIÓN Y EXPLICACIÓN FORMAL DE AUTÓMATAS</p>
            </div>
            <div style={styles.statusBadge(status)}>{status.toUpperCase()}</div>
          </header>

          {/* DOS GLOSARIOS FORMALES COLAPSABLES */}
          <div style={styles.glossaryGrid}>
            <div style={styles.glossaryCard}>
              <div 
                style={{ ...styles.sectionTitle(C.neon), cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', userSelect: 'none' }}
                onClick={() => setGlosarioTuringAbierto(!glosarioTuringAbierto)}
              >
                <span>📋 ELEMENTOS FORMALES DE LA MÁQUINA DE TURING M = {"⟨Q, Σ, Γ, δ, q0, B, F⟩"}</span>
                <span style={{ marginLeft: '10px', color: C.neon }}>{glosarioTuringAbierto ? '▼' : '►'}</span>
              </div>
              
              {glosarioTuringAbierto && (
                <div style={{ marginTop: '12px', borderTop: `1px dashed ${C.cardBorder}`, paddingTop: '10px' }}>
                  <div style={styles.glossaryItem}><span style={styles.glossaryTerm}>Q (Conjunto Finito de Estados):</span> Es el "cerebro" o la memoria interna del procesador de control.</div>
                  {/* 🌟 CORRECCIÓN: Envolvemos el conjunto con comillas para evitar el error 'B is not defined' */}
                  <div style={styles.glossaryItem}><span style={styles.glossaryTerm}>Σ (Alfabeto de Entrada):</span> Símbolos permitidos antes de iniciar la computación. Restricción: {"(Σ ∩ {B} = ∅)"}.</div>
                  <div style={styles.glossaryItem}><span style={styles.glossaryTerm}>Γ (Alfabeto de la Cinta):</span> El superconjunto de caracteres legibles y escribibles (Σ ⊂ Γ).</div>
                  <div style={styles.glossaryItem}><span style={styles.glossaryTerm}>B o _ (Símbolo Blanco / Blank):</span> Celda vacía que provee memoria ilimitada.</div>
                  {/* 🌟 CORRECCIÓN: Envolvemos las direcciones entre comillas para evitar el error 'L is not defined' */}
                  <div style={styles.glossaryItem}><span style={styles.glossaryTerm}>δ (Función de Transición):</span> Mapeo δ: Q × Γ → Q × Γ × {"{'L', 'R', 'S'}"}.</div>
                  <div style={styles.glossaryItem}><span style={styles.glossaryTerm}>q0 (Estado Inicial):</span> Estado donde se posiciona el control de forma automática.</div>
                  <div style={styles.glossaryItem}><span style={styles.glossaryTerm}>F o q_accept (Estados Finales):</span> Determinan la detención exitosa del sistema.</div>
                </div>
              )}
            </div>

            <div style={styles.glossaryCard}>
              <div 
                style={{ ...styles.sectionTitle(C.pink), cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', userSelect: 'none' }}
                onClick={() => setGlosarioChomskyAbierto(!glosarioChomskyAbierto)}
              >
                <span>🏛️ JERARQUÍA DE CHOMSKY (Clasificación de Lenguajes)</span>
                <span style={{ marginLeft: '10px', color: C.pink }}>{glosarioChomskyAbierto ? '▼' : '►'}</span>
              </div>
              
              {glosarioChomskyAbierto && (
                <div style={{ marginTop: '12px', borderTop: `1px dashed ${C.cardBorder}`, paddingTop: '10px' }}>
                  <div style={styles.glossaryItem}><span style={styles.chomskyTerm}>Tipo 0 (Gramáticas No Restringidas):</span> Reconocidas por las Máquinas de Turing.</div>
                  <div style={styles.glossaryItem}><span style={styles.chomskyTerm}>Tipo 1 (Sensibles al Contexto):</span> Reconocidas por Autómatas Linealmente Acotados (LBA).</div>
                  <div style={styles.glossaryItem}><span style={styles.chomskyTerm}>Tipo 2 (Libres de Contexto):</span> Reconocidas por los Autómatas de Pila (PDA).</div>
                  <div style={styles.glossaryItem}><span style={styles.chomskyTerm}>Tipo 3 (Regulares):</span> Reconocidas por los Autómatas Finitos (AFD/AFND).</div>
                </div>
              )}
            </div>
          </div>

          {/* INTERFAZ PRINCIPAL */}
          <div style={styles.grid}>
            {/* PANEL IZQUIERDO */}
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
              
              <div style={{...styles.card, padding: '12px 20px', borderLeft: `3px solid ${C.amber}`}}>
                <div style={{fontSize: '9px', color: C.textDim, letterSpacing: '1px'}}>ÚLTIMO MOVIMIENTO CABEZAL</div>
                <div style={{fontSize: '11px', fontWeight: 'bold', color: '#fff', marginTop: '2px'}}>{lastMove.text}</div>
              </div>
            </div>

            {/* PANEL DERECHO */}
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

              <div style={styles.card}>
                <div style={{ fontSize: '10px', color: C.textDim, marginBottom: '6px', letterSpacing: '1px' }}>CONSOLE_OUTPUT // REGISTRO DE TRABAJO δ</div>
                <div style={{ background: '#01050f', padding: '12px', height: '110px', overflowY: 'auto', fontSize: '12px', borderRadius: '4px', border: `1px solid ${C.cardBorder}` }}>
                  {logs.map((l, idx) => <div key={idx} style={{ padding: '2px 0', color: l.includes('COMPLETADA')? C.green : l.includes('ERR')? C.pink : C.textMid, fontFamily: 'monospace' }}>{l}</div>)}
                </div>
              </div>
            </div>
          </div>

          {/* MATRIZ DE TRANSICIÓN */}
          <div style={styles.card}>
            <div style={styles.sectionTitle(C.green)}>💻 MATRIZ FORMAL DE LA FUNCIÓN DE TRANSICIÓN δ (ALGORITMO ACTUAL)</div>
            <div style={{ overflowX: 'auto' }}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Fila</th>
                    <th style={styles.th}>Estado Origen (Q)</th>
                    <th style={styles.th}>Carácter Leído (Γ)</th>
                    <th style={styles.th}>Estado Destino (Q)</th>
                    <th style={styles.th}>Carácter Escrito (Γ)</th>
                    <th style={styles.th}>Dirección Cabezal</th>
                    <th style={styles.th}>Estado Operación</th>
                  </tr>
                </thead>
                <tbody>
                  {transitions.map((t, idx) => {
                    const isRowActive = idx === activeRuleIdx;
                    return (
                      <tr 
                        key={idx} 
                        id={`fila-transicion-${idx}`}
                        style={{ 
                          background: isRowActive ? `${C.green}15` : 'transparent',
                          transition: 'background 0.2s ease',
                          color: isRowActive ? C.green : C.text
                        }}
                      >
                        <td style={{...styles.td, color: isRowActive ? C.green : C.textDim}}>[{idx}]</td>
                        <td style={{...styles.td, fontWeight: isRowActive ? '900' : '400'}}>{t.currentState}</td>
                        <td style={{...styles.td, color: isRowActive ? C.green : C.amber, fontWeight: 'bold'}}>{t.readChar === '_' ? 'B (Blanco)' : t.readChar}</td>
                        <td style={{...styles.td}}>{t.nextState}</td>
                        <td style={{...styles.td, color: isRowActive ? C.green : C.pink}}>{t.writeChar === '_' ? 'B (Blanco)' : t.writeChar === '*' ? 'Mismo' : t.writeChar}</td>
                        <td style={{...styles.td, fontWeight: 'bold'}}>
                          {t.direction === 'R' ? 'DERECHA (→)' : t.direction === 'L' ? 'IZQUIERDA (←)' : 'STAY (•)'}
                        </td>
                        <td style={{...styles.td, fontSize: '11px', color: isRowActive ? C.green : C.textDim}}>
                          {isRowActive ? '⚡ EJECUTANDO' : '⚪ EN ESPERA'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* DIAGRAMA INTERACTIVO SINCRONIZADO */}
          <TuringDiagram 
            algoritmoActual={ALGORITMOS[algoritmoActual]}
            estadoActual={currentState}
            transicionEjecutadaIndex={activeRuleIdx}
          />
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes bounce {
          from { transform: translateY(0); }
          to { transform: translateY(4px); }
        }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: #01040a; border-radius: 4px; }
        ::-webkit-scrollbar-thumb { background: #00ffff33; border: 1px solid #00ffff; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #00ffff66; }
        * { scrollbar-width: thin; scrollbar-color: #00ffff33 #01040a; }
      `}} />
    </>
  );
}