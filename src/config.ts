interface Config {
  endpoint: string;
}

const config: Config = {
  endpoint: import.meta.env.VITE_API_URL || "http://localhost:3000/api/"
};

export default config;