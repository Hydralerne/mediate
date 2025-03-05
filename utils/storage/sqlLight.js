import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('myDatabase.db');

export const initDatabase = () => {
    db.transaction((tx) => {
        tx.executeSql(
            `CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT NOT NULL UNIQUE,
                age INTEGER
            );`,
            [],
            () => console.log('Database initialized'),
            (_, error) => console.error('Error initializing database:', error)
        );
    });
};

// Insert data into the database
export const insertData = (name, email, age) => {
    db.transaction((tx) => {
        tx.executeSql(
            'INSERT INTO users (name, email, age) VALUES (?, ?, ?);',
            [name, email, age],
            (_, result) => console.log('Data inserted successfully:', result),
            (_, error) => console.error('Error inserting data:', error)
        );
    });
};

// Retrieve all data from the database
export const getAllData = (callback) => {
    db.transaction((tx) => {
        tx.executeSql(
            'SELECT * FROM users;',
            [],
            (_, { rows }) => callback(rows._array),
            (_, error) => console.error('Error retrieving data:', error)
        );
    });
};

// Update data in the database
export const updateData = (id, name, email, age) => {
    db.transaction((tx) => {
        tx.executeSql(
            'UPDATE users SET name = ?, email = ?, age = ? WHERE id = ?;',
            [name, email, age, id],
            (_, result) => console.log('Data updated successfully:', result),
            (_, error) => console.error('Error updating data:', error)
        );
    });
};

// Delete data from the database
export const deleteData = (id) => {
    db.transaction((tx) => {
        tx.executeSql(
            'DELETE FROM users WHERE id = ?;',
            [id],
            (_, result) => console.log('Data deleted successfully:', result),
            (_, error) => console.error('Error deleting data:', error)
        );
    });
};

// Clear the entire database
export const clearDatabase = () => {
    db.transaction((tx) => {
        tx.executeSql(
            'DROP TABLE IF EXISTS users;',
            [],
            () => console.log('Database cleared successfully'),
            (_, error) => console.error('Error clearing database:', error)
        );
    });
};