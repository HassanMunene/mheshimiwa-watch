import mysql.connector
from mysql.connector import Error
import os
from dotenv import load_dotenv

load_dotenv()

def create_connection():
    try:
        connection = mysql.connector.connect(
            host=os.getenv("DB_HOST"),
            user=os.getenv("DB_USER"),
            password=os.getenv("DB_PASSWORD"),
            database=os.getenv("DB_NAME")
        )
        return connection
    except Error as e:
        print(f"Error connection to mysql. {e}")
        return None
    
def initialize_database():
    connection = create_connection()
    if connection:
        try:
            cursor = connection.cursor()
            
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
            print("Database table initialised successfully")
        except Error as e:
            print(f"Error initializing database: {e}")
        finally:
            connection.close()