import mysql.connector
from mysql.connector import Error
import os
from dotenv import load_dotenv

load_dotenv()

def create_connection(create_db=False):
    try:
        connection = mysql.connector.connect(
            host=os.getenv("DB_HOST"),
            port=int(os.getenv("DB_PORT", 3306)),  # Default to 3306 if not set
            user=os.getenv("DB_USER"),
            password=os.getenv("DB_PASSWORD"),
            database=os.getenv("DB_NAME") if not create_db else None
        )
        return connection
    except Error as e:
        print(f"Error connecting to MySQL: {e}")
        return None
    
def initialize_database():
    # First, try to connect without specifying a database to check if it exists
    connection = create_connection(create_db=True)
    if connection:
        try:
            cursor = connection.cursor()
            
            # Check if database exists, if not create it
            cursor.execute(f"CREATE DATABASE IF NOT EXISTS {os.getenv('DB_NAME')}")
            print(f"Database '{os.getenv('DB_NAME')}' created or already exists")
            
            connection.commit()
            
            # Now connect to the specific database
            connection.database = os.getenv("DB_NAME")
            
            # create a table if it does not already exist.
            # we will have a table for chat sessions
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS chat_sessions (
                    session_id INT AUTO_INCREMENT PRIMARY KEY,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """)
            
            # create a table that will contain chat history that is linked to its session
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS chat_history (
                    chat_id INT AUTO_INCREMENT PRIMARY KEY,
                    session_id INT,
                    question TEXT NOT NULL,
                    answer TEXT NOT NULL,
                    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (session_id) REFERENCES chat_sessions(session_id)
                )
            """)
            
            connection.commit()
            print("Database tables initialized successfully")
        except Error as e:
            print(f"Error initializing database: {e}")
        finally:
            if connection.is_connected():
                cursor.close()
                connection.close()
                
# Initialize the database when this module is imported
initialize_database()