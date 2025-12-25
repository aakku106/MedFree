/** @format */

// Simple hierarchical tree demo with simulated live transfers
// Uses d3 v7 (loaded from CDN in index.html)

const sample = {
  name: "Central Gov",
  balance: 200000000, // in rupees
  children: [
    {
      name: "Province 1",
      balance: 50000000,
      children: [
        {
          name: "District A",
          balance: 12000000,
          children: [
            { name: "Butwal City", balance: 3000000 },
            { name: "Dhangadhi City", balance: 4000000 },
          ],
        },
        { name: "District B", balance: 8000000 },
      ],
    },
    {
      name: "Province 2",
      balance: 40000000,
      children: [
        {
          name: "District C",
          balance: 15000000,
          children: [{ name: "Kailali City", balance: 6000000 }],
        },
      ],
    },
    { name: "Province 3", balance: 30000000 },
  ],
};

const width = 820,
  height = 640;
const svg = d3
  .select("#viz")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

const g = svg.append("g").attr("transform", "translate(40,20)");

const tree = d3.tree().size([height - 80, width - 200]);
let root = d3.hierarchy(sample);
root.x0 = (height - 80) / 2;
root.y0 = 0;

// collapse helper
root.children.forEach(collapse);
update(root);

// simulate live transfers every 1.5s
setInterval(simulateTransfer, 1500);

// activity log
function logActivity(text) {
  const ul = document.getElementById("activity-list");
  const li = document.createElement("li");
  li.textContent = `${new Date().toLocaleTimeString()} — ${text}`;
  ul.prepend(li);
  while (ul.children.length > 40) ul.removeChild(ul.lastChild);
}

function collapse(d) {
  if (d.children) {
    d._children = d.children;
    d._children.forEach(collapse);
    d.children = null;
  }
}

function update(source) {
  const treeData = tree(root);
  const nodes = treeData.descendants();
  const links = treeData.links();

  // normalize for fixed depth
  nodes.forEach((d) => (d.y = d.depth * 140));

  // LINKS
  const link = g
    .selectAll(".link")
    .data(links, (d) => d.target.data.name + d.target.depth);
  link
    .enter()
    .append("path")
    .attr("class", "link")
    .attr("d", (d) => {
      const o = { x: source.x0, y: source.y0 };
      return diagonal({ source: o, target: o });
    })
    .transition()
    .duration(600)
    .attr("d", (d) => diagonal(d));

  link
    .transition()
    .duration(300)
    .attr("d", (d) => diagonal(d));
  link.exit().remove();

  // NODES
  const node = g.selectAll(".node").data(nodes, (d) => d.data.name + d.depth);
  const nodeEnter = node
    .enter()
    .append("g")
    .attr("class", "node")
    .attr("transform", (d) => `translate(${source.y0},${source.x0})`)
    .on("click", (event, d) => toggle(d))
    .on("dblclick", (event, d) => selectNode(d));

  nodeEnter.append("circle").attr("r", 1e-6);
  nodeEnter
    .append("text")
    .attr("x", 10)
    .attr("dy", 4)
    .text((d) => `${d.data.name}`);
  nodeEnter
    .append("text")
    .attr("class", "bal")
    .attr("x", 10)
    .attr("dy", 18)
    .text((d) => formatBal(d.data.balance));

  const nodeUpdate = nodeEnter.merge(node);
  nodeUpdate
    .transition()
    .duration(500)
    .attr("transform", (d) => `translate(${d.y},${d.x})`);
  nodeUpdate.select("circle").transition().attr("r", 12);
  nodeUpdate.select("text").style("fill-opacity", 1);
  nodeUpdate.select(".bal").text((d) => formatBal(d.data.balance));

  const nodeExit = node
    .exit()
    .transition()
    .duration(300)
    .attr("transform", (d) => `translate(${source.y},${source.x})`)
    .remove();
  nodeExit.select("circle").attr("r", 1e-6);

  // store old positions
  nodes.forEach((d) => {
    d.x0 = d.x;
    d.y0 = d.y;
  });
}

function diagonal(d) {
  return `M ${d.source.y} ${d.source.x}
          C ${(d.source.y + d.target.y) / 2} ${d.source.x},
            ${(d.source.y + d.target.y) / 2} ${d.target.x},
            ${d.target.y} ${d.target.x}`;
}

function toggle(d) {
  if (d.children) {
    d._children = d.children;
    d.children = null;
  } else {
    d.children = d._children;
    d._children = null;
  }
  update(d);
}

function selectNode(d) {
  const details = document.getElementById("node-details");
  details.innerHTML = ` <div class="node-card"><strong>${
    d.data.name
  }</strong><div class="node-balance">${formatBal(d.data.balance)}</div></div>
    <p>Depth: ${d.depth}</p>
    <p>Descendants: ${d.descendants().length}</p>`;
  document.getElementById("actions").classList.remove("hidden");
}

function formatBal(b) {
  if (!b && b !== 0) return "—";
  return "Rs " + (b / 100000).toFixed(2) + "L"; // show in lakhs
}

// simulate transfers: pick a leaf that has balance, transfer some up along parents
function simulateTransfer() {
  const leaves = root.leaves();
  const candidate = leaves[Math.floor(Math.random() * leaves.length)];
  const amount = Math.floor(
    (candidate.data.balance || 0) * (0.02 + Math.random() * 0.2)
  ); // 2-20% moved
  if (!amount || amount <= 0) return;

  // animate particle from node to parent chain
  let current = candidate;
  const pathNodes = [];
  while (current && current.parent) {
    pathNodes.push(current);
    current = current.parent;
  }
  // if nothing to move (defensive), bail out
  if (!pathNodes.length) return;
  // pathNodes: from leaf up to child of root
  animateFlow(pathNodes[0], pathNodes[pathNodes.length - 1], amount);

  // apply balances along chain: money moves up each parent
  let moving = amount;
  for (let i = 0; i < pathNodes.length; i++) {
    const node = pathNodes[i];
    node.data.balance = Math.max(0, (node.data.balance || 0) - moving);
    node.parent.data.balance = (node.parent.data.balance || 0) + moving;
  }

  update(root);
  logActivity(
    `${
      candidate.data.name
    } transferred Rs ${amount.toLocaleString()} up the chain`
  );
}

// animateFlow from startNode up to endNode (closest ancestor in provided path)
function animateFlow(startNode, endNode, amount) {
  // defensive: ensure nodes exist
  if (!startNode) return;
  const parentOfEnd = endNode && endNode.parent ? endNode.parent : endNode;
  if (!parentOfEnd) return;

  // prefer current positions (x,y) if available, else fall back to x0/y0
  const sx = startNode.x !== undefined ? startNode.x : startNode.x0;
  const sy = startNode.y !== undefined ? startNode.y : startNode.y0;
  const ex = parentOfEnd.x !== undefined ? parentOfEnd.x : parentOfEnd.x0;
  const ey = parentOfEnd.y !== undefined ? parentOfEnd.y : parentOfEnd.y0;
  const start = { x: sx, y: sy };
  const end = { x: ex, y: ey };
  // create particle
  const particle = g
    .append("circle")
    .attr("r", 6)
    .attr("fill", "#06b6d4")
    .attr("opacity", 0.95)
    .attr("transform", `translate(${start.y},${start.x})`);
  particle
    .transition()
    .duration(900)
    .attrTween("transform", function () {
      return (t) => {
        const cx = start.y + (end.y - start.y) * t;
        const cy = start.x + (end.x - start.x) * t;
        return `translate(${cx},${cy})`;
      };
    })
    .transition()
    .duration(400)
    .attr("opacity", 0)
    .remove();
}

// bind actions
document.getElementById("comment-btn").addEventListener("click", () => {
  const text = prompt("Add a public comment for this node (demo):");
  if (text) logActivity(`Comment: ${text}`);
});

document.getElementById("vote-btn").addEventListener("click", () => {
  logActivity("You voted for project at selected node (demo blockchain proof)");
});

// initial expand root
root.children = root._children;
root._children = null;
update(root);

// small instruction
logActivity("Demo started — tree loaded");
