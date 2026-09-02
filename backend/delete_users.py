import sqlite3

def clean_database():
    # Connect to the database
    conn = sqlite3.connect('bathycat.db')
    c = conn.cursor()
    
    try:
        # 1. Get IDs of all users who are not Admin or Dealer
        c.execute("SELECT id FROM users WHERE role NOT IN ('Admin', 'Dealer')")
        user_ids = [str(row[0]) for row in c.fetchall()]
        
        if not user_ids:
            print("No regular users found!")
            return

        placeholders = ','.join(user_ids)
        
        # 2. Get the Configuration IDs for these users
        c.execute(f"SELECT id FROM configurations WHERE user_id IN ({placeholders})")
        config_ids = [str(row[0]) for row in c.fetchall()]
        
        if config_ids:
            config_placeholders = ','.join(config_ids)
            # 3. Delete Quotes associated with these Configurations
            c.execute(f"DELETE FROM quotes WHERE configuration_id IN ({config_placeholders})")
            
            # 4. Delete the Configurations
            c.execute(f"DELETE FROM configurations WHERE id IN ({config_placeholders})")
            
        # 5. Finally, delete the Users
        c.execute(f"DELETE FROM users WHERE id IN ({placeholders})")
        print(f"Successfully deleted {c.rowcount} users!")
        
        conn.commit()
    except Exception as e:
        print("Error:", e)
        conn.rollback()
    finally:
        conn.close()

clean_database()
