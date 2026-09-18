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
  {
    "id": 1,
    "name": "Hull Type",
    "group": "01 PLATFORM",
    "step_order": 1,
    "is_multiple_allowed": false,
    "components": [
      {
        "id": 1,
        "category_id": 1,
        "name": "Standard Hull",
        "description": "Standard Hull option for Hull Type.",
        "price_modifier": 0.0,
        "weight": 1.0,
        "is_active": true
      },
      {
        "id": 2,
        "category_id": 1,
        "name": "Extended Hull",
        "description": "Extended Hull option for Hull Type.",
        "price_modifier": 60.0,
        "weight": 1.2,
        "is_active": true
      },
      {
        "id": 3,
        "category_id": 1,
        "name": "Heavy Duty Hull",
        "description": "Heavy Duty Hull option for Hull Type.",
        "price_modifier": 110.0,
        "weight": 1.4,
        "is_active": true
      },
      {
        "id": 4,
        "category_id": 1,
        "name": "Custom Hull",
        "description": "Custom Hull option for Hull Type.",
        "price_modifier": 160.0,
        "weight": 1.6,
        "is_active": true
      }
    ]
  },
  {
    "id": 2,
    "name": "Payload Capacity",
    "group": "01 PLATFORM",
    "step_order": 2,
    "is_multiple_allowed": false,
    "components": [
      {
        "id": 5,
        "category_id": 2,
        "name": "Light (Up to 2 kg)",
        "description": "Light (Up to 2 kg) option for Payload Capacity.",
        "price_modifier": 20.0,
        "weight": 1.0,
        "is_active": true
      },
      {
        "id": 6,
        "category_id": 2,
        "name": "Medium (2-5 kg)",
        "description": "Medium (2-5 kg) option for Payload Capacity.",
        "price_modifier": 70.0,
        "weight": 1.2,
        "is_active": true
      },
      {
        "id": 7,
        "category_id": 2,
        "name": "Heavy (5+ kg)",
        "description": "Heavy (5+ kg) option for Payload Capacity.",
        "price_modifier": 120.0,
        "weight": 1.4,
        "is_active": true
      }
    ]
  },
  {
    "id": 3,
    "name": "Mounting Options",
    "group": "01 PLATFORM",
    "step_order": 3,
    "is_multiple_allowed": true,
    "components": [
      {
        "id": 8,
        "category_id": 3,
        "name": "Front Mount",
        "description": "Front Mount option for Mounting Options.",
        "price_modifier": 30.0,
        "weight": 1.0,
        "is_active": true
      },
      {
        "id": 9,
        "category_id": 3,
        "name": "Bottom Mount",
        "description": "Bottom Mount option for Mounting Options.",
        "price_modifier": 80.0,
        "weight": 1.2,
        "is_active": true
      },
      {
        "id": 10,
        "category_id": 3,
        "name": "Rear Mount",
        "description": "Rear Mount option for Mounting Options.",
        "price_modifier": 130.0,
        "weight": 1.4,
        "is_active": true
      },
      {
        "id": 11,
        "category_id": 3,
        "name": "Top Mount",
        "description": "Top Mount option for Mounting Options.",
        "price_modifier": 180.0,
        "weight": 1.6,
        "is_active": true
      },
      {
        "id": 12,
        "category_id": 3,
        "name": "Universal Rail",
        "description": "Universal Rail option for Mounting Options.",
        "price_modifier": 230.0,
        "weight": 1.8,
        "is_active": true
      }
    ]
  },
  {
    "id": 4,
    "name": "Motor (KV)",
    "group": "02 PROPULSION",
    "step_order": 4,
    "is_multiple_allowed": false,
    "components": [
      {
        "id": 13,
        "category_id": 4,
        "name": "850 KV",
        "description": "850 KV option for Motor (KV).",
        "price_modifier": 40.0,
        "weight": 1.0,
        "is_active": true
      },
      {
        "id": 14,
        "category_id": 4,
        "name": "1000 KV",
        "description": "1000 KV option for Motor (KV).",
        "price_modifier": 90.0,
        "weight": 1.2,
        "is_active": true
      },
      {
        "id": 15,
        "category_id": 4,
        "name": "1500 KV",
        "description": "1500 KV option for Motor (KV).",
        "price_modifier": 140.0,
        "weight": 1.4,
        "is_active": true
      },
      {
        "id": 16,
        "category_id": 4,
        "name": "Custom KV",
        "description": "Custom KV option for Motor (KV).",
        "price_modifier": 190.0,
        "weight": 1.6,
        "is_active": true
      }
    ]
  },
  {
    "id": 5,
    "name": "Number of Thrusters",
    "group": "02 PROPULSION",
    "step_order": 5,
    "is_multiple_allowed": false,
    "components": [
      {
        "id": 17,
        "category_id": 5,
        "name": "1",
        "description": "1 option for Number of Thrusters.",
        "price_modifier": 50.0,
        "weight": 1.0,
        "is_active": true
      },
      {
        "id": 18,
        "category_id": 5,
        "name": "2",
        "description": "2 option for Number of Thrusters.",
        "price_modifier": 100.0,
        "weight": 1.2,
        "is_active": true
      },
      {
        "id": 19,
        "category_id": 5,
        "name": "4",
        "description": "4 option for Number of Thrusters.",
        "price_modifier": 150.0,
        "weight": 1.4,
        "is_active": true
      },
      {
        "id": 20,
        "category_id": 5,
        "name": "6",
        "description": "6 option for Number of Thrusters.",
        "price_modifier": 200.0,
        "weight": 1.6,
        "is_active": true
      }
    ]
  },
  {
    "id": 6,
    "name": "Thruster Configuration",
    "group": "02 PROPULSION",
    "step_order": 6,
    "is_multiple_allowed": false,
    "components": [
      {
        "id": 21,
        "category_id": 6,
        "name": "Dual Thrust",
        "description": "Dual Thrust option for Thruster Configuration.",
        "price_modifier": 60.0,
        "weight": 1.0,
        "is_active": true
      },
      {
        "id": 22,
        "category_id": 6,
        "name": "Differential Thrust",
        "description": "Differential Thrust option for Thruster Configuration.",
        "price_modifier": 110.0,
        "weight": 1.2,
        "is_active": true
      },
      {
        "id": 23,
        "category_id": 6,
        "name": "Vector Thrust",
        "description": "Vector Thrust option for Thruster Configuration.",
        "price_modifier": 160.0,
        "weight": 1.4,
        "is_active": true
      },
      {
        "id": 24,
        "category_id": 6,
        "name": "Independent Control",
        "description": "Independent Control option for Thruster Configuration.",
        "price_modifier": 210.0,
        "weight": 1.6,
        "is_active": true
      }
    ]
  },
  {
    "id": 7,
    "name": "ESC",
    "group": "02 PROPULSION",
    "step_order": 7,
    "is_multiple_allowed": false,
    "components": [
      {
        "id": 25,
        "category_id": 7,
        "name": "Standard ESC",
        "description": "Standard ESC option for ESC.",
        "price_modifier": 0.0,
        "weight": 1.0,
        "is_active": true
      },
      {
        "id": 26,
        "category_id": 7,
        "name": "Waterproof ESC",
        "description": "Waterproof ESC option for ESC.",
        "price_modifier": 120.0,
        "weight": 1.2,
        "is_active": true
      },
      {
        "id": 27,
        "category_id": 7,
        "name": "Smart ESC (Telemetry)",
        "description": "Smart ESC (Telemetry) option for ESC.",
        "price_modifier": 170.0,
        "weight": 1.4,
        "is_active": true
      }
    ]
  },
  {
    "id": 8,
    "name": "ESC Current Rating",
    "group": "02 PROPULSION",
    "step_order": 8,
    "is_multiple_allowed": false,
    "components": [
      {
        "id": 28,
        "category_id": 8,
        "name": "20A",
        "description": "20A option for ESC Current Rating.",
        "price_modifier": 80.0,
        "weight": 1.0,
        "is_active": true
      },
      {
        "id": 29,
        "category_id": 8,
        "name": "30A",
        "description": "30A option for ESC Current Rating.",
        "price_modifier": 130.0,
        "weight": 1.2,
        "is_active": true
      },
      {
        "id": 30,
        "category_id": 8,
        "name": "40A",
        "description": "40A option for ESC Current Rating.",
        "price_modifier": 180.0,
        "weight": 1.4,
        "is_active": true
      },
      {
        "id": 31,
        "category_id": 8,
        "name": "60A+",
        "description": "60A+ option for ESC Current Rating.",
        "price_modifier": 230.0,
        "weight": 1.6,
        "is_active": true
      }
    ]
  },
  {
    "id": 9,
    "name": "Battery Voltage (S)",
    "group": "03 POWER SYSTEM",
    "step_order": 9,
    "is_multiple_allowed": false,
    "components": [
      {
        "id": 32,
        "category_id": 9,
        "name": "2S (7.4V)",
        "description": "2S (7.4V) option for Battery Voltage (S).",
        "price_modifier": 90.0,
        "weight": 1.0,
        "is_active": true
      },
      {
        "id": 33,
        "category_id": 9,
        "name": "3S (11.1V)",
        "description": "3S (11.1V) option for Battery Voltage (S).",
        "price_modifier": 140.0,
        "weight": 1.2,
        "is_active": true
      },
      {
        "id": 34,
        "category_id": 9,
        "name": "4S (14.8V)",
        "description": "4S (14.8V) option for Battery Voltage (S).",
        "price_modifier": 190.0,
        "weight": 1.4,
        "is_active": true
      },
      {
        "id": 35,
        "category_id": 9,
        "name": "Custom",
        "description": "Custom option for Battery Voltage (S).",
        "price_modifier": 240.0,
        "weight": 1.6,
        "is_active": true
      }
    ]
  },
  {
    "id": 10,
    "name": "Battery Capacity (mAh)",
    "group": "03 POWER SYSTEM",
    "step_order": 10,
    "is_multiple_allowed": false,
    "components": [
      {
        "id": 36,
        "category_id": 10,
        "name": "4000",
        "description": "4000 option for Battery Capacity (mAh).",
        "price_modifier": 100.0,
        "weight": 1.0,
        "is_active": true
      },
      {
        "id": 37,
        "category_id": 10,
        "name": "8000",
        "description": "8000 option for Battery Capacity (mAh).",
        "price_modifier": 150.0,
        "weight": 1.2,
        "is_active": true
      },
      {
        "id": 38,
        "category_id": 10,
        "name": "12000",
        "description": "12000 option for Battery Capacity (mAh).",
        "price_modifier": 200.0,
        "weight": 1.4,
        "is_active": true
      },
      {
        "id": 39,
        "category_id": 10,
        "name": "16000",
        "description": "16000 option for Battery Capacity (mAh).",
        "price_modifier": 250.0,
        "weight": 1.6,
        "is_active": true
      },
      {
        "id": 40,
        "category_id": 10,
        "name": "Custom",
        "description": "Custom option for Battery Capacity (mAh).",
        "price_modifier": 300.0,
        "weight": 1.8,
        "is_active": true
      }
    ]
  },
  {
    "id": 11,
    "name": "Battery Configuration",
    "group": "03 POWER SYSTEM",
    "step_order": 11,
    "is_multiple_allowed": false,
    "components": [
      {
        "id": 41,
        "category_id": 11,
        "name": "1P",
        "description": "1P option for Battery Configuration.",
        "price_modifier": 110.0,
        "weight": 1.0,
        "is_active": true
      },
      {
        "id": 42,
        "category_id": 11,
        "name": "2P",
        "description": "2P option for Battery Configuration.",
        "price_modifier": 160.0,
        "weight": 1.2,
        "is_active": true
      },
      {
        "id": 43,
        "category_id": 11,
        "name": "3P",
        "description": "3P option for Battery Configuration.",
        "price_modifier": 210.0,
        "weight": 1.4,
        "is_active": true
      },
      {
        "id": 44,
        "category_id": 11,
        "name": "4P",
        "description": "4P option for Battery Configuration.",
        "price_modifier": 260.0,
        "weight": 1.6,
        "is_active": true
      }
    ]
  },
  {
    "id": 12,
    "name": "Battery Protection (BMS)",
    "group": "03 POWER SYSTEM",
    "step_order": 12,
    "is_multiple_allowed": true,
    "components": [
      {
        "id": 45,
        "category_id": 12,
        "name": "Balancing",
        "description": "Balancing option for Battery Protection (BMS).",
        "price_modifier": 120.0,
        "weight": 1.0,
        "is_active": true
      },
      {
        "id": 46,
        "category_id": 12,
        "name": "Over Current Protection",
        "description": "Over Current Protection option for Battery Protection (BMS).",
        "price_modifier": 170.0,
        "weight": 1.2,
        "is_active": true
      },
      {
        "id": 47,
        "category_id": 12,
        "name": "Over Temperature Protection",
        "description": "Over Temperature Protection option for Battery Protection (BMS).",
        "price_modifier": 220.0,
        "weight": 1.4,
        "is_active": true
      },
      {
        "id": 48,
        "category_id": 12,
        "name": "Low Voltage Cutoff",
        "description": "Low Voltage Cutoff option for Battery Protection (BMS).",
        "price_modifier": 270.0,
        "weight": 1.6,
        "is_active": true
      }
    ]
  },
  {
    "id": 13,
    "name": "Solar Panel",
    "group": "03 POWER SYSTEM",
    "step_order": 13,
    "is_multiple_allowed": false,
    "components": [
      {
        "id": 49,
        "category_id": 13,
        "name": "No Solar",
        "description": "No Solar option for Solar Panel.",
        "price_modifier": 0.0,
        "weight": 1.0,
        "is_active": true
      },
      {
        "id": 50,
        "category_id": 13,
        "name": "20W",
        "description": "20W option for Solar Panel.",
        "price_modifier": 180.0,
        "weight": 1.2,
        "is_active": true
      },
      {
        "id": 51,
        "category_id": 13,
        "name": "40W",
        "description": "40W option for Solar Panel.",
        "price_modifier": 230.0,
        "weight": 1.4,
        "is_active": true
      },
      {
        "id": 52,
        "category_id": 13,
        "name": "55W",
        "description": "55W option for Solar Panel.",
        "price_modifier": 280.0,
        "weight": 1.6,
        "is_active": true
      },
      {
        "id": 53,
        "category_id": 13,
        "name": "100W",
        "description": "100W option for Solar Panel.",
        "price_modifier": 330.0,
        "weight": 1.8,
        "is_active": true
      },
      {
        "id": 54,
        "category_id": 13,
        "name": "Custom",
        "description": "Custom option for Solar Panel.",
        "price_modifier": 380.0,
        "weight": 2.0,
        "is_active": true
      }
    ]
  },
  {
    "id": 14,
    "name": "Power Distribution",
    "group": "03 POWER SYSTEM",
    "step_order": 14,
    "is_multiple_allowed": true,
    "components": [
      {
        "id": 55,
        "category_id": 14,
        "name": "Separate Motor Power",
        "description": "Separate Motor Power option for Power Distribution.",
        "price_modifier": 140.0,
        "weight": 1.0,
        "is_active": true
      },
      {
        "id": 56,
        "category_id": 14,
        "name": "Separate Electronics Power",
        "description": "Separate Electronics Power option for Power Distribution.",
        "price_modifier": 190.0,
        "weight": 1.2,
        "is_active": true
      },
      {
        "id": 57,
        "category_id": 14,
        "name": "Isolated GPS Power",
        "description": "Isolated GPS Power option for Power Distribution.",
        "price_modifier": 240.0,
        "weight": 1.4,
        "is_active": true
      },
      {
        "id": 58,
        "category_id": 14,
        "name": "Sensor Power Rail",
        "description": "Sensor Power Rail option for Power Distribution.",
        "price_modifier": 290.0,
        "weight": 1.6,
        "is_active": true
      }
    ]
  },
  {
    "id": 15,
    "name": "Protection",
    "group": "03 POWER SYSTEM",
    "step_order": 15,
    "is_multiple_allowed": true,
    "components": [
      {
        "id": 59,
        "category_id": 15,
        "name": "Fuse",
        "description": "Fuse option for Protection.",
        "price_modifier": 150.0,
        "weight": 1.0,
        "is_active": true
      },
      {
        "id": 60,
        "category_id": 15,
        "name": "Reverse Polarity Protection",
        "description": "Reverse Polarity Protection option for Protection.",
        "price_modifier": 200.0,
        "weight": 1.2,
        "is_active": true
      },
      {
        "id": 61,
        "category_id": 15,
        "name": "Over Current Protection",
        "description": "Over Current Protection option for Protection.",
        "price_modifier": 250.0,
        "weight": 1.4,
        "is_active": true
      },
      {
        "id": 62,
        "category_id": 15,
        "name": "Voltage Monitoring",
        "description": "Voltage Monitoring option for Protection.",
        "price_modifier": 300.0,
        "weight": 1.6,
        "is_active": true
      },
      {
        "id": 63,
        "category_id": 15,
        "name": "Current Monitoring",
        "description": "Current Monitoring option for Protection.",
        "price_modifier": 350.0,
        "weight": 1.8,
        "is_active": true
      }
    ]
  },
  {
    "id": 16,
    "name": "Microcontroller / SBC",
    "group": "04 CONTROLLER",
    "step_order": 16,
    "is_multiple_allowed": false,
    "components": [
      {
        "id": 64,
        "category_id": 16,
        "name": "ESP32",
        "description": "ESP32 option for Microcontroller / SBC.",
        "price_modifier": 160.0,
        "weight": 1.0,
        "is_active": true
      },
      {
        "id": 65,
        "category_id": 16,
        "name": "ESP32-S3",
        "description": "ESP32-S3 option for Microcontroller / SBC.",
        "price_modifier": 210.0,
        "weight": 1.2,
        "is_active": true
      },
      {
        "id": 66,
        "category_id": 16,
        "name": "Arduino",
        "description": "Arduino option for Microcontroller / SBC.",
        "price_modifier": 260.0,
        "weight": 1.4,
        "is_active": true
      },
      {
        "id": 67,
        "category_id": 16,
        "name": "Raspberry Pi",
        "description": "Raspberry Pi option for Microcontroller / SBC.",
        "price_modifier": 310.0,
        "weight": 1.6,
        "is_active": true
      },
      {
        "id": 68,
        "category_id": 16,
        "name": "Jetson / Edge Computer",
        "description": "Jetson / Edge Computer option for Microcontroller / SBC.",
        "price_modifier": 360.0,
        "weight": 1.8,
        "is_active": true
      },
      {
        "id": 69,
        "category_id": 16,
        "name": "Custom",
        "description": "Custom option for Microcontroller / SBC.",
        "price_modifier": 410.0,
        "weight": 2.0,
        "is_active": true
      }
    ]
  },
  {
    "id": 17,
    "name": "Processing Power",
    "group": "04 CONTROLLER",
    "step_order": 17,
    "is_multiple_allowed": false,
    "components": [
      {
        "id": 70,
        "category_id": 17,
        "name": "Basic",
        "description": "Basic option for Processing Power.",
        "price_modifier": 0.0,
        "weight": 1.0,
        "is_active": true
      },
      {
        "id": 71,
        "category_id": 17,
        "name": "Standard",
        "description": "Standard option for Processing Power.",
        "price_modifier": 0.0,
        "weight": 1.2,
        "is_active": true
      },
      {
        "id": 72,
        "category_id": 17,
        "name": "High Performance",
        "description": "High Performance option for Processing Power.",
        "price_modifier": 270.0,
        "weight": 1.4,
        "is_active": true
      }
    ]
  },
  {
    "id": 18,
    "name": "Extra Modules",
    "group": "04 CONTROLLER",
    "step_order": 18,
    "is_multiple_allowed": true,
    "components": [
      {
        "id": 73,
        "category_id": 18,
        "name": "IMU",
        "description": "IMU option for Extra Modules.",
        "price_modifier": 180.0,
        "weight": 1.0,
        "is_active": true
      },
      {
        "id": 74,
        "category_id": 18,
        "name": "Data Module",
        "description": "Data Module option for Extra Modules.",
        "price_modifier": 230.0,
        "weight": 1.2,
        "is_active": true
      },
      {
        "id": 75,
        "category_id": 18,
        "name": "Expansion Board",
        "description": "Expansion Board option for Extra Modules.",
        "price_modifier": 280.0,
        "weight": 1.4,
        "is_active": true
      }
    ]
  },
  {
    "id": 19,
    "name": "Primary Communication",
    "group": "05 COMMUNICATION",
    "step_order": 19,
    "is_multiple_allowed": false,
    "components": [
      {
        "id": 76,
        "category_id": 19,
        "name": "ELRS",
        "description": "ELRS option for Primary Communication.",
        "price_modifier": 190.0,
        "weight": 1.0,
        "is_active": true
      },
      {
        "id": 77,
        "category_id": 19,
        "name": "LoRa",
        "description": "LoRa option for Primary Communication.",
        "price_modifier": 240.0,
        "weight": 1.2,
        "is_active": true
      },
      {
        "id": 78,
        "category_id": 19,
        "name": "Wi-Fi",
        "description": "Wi-Fi option for Primary Communication.",
        "price_modifier": 290.0,
        "weight": 1.4,
        "is_active": true
      },
      {
        "id": 79,
        "category_id": 19,
        "name": "Bluetooth",
        "description": "Bluetooth option for Primary Communication.",
        "price_modifier": 340.0,
        "weight": 1.6,
        "is_active": true
      }
    ]
  },
  {
    "id": 20,
    "name": "Long Range Communication",
    "group": "05 COMMUNICATION",
    "step_order": 20,
    "is_multiple_allowed": true,
    "components": [
      {
        "id": 80,
        "category_id": 20,
        "name": "LoRa 433 MHz",
        "description": "LoRa 433 MHz option for Long Range Communication.",
        "price_modifier": 200.0,
        "weight": 1.0,
        "is_active": true
      },
      {
        "id": 81,
        "category_id": 20,
        "name": "LoRa 868 MHz",
        "description": "LoRa 868 MHz option for Long Range Communication.",
        "price_modifier": 250.0,
        "weight": 1.2,
        "is_active": true
      },
      {
        "id": 82,
        "category_id": 20,
        "name": "LoRa 915 MHz",
        "description": "LoRa 915 MHz option for Long Range Communication.",
        "price_modifier": 300.0,
        "weight": 1.4,
        "is_active": true
      },
      {
        "id": 83,
        "category_id": 20,
        "name": "4G / LTE",
        "description": "4G / LTE option for Long Range Communication.",
        "price_modifier": 350.0,
        "weight": 1.6,
        "is_active": true
      },
      {
        "id": 84,
        "category_id": 20,
        "name": "GSM",
        "description": "GSM option for Long Range Communication.",
        "price_modifier": 400.0,
        "weight": 1.8,
        "is_active": true
      },
      {
        "id": 85,
        "category_id": 20,
        "name": "Satellite (Optional)",
        "description": "Satellite (Optional) option for Long Range Communication.",
        "price_modifier": 450.0,
        "weight": 2.0,
        "is_active": true
      }
    ]
  },
  {
    "id": 21,
    "name": "Communication Mode",
    "group": "05 COMMUNICATION",
    "step_order": 21,
    "is_multiple_allowed": false,
    "components": [
      {
        "id": 86,
        "category_id": 21,
        "name": "Manual",
        "description": "Manual option for Communication Mode.",
        "price_modifier": 210.0,
        "weight": 1.0,
        "is_active": true
      },
      {
        "id": 87,
        "category_id": 21,
        "name": "Telemetry (Full Duplex)",
        "description": "Telemetry (Full Duplex) option for Communication Mode.",
        "price_modifier": 260.0,
        "weight": 1.2,
        "is_active": true
      },
      {
        "id": 88,
        "category_id": 21,
        "name": "Autonomous",
        "description": "Autonomous option for Communication Mode.",
        "price_modifier": 310.0,
        "weight": 1.4,
        "is_active": true
      },
      {
        "id": 89,
        "category_id": 21,
        "name": "Hybrid (Manual + Autonomous)",
        "description": "Hybrid (Manual + Autonomous) option for Communication Mode.",
        "price_modifier": 360.0,
        "weight": 1.6,
        "is_active": true
      }
    ]
  },
  {
    "id": 22,
    "name": "Navigation System",
    "group": "06 NAVIGATION",
    "step_order": 22,
    "is_multiple_allowed": false,
    "components": [
      {
        "id": 90,
        "category_id": 22,
        "name": "GPS",
        "description": "GPS option for Navigation System.",
        "price_modifier": 220.0,
        "weight": 1.0,
        "is_active": true
      },
      {
        "id": 91,
        "category_id": 22,
        "name": "GNSS",
        "description": "GNSS option for Navigation System.",
        "price_modifier": 270.0,
        "weight": 1.2,
        "is_active": true
      },
      {
        "id": 92,
        "category_id": 22,
        "name": "DGPS",
        "description": "DGPS option for Navigation System.",
        "price_modifier": 320.0,
        "weight": 1.4,
        "is_active": true
      },
      {
        "id": 93,
        "category_id": 22,
        "name": "RTK GPS",
        "description": "RTK GPS option for Navigation System.",
        "price_modifier": 370.0,
        "weight": 1.6,
        "is_active": true
      },
      {
        "id": 94,
        "category_id": 22,
        "name": "Dual Antenna GNSS",
        "description": "Dual Antenna GNSS option for Navigation System.",
        "price_modifier": 420.0,
        "weight": 1.8,
        "is_active": true
      }
    ]
  },
  {
    "id": 23,
    "name": "Navigation Sensors",
    "group": "06 NAVIGATION",
    "step_order": 23,
    "is_multiple_allowed": true,
    "components": [
      {
        "id": 95,
        "category_id": 23,
        "name": "Compass",
        "description": "Compass option for Navigation Sensors.",
        "price_modifier": 230.0,
        "weight": 1.0,
        "is_active": true
      },
      {
        "id": 96,
        "category_id": 23,
        "name": "IMU",
        "description": "IMU option for Navigation Sensors.",
        "price_modifier": 280.0,
        "weight": 1.2,
        "is_active": true
      },
      {
        "id": 97,
        "category_id": 23,
        "name": "Accelerometer",
        "description": "Accelerometer option for Navigation Sensors.",
        "price_modifier": 330.0,
        "weight": 1.4,
        "is_active": true
      },
      {
        "id": 98,
        "category_id": 23,
        "name": "Gyroscope",
        "description": "Gyroscope option for Navigation Sensors.",
        "price_modifier": 380.0,
        "weight": 1.6,
        "is_active": true
      },
      {
        "id": 99,
        "category_id": 23,
        "name": "Magnetometer",
        "description": "Magnetometer option for Navigation Sensors.",
        "price_modifier": 430.0,
        "weight": 1.8,
        "is_active": true
      },
      {
        "id": 100,
        "category_id": 23,
        "name": "Barometer",
        "description": "Barometer option for Navigation Sensors.",
        "price_modifier": 480.0,
        "weight": 2.0,
        "is_active": true
      }
    ]
  },
  {
    "id": 24,
    "name": "Navigation Mode",
    "group": "06 NAVIGATION",
    "step_order": 24,
    "is_multiple_allowed": false,
    "components": [
      {
        "id": 101,
        "category_id": 24,
        "name": "Basic",
        "description": "Basic option for Navigation Mode.",
        "price_modifier": 0.0,
        "weight": 1.0,
        "is_active": true
      },
      {
        "id": 102,
        "category_id": 24,
        "name": "Precision",
        "description": "Precision option for Navigation Mode.",
        "price_modifier": 290.0,
        "weight": 1.2,
        "is_active": true
      },
      {
        "id": 103,
        "category_id": 24,
        "name": "Autonomous",
        "description": "Autonomous option for Navigation Mode.",
        "price_modifier": 340.0,
        "weight": 1.4,
        "is_active": true
      }
    ]
  },
  {
    "id": 25,
    "name": "Water Quality Sensors",
    "group": "07 SENSORS",
    "step_order": 25,
    "is_multiple_allowed": true,
    "components": [
      {
        "id": 104,
        "category_id": 25,
        "name": "Temperature",
        "description": "Temperature option for Water Quality Sensors.",
        "price_modifier": 250.0,
        "weight": 1.0,
        "is_active": true
      },
      {
        "id": 105,
        "category_id": 25,
        "name": "pH",
        "description": "pH option for Water Quality Sensors.",
        "price_modifier": 300.0,
        "weight": 1.2,
        "is_active": true
      },
      {
        "id": 106,
        "category_id": 25,
        "name": "Turbidity",
        "description": "Turbidity option for Water Quality Sensors.",
        "price_modifier": 350.0,
        "weight": 1.4,
        "is_active": true
      },
      {
        "id": 107,
        "category_id": 25,
        "name": "TDS",
        "description": "TDS option for Water Quality Sensors.",
        "price_modifier": 400.0,
        "weight": 1.6,
        "is_active": true
      },
      {
        "id": 108,
        "category_id": 25,
        "name": "Conductivity",
        "description": "Conductivity option for Water Quality Sensors.",
        "price_modifier": 450.0,
        "weight": 1.8,
        "is_active": true
      },
      {
        "id": 109,
        "category_id": 25,
        "name": "Dissolved Oxygen",
        "description": "Dissolved Oxygen option for Water Quality Sensors.",
        "price_modifier": 500.0,
        "weight": 2.0,
        "is_active": true
      },
      {
        "id": 110,
        "category_id": 25,
        "name": "Salinity",
        "description": "Salinity option for Water Quality Sensors.",
        "price_modifier": 550.0,
        "weight": 2.2,
        "is_active": true
      },
      {
        "id": 111,
        "category_id": 25,
        "name": "ORP",
        "description": "ORP option for Water Quality Sensors.",
        "price_modifier": 600.0,
        "weight": 2.4000000000000004,
        "is_active": true
      }
    ]
  },
  {
    "id": 26,
    "name": "Environmental Sensors",
    "group": "07 SENSORS",
    "step_order": 26,
    "is_multiple_allowed": true,
    "components": [
      {
        "id": 112,
        "category_id": 26,
        "name": "Air Temperature",
        "description": "Air Temperature option for Environmental Sensors.",
        "price_modifier": 260.0,
        "weight": 1.0,
        "is_active": true
      },
      {
        "id": 113,
        "category_id": 26,
        "name": "Humidity",
        "description": "Humidity option for Environmental Sensors.",
        "price_modifier": 310.0,
        "weight": 1.2,
        "is_active": true
      },
      {
        "id": 114,
        "category_id": 26,
        "name": "Water Flow",
        "description": "Water Flow option for Environmental Sensors.",
        "price_modifier": 360.0,
        "weight": 1.4,
        "is_active": true
      },
      {
        "id": 115,
        "category_id": 26,
        "name": "Depth Sensor",
        "description": "Depth Sensor option for Environmental Sensors.",
        "price_modifier": 410.0,
        "weight": 1.6,
        "is_active": true
      },
      {
        "id": 116,
        "category_id": 26,
        "name": "Pressure Sensor",
        "description": "Pressure Sensor option for Environmental Sensors.",
        "price_modifier": 460.0,
        "weight": 1.8,
        "is_active": true
      },
      {
        "id": 117,
        "category_id": 26,
        "name": "Leak Detection",
        "description": "Leak Detection option for Environmental Sensors.",
        "price_modifier": 510.0,
        "weight": 2.0,
        "is_active": true
      }
    ]
  },
  {
    "id": 27,
    "name": "Sonar / Echosounder",
    "group": "08 BATHYMETRY",
    "step_order": 27,
    "is_multiple_allowed": false,
    "components": [
      {
        "id": 118,
        "category_id": 27,
        "name": "Basic Echosounder",
        "description": "Basic Echosounder option for Sonar / Echosounder.",
        "price_modifier": 0.0,
        "weight": 1.0,
        "is_active": true
      },
      {
        "id": 119,
        "category_id": 27,
        "name": "Single Beam Sonar",
        "description": "Single Beam Sonar option for Sonar / Echosounder.",
        "price_modifier": 320.0,
        "weight": 1.2,
        "is_active": true
      },
      {
        "id": 120,
        "category_id": 27,
        "name": "Dual Frequency Sonar",
        "description": "Dual Frequency Sonar option for Sonar / Echosounder.",
        "price_modifier": 370.0,
        "weight": 1.4,
        "is_active": true
      },
      {
        "id": 121,
        "category_id": 27,
        "name": "High Resolution Sonar",
        "description": "High Resolution Sonar option for Sonar / Echosounder.",
        "price_modifier": 420.0,
        "weight": 1.6,
        "is_active": true
      },
      {
        "id": 122,
        "category_id": 27,
        "name": "Multibeam Sonar",
        "description": "Multibeam Sonar option for Sonar / Echosounder.",
        "price_modifier": 470.0,
        "weight": 1.8,
        "is_active": true
      }
    ]
  },
  {
    "id": 28,
    "name": "Measurements",
    "group": "08 BATHYMETRY",
    "step_order": 28,
    "is_multiple_allowed": true,
    "components": [
      {
        "id": 123,
        "category_id": 28,
        "name": "Depth",
        "description": "Depth option for Measurements.",
        "price_modifier": 280.0,
        "weight": 1.0,
        "is_active": true
      },
      {
        "id": 124,
        "category_id": 28,
        "name": "Bottom Profile",
        "description": "Bottom Profile option for Measurements.",
        "price_modifier": 330.0,
        "weight": 1.2,
        "is_active": true
      },
      {
        "id": 125,
        "category_id": 28,
        "name": "Water Temperature",
        "description": "Water Temperature option for Measurements.",
        "price_modifier": 380.0,
        "weight": 1.4,
        "is_active": true
      },
      {
        "id": 126,
        "category_id": 28,
        "name": "GPS Position",
        "description": "GPS Position option for Measurements.",
        "price_modifier": 430.0,
        "weight": 1.6,
        "is_active": true
      },
      {
        "id": 127,
        "category_id": 28,
        "name": "Depth + GPS Mapping",
        "description": "Depth + GPS Mapping option for Measurements.",
        "price_modifier": 480.0,
        "weight": 1.8,
        "is_active": true
      }
    ]
  },
  {
    "id": 29,
    "name": "Includes",
    "group": "08 BATHYMETRY",
    "step_order": 29,
    "is_multiple_allowed": true,
    "components": [
      {
        "id": 128,
        "category_id": 29,
        "name": "Echosounder",
        "description": "Echosounder option for Includes.",
        "price_modifier": 290.0,
        "weight": 1.0,
        "is_active": true
      },
      {
        "id": 129,
        "category_id": 29,
        "name": "GPS",
        "description": "GPS option for Includes.",
        "price_modifier": 340.0,
        "weight": 1.2,
        "is_active": true
      },
      {
        "id": 130,
        "category_id": 29,
        "name": "Data Logging",
        "description": "Data Logging option for Includes.",
        "price_modifier": 390.0,
        "weight": 1.4,
        "is_active": true
      },
      {
        "id": 131,
        "category_id": 29,
        "name": "Mapping Software",
        "description": "Mapping Software option for Includes.",
        "price_modifier": 440.0,
        "weight": 1.6,
        "is_active": true
      },
      {
        "id": 132,
        "category_id": 29,
        "name": "Depth Visualization",
        "description": "Depth Visualization option for Includes.",
        "price_modifier": 490.0,
        "weight": 1.8,
        "is_active": true
      }
    ]
  },
  {
    "id": 30,
    "name": "Camera",
    "group": "09 VISION & LIGHTING",
    "step_order": 30,
    "is_multiple_allowed": false,
    "components": [
      {
        "id": 133,
        "category_id": 30,
        "name": "No Camera",
        "description": "No Camera option for Camera.",
        "price_modifier": 0.0,
        "weight": 1.0,
        "is_active": true
      },
      {
        "id": 134,
        "category_id": 30,
        "name": "Front Camera",
        "description": "Front Camera option for Camera.",
        "price_modifier": 350.0,
        "weight": 1.2,
        "is_active": true
      },
      {
        "id": 135,
        "category_id": 30,
        "name": "Rear Camera",
        "description": "Rear Camera option for Camera.",
        "price_modifier": 400.0,
        "weight": 1.4,
        "is_active": true
      },
      {
        "id": 136,
        "category_id": 30,
        "name": "Underwater Camera",
        "description": "Underwater Camera option for Camera.",
        "price_modifier": 450.0,
        "weight": 1.6,
        "is_active": true
      },
      {
        "id": 137,
        "category_id": 30,
        "name": "360\u00b0 Camera",
        "description": "360\u00b0 Camera option for Camera.",
        "price_modifier": 500.0,
        "weight": 1.8,
        "is_active": true
      }
    ]
  },
  {
    "id": 31,
    "name": "Resolution",
    "group": "09 VISION & LIGHTING",
    "step_order": 31,
    "is_multiple_allowed": false,
    "components": [
      {
        "id": 138,
        "category_id": 31,
        "name": "720p",
        "description": "720p option for Resolution.",
        "price_modifier": 310.0,
        "weight": 1.0,
        "is_active": true
      },
      {
        "id": 139,
        "category_id": 31,
        "name": "1080p",
        "description": "1080p option for Resolution.",
        "price_modifier": 360.0,
        "weight": 1.2,
        "is_active": true
      },
      {
        "id": 140,
        "category_id": 31,
        "name": "4K",
        "description": "4K option for Resolution.",
        "price_modifier": 410.0,
        "weight": 1.4,
        "is_active": true
      }
    ]
  },
  {
    "id": 32,
    "name": "Features",
    "group": "09 VISION & LIGHTING",
    "step_order": 32,
    "is_multiple_allowed": true,
    "components": [
      {
        "id": 141,
        "category_id": 32,
        "name": "Live Streaming",
        "description": "Live Streaming option for Features.",
        "price_modifier": 320.0,
        "weight": 1.0,
        "is_active": true
      },
      {
        "id": 142,
        "category_id": 32,
        "name": "Recording",
        "description": "Recording option for Features.",
        "price_modifier": 370.0,
        "weight": 1.2,
        "is_active": true
      },
      {
        "id": 143,
        "category_id": 32,
        "name": "Image Capture",
        "description": "Image Capture option for Features.",
        "price_modifier": 420.0,
        "weight": 1.4,
        "is_active": true
      },
      {
        "id": 144,
        "category_id": 32,
        "name": "Night Vision",
        "description": "Night Vision option for Features.",
        "price_modifier": 470.0,
        "weight": 1.6,
        "is_active": true
      },
      {
        "id": 145,
        "category_id": 32,
        "name": "Low Light Camera",
        "description": "Low Light Camera option for Features.",
        "price_modifier": 520.0,
        "weight": 1.8,
        "is_active": true
      },
      {
        "id": 146,
        "category_id": 32,
        "name": "GPS + Timestamp Overlay",
        "description": "GPS + Timestamp Overlay option for Features.",
        "price_modifier": 570.0,
        "weight": 2.0,
        "is_active": true
      }
    ]
  },
  {
    "id": 33,
    "name": "Lighting",
    "group": "09 VISION & LIGHTING",
    "step_order": 33,
    "is_multiple_allowed": false,
    "components": [
      {
        "id": 147,
        "category_id": 33,
        "name": "No Lighting",
        "description": "No Lighting option for Lighting.",
        "price_modifier": 0.0,
        "weight": 1.0,
        "is_active": true
      },
      {
        "id": 148,
        "category_id": 33,
        "name": "Front LED",
        "description": "Front LED option for Lighting.",
        "price_modifier": 380.0,
        "weight": 1.2,
        "is_active": true
      },
      {
        "id": 149,
        "category_id": 33,
        "name": "Underwater LED",
        "description": "Underwater LED option for Lighting.",
        "price_modifier": 430.0,
        "weight": 1.4,
        "is_active": true
      },
      {
        "id": 150,
        "category_id": 33,
        "name": "High Power Flood Light",
        "description": "High Power Flood Light option for Lighting.",
        "price_modifier": 480.0,
        "weight": 1.6,
        "is_active": true
      },
      {
        "id": 151,
        "category_id": 33,
        "name": "Adjustable Brightness",
        "description": "Adjustable Brightness option for Lighting.",
        "price_modifier": 530.0,
        "weight": 1.8,
        "is_active": true
      }
    ]
  },
  {
    "id": 34,
    "name": "Light Control",
    "group": "09 VISION & LIGHTING",
    "step_order": 34,
    "is_multiple_allowed": false,
    "components": [
      {
        "id": 152,
        "category_id": 34,
        "name": "Always ON",
        "description": "Always ON option for Light Control.",
        "price_modifier": 340.0,
        "weight": 1.0,
        "is_active": true
      },
      {
        "id": 153,
        "category_id": 34,
        "name": "Remote Controlled",
        "description": "Remote Controlled option for Light Control.",
        "price_modifier": 390.0,
        "weight": 1.2,
        "is_active": true
      },
      {
        "id": 154,
        "category_id": 34,
        "name": "Auto (Depth Based)",
        "description": "Auto (Depth Based) option for Light Control.",
        "price_modifier": 440.0,
        "weight": 1.4,
        "is_active": true
      },
      {
        "id": 155,
        "category_id": 34,
        "name": "Auto (Ambient Light Based)",
        "description": "Auto (Ambient Light Based) option for Light Control.",
        "price_modifier": 490.0,
        "weight": 1.6,
        "is_active": true
      }
    ]
  },
  {
    "id": 35,
    "name": "Autonomy Level",
    "group": "10 AUTONOMY",
    "step_order": 35,
    "is_multiple_allowed": false,
    "components": [
      {
        "id": 156,
        "category_id": 35,
        "name": "Level 0 - Manual",
        "description": "Level 0 - Manual option for Autonomy Level.",
        "price_modifier": 350.0,
        "weight": 1.0,
        "is_active": true
      },
      {
        "id": 157,
        "category_id": 35,
        "name": "Level 1 - Assisted",
        "description": "Level 1 - Assisted option for Autonomy Level.",
        "price_modifier": 400.0,
        "weight": 1.2,
        "is_active": true
      },
      {
        "id": 158,
        "category_id": 35,
        "name": "Level 2 - Waypoints",
        "description": "Level 2 - Waypoints option for Autonomy Level.",
        "price_modifier": 450.0,
        "weight": 1.4,
        "is_active": true
      },
      {
        "id": 159,
        "category_id": 35,
        "name": "Level 3 - Mission Mode",
        "description": "Level 3 - Mission Mode option for Autonomy Level.",
        "price_modifier": 500.0,
        "weight": 1.6,
        "is_active": true
      },
      {
        "id": 160,
        "category_id": 35,
        "name": "Level 4 - Autonomous Survey",
        "description": "Level 4 - Autonomous Survey option for Autonomy Level.",
        "price_modifier": 550.0,
        "weight": 1.8,
        "is_active": true
      }
    ]
  },
  {
    "id": 36,
    "name": "Mission Features",
    "group": "10 AUTONOMY",
    "step_order": 36,
    "is_multiple_allowed": true,
    "components": [
      {
        "id": 161,
        "category_id": 36,
        "name": "Waypoint Navigation",
        "description": "Waypoint Navigation option for Mission Features.",
        "price_modifier": 360.0,
        "weight": 1.0,
        "is_active": true
      },
      {
        "id": 162,
        "category_id": 36,
        "name": "Area Survey",
        "description": "Area Survey option for Mission Features.",
        "price_modifier": 410.0,
        "weight": 1.2,
        "is_active": true
      },
      {
        "id": 163,
        "category_id": 36,
        "name": "Grid Survey",
        "description": "Grid Survey option for Mission Features.",
        "price_modifier": 460.0,
        "weight": 1.4,
        "is_active": true
      },
      {
        "id": 164,
        "category_id": 36,
        "name": "Follow Path",
        "description": "Follow Path option for Mission Features.",
        "price_modifier": 510.0,
        "weight": 1.6,
        "is_active": true
      },
      {
        "id": 165,
        "category_id": 36,
        "name": "Return to Home",
        "description": "Return to Home option for Mission Features.",
        "price_modifier": 560.0,
        "weight": 1.8,
        "is_active": true
      },
      {
        "id": 166,
        "category_id": 36,
        "name": "Station Keeping",
        "description": "Station Keeping option for Mission Features.",
        "price_modifier": 610.0,
        "weight": 2.0,
        "is_active": true
      }
    ]
  },
  {
    "id": 37,
    "name": "Communication Loss",
    "group": "11 SAFETY & FAILSAFE",
    "step_order": 37,
    "is_multiple_allowed": false,
    "components": [
      {
        "id": 167,
        "category_id": 37,
        "name": "Stop Motors",
        "description": "Stop Motors option for Communication Loss.",
        "price_modifier": 370.0,
        "weight": 1.0,
        "is_active": true
      },
      {
        "id": 168,
        "category_id": 37,
        "name": "Hold Position",
        "description": "Hold Position option for Communication Loss.",
        "price_modifier": 420.0,
        "weight": 1.2,
        "is_active": true
      },
      {
        "id": 169,
        "category_id": 37,
        "name": "Return Home",
        "description": "Return Home option for Communication Loss.",
        "price_modifier": 470.0,
        "weight": 1.4,
        "is_active": true
      },
      {
        "id": 170,
        "category_id": 37,
        "name": "Surface / Float",
        "description": "Surface / Float option for Communication Loss.",
        "price_modifier": 520.0,
        "weight": 1.6,
        "is_active": true
      },
      {
        "id": 171,
        "category_id": 37,
        "name": "Emergency Shutdown",
        "description": "Emergency Shutdown option for Communication Loss.",
        "price_modifier": 570.0,
        "weight": 1.8,
        "is_active": true
      }
    ]
  },
  {
    "id": 38,
    "name": "Low Battery",
    "group": "11 SAFETY & FAILSAFE",
    "step_order": 38,
    "is_multiple_allowed": false,
    "components": [
      {
        "id": 172,
        "category_id": 38,
        "name": "Warning",
        "description": "Warning option for Low Battery.",
        "price_modifier": 380.0,
        "weight": 1.0,
        "is_active": true
      },
      {
        "id": 173,
        "category_id": 38,
        "name": "Reduce Motor Power",
        "description": "Reduce Motor Power option for Low Battery.",
        "price_modifier": 430.0,
        "weight": 1.2,
        "is_active": true
      },
      {
        "id": 174,
        "category_id": 38,
        "name": "Return Home",
        "description": "Return Home option for Low Battery.",
        "price_modifier": 480.0,
        "weight": 1.4,
        "is_active": true
      },
      {
        "id": 175,
        "category_id": 38,
        "name": "Emergency Shutdown",
        "description": "Emergency Shutdown option for Low Battery.",
        "price_modifier": 530.0,
        "weight": 1.6,
        "is_active": true
      }
    ]
  },
  {
    "id": 39,
    "name": "GPS Loss",
    "group": "11 SAFETY & FAILSAFE",
    "step_order": 39,
    "is_multiple_allowed": false,
    "components": [
      {
        "id": 1751,
        "category_id": 39,
        "name": "Warning",
        "description": "Warning option for GPS Loss.",
        "price_modifier": 350.0,
        "weight": 0.8,
        "is_active": true
      },
      {
        "id": 176,
        "category_id": 39,
        "name": "Hold Position",
        "description": "Hold Position option for GPS Loss.",
        "price_modifier": 390.0,
        "weight": 1.0,
        "is_active": true
      },
      {
        "id": 177,
        "category_id": 39,
        "name": "Manual Mode",
        "description": "Manual Mode option for GPS Loss.",
        "price_modifier": 440.0,
        "weight": 1.2,
        "is_active": true
      },
      {
        "id": 178,
        "category_id": 39,
        "name": "Stop",
        "description": "Stop option for GPS Loss.",
        "price_modifier": 490.0,
        "weight": 1.4,
        "is_active": true
      }
    ]
  },
  {
    "id": 40,
    "name": "Over Temperature",
    "group": "11 SAFETY & FAILSAFE",
    "step_order": 40,
    "is_multiple_allowed": false,
    "components": [
      {
        "id": 179,
        "category_id": 40,
        "name": "Warning",
        "description": "Warning option for Over Temperature.",
        "price_modifier": 400.0,
        "weight": 1.0,
        "is_active": true
      },
      {
        "id": 180,
        "category_id": 40,
        "name": "Reduce Power",
        "description": "Reduce Power option for Over Temperature.",
        "price_modifier": 450.0,
        "weight": 1.2,
        "is_active": true
      },
      {
        "id": 181,
        "category_id": 40,
        "name": "Shutdown",
        "description": "Shutdown option for Over Temperature.",
        "price_modifier": 500.0,
        "weight": 1.4,
        "is_active": true
      }
    ]
  },
  {
    "id": 41,
    "name": "Water Leakage",
    "group": "11 SAFETY & FAILSAFE",
    "step_order": 41,
    "is_multiple_allowed": false,
    "components": [
      {
        "id": 182,
        "category_id": 41,
        "name": "Warning",
        "description": "Warning option for Water Leakage.",
        "price_modifier": 410.0,
        "weight": 1.0,
        "is_active": true
      },
      {
        "id": 183,
        "category_id": 41,
        "name": "Stop Motors",
        "description": "Stop Motors option for Water Leakage.",
        "price_modifier": 460.0,
        "weight": 1.2,
        "is_active": true
      },
      {
        "id": 184,
        "category_id": 41,
        "name": "Return / Abort Mission",
        "description": "Return / Abort Mission option for Water Leakage.",
        "price_modifier": 510.0,
        "weight": 1.4,
        "is_active": true
      }
    ]
  },
  {
    "id": 42,
    "name": "Storage",
    "group": "12 DATA & LOGGING",
    "step_order": 42,
    "is_multiple_allowed": false,
    "components": [
      {
        "id": 185,
        "category_id": 42,
        "name": "No Storage",
        "description": "No Storage option for Storage.",
        "price_modifier": 0.0,
        "weight": 1.0,
        "is_active": true
      },
      {
        "id": 186,
        "category_id": 42,
        "name": "MicroSD Card",
        "description": "MicroSD Card option for Storage.",
        "price_modifier": 470.0,
        "weight": 1.2,
        "is_active": true
      },
      {
        "id": 187,
        "category_id": 42,
        "name": "Internal Storage",
        "description": "Internal Storage option for Storage.",
        "price_modifier": 520.0,
        "weight": 1.4,
        "is_active": true
      },
      {
        "id": 188,
        "category_id": 42,
        "name": "Cloud Storage",
        "description": "Cloud Storage option for Storage.",
        "price_modifier": 570.0,
        "weight": 1.6,
        "is_active": true
      }
    ]
  },
  {
    "id": 43,
    "name": "Data Recorded",
    "group": "12 DATA & LOGGING",
    "step_order": 43,
    "is_multiple_allowed": true,
    "components": [
      {
        "id": 189,
        "category_id": 43,
        "name": "GPS",
        "description": "GPS option for Data Recorded.",
        "price_modifier": 430.0,
        "weight": 1.0,
        "is_active": true
      },
      {
        "id": 190,
        "category_id": 43,
        "name": "Depth",
        "description": "Depth option for Data Recorded.",
        "price_modifier": 480.0,
        "weight": 1.2,
        "is_active": true
      },
      {
        "id": 191,
        "category_id": 43,
        "name": "Temperature",
        "description": "Temperature option for Data Recorded.",
        "price_modifier": 530.0,
        "weight": 1.4,
        "is_active": true
      },
      {
        "id": 192,
        "category_id": 43,
        "name": "Battery Voltage",
        "description": "Battery Voltage option for Data Recorded.",
        "price_modifier": 580.0,
        "weight": 1.6,
        "is_active": true
      },
      {
        "id": 193,
        "category_id": 43,
        "name": "Battery Current",
        "description": "Battery Current option for Data Recorded.",
        "price_modifier": 630.0,
        "weight": 1.8,
        "is_active": true
      },
      {
        "id": 194,
        "category_id": 43,
        "name": "Motor RPM",
        "description": "Motor RPM option for Data Recorded.",
        "price_modifier": 680.0,
        "weight": 2.0,
        "is_active": true
      },
      {
        "id": 195,
        "category_id": 43,
        "name": "Sensor Readings",
        "description": "Sensor Readings option for Data Recorded.",
        "price_modifier": 730.0,
        "weight": 2.2,
        "is_active": true
      },
      {
        "id": 196,
        "category_id": 43,
        "name": "Mission Path",
        "description": "Mission Path option for Data Recorded.",
        "price_modifier": 780.0,
        "weight": 2.4000000000000004,
        "is_active": true
      }
    ]
  },
  {
    "id": 44,
    "name": "Export Format",
    "group": "12 DATA & LOGGING",
    "step_order": 44,
    "is_multiple_allowed": true,
    "components": [
      {
        "id": 197,
        "category_id": 44,
        "name": "CSV",
        "description": "CSV option for Export Format.",
        "price_modifier": 440.0,
        "weight": 1.0,
        "is_active": true
      },
      {
        "id": 198,
        "category_id": 44,
        "name": "Excel",
        "description": "Excel option for Export Format.",
        "price_modifier": 490.0,
        "weight": 1.2,
        "is_active": true
      },
      {
        "id": 199,
        "category_id": 44,
        "name": "KML",
        "description": "KML option for Export Format.",
        "price_modifier": 540.0,
        "weight": 1.4,
        "is_active": true
      },
      {
        "id": 200,
        "category_id": 44,
        "name": "GPX",
        "description": "GPX option for Export Format.",
        "price_modifier": 590.0,
        "weight": 1.6,
        "is_active": true
      },
      {
        "id": 201,
        "category_id": 44,
        "name": "GeoJSON",
        "description": "GeoJSON option for Export Format.",
        "price_modifier": 640.0,
        "weight": 1.8,
        "is_active": true
      }
    ]
  },
  {
    "id": 45,
    "name": "Dashboard Level",
    "group": "13 DASHBOARD & APP",
    "step_order": 45,
    "is_multiple_allowed": false,
    "components": [
      {
        "id": 202,
        "category_id": 45,
        "name": "Basic",
        "description": "Basic option for Dashboard Level.",
        "price_modifier": 0.0,
        "weight": 1.0,
        "is_active": true
      },
      {
        "id": 203,
        "category_id": 45,
        "name": "Advanced",
        "description": "Advanced option for Dashboard Level.",
        "price_modifier": 500.0,
        "weight": 1.2,
        "is_active": true
      },
      {
        "id": 204,
        "category_id": 45,
        "name": "Professional",
        "description": "Professional option for Dashboard Level.",
        "price_modifier": 550.0,
        "weight": 1.4,
        "is_active": true
      }
    ]
  },
  {
    "id": 46,
    "name": "Platform",
    "group": "13 DASHBOARD & APP",
    "step_order": 46,
    "is_multiple_allowed": true,
    "components": [
      {
        "id": 205,
        "category_id": 46,
        "name": "Mobile App (Android)",
        "description": "Mobile App (Android) option for Platform.",
        "price_modifier": 460.0,
        "weight": 1.0,
        "is_active": true
      },
      {
        "id": 206,
        "category_id": 46,
        "name": "Mobile App (iOS)",
        "description": "Mobile App (iOS) option for Platform.",
        "price_modifier": 510.0,
        "weight": 1.2,
        "is_active": true
      },
      {
        "id": 207,
        "category_id": 46,
        "name": "Web Dashboard",
        "description": "Web Dashboard option for Platform.",
        "price_modifier": 560.0,
        "weight": 1.4,
        "is_active": true
      }
    ]
  },
  {
    "id": 47,
    "name": "Add-on Modules",
    "group": "14 CUSTOM & ADD ON",
    "step_order": 47,
    "is_multiple_allowed": true,
    "components": [
      {
        "id": 208,
        "category_id": 47,
        "name": "Water Sampling Module",
        "description": "Water Sampling Module option for Add-on Modules.",
        "price_modifier": 470.0,
        "weight": 1.0,
        "is_active": true
      },
      {
        "id": 209,
        "category_id": 47,
        "name": "Payload Dropper",
        "description": "Payload Dropper option for Add-on Modules.",
        "price_modifier": 520.0,
        "weight": 1.2,
        "is_active": true
      },
      {
        "id": 210,
        "category_id": 47,
        "name": "Robotic Arm",
        "description": "Robotic Arm option for Add-on Modules.",
        "price_modifier": 570.0,
        "weight": 1.4,
        "is_active": true
      },
      {
        "id": 211,
        "category_id": 47,
        "name": "Sample Collector",
        "description": "Sample Collector option for Add-on Modules.",
        "price_modifier": 620.0,
        "weight": 1.6,
        "is_active": true
      },
      {
        "id": 212,
        "category_id": 47,
        "name": "Anti-Collision System",
        "description": "Anti-Collision System option for Add-on Modules.",
        "price_modifier": 670.0,
        "weight": 1.8,
        "is_active": true
      },
      {
        "id": 213,
        "category_id": 47,
        "name": "AI / Object Detection",
        "description": "AI / Object Detection option for Add-on Modules.",
        "price_modifier": 720.0,
        "weight": 2.0,
        "is_active": true
      }
    ]
  }
];

export const DEFAULT_CONSTRAINTS = [
  { id: 1, component_id: 17, incompatible_component_id: 60 },
  { id: 2, component_id: 30, incompatible_component_id: 60 }
];
