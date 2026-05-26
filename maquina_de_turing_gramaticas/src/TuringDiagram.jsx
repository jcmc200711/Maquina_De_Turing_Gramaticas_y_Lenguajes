import { useEffect, useRef } from 'react';
import cytoscape from 'cytoscape';

export const TuringDiagram = ({ algoritmoActual, estadoActual, transicionEjecutadaIndex }) => {
  const containerRef = useRef(null);
  const cyRef = useRef(null);

  // --- EFECTO 1: Inyectar estilos CSS para la sincronización con la tabla ---
  useEffect(() => {
    if (!document.getElementById('turing-dynamic-styles')) {
      const styleEl = document.createElement('style');
      styleEl.id = 'turing-dynamic-styles';
      styleEl.innerHTML = `
        .highlight-cyber {
          background-color: rgba(255, 0, 127, 0.15) !important;
          border-left: 4px solid #ff007f !important;
          transition: all 0.2s ease;
        }
      `;
      document.head.appendChild(styleEl);
    }
  }, []);

  // --- EFECTO 2: Dibujar/Redibujar el Grafo al cambiar de algoritmo ---
  useEffect(() => {
    if (!containerRef.current || !algoritmoActual || !algoritmoActual.transiciones) return;

    // Destruir instancia previa de forma segura antes de recrear otra
    if (cyRef.current) {
      cyRef.current.destroy();
      cyRef.current = null;
    }

    const nodes = new Map();
    const edges = [];

    algoritmoActual.transiciones.forEach((t, index) => {
      if (!t.currentState || !t.nextState) return;

      nodes.set(t.currentState, { id: t.currentState, label: t.currentState });
      nodes.set(t.nextState, { id: t.nextState, label: t.nextState });

      const edgeId = `e-${t.currentState}-${t.nextState}`;
      const labelTransicion = `${t.readChar} ➔ ${t.writeChar}, ${t.direction}`;
      
      const aristaExistente = edges.find(e => e.data.id === edgeId);
      if (aristaExistente) {
        aristaExistente.data.label += `\n${labelTransicion}`;
        aristaExistente.data.filasAsociadas.push(index);
      } else {
        edges.push({
          data: {
            id: edgeId,
            source: t.currentState,
            target: t.nextState,
            label: labelTransicion,
            filasAsociadas: [index]
          }
        });
      }
    });

    const elements = [
      ...Array.from(nodes.values()).map(n => ({ data: n })),
      ...edges
    ];

    try {
      cyRef.current = cytoscape({
        container: containerRef.current,
        elements: elements,
        style: [
          {
            selector: 'node',
            style: {
              'background-color': '#0f172a',
              'border-width': '2px',
              'border-color': '#00ffcc',
              'label': 'data(label)',
              'color': '#ffffff',
              'font-family': 'monospace',
              'font-size': '13px',
              'text-valign': 'center',
              'text-halign': 'center',
              'width': '55px',
              'height': '55px',
              'transition-property': 'background-color, border-color',
              'transition-duration': '0.2s'
            }
          },
          {
            selector: 'node[id = "q0"]',
            style: {
              'background-color': '#1e1b4b',
              'border-color': '#ff007f'
            }
          },
          {
            selector: 'node[id = "q_accept"]',
            style: {
              'border-style': 'double',
              'border-width': '4px',
              'border-color': '#39ff14'
            }
          },
          {
            selector: 'edge',
            style: {
              'width': 2,
              'line-color': '#4b5563',
              'target-arrow-color': '#4b5563',
              'target-arrow-shape': 'triangle',
              'curve-style': 'bezier',
              'control-point-step-size': 50,
              'label': 'data(label)',
              'font-family': 'monospace',
              'font-size': '10px',
              'color': '#9ca3af',
              'text-wrap': 'wrap',
              'text-background-opacity': 0.85,
              'text-background-color': '#030712',
              'text-background-padding': '3px',
              'text-background-shape': 'roundrectangle'
            }
          },
          {
            selector: 'node.activo',
            style: {
              'background-color': '#ff007f',
              'border-color': '#ffffff',
              'scale': 1.12
            }
          },
          {
            selector: 'edge.activo',
            style: {
              'line-color': '#ff007f',
              'target-arrow-color': '#ff007f',
              'width': 4,
              'color': '#ffffff'
            }
          }
        ],
        layout: {
          name: 'grid',
          padding: 40,
          rows: 2
        }
      });

      // Asegurar que pinte el estado activo inicial inmediatamente al cargar
      if (estadoActual) {
        cyRef.current.$(`node[id = "${estadoActual}"]`).addClass('activo');
      }

      cyRef.current.on('tap', 'edge', function(evt){
        const edge = evt.target;
        const filas = edge.data('filasAsociadas');
        
        document.querySelectorAll('.tabla-transicion-fila').forEach(f => {
          f.classList.remove('highlight-cyber');
        });
        
        if (filas) {
          filas.forEach(index => {
            const filaElemento = document.getElementById(`fila-transicion-${index}`);
            if (filaElemento) filaElemento.classList.add('highlight-cyber');
          });
        }
      });
    } catch (error) {
      console.error("Error inicializando Cytoscape:", error);
    }

    return () => {
      if (cyRef.current) {
        cyRef.current.destroy();
        cyRef.current = null;
      }
    };
  }, [algoritmoActual]); // Quitamos estados de animación de aquí para evitar re-renderizados infinitos

  // --- EFECTO 3: Iluminación reactiva paso a paso ---
  useEffect(() => {
    // Si la instancia aún no está lista o fue destruida, salimos pacíficamente
    if (!cyRef.current || typeof cyRef.current.elements !== 'function') return;

    try {
      // Limpiar estados activos previos
      cyRef.current.elements().removeClass('activo');

      // Resaltar el estado actual de la máquina
      if (estadoActual) {
        const nodo = cyRef.current.$(`node[id = "${estadoActual}"]`);
        if (nodo.length > 0) nodo.addClass('activo');
      }

      // Resaltar la flecha de la transición ejecutada
      if (transicionEjecutadaIndex !== undefined && transicionEjecutadaIndex !== null && algoritmoActual?.transiciones) {
        const t = algoritmoActual.transiciones[transicionEjecutadaIndex];
        if (t) {
          const arista = cyRef.current.$(`edge[source = "${t.currentState}"][target = "${t.nextState}"]`);
          if (arista.length > 0) arista.addClass('activo');
        }
      }
    } catch (e) {
      console.warn("Lógica de animación omitida temporalmente (grafo actualizándose):", e);
    }
  }, [estadoActual, transicionEjecutadaIndex, algoritmoActual]);

  const contenedorEstilos = {
    width: '100%',
    height: '380px',
    backgroundColor: '#020617',
    border: '1px solid #1e293b',
    borderRadius: '8px',
    marginTop: '25px',
    position: 'relative',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)'
  };

  return (
    <div style={{ marginTop: '20px' }}>
      <h3 style={{ color: '#00ffcc', fontFamily: 'monospace', fontSize: '14px', marginBottom: '8px' }}>
        ▲ DIAGRAMA DE TRANSICIÓN DE ESTADOS INTERACTIVO
      </h3>
      <div ref={containerRef} style={contenedorEstilos} />
    </div>
  );
};