// auth-manager.js
import app from '../config/config.js';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import fs from 'fs';
import path from 'path';
import os from 'os';
import chalk from 'chalk';

const CONFIG_DIR = path.join(os.homedir(), '.devsnap');
const AUTH_FILE = path.join(CONFIG_DIR, 'auth.json');

// Ensure config directory exists
if (!fs.existsSync(CONFIG_DIR)) {
  fs.mkdirSync(CONFIG_DIR, { recursive: true });
}

export class AuthManager {
  constructor() {
    this.app = app;
    this.auth = getAuth(this.app);
    this.currentUser = null;
  }

  // Save auth data to file
  async saveAuthData(user) {
    const authData = {
      uid: user.uid,
      email: user.email,
      refreshToken: user.stsTokenManager.refreshToken,
      accessToken: user.stsTokenManager.accessToken,
      expirationTime: Date.now() + 7 * 24 * 60 * 60 * 1000,
    };

    try {
      fs.writeFileSync(AUTH_FILE, JSON.stringify(authData, null, 2));
    } catch (error) {
      console.error(chalk.red('Failed to save auth data:', error.message));
    }
  }

  // Load auth data from file
  loadAuthData() {
    let authData = null;
    try {
      if (fs.existsSync(AUTH_FILE)) {
        authData = JSON.parse(fs.readFileSync(AUTH_FILE, 'utf8'));
      }
    } catch (error) {
      console.error(chalk.red('Failed to load auth data:', error.message));
    }
    return authData;
  }

  // Check if token is expired
  isTokenExpired(authData) {
    if (!authData?.expirationTime) return true;
    // Add some buffer time (5 minutes)
    return Date.now() >= authData.expirationTime - 300000;
  }

  // Get current user with auto-refresh
  async getCurrentUser() {
    console.log(this.auth.currentUser);
    if (this.currentUser) {
      return this.currentUser;
    }

    const authData = this.loadAuthData();
    console.log(authData);
    if (!authData) {
      console.log(chalk.yellow('No cached credentials found. Please login using `devsnap login`'));
      return null;
    }

    if (this.isTokenExpired(authData)) {
      console.log(chalk.yellow('Session expired. Please login again.'));
      this.clearAuthData();
      return null;
    }

    return authData;
  }

  // Clear auth data
  clearAuthData() {
    try {
      if (fs.existsSync(AUTH_FILE)) {
        fs.unlinkSync(AUTH_FILE);
      }
      this.currentUser = null;
    } catch (error) {
      console.error(chalk.red('Failed to clear auth data:', error.message));
    }
  }

  // Login and cache credentials
  async login(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(
        this.auth,
        email,
        password
      );
      this.currentUser = userCredential.user;
      await this.saveAuthData(userCredential.user);
      return userCredential.user;
    } catch (error) {
      console.error(chalk.red('Login failed:', error.message));
      return null;
    }
  }

  // Logout
  async logout() {
    try {
      await this.auth.signOut();
      this.clearAuthData();
      console.log(chalk.green('Logged out successfully'));
    } catch (error) {
      console.error(chalk.red('Logout failed:', error.message));
    }
  }
}