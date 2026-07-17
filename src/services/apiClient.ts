import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api/v1';

const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Crucial for sending/receiving cookies (refreshToken)
});

interface UserAuthConfig {
  tokenKey: string;
  userKey: string;
  loginPath: string;
  refreshPath: string;
  redirectUrl: string;
}

const authConfigs: Record<string, UserAuthConfig> = {
  admin: {
    tokenKey: 'adminToken',
    userKey: 'adminUser',
    loginPath: '/admin/login',
    refreshPath: '/admin/refresh-token',
    redirectUrl: '/admin/login',
  },
  agent: {
    tokenKey: 'agentToken',
    userKey: 'agentUser',
    loginPath: '/auth/agent/login',
    refreshPath: '/auth/agent/refresh-token',
    redirectUrl: '/agent/login',
  },
  developer: {
    tokenKey: 'developerToken',
    userKey: 'developerUser',
    loginPath: '/auth/developer/login',
    refreshPath: '/auth/developer/refresh-token',
    redirectUrl: '/developer/login',
  },
  staff: {
    tokenKey: 'staffToken',
    userKey: 'staffUser',
    loginPath: '/auth/staff/login',
    refreshPath: '/auth/staff/refresh-token',
    redirectUrl: '/staff/login',
  },
  user: {
    tokenKey: 'userToken',
    userKey: 'userUser',
    loginPath: '/user/login',
    refreshPath: '/user/refresh-token',
    redirectUrl: '/login',
  },
};

const defaultKey = 'admin';
const defaultAuth = authConfigs[defaultKey];

/**
 * Robust and flexible hybrid authentication configuration resolver.
 * Evaluates rules in order of priority:
 * 1. Explicit request headers ('X-User-Type')
 * 2. Explicit Axios request config properties (e.g. { userType: 'agent' })
 * 3. URL path segment pattern analysis (e.g. /auth/agent/ -> 'agent')
 * 4. Active login session state in localStorage ('activeUserType')
 * 5. Default fallback ('admin')
 */
const getAuthConfig = (url: string = '', headers?: any, customConfig?: any): UserAuthConfig => {
  // 1. Check for explicit header override
  const explicitHeader = headers?.['X-User-Type'] || headers?.['x-user-type'];
  if (explicitHeader && authConfigs[explicitHeader]) {
    return authConfigs[explicitHeader];
  }

  // 2. Check for explicit property override inside Axios request options
  const explicitProp = customConfig?.userType || customConfig?.role;
  if (explicitProp && authConfigs[explicitProp]) {
    return authConfigs[explicitProp];
  }

  // 3. Safely auto-infer from URL path segments
  // Splits path to isolate segments and discards queries or hash fragments
  const pathParts = url.toLowerCase().split(/[?#]/)[0].split('/');
  if (pathParts.includes('admin')) return authConfigs.admin;
  if (pathParts.includes('agent') || pathParts.includes('agency')) return authConfigs.agent;
  if (pathParts.includes('developer')) return authConfigs.developer;
  if (pathParts.includes('staff')) return authConfigs.staff;
  if (pathParts.includes('user')) return authConfigs.user;

  // 4. Session state fallback based on the actual browser URL (strict separation)
  if (typeof window !== 'undefined') {
    if (window.location.pathname.startsWith('/dashboard') || window.location.pathname.startsWith('/admin')) {
      return authConfigs.admin;
    } else {
      // By default, public facing pages belong to the 'user'
      return authConfigs.user;
    }
  }

  // 5. Default fallback
  return defaultAuth;
};

// Request Interceptor: Attach the access token to the Authorization header
apiClient.interceptors.request.use(
  (config) => {
    // Resolve dynamic auth config for this request
    const auth = getAuthConfig(config.url, config.headers, config);
    const token = localStorage.getItem(auth.tokenKey);
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Clean up temporary override headers so they aren't sent to the server
    if (config.headers) {
      delete config.headers['X-User-Type'];
      delete config.headers['x-user-type'];
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

let isRefreshing = false;
let failedQueue: any[] = [];

/**
 * Resolves or rejects the queued requests waiting for a new token.
 */
const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

/**
 * Clears local storage session keys and redirects the user to the login route.
 */
const handleAuthFailure = (auth: UserAuthConfig) => {
  localStorage.removeItem(auth.tokenKey);
  localStorage.removeItem(auth.userKey);
  
  if (auth.tokenKey === 'userToken') {
    window.location.reload();
  } else {
    window.location.href = auth.redirectUrl;
  }
};

/**
 * Requests a new access token from the backend refresh endpoint.
 */
const refreshAccessToken = async (refreshPath: string): Promise<string> => {
  const response = await axios.post(
    `${API_URL}${refreshPath}`,
    {},
    { withCredentials: true }
  );
  
  // The backend wraps responses in { status: 'success', data: { token: ... } }
  const newAccessToken = response.data?.data?.token || response.data?.data?.accessToken || '';
  if (!newAccessToken) {
    throw new Error('No access token received from refresh token endpoint');
  }
  return newAccessToken;
};

/**
 * Enqueues a failed request to be retried automatically once token refreshing is complete.
 */
const queueFailedRequest = (originalRequest: any): Promise<any> => {
  return new Promise((resolve, reject) => {
    failedQueue.push({ resolve, reject });
  })
    .then((token) => {
      if (originalRequest.headers) {
        originalRequest.headers.Authorization = `Bearer ${token}`;
      }
      return apiClient(originalRequest);
    })
    .catch((err) => {
      return Promise.reject(err);
    });
};

/**
 * Retries the original request with the new access token.
 */
const retryRequest = (originalRequest: any, token: string): Promise<any> => {
  if (originalRequest.headers) {
    originalRequest.headers.Authorization = `Bearer ${token}`;
  }
  return apiClient(originalRequest);
};

// Response Interceptor: Catch 401s, refresh access tokens, and retry pending requests
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Resolve role configuration for the request
    const auth = getAuthConfig(originalRequest.url, originalRequest.headers, originalRequest);

    // If request failed with 401 Unauthorized, is not already a retry, and is not a login route
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes(auth.loginPath)
    ) {
      // If the token refresh call itself fails, clean auth session and redirect to login
      if (originalRequest.url?.includes(auth.refreshPath)) {
        handleAuthFailure(auth);
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      // If a refresh is already in progress, queue this request to retry later
      if (isRefreshing) {
        return queueFailedRequest(originalRequest);
      }

      isRefreshing = true;

      try {
        // Request a new access token
        const newAccessToken = await refreshAccessToken(auth.refreshPath);

        // Store new access token
        localStorage.setItem(auth.tokenKey, newAccessToken);

        // Release the queued requests waiting for the token
        processQueue(null, newAccessToken);

        // Retry the original request
        return retryRequest(originalRequest, newAccessToken);
      } catch (refreshError) {
        processQueue(refreshError, null);
        handleAuthFailure(auth);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
