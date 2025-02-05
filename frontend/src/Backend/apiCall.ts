import axios, { AxiosRequestConfig } from 'axios';
import { RequestOptions } from '../Datatypes/interface';
import { ApiEndpoint } from '../Datatypes/enums';
import Cookies from 'js-cookie';

const chatGptApiKey =" import.meta.env.VITE_OPENAI_API_KEY; "

const Request = async ({ endpointId, slug, data, headers, params, isStream = false }: RequestOptions) => {
  const storedAccessToken = Cookies.get('access');
  const endpoint = ApiEndpoint[endpointId];

  if (!endpoint) {
    throw new Error(`Invalid API endpoint: ${endpointId}`);
  }

  let fullUrl = endpoint.url;
  if (slug) {
    fullUrl += `${slug}`;
  }

  if (isStream) {
    // Use fetch for streaming
    const response = await fetch(fullUrl, {
      method: endpoint.method,
      headers: {
        ...endpoint.headers,
        Authorization: endpoint.isChatGpt ? `Bearer ${chatGptApiKey}` : endpoint.withAuth ? `Bearer ${storedAccessToken}` : undefined,
        "Accept": "text/event-stream"
      },
      body: endpoint.method !== 'GET' ? JSON.stringify(data) : undefined
    });

    if (!response.body) throw new Error("No response body");

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    return {
      async *stream() {
        let buffer = "";
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
    
          buffer += decoder.decode(value, { stream: true });
    
          // Process complete JSON objects in buffer
          const lines = buffer.split("\n");
          buffer = ""; // Reset buffer after processing
    
          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;
            
            const data = line.replace("data: ", "").trim();
            if (data === "[DONE]") return;
    
            try {
              const parsed = JSON.parse(data);
              // Ensure yielding a full sentence instead of partial words
              if (parsed.message) yield parsed.message;
            } catch (error) {
              console.error("Error parsing stream:", error);
            }
          }
        }
      }
    };
    
  }

  // Use Axios for non-streaming requests
  const axiosConfig: AxiosRequestConfig = {
    method: endpoint.method,
    url: fullUrl,
    headers: {
      ...endpoint.headers,
      Authorization: endpoint.isChatGpt ? `Bearer ${chatGptApiKey}` : endpoint.withAuth ? `Bearer ${storedAccessToken}` : undefined,
      "Accept": "application/json"
    },
    params: params
  };

  if (endpoint.method !== 'GET') {
    axiosConfig.data = data;
  }

  try {
    const response = await axios(axiosConfig);
    return response.data;
  } catch (error) {
    console.error("Request error:", error);
    throw error;
  }
};


export default Request;

