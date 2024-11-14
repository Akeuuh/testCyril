
// src/server.ts
import express, { Request, Response } from 'express';
import cors from 'cors';
import axios, { AxiosError } from 'axios';
import { config } from './config';

import {authMiddleware} from "./middlewares/auth.middleware";
import {ApiResponse, AuthRequest, AuthResponse, Client} from "@/types";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Constants
let authToken: string | null = null;
console.log('AXEL authToken', authToken)
// Define API routes
// 1. Authentication
app.post('/api/auth', async (req: Request<{}, {}, AuthRequest>, res: Response) => {
  console.log("Is res defined and a function:", typeof res.status);
  try {
    const response = await axios.post<ApiResponse<AuthResponse>>(
        `${config.apiBaseUrl}/auth`,
        {
          username: req.body.username,
          password: req.body.password,
          password_type: 0,
          code_application: "webservice_externe",
          code_version: "1"
        },
        {
          headers: {
            'Accept': 'application/api.rest-v1+json',
            'Content-Type': 'application/json'
          }
        }
    );

    if (response.data && response.data.datas && response.data.datas.token) {
      authToken = response.data.datas.token;
      res.json({ success: true, token: authToken });
    } else {
      console.log("AXEL", res.status)
      res.status(401).json({ success: false, message: 'Invalid authentication response' });
    }
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error('Authentication error:', axiosError.response?.data || axiosError.message);
    res.status(401).json({
      success: false,
      message: 'Authentication failed',
      error: axiosError.response?.data || axiosError.message
    });
  }
});

// 2. Get all clients with optional filters
interface ClientQueryParams {
  nom?: string;
  ville?: string;
  sort?: string;
  fields?: string;
  limit?: string;
}

app.get('/api/clients', authMiddleware(), async (req: Request<{}, {}, {}, ClientQueryParams>, res: Response) => {
  try {
    const { nom, ville, sort, fields, limit } = req.query;
    const params: ClientQueryParams = {};

    if (nom) params.nom = nom;
    if (ville) params.ville = ville;
    if (sort) params.sort = sort;
    if (fields) params.fields = fields;
    if (limit) params.limit = limit;

    const response = await axios.get<ApiResponse<Client[]>>(
        `${config.apiBaseUrl}/clients`,
        {
          headers: {
            'Accept': 'application/api.rest-v1+json',
            'Authorization': `Basic ${Buffer.from(`:${req.token}`).toString('base64')}`
          },
          params
        }
    );

    res.json(response.data);
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error('Error fetching clients:', axiosError.response?.data || axiosError.message);
    res.status(500).json({
      success: false,
      message: 'Error fetching clients',
      error: axiosError.response?.data || axiosError.message
    });
  }
});

// 3. Get single client
app.get('/api/clients/:id', authMiddleware(), async (req: Request<{ id: string }>, res: Response) => {
  try {
    const response = await axios.get<ApiResponse<Client>>(
        `${config.apiBaseUrl}/clients/${req.params.id}`,
        {
          headers: {
            'Accept': 'application/api.rest-v1+json',
            'Authorization': `Basic ${Buffer.from(`:${req.token}`).toString('base64')}`
          }
        }
    );

    res.json(response.data);
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error('Error fetching client:', axiosError.response?.data || axiosError.message);
    res.status(axiosError.response?.status || 500).json({
      success: false,
      message: 'Error fetching client',
      error: axiosError.response?.data || axiosError.message
    });
  }
});

// 4. Update client
type UpdateClientRequest = Partial<Omit<Client, 'id' | 'date_creation'>>;

app.put('/api/clients/:id', authMiddleware(), async (req: Request<{ id: string }, {}, UpdateClientRequest>, res: Response) => {
  try {
    const {
      nom,
      email,
      tel,
      adresse,
      code_postal,
      ville
    } = req.body;

    const updateData: UpdateClientRequest = {};
    if (nom !== undefined) updateData.nom = nom;
    if (email !== undefined) updateData.email = email;
    if (tel !== undefined) updateData.tel = tel;
    if (adresse !== undefined) updateData.adresse = adresse;
    if (code_postal !== undefined) updateData.code_postal = code_postal;
    if (ville !== undefined) updateData.ville = ville;

    const response = await axios.put<ApiResponse<Client>>(
        `${config.apiBaseUrl}/clients/${req.params.id}`,
        updateData,
        {
          headers: {
            'Accept': 'application/api.rest-v1+json',
            'Content-Type': 'application/json',
            'Authorization': `Basic ${Buffer.from(`:${req.token}`).toString('base64')}`
          }
        }
    );

    res.json(response.data);
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error('Error updating client:', axiosError.response?.data || axiosError.message);
    res.status(axiosError.response?.status || 500).json({
      success: false,
      message: 'Error updating client',
      error: axiosError.response?.data || axiosError.message
    });
  }
});

// Error handling middleware
app.use((err: Error, _: Request, res: Response) => {
  console.error('Global error handler:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: config.nodeEnv === 'development' ? err.message : undefined
  });
});

// Start server
app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});

// Error handling for unhandled rejections and exceptions
process.on('unhandledRejection', (err: Error) => {
  console.error('Unhandled rejection:', err);
});

process.on('uncaughtException', (err: Error) => {
  console.error('Uncaught exception:', err);
  process.exit(1);
});