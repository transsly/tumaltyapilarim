module.exports = {
    apps: [
      {
        name: "Mainframe",
        namespace: "ACARFX",
        script: 'acar.js',
        watch: false,
        exec_mode: "cluster",
        max_memory_restart: "2G",
        cwd: "./Moderation"
      },
      {
        name: "Requirements",
        namespace: "ACARFX",
        script: 'acar.js',
        watch: false,
        exec_mode: "cluster",
        max_memory_restart: "2G",
        cwd: "./Requirements"
      },
      {
        name: "Statistics",
        namespace: "ACARFX",
        script: 'acar.js',
        watch: false,
        exec_mode: "cluster",
        max_memory_restart: "2G",
        cwd: "./Statistics"
      },
      {
        name: "FW_ONE",
        namespace: "ACARFX",
        script: 'acar.js',
        watch: false,
        exec_mode: "cluster",
        max_memory_restart: "2G",
        cwd: "./Firewall_ONE"
      },
      {
        name: "FW_TWO",
        namespace: "ACARFX",
        script: 'acar.js',
        watch: false,
        exec_mode: "cluster",
        max_memory_restart: "2G",
        cwd: "./Firewall_TWO"
      },
      {
        name: "FW_THREE",
        namespace: "ACARFX",
        script: 'acar.js',
        watch: false,
        exec_mode: "cluster",
        max_memory_restart: "2G",
        cwd: "./Firewall_THREE"
      },
      {
        name: "FW_FOUR",
        namespace: "ACARFX",
        script: 'acar.js',
        watch: false,
        exec_mode: "cluster",
        max_memory_restart: "2G",
        cwd: "./Firewall_FOUR"
      },
      {
        name: "FW_DIST",
        namespace: "ACARFX",
        script: 'acar.js',
        watch: false,
        exec_mode: "cluster",
        max_memory_restart: "2G",
        cwd: "./FIREW_Distributors"
      },
      {
        name: "Auxiliary",
        namespace: "ACARFX",
        script: 'acar.js',
        watch: false,
        exec_mode: "cluster",
        max_memory_restart: "2G",
        cwd: "./Auxiliary"
      },
    ]
  };