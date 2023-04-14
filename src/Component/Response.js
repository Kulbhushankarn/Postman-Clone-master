import React, { useState } from "react";
import { Formik, Form, Field, FieldArray } from "formik";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button } from "@mui/material";
import { Tab, Tabs } from "react-bootstrap";
import prettyBytes from "pretty-bytes";
import JSONInput from "react-json-editor-ajrm";
import locale from "react-json-editor-ajrm/locale/en";

function Response() {
  const [status, setStatus] = useState(0);
  const [time, setTime] = useState(0);
  const [size, setSize] = useState(0);
  const [response, setResponse] = useState({});
  const [responseHeaders, setResponseHeaders] = useState({});
  const [json, setJSON] = useState({});

  axios.interceptors.request.use((request) => {
    //console.log("request:", request);
    request.customData = request.customData || {};
    request.customData.startTime = new Date().getTime();
    return request;
  });

  function updateEndTime(response) {
    // defaulting custom data
    //console.log(response);
    if (response !== undefined) {
      response.customData = response.customData || {};
      // setting the time
      response.customData.time =
        new Date().getTime() - response.config.customData.startTime;
      return response;
    }
  }

  axios.interceptors.response.use(updateEndTime, (e) => {
    return Promise.reject(updateEndTime(e.response));
  });

  function keyValuePairsToObjects(container) {
    var params = {};
    container.forEach((data) => {
      params[data["key"]] = data["value"];
    });

    return params;
  }

  function sendRequest(data) {
    let dataJson;
    try {
      dataJson = json;
    } catch (e) {
      alert("JSON data is malformed");
      return;
    }
    axios({
      url: data.url,
      method: data.method,
      params: keyValuePairsToObjects(data.query_data),
      headers: keyValuePairsToObjects(data.header_data),
      dataJson,
      validateStatus: () => true,
    })
      .catch((e) =>
        //setResponse({ data: e.response.data, status: e.response.status })
        console.log(e)
      )
      .then((response) => {
        // to show the response
        console.log(response);
        if (response !== undefined) {
          console.log("RESPONSE:", response);
          setStatus(response.status);
          setResponse(response.data);
          setResponseHeaders(response.headers);
          setTime(response.customData.time);
        //   setResponseTime(response.)
          setSize(
            prettyBytes(
              JSON.stringify(response.data).length +
                JSON.stringify(response.headers).length
            )
          );
        }
      });
  }

  return (
          <div className="response">
            <br/>
            <br/>
            <br/>
          <h4>Response</h4>
          {/* <div className="d-flex my-2">
            <div className="me-3">Status: {status}</div>
            <div className="me-3">Time: {time} ms</div>
            <div className="me-3">Size: {size}</div>
          </div> */}
          <div>
            <Tabs
              defaultActiveKey="body"
              id="uncontrolled-tab-example"
              className="nav nav-tabs"
            >
              <Tab eventKey="body" title="Body">
                <pre className="scroll">
                  {JSON.stringify(response, null, 2)}
                </pre>
              </Tab>
              {/* <Tab eventKey="response" title="Response">
                <pre>{JSON.stringify(responseHeaders, null, 2)}</pre>
              </Tab> */}
            </Tabs>
          </div>
        </div>
  );
}

export default Response;