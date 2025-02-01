import axios, { AxiosRequestConfig } from 'axios';
import { RequestOptions } from '../Datatypes/interfaces/interface';
import { ApiEndpoint } from '../Datatypes/enums';
import Cookies from 'js-cookie';

const chatGptApiKey = import.meta.env.VITE_OPENAI_API_KEY; 

const Request = async ({ endpointId, slug, data, headers, params }: RequestOptions) => {
  const storedAccessToken = Cookies.get('access');  // Retrieve stored access token
  const endpoint = ApiEndpoint[endpointId];

  if (!endpoint) {
    throw new Error(`Invalid API endpoint: ${endpointId}`);
  }

  let fullUrl = endpoint.url;
  if (slug) {
    fullUrl += `${slug}`;  // Append additional slug to URL if provided
  }

  const axiosConfig: AxiosRequestConfig = {
    method: endpoint.method,
    url: fullUrl,
    headers: {
      ...endpoint.headers,
      // Use the appropriate Authorization header based on the endpoint type
      Authorization: endpoint.isChatGpt ? `Bearer ${chatGptApiKey}` : endpoint.withAuth ? `Bearer ${storedAccessToken}` : undefined
    },
    params: params  // Add query parameters if provided
  };

  // Check and set appropriate data for non-GET requests
  if (endpoint.method !== 'GET') {
    axiosConfig.data = data;
  }

  try {
    const response = await axios(axiosConfig);

    // Log response data for debugging
    console.log("Response Data:", response.data);

    // Handle unsuccessful response
    if (response.status < 200 || response.status >= 300) {
      const errorText = response.data?.error || response.data?.message || endpoint.errorMessage || "Unexpected error occurred.";
      throw new Error(errorText);
    }


    return response.data;  // Return the response data for further processing
  } catch (error) {

    if ( endpoint?.errorMessage) {
        alert(endpoint?.errorMessage);
    }

    console.error("Request error:", error);
    throw error;  // Re-throw the error for further handling
  }
};

export default Request;