<template>
    <div ref="d3Container"></div>

    <!-- {{ transformedData }} -->
</template>
  
<script setup>
import { ref, onMounted, onBeforeUnmount, watch, watchEffect, computed } from 'vue';
import * as d3 from 'd3';
import { v4 as uuidv4 } from 'uuid';



import { useWebsockets } from '@/composables/useWebsockets.js';
const { sessions, stages, sessionsContent } = useWebsockets();


const isDarkMode = ref(false);

function updateDarkMode() {
    const darkModeSession = localStorage.getItem('dark-mode');
    console.log("darkModeSession", darkModeSession)
    isDarkMode.value = darkModeSession === 'true';
    if (svg) svg.classed('dark', isDarkMode.value);
}

const props = defineProps({
    hierarchyData: Object,
});

const emit = defineEmits(['update-node']);
const d3Container = ref(null);
const width = 1000;
const height = 400;

const treeLayout = d3.tree().size([width, height]);

let svg = null;
let g = null;
let root = null;

onBeforeUnmount(() => {
    window.removeEventListener('storage', updateDarkMode);
});

onMounted(() => {

    updateDarkMode();
    // Add event listener to update styles on storage change
    window.addEventListener('storage', updateDarkMode);

    svg = d3.select(d3Container.value).append("svg")
        .attr("width", width)
        .attr("height", height);
    g = svg.append('g');

    const zoom = d3.zoom().on("zoom", (event) => {
        g.attr("transform", event.transform);
    });
    svg.call(zoom);

    root = d3.hierarchy(props.hierarchyData);
    treeLayout(root);

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

    renderGraph();
});

const drag = d3.drag()
    .on("start", dragstarted)
    .on("drag", dragged)
    .on("end", dragended);

function dragstarted(event, d) {
    d3.select(this).lower().attr("stroke", "black"); // Lower the node element
    d3.select(`#text-${d.data.id}`).raise(); // Raise the corresponding text element


    // d3.select(this).raise().attr("stroke", "black");
}


function dragged(event, d) {
    d.x = event.x;
    d.y = event.y;
    d3.select(`#node-${d.data.id}`).attr("x", d.x - 60).attr("y", d.y - 30); // Update the position of the rectangle.
    d3.select(`#text-${d.data.id}`).attr("x", d.x).attr("y", d.y); // Update the position of the text.

    d3.select(this).attr("stroke", null);
    d3.select(`#text-${d.data.id}`).raise();

    renderLinks(); // Re-render links.
}
function dragended(event, d) {
    d3.select(this).attr("stroke", isDarkMode.value ? '#E2E8F0' : '#4A5568'); // Reapply the stroke instead of setting to null
    emit('update-node', { ...d.data, px: d.x, py: d.y }); // Emitting the updated node to the parent.
}


const renderGraph = () => {
    renderNodes(); // Nodes first
    renderLinks(); // Links next
    // renderText(); // Text last
};

// When rendering nodes, use px and py if available, otherwise, use x and y.


// Set fill to none for links
const renderLinks = () => {
    g.selectAll(".link")
        .data(props.treeEdges || [])
        .join("path")
        .attr("class", "link")
        .attr("fill", "none") // Ensure fill is none
        .attr("stroke", "black") // or any other color
        .attr("d", d => {
            return d3.linkVertical()
                .x(d => d.x)
                .y(d => d.y - 30) 
                ({
                    source: { x: d.source.x, y: d.source.y },
                    target: { x: d.target.x, y: d.target.y }
                });
        })
        .attr("marker-end", "url(#arrow)");
};

// Properly calculate x for nodes
const renderNodes = () => {
    const verticalDistance = 150;
    const horizontalSpacing = 200;

    // Ensure treeNodes is not undefined and is an array
    if (Array.isArray(props.treeNodes)) {
        props.treeNodes.forEach(node => {
            const stageNodes = props.treeNodes.filter(n => n.stage === node.stage);
            const totalWidth = (stageNodes.length - 1) * horizontalSpacing;
            const startX = (width - totalWidth) / 2;
            node.x = startX + stageNodes.indexOf(node) * horizontalSpacing;
            node.y = node.stage * verticalDistance;
        });
        
        g.selectAll(".node")
            .data(props.treeNodes, d => d.id)
            .join(
                enter => enter.append("rect")
                    .attr("class", "node")
                    .attr("id", d => `node-${d.id}`)
                    .attr("width", 120)
                    .attr("height", 60)
                    .attr("x", d => d.x - 60)
                    .attr("y", d => d.y - 30)
                    .call(drag)
            );
    }
    renderText();
};

const renderText = () => {
    g.selectAll(".node-text")
        .data(props.treeNodes || [], d => d.id)
        .join(
            enter => enter.append("text")
                .attr("class", "node-text")
                .attr("id", d => `text-${d.id}`)
                .attr("x", d => d.x)
                .attr("y", d => d.y)
                .attr("text-anchor", "middle")
                .attr("alignment-baseline", "middle")
                .text(d => d.name)
        );
};




let someFixedDistance = 160;
let someFixedVerticalDistance = 200;
watch(() => props.hierarchyData, (newData) => {
    const newRoot = d3.hierarchy(newData, d => d.children);
    const oldNodes = new Map(root.descendants().map(d => [d.data.id, d]));

    newRoot.each(d => {
        if (oldNodes.has(d.data.id)) {
            const oldNode = oldNodes.get(d.data.id);
            d.x = oldNode.x;
            d.y = oldNode.y;
        } else {
            // New node, need to calculate its position if x and y are not set
            if (d.data.x == null || d.data.y == null) {
                // Find the rightmost node in the same level
                const sameLevelNodes = newRoot.descendants().filter(node => node.depth === d.depth);
                const rightmostNode = sameLevelNodes.reduce((rightmost, node) => (node.x > rightmost.x ? node : rightmost), { x: -Infinity });
                d.x = (rightmostNode.x === -Infinity ? 0 : rightmostNode.x) + someFixedDistance; // Position the new node to the right of the rightmost node
                d.y = d.depth * someFixedVerticalDistance; // Position based on the depth in the hierarchy
            } else {
                d.x = d.data.x;
                d.y = d.data.y;
            }
        }
    });

    root = newRoot;
    renderGraph();
}, { deep: true });


const darkMode = ref(false);



watch(() => isDarkMode.value, (newValue) => {
    if (newValue) {
        // Apply dark mode styles
        d3.selectAll('.node').attr('fill', '#2D3748').attr('stroke', '#E2E8F0'); // darkFillColor and darkStrokeColor
        d3.selectAll('.node-text').attr('fill', '#E2E8F0'); // darkTextColor
        d3.selectAll('.link').attr('stroke', '#4A5568'); // darkLinkColor
        d3.selectAll('.arrowHead').attr('fill', '#718096'); // darkArrowHeadColor
    } else {
        // Apply light mode styles
        d3.selectAll('.node').attr('fill', '#FFFFFF').attr('stroke', '#4A5568'); // lightFillColor and lightStrokeColor
        d3.selectAll('.node-text').attr('fill', '#1A202C'); // lightTextColor
        d3.selectAll('.link').attr('stroke', '#E2E8F0'); // lightLinkColor
        d3.selectAll('.arrowHead').attr('fill', '#A0AEC0'); // lightArrowHeadColor
    }
}, { immediate: true });



// const findSocketById = (sessionId) => {
//     for (const stage of props.hierarchyData) {
//         for (const socket of stages.value.sockets) {
//             if (socket.sessionId === sessionId) return socket;
//         }
//     }
//     return null;
// };



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
    /* 16px */
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
  