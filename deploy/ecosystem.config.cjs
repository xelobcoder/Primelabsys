module.exports = {
  apps: [
    {
      name: "pls-corporate-website",
      cwd: "/var/www/primelaboratorysystems",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 2380 -H 127.0.0.1",
      instances: 1,
      exec_mode: "fork",
      env: { NODE_ENV: "production" },
      max_memory_restart: "700M",
      autorestart: true,
      time: true,
    },
  ],
};
