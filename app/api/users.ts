import { NextApiRequest, NextApiResponse } from "next";

export default function users(req: NextApiRequest, res: NextApiResponse) {
    const { email, password } = req.body;
    
}