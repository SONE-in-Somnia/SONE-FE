module.exports = {
  apps: [
    {
      name: "fuku-client",
      script: "npm",
      args: "start",
      cwd: "./",
      watch: true,
      ignore_watch: ["node_modules"],
    },
  ],
};
