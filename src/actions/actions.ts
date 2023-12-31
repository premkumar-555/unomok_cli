const url = require('url');
const fs = require('fs')
interface TimeSeries {
    timeStamp: Date,
    line: string
}
// creation of time series data 
const getTimeSeriesData = (content: string): TimeSeries[] => {
const timeSeriesData : TimeSeries[] = [];
 const lines = content?.trim().split('\n');
 lines?.forEach((line: string) => {
     const timeStampMatch = line.match(/\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/);
     if(timeStampMatch){
         const timeStamp: Date = new Date(timeStampMatch[0]);
         timeSeriesData.push({timeStamp, line});
    }
 })
 return timeSeriesData;
}

//  counting number of times each end point is called
const countEndPointCalls = (timeSeriesData:TimeSeries[]):  ({end_point: string; count: number}[])=> {
    const countAPICalls: {[path:string]: {end_point: string; count: number}} = {};
    timeSeriesData.forEach((dataPoint) => {
        const line = dataPoint.line;
        const urlMatch = line.match(/https?:\/\/[^\s]+/);
        if(urlMatch){
            const path: string = (new URL(urlMatch[0])).pathname;
                countAPICalls[path] = {end_point: path, count: (countAPICalls[path]?.count || 0) + 1}
            }
        })
    return Object.values(countAPICalls);
}

// count of API calls made on per minute basis
const   countAPICallsPerMinute = (timeSeriesData: TimeSeries[]) : ({time: string, count:number}[]) => {
    const apiCallsPerMinute :  {[minute: string]: {time: string, count:number}} = {};
    timeSeriesData.forEach((dataPoint) => {
        const timeStamp = dataPoint.timeStamp;
        const minute = timeStamp.toISOString().substring(0, 16);
        apiCallsPerMinute [minute]= {time: timeStamp.toISOString(), count: (apiCallsPerMinute[minute]?.count || 0) + 1};
    })

    return Object.values(apiCallsPerMinute);
}

// count total api calls for each http status code 
const countAPICallsForStatus = (timeSeriesData: TimeSeries[]) : ({status_code: string, count: number}[]) => {
    const httpStatusCounts : { [statusCode: string]: {status_code: string, count: number} } = {};
    timeSeriesData.forEach(async(dataPoint) => {
        const line = dataPoint.line;
        const statusCodeRegex = /" (\d{3}) /;
        const matches = statusCodeRegex.exec(line);
        if(matches && matches.length > 1){
            const statusCode = (matches[1])
            // console.log(statusCode)
            httpStatusCounts[statusCode] = {status_code: statusCode, count: (httpStatusCounts[statusCode]?.count || 0) + 1}
        }
    })
    return Object.values(httpStatusCounts);
}

module.exports = {getTimeSeriesData, countEndPointCalls, countAPICallsForStatus, countAPICallsPerMinute}