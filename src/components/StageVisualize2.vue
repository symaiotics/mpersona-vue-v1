<template>
    <div class="bg-gray-200 border rounded-sm" ref="d3Container"></div>
</template>
  
<script setup>
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue';
import * as d3 from 'd3';

// Define Props

let localNodes = ref([])
let localEdges = ref([])

const props = defineProps({
    treeNodes: Array,
    treeEdges: Array,
});

// Define Emits
const emit = defineEmits(['update:node', 'update:edges']);

// Other Refs
const d3Container = ref(null);
const width = 1000;
const height = 800;
const isDarkMode = ref(false);
let svg = null;
let g = null;
let simulation = null;
let zoom = null;
let resizeObserver = null;

onMounted(() => {

    if (props?.treeNodes) localNodes.value = props.treeNodes;
    if (props?.treeEdges) localEdges.value = props.treeEdges;

    updateDarkMode();
    // Add event listener to update styles on storage change
    window.addEventListener('storage', updateDarkMode);

    svg = d3.select(d3Container.value).append("svg")
        .attr("width", width)
        .attr("height", height);
    g = svg.append('g');

    // Define your zoom
    zoom = d3.zoom()
        .on("zoom", (event) => {
            g.attr("transform", event.transform);
        });

    // Call your zoom on the svg
    svg.call(zoom);

    window.addEventListener('resize', resize);
    resize(); // initial sizing

    resizeObserver = new ResizeObserver(() => {
        resize();
    });
    resizeObserver.observe(d3Container.value);

    // Set initial transform to center the g element and zoom out slightly
    const initialTransform = d3.zoomIdentity
        .translate(width / 2, height / 2)
        .scale(0.9);

    // Call the zoom transform on the svg
    svg.call(zoom.transform, initialTransform);

    simulation = d3.forceSimulation(localNodes.value)
        .force("link", d3.forceLink(localEdges.value).id(d => d.id))
        .stop(); // Stop the simulation immediately

    createArrowHead();
    initializeNodePositions('onMounted');
    renderGraph('onMounted');
});

onBeforeUnmount(() => {
    window.removeEventListener('storage', updateDarkMode);
    window.removeEventListener('resize', resize);
    resizeObserver.unobserve(d3Container.value);
});

const resize = () => {
    // Only resize if the component is visible
    if (d3Container.value.clientWidth > 0) {
        const resizeWidth = d3Container.value.clientWidth;
        const resizeHeight = window.innerHeight;

        svg.attr("width", resizeWidth).attr("height", resizeHeight);
    }
};

function createArrowHead() {
    svg.append("defs").append("marker")
        .attr("id", "arrow")
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", 5)
        .attr("refY", 0)
        .attr("markerWidth", 6)
        .attr("markerHeight", 6)
        .attr("orient", "auto")
        .append("path")
        .attr("d", "M0,-5L10,0L0,5")
        .attr("class", "arrowHead");
}

const drag = d3.drag()
    .on("start", dragstarted)
    .on("drag", dragged)
    .on("end", dragended);

// Adjust the drag started/ended logic if needed

function dragstarted(event, d) {
    d3.select(this).raise().attr("stroke", "black"); // Raise the node to the top
    d3.select(`#text-${d.id}`).raise(); // Raise the corresponding text to the top
}

function dragged(event, d) {
    // requestAnimationFrame(() => {
    d.x = event.x;
    d.y = event.y;
    d.px = event.x;
    d.py = event.y;

    // Update only the dragged node and text
    d3.select(`#node-${d.id}`).attr("x", d.x - 60).attr("y", d.y - 30);
    // d3.select(`#text-${d.id}`).attr("x", d.x).attr("y", d.y);

    d3.select(`#text-${d.id}`)
        .attr("x", d.x)
        .attr("y", d.y)
        .selectAll('tspan')
        .attr('x', d.x); // Ensure the x value of tspan is same as the parent text element

    // Update only the links connected to the dragged node
    g.selectAll(".link")
        .filter(link => link.source.id === d.id || link.target.id === d.id)
        .attr("d", d => computePath(d));

}

function dragended(event, d) {
    d3.select(this).attr("stroke", isDarkMode.value ? '#E2E8F0' : '#4A5568');
    emit('update:node', { ...d, px: d.x, py: d.y });
}

const renderGraph = (instigator) => {
    console.log("Render Graph", instigator)
    renderLinks();
    renderNodes();
    renderText();
};
const initializeNodePositions = (instigator) => {
    console.log("Initialize Node Positions", instigator)
    const verticalDistance = 250; // distance between nodes vertically
    const horizontalSpacing = 200; // distance between nodes horizontally
    const blockHeight = 60; // replace with the actual height of your block

    if (localNodes.value) {
        const maxStage = Math.max(...localNodes.value.map(node => node.stage));
        localNodes.value.forEach(node => {
            const stageNodes = localNodes.value.filter(n => n.stage === node.stage);
            const totalWidth = (stageNodes.length - 1) * horizontalSpacing;
            const startX = (width - totalWidth) / 2;
            node.x = startX + stageNodes.indexOf(node) * horizontalSpacing;

            if (node.stage === 0) {
                node.y = (node.stage * verticalDistance) + (blockHeight / 2); // adjust y for nodes at stage 0
            } else {
                node.y = node.stage * verticalDistance;
            }
        });
    }
};

const renderNodes = () => {
    g.selectAll(".node").raise();
    g.selectAll(".node")
        .data(localNodes.value || [], d => d ? d.id : null) // Check if d is not null before accessing id.
        .join(
            // Handle entering nodes
            enter => enter.append("rect")
                .attr("class", "node")
                .attr("id", d => d ? `node-${d.id}` : null) // Check if d is not null before accessing id.
                .attr("width", 120)
                .attr("height", 60)
                .attr("x", d => d && d.x ? d.x - 60 : 0) // Check if d and d.x are not null before using d.x.
                .attr("y", d => d && d.y ? d.y - 30 : 0) // Check if d and d.y are not null before using d.y.
                .style("fill", (d) => {
                    if (!d || !d.status) return "#ffffff"; // If d or d.status is null, return default color.

                    const statusColors = {
                        'idle': "#ffffff",
                        'complete': "#00ff00",
                        'inProgress': "#ffff00",
                        'error': "#ff0000",
                        'missing': "#0000ff"
                    };

                    return statusColors[d.status] || "#ffffff"; // Return color for d.status or default if not found.
                })
                .style("stroke", isDarkMode.value ? '#E2E8F0' : '#4A5568') // Explicitly set stroke color.
                .call(drag),

            // Handle updating nodes
            update => update
                // Here you can modify the attributes/styles of the existing nodes if needed
                .attr("x", d => d && d.x ? d.x - 60 : 0) // Example: updating x position
                .attr("y", d => d && d.y ? d.y - 30 : 0) // Example: updating y position
                .style("fill", (d) => {
                    if (!d || !d.status) return "#ffffff"; // If d or d.status is null, return default color.

                    const statusColors = {
                        'idle': "#ffffff",
                        'complete': "#00ff00",
                        'inProgress': "#ffff00",
                        'error': "#ff0000",
                        'missing': "#0000ff"
                    };

                    return statusColors[d.status] || "#ffffff"; // Return color for d.status or default if not found.
                })
                .style("stroke", isDarkMode.value ? '#E2E8F0' : '#4A5568'), // Explicitly set stroke color.

            // Handle exiting nodes
            exit => exit.remove()
        );
};

const renderText = () => {
    g.selectAll(".node-text").raise();
    g.selectAll(".node-text")
        .data(localNodes.value || [], d => d ? d.id : null) // Check if d is not null before accessing id.
        .join(
            // Handle entering text elements
            enter => enter.append("text")
                .attr("class", "node-text")
                .attr("id", d => `text-${d.id}`)
                .attr("x", d => d.x)
                .attr("y", d => d.y)
                .attr("text-anchor", "middle")
                .attr("alignment-baseline", "middle")
                .style("fill", isDarkMode.value ? '#FFFFFF' : '#000000') // Explicitly set text color
                .style("user-select", "none")
                .call(text => text.append("tspan")
                    .attr("x", d => d.x) // X remains constant to keep the text centered
                    .attr("dy", "-0.5em") // Adjust Y for the first line of text
                    .text(d => d.name)
                )
                .call(text => text.append("tspan")
                    .attr("x", d => d.x) // X remains constant to keep the text centered
                    .attr("dy", "1.5em") // Adjust Y for the second line of text
                    .text(d => d.personaName || "")
                ),

            // Handle updating text elements
            update => update
                .attr("x", d => d.x) // Update x position of the text element
                .attr("y", d => d.y) // Update y position of the text element
                .each(function (d) {
                    // Select the first tspan and update its attributes
                    d3.select(this).select('tspan:nth-child(1)')
                        .attr("x", d => d.x)
                        .text(d => d.name); // Update text content if it has changed

                    // Select the second tspan and update its attributes
                    d3.select(this).select('tspan:nth-child(2)')
                        .attr("x", d => d.x)
                        .text(d => d.personaName || ""); // Update text content if it has changed
                }),

            // Handle exiting text elements
            exit => exit.remove()
        );
};

const renderLinks = () => {
    const updatedLinks = localEdges.value.map((link, index) => {
        const sourceNode = localNodes.value.find(node => node.id === link.source) || { x: 0, y: 0 };
        const targetNode = localNodes.value.find(node => node.id === link.target) || { x: 0, y: 0 };

        // Check if x or y is NaN or undefined
        if (isNaN(sourceNode.x) || sourceNode.x === undefined || isNaN(sourceNode.y) || sourceNode.y === undefined || isNaN(targetNode.x) || targetNode.x === undefined || isNaN(targetNode.y) || targetNode.y === undefined) {
            console.error('Invalid node position:', link, sourceNode, targetNode);
        }

        return {
            ...link,
            id: link.id || `edge-${index}`, // Ensure each link has a unique ID
            source: sourceNode,
            target: targetNode
        };
    });

    g.selectAll(".link")
        .data(updatedLinks, d => d.id) // use the link id as the key
        .join(
            enter => enter.append("path")
                .attr("class", "link")
                .attr("fill", "none")
                .attr("stroke", isDarkMode.value ? '#718096' : '#4A5568') // Explicitly set stroke color
                .attr("marker-end", "url(#arrow)"),

            update => update
                .each(function (d) {
                    d3.select(this)
                        .attr("d", d => computePath(d));
                }),

            exit => exit.remove()
        )
        .attr("d", d => computePath(d)); // This is set for both enter and update selections
};

const computePath = (d) => {
    const controlPoint1 = { x: d.source.x, y: d.source.y + 160 }; // Control point 1
    const controlPoint2 = { x: d.target.x, y: d.target.y - 160 }; // Control point 2
    return `M${d.source.x},${d.source.y + 30}C${controlPoint1.x},${controlPoint1.y} ${controlPoint2.x},${controlPoint2.y} ${d.target.x},${d.target.y - 30}`;
}

//Watch Nodes
watch(() => props.treeNodes, (newValue, oldValue) => {
    if (areArraysSimilar(props.treeNodes, oldValue)) {
        localNodes.value = mergeArrays(newValue, localNodes.value)
        renderGraph('watchNodes');
    }
    else {
        //TODO Instead of replacing, add or delete changed nodes
        localNodes.value = newValue;
        initializeNodePositions('watchNodes');
    }
}, { deep: true });

//Watch Edges
watch(() => props.treeEdges, (newValue) => {
    //TODO Just add or remove edges, 
    localEdges.value = newValue;
    initializeNodePositions('watchEdges');
    renderGraph('watchEdges');
}, { deep: true });

//Evaluate if the Nodes arrays are similar
function areArraysSimilar(array1, array2) {
    if (array1.length !== array2.length) {
        return false; // The arrays have different lengths, so they are not similar.
    }

    // Extract the id values and sort them.
    const ids1 = array1.map(obj => obj.id).sort();
    const ids2 = array2.map(obj => obj.id).sort();

    // Compare the sorted id arrays.
    for (let i = 0; i < ids1.length; i++) {
        if (ids1[i] !== ids2[i]) {
            return false; // The id values are different, so the arrays are not similar.
        }
    }

    return true; // The arrays are similar.
}


//Merge the nodes arrays
function mergeArrays(array1, array2) {
 
    return array1.map(obj1 => {
        const obj2 = array2.find(o => o.id === obj1.id);
        // Create a new object that contains all properties from obj2 and obj1
        // Properties from obj1 will overwrite the ones from obj2 due to the order of spreading
        return {
            ...obj2,
            ...obj1,
        };
    });
}




function updateDarkMode() {
    // console.log("darkModeSession", darkModeSession)
    const darkModeSession = localStorage.getItem('dark-mode');
    isDarkMode.value = darkModeSession === 'true';
    if (svg) svg.classed('dark', isDarkMode.value);
}

watch(() => isDarkMode.value, (newValue) => { /* ... */ }, { immediate: true });

</script>

  


<style scoped>
.node {
    fill: var(--tw-bg-opacity);
    stroke: var(--tw-stroke-opacity);
    stroke-width: 3px;
    @apply bg-white dark:bg-gray-800 stroke-current dark:text-gray-200;
}

.node-text {
    fill: var(--tw-text-opacity);
    font-size: 1rem;
    @apply text-black dark:text-white;
}

.link {
    fill: none;
    stroke: var(--tw-link-opacity);
    stroke-width: 2px;
    @apply stroke-current dark:stroke-gray-400;
}

.arrowHead {
    fill: var(--tw-arrow-opacity);
    @apply text-gray-400 dark:text-gray-600;
}
</style>
  