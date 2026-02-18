const nodeID = 1n;
const nodeBits = 10n;
const sequenceBits = 12n;

const maxSequence = (1n << sequenceBits) - 1n;

const nodeShift = sequenceBits;
const timeShift = nodeBits + sequenceBits;

let lastTimestamp = 0n;
let sequence = 0n;

function currentTimestamp() {
  return BigInt(Date.now());
}

function generateID() {
  let timestamp = currentTimestamp();

  if (timestamp === lastTimestamp) {
    sequence = (sequence + 1n) & maxSequence;

    if (sequence === 0n) {
      while (timestamp <= lastTimestamp) {
        timestamp = currentTimestamp();
      }
    }
  } else {
    sequence = 0n;
  }

  lastTimestamp = timestamp;

  const id =
    (timestamp << timeShift) |
    (nodeID << nodeShift) |
    sequence;

  return id;
}

document.getElementById("generateBtn").addEventListener("click", () => {
  const id = generateID();
  document.getElementById("result").innerText = id.toString();
});
