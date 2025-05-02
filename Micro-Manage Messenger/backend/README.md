# Micro-Manage Messenger: LAN & Cloud Edition

## Overview
A secure, real-time instant messenger for web and mobile, supporting both cloud and LAN-only (in-office) deployments. Features include:
- Real-time chat (Socket.IO)
- Media/image/file sharing
- Group and 1:1 chat
- Emojis, reactions, typing/read indicators
- End-to-end encryption (AES-256)
- JWT authentication
- Modern UI (glassmorphism, dark mode)
- LAN mode: No internet required, local uploads, local MongoDB

## Quick Start (LAN Mode)
1. Copy `.env.example` to `.env` and set your LAN IP/keys.
2. Run `docker-compose up` (or start MongoDB and `npm install && npm run start` in `backend/`).
3. Connect web/mobile clients to `http://<your-lan-ip>:5000`.

## LAN Features
- All data/media stays in your office network
- No paid services, no cloud
- Local uploads in `/backend/uploads`
- Easy to deploy on any Windows/Linux PC

## Cloud Features
- Swap to S3/cloud DB in `.env` for global access
- HTTPS/SSL, backups, and scaling

---
For full documentation, see `/docs` or contact your IT admin.
