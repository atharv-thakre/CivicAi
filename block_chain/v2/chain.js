// ===== CONFIG =====
const CONTRACT_ADDRESS = "0xDA2F1f358244D6F80e0eB60aF0823AE6577BD138";

const ABI = [
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "uint256", "name": "id", "type": "uint256"},
      {"indexed": false, "internalType": "bytes32", "name": "dataHash", "type": "bytes32"},
      {"indexed": false, "internalType": "string", "name": "commitId", "type": "string"},
      {"indexed": false, "internalType": "address", "name": "sender", "type": "address"},
      {"indexed": false, "internalType": "uint256", "name": "timestamp", "type": "uint256"}
    ],
    "name": "RecordStored",
    "type": "event"
  },
  {
    "inputs": [
      {"internalType": "bytes32", "name": "_dataHash", "type": "bytes32"},
      {"internalType": "string", "name": "_commitId", "type": "string"}
    ],
    "name": "storeRecord",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "string", "name": "_commitId", "type": "string"}],
    "name": "findByCommitId",
    "outputs": [
      {"internalType": "uint256", "name": "id", "type": "uint256"},
      {"internalType": "bytes32", "name": "dataHash", "type": "bytes32"},
      {"internalType": "address", "name": "sender", "type": "address"},
      {"internalType": "uint256", "name": "timestamp", "type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "uint256", "name": "start", "type": "uint256"},
      {"internalType": "uint256", "name": "end", "type": "uint256"}
    ],
    "name": "findByTimeRange",
    "outputs": [{"internalType": "uint256[]", "name": "ids", "type": "uint256[]"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "_timestamp", "type": "uint256"}],
    "name": "findByTimestamp",
    "outputs": [
      {"internalType": "uint256", "name": "id", "type": "uint256"},
      {"internalType": "bytes32", "name": "dataHash", "type": "bytes32"},
      {"internalType": "string", "name": "commitId", "type": "string"},
      {"internalType": "address", "name": "sender", "type": "address"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "_id", "type": "uint256"}],
    "name": "getRecord",
    "outputs": [
      {"internalType": "bytes32", "name": "", "type": "bytes32"},
      {"internalType": "string", "name": "", "type": "string"},
      {"internalType": "address", "name": "", "type": "address"},
      {"internalType": "uint256", "name": "", "type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "recordCount",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "name": "records",
    "outputs": [
      {"internalType": "bytes32", "name": "dataHash", "type": "bytes32"},
      {"internalType": "string", "name": "commitId", "type": "string"},
      {"internalType": "address", "name": "sender", "type": "address"},
      {"internalType": "uint256", "name": "timestamp", "type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

// ===== GLOBAL STATE =====
let provider;
let signer;
let contract;
let currentAccount = null;

const SEPOLIA_CHAIN_ID = "0xaa36a7";

// ===== UTIL =====
function setStatus(msg, isError = false) {
  const el = document.getElementById("status");
  if (el) {
    el.innerText = msg;
    el.style.color = isError ? "red" : "#22c55e";
  }
}

// ===== ENSURE NETWORK =====
async function ensureSepolia() {
  const chainId = await window.ethereum.request({ method: "eth_chainId" });
  if (chainId !== SEPOLIA_CHAIN_ID) {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: SEPOLIA_CHAIN_ID }],
    });
  }
}

// ===== CONNECT =====
async function connectWallet() {
  try {
    if (!window.ethereum) throw new Error("MetaMask not found");
    await ensureSepolia();
    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    provider = new ethers.BrowserProvider(window.ethereum);
    signer = await provider.getSigner();
    currentAccount = accounts[0];
    contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
    setStatus(`✅ Connected: ${currentAccount}`);
    return currentAccount;
  } catch (err) {
    console.error(err);
    setStatus(`❌ ${err.message}`, true);
  }
}

// ===== STORE RECORD =====
async function storeRecord(dataHash, commitId) {
  try {
    if (!contract) throw new Error("Connect wallet first");
    if (!dataHash || !commitId) throw new Error("Missing input");
    if (!/^0x[a-fA-F0-9]{64}$/.test(dataHash)) throw new Error("Invalid hash format");
    setStatus("⏳ Sending transaction...");
    const tx = await contract.storeRecord(dataHash, commitId);
    setStatus(`📤 TX Sent: ${tx.hash}`);
    await tx.wait();
    setStatus("✅ Record Stored");
    return tx.hash;
  } catch (err) {
    console.error(err);
    setStatus(`❌ ${err.reason || err.message}`, true);
  }
}

// ===== GET RECORD BY ID =====
async function getRecord(id) {
  try {
    const res = await contract.getRecord(id);
    const [dataHash, commitId, sender, timestamp] = res;
    setStatus(`📦 ID:${id} | Commit: ${commitId}`);
    return res;
  } catch (err) {
    setStatus("❌ Record not found", true);
  }
}

// ===== SEARCH BY COMMIT =====
async function findByCommit(commitId) {
  try {
    const res = await contract.findByCommitId(commitId);
    setStatus(`🔍 Found ID: ${res.id}`);
    return res;
  } catch {
    setStatus("❌ Not found", true);
  }
}

// ===== LISTENERS =====
function setupListeners() {
  if (!window.ethereum) return;
  window.ethereum.on("accountsChanged", () => location.reload());
  window.ethereum.on("chainChanged", () => location.reload());
}

window.addEventListener("load", setupListeners);
