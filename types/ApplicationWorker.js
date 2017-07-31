class ApplicationWorker {
  constructor (workerProcessId) {
    this.workerProcessId = workerProcessId;
  }
  
  get id () {
    return this.workerProcessId;
  }
}

module.exports = ApplicationWorker;