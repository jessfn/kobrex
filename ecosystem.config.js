module.exports = {
  apps: [
    {
      name: "kobrex",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 14400",
      cwd: __dirname,
      env: {
        NODE_ENV: "production",
      },
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      max_memory_restart: "300M",
    },
  ],
};
