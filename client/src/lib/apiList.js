export const server = "http://localhost:4444";

const apiList = {
  login: `${server}/auth/login`,
  signup: `${server}/auth/signup`,
  jobs: `${server}/api/jobs`,
};

export default apiList;