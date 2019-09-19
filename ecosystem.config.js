module.exports = {
  apps: [{
    name: 'wakhh.com',
    script: 'dist/index.js',

    // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
    args: '',
    exec_mode: 'fork',
    instances: 1,
    watch: false,
    log_date_format: "YYYY-MM-DD HH-mm-ss",
    autorestart: true,
    max_memory_restart: '600M',
    restart_delay: 1000,
    max_restarts: 30
  }]
}