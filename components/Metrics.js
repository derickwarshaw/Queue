class Metrics {
  constructor (metricsCounts, metricsTimes) {
    this.metricsCounts = new Map(metricsCounts.map(metricsCount => {
      return [metricsCount, 0];
    }));
    this.metricsTimes = new Map(metricsTimes.map(metricsTime => {
      return [metricsTime, new Map([['Start', new Date()], ['End', null]])];
    }));
  }
  
  addCount (countName, countValue) {
    const countFound = this.metricsCounts.get(countName);
    
    if (countFound !== null) {
      this.metricsCounts.set(countName, (countFound + countValue));
    } else {
      throw Error(`'${countName} is not a metric count.`);
    }
  }
  
  addTime (countName, countTiming, countTime) {
    try {
      this.metricsTimes.get(countName).set(countTiming, countTime);
    } catch (timeError) {
      throw Error(`'${countName}' is not a set metric time.`);
    }
  }
  
  
  subtractCount (countName, countSubtraction) {
    const countFound = this.metricsCounts.get(countName);
    
    if (countFound) {
      this.metricsCounts.set(countName, (countFound - countSubtraction));
    } else {
      throw Error(`'${countName}' is not a subtractable metric.`);
    }
  }
  
  subtractTime (timeName, timeSubstraction) {
    const timeFound = this.metricsTimes.get(timeName);
    
    if (timeFound) {
      this.metricsTimes.set(timeName, (timeFound - timeSubstraction));
    } else {
      throw Error(`'${timeName}' is not a subtractable metric.`);
    }
  }
  
  
  evaluateCount (countName) {
    return this.metricsCounts.get(countName);
  }
  
  evaluateTime (timeName) {
    const timeFound = this.metricsTimes.get(timeName);
    
    const timeStart = timeFound.get('Start');
    const timeEnd = timeFound.get('End');
    
    return Math.round((timeEnd - timeStart) / (1000));
  }
  
  
  summarise () {
    console.log("--------------------------------------");
    
    for (let [countKey, countValue] of this.metricsCounts) {
      console.log(`Handled ${countValue} ${countKey} events.`);
    }
  }
}

module.exports = Metrics;