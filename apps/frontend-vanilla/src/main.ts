import './style.css';
import { PollApp } from './poll-app.ts';

declare global {
  interface Window {
    pollApp: PollApp;
  }
}

window.pollApp = new PollApp();
