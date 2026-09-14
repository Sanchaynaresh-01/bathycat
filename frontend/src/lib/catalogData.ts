import { Product, ComponentCategory } from "@/types";

export const DEFAULT_PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Bathycat Custom Build",
    description: "Our flagship configurable autonomous survey catamaran. Tailored for bathymetric surveys, water quality monitoring, and autonomous navigation.",
    base_price: 5000,
    is_active: true
  },
  {
    id: 2,
    name: "Bathycat Survey USV",
    description: "Pre-configured dual-thruster survey platform optimized for coastal, lake, and reservoir bathymetric sounding missions.",
    base_price: 7500,
    is_active: true
  },
  {
    id: 3,
    name: "Bathycat Explorer Pro",
    description: "Heavy-duty ocean-rated survey USV with high payload capacity, extended endurance, and RTK GPS positioning.",
    base_price: 11000,
    is_active: true
  }
];

export const DEFAULT_CATEGORIES: ComponentCategory[] = [
  // Step 2: Material & Platform Configuration (Group: 01 PLATFORM)
  {
    id: 1,
    name: "Hull Type",
    group: "01 PLATFORM",
    step_order: 1,
    is_multiple_allowed: false,
    components: [
      { id: 1, category_id: 1, name: "Standard Hull", description: "Standard lightweight carbon-composite catamaran hull.", price_modifier: 0, weight: 3.5, is_active: true },
      { id: 2, category_id: 1, name: "Extended Hull", description: "Extended hull length for increased deck equipment space.", price_modifier: 350, weight: 4.5, is_active: true },
      { id: 3, category_id: 1, name: "Heavy Duty Hull", description: "Reinforced marine-grade HDPE hull for rocky riverbeds.", price_modifier: 600, weight: 6.0, is_active: true },
      { id: 4, category_id: 1, name: "Custom Hull", description: "Specially tailored hull shape engineered to custom survey specs.", price_modifier: 1200, weight: 5.0, is_active: true }
    ]
  },
  {
    id: 2,
    name: "Payload Capacity",
    group: "01 PLATFORM",
    step_order: 2,
    is_multiple_allowed: false,
    components: [
      { id: 5, category_id: 2, name: "Light (Up to 2 kg)", description: "Standard instrumentation and sensors.", price_modifier: 0, weight: 0.5, is_active: true },
      { id: 6, category_id: 2, name: "Medium (2-5 kg)", description: "Supports echosounders and multiparameter water sondes.", price_modifier: 250, weight: 1.0, is_active: true },
      { id: 7, category_id: 2, name: "Heavy (5+ kg)", description: "Maximum buoyancy for multibeam sonars and sampling winches.", price_modifier: 500, weight: 2.0, is_active: true }
    ]
  },
  {
    id: 3,
    name: "Mounting Options",
    group: "01 PLATFORM",
    step_order: 3,
    is_multiple_allowed: true,
    components: [
      { id: 8, category_id: 3, name: "Front Mount", description: "Forward bracket for obstacle avoidance cameras and lidar.", price_modifier: 120, weight: 0.4, is_active: true },
      { id: 9, category_id: 3, name: "Bottom Mount", description: "Recessed central well for acoustic transducers and sonars.", price_modifier: 180, weight: 0.6, is_active: true },
      { id: 10, category_id: 3, name: "Rear Mount", description: "Stern rail for towed magnetometer or antenna mast.", price_modifier: 140, weight: 0.5, is_active: true },
      { id: 11, category_id: 3, name: "Top Mount", description: "Deck mounting rails for weather station and solar mounts.", price_modifier: 160, weight: 0.5, is_active: true },
      { id: 12, category_id: 3, name: "Universal Rail", description: "Modular anodized aluminum T-slot accessory rail system.", price_modifier: 220, weight: 0.8, is_active: true }
    ]
  },

  // Step 3: Propulsion / Motor Configuration (Group: 02 PROPULSION)
  {
    id: 4,
    name: "Motor (KV)",
    group: "02 PROPULSION",
    step_order: 4,
    is_multiple_allowed: false,
    components: [
      { id: 13, category_id: 4, name: "850 KV", description: "High-torque, efficient motor for long slow-speed surveys.", price_modifier: 0, weight: 0.8, is_active: true },
      { id: 14, category_id: 4, name: "1000 KV", description: "Balanced speed and torque for standard survey operations.", price_modifier: 150, weight: 0.9, is_active: true },
      { id: 15, category_id: 4, name: "1500 KV", description: "High-speed motors for strong currents and fast river runs.", price_modifier: 280, weight: 1.0, is_active: true },
      { id: 16, category_id: 4, name: "Custom KV", description: "Specialized winding for custom operational parameters.", price_modifier: 450, weight: 1.0, is_active: true }
    ]
  },
  {
    id: 5,
    name: "Number of Thrusters",
    group: "02 PROPULSION",
    step_order: 5,
    is_multiple_allowed: false,
    components: [
      { id: 17, category_id: 5, name: "1 Thruster", description: "Single steerable outboard thruster for calm ponds.", price_modifier: 0, weight: 1.0, is_active: true },
      { id: 18, category_id: 5, name: "2 Thrusters (Dual)", description: "Twin differential thrusters — standard industry configuration.", price_modifier: 350, weight: 2.0, is_active: true },
      { id: 19, category_id: 5, name: "4 Thrusters (Quad)", description: "Four thrusters for omnidirectional vector positioning.", price_modifier: 750, weight: 4.0, is_active: true }
    ]
  },
  {
    id: 6,
    name: "Thruster Configuration",
    group: "02 PROPULSION",
    step_order: 6,
    is_multiple_allowed: false,
    components: [
      { id: 20, category_id: 6, name: "Differential Thrust", description: "Differential speed steering with zero turning radius.", price_modifier: 0, weight: 0.2, is_active: true },
      { id: 21, category_id: 6, name: "Dual Thrust", description: "Synchronized dual propulsion with physical rudder control.", price_modifier: 180, weight: 0.4, is_active: true },
      { id: 22, category_id: 6, name: "Vector Thrust", description: "360-degree dynamic station keeping in rough waves.", price_modifier: 420, weight: 0.6, is_active: true }
    ]
  },
  {
    id: 7,
    name: "ESC (Speed Controller)",
    group: "02 PROPULSION",
    step_order: 7,
    is_multiple_allowed: false,
    components: [
      { id: 23, category_id: 7, name: "Standard ESC", description: "Sealed brushless electronic speed controller.", price_modifier: 0, weight: 0.2, is_active: true },
      { id: 24, category_id: 7, name: "Waterproof ESC (IP68)", description: "Submersible potted ESC designed for continuous marine use.", price_modifier: 140, weight: 0.3, is_active: true },
      { id: 25, category_id: 7, name: "Smart ESC (Telemetry)", description: "Live RPM, temperature, voltage, and current feedback.", price_modifier: 260, weight: 0.3, is_active: true }
    ]
  },
  {
    id: 8,
    name: "ESC Current Rating",
    group: "02 PROPULSION",
    step_order: 8,
    is_multiple_allowed: false,
    components: [
      { id: 26, category_id: 8, name: "20A", description: "Lightweight rating for low-power surveys.", price_modifier: 0, weight: 0.1, is_active: true },
      { id: 27, category_id: 8, name: "30A", description: "Standard rating for typical survey speeds.", price_modifier: 80, weight: 0.15, is_active: true },
      { id: 28, category_id: 8, name: "40A", description: "High-thrust rating for demanding water flows.", price_modifier: 140, weight: 0.2, is_active: true },
      { id: 29, category_id: 8, name: "60A+", description: "Heavy-duty rating for maximum continuous power.", price_modifier: 220, weight: 0.25, is_active: true }
    ]
  },

  // Step 4: Battery & Power System Configuration (Group: 03 POWER SYSTEM)
  {
    id: 9,
    name: "Battery Voltage (S)",
    group: "03 POWER SYSTEM",
    step_order: 9,
    is_multiple_allowed: false,
    components: [
      { id: 30, category_id: 9, name: "2S (7.4V)", description: "Low voltage for small test platforms.", price_modifier: 0, weight: 0.4, is_active: true },
      { id: 31, category_id: 9, name: "3S (11.1V)", description: "Standard voltage for balanced performance and efficiency.", price_modifier: 120, weight: 0.6, is_active: true },
      { id: 32, category_id: 9, name: "4S (14.8V)", description: "High power for fast surveys and heavy payload draw.", price_modifier: 240, weight: 0.9, is_active: true }
    ]
  },
  {
    id: 10,
    name: "Battery Capacity (mAh)",
    group: "03 POWER SYSTEM",
    step_order: 10,
    is_multiple_allowed: false,
    components: [
      { id: 33, category_id: 10, name: "4000 mAh", description: "Approx 1.5 - 2 hours typical runtime.", price_modifier: 0, weight: 0.6, is_active: true },
      { id: 34, category_id: 10, name: "8000 mAh", description: "Approx 3.5 - 4.5 hours continuous survey runtime.", price_modifier: 180, weight: 1.1, is_active: true },
      { id: 35, category_id: 10, name: "12000 mAh", description: "Approx 6 - 8 hours extended endurance pack.", price_modifier: 320, weight: 1.8, is_active: true },
      { id: 36, category_id: 10, name: "16000 mAh", description: "Full-day survey pack (10+ hours endurance).", price_modifier: 480, weight: 2.5, is_active: true }
    ]
  },
  {
    id: 11,
    name: "Solar Panel & Auxiliary Power",
    group: "03 POWER SYSTEM",
    step_order: 11,
    is_multiple_allowed: false,
    components: [
      { id: 37, category_id: 11, name: "No Solar Panel", description: "Standard battery-only power configuration.", price_modifier: 0, weight: 0, is_active: true },
      { id: 38, category_id: 11, name: "20W Flexible Solar Panel", description: "Deck-mounted solar panel for battery trickle and auxiliary power.", price_modifier: 220, weight: 0.7, is_active: true },
      { id: 39, category_id: 11, name: "40W High-Efficiency Solar Panel", description: "Extended runtime panel with MPPT charge controller.", price_modifier: 380, weight: 1.2, is_active: true }
    ]
  },
  {
    id: 12,
    name: "Battery Protection (BMS) & Safety",
    group: "03 POWER SYSTEM",
    step_order: 12,
    is_multiple_allowed: true,
    components: [
      { id: 40, category_id: 12, name: "Active Cell Balancing", description: "Extends pack life and maintains equal cell charge.", price_modifier: 60, weight: 0.1, is_active: true },
      { id: 41, category_id: 12, name: "Over Current & Short Protection", description: "Hardware breaker and fast fuse protection.", price_modifier: 80, weight: 0.1, is_active: true },
      { id: 42, category_id: 12, name: "Over Temperature Protection", description: "Thermistor sensor shuts down pack before thermal runaway.", price_modifier: 90, weight: 0.1, is_active: true },
      { id: 43, category_id: 12, name: "Low Voltage Cutoff", description: "Automatic motor throttle back to protect battery cells.", price_modifier: 70, weight: 0.1, is_active: true }
    ]
  },

  // Step 5: GPS, Communication & Navigation (Groups: 04 CONTROLLER, 05 COMMUNICATION, 06 NAVIGATION)
  {
    id: 13,
    name: "Navigation & Positioning System",
    group: "06 NAVIGATION",
    step_order: 13,
    is_multiple_allowed: false,
    components: [
      { id: 44, category_id: 13, name: "Standard GPS (1-3m)", description: "Single-band GPS / GLONASS receiver for general positioning.", price_modifier: 0, weight: 0.2, is_active: true },
      { id: 45, category_id: 13, name: "Multi-Constellation GNSS", description: "GPS + Galileo + BeiDou + GLONASS for high-reliability lock.", price_modifier: 240, weight: 0.25, is_active: true },
      { id: 46, category_id: 13, name: "DGPS (Sub-meter)", description: "Differential GPS receiver with SBAS correction.", price_modifier: 480, weight: 0.35, is_active: true },
      { id: 47, category_id: 13, name: "Centimeter RTK GPS", description: "Real-Time Kinematic GNSS providing 1-2 cm survey precision.", price_modifier: 950, weight: 0.4, is_active: true }
    ]
  },
  {
    id: 14,
    name: "Navigation Sensors & IMU",
    group: "06 NAVIGATION",
    step_order: 14,
    is_multiple_allowed: true,
    components: [
      { id: 48, category_id: 14, name: "Electronic Compass", description: "Tilt-compensated 3-axis digital magnetic compass.", price_modifier: 90, weight: 0.1, is_active: true },
      { id: 49, category_id: 14, name: "6-DOF Precision IMU", description: "Accelerometer and gyroscope for wave pitch & roll compensation.", price_modifier: 180, weight: 0.1, is_active: true },
      { id: 50, category_id: 14, name: "Dual Antenna Heading System", description: "True heading determination unaffected by magnetic interference.", price_modifier: 450, weight: 0.3, is_active: true }
    ]
  },
  {
    id: 15,
    name: "Autopilot & Controller",
    group: "04 CONTROLLER",
    step_order: 15,
    is_multiple_allowed: false,
    components: [
      { id: 51, category_id: 15, name: "ESP32-S3 Marine Controller", description: "Reliable dual-core microcontroller with onboard Wi-Fi and Bluetooth.", price_modifier: 0, weight: 0.2, is_active: true },
      { id: 52, category_id: 15, name: "Pixhawk 6C Mission Autopilot", description: "Open-source ArduPilot compatible autonomous survey controller.", price_modifier: 390, weight: 0.35, is_active: true },
      { id: 53, category_id: 15, name: "Jetson Nano Edge Computer", description: "AI-ready companion computer for obstacle detection and real-time point clouds.", price_modifier: 680, weight: 0.5, is_active: true }
    ]
  },
  {
    id: 16,
    name: "Communication & Telemetry Link",
    group: "05 COMMUNICATION",
    step_order: 16,
    is_multiple_allowed: false,
    components: [
      { id: 54, category_id: 16, name: "Wi-Fi & Bluetooth (300m)", description: "High-bandwidth local telemetry and calibration.", price_modifier: 0, weight: 0.1, is_active: true },
      { id: 55, category_id: 16, name: "Long Range LoRa (5 km)", description: "Telemetry link for remote grid surveys and waypoint monitoring.", price_modifier: 260, weight: 0.2, is_active: true },
      { id: 56, category_id: 16, name: "4G / LTE Cellular Cloud Link", description: "Unlimited range telemetry streaming to web dashboard.", price_modifier: 420, weight: 0.25, is_active: true }
    ]
  },

  // Step 6: Sensors, Bathymetry & Payload Options (Groups: 07 SENSORS, 08 BATHYMETRY, 09 VISION, 14 ADD ON)
  {
    id: 17,
    name: "Sonar / Echosounder (Bathymetry)",
    group: "08 BATHYMETRY",
    step_order: 17,
    is_multiple_allowed: false,
    components: [
      { id: 57, category_id: 17, name: "Single Beam Sonar (0.5 - 50m)", description: "Standard hydrographic single-beam sounder with NMEA output.", price_modifier: 0, weight: 0.8, is_active: true },
      { id: 58, category_id: 17, name: "Dual Frequency Sonar (200/50 kHz)", description: "Dual frequency for water depth and sub-bottom sediment penetration.", price_modifier: 650, weight: 1.2, is_active: true },
      { id: 59, category_id: 17, name: "High Resolution CHIRP Sonar", description: "High-definition acoustic imaging with sub-centimeter layer resolution.", price_modifier: 1200, weight: 1.5, is_active: true },
      { id: 60, category_id: 17, name: "Multibeam Swath Bathymetry System", description: "Full 3D bathymetric mapping system with 120-degree swath width.", price_modifier: 3400, weight: 3.5, is_active: true }
    ]
  },
  {
    id: 18,
    name: "Water Quality Sensors",
    group: "07 SENSORS",
    step_order: 18,
    is_multiple_allowed: true,
    components: [
      { id: 61, category_id: 18, name: "Water Temperature Probe", description: "Calibrated digital thermistor probe with 0.1°C accuracy.", price_modifier: 80, weight: 0.15, is_active: true },
      { id: 62, category_id: 18, name: "pH Sensor", description: "Industrial gel-filled glass electrode pH sensor.", price_modifier: 160, weight: 0.2, is_active: true },
      { id: 63, category_id: 18, name: "Turbidity Sensor", description: "Optical nephelometric turbidity unit (NTU).", price_modifier: 190, weight: 0.25, is_active: true },
      { id: 64, category_id: 18, name: "Dissolved Oxygen (DO)", description: "Optical luminescence dissolved oxygen sensor.", price_modifier: 340, weight: 0.3, is_active: true },
      { id: 65, category_id: 18, name: "Conductivity / TDS / Salinity", description: "Four-electrode toroidal conductivity sensor.", price_modifier: 240, weight: 0.3, is_active: true }
    ]
  },
  {
    id: 19,
    name: "Vision, Lighting & Safety",
    group: "09 VISION & LIGHTING",
    step_order: 19,
    is_multiple_allowed: true,
    components: [
      { id: 66, category_id: 19, name: "Front FPV Navigation Camera (1080p)", description: "Wide-angle low-latency live camera for navigation.", price_modifier: 180, weight: 0.2, is_active: true },
      { id: 67, category_id: 19, name: "Underwater Inspection Camera", description: "Keel-mounted camera with digital recording.", price_modifier: 320, weight: 0.4, is_active: true },
      { id: 68, category_id: 19, name: "High-Power Marine LED Lights", description: "High-output waterproof floodlights for night surveys.", price_modifier: 140, weight: 0.3, is_active: true },
      { id: 69, category_id: 19, name: "Internal Hull Leak Detection System", description: "Capacitive moisture sensors with auto-abort failsafe.", price_modifier: 110, weight: 0.1, is_active: true }
    ]
  },
  {
    id: 20,
    name: "Add-on Payload Modules",
    group: "14 CUSTOM & ADD ON",
    step_order: 20,
    is_multiple_allowed: true,
    components: [
      { id: 70, category_id: 20, name: "Water Sampling Carousel (4-Bottle)", description: "Autonomous peristaltic water sampler with remote trigger.", price_modifier: 850, weight: 1.8, is_active: true },
      { id: 71, category_id: 20, name: "Anti-Collision LiDAR Sensor", description: "360-degree laser rangefinder for dynamic boat and obstacle avoidance.", price_modifier: 520, weight: 0.4, is_active: true },
      { id: 72, category_id: 20, name: "MicroSD + Cloud Data Logger", description: "Synchronous CSV, GeoJSON, and KML data logger with backup storage.", price_modifier: 150, weight: 0.1, is_active: true }
    ]
  }
];

export const DEFAULT_CONSTRAINTS = [
  { id: 1, component_id: 17, incompatible_component_id: 60 },
  { id: 2, component_id: 30, incompatible_component_id: 60 }
];
