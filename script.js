let memoryBlocks = [];
let jobs = [];
let jobCount = 0;
let blockCount = 0;


function addBlock() {
  const size = parseInt(document.getElementById('blockSize').value);
  if (isNaN(size) || size <= 0) {
    alert("Please enter a valid block size!");
    return;
  }
  blockCount++;
  memoryBlocks.push({ location: blockCount, size: size, used: false });
  updateBlockTable();
  document.getElementById('blockSize').value = "";
}


function updateBlockTable() {
  const table = document.getElementById('blockTable');
  table.innerHTML = "<tr><th>Memory Location</th><th>Block Size</th></tr>";
  memoryBlocks.forEach(block => {
    table.innerHTML += `<tr><td>${block.location}</td><td>${block.size}K</td></tr>`;
  });
}


function addJob() {
  const size = parseInt(document.getElementById('jobSize').value);
  if (isNaN(size) || size <= 0) {
    alert("Please enter a valid job size!");
    return;
  }
  jobCount++;
  jobs.push({ name: "J" + jobCount, size: size, isAllocated: false });
  updateJobTable();
  document.getElementById('jobSize').value = "";
}


function updateJobTable() {
  const table = document.getElementById('jobTable');
  
  table.innerHTML = "<tr><th>Job Number</th><th>Memory Requested</th><th>Action</th></tr>";
  jobs.forEach(job => {
    
    table.innerHTML += `
      <tr>
      
        <td>${job.name}</td>
        <td>${job.size}K</td>
        <td><button onclick="removeJob('${job.name}')">Remove</button></td>
      </tr>`;
  });
}


function removeJob(jobName) {
  const confirmDelete = confirm(`Are you sure you want to remove ${jobName}?`);
  if (!confirmDelete) return;

  jobs = jobs.filter(job => job.name !== jobName);
  updateJobTable();
  alert(`${jobName} has been removed!`);
}

function runSimulation() {
  if (memoryBlocks.length === 0) {
    alert("Please add memory blocks before running the simulation!");
    return;
  }
  if (jobs.length === 0) {
    alert("Please add jobs before running the simulation!");
    return;
  }

  const method = document.getElementById('method').value;
  let memory = JSON.parse(JSON.stringify(memoryBlocks));
  const table = document.getElementById('memoryTable');
  table.innerHTML = `
    <tr>
      <th>Memory Location</th>
      <th>Block Size</th>
      <th>Job Number</th>
      <th>Job Size</th>
      <th>Status</th>
      <th>Internal Fragmentation</th>
    </tr>`;

  let totalJobSize = 0;
  let totalFragmentation = 0;
  let waitingJobs = [];

  jobs.forEach(job => {
    let chosenIndex = -1;

    if (method === "first") {
      chosenIndex = memory.findIndex(block => !block.used && block.size >= job.size);
    } else if (method === "best") {
      let minFit = Infinity;
      memory.forEach((block, i) => {
        if (!block.used && block.size >= job.size && block.size - job.size < minFit) {
          chosenIndex = i;
          minFit = block.size - job.size;
        }
      });
    }

    if (chosenIndex !== -1) {
      
      job.isAllocated = true;
      memory[chosenIndex].used = true;
      memory[chosenIndex].job = job.name;
      memory[chosenIndex].jobSize = job.size;
      memory[chosenIndex].fragment = memory[chosenIndex].size - job.size;

      totalJobSize += job.size;
      totalFragmentation += memory[chosenIndex].fragment;
    } else {
      
      job.isAllocated = false;
      waitingJobs.push(job);
    }
  });

  
  memory.forEach(block => {
    const status = block.used ? "Busy" : "Free";
    const jobName = block.job || "-";
    const jobSize = block.jobSize ? block.jobSize + "K" : "-";
    const frag = block.fragment >= 0 ? block.fragment + "K" : "-";
    table.innerHTML += `
      <tr>
        <td>${block.location}</td>
        <td>${block.size}K</td>
        <td>${jobName}</td>
        <td>${jobSize}</td>
        <td>${status}</td>
        <td>${frag}</td>
      </tr>`;
  });

  
  waitingJobs.forEach(job => {
    table.innerHTML += `
      <tr style="color: red;">
        <td>-</td>
        <td>-</td>
        <td>${job.name}</td>
        <td>${job.size}K</td>
        <td>* Waiting</td>
        <td>-</td>
      </tr>`;
  });

  table.innerHTML += `
    <tr style="font-weight:bold; background-color:#f0f0f0;">
      <td colspan="3" style="text-align:right;">TOTAL:</td>
      <td>${totalJobSize}K</td>
      <td></td>
      <td>${totalFragmentation}K</td>
    </tr>`;
}


function logout() {
  alert("You proceeded to log-out page!");
  window.location.href = "goodbye.html";
}
