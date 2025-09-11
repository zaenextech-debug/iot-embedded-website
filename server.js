// node server.js
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// ---------- Views ----------
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ---------- Trust proxy for correct host/https behind CDNs ----------
app.set('trust proxy', 1);

// ---------- Canonical host redirect (production only) ----------
const CANONICAL_HOST = process.env.CANONICAL_HOST || 'zaenextech.com';
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    const host = (req.headers.host || '').toLowerCase();
    if (host === `www.${CANONICAL_HOST}`) {
      return res.redirect(301, `https://${CANONICAL_HOST}${req.originalUrl}`);
    }
    return next();
  });
}

// ---------- Static (with caching) ----------
app.use(
  express.static(path.join(__dirname, 'public'), {
    maxAge: '30d',
    etag: true,
    setHeaders: (res, filePath) => {
      if (filePath.endsWith('sitemap.xml')) {
        res.type('application/xml; charset=utf-8');
      }
      if (filePath.endsWith('site.webmanifest')) {
        res.type('application/manifest+json; charset=utf-8');
      }
    },
  })
);

// ---------- Explicit assets ----------
app.get('/favicon.ico', (req, res) =>
  res.sendFile(path.join(__dirname, 'public', 'favicon.ico'))
);
app.get('/robots.txt', (req, res) =>
  res.type('text/plain; charset=utf-8').sendFile(path.join(__dirname, 'public', 'robots.txt'))
);
app.get('/sitemap.xml', (req, res) =>
  res.type('application/xml; charset=utf-8').sendFile(path.join(__dirname, 'public', 'sitemap.xml'))
);
app.get('/site.webmanifest', (req, res) =>
  res
    .type('application/manifest+json; charset=utf-8')
    .sendFile(path.join(__dirname, 'public', 'site.webmanifest'))
);

// ---------- Base pages ----------
app.get('/',        (req,res)=> res.render('index',   { activePage:'home'     }));
app.get('/about',   (req,res)=> res.render('about',   { activePage:'about'    }));
app.get('/services',(req,res)=> res.render('services',{ activePage:'services' }));
app.get('/projects',(req,res)=> res.render('projects',{ activePage:'projects' }));
app.get('/contact', (req,res)=> res.render('contact', { activePage:'contact'  }));

// ---------- Project detail ----------
app.get('/projects/pcb', (req,res)=> res.render('project-pcb', { activePage:'projects' }));

/** -------- Service detail data -------- */
const serviceData = {
  pcb: {
    slug: 'pcb',
    title: 'PCB Design',
    icon: 'fa-layer-group',
    blurb: 'Clean, manufacturable layouts with controlled impedance and EMC-aware routing.',
    columns: [
      { heading: 'Capabilities', icon: 'fa-bolt', items: [
        {label:'1–8 Layers', pct:92},{label:'Impedance Control', pct:90},{label:'DFM / DFT', pct:88},
        {label:'Stackups & Fab Notes', pct:86},{label:'Panelization', pct:82},{label:'Bring-up Support', pct:84}
      ]},
      { heading: 'Tools', icon: 'fa-screwdriver-wrench', items: [
        {label:'KiCad', pct:92},{label:'Altium', pct:80},{label:'Gerber/ODB++', pct:88},
        {label:'SI/PI Basics', pct:78},{label:'ERC/DRC', pct:90}
      ]},
      { heading: 'Use-cases', icon: 'fa-microchip', items: [
        {label:'MCU/SoC boards', pct:90},{label:'Sensor modules', pct:88},{label:'Power stages', pct:80},
        {label:'RF basics', pct:72},{label:'Test jigs', pct:82}
      ]}
    ]
  },
  hardware: {
    slug: 'hardware',
    title: 'Embedded Hardware',
    icon: 'fa-microchip',
    blurb: 'Schematics, component selection, power, and complete bring-up for real devices.',
    columns: [
      { heading: 'Platforms', icon: 'fa-robot', items: [
        {label:'Robotics', pct:88},{label:'PLCs', pct:78},{label:'ESP32', pct:90},
        {label:'STM32', pct:86},{label:'Arduino', pct:92},{label:'Raspberry Pi', pct:82}
      ]},
      { heading: 'Subsystems', icon: 'fa-network-wired', items: [
        {label:'Sensors & Actuators', pct:90},{label:'Power & Battery', pct:86},
        {label:'Comms (UART/I²C/SPI/CAN)', pct:90},{label:'Motor Drivers', pct:82},{label:'HMI & Displays', pct:80}
      ]},
      { heading: 'Deliverables', icon: 'fa-file-lines', items: [
        {label:'Schematics', pct:95},{label:'BOM & Sourcing', pct:88},{label:'Bring-up Checklist', pct:86},
        {label:'Test Reports', pct:82},{label:'Mini-Project Builds', pct:90}
      ]}
    ]
  },
  firmware: {
    slug: 'firmware',
    title: 'Firmware Development',
    icon: 'fa-code',
    blurb: 'Reliable bare-metal and RTOS firmware with drivers, bootloaders, and tests.',
    columns: [
      { heading: 'MCU Skills', icon: 'fa-microchip', items: [
        {label:'C / C++', pct:92},{label:'HAL/LL Drivers', pct:88},{label:'Interrupts & DMA', pct:86},{label:'Low-Power Modes', pct:82}
      ]},
      { heading: 'OS & Modules', icon: 'fa-layer-group', items: [
        {label:'FreeRTOS', pct:86},{label:'Bootloaders', pct:84},{label:'OTA Update Flow', pct:82},{label:'Unit & HIL Tests', pct:78}
      ]},
      { heading: 'Peripherals', icon: 'fa-plug', items: [
        {label:'I²C / SPI / UART', pct:92},{label:'ADC / DAC / Timers', pct:86},{label:'BLE / Wi-Fi (ESP32)', pct:84},{label:'Storage (Flash/FS)', pct:80}
      ]}
    ]
  },
  software: {
    slug: 'software',
    title: 'Software Engineering',
    icon: 'fa-laptop-code',
    blurb: 'APIs, dashboards, and tools that support your devices and workflows.',
    columns: [
      { heading: 'Programming', icon: 'fa-code', items: [
        {label:'Python', pct:92},{label:'C++', pct:86},{label:'Java', pct:84},{label:'JavaScript', pct:88},{label:'HTML/CSS', pct:86}
      ]},
      { heading: 'Frameworks & Tools', icon: 'fa-screwdriver-wrench', items: [
        {label:'Node.js', pct:88},{label:'Express', pct:86},{label:'Electron', pct:82},{label:'Flask', pct:82},{label:'React (basics)', pct:76}
      ]},
      { heading: 'Platforms', icon: 'fa-database', items: [
        {label:'REST APIs', pct:88},{label:'SQL/SQLite', pct:82},{label:'Git & CI', pct:86},{label:'Docker (basics)', pct:70}
      ]}
    ]
  },
  iot: {
    slug: 'iot',
    title: 'IoT Integration',
    icon: 'fa-cloud',
    blurb: 'Secure connectivity, telemetry, and fleet operations from device to cloud.',
    columns: [
      { heading: 'Protocols', icon: 'fa-signal', items: [
        {label:'MQTT', pct:90},{label:'HTTP/REST', pct:86},{label:'Webhooks', pct:80},{label:'TLS & Auth', pct:82}
      ]},
      { heading: 'Cloud', icon: 'fa-cloud', items: [
        {label:'Dashboards', pct:86},{label:'Alerts & Rules', pct:84},{label:'Device Lifecycle', pct:86},{label:'Cost Optimization', pct:78}
      ]},
      { heading: 'Ops', icon: 'fa-gears', items: [
        {label:'Provisioning', pct:84},{label:'Monitoring & Logs', pct:86},{label:'OTA & Rollouts', pct:82},{label:'Security Hygiene', pct:80}
      ]}
    ]
  }
};

// ---------- Shared service detail page ----------
app.get('/services/:slug', (req,res)=>{
  const data = serviceData[req.params.slug];
  if(!data) return res.status(404).send('Service not found');
  res.render('service-detail', { activePage:'services', data });
});

// ---------- Health + 404 ----------
app.get('/healthz', (req,res)=> res.type('text/plain').send('ok'));
app.use((req,res)=> res.status(404).type('text/plain').send('Not found'));

// ---------- Listen ----------
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
