import type { VercelRequest, VercelResponse } from '@vercel/node';
import { exec } from 'child_process';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'POST') {
    const { command } = req.body;

    if (!command) {
      return res.status(400).json({ error: 'Please provide a command.' });
    }

    // Execute the command
    exec(command, (error, stdout, stderr) => {
      if (error) {
        return res.status(500).json({ error: 'Error executing the command.' });
      }

      return res.json({
        message: 'Command executed successfully.',
        stdout,
        stderr,
      });
    });
  } else {
    // Serve the HTML form for input
    const htmlForm = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>Web CLI</title>
      </head>
      <body>
        <h1>Web CLI</h1>
        <form method="POST">
          <label for="command">Command:</label>
          <input type="text" id="command" name="command" required>
          <button type="submit">Execute</button>
        </form>
      </body>
      </html>
    `;

    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(htmlForm);
  }
}
