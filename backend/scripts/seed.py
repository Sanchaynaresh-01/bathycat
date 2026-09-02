import sys
import os

# Add the root backend directory to sys.path so we can import app
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy.orm import Session
from app.core.database import SessionLocal, engine
from app.models.user import User
from app.models.product import Product
from app.models.component import ComponentCategory, Component
from app.core.security import get_password_hash

def seed_data(db: Session):
    # 1. Create Admin User
    admin_email = "admin@bathycat.com"
    existing_admin = db.query(User).filter(User.email == admin_email).first()
    if not existing_admin:
        admin_user = User(
            email=admin_email,
            hashed_password=get_password_hash("admin123"),
            full_name="Admin User",
            is_active=True,
            role="Admin"
        )
        db.add(admin_user)
        print("Created admin user: admin@bathycat.com / admin123")

    # 2. Create Products
    products = [
        {"name": "Bathycat Custom Build", "description": "Configure your own Bathycat from the ground up according to your specific needs.", "base_price": 5000.0, "is_active": True},
    ]
    
    for prod_data in products:
        existing = db.query(Product).filter(Product.name == prod_data["name"]).first()
        if not existing:
            db.add(Product(**prod_data))
    
    db.commit()

    # Clear old categories/components for clean seed (optional but good for this massive update)
    db.query(Component).delete()
    db.query(ComponentCategory).delete()
    db.commit()

    # 3. Massive Data Seed based on Image
    advanced_options = [
        {"group": "01 PLATFORM", "name": "Hull Type", "multiple": False, "items": ["Standard Hull", "Extended Hull", "Heavy Duty Hull", "Custom Hull"]},
        {"group": "01 PLATFORM", "name": "Payload Capacity", "multiple": False, "items": ["Light (Up to 2 kg)", "Medium (2-5 kg)", "Heavy (5+ kg)"]},
        {"group": "01 PLATFORM", "name": "Mounting Options", "multiple": True, "items": ["Front Mount", "Bottom Mount", "Rear Mount", "Top Mount", "Universal Rail"]},
        
        {"group": "02 PROPULSION", "name": "Motor (KV)", "multiple": False, "items": ["850 KV", "1000 KV", "1500 KV", "Custom KV"]},
        {"group": "02 PROPULSION", "name": "Number of Thrusters", "multiple": False, "items": ["1", "2", "4", "6"]},
        {"group": "02 PROPULSION", "name": "Thruster Configuration", "multiple": False, "items": ["Dual Thrust", "Differential Thrust", "Vector Thrust", "Independent Control"]},
        {"group": "02 PROPULSION", "name": "ESC", "multiple": False, "items": ["Standard ESC", "Waterproof ESC", "Smart ESC (Telemetry)"]},
        {"group": "02 PROPULSION", "name": "ESC Current Rating", "multiple": False, "items": ["20A", "30A", "40A", "60A+"]},
        
        {"group": "03 POWER SYSTEM", "name": "Battery Voltage (S)", "multiple": False, "items": ["2S (7.4V)", "3S (11.1V)", "4S (14.8V)", "Custom"]},
        {"group": "03 POWER SYSTEM", "name": "Battery Capacity (mAh)", "multiple": False, "items": ["4000", "8000", "12000", "16000", "Custom"]},
        {"group": "03 POWER SYSTEM", "name": "Battery Configuration", "multiple": False, "items": ["1P", "2P", "3P", "4P"]},
        {"group": "03 POWER SYSTEM", "name": "Battery Protection (BMS)", "multiple": True, "items": ["Balancing", "Over Current Protection", "Over Temperature Protection", "Low Voltage Cutoff"]},
        {"group": "03 POWER SYSTEM", "name": "Solar Panel", "multiple": False, "items": ["No Solar", "20W", "40W", "55W", "100W", "Custom"]},
        {"group": "03 POWER SYSTEM", "name": "Power Distribution", "multiple": True, "items": ["Separate Motor Power", "Separate Electronics Power", "Isolated GPS Power", "Sensor Power Rail"]},
        {"group": "03 POWER SYSTEM", "name": "Protection", "multiple": True, "items": ["Fuse", "Reverse Polarity Protection", "Over Current Protection", "Voltage Monitoring", "Current Monitoring"]},
        
        {"group": "04 CONTROLLER", "name": "Microcontroller / SBC", "multiple": False, "items": ["ESP32", "ESP32-S3", "Arduino", "Raspberry Pi", "Jetson / Edge Computer", "Custom"]},
        {"group": "04 CONTROLLER", "name": "Processing Power", "multiple": False, "items": ["Basic", "Standard", "High Performance"]},
        {"group": "04 CONTROLLER", "name": "Extra Modules", "multiple": True, "items": ["IMU", "Data Module", "Expansion Board"]},
        
        {"group": "05 COMMUNICATION", "name": "Primary Communication", "multiple": False, "items": ["ELRS", "LoRa", "Wi-Fi", "Bluetooth"]},
        {"group": "05 COMMUNICATION", "name": "Long Range Communication", "multiple": True, "items": ["LoRa 433 MHz", "LoRa 868 MHz", "LoRa 915 MHz", "4G / LTE", "GSM", "Satellite (Optional)"]},
        {"group": "05 COMMUNICATION", "name": "Communication Mode", "multiple": False, "items": ["Manual", "Telemetry (Full Duplex)", "Autonomous", "Hybrid (Manual + Autonomous)"]},
        
        {"group": "06 NAVIGATION", "name": "Navigation System", "multiple": False, "items": ["GPS", "GNSS", "DGPS", "RTK GPS", "Dual Antenna GNSS"]},
        {"group": "06 NAVIGATION", "name": "Navigation Sensors", "multiple": True, "items": ["Compass", "IMU", "Accelerometer", "Gyroscope", "Magnetometer", "Barometer"]},
        {"group": "06 NAVIGATION", "name": "Navigation Mode", "multiple": False, "items": ["Basic", "Precision", "Autonomous"]},
        
        {"group": "07 SENSORS", "name": "Water Quality Sensors", "multiple": True, "items": ["Temperature", "pH", "Turbidity", "TDS", "Conductivity", "Dissolved Oxygen", "Salinity", "ORP"]},
        {"group": "07 SENSORS", "name": "Environmental Sensors", "multiple": True, "items": ["Air Temperature", "Humidity", "Water Flow", "Depth Sensor", "Pressure Sensor", "Leak Detection"]},
        
        {"group": "08 BATHYMETRY", "name": "Sonar / Echosounder", "multiple": False, "items": ["Basic Echosounder", "Single Beam Sonar", "Dual Frequency Sonar", "High Resolution Sonar", "Multibeam Sonar"]},
        {"group": "08 BATHYMETRY", "name": "Measurements", "multiple": True, "items": ["Depth", "Bottom Profile", "Water Temperature", "GPS Position", "Depth + GPS Mapping"]},
        {"group": "08 BATHYMETRY", "name": "Includes", "multiple": True, "items": ["Echosounder", "GPS", "Data Logging", "Mapping Software", "Depth Visualization"]},
        
        {"group": "09 VISION & LIGHTING", "name": "Camera", "multiple": False, "items": ["No Camera", "Front Camera", "Rear Camera", "Underwater Camera", "360° Camera"]},
        {"group": "09 VISION & LIGHTING", "name": "Resolution", "multiple": False, "items": ["720p", "1080p", "4K"]},
        {"group": "09 VISION & LIGHTING", "name": "Features", "multiple": True, "items": ["Live Streaming", "Recording", "Image Capture", "Night Vision", "Low Light Camera", "GPS + Timestamp Overlay"]},
        {"group": "09 VISION & LIGHTING", "name": "Lighting", "multiple": False, "items": ["No Lighting", "Front LED", "Underwater LED", "High Power Flood Light", "Adjustable Brightness"]},
        {"group": "09 VISION & LIGHTING", "name": "Light Control", "multiple": False, "items": ["Always ON", "Remote Controlled", "Auto (Depth Based)", "Auto (Ambient Light Based)"]},
        
        {"group": "10 AUTONOMY", "name": "Autonomy Level", "multiple": False, "items": ["Level 0 - Manual", "Level 1 - Assisted", "Level 2 - Waypoints", "Level 3 - Mission Mode", "Level 4 - Autonomous Survey"]},
        {"group": "10 AUTONOMY", "name": "Mission Features", "multiple": True, "items": ["Waypoint Navigation", "Area Survey", "Grid Survey", "Follow Path", "Return to Home", "Station Keeping"]},
        
        {"group": "11 SAFETY & FAILSAFE", "name": "Communication Loss", "multiple": False, "items": ["Stop Motors", "Hold Position", "Return Home", "Surface / Float", "Emergency Shutdown"]},
        {"group": "11 SAFETY & FAILSAFE", "name": "Low Battery", "multiple": False, "items": ["Warning", "Reduce Motor Power", "Return Home", "Emergency Shutdown"]},
        {"group": "11 SAFETY & FAILSAFE", "name": "GPS Loss", "multiple": False, "items": ["Hold Position", "Manual Mode", "Stop"]},
        {"group": "11 SAFETY & FAILSAFE", "name": "Over Temperature", "multiple": False, "items": ["Warning", "Reduce Power", "Shutdown"]},
        {"group": "11 SAFETY & FAILSAFE", "name": "Water Leakage", "multiple": False, "items": ["Warning", "Stop Motors", "Return / Abort Mission"]},
        
        {"group": "12 DATA & LOGGING", "name": "Storage", "multiple": False, "items": ["No Storage", "MicroSD Card", "Internal Storage", "Cloud Storage"]},
        {"group": "12 DATA & LOGGING", "name": "Data Recorded", "multiple": True, "items": ["GPS", "Depth", "Temperature", "Battery Voltage", "Battery Current", "Motor RPM", "Sensor Readings", "Mission Path"]},
        {"group": "12 DATA & LOGGING", "name": "Export Format", "multiple": True, "items": ["CSV", "Excel", "KML", "GPX", "GeoJSON"]},
        
        {"group": "13 DASHBOARD & APP", "name": "Dashboard Level", "multiple": False, "items": ["Basic", "Advanced", "Professional"]},
        {"group": "13 DASHBOARD & APP", "name": "Platform", "multiple": True, "items": ["Mobile App (Android)", "Mobile App (iOS)", "Web Dashboard"]},
        
        {"group": "14 CUSTOM & ADD ON", "name": "Add-on Modules", "multiple": True, "items": ["Water Sampling Module", "Payload Dropper", "Robotic Arm", "Sample Collector", "Anti-Collision System", "AI / Object Detection"]}
    ]

    step = 1
    for opt in advanced_options:
        cat = ComponentCategory(
            name=f"{opt['name']}",
            group=opt["group"],
            step_order=step,
            is_multiple_allowed=opt["multiple"]
        )
        db.add(cat)
        db.flush() # To get cat.id
        
        # We add dummy prices based on item index just to make the UI interesting.
        price_base = step * 10
        
        for idx, item_name in enumerate(opt["items"]):
            # Add some pricing logic just for demonstration. 
            # In a real app, this would be accurately set per item.
            modifier = 0.0
            if "No" in item_name or "Basic" in item_name or "Standard" in item_name:
                modifier = 0.0
            else:
                modifier = float(price_base + (idx * 50))
            
            comp = Component(
                category_id=cat.id,
                name=item_name,
                description=f"{item_name} option for {opt['name']}.",
                price_modifier=modifier,
                weight=1.0 + (idx * 0.2),
                is_active=True
            )
            db.add(comp)
        
        step += 1
    
    db.commit()
    print("Massive Database seeding completed.")

if __name__ == "__main__":
    db = SessionLocal()
    try:
        seed_data(db)
    finally:
        db.close()
