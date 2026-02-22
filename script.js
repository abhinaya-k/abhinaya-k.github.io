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

  const id = (timestamp << timeShift) | (nodeID << nodeShift) | sequence;

  return id;
}

document.getElementById("generateBtn").addEventListener("click", () => {
  const id = generateID();
  document.getElementById("result").innerText = id.toString();
});

function generatePassword(length) {
  let chars = "";
  if (optUpper.checked) chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  if (optLower.checked) chars += "abcdefghijklmnopqrstuvwxyz";
  if (optNumber.checked) chars += "0123456789";
  if (optSymbol.checked) chars += "!@#$%^&*()_+-=";

  if (optSimilar.checked) {
    chars = chars.replace(/[O0Il1]/g, "");
  }

  if (!chars) return "";

  let pwd = "";
  const array = new Uint32Array(length);
  crypto.getRandomValues(array);
  for (let i = 0; i < length; i++) {
    pwd += chars[array[i] % chars.length];
  }
  return pwd;
}

function updateStrength(pwd) {
  let score = 0;
  if (pwd.length >= 12) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[a-z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;

  const percent = (score / 5) * 100;
  strengthBar.style.width = percent + "%";

  const labels = ["Very Weak", "Weak", "Moderate", "Strong", "Very Strong"];
  strengthText.textContent = "Strength: " + labels[Math.max(score - 1, 0)];
}
