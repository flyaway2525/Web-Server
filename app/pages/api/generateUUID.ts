// pages/api/generateUUID.js
import { v4 as uuidv4 } from 'uuid';

export default function handler(req:any, res:any) {
  // GETリクエストのみを許可
  if (req.method === 'GET') {
    const uuid = uuidv4();
    res.status(200).json({ uuid });
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
