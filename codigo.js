class Nodo {
    constructor(valor) {
        this.valor = valor;
        this.nodoIzquierdo = null;
        this.nodoDerecho = null;
    }
}

class Arbol {
    constructor() {
        this.raiz = null;
    }

    insertar = (valor) => {
        const nuevoNodo = new Nodo(valor);
        if (this.raiz === null) {
            this.raiz = nuevoNodo;
        } else {
            this.insertarNodo(this.raiz, nuevoNodo);
        }
    }

    insertarNodo = (nodo, nuevoNodo) => {
        if (!nodo) return;

        if (nuevoNodo.valor > nodo.valor) {
            if (nodo.nodoDerecho === null) {
                nodo.nodoDerecho = nuevoNodo;
            } else {
                this.insertarNodo(nodo.nodoDerecho, nuevoNodo);
            }
        } else if (nuevoNodo.valor < nodo.valor) {
            if (nodo.nodoIzquierdo === null) {
                nodo.nodoIzquierdo = nuevoNodo;
            } else {
                this.insertarNodo(nodo.nodoIzquierdo, nuevoNodo);
            }
        } else {
            return;
        }
    }
}

let arbol = new Arbol();

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('form').onsubmit = (event) => {
        event.preventDefault();
        try {
            let valor = parseInt(document.getElementById('texBox').value);
            console.log(valor);
            arbol.insertar(valor);
            renderizarValor(valor);
            renderizarArbol(arbol.raiz);
            document.getElementById('texBox').value = '';

        } catch (error) {
            console.error('Error:', error);
        }
    }
});

const renderizarValor = (valor) => {
    let contenedor = document.getElementById('contenedor');
    let valor1 = document.createElement('h3');
    valor1.textContent = valor;
    contenedor.appendChild(valor1);
}

const renderizarArbol = (raiz) => {
    // Limpia el contenedor del árbol antes de renderizar el nuevo
    d3.select("#arbolContenedor").selectAll("*").remove();

    // Configuración de dimensiones y márgenes
    const margin = { top: 20, right: 90, bottom: 30, left: 90 },
        width = 600 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    // Aplica dimensiones al svg
    const svg = d3.select("#arbolContenedor").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    const root = d3.hierarchy(raiz, d => [d.nodoIzquierdo, d.nodoDerecho].filter(n => n !== null));
    const treeLayout = d3.tree().size([width, height]); // Usa tree layout de d3 para mantener la estructura

    treeLayout(root);

    // Añadir enlaces
    svg.selectAll('line.link')
        .data(root.links())
        .enter().append('line')
        .attr('class', 'link')
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);

    // Añadir nodos
    const node = svg.selectAll('g.node')
        .data(root.descendants())
        .enter().append('g')
        .attr('class', 'node')
        .attr('transform', d => `translate(${d.x},${d.y})`);

    node.append('circle')
        .attr('r', 10);

    node.append('text')
        .attr('dy', '.35em')
        .style('text-anchor', 'middle')
        .text(d => d.data.valor);
}

