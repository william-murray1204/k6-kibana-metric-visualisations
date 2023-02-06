# k6-load-testing

This guide provides instructions for visualing k6 load test metrics in kibana.

## Prerequisites

- A running instance of Elasticsearch.
- A running instance of Kibana.
- A k6 instance with the "xk6-es" elasticsearch output extension.
{https://github.com/BarthV/xk6-es}


## Step 1: Create the Index with the Appropriate Mapping
To create an index, send a PUT request to Elasticsearch with the index name "k6_metrics".

```
PUT /k6_metrics
{
"mappings": {
"properties": {
"time": {
"type": "date",
"format": "epoch_millis"
}
}
}
}
```

The `mappings` section of the request defines the properties and their data types for the documents in this index. In order to properly graph the metrics, a single property named "time" with type "date" and format "epoch_millis" is specified.


## Step 2: Add a Data View
In Kibana, navigate to the management interface and select "Data Views". 
Create a new data view making sure to set the "Timestamp field" to "time" and the "Name" field to "k6_metrics". 

This will ensure that the data view is linked to the index created in step 1.


## Step 3: Script the k6 Load Test to Track Data Sent and Received
To track data sent and received, the script makes use of two custom metrics, `epDataSent` and `epDataRecv`. These metrics are created using the `Counter` class from the `k6/metrics` module.

The function `trackDataMetricsPerURL` takes a response object as an argument and adds data points to the metrics based on the size of the headers and body in the request and response. The data points are tagged with the URL so that the metrics can be filtered down to see the data for individual URLs.

The script sets the URL parameters and makes a GET request using the `http.get` function. After the request, the function `trackDataMetricsPerURL` is called to add data points to the metrics.

A simple example of a script that integrates these data sent and received metrics can be found within this repository under the name "example_k6_script.js".


## Step 4: Import the Load Test Metrics Dashboard into Kibana
The "metric-dashboards" folder found in this repository contains dashboards that can be imported into Kibana to visualize the data collected by the script in step 3. Note that each dashboard file will only work with a certain version of the Elasticsearch Service stack. For example, if the file is named "Kibana.v8.3.2_k6_Load_Test_Dashboard_Export.ndjson", it will only work with version 8.3.2.

The process of importing a dashboard is as follows:

1. Go to the Kibana Management section.
2. Select the option for "Stack Management".
3. Select the option for "Saved Objects".
4. Click on the "Import" button.
5. Select the file from the "metric-dashboards" folder found in this repository.
6. Wait for the dashboard to be imported and then view it from the "Dashboard" section.

## Step 5: Run the k6 Load Test
Ensure that you have the k6 load testing tool with the "xk6-es" elasticsearch output extension installed on your system. You can find installation instructions at https://github.com/BarthV/xk6-es.

Run the following command to execute the k6 load test:

```
.\k6.exe run 'script.js' -o xk6-es 
```

The test will send the data directly to Elasticsearch allowing you to visualise the data using the newly imported dashboard in Kibana.


## Conclusion
In this guide, we have covered the steps to set up and run a k6 load test, track and visualize the results in Kibana. We started by creating an index in Elasticsearch, followed by adding a data view in Kibana, setting up the k6 load test script to track data sent and received, importing the appropriate metric dashboard into Kibana, and finally executing the load test with the xk6-es extension to send the data to Elasticsearch. With these steps, you should now have a complete end-to-end setup for performance testing and monitoring with k6 and Kibana.