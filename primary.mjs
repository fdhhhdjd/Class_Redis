import cluster from "cluster";
import os from "os";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const cpuCount = os.cpus().length;

console.log(`The total number of CPUs: ${cpuCount}`);
console.log(`Primary pid: ${process.pid}`);

cluster.setupPrimary({
  exec: path.join(__dirname, "server.js"),
});

for (let i = 0; i < cpuCount; i++) {
  cluster.fork();
}
cluster.on("exit", (worker, code, signal) => {
  console.log(`Worker ${worker.process.pid} has been killed`);
  console.log("Starting another worker", code, signal);
  cluster.fork();
});
// The total number of CPUs: 8
// One CPU with 8 cores and 4 threads means each core can execute up to 4 threads simultaneously, totaling 32 threads (8 cores x 4 threads).
// Một CPU có 8 nhân và 4 luồng có nghĩa là mỗi nhân có thể thực hiện tối đa 4 luồng đồng thời, tổng cộng là 32 luồng (8 nhân x 4 luồng).
