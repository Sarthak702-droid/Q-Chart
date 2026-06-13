# QChart AI Agency OS Blueprint

## Introduction

Welcome to the QChart AI Agency OS project! This document provides a high-level overview of the project's architecture, services, and technologies. The goal is to help new developers understand the project and get up to speed quickly.

## High-Level Overview

QChart AI Agency OS is a comprehensive platform designed to help agencies manage their operations. It provides a suite of tools for managing clients, projects, and team members. The platform is built with a microservices architecture, with each service responsible for a specific apecific business domain.

## Project Structure

This project is a monorepo containing the following top-level directories:

*   `apps`: Contains the user-facing applications, including the main web application (`web`).
*   `packages`: Contains shared code and libraries used across multiple services and applications.
*   `services`: Contains the backend microservices that power the platform.
*   `supabase`: Contains the Supabase database schema and migrations.

## Microservices

The backend is composed of the following microservices located in the `services` directory:

*   `analytics`: Handles user analytics and reporting.
*   `conversations`: Manages real-time chat and messaging features.
*   `gateway`: The main entry point for all API requests. It handles authentication, routing, and rate limiting.
*   `reports`: Generates and manages reports.
*   `sync`: Keeps data synchronized across different services.

## Technologies

*   **Frontend:**
    *   [Next.js](https://nextjs.org/): A React framework for building server-rendered and statically generated web applications.
    *   [Tailwind CSS](https://tailwindcss.com/): A utility-first CSS framework for rapid UI development.
*   **Backend:**
    *   [Node.js](https://nodejs.org/): A JavaScript runtime for building scalable network applications.
    *   [Express](https://expressjs.com/): A fast and minimalist web framework for Node.js.
*   **Database:**
    *   [Supabase](https://supabase.io/): An open-source Firebase alternative that provides a PostgreSQL database, authentication, and more.
*   **Monorepo Management:**
    *   [Turborepo](https://turbo.build/repo): A high-performance build system for JavaScript and TypeScript monorepos.
