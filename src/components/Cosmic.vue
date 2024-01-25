<template>
    <div class="graph-container" ref="graphContainer">
        <div class="slot-content" style="position: absolute; z-index: 10; width: 100%;">
            <slot></slot> <!-- This allows parent components to insert content -->
        </div>
        <!-- SVG Graph will be appended here -->
    </div>
</template>
  
<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import * as d3 from 'd3';
// Store the interval ID
let intervalId;

const graphContainer = ref(null);

// Drag functionality for nodes
function drag(simulation) {
    function dragstarted(event) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
    }

    function dragged(event) {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
    }

    function dragended(event) {
        if (!event.active) simulation.alphaTarget(0);
        event.subject.fx = null;
        event.subject.fy = null;
    }

    return d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended);
}

function connectNodesForDiamond(nodes) {
  const links = [];
  let numRows = 1;
  let nodesUsed = 0;

  // Find the number of rows for half of the diamond by solving the quadratic equation
  while ((numRows * (numRows + 1)) / 2 <= nodes.length / 2) {
    numRows++;
  }
  numRows -= 1; // Adjust numRows to the last complete row possible

  // The maximum nodes we can use to form a complete diamond shape
  const maxNodesForDiamond = numRows * (numRows + 1);

  // Connect the first (upright) pyramid
  for (let row = 0; row < numRows && nodesUsed < nodes.length; row++) {
    for (let i = 0; i < row && nodesUsed < nodes.length; i++) {
      const currentNode = nodesUsed + i;
      const nextNodeSameRow = currentNode + 1;
      const nodeBelow = currentNode + row;
      const nextNodeBelow = nodeBelow + 1;

      // Connect current node to the next in the same row, if it's not the last in its row
      if (i < row - 1 && nextNodeSameRow < nodes.length) {
        links.push({ source: nodes[currentNode].id, target: nodes[nextNodeSameRow].id });
      }

      // Connect to nodes in the row below
      if (row < numRows - 1 && nodeBelow < nodes.length) {
        links.push({ source: nodes[currentNode].id, target: nodes[nodeBelow].id });
        if (nextNodeBelow < nodes.length) {
          links.push({ source: nodes[currentNode].id, target: nodes[nextNodeBelow].id });
        }
      }
    }
    nodesUsed += row + 1;
  }

  // Connect the second (inverted) pyramid
  for (let row = numRows - 2; row >= 0 && nodesUsed < nodes.length; row--) {
    for (let i = 0; i < row && nodesUsed < nodes.length; i++) {
      const currentNode = nodesUsed + i;
      const nextNodeSameRow = currentNode + 1;
      const nodeAbove = currentNode - (row + 1);
      const nextNodeAbove = nodeAbove + 1;

      // Connect current node to the next in the same row, if it's not the last in its row
      if (i < row - 1 && nextNodeSameRow < nodes.length) {
        links.push({ source: nodes[currentNode].id, target: nodes[nextNodeSameRow].id });
      }

      // Connect to nodes in the row above
      if (nodeAbove < nodes.length) {
        links.push({ source: nodes[currentNode].id, target: nodes[nodeAbove].id });
        if (nextNodeAbove < nodes.length) {
          links.push({ source: nodes[currentNode].id, target: nodes[nextNodeAbove].id });
        }
      }
    }
    nodesUsed += row + 1;
  }

  return links;
}


function connectNodesForPyramid(nodes) {
  const links = [];
  let numRows = 0;
  
  // Calculate the number of rows in the pyramid based on the length of nodes array.
  // The total nodes in a pyramid follow the pattern of the sum of the first n natural numbers: n(n+1)/2
  while (numRows * (numRows + 1) / 2 < nodes.length) {
    numRows++;
  }

//   // The calculation may produce an incomplete pyramid if the number of nodes does not form a perfect triangular number
//   if (numRows * (numRows + 1) / 2 !== nodes.length) {
//     throw new Error("The number of nodes does not form a perfect pyramid.");
//   }

  let nodeIndex = 0; // Initialize node index

  // Iterate over each row, connecting nodes to form the pyramid
  for (let row = 0; row < numRows; row++) {
    for (let i = 0; i < row; i++) {
      const currentNode = nodeIndex + i;
      const nextNodeSameRow = currentNode + 1;
      const nodeBelow = currentNode + row;
      const nextNodeBelow = nodeBelow + 1;

      // Connect current node to the next in the same row, if it's not the last in its row
      if (i < row - 1) {
        links.push({ source: nodes[currentNode].id, target: nodes[nextNodeSameRow].id });
      }

      // Connect to nodes in the row below if it's not the last row
      if (row < numRows - 1) {
        links.push({ source: nodes[currentNode].id, target: nodes[nodeBelow].id });
        links.push({ source: nodes[currentNode].id, target: nodes[nextNodeBelow].id });
      }
    }
    // Move index to the start of the next row
    nodeIndex += row + 1;
  }

  return links;
}


function connectNodesForSpiral(nodes) {
const additionalLinksCount= 0;
    const links = [];

  // Connect each node to the next to form the base spiral
  for (let i = 0; i < nodes.length - 1; i++) {
    links.push({ source: nodes[i].id, target: nodes[i + 1].id });
  }

  // Add a set of random additional links
  for (let i = 0; i < additionalLinksCount; i++) {
    const sourceIndex = Math.floor(Math.random() * nodes.length);
    let targetIndex = Math.floor(Math.random() * nodes.length);

    // Ensure we don't link a node to itself and don't duplicate links
    while (targetIndex === sourceIndex || links.some(link => (link.source === nodes[sourceIndex].id && link.target === nodes[targetIndex].id))) {
      targetIndex = Math.floor(Math.random() * nodes.length);
    }

    links.push({ source: nodes[sourceIndex].id, target: nodes[targetIndex].id });
  }

  return links;
}


function connectNodesForNeuralNetwork(nodes) {
  const numLayers  =5;
    const links = [];
  const layerSize = Math.floor(nodes.length / numLayers);
  
  for (let i = 0; i < numLayers - 1; i++) {
    const currentLayerStart = i * layerSize;
    const nextLayerStart = (i + 1) * layerSize;
    const nextLayerEnd = i + 2 === numLayers ? nodes.length : (i + 2) * layerSize;
    
    for (let j = currentLayerStart; j < nextLayerStart; j++) {
      for (let k = nextLayerStart; k < nextLayerEnd; k++) {
        links.push({ source: nodes[j].id, target: nodes[k].id });
      }
    }
  }
  
  return links;
}

function connectNodesForPhyllotaxisPattern(nodes, turnsPerCycle = 3) {
  const links = [];
  const goldenAngle = Math.PI * (3 - Math.sqrt(5)); // Golden angle in radians

  // Assuming the first node is at the center
  for (let i = 1; i < nodes.length; i++) {
    const sqrtI = Math.sqrt(i);
    const angle = i * goldenAngle;
    const distance = turnsPerCycle * sqrtI;
    nodes[i].x = distance * Math.cos(angle);
    nodes[i].y = distance * Math.sin(angle);

    // Connect each node to its predecessor to create a spiral
    links.push({ source: nodes[i - 1].id, target: nodes[i].id });

    // Optional: connect each node to the one before the predecessor to emphasize the spiral
    if (i > 1) {
      links.push({ source: nodes[i - 2].id, target: nodes[i].id });
    }
  }

  return links;
} 


onUnmounted(() => {
    // Clear the interval when the component is unmounted
    clearInterval(intervalId);
});

onMounted(() => {
    const width = graphContainer.value.clientWidth;
    const height = graphContainer.value.clientHeight;

    // Nodes data
    const nodes = Array.from({ length: 100 }, (_, id) => ({
        id,
        radius: Math.random() * (10 - 5) + 5 // Random radius between 5 and 15
    }));

    // Links data - initially empty
    let links = [];

    // Create the force simulation
    const simulation = d3.forceSimulation(nodes)
    .force('link', d3.forceLink(links).id(d => d.id).distance(100))
    .force('charge', d3.forceManyBody().strength(-30)) // Positive value pulls nodes together
    .force('center', d3.forceCenter(width / 2, height / 2)); // Keeps pulling nodes towards the center

    // Create SVG element
    const svg = d3.select(graphContainer.value)
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .style('position', 'absolute')
        .style('top', '0')
        .style('left', '0');


    // Define Gaussian blur filter
    const defs = svg.append('defs');
    const filter = defs.append('filter')
        .attr('id', 'blur-filter')
        .attr('width', '200%')
        .attr('height', '200%');
    filter.append('feGaussianBlur')
        .attr('in', 'SourceGraphic')
        .attr('stdDeviation', 2); // Adjust stdDeviation for more or less blur

    // Create link lines
    let link = svg.append('g')
        .selectAll('line');

    // Create nodes
    let node = svg.append('g')
        .selectAll('circle')
        .data(nodes)
        .join('circle')
        .attr('r', d => d.radius)
        .attr('fill', d => d3.interpolateBlues(Math.random()))
        .call(drag(simulation));

    // Function to update the graph with new random links
    const updateGraph = () => {
        // Generate new random links
        //   const newLinks = nodes.map((node, index) => {
        //     const target = Math.floor(Math.random() * nodes.length);
        //     return index !== target ? { source: index, target: target } : null;
        //   }).filter(Boolean);

        // Example of how to use these functions with randomness
        const patternGenerators = [
        connectNodesForPhyllotaxisPattern,
            connectNodesForDiamond,
            connectNodesForSpiral,
            connectNodesForNeuralNetwork,
            // connectNodesForVortex,
        ];


        // Select a random pattern generator
        const randomPatternIndex = Math.floor(Math.random() * patternGenerators.length);
        const patternFunction = patternGenerators[randomPatternIndex];

        // Generate links using the selected pattern generator
        const newLinks = patternFunction(nodes);


    // Update the links dataset
    links.splice(0, links.length, ...newLinks);
    simulation.force('link').links(links);

    // Restart the simulation with new links
    simulation.alpha(1).restart();

    // Rebind the data for links
    link = link.data(links, d => `${d.source.id}-${d.target.id}`);
    link.exit().remove(); // Remove old links
    link = link.enter().append('line').merge(link)
        // .attr('filter', 'url(#blur-filter)')
        .attr('stroke', '#999')
        .attr('stroke-opacity', 0.6)
        .attr('stroke-width', 1.5);

    // Apply the general update pattern to the nodes
    node = node.data(nodes, d => d.id);
    node.exit().remove(); // This would be necessary if nodes could be removed
    node = node.enter().append('circle').merge(node)
        // .attr('filter', 'url(#blur-filter)')
        .attr('r', d => d.radius)
        .attr('fill', d => d3.interpolateBlues(Math.random()));
};

// Update the graph for the first time
updateGraph();

// Update positions each tick of the simulation
simulation.on('tick', () => {
    link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);

    node
        .attr('cx', d => d.x)
        .attr('cy', d => d.y);
});

// Call the updateGraph function every 5 seconds
intervalId = setInterval(updateGraph, 3000);;

// setInterval(updateGraph, 3000);
  });
</script>
  

<style scoped>
.graph-container {
    width: 100%;
    height: 100vh;
    background: radial-gradient(circle at 50px 50px, #283c58, #070d16);
    position: relative;
    overflow: hidden;
}

.slot-content {
    /* Additional styling for slot content if needed */
}
</style>
  